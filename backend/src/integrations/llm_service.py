# backend/src/integrations/llm_service.py

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

# --- Tipos de Dados Comuns (Abstração) ---
# Estes são os tipos que o *nosso sistema* entende.
# Cada adaptador será responsável por converter estes tipos
# para os formatos específicos do (Gemini, OpenAI, etc.)

class LLMBlacklistedMovie(BaseModel):
    title: str

class LLMInput(BaseModel):
    preferences: List[str]
    score: Dict[str, float]
    blacklist: List[LLMBlacklistedMovie]
    target_mood: str

class LLMMovieOutput(BaseModel):
    rank: int
    title: str
    year: int
    synopsis: str # <--- NOVO CAMPO ADICIONADO
    reason_for_recommendation: str

class LLMMoodRecommendation(BaseModel):
    mood: str
    movies: List[LLMMovieOutput]

class LLMOutput(BaseModel):
    recommendations: List[LLMMoodRecommendation]

# --- Interface (A "Porta") ---

class AbstractLLMService(ABC):
    """
    Define a interface abstrata para um serviço de recomendação de LLM.
    Qualquer provedor (Gemini, OpenAI) deve implementar esta classe.
    """
    
    @abstractmethod
    def get_recommendations(self, user_data: LLMInput) -> Optional[LLMOutput]:
        """
        Gera recomendações de filmes com base no perfil do usuário.
        """
        pass