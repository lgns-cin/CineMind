# backend/src/recommendations/views.py

from django.db import transaction
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from django.conf import settings

# Modelos
from .models import (
    Mood, RecommendationSet, ShownHistory, RecommendationItem
)
# Serializers
from .serializers import (
    MoodSerializer, RecommendationRequestSerializer, RecommendationItemSerializer
)
# Serviços (Camada de Negócio e Clientes)
from .services import RecommendationService
from integrations.tmdb import TMDbService
from integrations.llm_service import AbstractLLMService
from integrations.gemini.service import GeminiService
from integrations.openai.service import OpenAIService

# --- Mapeamento de Provedores de IA ---
LLM_PROVIDERS = {
    'gemini': GeminiService,
    'openai': OpenAIService,
}

# --- VIEW PARA: GET /api/moods/ ---

class MoodListView(generics.ListAPIView):
    """
    Retorna a lista de todos os Moods disponíveis.
    Substitui: GET /api/recommendations/moods/
    """
    queryset = Mood.objects.all()
    serializer_class = MoodSerializer
    permission_classes = [permissions.IsAuthenticated]

# --- VIEW PARA: POST /api/recommendations/ ---

class GenerateRecommendationView(views.APIView):
    """
    Endpoint principal de geração de recomendações.
    Recebe um mood_id, gera 3 filmes, salva no histórico (ShownHistory)
    e retorna os 3 filmes.
    
    Substitui:
    - POST /api/recommendations/sets/
    - POST /api/recommendations/sets/<uuid:set_id>/generate-for-mood/
    - GET /api/recommendations/active-set/
    """
    permission_classes = [permissions.IsAuthenticated]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # --- Injeção de Dependência (DI) ---
        tmdb_service = TMDbService()
        provider_key = settings.ACTIVE_LLM_PROVIDER
        llm_service_class = LLM_PROVIDERS.get(provider_key)
        
        if not llm_service_class:
            raise ImportError(f"Provedor de LLM '{provider_key}' não encontrado.")
            
        llm_service: AbstractLLMService = llm_service_class()

        self.recommendation_service = RecommendationService(
            llm_service=llm_service,
            tmdb_service=tmdb_service
        )

    @extend_schema(
        request=RecommendationRequestSerializer,
        responses={201: RecommendationItemSerializer(many=True)},
        description="Gera 3 recomendações para o humor fornecido, salva no histórico e as retorna."
    )
    def post(self, request, *args, **kwargs):
        serializer = RecommendationRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        mood_id = serializer.validated_data['mood_id']

        try:
            # Lógica de negócio movida da view antiga para esta.
            # 1. Garantir que temos um "Set" ativo para anexar os RecommendationItems
            # Esta lógica substitui o endpoint 'POST /api/recommendations/sets/'
            with transaction.atomic():
                RecommendationSet.objects.filter(user=user, is_active=True).update(is_active=False)
                active_set = RecommendationSet.objects.create(user=user, is_active=True)

            # 2. Chamar o serviço de geração (lógica do endpoint antigo)
            # O serviço cria os 3 'RecommendationItem' e os anexa ao 'active_set'
            created_items = self.recommendation_service.generate_for_mood(
                user=user,
                set_id=active_set.id,
                mood_id=mood_id
            )
            
            if not created_items:
                 return Response(
                     {"error": "Não foi possível gerar recomendações com base no seu perfil."}, 
                     status=status.HTTP_404_NOT_FOUND
                 )

            # 3. CRÍTICO: Criar o 'ShownHistory' para cada item gerado
            # Esta é a nova exigência para o endpoint /api/profile/
            history_entries = []
            for item in created_items:
                history_entries.append(
                    ShownHistory(
                        user=user,
                        mood=item.mood,
                        title=item.title,
                        external_id=item.external_id,
                        recommendation_item=item,
                        context=item.movie_metadata
                    )
                )
            ShownHistory.objects.bulk_create(history_entries)

            # 4. Retornar os filmes gerados
            response_serializer = RecommendationItemSerializer(created_items, many=True)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except RuntimeError as e:
            return Response({"error": str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        except Exception as e:
            print(f"Erro inesperado na GenerateRecommendationView: {e}")
            return Response({"error": "Ocorreu um erro inesperado ao gerar recomendações."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
