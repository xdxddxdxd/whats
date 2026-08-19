import { ParsedMessage } from '../parser/whatsapp-parser';
import {
  ChatMetrics,
  DeterministicMetrics,
  EmojiStat,
  HourlyDistribution,
  DailyDistribution,
  MonthlyTrend,
  ParticipantStat,
  SingleWordStats,
  FlagsReportData,
  ToxicityRadarData,
  PassiveAggressivePattern,
  ChatDictionaryData,
  TimelineHighlight
} from '@/types/chat';

export type { ChatMetrics };

const EMOJI_REGEX = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83d\ud83e][\ud000-\udfff]|[\u200d\ufe0f])/g;

const TURKISH_DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const TURKISH_MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

// Common single word dismissive / short triggers
const SINGLE_WORD_TRIGGERS = new Set([
  'tm', 'ok', 'peki', 'aynen', 'tmm', 'oke', 'tamam', 'hıhı', 'he', 'hı', 'yok', 'yoo',
  'bb', 'hyr', 'evet', 'yep', 'nope', 'tmmdır', 'olr', 'olur', 'bilmem', 'bosver', 'boşver'
]);

// Passive-aggressive patterns
const PASSIVE_AGGRESSIVE_REGEXES = [
  { pattern: /\b(sen bilirsin|sen nas[ıi]l istersen|keyfin bilir)\b/i, tag: 'Görünürde Teslimiyet' },
  { pattern: /\b(iyi peki|peki iyi|iyi tamam|peki peki)\b/i, tag: 'Soğuk Onay' },
  { pattern: /\b(yok bi[r]?\s*[\u015f\u0073]ey|bir \u015fey yok|yok bir \u015fey)\b/i, tag: 'Üstü Kapalı Sitem' },
  { pattern: /\b(anlad[ıi]m ben|anlad[ıi]m|fark etmez|farketmez)\b/i, tag: 'Duygusal Mesafe' },
  { pattern: /\b(benlik de[ğg]il|sen devam et|sen tak[ıi]l|bensiz)\b/i, tag: 'Dışlanma Sitemi' },
  { pattern: /\b(neyse|neyse bo[\u015f]ver|bo[\u015f]ver)\b/i, tag: 'Konu Kapatma / Küslük' }
];

// Comprehensive Turkish Stopwords to accurately extract unique user vocabulary
const STOP_WORDS = new Set([
  've', 'bir', 'bu', 'da', 'de', 'icin', 'için', 'ne', 'o', 'mi', 'mı', 'mu', 'mü',
  'ben', 'sen', 'biz', 'siz', 'onlar', 'cok', 'çok', 'daha', 'gibi', 'kadar',
  'ile', 'ama', 'fakat', 'lakin', 'ancak', 'veya', 'ya', 'ise', 'her', 'sey', 'şey',
  'var', 'yok', 'en', 'bana', 'sana', 'ona', 'bize', 'size', 'beni', 'seni', 'onu',
  'benim', 'senin', 'onun', 'bizim', 'sizin', 'bunu', 'sunu', 'şunu', 'böyle', 'şöyle',
  'su', 'şu', 'diye', 'zaten', 'bile', 'artık', 'yani', 'bi', 'biraz', 'bence', 'sence',
  'şu', 'şunlar', 'bunlar', 'kendi', 'kendine', 'nasıl', 'neden', 'niye', 'hangi',
  'şimdi', 'sonra', 'önce', 'öyle', 'şöyle', 'böyle', 'işte', 'tabi', 'tabii', 'yahu',
  'tam', 'hala', 'hâlâ', 'zaman', 'şeyler', 'olan', 'olarak', 'oldu', 'olur', 'olsun',
  'yine', 'hep', 'hiç', 'hic', 'biri', 'biriyle', 'tüm', 'tum', 'aynı', 'ayni', 'eder',
  'etti', 'eden', 'baska', 'başka', 'hemen', 'şuan', 'şuanda', 'suan', 'demek', 'ki',
  'mesaj', 'görsel', 'ses', 'medya', 'dahil', 'edilmedi', 'omitted', 'audio', 'image', 'video'
]);

function formatTurkishDate(d: Date, includeYear = true): string {
  const day = d.getDate();
  const month = TURKISH_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return includeYear ? `${day} ${month} ${year}` : `${day} ${month}`;
}

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
  const monthCounts: Record<string, number> = {};

  const nightMessagesMap: Record<string, string[]> = {};
  const earlyMessagesMap: Record<string, string[]> = {};
  const monologueMessagesMap: Record<string, string[]> = {};
  const startersMessagesMap: Record<string, string[]> = {};
  const longestMessagesMap: Record<string, { text: string; length: number; time: string }[]> = {};
  const emojiMessagesMap: Record<string, string[]> = {};
  const hypeMessagesMap: Record<string, string[]> = {};
  const generalMessagesMap: Record<string, string[]> = {};

  const wordFrequencyMap: Record<string, Record<string, number>> = {};
  const singleWordRepliesMap: Record<string, Record<string, number>> = {};
  const phraseFrequencyMap: Record<string, number> = {};
  const detectedPassiveAggressive: PassiveAggressivePattern[] = [];

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
      earlyMessages: number;
      responseTimes: number[];
      monologues: number;
      conversationStarters: number;
      exclamationCount: number;
      singleWordCount: number;
      passiveCount: number;
    }
  > = {};

  let lastMessageSender: string | null = null;
  let lastMessageTime: Date | null = null;
  let lastMessageLength = 0;
  let currentStreak = 0;
  let currentStreakMessages: string[] = [];

  let silenceBreakSnippet = '';
  let silenceBreakSender = '';
  let maxSilenceMs = 0;
  let maxSilenceStart: Date = messages[0].timestamp;
  let maxSilenceEnd: Date = messages[0].timestamp;

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
        exclamationCount: 0,
        singleWordCount: 0,
        passiveCount: 0
      };
      nightMessagesMap[sender] = [];
      earlyMessagesMap[sender] = [];
      monologueMessagesMap[sender] = [];
      startersMessagesMap[sender] = [];
      longestMessagesMap[sender] = [];
      emojiMessagesMap[sender] = [];
      hypeMessagesMap[sender] = [];
      generalMessagesMap[sender] = [];
      wordFrequencyMap[sender] = {};
      singleWordRepliesMap[sender] = {};
    }

    const p = participantMap[sender];
    p.messageCount++;

    if (msg.isMedia) {
      p.mediaCount++;
      totalMedia++;
    }

    const text = (msg.content || '').trim();
    const cleanTokens = text.toLowerCase().replace(/[^a-zçğıöşü0-9\s]/gi, ' ').split(/\s+/).filter(Boolean);
    const words = cleanTokens.length;
    const chars = text.length;

    p.wordCount += words;
    p.charCount += chars;
    totalWords += words;
    totalCharacters += chars;

    if (words === 1) {
      const singleW = cleanTokens[0];
      if (singleW && (SINGLE_WORD_TRIGGERS.has(singleW) || singleW.length <= 4)) {
        p.singleWordCount++;
        singleWordRepliesMap[sender][singleW] = (singleWordRepliesMap[sender][singleW] || 0) + 1;
      }
    }

    for (const pa of PASSIVE_AGGRESSIVE_REGEXES) {
      if (pa.pattern.test(text)) {
        p.passiveCount++;
        if (detectedPassiveAggressive.length < 15) {
          detectedPassiveAggressive.push({
            phrase: text.length > 80 ? text.slice(0, 80) + '...' : text,
            sender,
            time: `${String(msgDate.getHours()).padStart(2, '0')}:${String(msgDate.getMinutes()).padStart(2, '0')}`,
            context: lastMessageLength > 60 ? 'Uzun mesaja verilen sitemli yanıt' : 'Sohbet içi soğuk tavır',
            intensity: 75 + Math.min(25, text.length * 2),
            tag: pa.tag
          });
        }
        break;
      }
    }

    for (const w of cleanTokens) {
      if (w.length >= 3 && !STOP_WORDS.has(w) && !/^\d+$/.test(w)) {
        wordFrequencyMap[sender][w] = (wordFrequencyMap[sender][w] || 0) + 1;
      }
    }

    // Dynamic n-gram multi-word phrase frequency for real shared vocabulary
    for (let j = 0; j < cleanTokens.length - 1; j++) {
      const w1 = cleanTokens[j];
      const w2 = cleanTokens[j + 1];
      if (!STOP_WORDS.has(w1) || !STOP_WORDS.has(w2)) {
        const twoGram = `${w1} ${w2}`;
        if (twoGram.length >= 5) {
          phraseFrequencyMap[twoGram] = (phraseFrequencyMap[twoGram] || 0) + 1;
        }
      }
      if (j < cleanTokens.length - 2) {
        const w3 = cleanTokens[j + 2];
        const threeGram = `${w1} ${w2} ${w3}`;
        if (threeGram.length >= 8) {
          phraseFrequencyMap[threeGram] = (phraseFrequencyMap[threeGram] || 0) + 1;
        }
      }
    }

    const timeStr = `${String(msgDate.getHours()).padStart(2, '0')}:${String(msgDate.getMinutes()).padStart(2, '0')}`;
    const cleanSnippet = text.length > 100 ? text.slice(0, 100) + '...' : text;
    const formattedSnippet = `[${timeStr}] ${cleanSnippet || '<Medya/Görsel>'}`;

    if (generalMessagesMap[sender].length < 15 && text.length > 0) {
      generalMessagesMap[sender].push(formattedSnippet);
    }

    const hasLaughOrHype = /[!?]|(?:(?:ha){2,})|(?:(?:he){2,})|(?:(?:sj){2,})|[a-zA-ZçğıöşüÇĞİÖŞÜ]{8,}/i.test(text);
    if (hasLaughOrHype) {
      p.exclamationCount++;
      if (hypeMessagesMap[sender].length < 12 && text.length > 0) {
        hypeMessagesMap[sender].push(formattedSnippet);
      }
    }

    if (text.length > 15) {
      longestMessagesMap[sender].push({ text: formattedSnippet, length: text.length, time: timeStr });
    }

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

    const hour = msgDate.getHours();
    const day = msgDate.getDay();
    const dateStr = `${msgDate.getFullYear()}-${String(msgDate.getMonth() + 1).padStart(2, '0')}-${String(msgDate.getDate()).padStart(2, '0')}`;
    const monthStr = `${TURKISH_MONTHS[msgDate.getMonth()]} ${String(msgDate.getFullYear()).slice(2)}`;

    hourlyCounts[hour]++;
    dailyCounts[day]++;
    dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
    monthCounts[monthStr] = (monthCounts[monthStr] || 0) + 1;

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

    if (lastMessageSender && lastMessageTime) {
      const diffMs = msgDate.getTime() - lastMessageTime.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));

      if (diffMs > maxSilenceMs) {
        maxSilenceMs = diffMs;
        maxSilenceStart = lastMessageTime;
        maxSilenceEnd = msgDate;
        silenceBreakSnippet = formattedSnippet;
        silenceBreakSender = sender;
      }

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
        if (diffMins >= 0 && diffMins <= 1440) {
          p.responseTimes.push(diffMins);
        }
      }

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
    lastMessageLength = chars;
  }

  const firstDate = new Date(messages[0].timestamp);
  const lastDate = new Date(messages[messages.length - 1].timestamp);
  const diffDays = Math.max(1, Math.round((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));
  const avgMessagesPerDay = Math.round((totalMessages / diffDays) * 10) / 10;

  const totalStarters = Object.values(participantMap).reduce((sum, p) => sum + p.conversationStarters, 0) || 1;

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
      avgCharLength: p.messageCount > 0 ? Math.round((p.charCount / p.messageCount) * 10) / 10 : 0,
      mediaCount: p.mediaCount,
      emojiCount: p.emojiCount,
      topEmojis,
      nightMessages: p.nightMessages,
      earlyMessages: p.earlyMessages,
      nightPercentage: p.messageCount > 0 ? Math.round((p.nightMessages / p.messageCount) * 1000) / 10 : 0,
      avgResponseTimeMinutes,
      monologues: p.monologues,
      conversationStarters: p.conversationStarters,
      startedPercentage: Math.round((p.conversationStarters / totalStarters) * 100),
      singleWordCount: p.singleWordCount
    };
  }).sort((a, b) => b.messageCount - a.messageCount);

  const hourlyDistribution: HourlyDistribution[] = hourlyCounts.map((count, hour) => ({
    hour,
    label: `${hour.toString().padStart(2, '0')}:00`,
    count,
    percentage: Math.round((count / totalMessages) * 1000) / 10
  }));

  const dailyDistribution: DailyDistribution[] = dailyCounts.map((count, day) => ({
    day,
    dayName: TURKISH_DAYS[day],
    count,
    percentage: Math.round((count / totalMessages) * 1000) / 10
  }));

  const monthlyTrends: MonthlyTrend[] = Object.entries(monthCounts).map(([month, count]) => ({
    month,
    count,
    percentage: Math.round((count / totalMessages) * 1000) / 10
  }));

  const topEmojis: EmojiStat[] = Object.entries(globalEmojiCounts)
    .map(([emoji, count]) => ({
      emoji,
      count,
      percentage: totalEmojis > 0 ? Math.round((count / totalEmojis) * 1000) / 10 : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  let peakHourIdx = 0;
  for (let h = 1; h < 24; h++) {
    if (hourlyCounts[h] > hourlyCounts[peakHourIdx]) peakHourIdx = h;
  }

  let peakDayIdx = 0;
  for (let d = 1; d < 7; d++) {
    if (dailyCounts[d] > dailyCounts[peakDayIdx]) peakDayIdx = d;
  }

  let busiestDateStr = Object.keys(dateCounts)[0] || '';
  let maxDateCount = 0;
  for (const [d, count] of Object.entries(dateCounts)) {
    if (count > maxDateCount) {
      maxDateCount = count;
      busiestDateStr = d;
    }
  }

  const longestSilenceHours = Math.max(1, Math.round(maxSilenceMs / (1000 * 60 * 60)));
  const longestSilenceStartStr = formatTurkishDate(maxSilenceStart);
  const longestSilenceEndStr = formatTurkishDate(maxSilenceEnd);

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
    if (arr && arr.length > 0) return arr.slice(0, 10);
    const general = generalMessagesMap[fallbackName] || [];
    return general.slice(0, 5);
  };

  const u1Name = participantStats[0]?.name || 'Kullanıcı 1';
  const u2Name = participantStats[1]?.name || 'Kullanıcı 2';

  const u1WordEntries = Object.entries(wordFrequencyMap[u1Name] || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w, c]) => ({
      word: w,
      count: c,
      meaning: `${u1Name}'in sohbette en sık başvurduğu imza ifade`,
      sender: u1Name
    }));

  const u2WordEntries = Object.entries(wordFrequencyMap[u2Name] || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w, c]) => ({
      word: w,
      count: c,
      meaning: `${u2Name}'in dilinden düşürmediği karakteristik kelime`,
      sender: u2Name
    }));

  const sharedPhrasesEntries = Object.entries(phraseFrequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([p, count]) => ({
      phrase: p.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      count,
      description: 'Sohbette sıkça tekrarlanan ortak kalıp ve ifade'
    }));

  const chatDictionary: ChatDictionaryData = {
    user1Words: u1WordEntries.length > 0 ? u1WordEntries : [
      { word: Object.keys(wordFrequencyMap[u1Name] || {})[0] || 'mesaj', count: 1, meaning: `${u1Name}'in sohbette kullandığı ifade`, sender: u1Name }
    ],
    user2Words: u2WordEntries.length > 0 ? u2WordEntries : [
      { word: Object.keys(wordFrequencyMap[u2Name] || {})[0] || 'mesaj', count: 1, meaning: `${u2Name}'in sohbette kullandığı ifade`, sender: u2Name }
    ],
    sharedSlang: sharedPhrasesEntries.length > 0 ? sharedPhrasesEntries : (
      u1WordEntries.length > 0 && u2WordEntries.length > 0 ? [
        { phrase: `${u1WordEntries[0].word} & ${u2WordEntries[0].word}`, count: u1WordEntries[0].count + u2WordEntries[0].count, description: 'Sohbette öne çıkan anahtar kelimeler' }
      ] : []
    )
  };

  const u1Single = participantStats[0]?.singleWordCount || 0;
  const u2Single = participantStats[1]?.singleWordCount || 0;

  const topSingleWords: Array<{ word: string; count: number; sender: string }> = [];
  [u1Name, u2Name].forEach(sender => {
    Object.entries(singleWordRepliesMap[sender] || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .forEach(([word, count]) => {
        topSingleWords.push({ word, count, sender });
      });
  });

  const u1SingleWordExample = Object.keys(singleWordRepliesMap[u1Name] || {})[0]
    ? `"${Object.keys(singleWordRepliesMap[u1Name])[0]}"`
    : (u1Single > 0 ? '"tm"' : undefined);

  const u1NightExample = nightMessagesMap[u1Name]?.[0] || generalMessagesMap[u1Name]?.[0] || undefined;
  const u1StarterExample = startersMessagesMap[u1Name]?.[0] || generalMessagesMap[u1Name]?.[0] || undefined;
  const u1EmojiExample = emojiMessagesMap[u1Name]?.[0] || hypeMessagesMap[u1Name]?.[0] || undefined;

  const u2GeneralExample = generalMessagesMap[u2Name]?.[0] || undefined;
  const u2EmojiExample = emojiMessagesMap[u2Name]?.[0] || undefined;
  const u2LongExample = longestMessagesMap[u2Name]?.[0]?.text || generalMessagesMap[u2Name]?.[0] || undefined;
  const u2HypeExample = hypeMessagesMap[u2Name]?.[0] || generalMessagesMap[u2Name]?.[0] || undefined;

  const flagsReport: FlagsReportData = {
    user1Flags: [
      {
        id: 'u1_rf_1',
        type: 'red',
        badge: '🚩',
        title: 'Tek Kelimelik Cevap Alışkanlığı',
        desc: `Sohbette tam ${u1Single} kez tek kelimelik kısa cevap verdi.`,
        exampleQuote: u1SingleWordExample,
        severity: u1Single > 20 ? 'high' : 'medium'
      },
      {
        id: 'u1_rf_2',
        type: 'red',
        badge: '🚩',
        title: 'Gece Mesajı Monopolü',
        desc: `Gece 00:00 - 05:00 saatleri arasında (${nightOwlWinner.nightMessages} mesaj) ansızın sohbet açma potansiyeli.`,
        exampleQuote: u1NightExample,
        severity: 'low'
      },
      {
        id: 'u1_gf_1',
        type: 'green',
        badge: '🟢',
        title: 'Sohbet Başlatma Cesareti',
        desc: `Sessizlik uzadığında %${participantStats[0]?.startedPercentage || 50} oranla ilk adımı atan taraf.`,
        exampleQuote: u1StarterExample,
        severity: 'high'
      },
      {
        id: 'u1_gf_2',
        type: 'green',
        badge: '🟢',
        title: 'Hızlı Enerji & Reaksiyon',
        desc: `Gruptaki kahkaha ve heyecan anlarını coşkuyla destekliyor (${participantStats[0]?.emojiCount || 0} emoji).`,
        exampleQuote: u1EmojiExample,
        severity: 'medium'
      }
    ],
    user2Flags: [
      {
        id: 'u2_rf_1',
        type: 'red',
        badge: '🚩',
        title: 'Görüldü & Geç Yanıt Riski',
        desc: `Ortalama yanıt süresi ${participantStats[1]?.avgResponseTimeMinutes || 15} dakika.`,
        exampleQuote: u2GeneralExample,
        severity: (participantStats[1]?.avgResponseTimeMinutes || 0) > 30 ? 'high' : 'medium'
      },
      {
        id: 'u2_rf_2',
        type: 'red',
        badge: '🚩',
        title: 'Seçici Emoji Kullanımı',
        desc: `Sitem içeren veya dramatik emojileri en yoğun tercih eden isim.`,
        exampleQuote: u2EmojiExample,
        severity: 'low'
      },
      {
        id: 'u2_gf_1',
        type: 'green',
        badge: '🟢',
        title: 'Detaylı & Açıklayıcı Anlatım',
        desc: `Mesaj başına ${participantStats[1]?.avgCharLength || 15} karakter ile anlatımını paylaşıyor.`,
        exampleQuote: u2LongExample,
        severity: 'high'
      },
      {
        id: 'u2_gf_2',
        type: 'green',
        badge: '🟢',
        title: 'Grup Neşesi & Espri Lokomotifi',
        desc: `Repliklerle gerginliği dağıtıp ortama pozitif enerji saçıyor.`,
        exampleQuote: u2HypeExample,
        severity: 'medium'
      }
    ],
    singleWordStats: {
      user1Count: u1Single,
      user2Count: u2Single,
      topWords: topSingleWords
    }
  };

  const u1Passive = participantMap[u1Name]?.passiveCount || 0;
  const u2Passive = participantMap[u2Name]?.passiveCount || 0;
  const totalPassive = u1Passive + u2Passive;

  const realDetectedOrFallbackPatterns = detectedPassiveAggressive.length > 0
    ? detectedPassiveAggressive
    : (
      generalMessagesMap[u1Name]?.[0] || generalMessagesMap[u2Name]?.[0]
        ? [
            {
              phrase: (generalMessagesMap[u1Name]?.[0] || generalMessagesMap[u2Name]?.[0] || '').replace(/^\[\d{2}:\d{2}\]\s*/, ''),
              sender: u1Name,
              time: '12:00',
              context: 'Düşük gerilim / Doğal sohbet akışı',
              intensity: 45,
              tag: 'Doğal Akış'
            }
          ]
        : []
    );

  const toxicityRadar: ToxicityRadarData = {
    dramaLevel: totalPassive > 15 ? 'Yüksek (Trip Dolu)' : totalPassive > 5 ? 'Orta (Ara Sıra Gerilim)' : 'Düşük (Huzurlu)',
    tripScore: {
      user1: Math.max(10, u1Passive * 10 + Math.round(u1Single * 1.5)),
      user2: Math.max(10, u2Passive * 10 + Math.round(u2Single * 1.5))
    },
    detectedPatterns: realDetectedOrFallbackPatterns,
    coldPeriods: [
      {
        dates: `${longestSilenceStartStr} – ${longestSilenceEndStr}`,
        hours: longestSilenceHours,
        triggerMessage: 'En uzun sessizlik dönemi (iletişimin tamamen durduğu aralık)'
      }
    ]
  };

  const firstMsgSnippet = messages[0]?.content ? `"${messages[0].content.slice(0, 60)}"` : '';
  const busiestMsgMatch = messages.find(m => new Date(m.timestamp).toISOString().startsWith(busiestDateStr));
  const busiestMsgSnippet = busiestMsgMatch?.content
    ? `"${busiestMsgMatch.content.slice(0, 60)}"`
    : (messages[Math.floor(messages.length / 2)]?.content ? `"${messages[Math.floor(messages.length / 2)].content.slice(0, 60)}"` : '');
  const silenceMsgSnippet = silenceBreakSnippet || startersMessagesMap[starterWinner.name]?.[0] || '';
  const nightMsgSnippet = nightMessagesMap[nightOwlWinner.name]?.[0] || generalMessagesMap[nightOwlWinner.name]?.[0] || '';

  const timelineHighlights: TimelineHighlight[] = [
    {
      id: 'tl_first',
      date: formatTurkishDate(firstDate),
      title: 'İlk Kıvılcım & Başlangıç',
      emoji: '🚀',
      description: `${u1Name} tarafından gönderilen ilk mesajla bu büyük sohbet serüveni başladı.`,
      messageCount: dateCounts[Object.keys(dateCounts)[0]] || 15,
      quote: firstMsgSnippet,
      sender: messages[0]?.sender || u1Name
    },
    {
      id: 'tl_busiest',
      date: busiestDateStr ? formatTurkishDate(new Date(busiestDateStr)) : 'Yoğun Gün',
      title: 'Rekor Gün (Klavyelerin Yandığı An)',
      emoji: '🔥',
      description: `Tek bir günde tam ${maxDateCount.toLocaleString('tr-TR')} mesaj paylaşılarak aktivite rekoru kırıldı.`,
      messageCount: maxDateCount || 100,
      quote: busiestMsgSnippet,
      sender: u2Name
    },
    {
      id: 'tl_silence',
      date: longestSilenceStartStr,
      title: 'Büyük Sessizlik & Dönüş',
      emoji: '❄️',
      description: `Tam ${longestSilenceHours} saat süren en uzun sessizlikten sonra ${starterWinner.name} tekrar sohbeti başlattı.`,
      messageCount: longestSilenceHours,
      quote: silenceMsgSnippet,
      sender: starterWinner.name
    },
    {
      id: 'tl_night',
      date: formatTurkishDate(lastDate),
      title: 'Gece Kuşları Zirvesi',
      emoji: '🌙',
      description: `Gece 00:00 - 05:00 arasında ${nightOwlWinner.name} liderliğinde gece muhabbeti yaşandı.`,
      messageCount: nightOwlWinner.nightMessages || 1,
      quote: nightMsgSnippet,
      sender: nightOwlWinner.name
    }
  ];

  return {
    totalMessages,
    totalWords,
    totalCharacters,
    totalMedia,
    totalEmojis,
    daysSpan: diffDays,
    avgMessagesPerDay,
    participants: participantStats,
    hourlyDistribution,
    dailyDistribution,
    monthlyTrends,
    topEmojis,
    peakHour: {
      hour: peakHourIdx,
      label: `${peakHourIdx.toString().padStart(2, '0')}:00`,
      count: hourlyCounts[peakHourIdx]
    },
    peakDay: {
      dayName: TURKISH_DAYS[peakDayIdx],
      count: dailyCounts[peakDayIdx]
    },
    busiestDate: {
      date: busiestDateStr ? formatTurkishDate(new Date(busiestDateStr)) : '-',
      count: maxDateCount
    },
    longestSilence: {
      hours: longestSilenceHours,
      startDate: longestSilenceStartStr,
      endDate: longestSilenceEndStr,
      formatted: `${longestSilenceStartStr} – ${longestSilenceEndStr}`
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
        desc: `Toplam ${emojiMonarchWinner.emojiCount} emoji ile duygularını kelimeler yerine sembollerle anlatan kişi.`,
        sampleMessages: getCleanSampleMessages(emojiMessagesMap[emojiMonarchWinner.name], emojiMonarchWinner.name)
      },
      novelist: {
        name: novelistWinner.name,
        avgWords: novelistWinner.avgWordsPerMessage,
        desc: `Mesaj başına ortalama ${novelistWinner.avgWordsPerMessage} kelimeyle detaylı yazan isim.`,
        sampleMessages: getCleanSampleMessages(longestMessagesMap[novelistWinner.name]?.map(m => m.text), novelistWinner.name)
      },
      hypeTrain: {
        name: hypeTrainWinner.name,
        exclamationCount: hypeTrainWinner.exclamationCount,
        desc: `Kahkaha ve heyecan dolu mesajlarla enerjiyi zirveye taşıdı.`,
        sampleMessages: getCleanSampleMessages(hypeMessagesMap[hypeTrainWinner.name], hypeTrainWinner.name)
      }
    },
    flagsReport,
    toxicityRadar,
    chatDictionary,
    timelineHighlights
  };
}

export function formatDeterministicMetrics(metrics: ChatMetrics): DeterministicMetrics {
  const user1 = metrics.participants[0] || {
    name: 'Kullanıcı 1',
    messageCount: 0,
    messagePercentage: 50,
    characterCount: 0,
    avgCharLength: 0,
    wordCount: 0,
    avgWordsPerMessage: 0,
    emojiCount: 0,
    topEmojis: [],
    nightMessages: 0,
    earlyMessages: 0,
    nightPercentage: 0,
    avgResponseTimeMinutes: 1,
    monologues: 0,
    conversationStarters: 0,
    startedPercentage: 50,
    singleWordCount: 0
  };

  const user2 = metrics.participants[1] || {
    name: 'Kullanıcı 2',
    messageCount: 0,
    messagePercentage: 50,
    characterCount: 0,
    avgCharLength: 0,
    wordCount: 0,
    avgWordsPerMessage: 0,
    emojiCount: 0,
    topEmojis: [],
    nightMessages: 0,
    earlyMessages: 0,
    nightPercentage: 0,
    avgResponseTimeMinutes: 1,
    monologues: 0,
    conversationStarters: 0,
    startedPercentage: 50,
    singleWordCount: 0
  };

  const formattedUser1 = {
    name: user1.name,
    messageCount: user1.messageCount,
    percentage: user1.messagePercentage,
    characterCount: user1.characterCount,
    avgCharLength: user1.avgCharLength,
    wordCount: user1.wordCount,
    avgWordsPerMessage: user1.avgWordsPerMessage,
    totalEmojis: user1.emojiCount,
    topEmojis: user1.topEmojis,
    nightMessagesCount: user1.nightMessages,
    earlyBirdMessagesCount: user1.earlyMessages,
    nightPercentage: user1.nightPercentage,
    avgResponseTimeMin: user1.avgResponseTimeMinutes ?? 0,
    monologueCount: user1.monologues,
    conversationStarterCount: user1.conversationStarters,
    startedPercentage: user1.startedPercentage,
    singleWordReplyCount: user1.singleWordCount || 0
  };

  const formattedUser2 = {
    name: user2.name,
    messageCount: user2.messageCount,
    percentage: user2.messagePercentage,
    characterCount: user2.characterCount,
    avgCharLength: user2.avgCharLength,
    wordCount: user2.wordCount,
    avgWordsPerMessage: user2.avgWordsPerMessage,
    totalEmojis: user2.emojiCount,
    topEmojis: user2.topEmojis,
    nightMessagesCount: user2.nightMessages,
    earlyBirdMessagesCount: user2.earlyMessages,
    nightPercentage: user2.nightPercentage,
    avgResponseTimeMin: user2.avgResponseTimeMinutes ?? 0,
    monologueCount: user2.monologues,
    conversationStarterCount: user2.conversationStarters,
    startedPercentage: user2.startedPercentage,
    singleWordReplyCount: user2.singleWordCount || 0
  };

  return {
    totalMessages: metrics.totalMessages,
    startDate: metrics.longestSilence.startDate ? metrics.longestSilence.startDate.split(' – ')[0] : 'Kayıt Başlangıcı',
    endDate: metrics.longestSilence.endDate ? metrics.longestSilence.endDate.split(' – ')[1] : 'Kayıt Sonu',
    daysCount: metrics.daysSpan,
    dailyAverage: metrics.avgMessagesPerDay,
    longestSilenceHours: metrics.longestSilence.hours,
    longestSilenceDates: metrics.longestSilence.formatted,
    mostActiveHour: metrics.peakHour.label,
    mostActiveDay: metrics.peakDay.dayName,
    mostActiveDate: metrics.busiestDate.date,
    users: {
      user1: formattedUser1,
      user2: formattedUser2
    },
    timeDistribution: {
      hourly: metrics.hourlyDistribution.map(h => ({ hour: h.label, percentage: h.percentage, count: h.count })),
      daily: metrics.dailyDistribution.map(d => ({ day: d.dayName, percentage: d.percentage, count: d.count })),
      monthly: metrics.monthlyTrends.map(m => ({ month: m.month, percentage: m.percentage, count: m.count }))
    },
    allTopEmojis: metrics.topEmojis.map(e => ({ emoji: e.emoji, count: e.count, label: `${e.emoji} (${e.count}x)` })),
    flagsReport: metrics.flagsReport,
    toxicityRadar: metrics.toxicityRadar,
    chatDictionary: metrics.chatDictionary,
    timelineHighlights: metrics.timelineHighlights
  };
}
