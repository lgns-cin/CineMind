import api from "./api";

// --- Interfaces (Tipagem) ---

export interface Question {
  id: string;
  description: string;
  attribute: string;
  first_alternative: string;
  first_alternative_value: number;
  second_alternative: string;
  second_alternative_value: number;
  third_alternative: string;
  third_alternative_value: number;
}

export interface Genre {
  id: string;
  name: string;
}

export interface AnswerSubmission {
  question_id: string;
  selected_value: number;
}

export interface OnboardingPayload {
  answers: AnswerSubmission[];
  genre_ids: string[];
}

// --- Funções de API ---

// Busca todas as perguntas (GET /api/accounts/questions/)
export const fetchQuestions = async (): Promise<Question[]> => {
  const response = await api.get("/api/accounts/questions/");
  return response.data;
};

// Busca todos os gêneros (GET /api/recommendations/genres/)
export const fetchGenres = async (): Promise<Genre[]> => {
  const response = await api.get("/api/recommendations/genres/");
  return response.data;
};

// Envia o formulário completo (POST /api/form/)
export const submitOnboardingForm = async (payload: OnboardingPayload) => {
  const response = await api.post("/api/form/", payload);
  return response.data;
};