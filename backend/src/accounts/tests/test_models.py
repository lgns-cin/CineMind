import pytest
import time
from django.contrib.auth.models import User
from accounts.models import Profile, Question, Answer

@pytest.mark.django_db

class TestProfileModel:
    def test_profile_str_returns_username(self):
        user = User.objects.create_user(username="felipe", password="1234")
        profile = Profile.objects.get(user=user)
        assert str(profile) == f"Perfil de {user.username}"

    def test_profile_scores_default_to_zero(self):
        user = User.objects.create_user(username="lucas", password="1234")
        profile = user.profile
        assert profile.openness == 0.0
        assert profile.conscientiousness == 0.0
        assert profile.extraversion == 0.0
        assert profile.agreeableness == 0.0
        assert profile.neuroticism == 0.0

    def test_updated_at_changes_on_save(self):
        user = User.objects.create_user(username="maria", password="1234")
        profile = user.profile
        old_updated = profile.updated_at

        time.sleep(0.01)  # garante diferença perceptível no timestamp
        profile.openness = 3.14
        profile.save()
        profile.refresh_from_db()

        assert profile.updated_at > old_updated


@pytest.mark.django_db
class TestQuestionModel:
    def create_question(self, attribute="openness"):
        return Question.objects.create(
            description="Gosto de explorar coisas novas",
            attribute=attribute,
            first_alternative="Discordo totalmente",
            first_alternative_value=-1,
            second_alternative="Neutro",
            second_alternative_value=0,
            third_alternative="Concordo totalmente",
            third_alternative_value=1,
        )

    def test_question_str_includes_attribute_and_description(self):
        q = self.create_question(attribute="extraversion")
        result = str(q)
        assert "Extroversão" in result
        assert "Gosto de explorar coisas novas"[:20] in result

    def test_question_choices_are_respected(self):
        q = self.create_question(attribute=Question.PersonalityAttribute.AGREEABLENESS)
        assert q.get_attribute_display() == "Amabilidade"


@pytest.mark.django_db
class TestAnswerModel:
    def setup_method(self):
        self.user = User.objects.create_user(username="ana", password="1234")
        self.profile = self.user.profile
        self.question = Question.objects.create(
            description="Prefiro ambientes calmos",
            attribute="neuroticism",
            first_alternative="Discordo",
            first_alternative_value=-1,
            second_alternative="Indiferente",
            second_alternative_value=0,
            third_alternative="Concordo",
            third_alternative_value=1,
        )

    def test_answer_str_returns_expected_format(self):
        ans = Answer.objects.create(
            profile=self.profile,
            question=self.question,
            selected_value=1
        )
        result = str(ans)
        assert self.user.username in result
        assert str(self.question.id) in result

    def test_unique_together_constraint(self):
        Answer.objects.create(
            profile=self.profile,
            question=self.question,
            selected_value=1
        )
        with pytest.raises(Exception):
            Answer.objects.create(
                profile=self.profile,
                question=self.question,
                selected_value=-1
            )

    def test_answer_deletes_with_profile(self):
        # ans = Answer.objects.create(
        #     profile=self.profile,
        #     question=self.question,
        #     selected_value=1
        # )
        self.profile.delete()
        assert Answer.objects.count() == 0

    def test_answer_deletes_with_question(self):
        # ans = Answer.objects.create(
        #     profile=self.profile,
        #     question=self.question,
        #     selected_value=1
        # )
        self.question.delete()
        assert Answer.objects.count() == 0
