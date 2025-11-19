import os
import django
import pytest

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cinemind.settings")
django.setup()

from django.contrib.auth.models import User
from recommendations.models import (
    Genre, ProfileGenre, Mood, SubMood,
    RecommendationSet, RecommendationItem,
    ShownHistory, BlacklistedMovie
)
from accounts.models import Profile

@pytest.mark.django_db
class TestGenre:
    def test_str_method(self):
        # Evita violar a constraint UNIQUE (name)
        genre, _ = Genre.objects.get_or_create(name="Ação")
        assert str(genre) == "Ação"

@pytest.mark.django_db
class TestProfileGenre:
    def test_str_and_uniqueness(self):
        user = User.objects.create_user(username="felipe", password="123")

        # Se o sinal post_save já criou um Profile, só recuperamos
        profile, _ = Profile.objects.get_or_create(user=user)

        genre, _ = Genre.objects.get_or_create(name="Drama")
        profile_genre, _ = ProfileGenre.objects.get_or_create(profile=profile, genre=genre)

        assert str(profile_genre) == f"{profile.user.username} - {genre.name}"

@pytest.mark.django_db
class TestMoodAndSubMood:
    def test_str_mood_and_submood(self):
        mood = Mood.objects.create(name="Feliz")
        sub = SubMood.objects.create(mood=mood, name="Animado")

        assert str(mood) == "Feliz"
        assert str(sub) == "Feliz - Animado"
        assert sub.mood == mood


@pytest.mark.django_db
class TestRecommendationSetAndItem:
    def test_str_and_relations(self):
        user = User.objects.create_user(username="maria", password="abc")
        mood = Mood.objects.create(name="Reflexivo")

        rec_set = RecommendationSet.objects.create(
            user=user,
            input_snapshot='{"generos": ["drama"]}'
        )

        item = RecommendationItem.objects.create(
            recommendation_set=rec_set,
            mood=mood,
            external_id="tt9999",
            title="O Poço",
            rank=1,
            thumbnail_url="https://image.tmdb.org/test.jpg",
            movie_metadata='{"ano": 2019}',
            relevance_score=0.85,
        )

        assert str(rec_set).startswith("Conjunto de Recomendações para maria")
        assert str(item) == "O Poço"
        assert item.recommendation_set == rec_set
        assert item.mood == mood


@pytest.mark.django_db
class TestShownHistory:
    def test_str_method(self):
        user = User.objects.create_user(username="ana", password="abc")
        mood = Mood.objects.create(name="Triste")

        rec_set = RecommendationSet.objects.create(
            user=user, input_snapshot="{}"
        )
        item = RecommendationItem.objects.create(
            recommendation_set=rec_set,
            mood=mood,
            external_id="tt7777",
            title="Blue Valentine",
            rank=1,
            movie_metadata="{}",
        )

        history = ShownHistory.objects.create(
            user=user,
            recommendation_item=item,
            external_id=item.external_id,
            title=item.title,
            mood=mood,
        )

        assert str(history) == "ana viu 'Blue Valentine'"


@pytest.mark.django_db
class TestBlacklistedMovie:
    def test_str_and_uniqueness(self):
        user = User.objects.create_user(username="joao", password="123")

        movie = BlacklistedMovie.objects.create(
            user=user,
            external_id="tt1234",
            title="Titanic",
            reason="Já assistido"
        )
        assert str(movie) == "'Titanic' na lista negra de joao"

        #Garante que não pode criar duplicado
        with pytest.raises(Exception):
            BlacklistedMovie.objects.create(
                user=user,
                external_id="tt1234",
                title="Titanic",
            )
