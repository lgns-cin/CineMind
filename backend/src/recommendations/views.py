# backend/src/recommendations/views.py

from django.db import transaction
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings # Importa as configurações do Django

# Modelos
from .models import (
    Genre, RecommendationSet, ProfileGenre, Mood
)
# Serializers
from .serializers import (
    GenreSerializer, RecommendationSetSerializer, ProfileGenreSerializer,
    SetFavoriteGenresSerializer, GenerateMoodRecommendationsSerializer, 
    RecommendationItemSerializer, MoodSerializer
)
# Serviços (Camada de Negócio e Clientes)
from .services import RecommendationService
from integrations.tmdb import TMDbService
from integrations.llm_service import AbstractLLMService
from integrations.gemini.service import GeminiService
from integrations.openai.service import OpenAIService


# --- Mapeamento de Provedores de IA ---
# Isso permite que o settings.py controle qual classe será instanciada
LLM_PROVIDERS = {
    'gemini': GeminiService,
    'openai': OpenAIService,
}

# --- Views de Catálogo (List) ---

class GenreListView(generics.ListAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [permissions.IsAuthenticated]

class MoodListView(generics.ListAPIView):
    queryset = Mood.objects.all()
    serializer_class = MoodSerializer
    permission_classes = [permissions.IsAuthenticated]

# --- Views de Configuração do Perfil ---

class SetFavoriteGenresView(views.APIView):
    # (Esta view é simples, não precisa de um service layer)
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SetFavoriteGenresSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        genre_ids = serializer.validated_data['genre_ids']
        profile = request.user.profile

        valid_genres = Genre.objects.filter(id__in=genre_ids)
        if len(valid_genres) != len(genre_ids):
            return Response({"error": "Um ou mais IDs de gênero são inválidos."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                ProfileGenre.objects.filter(profile=profile).delete()
                profile_genres_to_create = [
                    ProfileGenre(profile=profile, genre=genre) for genre in valid_genres
                ]
                ProfileGenre.objects.bulk_create(profile_genres_to_create)
        except Exception as e:
            print(f"Erro ao salvar gêneros favoritos: {e}")
            return Response({"error": "Ocorreu um erro ao salvar suas preferências."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        response_serializer = ProfileGenreSerializer(ProfileGenre.objects.filter(profile=profile), many=True)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

class CheckFavoriteGenresView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        has_genres = ProfileGenre.objects.filter(profile=request.user.profile).exists()
        return Response({"has_genres": has_genres}, status=status.HTTP_200_OK)

# --- Views do Fluxo de Recomendação ---

class ActiveRecommendationSetView(generics.RetrieveAPIView):
    serializer_class = RecommendationSetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return RecommendationSet.objects.prefetch_related('items').filter(user=self.request.user, is_active=True).last()

class CreateRecommendationSetView(generics.CreateAPIView):
    serializer_class = RecommendationSetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        RecommendationSet.objects.filter(user=user, is_active=True).update(is_active=False)
        serializer.save(user=user, is_active=True)

class GenerateMoodRecommendationsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # --- Injeção de Dependência (DI) ---
        
        # 1. Instancia o cliente TMDb (dependência)
        tmdb_service = TMDbService()
        
        # 2. Decide qual LLM usar com base no settings.py
        provider_key = settings.ACTIVE_LLM_PROVIDER
        llm_service_class = LLM_PROVIDERS.get(provider_key)
        
        if not llm_service_class:
            raise ImportError(f"Provedor de LLM '{provider_key}' não encontrado.")
            
        llm_service: AbstractLLMService = llm_service_class()

        # 3. Injeta as dependências no serviço de negócio
        self.recommendation_service = RecommendationService(
            llm_service=llm_service,
            tmdb_service=tmdb_service
        )

    @extend_schema(
        request=GenerateMoodRecommendationsSerializer,
        responses={201: RecommendationItemSerializer(many=True)},
        description="Gera 3 recomendações para o humor fornecido e as anexa ao set de recomendação especificado."
    )
    def post(self, request, set_id, *args, **kwargs):
        serializer = GenerateMoodRecommendationsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            # A view apenas orquestra a chamada para o serviço
            created_items = self.recommendation_service.generate_for_mood(
                user=request.user,
                set_id=set_id,
                mood_id=serializer.validated_data['mood_id']
            )
            
            response_serializer = RecommendationItemSerializer(created_items, many=True)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except ValueError as e:
            # Erros de validação de negócio (404 ou 400)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except RuntimeError as e:
            # Erros de runtime (APIs externas, etc.) (500 ou 503)
            return Response({"error": str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        except NotImplementedError as e:
            # Erro específico se o 'openai' for ativado sem implementação
            print(f"Erro de Implementação: {e}")
            return Response({"error": f"O provedor de IA configurado não está implementado. {e}"}, status=status.HTTP_501_NOT_IMPLEMENTED)

        except Exception as e:
            print(f"Erro inesperado na GenerateMoodRecommendationsView: {e}")
            return Response({"error": "Ocorreu um erro inesperado ao gerar recomendações."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)