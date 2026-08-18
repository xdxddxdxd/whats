import { ChatMetrics } from '../analytics/stats-engine';

export function buildAnalysisPrompt(chatTitle: string, metrics: ChatMetrics, chatType: 'group' | 'direct'): string {
  const topParticipants = metrics.participants.slice(0, 10).map(p => 
    `- ${p.name}: ${p.messageCount} mesaj (%${p.messagePercentage}), ${p.wordCount} kelime, ${p.emojiCount} emoji, gece mesajı: ${p.nightMessages}, ortalama yanıt süresi: ${p.avgResponseTimeMinutes || 'bilinmiyor'} dk, seri mesaj (monolog): ${p.monologues} kez, konu açma: ${p.conversationStarters} kez`
  ).join('\n');

  const topEmojis = metrics.topEmojis.slice(0, 8).map(e => `${e.emoji} (${e.count})`).join(', ');

  return `Sen arkadaş grupları için samimi, mizahi ve esprili WhatsApp Sohbet Analizi ve Spotify Wrapped tarzı Yıllık Özet üreten yaratıcı bir AI asistanısın.

GÖREV:
Aşağıdaki sohbet istatistiklerini inceleyerek:
1. Son derece esprili, tatlı dille takılan, resmiyetten uzak, arkadaş ortamı dilinde (Türkçe) bir grup özeti ve hava durumu (groupVibe).
2. Kişilik/Superlative kartları (Gece Kuşu, Hayalet, Jet Yanıtçı, En Sabırsız, Konu Açan/Dedikodu Lideri, Emoji Kraliçesi/Kralı, Mini Makaleci, vb.).
3. Spotify Wrapped formatında 7 adet dinamik ve eğlenceli slayt anlatısı üret.

SOHBET DETAYLARI:
- Başlık: ${chatTitle}
- Tür: ${chatType === 'direct' ? 'İkili Sohbet (Direct)' : 'Grup Sohbeti'}
- Toplam Mesaj: ${metrics.totalMessages}
- Toplam Emoji: ${metrics.totalEmojis} (${topEmojis})
- En Yoğun Saat: ${metrics.peakHour.label}
- En Yoğun Gün: ${metrics.peakDay.dayName}
- Zaman Aralığı: ${metrics.dateRange.start} - ${metrics.dateRange.end} (${metrics.daysSpan} gün)

KATILIMCILAR:
${topParticipants}

İSTENEN JSON FORMATI:
Aşağıdaki geçerli JSON formatında yanıt ver, ekstra açıklama ekleme:
{
  "summary": "Arkadaş canlısı ve samimi 2-3 cümlelik genel analiz özeti...",
  "groupVibe": "Grubun genel havasını özetleyen esprili 3-4 kelimelik başlık",
  "superlatives": [
    {
      "id": "benzersiz_id",
      "title": "Unvan Başlığı (örn. Gece Kuşu 🦉)",
      "winner": "Kişi Adı",
      "badge": "Emoji rozet",
      "color": "pastel renk sınıfı",
      "description": "Neden bu unvanı aldığına dair çok komik ve samimi açıklama",
      "quote": "Temsili veya ikonik söz",
      "statLabel": "İstatistik Başlığı",
      "statValue": "İstatistik Değeri"
    }
  ],
  "wrappedSlides": [
    {
      "id": "slide_1",
      "type": "intro",
      "title": "${chatTitle}",
      "subtitle": "Alt başlık",
      "badge": "✨ WRAPPED 2026",
      "gradient": "from-[#6366F1] via-[#8B5CF6] to-[#EC4899]",
      "narrative": "Giriş hikayesi..."
    }
  ]
}`;
}
