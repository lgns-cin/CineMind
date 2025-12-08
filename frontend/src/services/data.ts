export interface Mood {
  id: string;
  name: string;
}

export interface Recommendation {
  id: string;
  title: string;
  rank: number;
  thumbnail_url: string | null;
  mood: Mood;
  synopsis: string;
  movie_metadata: string;
}

// Tipagem do item de histórico vindo de /api/profile/
export interface HistoryItem {
  id: string;
  title: string;
  external_id: string;
  shown_at: string;
  mood_name: string; // O serializer manda como 'mood_name'
  thumbnail_url: string | null;
}

// Tipagem da resposta completa do perfil
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  history: HistoryItem[];
}
