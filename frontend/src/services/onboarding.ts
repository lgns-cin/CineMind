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
