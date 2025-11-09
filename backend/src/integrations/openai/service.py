# backend/src/integrations/openai/service.py

from typing import Optional
from integrations.llm_service import AbstractLLMService, LLMInput, LLMOutput
# from .client import OpenAIClient # (Você precisará criar este cliente)

class OpenAIService(AbstractLLMService):
    """
    Implementação do adaptador de LLM para o serviço da OpenAI (ChatGPT).
    
    [STUB] - Esta classe precisa ser implementada.
    """
    
    def __init__(self):
        # self.client = OpenAIClient()
        print("AVISO: OpenAIService (ChatGPT) foi instanciado, mas não está implementado.")
        pass

    def get_recommendations(self, user_data: LLMInput) -> Optional[LLMOutput]:
        """
        [STUB] - Implementar a lógica de chamada ao ChatGPT aqui.
        
        1. Construir o prompt para o ChatGPT.
        2. Chamar self.client.generate_json_response(...)
        3. Converter a resposta JSON do ChatGPT para o formato LLMOutput.
        """
        
        # Exemplo de como seria a implementação (descomente quando estiver pronto)
        # prompt = self._build_user_prompt(user_data)
        # system_prompt = self._build_system_instruction()
        # raw_response = self.client.generate_json_response(prompt, system_prompt)
        # if not raw_response:
        #     return None
        # return LLMOutput(**raw_response)
        
        raise NotImplementedError("OpenAIService (ChatGPT) não está implementado.")

    def _build_user_prompt(self, user_data: LLMInput) -> str:
        # [STUB] - Crie o prompt específico para o ChatGPT aqui
        return f"Gere recomendações para: {user_data.target_mood}"
    
    def _build_system_instruction(self) -> str:
        # [STUB] - Crie as instruções de sistema para o ChatGPT aqui
        return "Você é um recomendador de filmes..."