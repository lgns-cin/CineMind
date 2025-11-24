import api from "./api";

// --- Interfaces ---

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

interface LoginResponse {
  access_token: string;
  onboarding_status: {
    questions: Question[];
    genres: Genre[];
  } | null;
}

// --- Funções de API Reais ---

/**
 * Faz um login "em segundo plano" para obter o token e os dados iniciais.
 * Útil para desenvolvimento isolado da tela de onboarding.
 */
export const devLoginAndFetchData = async (username: string, password: string) => {
  try {
    // 1. Faz o POST no endpoint de login
    const response = await api.post<LoginResponse>("api/login/", {
      username,
      password
    });

    const { access_token, onboarding_status } = response.data;

    // 2. Salva o token para as requisições futuras (como o submit)
    localStorage.setItem("token", access_token);

    // 3. Retorna os dados de perguntas e gêneros
    if (!onboarding_status) {
      throw new Error("Este usuário já completou o onboarding! Crie um novo usuário no backend para testar.");
    }

    return {
      questions: onboarding_status.questions,
      genres: onboarding_status.genres
    };

  } catch (error) {
    console.error("Erro no DevLogin:", error);
    throw error;
  }
};

// Envia o formulário para o backend real
export const submitOnboardingForm = async (payload: OnboardingPayload) => {
  // O token será injetado automaticamente pelo interceptor do api.ts
  const response = await api.post("/api/form/", payload);
  return response.data;
};