import pytest
import uuid
from django.contrib.auth.models import User
from accounts.models import Question, Answer
from accounts.serializers import (
    UserSerializer, QuestionSerializer, AnswerSerializer,
    OnboardingFormSerializer, ProfileSerializer
)
from recommendations.models import ShownHistory, Mood, RecommendationItem, RecommendationSet


@pytest.mark.django_db
class TestUserSerializer:
    def test_create_user_successfully(self):
        data = {
            "username": "felipe",
            "email": "felipe@example.com",
            "password": "123456"
        }
        serializer = UserSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

        user = serializer.save()
        assert user.username == "felipe"
        assert user.email == "felipe@example.com"
        assert user.check_password("123456")

    def test_missing_email_field_raises_error(self):
        data = {"username": "user", "password": "123456"}
        serializer = UserSerializer(data=data)
        assert not serializer.is_valid()
        assert "email" in serializer.errors


@pytest.mark.django_db
class TestQuestionSerializer:
    def test_serializes_question_fields(self):
        question = Question.objects.create(
            description="Prefere planejar ou improvisar?",
            attribute="conscientiousness",
            first_alternative="Planejar",
            first_alternative_value=1,
            second_alternative="Improvisar",
            second_alternative_value=-1,
            third_alternative="Depende da situação",
            third_alternative_value=0
        )

        serializer = QuestionSerializer(question)
        data = serializer.data
        assert data["description"].startswith("Prefere")
        assert data["attribute"] == "conscientiousness"
        assert "first_alternative" in data


@pytest.mark.django_db
class TestAnswerSerializer:
    def test_valid_answer_serialization(self):
        user = User.objects.create_user(username="ana", password="123")
        profile = user.profile

        q = Question.objects.create(
            description="Você gosta de festas?",
            attribute="extraversion",
            first_alternative="Sim",
            first_alternative_value=1,
            second_alternative="Não",
            second_alternative_value=-1,
            third_alternative="Às vezes",
            third_alternative_value=0
        )

        data = {"question_id": str(q.id), "selected_value": 1}
        serializer = AnswerSerializer(data=data)
        assert serializer.is_valid(), serializer.errors
        result = serializer.validated_data
        assert result["question_id"] == q.id
        assert result["selected_value"] == 1

    def test_missing_fields_causes_error(self):
        serializer = AnswerSerializer(data={})
        assert not serializer.is_valid()
        assert "question_id" in serializer.errors
        assert "selected_value" in serializer.errors


@pytest.mark.django_db
class TestOnboardingFormSerializer:
    def test_valid_form_submission(self):
        answers = [
            {"question_id": uuid.uuid4(), "selected_value": 1},
            {"question_id": uuid.uuid4(), "selected_value": -1},
        ]
        data = {"answers": answers, "genre_ids": [uuid.uuid4()]}
        serializer = OnboardingFormSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

    def test_empty_genre_list_is_invalid(self):
        data = {"answers": [], "genre_ids": []}
        serializer = OnboardingFormSerializer(data=data)
        assert not serializer.is_valid()
        assert "genre_ids" in serializer.errors


@pytest.mark.django_db
class TestProfileSerializer:
    def test_serializes_user_with_history(self):
        user = User.objects.create_user(username="joao", password="123", email="joao@ex.com")
        profile = user.profile
        mood = Mood.objects.create(name="Feliz")
        rec_set = RecommendationSet.objects.create(user=user, is_active=True)
        item = RecommendationItem.objects.create(
            recommendation_set=rec_set,
            mood=mood,
            external_id="tmdb:1",
            title="Interestelar",
            rank=1,
            thumbnail_url="https://image.tmdb.org/interestelar.jpg",
            movie_metadata="{}"
        )
        ShownHistory.objects.create(
            user=user,
            mood=mood,
            title="Interestelar",
            external_id="tmdb:1",
            recommendation_item=item,
            context="{}"
        )

        serializer = ProfileSerializer(user)
        data = serializer.data
        assert data["username"] == "joao"
        assert "history" in data
        assert isinstance(data["history"], list)
        assert data["history"][0]["title"] == "Interestelar"
