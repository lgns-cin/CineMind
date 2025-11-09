# backend/src/accounts/views.py

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db import transaction

from rest_framework import generics, permissions, views, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

# Modelos
from .models import Question, Answer
from recommendations.models import Genre, ProfileGenre # Importa de 'recommendations'

# Serializers
from .serializers import (
    UserSerializer, QuestionSerializer, OnboardingFormSerializer, ProfileSerializer
)
from recommendations.serializers import GenreSerializer # Importa de 'recommendations'

# Serviços
from .services import AccountService

# --- VIEW PARA: POST /api/register/ ---

class RegisterView(generics.CreateAPIView):
    """
    Cria um novo usuário.
    Substitui: POST /api/accounts/register/
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# --- VIEW PARA: POST /api/login/ ---

class LoginOnboardingView(views.APIView):
    """
    Endpoint complexo de login e onboarding.
    Autentica, retorna token e verifica se o onboarding é necessário,
    retornando as perguntas e gêneros se for.
    
    Substitui:
    - POST /api/accounts/token/
    - GET /api/accounts/questions/
    - GET /api/accounts/answers/check/
    - GET /api/recommendations/genres/
    - GET /api/recommendations/genres/check-favorites/
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        # --- ALTERAÇÃO AQUI (1/3) ---
        # Trocado 'email' por 'username'
        username = request.data.get('username')
        password = request.data.get('password')
        
        # --- ALTERAÇÃO AQUI (2/3) ---
        # Atualizada a validação e a mensagem de erro
        if not username or not password:
            return Response({"error": "Username e senha são obrigatórios"}, status=status.HTTP_400_BAD_REQUEST)
        
        # --- ALTERAÇÃO AQUI (3/3) ---
        # Trocado 'email' por 'username' na função 'authenticate'
        user = authenticate(request, username=username, password=password)
        
        if user is None:
            return Response({"error": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Gerar token
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        # Checagem de Onboarding
        profile = user.profile
        # Usamos 'profile.id' para otimizar a consulta
        has_answers = Answer.objects.filter(profile_id=profile.id).exists()
        has_genres = ProfileGenre.objects.filter(profile_id=profile.id).exists()
        
        # --- ESTA É A MUDANÇA QUE VOCÊ PEDIU ---
        onboarding_status = None  # 1. Inicializa como None
        
        if not (has_answers and has_genres): # 2. Verifica se o onboarding NÃO foi feito
            # Se o onboarding não foi feito, busca os dados necessários
            questions = Question.objects.all()
            genres = Genre.objects.all()
            # 3. Preenche o dicionário apenas com 'questions' e 'genres'
            onboarding_status = {
                'questions': QuestionSerializer(questions, many=True).data,
                'genres': GenreSerializer(genres, many=True).data,
            }
        # --- FIM DA MUDANÇA ---

        return Response({
            'access_token': access_token,
            'onboarding_status': onboarding_status
        }, status=status.HTTP_200_OK)

# --- VIEW PARA: POST /api/form/ ---

class OnboardingFormSubmitView(views.APIView):
    """
    Recebe a submissão do formulário de onboarding (respostas + gêneros).
    
    Substitui:
    - POST /api/accounts/answers/submit/
    - POST /api/recommendations/genres/set-favorites/
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OnboardingFormSerializer
    
    def __init__(self, **kwargs):
        self.account_service = AccountService()
        super().__init__(**kwargs)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        profile = request.user.profile
        answers_data = serializer.validated_data['answers']
        genre_ids = serializer.validated_data['genre_ids']

        try:
            with transaction.atomic():
                # 1. Processar e salvar as Respostas (lógica do AccountService)
                # O 'submit_personality_answers' salva as 'Answer' e calcula os scores
                self.account_service.submit_personality_answers(
                    profile=profile,
                    answers_data=answers_data
                )
                
                # 2. Processar e salvar os Gêneros (lógica da antiga SetFavoriteGenresView)
                valid_genres = Genre.objects.filter(id__in=genre_ids)
                if len(valid_genres) != len(genre_ids):
                    raise ValueError("Um ou mais IDs de gênero são inválidos.")
                
                ProfileGenre.objects.filter(profile=profile).delete()
                profile_genres_to_create = [
                    ProfileGenre(profile=profile, genre=genre) for genre in valid_genres
                ]
                ProfileGenre.objects.bulk_create(profile_genres_to_create)
            
            return Response(
                {"message": "Onboarding completado com sucesso!"}, 
                status=status.HTTP_201_CREATED
            )

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Erro inesperado na OnboardingFormSubmitView: {e}")
            return Response({"error": "Ocorreu um erro inesperado."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- VIEW PARA: GET /api/profile/ ---

class ProfileView(generics.RetrieveAPIView):
    """
    Endpoint novo. Retorna os dados do perfil do usuário,
    incluindo seu histórico de recomendações.
    """
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # O serializer espera um objeto User
        # O 'related_name' da 'ShownHistory' é 'history',
        # então o serializer 'ProfileSerializer' consegue acessá-lo.
        return self.request.user