import pytest
import uuid
from unittest.mock import patch, MagicMock
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from recommendations.models import Mood, RecommendationSet, ShownHistory, RecommendationItem


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticated_user(api_client):
    user = User.objects.create_user(username="tester", password="123")
    api_client.force_authenticate(user=user)
    return user, api_client


@pytest.mark.django_db
class TestMoodListView:
    def test_returns_all_moods(self, authenticated_user):
        user, client = authenticated_user
        # 🔹 Limpa moods que possam existir por fixtures ou migrações
        Mood.objects.all().delete()
        Mood.objects.create(name="Feliz")
        Mood.objects.create(name="Triste")

        url = reverse("mood-list")
        response = client.get(url)
        data = response.json()

        assert response.status_code == status.HTTP_200_OK
        assert len(data) == 2
        assert any(m["name"] == "Feliz" for m in data)


@pytest.mark.django_db
@patch("recommendations.views.TMDbService")  # 🔹 Mocka TMDb para ignorar TMDB_API_KEY
@patch("recommendations.views.RecommendationService")  # 🔹 Mocka o serviço de IA
class TestGenerateRecommendationView:
    @pytest.fixture(autouse=True)
    def setup(self, authenticated_user):
        self.user, self.client = authenticated_user
        self.mood = Mood.objects.create(name="Alegre")

    def mock_service(self, movies_count=3):
        """Cria mock de RecommendationService.generate_for_mood com objetos reais no DB."""
        rec_set = RecommendationSet.objects.create(user=self.user, is_active=True)
        fake_items = []
        for i in range(movies_count):
            item = RecommendationItem.objects.create(
                title=f"Filme {i+1}",
                external_id=f"tmdb:filme-{i+1}",
                rank=i + 1,
                mood=self.mood,
                thumbnail_url=f"http://image/{i+1}.jpg",
                movie_metadata="{}",
                recommendation_set=rec_set,
            )
            fake_items.append(item)
        mock = MagicMock()
        mock.generate_for_mood.return_value = fake_items
        return mock

    def test_successful_generation_creates_history_and_returns_items(self, mock_service_class, mock_tmdb):
        mock_tmdb.return_value = MagicMock()
        mock_service_instance = self.mock_service()
        mock_service_class.return_value = mock_service_instance

        url = reverse("generate-recommendations")
        response = self.client.post(url, {"mood_id": str(self.mood.id)}, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert len(data) == 3
        assert ShownHistory.objects.count() == 3
        mock_service_instance.generate_for_mood.assert_called_once()

    def test_handles_invalid_mood(self, mock_service_class, mock_tmdb):
        mock_tmdb.return_value = MagicMock()
        mock_service_instance = self.mock_service()
        mock_service_instance.generate_for_mood.side_effect = ValueError("Mood inválido.")
        mock_service_class.return_value = mock_service_instance

        url = reverse("generate-recommendations")
        response = self.client.post(url, {"mood_id": str(uuid.uuid4())}, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "error" in response.json()

    def test_handles_runtime_error_from_service(self, mock_service_class, mock_tmdb):
        mock_tmdb.return_value = MagicMock()
        mock_service_instance = self.mock_service()
        mock_service_instance.generate_for_mood.side_effect = RuntimeError("Falha IA")
        mock_service_class.return_value = mock_service_instance

        url = reverse("generate-recommendations")
        response = self.client.post(url, {"mood_id": str(self.mood.id)}, format="json")

        assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
        assert "error" in response.json()

    def test_handles_empty_recommendations(self, mock_service_class, mock_tmdb):
        mock_tmdb.return_value = MagicMock()
        mock_service_instance = self.mock_service(movies_count=0)
        mock_service_class.return_value = mock_service_instance

        url = reverse("generate-recommendations")
        response = self.client.post(url, {"mood_id": str(self.mood.id)}, format="json")

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "error" in response.json()

    def test_requires_authentication(self, mock_service_class, mock_tmdb):
        """
        Garante que usuários não autenticados não consigam acessar o endpoint.
        """
        mock_tmdb.return_value = MagicMock()
        mock_service_class.return_value = self.mock_service()

        client = APIClient()  # novo client, sem autenticação
        mood = Mood.objects.create(name="Neutro")

        url = reverse("generate-recommendations")
        response = client.post(url, {"mood_id": str(mood.id)}, format="json")

        # DRF retorna 401 (sem token) ou 403 (token inválido)
        assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]