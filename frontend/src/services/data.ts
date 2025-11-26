export interface Mood {
  id: string;
  name: string;
}

export interface Recommendation {
  id: string;
  title: string;
  rank: number;
  thumbnail_url: null;
  mood: Mood;
  synopsis: string;
  movie_metadata: string;
}
