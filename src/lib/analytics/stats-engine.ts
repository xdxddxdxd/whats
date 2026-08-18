import { ParsedMessage } from '../parser/whatsapp-parser';

export interface ParticipantStat {
  name: string;
  messageCount: number;
  messagePercentage: number;
  wordCount: number;
  avgWordsPerMessage: number;
  characterCount: number;
  mediaCount: number;
  emojiCount: number;
  topEmojis: { emoji: string; count: number }[];
  nightMessages: number; // 00:00 - 05:00
  nightPercentage: number;
  avgResponseTimeMinutes: number | null;
  monologues: number; // 3+ messages sent in succession
  conversationStarters: number; // Started chat after 3+ hours silence
}

export interface HourlyDistribution {
  hour: number;
  label: string;
  count: number;
  percentage: number;
}

export interface DailyDistribution {
  day: number;
  dayName: string;
  count: number;
  percentage: number;
}

export interface EmojiStat {
  emoji: string;
  count: number;
  percentage: number;
}

export interface ChatMetrics {
  totalMessages: number;
  totalWords: number;
  totalCharacters: number;
  totalMedia: number;
  totalEmojis: number;
  daysSpan: number;
  avgMessagesPerDay: number;
  dateRange: {
    start: string;
    end: string;
  };
  participants: ParticipantStat[];
  hourlyDistribution: HourlyDistribution[];
  dailyDistribution: DailyDistribution[];
  topEmojis: EmojiStat[];
  peakHour: {
    hour: number;
    label: string;
    count: number;
  };
  peakDay: {
    dayName: string;
    count: number;
  };
  busiestDate: {
    date: string;
    count: number;
  };
  calculatedSuperlatives: {
    nightOwl: { name: string; count: number; desc: string };
    earlyBird: { name: string; count: number; desc: string };
    ghost: { name: string; avgMins: number; desc: string };
    speedster: { name: string; avgMins: number; desc: string };
    impatient: { name: string; count: number; desc: string };
    starter: { name: string; count: number; desc: string };
    emojiMonarch: { name: string; count: number; desc: string };
    novelist: { name: string; avgWords: number; desc: string };
    hypeTrain: { name: string; exclamationCount: number; desc: string };
  };
}

// Comprehensive Unicode Emoji regex (including composite, flags, skintones)
const EMOJI_REGEX = new RegExp('(?:\\p{Extended_Pictographic}|\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F)(?:\\u200D(?:\\p{Extended_Pictographic}|\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F))*', 'gu');

const TURKISH_DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

export function calculateChatMetrics(messages: ParsedMessage[]): ChatMetrics {
  if (messages.length === 0) {
    throw new Error('Analiz için en az 1 mesaj gereklidir.');
  }

  const totalMessages = messages.length;
  let totalWords = 0;
  let totalCharacters = 0;
  let totalMedia = 0;
  let totalEmojis = 0;

  const globalEmojiCounts: Record<string, number> = {};
  const hourlyCounts = new Array(24).fill(0);
  const dailyCounts = new Array(7).fill(0);
  const dateCounts: Record<string, number> = {};

  const participantMap: Record<
    string,
    {
      name: string;
      messageCount: number;
      wordCount: number;
      charCount: number;
      mediaCount: number;
      emojiCount: number;
      emojiMap: Record<string, number>;
      nightMessages: number;
      earlyMessages: number; // 05:00 - 09:00
      responseTimes: number[]; // in minutes
      monologues: number;
      conversationStarters: number;
      exclamationCount: number;
    }
  > = {};

  let lastMessageSender: string | null = null;
  let lastMessageTime: Date | null = null;
  let currentStreak = 0;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const sender = msg.sender;
    const msgDate = new Date(msg.timestamp);

    if (!participantMap[sender]) {
      participantMap[sender] = {
        name: sender,
        messageCount: 0,
        wordCount: 0,
        charCount: 0,
        mediaCount: 0,
        emojiCount: 0,
        emojiMap: {},
        nightMessages: 0,
        earlyMessages: 0,
        responseTimes: [],
        monologues: 0,
        conversationStarters: 0,
        exclamationCount: 0
      };
    }

    const p = participantMap[sender];
    p.messageCount++;

    // Media
    if (msg.isMedia) {
      p.mediaCount++;
      totalMedia++;
    }

    // Text content stats
    const text = msg.content || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;

    p.wordCount += words;
    p.charCount += chars;
    totalWords += words;
    totalCharacters += chars;

    // Exclamation / excitement tracker
    const exclamations = (text.match(/!|\?|sjsj|asdf|hah/gi) || []).length;
    p.exclamationCount += exclamations;

    // Emoji extraction
    const foundEmojis = text.match(EMOJI_REGEX) || [];
    for (const emoji of foundEmojis) {
      p.emojiCount++;
      totalEmojis++;
      p.emojiMap[emoji] = (p.emojiMap[emoji] || 0) + 1;
      globalEmojiCounts[emoji] = (globalEmojiCounts[emoji] || 0) + 1;
    }

    // Time & Date stats
    const hour = msgDate.getHours();
    const day = msgDate.getDay();
    const dateStr = msgDate.toISOString().split('T')[0];

    hourlyCounts[hour]++;
    dailyCounts[day]++;
    dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;

    if (hour >= 0 && hour < 5) {
      p.nightMessages++;
    } else if (hour >= 5 && hour < 9) {
      p.earlyMessages++;
    }

    // Monologue and Response time calculation
    if (lastMessageSender && lastMessageTime) {
      const diffMs = msgDate.getTime() - lastMessageTime.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));

      if (lastMessageSender === sender) {
        currentStreak++;
        if (currentStreak === 3) {
          p.monologues++;
        }
      } else {
        currentStreak = 1;
        // Different sender: calculate response time if within reasonable range (e.g. < 24 hours)
        if (diffMins >= 0 && diffMins <= 1440) {
          p.responseTimes.push(diffMins);
        }
      }

      // Conversation starter: silence for 3+ hours (180 mins) before this message
      if (diffMins >= 180) {
        p.conversationStarters++;
      }
    } else {
      p.conversationStarters++;
      currentStreak = 1;
    }

    lastMessageSender = sender;
    lastMessageTime = msgDate;
  }

  // Calculate Date Span
  const firstDate = new Date(messages[0].timestamp);
  const lastDate = new Date(messages[messages.length - 1].timestamp);
  const diffDays = Math.max(1, Math.round((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));
  const avgMessagesPerDay = Math.round((totalMessages / diffDays) * 10) / 10;

  // Compile Participant Stats
  const participantStats: ParticipantStat[] = Object.values(participantMap).map(p => {
    const topEmojis = Object.entries(p.emojiMap)
      .map(([emoji, count]) => ({ emoji, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const avgResponseTimeMinutes =
      p.responseTimes.length > 0
        ? Math.round((p.responseTimes.reduce((a, b) => a + b, 0) / p.responseTimes.length) * 10) / 10
        : null;

    return {
      name: p.name,
      messageCount: p.messageCount,
      messagePercentage: Math.round((p.messageCount / totalMessages) * 1000) / 10,
      wordCount: p.wordCount,
      avgWordsPerMessage: p.messageCount > 0 ? Math.round((p.wordCount / p.messageCount) * 10) / 10 : 0,
      characterCount: p.charCount,
      mediaCount: p.mediaCount,
      emojiCount: p.emojiCount,
      topEmojis,
      nightMessages: p.nightMessages,
      nightPercentage: p.messageCount > 0 ? Math.round((p.nightMessages / p.messageCount) * 1000) / 10 : 0,
      avgResponseTimeMinutes,
      monologues: p.monologues,
      conversationStarters: p.conversationStarters
    };
  }).sort((a, b) => b.messageCount - a.messageCount);

  // Hourly Distribution
  const hourlyDistribution: HourlyDistribution[] = hourlyCounts.map((count, hour) => ({
    hour,
    label: `${hour.toString().padStart(2, '0')}:00`,
    count,
    percentage: Math.round((count / totalMessages) * 1000) / 10
  }));

  // Daily Distribution
  const dailyDistribution: DailyDistribution[] = dailyCounts.map((count, day) => ({
    day,
    dayName: TURKISH_DAYS[day],
    count,
    percentage: Math.round((count / totalMessages) * 1000) / 10
  }));

  // Global Top Emojis
  const topEmojis: EmojiStat[] = Object.entries(globalEmojiCounts)
    .map(([emoji, count]) => ({
      emoji,
      count,
      percentage: totalEmojis > 0 ? Math.round((count / totalEmojis) * 1000) / 10 : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // Peak Hour & Peak Day
  let peakHourIdx = 0;
  for (let h = 1; h < 24; h++) {
    if (hourlyCounts[h] > hourlyCounts[peakHourIdx]) peakHourIdx = h;
  }

  let peakDayIdx = 0;
  for (let d = 1; d < 7; d++) {
    if (dailyCounts[d] > dailyCounts[peakDayIdx]) peakDayIdx = d;
  }

  // Busiest Date
  let busiestDateStr = Object.keys(dateCounts)[0] || '';
  let maxDateCount = 0;
  for (const [d, count] of Object.entries(dateCounts)) {
    if (count > maxDateCount) {
      maxDateCount = count;
      busiestDateStr = d;
    }
  }

  // Superlatives / Personalities rule computations
  const sortedByNight = [...participantStats].sort((a, b) => b.nightMessages - a.nightMessages);
  const sortedByEarly = [...Object.values(participantMap)].sort((a, b) => b.earlyMessages - a.earlyMessages);
  const sortedByAvgWords = [...participantStats].sort((a, b) => b.avgWordsPerMessage - a.avgWordsPerMessage);
  const sortedByMonologues = [...participantStats].sort((a, b) => b.monologues - a.monologues);
  const sortedByStarters = [...participantStats].sort((a, b) => b.conversationStarters - a.conversationStarters);
  const sortedByEmojis = [...participantStats].sort((a, b) => b.emojiCount - a.emojiCount);
  const validResponders = participantStats.filter(p => p.avgResponseTimeMinutes !== null);
  const sortedByFastResponse = [...validResponders].sort((a, b) => (a.avgResponseTimeMinutes || 999) - (b.avgResponseTimeMinutes || 999));
  const sortedBySlowResponse = [...validResponders].sort((a, b) => (b.avgResponseTimeMinutes || 0) - (a.avgResponseTimeMinutes || 0));
  const sortedByExclamation = [...Object.values(participantMap)].sort((a, b) => b.exclamationCount - a.exclamationCount);

  const nightOwlWinner = sortedByNight[0] || participantStats[0];
  const earlyBirdWinner = sortedByEarly[0] || participantStats[0];
  const speedsterWinner = sortedByFastResponse[0] || participantStats[0];
  const ghostWinner = sortedBySlowResponse[0] || participantStats[0];
  const impatientWinner = sortedByMonologues[0] || participantStats[0];
  const starterWinner = sortedByStarters[0] || participantStats[0];
  const emojiMonarchWinner = sortedByEmojis[0] || participantStats[0];
  const novelistWinner = sortedByAvgWords[0] || participantStats[0];
  const hypeTrainWinner = sortedByExclamation[0] || participantStats[0];

  return {
    totalMessages,
    totalWords,
    totalCharacters,
    totalMedia,
    totalEmojis,
    daysSpan: diffDays,
    avgMessagesPerDay,
    dateRange: {
      start: firstDate.toLocaleDateString('tr-TR'),
      end: lastDate.toLocaleDateString('tr-TR')
    },
    participants: participantStats,
    hourlyDistribution,
    dailyDistribution,
    topEmojis,
    peakHour: {
      hour: peakHourIdx,
      label: `${peakHourIdx.toString().padStart(2, '0')}:00 - ${(peakHourIdx + 1).toString().padStart(2, '0')}:00`,
      count: hourlyCounts[peakHourIdx]
    },
    peakDay: {
      dayName: TURKISH_DAYS[peakDayIdx],
      count: dailyCounts[peakDayIdx]
    },
    busiestDate: {
      date: busiestDateStr ? new Date(busiestDateStr).toLocaleDateString('tr-TR') : '-',
      count: maxDateCount
    },
    calculatedSuperlatives: {
      nightOwl: {
        name: nightOwlWinner.name,
        count: nightOwlWinner.nightMessages,
        desc: `Gece 00:00 - 05:00 arasında tam ${nightOwlWinner.nightMessages} mesajla ayaktaydı.`
      },
      earlyBird: {
        name: earlyBirdWinner.name,
        count: earlyBirdWinner.earlyMessages,
        desc: `Sabahın ilk ışıklarında (${earlyBirdWinner.earlyMessages} mesaj) grubu uyandırdı.`
      },
      speedster: {
        name: speedsterWinner.name,
        avgMins: speedsterWinner.avgResponseTimeMinutes || 1,
        desc: `Ortalama ${speedsterWinner.avgResponseTimeMinutes || 1} dakikada jet hızında cevap verdi.`
      },
      ghost: {
        name: ghostWinner.name,
        avgMins: ghostWinner.avgResponseTimeMinutes || 60,
        desc: `Mesajlara ortalama ${ghostWinner.avgResponseTimeMinutes || 60} dakika sonra dönüş yaparak gizemini korudu.`
      },
      impatient: {
        name: impatientWinner.name,
        count: impatientWinner.monologues,
        desc: `Cevap beklemeden art arda mesaj yağdırma rekoru (${impatientWinner.monologues} kez).`
      },
      starter: {
        name: starterWinner.name,
        count: starterWinner.conversationStarters,
        desc: `Sessizliği tam ${starterWinner.conversationStarters} defa bozarak muhabbeti başlattı.`
      },
      emojiMonarch: {
        name: emojiMonarchWinner.name,
        count: emojiMonarchWinner.emojiCount,
        desc: `Toplam ${emojiMonarchWinner.emojiCount} emoji ile duygularını kelimeler yerine sembollerle anlattı.`
      },
      novelist: {
        name: novelistWinner.name,
        avgWords: novelistWinner.avgWordsPerMessage,
        desc: `Mesaj başına ortalama ${novelistWinner.avgWordsPerMessage} kelimeyle adeta mini makaleler yazdı.`
      },
      hypeTrain: {
        name: hypeTrainWinner.name,
        exclamationCount: hypeTrainWinner.exclamationCount,
        desc: `Gruptaki heyecanı ve kahkahayı en çok körükleyen enerji kaynağı.`
      }
    }
  };
}
