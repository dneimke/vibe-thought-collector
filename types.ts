export interface Thought {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export interface SynthesisResult {
  summary: string;
  sourceIds: string[];
}

export interface DailySummary {
  theme: string;
  summary: string;
}

export interface FavoriteSummary extends DailySummary {
  id: string;
  favoritedAt: string;
}
