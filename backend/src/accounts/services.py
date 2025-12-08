# backend/src/accounts/services.py

from django.db import transaction
from django.contrib.auth.models import User
from .models import Profile, Question, Answer
from typing import List, Dict, Any
import uuid # Importa a biblioteca uuid

class AccountService:
    """
    Encapsula a lógica de negócio para a gestão de contas e perfis.
    """

    def submit_personality_answers(self, profile: Profile, answers_data: List[Dict[str, Any]]) -> Dict[str, float]:
        """
        Processa as respostas do questionário, calcula os scores do Big Five
        e salva no perfil do usuário.
        
        --- CORRIGIDO ---
        Esta função agora espera a estrutura 'flat' vinda do AnswerSerializer:
        [ {'question_id': <UUID>, 'selected_value': 1}, ... ]
        """
        
        # 1. Validar as questões
        # --- CORREÇÃO ---: Acessa 'question_id' diretamente.
        question_ids = [answer['question_id'] for answer in answers_data]
        
        questions = Question.objects.filter(id__in=question_ids)

        # Criamos o mapa de busca (isto estava correto)
        questions_map_uuid_keys = {q.id: q for q in questions}

        if len(questions_map_uuid_keys) != len(answers_data):
            raise ValueError("Uma ou mais questões enviadas são inválidas.")

        # 2. Calcular os scores
        scores = {
            'openness': 0.0, 'conscientiousness': 0.0, 'extraversion': 0.0,
            'agreeableness': 0.0, 'neuroticism': 0.0,
        }

        for answer in answers_data:
            # --- CORREÇÃO ---: Acessa 'question_id' diretamente.
            question_id_uuid = answer['question_id']
            
            # Buscamos o objeto Question
            question = questions_map_uuid_keys[question_id_uuid] 
            scores[question.attribute] += answer['selected_value']

        # 3. Salvar no banco de dados (Transacional)
        try:
            with transaction.atomic():
                for answer_data in answers_data:
                    # --- CORREÇÃO ---: Acessa 'question_id' diretamente.
                    question_id_uuid = answer_data['question_id']
                    
                    # Buscamos o objeto Question novamente
                    question_object = questions_map_uuid_keys[question_id_uuid] 

                    Answer.objects.update_or_create(
                        profile=profile,
                        question=question_object, # Passamos o objeto Question
                        defaults={'selected_value': answer_data['selected_value']}
                    )

                # Salva os scores no perfil
                profile.openness = scores['openness']
                profile.conscientiousness = scores['conscientiousness']
                profile.extraversion = scores['extraversion']
                profile.agreeableness = scores['agreeableness']
                profile.neuroticism = scores['neuroticism']
                profile.save()

        except Exception as e:
            # --- MELHORIA ---: Propaga o erro real para o log
            print(f"Erro ao salvar respostas e perfil: {e}")
            raise RuntimeError(f"Ocorreu um erro ao processar suas respostas. Erro: {e}")

        return scores