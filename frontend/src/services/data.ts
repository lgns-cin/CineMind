// frontend/src/services/data.ts

export interface Mood {
  id: string;
  name: string;
}

export interface Recommendation {
  id: string;
  title: string;
  rank: number;
  thumbnail_url: string | null; // Atualizado para aceitar string
  mood: Mood;
  synopsis: string;
  movie_metadata: string;
}