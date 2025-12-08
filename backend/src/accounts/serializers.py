# accounts/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Question, Answer
# Importa o serializer de histórico do outro app
from recommendations.serializers import ShownHistorySerializer

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo User. Usado no registro (POST /api/register/).
    """
    email = serializers.EmailField(required=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # --- ALTERAÇÃO AQUI ---
        # A linha que forçava o username a ser igual ao email foi removida.
        # validated_data['username'] = validated_data['email']
        user = User.objects.create_user(**validated_data)
        return user

class QuestionSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Question.
    """
    class Meta:
        model = Question
        fields = '__all__'

class AnswerSerializer(serializers.ModelSerializer):
    """
    Serializer para uma única resposta dentro do formulário de onboarding.
    """
    question_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Answer
        fields = ['question_id', 'selected_value']

# --- NOVOS SERIALIZERS CONSOLIDADOS ---

class OnboardingFormSerializer(serializers.Serializer):
    """
    Serializer para o endpoint 'POST /api/form/'.
    Valida a submissão completa do formulário de onboarding.
    """
    answers = AnswerSerializer(many=True)
    genre_ids = serializers.ListField(
        child=serializers.UUIDField(),
        allow_empty=False
    )

class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer para o endpoint 'GET /api/profile/'.
    """
    history = ShownHistorySerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'history']