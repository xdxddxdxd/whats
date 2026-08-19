/**
 * Basit retrieval iskeleti — AI'a Sor için
 * Tüm sohbeti modele göndermek yerine soruya göre ilgili özet dilimleri seçer.
 */

export type RetrievalIntent =
  | 'stats'
  | 'silence'
  | 'conflict'
  | 'words'
  | 'timeline'
  | 'response_time'
  | 'initiation'
  | 'change'
  | 'general';

const INTENT_KEYWORDS: Record<RetrievalIntent, string[]> = {
  stats: ['kaç', 'sayı', 'oran', 'kim daha çok', 'mesaj', 'yüzde', '%'],
  silence: ['sessizlik', 'sus', 'yazmad', 'ara verdi', 'uzun süre'],
  conflict: ['kavga', 'tartış', 'trip', 'gerilim', 'sitem', 'kızgın', 'sinir'],
  words: ['kelime', 'jargon', 'sözlük', 'emoji', 'replik', 'ne diyor'],
  timeline: ['ne zaman', 'tarih', 'ilk', 'başlangıç', 'önemli an', 'hikaye'],
  response_time: ['cevap', 'yanıt', 'geç', 'hızlı', 'medyan', 'kaç dak'],
  initiation: ['kim başlat', 'ilk yazan', 'konuşmayı aç'],
  change: ['değiş', 'arttı', 'azaldı', 'son zaman', 'eskiden', 'trend'],
  general: [],
};

export function detectIntent(question: string): RetrievalIntent {
  const q = question.toLowerCase();
  let best: RetrievalIntent = 'general';
  let bestScore = 0;
  for (const [intent, kws] of Object.entries(INTENT_KEYWORDS) as [RetrievalIntent, string[]][]) {
    if (intent === 'general') continue;
    let score = 0;
    for (const kw of kws) {
      if (q.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }
  return best;
}

/**
 * chatData (metrics / insight) içinden intent'e göre ekstra not satırları üretir.
 */
export function retrieveContextNotes(question: string, chatData: any): string[] {
  const intent = detectIntent(question);
  const notes: string[] = [`Sorgu niyeti: ${intent}`];
  const insight = chatData?.insightBundle;

  switch (intent) {
    case 'silence':
      if (insight?.silence) {
        notes.push(
          `Sessizlik: en uzun ${insight.silence.longest?.hours}s, 72s+: ${insight.silence.periodsOver72h?.length || 0}`
        );
      }
      break;
    case 'conflict':
      if (insight?.conflictAnalysis) {
        notes.push(
          `Gerilim dönemleri: ${insight.conflictAnalysis.totalDetected}, en yoğun: ${insight.conflictAnalysis.densestDay || '—'}`
        );
      }
      break;
    case 'response_time':
      if (insight?.enhancedResponseTimes?.byUser) {
        for (const [n, rt] of Object.entries(insight.enhancedResponseTimes.byUser) as any) {
          notes.push(`${n} medyan cevap: ${rt.overall.medianMinutes} dk`);
        }
      }
      break;
    case 'initiation':
      if (insight?.initiation) {
        notes.push(`Oturum: ${insight.initiation.totalSessions}`);
        for (const [n, v] of Object.entries(insight.initiation.byUser) as any) {
          notes.push(`${n} başlatma: %${v.percentage}`);
        }
      }
      break;
    case 'change':
      if (insight?.changeAnalysis?.deltas) {
        const d = insight.changeAnalysis.deltas;
        notes.push(
          `30g değişim: mesaj ${d.messageCountPct}%, cevap ${d.medianResponsePct}%, uzunluk ${d.avgMessageLengthPct}%`
        );
      }
      break;
    case 'words':
      notes.push('Kelime/jargon alanına odaklan');
      break;
    case 'timeline':
      notes.push('Zaman tüneli / önemli anlar alanına odaklan');
      break;
    default:
      notes.push('Genel metrikler');
  }

  if (insight?.chatHealth) {
    notes.push(
      `Sağlık: A${insight.chatHealth.activity} K${insight.chatHealth.reciprocity} Y${insight.chatHealth.responsiveness} T${insight.chatHealth.toneStability} S${insight.chatHealth.continuity}`
    );
  }

  return notes;
}

export function getRetrievalIntentLabel(intent: RetrievalIntent): string {
  const map: Record<RetrievalIntent, string> = {
    stats: 'İstatistik',
    silence: 'Sessizlik',
    conflict: 'Gerilim',
    words: 'Kelimeler',
    timeline: 'Zaman çizelgesi',
    response_time: 'Cevap süresi',
    initiation: 'Başlatma',
    change: 'Değişim',
    general: 'Genel',
  };
  return map[intent];
}
