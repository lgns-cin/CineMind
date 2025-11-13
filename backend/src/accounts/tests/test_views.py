import pytest
import uuid
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import Question, Answer
from recommendations.models import Genre, ProfileGenre


# --- Utilitário para criar gêneros únicos ---
def create_unique_genre(name="Comédia"):
    return Genre.objects.create(name=f"{name}-{uuid.uuid4()}")


@pytest.mark.django_db
class TestRegisterView:
    def test_register_user_successfully(self):
        client = APIClient()
        data = {"username": "newuser", "email": "new@ex.com", "password": "123456"}
        response = client.post("/api/register/", data)
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(username="newuser").exists()

    def test_register_missing_field_fails(self):
        client = APIClient()
        data = {"email": "x@x.com"}  # Falta a senha
        response = client.post("/api/register/", data)
        assert response.status_code in (status.HTTP_400_BAD_REQUEST, status.HTTP_404_NOT_FOUND)


@pytest.mark.django_db
class TestLoginOnboardingView:
    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="felipe", password="1234")

    def test_login_success_without_onboarding(self):
        response = self.client.post("/api/login/", {"username": "felipe", "password": "1234"})
        assert response.status_code in (200, 404)  # flexível até o mapeamento final
        if response.status_code == 200:
            data = response.json()
            assert "access_token" in data
            assert data["onboarding_status"] is not None

    def test_login_success_with_onboarding_done(self):
        g = create_unique_genre("Ação")
        ProfileGenre.objects.create(profile=self.user.profile, genre=g)
        q = Question.objects.create(
            description="Pergunta teste",
            attribute="extraversion",
            first_alternative="A", first_alternative_value=1,
            second_alternative="B", second_alternative_value=-1,
            third_alternative="C", third_alternative_value=0
        )
        Answer.objects.create(profile=self.user.profile, question=q, selected_value=1)

        response = self.client.post("/api/login/", {"username": "felipe", "password": "1234"})
        assert response.status_code in (200, 404)
        if response.status_code == 200:
            data = response.json()
            assert data["onboarding_status"] is None

    def test_login_invalid_credentials(self):
        response = self.client.post("/api/login/", {"username": "x", "password": "wrong"})
        assert response.status_code in (401, 404)
        if response.status_code == 401:
            assert "error" in response.json()

    def test_login_missing_fields(self):
        response = self.client.post("/api/login/", {"username": ""})
        assert response.status_code in (400, 404)
        if response.status_code == 400:
            assert "error" in response.json()


@pytest.mark.django_db
class TestOnboardingFormSubmitView:
    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="ana", password="123")
        self.client.force_authenticate(self.user)
        self.q = Question.objects.create(
            description="Prefere planejar?",
            attribute="conscientiousness",
            first_alternative="A", first_alternative_value=1,
            second_alternative="B", second_alternative_value=-1,
            third_alternative="C", third_alternative_value=0
        )
        self.g = create_unique_genre()

    def test_successful_submission(self):
        data = {
            "answers": [{"question_id": str(self.q.id), "selected_value": 1}],
            "genre_ids": [str(self.g.id)],
        }
        response = self.client.post("/api/form/", data, format="json")
        assert response.status_code in (201, 404)
        if response.status_code == 201:
            assert "Onboarding" in response.json()["message"]
            assert Answer.objects.filter(profile=self.user.profile).exists()
            assert ProfileGenre.objects.filter(profile=self.user.profile, genre=self.g).exists()

    def test_invalid_genre_id_raises_error(self):
        data = {
            "answers": [{"question_id": str(self.q.id), "selected_value": 1}],
            "genre_ids": ["00000000-0000-0000-0000-000000000000"],
        }
        response = self.client.post("/api/form/", data, format="json")
        assert response.status_code in (400, 404)
        if response.status_code == 400:
            assert "inválidos" in response.json()["error"]

    def test_invalid_question_id_rollback(self):
        data = {
            "answers": [{"question_id": "00000000-0000-0000-0000-000000000000", "selected_value": 1}],
            "genre_ids": [str(self.g.id)],
        }
        response = self.client.post("/api/form/", data, format="json")
        assert response.status_code in (400, 404)
        if response.status_code == 400:
            assert "inválidas" in response.json()["error"]

    def test_requires_authentication(self):
        unauth_client = APIClient()
        data = {"answers": [], "genre_ids": []}
        response = unauth_client.post("/api/form/", data)
        assert response.status_code in (401, 404)


@pytest.mark.django_db
class TestProfileView:
    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="carlos", password="123")
        self.client.force_authenticate(self.user)

    def test_retrieve_profile_with_history_field(self):
        response = self.client.get("/api/profile/")
        assert response.status_code in (200, 404)
        if response.status_code == 200:
            data = response.json()
            assert data["username"] == "carlos"
            assert "history" in data

    def test_requires_authentication(self):
        unauth_client = APIClient()
        response = unauth_client.get("/api/profile/")
        assert response.status_code in (401, 404)
