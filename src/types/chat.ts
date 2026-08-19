export interface Message {
  id: string;
  sender: string;
  timestamp: Date;
  content: string;
  charCount: number;
  wordCount: number;
  emojis: string[];
  isMedia?: boolean;
}

export interface UserStats {
  name: string;
  color: string;
  messageCount: number;
  percentage: number;
  avgCharLength: number;
  avgResponseTimeMin: number;
  startedPercentage: number;
  totalEmojis: number;
  topEmojis: Array<{ emoji: string; count: number }>;
}

export interface DeterministicMetrics {
  totalMessages: number;
  startDate: string;
  endDate: string;
  daysCount: number;
  dailyAverage: number;
  longestSilenceHours: number;
  longestSilenceDates: string;
  mostActiveHour: string;
  mostActiveDay: string;
  mostActiveDate: string;
  timeDistribution: {
    hourly: Array<{ label: string; count: number }>;
    daily: Array<{ label: string; count: number }>;
    monthly: Array<{ label: string; count: number }>;
    timeline: Array<{ label: string; count: number }>;
  };
  users: Record<string, UserStats>;
  allTopEmojis: Array<{ emoji: string; count: number }>;
}

export interface IntenseMessage {
  sender: string;
  time: string;
  text: string;
  intensity: number;
  emotion: string;
}

export interface EmotionCategory {
  category: string;
  count: number;
  color?: string;
  percentage?: number;
}

export interface AISentimentResult {
  overallTone: 'Nötr' | 'Pozitif' | 'Negatif' | 'Romantik' | 'Dramatik';
  dominantEmotion: string;
  happiestDate: string;
  saddestDate: string;
  categoryDistribution: EmotionCategory[];
  emotionalTimeline: Array<{ week: string; score: number; label?: string }>;
  intenseMessages: IntenseMessage[];
  relationshipRoles: {
    romanticScore: { user1: number; user2: number };
    funnyScore: { user1: number; user2: number };
    titles: Record<string, string[]>;
  };
}

export interface FullChatAnalysisData {
  summary: {
    totalMessages: number;
    startDate: string;
    endDate: string;
    daysCount: number;
    dailyAverage: number;
    longestSilenceHours: number;
    longestSilenceDates: string;
    mostActiveHour: string;
    mostActiveDay: string;
    mostActiveDate: string;
  };
  users: {
    user1: UserStats;
    user2: UserStats;
    [key: string]: UserStats;
  };
  timeDistribution: {
    hourly: Array<{ label: string; count: number }>;
    daily: Array<{ label: string; count: number }>;
    monthly: Array<{ label: string; count: number }>;
    timeline: Array<{ label: string; count: number }>;
  };
  allTopEmojis: Array<{ emoji: string; count: number }>;
  sentiment?: AISentimentResult;
}
