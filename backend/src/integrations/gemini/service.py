# backend/src/integrations/gemini/service.py

from typing import Optional
from integrations.gemini.client import GeminiClient
from integrations.gemini.types import Input as GeminiInput, Output as GeminiOutput, BlacklistedMovieInput
# Importa a abstração e os tipos comuns
from integrations.llm_service import AbstractLLMService, LLMInput, LLMOutput, LLMMoodRecommendation, LLMMovieOutput

class GeminiService(AbstractLLMService):
    """
    Implementação do adaptador de LLM para o Google Gemini.
    Ele implementa a AbstractLLMService e traduz os tipos
    comuns (LLMInput) para os tipos específicos do Gemini (GeminiInput).
    """
    
    RECOMMENDATION_MODEL = "gemini-2.5-flash" # Atualizado para o 1.5-flash (se preferir)

    def __init__(self):
        self.client = GeminiClient(model=self.RECOMMENDATION_MODEL)

    def _convert_input_to_gemini(self, user_data: LLMInput) -> GeminiInput:
        """ Converte o tipo de entrada abstrato para o tipo do Gemini. """
        return GeminiInput(
            preferences=user_data.preferences,
            score=user_data.score,
            blacklist=[BlacklistedMovieInput(title=movie.title) for movie in user_data.blacklist],
            target_mood=user_data.target_mood
        )

    def _convert_gemini_to_output(self, gemini_output: GeminiOutput) -> LLMOutput:
        """ Converte o tipo de saída do Gemini para o tipo abstrato. """
        return LLMOutput(
            recommendations=[
                LLMMoodRecommendation(
                    mood=rec.mood,
                    movies=[
                        LLMMovieOutput(
                            rank=movie.rank,
                            title=movie.title,
                            year=movie.year,
                            reason_for_recommendation=movie.reason_for_recommendation
                        ) for movie in rec.movies
                    ]
                ) for rec in gemini_output.recommendations
            ]
        )

    def get_recommendations(self, user_data: LLMInput) -> Optional[LLMOutput]:
        """ Implementação da interface abstrata. """
        
        # 1. Converter para o tipo específico do Gemini
        gemini_input = self._convert_input_to_gemini(user_data)

        # 2. Construir prompts específicos do Gemini
        system_instruction = self._build_system_instruction()
        user_prompt = self._build_user_prompt(gemini_input)
        json_schema = GeminiOutput.model_json_schema()

        # 3. Chamar o cliente Gemini
        raw_response = self.client.generate_json_response(
            prompt=user_prompt,
            system_instruction=system_instruction,
            json_schema=json_schema,
        )

        if raw_response is None:
            print("ERRO DE RECOMENDAÇÃO (Gemini): A resposta da API foi nula.")
            return None
        
        if raw_response.get("status") == "error":
            print(f"ERRO DE RECOMENDAÇÃO (Gemini): {raw_response.get('message', 'Erro desconhecido da API')}")
            return None

        try:
            # 4. Validar com o tipo específico do Gemini
            gemini_output = GeminiOutput(**raw_response)
            # 5. Converter para o tipo de saída abstrato
            return self._convert_gemini_to_output(gemini_output)
        
        except Exception as e:
            print(f"ERRO DE VALIDAÇÃO DE SAÍDA (Gemini): O JSON da LLM não se encaixa no modelo Output: {e}")
            print(f"JSON Recebido: {raw_response}")
            return None

    # (Os métodos _build_system_instruction e _build_user_prompt permanecem os mesmos)
    def _build_system_instruction(self) -> str:
        # ... (código original do _build_system_instruction sem alterações) ...
        return (
            "Você é um assistente de recomendação de filmes altamente especializado. "
            "Sua função é analisar o perfil de um usuário e sugerir filmes que se alinhem perfeitamente "
            "com seus gostos e o estado emocional desejado. Sua resposta deve estar EXCLUSIVAMENTE "
            "no formato JSON, aderindo ao esquema fornecido.\n\n"
            "**Guia de Interpretação dos Traços de Personalidade (Big Five/OCEAN):**\n"
            "Para que suas recomendações sejam precisas, você DEVE usar o guia abaixo para entender como cada traço molda as preferências do usuário:\n\n"
            "* **Openness (Abertura a Novas Experiências):**\n"
            "  - **Score Alto**: Curiosidade intelectual, criatividade. Preferem filmes complexos, não convencionais, de arte, ficção científica com grandes conceitos ou documentários que desafiam o pensamento.\n"
            "  - **Score Baixo**: Praticidade, preferência pelo familiar. Preferem filmes com narrativas diretas, gêneros clássicos (ação, comédia romântica) e histórias com as quais podem se identificar facilmente.\n\n"
            "* **Conscientiousness (Conscienciosidade):**\n"
            "  - **Score Alto**: Organização, disciplina. Apreciam filmes com roteiros bem estruturados, narrativas lógicas, dramas históricos precisos ou histórias sobre superação.\n"
            "  - **Score Baixo**: Espontaneidade, flexibilidade. Podem gostar mais de comédias caóticas, filmes de aventura imprevisíveis ou thrillers com muitas reviravoltas.\n\n"
            "* **Extraversion (Extroversão):**\n"
            "  - **Score Alto**: Sociabilidade, busca por estímulos externos. Tendem a gostar de blockbusters, musicais e filmes de ação com alto valor de entretenimento.\n"
            "  - **Score Baixo (Introversão)**: Preferência por introspecção. Costumam preferir dramas focados em personagens, thrillers psicológicos e histórias que convidam à reflexão.\n\n"
            
            "* **Agreeableness (Amabilidade):**\n"
            "  - **Score Alto**: Empatia, compaixão. Sentem-se atraídos por histórias inspiradoras, 'feel-good movies', dramas familiares e comédias românticas.\n"
            "  - **Score Baixo**: Ceticismo, pensamento crítico. Podem preferir anti-heróis, humor ácido, comédia de humor negro ou dramas cínicos.\n\n"
            "* **Neuroticism (Neuroticismo / Instabilidade Emocional):**\n"
            "  - **Score Alto**: Sensibilidade a estresse. Podem usar filmes como catarse (gostando de dramas intensos ou terror) OU para evitar estresse (buscando filmes leves e reconfortantes).\n"
            "  - **Score Baixo (Estabilidade Emocional)**: Calma, resiliência. Geralmente são flexíveis e apreciam uma vasta gama de tons emocionais sem se sentirem sobrecarregados.\n\n"
            "**Regras para Recomendação:**\n"
            "1. **Conexão Emocional**: Cada filme recomendado deve ser um excelente exemplo do sentimento alvo.\n"
            "2. **Afinidade de Gênero**: A seleção deve priorizar os gêneros e temas favoritos do usuário.\n"
            "3. **Coerência com a Personalidade**: A narrativa e o tom do filme devem ressoar com os traços de personalidade fornecidos, usando o guia acima.\n"
            "4. **Evitar Blacklist**: JAMAIS recomende filmes que estão na lista de filmes a evitar.\n"
        )

    def _build_user_prompt(self, user_data: GeminiInput) -> str:
        # ... (código original do _build_user_prompt sem alterações) ...
        personality_scores = "\n".join([f"- {trait}: {score}" for trait, score in user_data.score.items()])
        blacklist_titles = ', '.join([movie.title for movie in user_data.blacklist]) if user_data.blacklist else "Nenhum"

        return (
            "Analise o perfil de usuário a seguir e gere as recomendações de acordo com as regras definidas.\n\n"
            "**Perfil do Usuário:**\n"
            f"- Gêneros/Temas Favoritos: {', '.join(user_data.preferences)}\n"
            f"- Traços de Personalidade (Scores):\n{personality_scores}\n"
            f"- Filmes a Evitar: {blacklist_titles}\n\n"
            "**Sua Tarefa:**\n"
            f"Gere uma lista curada contendo **exatamente 3 recomendações de filmes ranqueados (rank 1, 2, 3)** para o humor específico: **'{user_data.target_mood}'**.\n\n"
            "Para cada filme, forneça uma justificativa clara (reason_for_recommendation) que conecte o filme diretamente ao perfil do usuário (gêneros e personalidade)."
        )