# backend/src/recommendations/services.py

import json
from concurrent.futures import ThreadPoolExecutor
from typing import List
from django.contrib.auth.models import User

# Modelos
from .models import (
    RecommendationSet, ProfileGenre, Mood, RecommendationItem, BlacklistedMovie
)
# Serviços de Integração (Abstração e Cliente)
from integrations.llm_service import AbstractLLMService, LLMInput, LLMBlacklistedMovie
from integrations.tmdb import TMDbService

class RecommendationService:
    """
    Encapsula a lógica de negócio para gerar recomendações.
    Recebe suas dependências (LLM e TMDb) por injeção.
    """
    
    def __init__(self, llm_service: AbstractLLMService, tmdb_service: TMDbService):
        self.llm_service = llm_service
        self.tmdb_service = tmdb_service

    def generate_for_mood(self, user: User, set_id: int, mood_id: int) -> List[RecommendationItem]:
        """
        Orquestra a geração de recomendações para um humor específico.
        """
        
        # 1. Validar Entidades
        try:
            recommendation_set = RecommendationSet.objects.get(id=set_id, user=user, is_active=True)
            mood = Mood.objects.get(id=mood_id)
        except RecommendationSet.DoesNotExist:
            raise ValueError("Conjunto de recomendações inválido ou inativo.")
        except Mood.DoesNotExist:
            raise ValueError("Mood inválido.")

        # 2. Coletar dados do Perfil
        profile = user.profile
        favorite_genres = [pg.genre.name for pg in ProfileGenre.objects.filter(profile=profile)]
        if not favorite_genres:
            raise ValueError("Gêneros favoritos não definidos.")

        personality_scores = {
            "openness": profile.openness, "conscientiousness": profile.conscientiousness,
            "extraversion": profile.extraversion, "agreeableness": profile.agreeableness,
            "neuroticism": profile.neuroticism,
        }
        
        blacklist_movies = BlacklistedMovie.objects.filter(user=user)
        blacklist_input = [LLMBlacklistedMovie(title=movie.title) for movie in blacklist_movies]

        # 3. Preparar Input Abstrato para o LLM
        llm_input = LLMInput(
            preferences=favorite_genres,
            score=personality_scores,
            blacklist=blacklist_input,
            target_mood=mood.name
        )

        # 4. Chamar o Serviço de LLM (Injetado)
        try:
            recommendations_output = self.llm_service.get_recommendations(llm_input)
            if not recommendations_output or not recommendations_output.recommendations:
                raise RuntimeError("Não foi possível gerar recomendações no momento (resposta vazia da IA).")
        except Exception as e:
            print(f"Erro ao chamar o serviço de LLM: {e}")
            raise RuntimeError(f"Falha na comunicação com o serviço de IA: {e}")

        # 5. Processar Resposta e Enriquecer com TMDb
        try:
            mood_rec = recommendations_output.recommendations[0]
            movies_from_llm = mood_rec.movies
            
            # Otimização: Buscar pôsteres em paralelo
            with ThreadPoolExecutor(max_workers=len(movies_from_llm)) as executor:
                poster_urls = list(executor.map(
                    lambda movie: self.tmdb_service.get_poster_url(title=movie.title, year=movie.year),
                    movies_from_llm
                ))

            # 6. Salvar no Banco
            items_to_create = []
            for i, movie in enumerate(movies_from_llm):
                items_to_create.append(
                    RecommendationItem(
                        recommendation_set=recommendation_set,
                        mood=mood,
                        external_id=f"tmdb:{movie.title}-{movie.year}",
                        title=movie.title,
                        rank=movie.rank,
                        thumbnail_url=poster_urls[i], # URL enriquecida
                        movie_metadata=json.dumps(movie.model_dump())
                    )
                )
            
            if items_to_create:
                created_items = RecommendationItem.objects.bulk_create(items_to_create)
                return created_items
            else:
                return []

        except (IndexError, KeyError) as e:
            print(f"Erro de parsing na resposta do LLM: {e}")
            raise RuntimeError("A resposta do serviço de IA foi malformada.")
        except Exception as e:
            print(f"Erro ao processar e salvar recomendações: {e}")
            raise RuntimeError("Ocorreu um erro ao salvar as recomendações.")