import pytest
import uuid
import json
from unittest.mock import MagicMock
from django.contrib.auth.models import User
from accounts.models import Profile
from recommendations.models import (
    RecommendationSet, ProfileGenre, Mood, RecommendationItem, Genre
)
from recommendations.services import RecommendationService


@pytest.mark.django_db(transaction=True)
class TestRecommendationService:
    def setup_method(self, method):
        """Configura ambiente de teste isolado."""
        self.user = User.objects.create_user(username=f"user-{uuid.uuid4()}", password="123")
        self.profile, _ = Profile.objects.get_or_create(user=self.user)
        self.profile.openness = 0.8
        self.profile.conscientiousness = 0.7
        self.profile.extraversion = 0.6
        self.profile.agreeableness = 0.5
        self.profile.neuroticism = 0.4
        self.profile.save()

        self.mood = Mood.objects.create(name=f"Tranquilo-{uuid.uuid4()}")
        self.rec_set = RecommendationSet.objects.create(user=self.user, is_active=True)

        genre = Genre.objects.create(name="Drama")
        ProfileGenre.objects.create(profile=self.profile, genre=genre)

        # mocks
        self.llm_mock = MagicMock()
        self.tmdb_mock = MagicMock()
        self.service = RecommendationService(self.llm_mock, self.tmdb_mock)

    def test_generate_for_mood_creates_recommendation_items(self):
        movie_mock = MagicMock()
        movie_mock.title = "Filme A"
        movie_mock.year = 2020
        movie_mock.rank = 1
        movie_mock.model_dump.return_value = {"title": "Filme A", "year": 2020, "rank": 1}
        mood_block_mock = MagicMock(movies=[movie_mock])
        self.llm_mock.get_recommendations.return_value = MagicMock(recommendations=[mood_block_mock])
        self.tmdb_mock.get_poster_url.return_value = "http://poster.url"

        items = self.service.generate_for_mood(
            user=self.user,
            set_id=self.rec_set.id,
            mood_id=self.mood.id
        )
        assert len(items) == 1
        assert items[0].title == "Filme A"

    def test_generate_for_mood_handles_invalid_set(self):
        """Erro se RecommendationSet for inválido."""
        with pytest.raises(ValueError, match="Conjunto de recomendações inválido"):
            self.service.generate_for_mood(
                user=self.user,
                set_id=9999,
                mood_id=self.mood.id
            )

    def test_generate_for_mood_handles_invalid_mood(self):
        """Erro se Mood não existir."""
        with pytest.raises(ValueError, match="Mood inválido"):
            self.service.generate_for_mood(
                user=self.user,
                set_id=self.rec_set.id,
                mood_id=uuid.uuid4()
            )

    def test_generate_for_mood_requires_genres(self):
        """Erro se usuário não tiver gêneros favoritos."""
        ProfileGenre.objects.all().delete()
        with pytest.raises(ValueError, match="Gêneros favoritos não definidos"):
            self.service.generate_for_mood(
                user=self.user,
                set_id=self.rec_set.id,
                mood_id=self.mood.id
            )

    def test_generate_for_mood_handles_empty_llm_response(self):
        """Erro se LLM retornar lista vazia."""
        self.llm_mock.get_recommendations.return_value = MagicMock(recommendations=[])
        with pytest.raises(RuntimeError, match="resposta vazia da IA"):
            self.service.generate_for_mood(
                user=self.user,
                set_id=self.rec_set.id,
                mood_id=self.mood.id
            )

    def test_generate_for_mood_handles_malformed_llm_response(self):
        """Erro se LLM retornar formato inesperado (sem campo movies)."""
        self.llm_mock.get_recommendations.return_value = MagicMock(recommendations=[{}])

        with pytest.raises(RuntimeError, match="salvar"):
            self.service.generate_for_mood(
                user=self.user,
                set_id=self.rec_set.id,
                mood_id=self.mood.id
            )
    def test_generate_for_mood_handles_tmdb_errors_gracefully(self):
        """Erro genérico se TMDb falhar."""
        movie_mock = MagicMock(title="Filme B", year=2019, rank=1)
        mood_block_mock = MagicMock(movies=[movie_mock])
        self.llm_mock.get_recommendations.return_value = MagicMock(recommendations=[mood_block_mock])
        self.tmdb_mock.get_poster_url.side_effect = Exception("Erro no TMDb")

        with pytest.raises(RuntimeError, match="erro ao salvar"):
            self.service.generate_for_mood(
                user=self.user,
                set_id=self.rec_set.id,
                mood_id=self.mood.id
            )
