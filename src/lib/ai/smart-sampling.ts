import { ParsedMessage } from '../parser/whatsapp-parser';

export interface SampledMessageItem {
  sender: string;
  time: string;
  text: string;
  intensityScore: number;
  hasEmotionSign: boolean;
}

export interface SmartSamplingResult {
  sampledMessages: SampledMessageItem[];
  compressedText: string;
  totalOriginalCount: number;
  sampleCount: number;
}

const EMOTION_PATTERNS = [
  /[!?]{1,}/,
  /(?:ha){2,}|(?:he){2,}|(?:sj){2,}|(?:ah){2,}|koptum|ahaha|ölüyorum|bayıldım/i,
  /sev|aşk|özle|kork|mutlu|üzgün|keşke|pişman|harika|süper|bomba|vay|yok artık/i,
  /(?:🥺|😭|😂|🤣|😍|😘|❤️|💔|🔥|✨|😡|💀|😱|😳|😣|👍|🙏|🙈)/
];

export function extractSmartSample(
  messages: ParsedMessage[],
  maxSamples: number = 200
): SmartSamplingResult {
  if (!messages || messages.length === 0) {
    return {
      sampledMessages: [],
      compressedText: '',
      totalOriginalCount: 0,
      sampleCount: 0
    };
  }

  const cleanMessages = messages.filter(m => !m.isMedia && m.content && m.content.trim().length > 1);

  const sortedByLength = [...cleanMessages].sort((a, b) => b.content.length - a.content.length);
  const longest50 = sortedByLength.slice(0, 50);

  const emotionalCandidates = cleanMessages.filter(m =>
    EMOTION_PATTERNS.some(pat => pat.test(m.content))
  );

  const step = Math.max(1, Math.floor(emotionalCandidates.length / 150));
  const emotional150: ParsedMessage[] = [];
  for (let i = 0; i < emotionalCandidates.length && emotional150.length < 150; i += step) {
    emotional150.push(emotionalCandidates[i]);
  }

  const combinedMap = new Map<string, ParsedMessage>();
  [...longest50, ...emotional150].forEach(m => {
    if (!combinedMap.has(m.id)) {
      combinedMap.set(m.id, m);
    }
  });

  const finalPool = Array.from(combinedMap.values()).slice(0, maxSamples);
  finalPool.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const sampledMessages: SampledMessageItem[] = finalPool.map(m => {
    const d = new Date(m.timestamp);
    const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    const cleanText = m.content.replace(/\\n/g, ' ').trim();
    const hasEmotionSign = EMOTION_PATTERNS.some(pat => pat.test(cleanText));
    
    let intensity = 40;
    if (/[!?]{2,}/.test(cleanText)) intensity += 30;
    if (/[A-ZÇĞİÖŞÜ]{4,}/.test(cleanText)) intensity += 20;
    if (EMOTION_PATTERNS[3].test(cleanText)) intensity += 10;
    intensity = Math.min(100, Math.max(20, intensity));

    return {
      sender: m.sender,
      time,
      text: cleanText.length > 140 ? cleanText.slice(0, 140) + '...' : cleanText,
      intensityScore: intensity,
      hasEmotionSign
    };
  });

  const compressedText = sampledMessages
    .map(s => `${s.sender} (${s.time}): ${s.text}`)
    .join('\\n');

  return {
    sampledMessages,
    compressedText,
    totalOriginalCount: messages.length,
    sampleCount: sampledMessages.length
  };
}
