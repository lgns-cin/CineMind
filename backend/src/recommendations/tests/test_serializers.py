import pytest
import json
import uuid
from django.contrib.auth.models import User
from accounts.models import Profile
from recommendations.models import Mood, Genre, RecommendationItem, ShownHistory, RecommendationSet
from recommendations.serializers import (
    GenreSerializer, RecommendationItemSerializer,
    ShownHistorySerializer, RecommendationRequestSerializer
)


@pytest.mark.django_db(transaction=True)
class TestGenreSerializer:
    def test_genre_serialization_and_creation(self):
        genre = Genre.objects.create(name=f"Comédia-{uuid.uuid4()}")
        data = GenreSerializer(genre).data
        assert data["name"].startswith("Comédia-")

        serializer = GenreSerializer(data={"name": f"Terror-{uuid.uuid4()}"})
        assert serializer.is_valid()
        obj = serializer.save()
        assert "Terror" in obj.name


@pytest.mark.django_db(transaction=True)
class TestRecommendationItemSerializer:
    def setup_method(self, method):
        # Cria user e obtém ou reutiliza Profile existente
        self.user = User.objects.create_user(username=f"tester-{uuid.uuid4()}", password="123")
        self.profile, _ = Profile.objects.get_or_create(user=self.user)
        self.mood = Mood.objects.create(name=f"Triste-{uuid.uuid4()}")
        # ✅ Substituído profile → user
        self.rec_set = RecommendationSet.objects.create(user=self.user)

    def test_synopsis_extraction_valid_json(self):
        metadata = json.dumps({"synopsis": "Um filme emocionante."})
        item = RecommendationItem.objects.create(
            recommendation_set=self.rec_set,
            mood=self.mood,
            external_id="123",
            title="O Pianista",
            rank=1,
            movie_metadata=metadata
        )
        data = RecommendationItemSerializer(item).data
        assert data["synopsis"] == "Um filme emocionante."

    def test_synopsis_handles_invalid_json(self):
        item = RecommendationItem.objects.create(
            recommendation_set=self.rec_set,
            mood=self.mood,
            external_id="123",
            title="Bugado",
            rank=1,
            movie_metadata="{invalid json}"
        )
        data = RecommendationItemSerializer(item).data
        assert data["synopsis"] == ""


@pytest.mark.django_db(transaction=True)
class TestShownHistorySerializer:
    def test_history_serialization(self):
        user = User.objects.create_user(username=f"user-{uuid.uuid4()}", password="123")
        profile, _ = Profile.objects.get_or_create(user=user)
        mood = Mood.objects.create(name=f"Empolgado-{uuid.uuid4()}")
        # ✅ Substituído profile → user
        rec_set = RecommendationSet.objects.create(user=user)
        item = RecommendationItem.objects.create(
            recommendation_set=rec_set,
            mood=mood,
            external_id="abc",
            title="Matrix",
            rank=1,
            movie_metadata="{}"
        )
        history = ShownHistory.objects.create(
            user_id=user.id,
            recommendation_item=item,
            external_id="abc",
            title="Matrix",
            mood=mood
        )
        data = ShownHistorySerializer(history).data
        assert data["title"] == "Matrix"
        assert "mood_name" in data
        assert "thumbnail_url" in data


@pytest.mark.django_db(transaction=True)
class TestRecommendationRequestSerializer:
    def test_accepts_valid_uuid(self):
        uid = uuid.uuid4()
        serializer = RecommendationRequestSerializer(data={"mood_id": str(uid)})
        assert serializer.is_valid()

    def test_rejects_invalid_uuid(self):
        serializer = RecommendationRequestSerializer(data={"mood_id": "not-a-uuid"})
        assert not serializer.is_valid()
        assert "mood_id" in serializer.errors
