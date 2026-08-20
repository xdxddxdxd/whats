export interface ParsedMessage {
  id: string;
  rawDate: string;
  timestamp: Date;
  sender: string;
  content: string;
  isMedia: boolean;
  hash: string;
}

export interface ParseResult {
  isValid: boolean;
  title?: string;
  chatType: 'group' | 'direct';
  messages: ParsedMessage[];
  participants: string[];
  firstDate?: Date;
  lastDate?: Date;
  lastMessageHash?: string;
  error?: string;
}

// Content + timestamp hash (index-independent so re-parses stay stable for incremental updates)
export function generateMessageHash(dateStr: string, sender: string, content: string, _index = 0): string {
  const str = `${dateStr}__${sender}__${content.trim().slice(0, 180)}__${content.length}`;
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

export function cleanWhatsAppMessageText(rawText: string): string {
  if (!rawText) return '';
  let text = rawText;

  // 1. Remove embedded WhatsApp quote reply timestamps & senders
  // e.g. [20.01.2025 07:52:18] Doğukan: ... or [10.01.2025, 06:48:34] asekuzi: ...
  text = text.replace(/\[\d{1,2}[\.\/\-]\d{1,2}[\.\/\-]\d{2,4},?\s*\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?\]\s*[^:]*:\s*/g, ' ');
  text = text.replace(/\d{1,2}[\.\/\-]\d{1,2}[\.\/\-]\d{2,4},?\s*\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?\s*-\s*[^:]*:\s*/g, ' ');

  // 2. Remove all media placeholders in Turkish & English
  text = text.replace(/<?(?:görüntü|video|ses|çıkartma|belge|dosya|medya|kişi kartı|konum)\s*dahil\s*edilmedi>?/gi, ' ');
  text = text.replace(/<?(?:image|video|audio|voice|sticker|document|file|media|contact card|location|gif)\s*omitted>?/gi, ' ');
  text = text.replace(/bu mesaj(?:ı)?\s*sildiniz|bu mesaj silindi|this message was deleted|you deleted this message/gi, ' ');

  // 3. Remove quotation marks, asterisks around quotes, stray brackets
  text = text.replace(/^[\*\"\'\“\”\`\<\>\[\]\s]+/, '').replace(/[\*\"\'\“\”\`\<\>\[\]\s]+$/, '');

  // 4. Normalize multiple spaces
  return text.replace(/\s+/g, ' ').trim();
}

// Media indicators in Turkish & English
const MEDIA_PATTERNS = [
  '<medya dahil edilmedi>',
  '<media omitted>',
  '<image omitted>',
  '<video omitted>',
  '<audio omitted>',
  '<sticker omitted>',
  '<gif omitted>',
  'görüntü dahil edilmedi',
  'video dahil edilmedi',
  'ses dahil edilmedi',
  'çıkartma dahil edilmedi',
  'belge dahil edilmedi',
  'dosya dahil edilmedi',
  'bu mesaj silindi',
  'this message was deleted',
  'you deleted this message',
  'bu mesajı sildiniz'
];

function isMediaMessage(content: string): boolean {
  const lower = content.toLowerCase().trim();
  return MEDIA_PATTERNS.some(pattern => lower.includes(pattern));
}

// iOS format: [20.01.2025, 07:52:18] Name: Message
// iOS without seconds: [20.01.2025, 07:52] Name: Message
// Android format: 20.01.2025 07:52 - Name: Message
// Android alternative: 20/01/2025, 07:52 - Name: Message
// US format: [1/20/25, 7:52:18 AM] Name: Message
const IOS_REGEX = /^\[(\d{1,2}[\.\/\-]\d{1,2}[\.\/\-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)\]\s+([^:]+):\s+(.*)$/s;
const ANDROID_REGEX = /^(\d{1,2}[\.\/\-]\d{1,2}[\.\/\-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)\s+-\s+([^:]+):\s+(.*)$/s;

// System message detection (encryption notices, added to group, etc.)
const SYSTEM_PATTERNS = [
  'uçtan uca şifrelidir',
  'end-to-end encrypted',
  'grubu oluşturdu',
  'created group',
  'gruba katıldı',
  'joined the group',
  'gruptan ayrıldı',
  'left the group',
  'kişisini ekledi',
  'added',
  'kişisini çıkardı',
  'removed',
  'güvenlik kodu değişti',
  'security code changed',
  'mesajlar ve aramalar uçtan uca',
  'messages and calls are end-to-end',
  'bu grup silindi',
  'grup simgesini değiştirdi',
  'grup açıklamasını değiştirdi',
  'changed the group'
];

function isSystemMessage(sender: string, content: string): boolean {
  const full = `${sender} ${content}`.toLowerCase();
  return SYSTEM_PATTERNS.some(p => full.includes(p));
}

/**
 * Parses date and time strings handling various international formats
 */
function parseDateTime(dateStr: string, timeStr: string): Date | null {
  try {
    // Normalize separators
    const dateParts = dateStr.split(/[\.\/\-]/).map(p => parseInt(p, 10));
    if (dateParts.length !== 3) return null;

    let day: number, month: number, year: number;

    // Check if year is 2 or 4 digits
    let rawYear = dateParts[2];
    if (rawYear < 100) {
      rawYear += rawYear < 50 ? 2000 : 1900;
    }

    // Determine DD/MM vs MM/DD
    // If first part > 12, it must be day (DD/MM/YYYY)
    // Common format in TR/EU is DD.MM.YYYY
    if (dateParts[0] > 12) {
      day = dateParts[0];
      month = dateParts[1] - 1;
      year = rawYear;
    } else if (dateParts[1] > 12) {
      // MM/DD/YYYY format
      month = dateParts[0] - 1;
      day = dateParts[1];
      year = rawYear;
    } else {
      // Default to DD/MM/YYYY (most common for Turkish WhatsApp)
      day = dateParts[0];
      month = dateParts[1] - 1;
      year = rawYear;
    }

    // Parse time
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    const isPM = /pm/i.test(timeStr);
    const isAM = /am/i.test(timeStr);
    const cleanTime = timeStr.replace(/\s*[APap][Mm]/g, '').trim();
    const timeParts = cleanTime.split(':').map(p => parseInt(p, 10));

    if (timeParts.length >= 2) {
      hours = timeParts[0];
      minutes = timeParts[1];
      if (timeParts.length >= 3) {
        seconds = timeParts[2];
      }

      if (isPM && hours < 12) hours += 12;
      if (isAM && hours === 12) hours = 0;
    }

    // Store in UTC representing the local wall-clock time in the chat log
    const d = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

/**
 * Main WhatsApp export parser supporting multi-line messages, iOS, Android, Group & Direct
 */
export function parseWhatsAppChat(rawText: string, customTitle?: string): ParseResult {
  if (!rawText || typeof rawText !== 'string') {
    return {
      isValid: false,
      chatType: 'direct',
      messages: [],
      participants: [],
      error: 'Dosya içeriği boş veya okunamadı.'
    };
  }

  const lines = rawText.split(/\r?\n/);
  const parsedMessages: ParsedMessage[] = [];
  const participantSet = new Set<string>();

  let currentMessage: {
    rawDate: string;
    timestamp: Date;
    sender: string;
    contentLines: string[];
    isMedia: boolean;
  } | null = null;

  function commitCurrentMessage() {
    if (!currentMessage) return;

    const fullContent = currentMessage.contentLines.join('\n').trim();
    const media = currentMessage.isMedia || isMediaMessage(fullContent);

    if (fullContent.length > 0 || media) {
      const id = `msg_${parsedMessages.length + 1}`;
      const hash = generateMessageHash(
        currentMessage.rawDate,
        currentMessage.sender,
        fullContent,
        parsedMessages.length
      );

      parsedMessages.push({
        id,
        rawDate: currentMessage.rawDate,
        timestamp: currentMessage.timestamp,
        sender: currentMessage.sender,
        content: fullContent,
        isMedia: media,
        hash
      });

      participantSet.add(currentMessage.sender);
    }

    currentMessage = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Try matching iOS format first
    let match = line.match(IOS_REGEX);
    let isAndroid = false;

    if (!match) {
      match = line.match(ANDROID_REGEX);
      isAndroid = true;
    }

    if (match) {
      // New message line
      const [, dateStr, timeStr, senderRaw, contentRaw] = match;
      const sender = senderRaw.trim();

      // Check if this is a system message
      if (isSystemMessage(sender, contentRaw)) {
        commitCurrentMessage();
        continue;
      }

      // Check sender validity (not a time or system indicator)
      if (sender.length > 80 || sender.startsWith('http')) {
        // Probably continuation or malformed
        if (currentMessage) {
          currentMessage.contentLines.push(line);
        }
        continue;
      }

      const timestamp = parseDateTime(dateStr, timeStr);
      if (!timestamp) {
        // Date parse failed, treat as continuation
        if (currentMessage) {
          currentMessage.contentLines.push(line);
        }
        continue;
      }

      // Commit previous message before starting new
      commitCurrentMessage();

      const rawDate = `${dateStr} ${timeStr}`;
      const isMedia = isMediaMessage(contentRaw);

      currentMessage = {
        rawDate,
        timestamp,
        sender,
        contentLines: [contentRaw],
        isMedia
      };
    } else {
      // Multi-line message continuation
      if (currentMessage) {
        currentMessage.contentLines.push(line);
      }
    }
  }

  // Commit last message
  commitCurrentMessage();

  if (parsedMessages.length === 0) {
    return {
      isValid: false,
      chatType: 'direct',
      messages: [],
      participants: [],
      error: 'WhatsApp sohbet formatı tanınamadı. Lütfen "Medyasız Dışa Aktar" seçeneğiyle alınmış orijinal .txt dosyasını yükleyin.'
    };
  }

  const participants = Array.from(participantSet);
  const chatType: 'group' | 'direct' = participants.length > 2 ? 'group' : 'direct';

  // Title inference
  let title = customTitle;
  if (!title) {
    if (chatType === 'direct' && participants.length === 2) {
      title = `${participants[0]} & ${participants[1]}`;
    } else if (chatType === 'direct' && participants.length === 1) {
      title = `${participants[0]} ile Sohbet`;
    } else {
      title = `Grup Sohbeti (${participants.length} Katılımcı)`;
    }
  }

  const firstDate = parsedMessages[0]?.timestamp;
  const lastDate = parsedMessages[parsedMessages.length - 1]?.timestamp;
  const lastMessageHash = parsedMessages[parsedMessages.length - 1]?.hash;

  return {
    isValid: true,
    title,
    chatType,
    messages: parsedMessages,
    participants,
    firstDate,
    lastDate,
    lastMessageHash
  };
}

/**
 * For incremental updates: parses new chat and returns only messages after the last processed message hash
 */
export function extractIncrementalMessages(
  rawText: string,
  lastKnownHash: string | null
): { newMessages: ParsedMessage[]; allMessages: ParsedMessage[]; hasNew: boolean } {
  const result = parseWhatsAppChat(rawText);
  if (!result.isValid || result.messages.length === 0) {
    return { newMessages: [], allMessages: [], hasNew: false };
  }

  if (!lastKnownHash) {
    return { newMessages: result.messages, allMessages: result.messages, hasNew: true };
  }

  let lastIndex = -1;
  for (let i = result.messages.length - 1; i >= 0; i--) {
    if (result.messages[i].hash === lastKnownHash) {
      lastIndex = i;
      break;
    }
  }

  if (lastIndex === -1) {
    return { newMessages: result.messages, allMessages: result.messages, hasNew: true };
  }

  const newMessages = result.messages.slice(lastIndex + 1);
  return {
    newMessages,
    allMessages: result.messages,
    hasNew: newMessages.length > 0
  };
}
