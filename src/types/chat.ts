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
  singleWordReplyCount?: number;
  singleWordReplyPercent?: number;
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
  timelineHighlights?: TimelineHighlight[];
  chatDictionary?: ChatDictionaryData;
  flagsReport?: FlagsReportData;
  toxicityRadar?: ToxicityRadarData;
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

export interface FlagItem {
  id: string;
  type: 'red' | 'green';
  title: string;
  desc: string;
  count?: number;
  exampleQuote?: string;
  badge: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface FlagsReportData {
  user1Flags: FlagItem[];
  user2Flags: FlagItem[];
  singleWordStats: {
    user1Count: number;
    user2Count: number;
    topWords: Array<{ word: string; count: number; sender: string }>;
  };
}

export interface PassiveAggressivePattern {
  phrase: string;
  sender: string;
  time: string;
  context: string;
  intensity: number;
  tag: string;
}

export interface ToxicityRadarData {
  dramaLevel: 'Düşük (Huzurlu)' | 'Orta (Ara Sıra Gerilim)' | 'Yüksek (Trip Dolu)' | 'Kaotik (Ateş Hattı)';
  tripScore: { user1: number; user2: number };
  detectedPatterns: PassiveAggressivePattern[];
  coldPeriods: Array<{ dates: string; hours: number; triggerMessage?: string }>;
}

export interface IconicWord {
  word: string;
  count: number;
  meaning: string;
  category?: string;
  sender?: string;
}

export interface ChatDictionaryData {
  user1Words: IconicWord[];
  user2Words: IconicWord[];
  sharedSlang: Array<{ phrase: string; count: number; description: string; sampleContext?: string }>;
}

export interface TimelineHighlight {
  id: string;
  date: string;
  title: string;
  emoji: string;
  description: string;
  messageCount: number;
  quote?: string;
  sender?: string;
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
  flagsReport?: FlagsReportData;
  toxicityRadar?: ToxicityRadarData;
  chatDictionary?: ChatDictionaryData;
  timelineHighlights?: TimelineHighlight[];
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
  flagsReport?: FlagsReportData;
  toxicityRadar?: ToxicityRadarData;
  chatDictionary?: ChatDictionaryData;
  timelineHighlights?: TimelineHighlight[];
}

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  factsUsed?: string[];
}
