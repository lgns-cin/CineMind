# backend/src/accounts/tests/test_services.py

import pytest
from accounts.models import Question, Profile, Answer
from accounts.services import AccountService
from django.db import IntegrityError


def create_question(attribute: str) -> Question:
    """
    Cria uma questão válida para os testes,
    com todos os campos obrigatórios do modelo Question.
    """
    return Question.objects.create(
        description=f"Pergunta sobre {attribute}",
        attribute=attribute,
        first_alternative_value=-1.0,
        second_alternative_value=0.0,
        third_alternative_value=1.0,
    )


@pytest.mark.django_db
class TestAccountService:
    def setup_method(self):
        self.service = AccountService()

    def test_submit_personality_answers_success(self, django_user_model):
        """
         Deve salvar respostas e atualizar corretamente os scores do perfil.
        """
        user = django_user_model.objects.create_user(username="testuser", password="1234")
        profile = user.profile

        q1 = create_question("extraversion")
        q2 = create_question("openness")

        answers_data = [
            {"question_id": q1.id, "selected_value": 1.0},
            {"question_id": q2.id, "selected_value": -0.5},
        ]

        scores = self.service.submit_personality_answers(profile, answers_data)

        # Verifica se os objetos foram criados
        assert Answer.objects.count() == 2
        profile.refresh_from_db()

        # Verifica os scores salvos
        assert profile.extraversion == pytest.approx(1.0)
        assert profile.openness == pytest.approx(-0.5)
        assert scores["extraversion"] == pytest.approx(1.0)
        assert scores["openness"] == pytest.approx(-0.5)

    def test_submit_personality_answers_invalid_question(self, django_user_model):
        """
         Deve lançar ValueError se uma das questões for inválida.
        """
        user = django_user_model.objects.create_user(username="testuser", password="1234")
        profile = user.profile

        valid_q = create_question("agreeableness")

        answers_data = [
            {"question_id": valid_q.id, "selected_value": 1.0},
            {"question_id": "00000000-0000-0000-0000-000000000000", "selected_value": 0.5},
        ]

        with pytest.raises(ValueError, match="Uma ou mais questões enviadas são inválidas"):
            self.service.submit_personality_answers(profile, answers_data)

        assert Answer.objects.count() == 0  # nada deve ter sido salvo

    def test_submit_personality_answers_transaction_rollback(self, django_user_model, monkeypatch):
        """
         Deve lançar RuntimeError e reverter transação em caso de erro no banco.
        """
        user = django_user_model.objects.create_user(username="testuser", password="1234")
        profile = user.profile
        q = create_question("neuroticism")

        answers_data = [{"question_id": q.id, "selected_value": 1.0}]

        # Força erro dentro do bloco atômico
        def mock_update_or_create(*args, **kwargs):
            raise IntegrityError("Erro de simulação no banco")

        monkeypatch.setattr("accounts.models.Answer.objects.update_or_create", mock_update_or_create)

        with pytest.raises(RuntimeError, match="Ocorreu um erro ao processar suas respostas"):
            self.service.submit_personality_answers(profile, answers_data)

        # Garante que nenhum Answer foi persistido
        assert Answer.objects.count() == 0
        profile.refresh_from_db()
        assert profile.neuroticism == 0.0

    def test_submit_personality_answers_updates_existing_answers(self, django_user_model):
        """
         Deve atualizar respostas já existentes em vez de duplicar.
        """
        user = django_user_model.objects.create_user(username="existing", password="1234")
        profile = user.profile
        q = create_question("extraversion")

        # Cria resposta inicial
        Answer.objects.create(profile=profile, question=q, selected_value=0.5)

        answers_data = [{"question_id": q.id, "selected_value": 1.0}]
        scores = self.service.submit_personality_answers(profile, answers_data)

        profile.refresh_from_db()
        updated_answer = Answer.objects.get(profile=profile, question=q)

        assert updated_answer.selected_value == pytest.approx(1.0)
        assert profile.extraversion == pytest.approx(1.0)
        assert scores["extraversion"] == pytest.approx(1.0)

    def test_submit_personality_answers_extreme_values(self, django_user_model):
        """
        Deve lidar corretamente com valores extremos (±1.0).
        """
        user = django_user_model.objects.create_user(username="extreme", password="1234")
        profile = user.profile

        q1 = create_question("openness")
        q2 = create_question("neuroticism")

        answers_data = [
            {"question_id": q1.id, "selected_value": 1.0},
            {"question_id": q2.id, "selected_value": -1.0},
        ]

        scores = self.service.submit_personality_answers(profile, answers_data)

        profile.refresh_from_db()
        assert profile.openness == pytest.approx(1.0)
        assert profile.neuroticism == pytest.approx(-1.0)
        assert scores["openness"] == pytest.approx(1.0)
        assert scores["neuroticism"] == pytest.approx(-1.0)
