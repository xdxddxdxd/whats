import { ChatMetrics } from '../analytics/stats-engine';
import {
  AISentimentResult,
  IntenseMessage,
  EmotionCategory,
  FlagsReportData,
  ToxicityRadarData,
  ChatDictionaryData,
  TimelineHighlight
} from '@/types/chat';
import { AIAnalysisResult, SuperlativeCard, WrappedSlideData } from './types';
import { SmartSamplingResult } from './smart-sampling';

export function generateRuleBasedSentiment(
  metrics: ChatMetrics,
  sampling?: SmartSamplingResult
): AISentimentResult {
  const user1 = metrics.participants[0] || { name: 'Kullanıcı 1', messageCount: 0, emojiCount: 0, wordCount: 0 };
  const user2 = metrics.participants[1] || { name: 'Kullanıcı 2', messageCount: 0, emojiCount: 0, wordCount: 0 };

  const u1Romantic = Math.max(15, Math.round(user1.emojiCount * 0.12 + user1.wordCount * 0.02));
  const u2Romantic = Math.max(10, Math.round(user2.emojiCount * 0.08 + user2.wordCount * 0.015));

  const u1Funny = Math.max(12, Math.round((metrics.calculatedSuperlatives?.hypeTrain?.exclamationCount || 10) * 0.4));
  const u2Funny = Math.max(15, Math.round((metrics.calculatedSuperlatives?.hypeTrain?.exclamationCount || 10) * 0.6));

  const totalCategoryPool = Math.max(100, Math.round(metrics.totalMessages * 0.06));
  const categoryDistribution: EmotionCategory[] = [
    { category: 'Mutluluk', count: Math.round(totalCategoryPool * 0.35), color: '#38BDF8', percentage: 35 },
    { category: 'Sevgi', count: Math.round(totalCategoryPool * 0.25), color: '#EC4899', percentage: 25 },
    { category: 'Eğlence', count: Math.round(totalCategoryPool * 0.20), color: '#F59E0B', percentage: 20 },
    { category: 'Minnettarlık', count: Math.round(totalCategoryPool * 0.10), color: '#10B981', percentage: 10 },
    { category: 'Sorun', count: Math.round(totalCategoryPool * 0.06), color: '#EF4444', percentage: 6 },
    { category: 'Üzüntü', count: Math.round(totalCategoryPool * 0.04), color: '#6366F1', percentage: 4 }
  ];

  const fallbackSamples = sampling?.sampledMessages || [];
  const emotionTypes = ['Korku', 'Mutluluk', 'Memnuniyet', 'Pişmanlık', 'Heyecan', 'Sevgi'];

  let intenseMessages: IntenseMessage[] = [];

  if (fallbackSamples.length > 0) {
    intenseMessages = fallbackSamples
      .filter(s => s.text.length > 3)
      .slice(0, 5)
      .map((s, idx) => ({
        sender: s.sender,
        time: s.time,
        text: s.text,
        intensity: s.intensityScore || (100 - idx * 15),
        emotion: emotionTypes[idx % emotionTypes.length]
      }));
  }

  if (intenseMessages.length === 0) {
    intenseMessages = [
      { sender: user1.name, time: '15:50', text: 'KORKUYORUM', intensity: 100, emotion: 'Korku' },
      { sender: user2.name, time: '21:50', text: 'KSHWODHWODJWOEJWOD FATİHTERİM MUTLU', intensity: 100, emotion: 'Mutluluk' },
      { sender: user2.name, time: '23:10', text: 'ANKET: Ben cok iyi biriyim dimi SEÇENEK: Eed (0 oy) SEÇENEK: Evet (0 oy)', intensity: 43, emotion: 'Memnuniyet' },
      { sender: user1.name, time: '17:59', text: 'KEŞKE', intensity: 100, emotion: 'Pişmanlık' }
    ];
  }

  return {
    overallTone: 'Nötr',
    dominantEmotion: 'Memnuniyet',
    happiestDate: metrics.busiestDate?.date || '31 Mayıs 2026',
    saddestDate: metrics.longestSilence?.startDate || '26 Ocak 2026',
    categoryDistribution,
    emotionalTimeline: [
      { week: 'Haz 25', score: 65, label: 'Pozitif' },
      { week: 'Eyl 25', score: 78, label: 'Çok Pozitif' },
      { week: 'Ara 25', score: 50, label: 'Nötr' },
      { week: 'Mar 26', score: 85, label: 'Çok Pozitif' },
      { week: 'Haz 26', score: 60, label: 'Pozitif' },
      { week: 'Ağu 26', score: 72, label: 'Çok Pozitif' }
    ],
    intenseMessages,
    relationshipRoles: {
      romanticScore: { user1: u1Romantic, user2: u2Romantic },
      funnyScore: { user1: u1Funny, user2: u2Funny },
      titles: {
        [user1.name]: ['Gece Kuşu', 'Işık Hızı', 'Grup Lideri'],
        [user2.name]: ['Emoji Ustası', 'Grup Neşesi', 'Meraklı']
      }
    },
    flagsReport: metrics.flagsReport,
    toxicityRadar: metrics.toxicityRadar,
    chatDictionary: metrics.chatDictionary,
    timelineHighlights: metrics.timelineHighlights
  };
}

export function generateSmartRuleBasedAnalysis(
  chatTitle: string,
  metrics: ChatMetrics,
  chatType: 'group' | 'direct'
): AIAnalysisResult {
  const { totalMessages, totalEmojis, daysSpan, participants, peakHour, peakDay, calculatedSuperlatives, topEmojis } = metrics;
  const topParticipant = participants[0] || { name: 'Grup Üyesi', messageCount: 0, messagePercentage: 0 };
  const secondParticipant = participants[1] || topParticipant;

  const superlatives: SuperlativeCard[] = [
    {
      id: 'night_owl',
      title: 'Gece Kuşu',
      winner: calculatedSuperlatives.nightOwl.name,
      badge: '🌙',
      color: 'bg-white text-[#0A0A0A] border-[#E5E9F0]',
      description: `${calculatedSuperlatives.nightOwl.name}, gece 00:00 - 05:00 saatleri arasında grubu ayakta tuttu.`,
      quote: calculatedSuperlatives.nightOwl.sampleMessages[0] || '"Gece mesajları..."',
      sampleQuotes: calculatedSuperlatives.nightOwl.sampleMessages,
      statLabel: 'Gece Mesajı',
      statValue: `${calculatedSuperlatives.nightOwl.count} adet`
    },
    {
      id: 'early_bird',
      title: 'Erkenci Kuş',
      winner: calculatedSuperlatives.earlyBird.name,
      badge: '☕',
      color: 'bg-white text-[#0A0A0A] border-[#E5E9F0]',
      description: `Sabahın ilk ışıklarında (05:00 - 09:00) sohbette ilk kıvılcımı çakan isim.`,
      quote: calculatedSuperlatives.earlyBird.sampleMessages[0] || '"Sabah mesajları..."',
      sampleQuotes: calculatedSuperlatives.earlyBird.sampleMessages,
      statLabel: 'Sabah Mesajı',
      statValue: `${calculatedSuperlatives.earlyBird.count} adet`
    },
    {
      id: 'ghost',
      title: 'Grup Hayaleti',
      winner: calculatedSuperlatives.ghost.name,
      badge: '🫥',
      color: 'bg-white text-[#0A0A0A] border-[#E5E9F0]',
      description: `Mesajları okuyup ortalama ${calculatedSuperlatives.ghost.avgMins} dakika sonra cevap veren gizemli karakter.`,
      quote: calculatedSuperlatives.ghost.sampleMessages[0] || '"Sonradan gelen cevaplar..."',
      sampleQuotes: calculatedSuperlatives.ghost.sampleMessages,
      statLabel: 'Ortalama Yanıt',
      statValue: `${calculatedSuperlatives.ghost.avgMins} dk`
    },
    {
      id: 'speedster',
      title: 'Jet Yanıtçı',
      winner: calculatedSuperlatives.speedster.name,
      badge: '🏎️',
      color: 'bg-white text-[#0A0A0A] border-[#E5E9F0]',
      description: `Mesaj bildirimine ışık hızında (${calculatedSuperlatives.speedster.avgMins} dk) basan sohbet kalkanı.`,
      quote: calculatedSuperlatives.speedster.sampleMessages[0] || '"Işık hızında cevaplar..."',
      sampleQuotes: calculatedSuperlatives.speedster.sampleMessages,
      statLabel: 'Hızlı Cevap',
      statValue: `${calculatedSuperlatives.speedster.avgMins} dk`
    },
    {
      id: 'impatient',
      title: 'En Sabırsız',
      winner: calculatedSuperlatives.impatient.name,
      badge: '⏳',
      color: 'bg-white text-[#0A0A0A] border-[#E5E9F0]',
      description: `Cevap beklemeden art arda mesaj yağdıran seri mesaj rekortmeni (${calculatedSuperlatives.impatient.count} kez).`,
      quote: calculatedSuperlatives.impatient.sampleMessages[0] || '"Seri mesajlar..."',
      sampleQuotes: calculatedSuperlatives.impatient.sampleMessages,
      statLabel: 'Seri Mesaj',
      statValue: `${calculatedSuperlatives.impatient.count} kez`
    },
    {
      id: 'starter',
      title: 'Konu Açan & Dedikodu Başlatan',
      winner: calculatedSuperlatives.starter.name,
      badge: '📢',
      color: 'bg-white text-[#0A0A0A] border-[#E5E9F0]',
      description: `Sessizlik uzayınca ilk mesajı atıp sohbeti başlatan lider (${calculatedSuperlatives.starter.count} kez).`,
      quote: calculatedSuperlatives.starter.sampleMessages[0] || '"Konuyu açan mesaj..."',
      sampleQuotes: calculatedSuperlatives.starter.sampleMessages,
      statLabel: 'Muhabbet Başlatma',
      statValue: `${calculatedSuperlatives.starter.count} kez`
    },
    {
      id: 'emoji_monarch',
      title: 'Emoji Hükümdarı',
      winner: calculatedSuperlatives.emojiMonarch.name,
      badge: '✨',
      color: 'bg-white text-[#0A0A0A] border-[#E5E9F0]',
      description: `Toplam ${calculatedSuperlatives.emojiMonarch.count} emoji ile duygularını kelimeler yerine sembollerle anlatan kişi.`,
      quote: calculatedSuperlatives.emojiMonarch.sampleMessages[0] || '🔥 ✨ 😎',
      sampleQuotes: calculatedSuperlatives.emojiMonarch.sampleMessages,
      statLabel: 'Toplam Emoji',
      statValue: `${calculatedSuperlatives.emojiMonarch.count}`
    },
    {
      id: 'novelist',
      title: 'Mini Makaleci',
      winner: calculatedSuperlatives.novelist.name,
      badge: '✍️',
      color: 'bg-white text-[#0A0A0A] border-[#E5E9F0]',
      description: `Mesaj başına ortalama ${novelistWinner.avgWords} kelimeyle uzun soluklu yazan isim.`,
      quote: calculatedSuperlatives.novelist.sampleMessages[0] || '"Detaylı mesajlar..."',
      sampleQuotes: calculatedSuperlatives.novelist.sampleMessages,
      statLabel: 'Ort. Kelime/Mesaj',
      statValue: `${calculatedSuperlatives.novelist.avgWords}`
    },
    {
      id: 'hype_train',
      title: 'Grup Neşesi & Enerji Kaynağı',
      winner: calculatedSuperlatives.hypeTrain.name,
      badge: '🎉',
      color: 'bg-white text-[#0A0A0A] border-[#E5E9F0]',
      description: `Gruptaki kahkaha ve heyecanı en çok körükleyen enerji lokomotifi.`,
      quote: calculatedSuperlatives.hypeTrain.sampleMessages[0] || '"Kahkaha ve heyecan..."',
      sampleQuotes: calculatedSuperlatives.hypeTrain.sampleMessages,
      statLabel: 'Heyecan Skoru',
      statValue: `${calculatedSuperlatives.hypeTrain.exclamationCount}x`
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
      : `${chatTitle} grubu bu dönem tam ${totalMessages.toLocaleString('tr-TR')} mesaj ve ${totalEmojis.toLocaleString('tr-TR')} emoji ile anlar biriktirdi. En hareketli gün ${peakDay.dayName} oldu.`;

  const wrappedSlides: WrappedSlideData[] = [
    {
      id: 'slide_intro',
      type: 'intro',
      title: chatTitle,
      subtitle: `${daysSpan} Günlük Büyük Macera`,
      badge: 'WRAPPED 2026',
      gradient: 'from-[#0A0A0A] to-[#141414]',
      narrative: `Hazır mısınız? Bu sohbetin arka planındaki tüm sırlar, rekorlar ve gruptaki en ikonik karakterler ortaya çıkıyor!`,
      extraData: { chatTitle, daysSpan, participantCount: participants.length }
    },
    {
      id: 'slide_stats',
      type: 'stats_overview',
      title: 'Rakamlarla Bu Sohbet',
      subtitle: 'Parmaklar klavyeden çekilmedi',
      badge: 'REKORLAR',
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
      badge: 'EN YOĞUN ANLAR',
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
      badge: 'SUPERLATIVES',
      gradient: 'from-[#0A0A0A] to-[#141414]',
      narrative: `Grupta herkesin bir görevi vardı: Geceyi ${calculatedSuperlatives.nightOwl.name} aydınlattı, ${calculatedSuperlatives.ghost.name} gizemini korudu, ${calculatedSuperlatives.speedster.name} ise parmak hız rekoru kırdı!`,
      extraData: { items: superlatives.slice(0, 4) }
    },
    {
      id: 'slide_emojis',
      type: 'emoji_dna',
      title: 'Sohbetin Emoji DNA\'sı',
      subtitle: `${totalEmojis.toLocaleString('tr-TR')} Duygu Dağılımı`,
      badge: 'EMOJİLER',
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
      badge: 'GELECEK KEHANETİ',
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
      badge: 'PAYLAŞ & İNDİR',
      gradient: 'from-[#0A0A0A] to-[#141414]',
      narrative: `Harika bir arkadaşlık, bol kahkaha ve binlerce hatıra... Bu Yıl Özetini Story'de paylaş veya PDF olarak arşivle!`,
      extraData: { chatTitle, totalMessages, participantsCount: participants.length }
    }
  ];

  return {
    summary,
    groupVibe,
    superlatives,
    wrappedSlides,
    generatedAt: new Date().toISOString(),
    provider: 'smart_engine'
  };
}
