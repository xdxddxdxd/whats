import { ChatMetrics } from '../analytics/stats-engine';
import { AIAnalysisResult, SuperlativeCard, WrappedSlideData } from './types';

export function generateSmartRuleBasedAnalysis(
  chatTitle: string,
  metrics: ChatMetrics,
  chatType: 'group' | 'direct'
): AIAnalysisResult {
  const { totalMessages, totalEmojis, daysSpan, participants, peakHour, peakDay, calculatedSuperlatives, topEmojis } = metrics;
  const topParticipant = participants[0] || { name: 'Grup Üyesi', messageCount: 0, messagePercentage: 0 };
  const secondParticipant = participants[1] || topParticipant;

  // Build Superlative Cards (clean monochrome & baby blue styling)
  const superlatives: SuperlativeCard[] = [
    {
      id: 'night_owl',
      title: 'Gece Kuşu 🦉',
      winner: calculatedSuperlatives.nightOwl.name,
      badge: '🌙',
      color: 'bg-white text-[#0A0A0A] border-[#E5E9F0]',
      description: `${calculatedSuperlatives.nightOwl.name}, herkes uyurken saat 00:00 - 05:00 arasında grubu ayakta tuttu.`,
      quote: '"Uyumayan var mı ya bir şey anlatıcam..."',
      statLabel: 'Gece Mesajı',
      statValue: `${calculatedSuperlatives.nightOwl.count} adet`
    },
    {
      id: 'ghost',
      title: 'Grup Hayaleti 👻',
      winner: calculatedSuperlatives.ghost.name,
      badge: '🫥',
      color: 'bg-white text-[#0A0A0A] border-[#E5E9F0]',
      description: `Mesajları okuyup 3 iş günü sonra "Aa görmemişim" deme sanatının ustası.`,
      quote: '"Yaa kusura bakmayın bildirim gelmemiş..."',
      statLabel: 'Ortalama Yanıt',
      statValue: `${calculatedSuperlatives.ghost.avgMins} dk`
    },
    {
      id: 'speedster',
      title: 'Jet Yanıtçı ⚡',
      winner: calculatedSuperlatives.speedster.name,
      badge: '🏎️',
      color: 'bg-white text-[#0A0A0A] border-[#E5E9F0]',
      description: `Telefonu eline yapışık gezen, mesaj bildirimine ışık hızında basan grup kalkanı.`,
      quote: '"Gördüm yazdım geldim!"',
      statLabel: 'Hızlı Cevap',
      statValue: `${calculatedSuperlatives.speedster.avgMins} dk`
    },
    {
      id: 'impatient',
      title: 'En Sabırsız 🏃💨',
      winner: calculatedSuperlatives.impatient.name,
      badge: '⏳',
      color: 'bg-white text-[#0A0A0A] border-[#E5E9F0]',
      description: `Kimse cevap vermeyince arka arkaya 5 mesaj atıp grupta panik havası yaratan kişi.`,
      quote: '"Bakar mısınız?? Heyy ordasınız dimi"',
      statLabel: 'Seri Mesaj',
      statValue: `${calculatedSuperlatives.impatient.count} kez`
    },
    {
      id: 'starter',
      title: 'Konu Açan / Dedikodu Başlatan ☕',
      winner: calculatedSuperlatives.starter.name,
      badge: '📢',
      color: 'bg-white text-[#0A0A0A] border-[#E5E9F0]',
      description: `Grup saatlerce sessiz kalınca "Şimdi size ne anlatcam dinleyin" diyerek bombayı patlatan lider.`,
      quote: '"Bi durun bomba bir olay oldu"',
      statLabel: 'Muhabbet Başlatma',
      statValue: `${calculatedSuperlatives.starter.count} kez`
    },
    {
      id: 'emoji_monarch',
      title: 'Emoji Hükümdarı 👑',
      winner: calculatedSuperlatives.emojiMonarch.name,
      badge: '✨',
      color: 'bg-white text-[#0A0A0A] border-[#E5E9F0]',
      description: `Cümle kurmaya üşenip tüm derdini 4 farklı emoji kombinasyonuyla anlatan duygu insanı.`,
      quote: topEmojis[0]?.emoji ? `${topEmojis[0].emoji}${topEmojis[0].emoji}${topEmojis[0].emoji}` : '😎🔥✨',
      statLabel: 'Toplam Emoji',
      statValue: `${calculatedSuperlatives.emojiMonarch.count}`
    },
    {
      id: 'novelist',
      title: 'Mini Makaleci 📜',
      winner: calculatedSuperlatives.novelist.name,
      badge: '✍️',
      color: 'bg-white text-[#0A0A0A] border-[#E5E9F0]',
      description: `WhatsApp mesajını köşe yazısı uzunluğunda atan, paragraflara doyamayan edebiyatçı.`,
      quote: '"Özet geçiyorum ama öncesinde..."',
      statLabel: 'Ort. Kelime/Mesaj',
      statValue: `${calculatedSuperlatives.novelist.avgWords}`
    }
  ];

  const groupVibe =
    totalMessages > 5000
      ? 'Yüksek Enerji & Kaos'
      : totalMessages > 1000
      ? 'Dengeli Dedikodu & Geyik'
      : 'Sessiz ve Derinden';

  const summary =
    chatType === 'direct'
      ? `${chatTitle} sohbetinde toplam ${totalMessages.toLocaleString('tr-TR')} mesaj paylaşıldı. En yoğun saatler ${peakHour.label} arası olurken, mesajların %${topParticipant.messagePercentage}'lik kısmını ${topParticipant.name} yazdı.`
      : `${chatTitle} grubu bu dönem tam ${totalMessages.toLocaleString('tr-TR')} mesaj ve ${totalEmojis.toLocaleString('tr-TR')} emoji ile unutulmaz anlar biriktirdi! En hareketli gün ${peakDay.dayName} oldu.`;

  // Wrapped Slides for Fullscreen Story
  const wrappedSlides: WrappedSlideData[] = [
    {
      id: 'slide_intro',
      type: 'intro',
      title: chatTitle,
      subtitle: `${daysSpan} Günlük Büyük Macera`,
      badge: '✨ WRAPPED 2026',
      gradient: 'from-[#0A0A0A] to-[#141414]',
      narrative: `Hazır mısınız? Bu sohbetin arka planındaki tüm sırlar, rekorlar ve gruptaki en ikonik karakterler ortaya çıkıyor!`,
      extraData: {
        chatTitle,
        daysSpan,
        participantCount: participants.length
      }
    },
    {
      id: 'slide_stats',
      type: 'stats_overview',
      title: 'Rakamlarla Bu Sohbet',
      subtitle: 'Parmaklar klavyeden çekilmedi',
      badge: '📊 REKORLAR',
      gradient: 'from-[#0A0A0A] to-[#141414]',
      narrative: `Tam ${totalMessages.toLocaleString('tr-TR')} mesaj paylaşıldı! ${topParticipant.name} tek başına mesajların %${topParticipant.messagePercentage}'ini yazarak grubu sırtladı.`,
      extraData: {
        totalMessages,
        topParticipant: topParticipant.name,
        topPercent: topParticipant.messagePercentage,
        secondParticipant: secondParticipant?.name,
        secondPercent: secondParticipant?.messagePercentage
      }
    },
    {
      id: 'slide_rhythm',
      type: 'night_vibe',
      title: 'Zamanın Bittiği Yer',
      subtitle: `${peakHour.label}`,
      badge: '⏰ EN YOĞUN ANLAR',
      gradient: 'from-[#0A0A0A] to-[#141414]',
      narrative: `Grup en çok ${peakDay.dayName} günleri ve saat ${peakHour.label} arasında hareketlendi. Gece 00:00'dan sonra ise ${calculatedSuperlatives.nightOwl.name} nöbetteydi!`,
      extraData: {
        peakHour: peakHour.label,
        peakDay: peakDay.dayName,
        nightOwl: calculatedSuperlatives.nightOwl.name,
        nightCount: calculatedSuperlatives.nightOwl.count
      }
    },
    {
      id: 'slide_superlatives',
      type: 'superlatives',
      title: 'Grup Oscar Ödülleri',
      subtitle: 'Herkesin unvanı tescillendi',
      badge: '🏆 SUPERLATIVES',
      gradient: 'from-[#0A0A0A] to-[#141414]',
      narrative: `Grupta herkesin bir görevi vardı: Geceyi ${calculatedSuperlatives.nightOwl.name} aydınlattı, ${calculatedSuperlatives.ghost.name} gizemini korudu, ${calculatedSuperlatives.speedster.name} ise parmak hız rekoru kırdı!`,
      extraData: {
        items: superlatives.slice(0, 4)
      }
    },
    {
      id: 'slide_emojis',
      type: 'emoji_dna',
      title: 'Sohbetin Emoji DNA\'sı',
      subtitle: `${totalEmojis.toLocaleString('tr-TR')} Duygu Patlaması`,
      badge: '🎭 EMOJİLER',
      gradient: 'from-[#0A0A0A] to-[#141414]',
      narrative: `En çok kullanılan emoji "${topEmojis[0]?.emoji || '🔥'}" oldu. ${calculatedSuperlatives.emojiMonarch.name} kelimeleri bir kenara bırakıp sadece emojilerle konuştu!`,
      extraData: {
        topEmojis: topEmojis.slice(0, 5),
        emojiMonarch: calculatedSuperlatives.emojiMonarch.name
      }
    },
    {
      id: 'slide_oracle',
      type: 'oracle',
      title: 'Yapay Zeka Kehaneti',
      subtitle: 'Gelecek dönem neler olacak?',
      badge: '🔮 GELECEK KEHANETİ',
      gradient: 'from-[#0A0A0A] to-[#141414]',
      narrative: `Yapay zekanın tahmini: ${calculatedSuperlatives.ghost.name} yine geç cevap verecek, ${calculatedSuperlatives.starter.name} yeni bir dedikodu bombasıyla grubu toplayacak ve bu sohbet hiç susmayacak!`,
      extraData: {
        vibe: groupVibe,
        prediction: 'Daha çok kahkaha, daha çok seri mesaj ve bolca anı biriktirmeye devam!'
      }
    },
    {
      id: 'slide_outro',
      type: 'outro',
      title: 'Birlikte Nice Mesajlara!',
      subtitle: `${chatTitle} ✦ Wrapped`,
      badge: '💖 PAYLAŞ & İNDİR',
      gradient: 'from-[#0A0A0A] to-[#141414]',
      narrative: `Bu analiz sadece bir başlangıç! Sohbetinizi dilediğiniz zaman yeni mesajlarla güncelleyebilir veya PDF olarak arşivleyebilirsiniz.`,
      extraData: {}
    }
  ];

  return {
    summary,
    groupVibe,
    superlatives,
    wrappedSlides,
    generatedAt: new Date().toISOString(),
    provider: 'smart-rules'
  };
}
