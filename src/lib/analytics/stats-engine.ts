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
  earlyMessages: number; // 05:00 - 09:00
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

export interface SuperlativeItemData {
  name: string;
  count?: number;
  avgMins?: number;
  avgWords?: number;
  exclamationCount?: number;
  desc: string;
  sampleMessages: string[];
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
    nightOwl: SuperlativeItemData;
    earlyBird: SuperlativeItemData;
    ghost: SuperlativeItemData;
    speedster: SuperlativeItemData;
    impatient: SuperlativeItemData;
    starter: SuperlativeItemData;
    emojiMonarch: SuperlativeItemData;
    novelist: SuperlativeItemData;
    hypeTrain: SuperlativeItemData;
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

  // Real message collector buffers for each participant
  const nightMessagesMap: Record<string, string[]> = {};
  const earlyMessagesMap: Record<string, string[]> = {};
  const monologueMessagesMap: Record<string, string[]> = {};
  const startersMessagesMap: Record<string, string[]> = {};
  const longestMessagesMap: Record<string, { text: string; length: number; time: string }[]> = {};
  const emojiMessagesMap: Record<string, string[]> = {};
  const hypeMessagesMap: Record<string, string[]> = {};
  const generalMessagesMap: Record<string, string[]> = {};

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
  let currentStreakMessages: string[] = [];

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
      nightMessagesMap[sender] = [];
      earlyMessagesMap[sender] = [];
      monologueMessagesMap[sender] = [];
      startersMessagesMap[sender] = [];
      longestMessagesMap[sender] = [];
      emojiMessagesMap[sender] = [];
      hypeMessagesMap[sender] = [];
      generalMessagesMap[sender] = [];
    }

    const p = participantMap[sender];
    p.messageCount++;

    // Media
    if (msg.isMedia) {
      p.mediaCount++;
      totalMedia++;
    }

    // Text content stats
    const text = (msg.content || '').trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;

    p.wordCount += words;
    p.charCount += chars;
    totalWords += words;
    totalCharacters += chars;

    const timeStr = `${String(msgDate.getHours()).padStart(2, '0')}:${String(msgDate.getMinutes()).padStart(2, '0')}`;
    const cleanSnippet = text.length > 100 ? text.slice(0, 100) + '...' : text;
    const formattedSnippet = `[${timeStr}] ${cleanSnippet || '<Medya/Görsel>'}`;

    if (generalMessagesMap[sender].length < 15 && text.length > 0) {
      generalMessagesMap[sender].push(formattedSnippet);
    }

    // Exclamation / laugh / excitement tracker
    const hasLaughOrHype = /[!?]|(?:(?:ha){2,})|(?:(?:he){2,})|(?:(?:sj){2,})|[a-zA-ZçğıöşüÇĞİÖŞÜ]{8,}/i.test(text);
    if (hasLaughOrHype) {
      p.exclamationCount++;
      if (hypeMessagesMap[sender].length < 12 && text.length > 0) {
        hypeMessagesMap[sender].push(formattedSnippet);
      }
    }

    // Longest messages
    if (text.length > 15) {
      longestMessagesMap[sender].push({ text: formattedSnippet, length: text.length, time: timeStr });
    }

    // Emoji extraction
    const foundEmojis = text.match(EMOJI_REGEX) || [];
    for (const emoji of foundEmojis) {
      p.emojiCount++;
      totalEmojis++;
      p.emojiMap[emoji] = (p.emojiMap[emoji] || 0) + 1;
      globalEmojiCounts[emoji] = (globalEmojiCounts[emoji] || 0) + 1;
    }

    if (foundEmojis.length >= 2 && emojiMessagesMap[sender].length < 12) {
      emojiMessagesMap[sender].push(formattedSnippet);
    }

    // Local Time & Date stats (avoid UTC off-by-one)
    const hour = msgDate.getHours();
    const day = msgDate.getDay();
    const dateStr = `${msgDate.getFullYear()}-${String(msgDate.getMonth() + 1).padStart(2, '0')}-${String(msgDate.getDate()).padStart(2, '0')}`;

    hourlyCounts[hour]++;
    dailyCounts[day]++;
    dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;

    if (hour >= 0 && hour < 5) {
      p.nightMessages++;
      if (nightMessagesMap[sender].length < 15 && text.length > 0) {
        nightMessagesMap[sender].push(formattedSnippet);
      }
    } else if (hour >= 5 && hour < 9) {
      p.earlyMessages++;
      if (earlyMessagesMap[sender].length < 15 && text.length > 0) {
        earlyMessagesMap[sender].push(formattedSnippet);
      }
    }

    // Monologue and Response time calculation
    if (lastMessageSender && lastMessageTime) {
      const diffMs = msgDate.getTime() - lastMessageTime.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));

      if (lastMessageSender === sender) {
        currentStreak++;
        currentStreakMessages.push(formattedSnippet);
        if (currentStreak === 3) {
          p.monologues++;
          if (monologueMessagesMap[sender].length < 12) {
            monologueMessagesMap[sender].push(...currentStreakMessages);
          }
        }
      } else {
        currentStreak = 1;
        currentStreakMessages = [formattedSnippet];
        // Different sender: calculate response time if within reasonable range (e.g. < 24 hours)
        if (diffMins >= 0 && diffMins <= 1440) {
          p.responseTimes.push(diffMins);
        }
      }

      // Conversation starter: silence for 3+ hours (180 mins) before this message
      if (diffMins >= 180) {
        p.conversationStarters++;
        if (startersMessagesMap[sender].length < 12 && text.length > 0) {
          startersMessagesMap[sender].push(formattedSnippet);
        }
      }
    } else {
      p.conversationStarters++;
      currentStreak = 1;
      currentStreakMessages = [formattedSnippet];
      if (startersMessagesMap[sender].length < 12 && text.length > 0) {
        startersMessagesMap[sender].push(formattedSnippet);
      }
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
      earlyMessages: p.earlyMessages,
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
  const sortedByEarly = [...participantStats].sort((a, b) => b.earlyMessages - a.earlyMessages);
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

  const getCleanSampleMessages = (arr: string[] | undefined, fallbackName: string) => {
    if (arr && arr.length > 0) {
      return arr.slice(0, 10);
    }
    const general = generalMessagesMap[fallbackName] || [];
    return general.slice(0, 5);
  };

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
        desc: `Gece 00:00 - 05:00 arasında tam ${nightOwlWinner.nightMessages} mesajla ayaktaydı.`,
        sampleMessages: getCleanSampleMessages(nightMessagesMap[nightOwlWinner.name], nightOwlWinner.name)
      },
      earlyBird: {
        name: earlyBirdWinner.name,
        count: earlyBirdWinner.earlyMessages,
        desc: `Sabahın ilk ışıklarında (${earlyBirdWinner.earlyMessages} mesaj) grubu uyandırdı.`,
        sampleMessages: getCleanSampleMessages(earlyMessagesMap[earlyBirdWinner.name], earlyBirdWinner.name)
      },
      speedster: {
        name: speedsterWinner.name,
        avgMins: speedsterWinner.avgResponseTimeMinutes || 1,
        desc: `Ortalama ${speedsterWinner.avgResponseTimeMinutes || 1} dakikada jet hızında cevap verdi.`,
        sampleMessages: getCleanSampleMessages(generalMessagesMap[speedsterWinner.name], speedsterWinner.name)
      },
      ghost: {
        name: ghostWinner.name,
        avgMins: ghostWinner.avgResponseTimeMinutes || 60,
        desc: `Mesajlara ortalama ${ghostWinner.avgResponseTimeMinutes || 60} dakika sonra dönüş yaparak gizemini korudu.`,
        sampleMessages: getCleanSampleMessages(generalMessagesMap[ghostWinner.name], ghostWinner.name)
      },
      impatient: {
        name: impatientWinner.name,
        count: impatientWinner.monologues,
        desc: `Cevap beklemeden art arda mesaj yağdırma rekoru (${impatientWinner.monologues} kez).`,
        sampleMessages: getCleanSampleMessages(monologueMessagesMap[impatientWinner.name], impatientWinner.name)
      },
      starter: {
        name: starterWinner.name,
        count: starterWinner.conversationStarters,
        desc: `Sessizliği tam ${starterWinner.conversationStarters} defa bozarak muhabbeti başlattı.`,
        sampleMessages: getCleanSampleMessages(startersMessagesMap[starterWinner.name], starterWinner.name)
      },
      emojiMonarch: {
        name: emojiMonarchWinner.name,
        count: emojiMonarchWinner.emojiCount,
        desc: `Toplam ${emojiMonarchWinner.emojiCount} emoji ile duygularını kelimeler yerine sembollerle anlattı.`,
        sampleMessages: getCleanSampleMessages(emojiMessagesMap[emojiMonarchWinner.name], emojiMonarchWinner.name)
      },
      novelist: {
        name: novelistWinner.name,
        avgWords: novelistWinner.avgWordsPerMessage,
        desc: `Mesaj başına ortalama ${novelistWinner.avgWordsPerMessage} kelimeyle adeta mini makaleler yazdı.`,
        sampleMessages: (longestMessagesMap[novelistWinner.name] || [])
          .sort((a, b) => b.length - a.length)
          .slice(0, 8)
          .map(m => m.text)
      },
      hypeTrain: {
        name: hypeTrainWinner.name,
        exclamationCount: hypeTrainWinner.exclamationCount,
        desc: `Gruptaki heyecanı ve kahkahayı en çok körükleyen enerji kaynağı.`,
        sampleMessages: getCleanSampleMessages(hypeMessagesMap[hypeTrainWinner.name], hypeTrainWinner.name)
      }
    }
  };
}
