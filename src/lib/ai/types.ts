export interface SuperlativeCard {
  id: string;
  title: string;
  winner: string;
  badge: string;
  color: string;
  description: string;
  quote?: string;
  statLabel: string;
  statValue: string;
}

export type WrappedSlideType =
  | 'intro'
  | 'stats_overview'
  | 'superlatives'
  | 'night_vibe'
  | 'emoji_dna'
  | 'ai_narrative'
  | 'oracle'
  | 'outro';

export interface WrappedSlideData {
  id: string;
  type: WrappedSlideType;
  title: string;
  subtitle?: string;
  badge?: string;
  gradient: string;
  narrative: string;
  extraData?: Record<string, any>;
}

export interface AIAnalysisResult {
  summary: string;
  groupVibe: string;
  superlatives: SuperlativeCard[];
  wrappedSlides: WrappedSlideData[];
  generatedAt: string;
  provider: 'gemini' | 'openai' | 'claude' | 'smart_engine';
}
