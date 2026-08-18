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

// Simple fast hash for message uniqueness
export function generateMessageHash(dateStr: string, sender: string, content: string): string {
  const str = `${dateStr}__${sender}__${content.trim().slice(0, 80)}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
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

// System messages to skip
const SYSTEM_PATTERNS = [
  'uçtan uca şifrelidir',
  'end-to-end encrypted',
  'grup simgesi',
  'grup açıklamasını',
  'grup konusunu',
  'gruba eklendi',
  'gruptan ayrıldı',
  'güvenlik kodu',
  'changed the group',
  'created group',
  'added',
  'left',
  'security code changed',
  'invite link',
  'davet bağlantısı'
];

// Helper to parse date/time parts reliably
function parseDateTime(datePart: string, timePart: string): Date | null {
  try {
    const cleanDate = datePart.trim().replace(/[\[\]]/g, '');
    const cleanTime = timePart.trim().replace(/[\[\]]/g, '');

    // Split date (DD.MM.YYYY, DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
    const dateParts = cleanDate.split(/[\.\/\-]/).map(p => parseInt(p, 10));
    if (dateParts.length !== 3) return null;

    let day: number, month: number, year: number;

    if (dateParts[0] > 1000) {
      // YYYY-MM-DD
      year = dateParts[0];
      month = dateParts[1] - 1;
      day = dateParts[2];
    } else {
      // DD.MM.YY(YY) or MM/DD/YY(YY)
      // Standard Turkish / European is DD.MM.YYYY
      day = dateParts[0];
      month = dateParts[1] - 1;
      year = dateParts[2];

      if (year < 100) {
        year += 2000;
      }

      // If month > 12, likely swap
      if (month > 11 && day <= 12) {
        const temp = day;
        day = month + 1;
        month = temp - 1;
      }
    }

    // Time parsing (HH:MM:SS or HH:MM or with AM/PM / ÖÖ/ÖS)
    let isPM = false;
    let isAM = false;

    let timeStr = cleanTime.toUpperCase();
    if (timeStr.includes('PM') || timeStr.includes('ÖS')) {
      isPM = true;
      timeStr = timeStr.replace(/PM|ÖS/gi, '').trim();
    } else if (timeStr.includes('AM') || timeStr.includes('ÖÖ')) {
      isAM = true;
      timeStr = timeStr.replace(/AM|ÖÖ/gi, '').trim();
    }

    const timeParts = timeStr.split(':').map(p => parseInt(p, 10));
    let hours = timeParts[0] || 0;
    const minutes = timeParts[1] || 0;
    const seconds = timeParts[2] || 0;

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    const date = new Date(year, month, day, hours, minutes, seconds);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

export function parseWhatsAppChat(rawText: string, defaultTitle?: string): ParseResult {
  if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
    return {
      isValid: false,
      chatType: 'group',
      messages: [],
      participants: [],
      error: 'Yüklenen dosya boş görünüyor. Lütfen geçerli bir WhatsApp sohbet dışa aktarım dosyası (.txt) seçin.'
    };
  }

  // Remove invisible BOM chars and normalize line breaks
  const normalizedText = rawText.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedText.split('\n');

  // iOS format regex: [12.03.2023, 14:32:15] Sender Name: Message
  // or [12/03/23, 2:32:15 PM] Sender Name: Message
  const iosRegex = /^\[(\d{1,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPpÖö][MmSs])?)\]\s+([^:]+?):\s+(.*)$/;

  // Android format regex: 12.03.2023 14:32 - Sender Name: Message
  // or 12/03/2023, 14:32 - Sender Name: Message
  const androidRegex = /^(\d{1,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPpÖö][MmSs])?)\s+-\s+([^:]+?):\s+(.*)$/;

  // Android system line without sender: 12.03.2023 14:32 - System message
  const systemRegex = /^\[?(\d{1,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPpÖö][MmSs])?)\]?\s*(?:-)?\s*(.*)$/;

  const messages: ParsedMessage[] = [];
  const participantsSet = new Set<string>();
  let validLineMatchCount = 0;

  let currentMessage: ParsedMessage | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    let match = line.match(iosRegex);
    let isIos = true;

    if (!match) {
      match = line.match(androidRegex);
      isIos = false;
    }

    if (match) {
      validLineMatchCount++;
      const datePart = match[1];
      const timePart = match[2];
      const sender = match[3].trim();
      const content = match[4];

      // Check if this is a system message pretending to have a sender
      const isSystem = SYSTEM_PATTERNS.some(p => sender.toLowerCase().includes(p) || content.toLowerCase().includes(p));
      if (isSystem) {
        continue;
      }

      const timestamp = parseDateTime(datePart, timePart) || new Date();
      const isMedia = MEDIA_PATTERNS.some(p => content.toLowerCase().includes(p));

      // Push previous message
      if (currentMessage) {
        messages.push(currentMessage);
      }

      participantsSet.add(sender);

      currentMessage = {
        id: `msg_${messages.length + 1}`,
        rawDate: `${datePart} ${timePart}`,
        timestamp,
        sender,
        content,
        isMedia,
        hash: generateMessageHash(`${datePart} ${timePart}`, sender, content)
      };
    } else {
      // Check if it's a system line
      const sysMatch = line.match(systemRegex);
      if (sysMatch) {
        const sysContent = sysMatch[3] || '';
        if (SYSTEM_PATTERNS.some(p => sysContent.toLowerCase().includes(p))) {
          // It's a system message, ignore
          continue;
        }
      }

      // If currentMessage exists, this is a multi-line message continuation
      if (currentMessage) {
        currentMessage.content += '\n' + line;
        currentMessage.hash = generateMessageHash(currentMessage.rawDate, currentMessage.sender, currentMessage.content);
      }
    }
  }

  // Push the last message
  if (currentMessage) {
    messages.push(currentMessage);
  }

  // Validation: Must have at least 2 valid messages to be considered a WhatsApp chat
  if (validLineMatchCount < 2 || messages.length === 0) {
    return {
      isValid: false,
      chatType: 'group',
      messages: [],
      participants: [],
      error: 'Bu dosya geçerli bir WhatsApp sohbet dışa aktarımı gibi görünmüyor. Lütfen WhatsApp uygulamasından "Sohbeti Dışa Aktar" (.txt) seçeneğiyle aldığınız orijinal metin dosyasını yükleyin.'
    };
  }

  const participants = Array.from(participantsSet);
  const chatType: 'group' | 'direct' = participants.length <= 2 ? 'direct' : 'group';

  const firstDate = messages.length > 0 ? messages[0].timestamp : undefined;
  const lastDate = messages.length > 0 ? messages[messages.length - 1].timestamp : undefined;
  const lastMessageHash = messages.length > 0 ? messages[messages.length - 1].hash : undefined;

  let title = defaultTitle;
  if (!title) {
    if (chatType === 'direct') {
      title = participants.join(' & ');
    } else {
      title = `WhatsApp Grubu (${participants.length} Kişi)`;
    }
  }

  return {
    isValid: true,
    title,
    chatType,
    messages,
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

  const lastIndex = result.messages.findIndex(m => m.hash === lastKnownHash);
  if (lastIndex === -1) {
    // If exact hash not found (e.g. slight reformat), compare dates or return all
    return { newMessages: result.messages, allMessages: result.messages, hasNew: true };
  }

  const newMessages = result.messages.slice(lastIndex + 1);
  return {
    newMessages,
    allMessages: result.messages,
    hasNew: newMessages.length > 0
  };
}
