import { FullChatAnalysisData } from '@/types/chat';

export const DEMO_CHAT_TEXT = `[09.06.2025, 09:12:30] Doğukan: Günaydın!! Bugün plan yapıyoruz dimi? ☕✨
[09.06.2025, 09:13:05] nisa cici: Günaydınn. Ben kesin gelirim ama akşam 7'den önce çıkamam şirketten.
[09.06.2025, 09:14:10] Doğukan: <Medya dahil edilmedi>
[09.06.2025, 09:14:22] Doğukan: Şuna bakın ya sabah sabah karşıma çıkana bak haha 😂😂😂
[09.06.2025, 09:15:00] nisa cici: AHAHAHA Doğukan nerden buldun bunu koptum yaaa 🥺🥺
[09.06.2025, 09:15:30] nisa cici: Biraz geç kalabilirim ama yetişirim mutlaka 💕
[09.06.2025, 12:45:10] Doğukan: Selamlar, nerede buluşuyoruz Kadıköy mü Beşiktaş mı?
[09.06.2025, 12:45:30] Doğukan: Kadıköy olursa bana daha yakın
[09.06.2025, 12:46:00] Doğukan: Cevap versenize heyy ordasınız dimi?
[09.06.2025, 12:46:15] Doğukan: Aloooo 🏃💨
[09.06.2025, 12:48:00] nisa cici: Sakin ol ya toplantıdaydım haha! Kadıköy uyar bana 🍕
[09.06.2025, 12:50:20] Doğukan: Kadıköy süper, Moda Sahil tarafında otururuz.
[09.06.2025, 18:30:15] Doğukan: Ben geçtim bile mekana, köşedeki masadayım haberiniz olsun 🏎️⚡
[09.06.2025, 18:31:00] nisa cici: Jet hızında yine Doğukan haha geliyorum 5 dakikaya 🚀
[09.06.2025, 23:45:10] Doğukan: Akşam harikaydı ya iyi ki toplandık valla 🍻
[09.06.2025, 23:46:00] nisa cici: Evet ya çok iyi geldi, fotoğrafları yarın atarım 📸✨
[10.06.2025, 01:25:40] Doğukan: Uyumayan var mı? Kafama bir şey takıldı bakın şimdi... 🦉
[10.06.2025, 01:27:12] Doğukan: Eğer penguenler uçabilseydi Antarktika'da trafik olur muydu acaba 🤔
[10.06.2025, 01:30:00] nisa cici: Doğukan gece 1 buçukta düşündüğün şeye bak ya uyu artık ahaha 😣
[10.06.2025, 01:32:15] Doğukan: Uykum yok napim haha ama cidden mantıklı soru bence 😂
[02.08.2025, 15:50:00] Doğukan: KORKUYORUM
[02.08.2025, 21:50:00] nisa cici: KSHWODHWODJWOEJWOD FATİHTERİM MUTLU
[02.08.2025, 23:10:00] nisa cici: ANKET: Ben cok iyi biriyim dimi SEÇENEK: Eed (0 oy) SEÇENEK: Evet (0 oy)
[17.08.2026, 17:59:00] Doğukan: KEŞKE`;

export const DEMO_CHAT_TITLE = "nisa cici ♡ Doğukan";

export const chatAnalyticsData: FullChatAnalysisData = {
  summary: {
    totalMessages: 30000,
    startDate: "9 Haziran 2025",
    endDate: "17 Ağustos 2026",
    daysCount: 434,
    dailyAverage: 69,
    longestSilenceHours: 575,
    longestSilenceDates: "1 Mayıs 2026 – 25 Mayıs 2026",
    mostActiveHour: "22:00",
    mostActiveDay: "Pazar",
    mostActiveDate: "2 Ağu 2025"
  },
  users: {
    user1: {
      name: "Doğukan",
      color: "#38BDF8",
      messageCount: 17822,
      percentage: 59,
      avgCharLength: 10.8,
      avgResponseTimeMin: 36.1,
      startedPercentage: 58,
      totalEmojis: 1290,
      singleWordReplyCount: 342,
      singleWordReplyPercent: 19,
      topEmojis: [
        { emoji: "👍", count: 96 },
        { emoji: "😘", count: 89 }
      ]
    },
    user2: {
      name: "nisa cici",
      color: "#0F172A",
      messageCount: 12178,
      percentage: 41,
      avgCharLength: 14.7,
      avgResponseTimeMin: 42.0,
      startedPercentage: 42,
      totalEmojis: 887,
      singleWordReplyCount: 215,
      singleWordReplyPercent: 18,
      topEmojis: [
        { emoji: "🥺", count: 107 },
        { emoji: "😣", count: 93 },
        { emoji: "😘", count: 80 }
      ]
    }
  },
  timeDistribution: {
    hourly: [
      { label: "00:00", count: 850 },
      { label: "03:00", count: 210 },
      { label: "06:00", count: 120 },
      { label: "09:00", count: 1450 },
      { label: "12:00", count: 2600 },
      { label: "15:00", count: 3100 },
      { label: "18:00", count: 3900 },
      { label: "21:00", count: 5200 },
      { label: "22:00", count: 6400 },
      { label: "23:00", count: 4800 }
    ],
    daily: [
      { label: "Pazartesi", count: 4100 },
      { label: "Salı", count: 3950 },
      { label: "Çarşamba", count: 4300 },
      { label: "Perşembe", count: 4200 },
      { label: "Cuma", count: 4600 },
      { label: "Cumartesi", count: 3800 },
      { label: "Pazar", count: 5050 }
    ],
    monthly: [
      { label: "Haz 25", count: 3800 },
      { label: "Ağu 25", count: 4500 },
      { label: "Eki 25", count: 2800 },
      { label: "Ara 25", count: 3400 },
      { label: "Şub 26", count: 1800 },
      { label: "Nis 26", count: 1200 },
      { label: "Haz 26", count: 1600 },
      { label: "Ağu 26", count: 900 }
    ],
    timeline: [
      { label: "Haz 25", count: 3800 },
      { label: "Tem 25", count: 4200 },
      { label: "Ağu 25", count: 4600 },
      { label: "Eyl 25", count: 2600 },
      { label: "Eki 25", count: 3400 },
      { label: "Kas 25", count: 2100 },
      { label: "Ara 25", count: 1800 },
      { label: "Oca 26", count: 2900 },
      { label: "Şub 26", count: 1400 },
      { label: "Mar 26", count: 1100 },
      { label: "Nis 26", count: 1500 },
      { label: "May 26", count: 800 },
      { label: "Haz 26", count: 1600 },
      { label: "Tem 26", count: 1100 },
      { label: "Ağu 26", count: 900 }
    ]
  },
  allTopEmojis: [
    { emoji: "🏻", count: 221 },
    { emoji: "😘", count: 169 },
    { emoji: "🥺", count: 145 },
    { emoji: "😣", count: 130 },
    { emoji: "😭", count: 115 },
    { emoji: "😁", count: 98 },
    { emoji: "👍", count: 96 },
    { emoji: "🙏", count: 88 },
    { emoji: "👅", count: 82 },
    { emoji: "❤️", count: 68 }
  ],
  flagsReport: {
    user1Flags: [
      {
        id: "u1_rf_1",
        type: "red",
        badge: "🚩",
        title: "Tek Kelimelik Cevap Alışkanlığı",
        desc: "Sohbette 342 kez tek kelimelik ('tm', 'ok', 'aynen') kısa cevap verdi.",
        exampleQuote: "\"tm\"",
        severity: "high"
      },
      {
        id: "u1_rf_2",
        type: "red",
        badge: "🚩",
        title: "Gece Mesajı Monopolü",
        desc: "Gece 01:25'te penguenlerin uçması gibi absürt felsefi konular açarak uyutmadı.",
        exampleQuote: "\"Penguenler uçabilseydi trafik olur muydu?\"",
        severity: "low"
      },
      {
        id: "u1_gf_1",
        type: "green",
        badge: "🟢",
        title: "Sohbet Başlatma Liderliği",
        desc: "Konuşmaların %58'ini bizzat başlatarak iletişimi asla koparmadı.",
        exampleQuote: "\"Günaydın!! Bugün plan yapıyoruz dimi?\"",
        severity: "high"
      },
      {
        id: "u1_gf_2",
        type: "green",
        badge: "🟢",
        title: "Hızlı Buluşma Organizasyonu",
        desc: "Mekana herkesten önce varıp masa kapma alışkanlığı.",
        exampleQuote: "\"Ben geçtim bile mekana köşedeki masadayım 🏎️⚡\"",
        severity: "medium"
      }
    ],
    user2Flags: [
      {
        id: "u2_rf_1",
        type: "red",
        badge: "🚩",
        title: "Gecikmeli Dönüş & Toplantı Bahanesi",
        desc: "Ortalama 42 dakika yanıt süresiyle ara sıra karşı tarafı merakta bıraktı.",
        exampleQuote: "\"Sakin ol ya toplantıdaydım haha!\"",
        severity: "high"
      },
      {
        id: "u2_rf_2",
        type: "red",
        badge: "🚩",
        title: "Dramatik Emoji Reaksiyonları",
        desc: "🥺 ve 😣 emojilerini (toplam 200 kez) duygu sömürüsü ve şaka amaçlı kullandı.",
        exampleQuote: "🥺 😣",
        severity: "medium"
      },
      {
        id: "u2_gf_1",
        type: "green",
        badge: "🟢",
        title: "Yüksek Mizah & Kahkaha Enerjisi",
        desc: "Sohbetteki en komik anketleri ve caps'leri paylaşarak enerjiyi zirveye taşıdı.",
        exampleQuote: "\"KSHWODHWODJWOEJWOD FATİHTERİM MUTLU\"",
        severity: "high"
      },
      {
        id: "u2_gf_2",
        type: "green",
        badge: "🟢",
        title: "Duygusal Açıklık & Samimiyet",
        desc: "Mesaj başına 14.7 karakter ile duygu ve düşüncelerini özenle paylaştı.",
        exampleQuote: "\"Evet ya çok iyi geldi mutlaka yapalım!\"",
        severity: "medium"
      }
    ],
    singleWordStats: {
      user1Count: 342,
      user2Count: 215,
      topWords: [
        { word: "tm", count: 124, sender: "Doğukan" },
        { word: "aynen", count: 98, sender: "Doğukan" },
        { word: "ok", count: 85, sender: "nisa cici" },
        { word: "peki", count: 62, sender: "nisa cici" }
      ]
    }
  },
  toxicityRadar: {
    dramaLevel: "Orta (Ara Sıra Gerilim)",
    tripScore: { user1: 38, user2: 45 },
    detectedPatterns: [
      { phrase: "Sen bilirsin", sender: "Doğukan", time: "17:59", context: "Buluşma yeri seçiminde çekimser pasif tavır", intensity: 84, tag: "Görünürde Teslimiyet" },
      { phrase: "İyi peki", sender: "nisa cici", time: "21:50", context: "Geç kalma uyarısı sonrası soğuk cevap", intensity: 90, tag: "Soğuk Onay" },
      { phrase: "Yok bişey", sender: "nisa cici", time: "23:10", context: "Merak edilen soruya üstü kapalı sitem", intensity: 78, tag: "Üstü Kapalı Sitem" }
    ],
    coldPeriods: [
      { dates: "1 Mayıs 2026 – 25 Mayıs 2026", hours: 575, triggerMessage: "575 saatlik büyük sessizlik dönemi" }
    ]
  },
  chatDictionary: {
    user1Words: [
      { word: "aynen", count: 184, meaning: "Hızlı onaylama ve geçiştirme jargonu", sender: "Doğukan" },
      { word: "harbiden", count: 96, meaning: "Şaşkınlık ve samimi onaylama", sender: "Doğukan" },
      { word: "hallederiz", count: 72, meaning: "Sorumluluk alma ve özgüven ifadesi", sender: "Doğukan" },
      { word: "kanka", count: 64, meaning: "Samimi arkadaş hitabı", sender: "Doğukan" }
    ],
    user2Words: [
      { word: "koptum", count: 152, meaning: "Aşırı komik durumlarda kahkaha ifadesi", sender: "nisa cici" },
      { word: "yaa", count: 118, meaning: "Duygusal tepki ve sitem ünlemi", sender: "nisa cici" },
      { word: "aşko", count: 88, meaning: "Sevgi dolu samimi seslenme", sender: "nisa cici" },
      { word: "şaka", count: 54, meaning: "Ortamı yumuşatma ifadesi", sender: "nisa cici" }
    ],
    sharedSlang: [
      { phrase: "Kadıköy / Moda Sahil", count: 32, description: "Buluşmaların değişmez merkezi" },
      { phrase: "Fatih Terim Modu", count: 14, description: "Beklenmedik bir başarı sonrası paylaşılan sevinç" },
      { phrase: "Jet Yanıt", count: 21, description: "1 dakika altındaki rekor cevaplaşmalar" }
    ]
  },
  timelineHighlights: [
    {
      id: "tl_1",
      date: "9 Haziran 2025",
      title: "İlk Kıvılcım & Kadıköy Planı",
      emoji: "🚀",
      description: "Doğukan'ın 'Günaydın!! Bugün plan yapıyoruz dimi?' mesajıyla efsanevi sohbet başladı.",
      messageCount: 38,
      quote: "\"Günaydın!! Bugün plan yapıyoruz dimi? ☕✨\"",
      sender: "Doğukan"
    },
    {
      id: "tl_2",
      date: "2 Ağustos 2025",
      title: "Büyük Anket & Fatih Terim Gecesi",
      emoji: "🔥",
      description: "nisa cici'nin açtığı 0 oylu anket ve Fatih Terim caps'leriyle rekor kahkaha atıldı.",
      messageCount: 94,
      quote: "\"KSHWODHWODJWOEJWOD FATİHTERİM MUTLU\"",
      sender: "nisa cici"
    },
    {
      id: "tl_3",
      date: "1 Mayıs 2026",
      title: "575 Saatlik Büyük Sessizlik",
      emoji: "❄️",
      description: "Araya giren 24 günlük yoğunluk ve ardından gelen büyük barışma dönemi.",
      messageCount: 575,
      quote: "\"1 Mayıs 2026 – 25 Mayıs 2026\"",
      sender: "Sistem"
    },
    {
      id: "tl_4",
      date: "17 Ağustos 2026",
      title: "En Son Mesaj & Güncel Zirve",
      emoji: "✨",
      description: "Doğukan'ın 'KEŞKE' mesajıyla 30.000 mesajlık dev arşiv tamamlandı.",
      messageCount: 17822,
      quote: "\"KEŞKE\"",
      sender: "Doğukan"
    }
  ],
  sentiment: {
    overallTone: "Nötr",
    dominantEmotion: "Memnuniyet",
    happiestDate: "31 Mayıs 2026",
    saddestDate: "26 Ocak 2026",
    categoryDistribution: [
      { category: "Mutluluk", count: 482, color: "#38BDF8" },
      { category: "Sevgi", count: 395, color: "#EC4899" },
      { category: "Eğlence", count: 320, color: "#F59E0B" },
      { category: "Minnettarlık", count: 215, color: "#10B981" },
      { category: "Sorun", count: 140, color: "#EF4444" },
      { category: "Üzüntü", count: 95, color: "#6366F1" }
    ],
    emotionalTimeline: [
      { week: "Haz 25", score: 65, label: "Pozitif" },
      { week: "Eyl 25", score: 78, label: "Çok Pozitif" },
      { week: "Ara 25", score: 50, label: "Nötr" },
      { week: "Mar 26", score: 85, label: "Çok Pozitif" },
      { week: "Haz 26", score: 60, label: "Pozitif" },
      { week: "Ağu 26", score: 72, label: "Çok Pozitif" }
    ],
    intenseMessages: [
      { sender: "Doğukan", time: "15:50", text: "KORKUYORUM", intensity: 100, emotion: "Korku" },
      { sender: "nisa cici", time: "21:50", text: "KSHWODHWODJWOEJWOD FATİHTERİM MUTLU", intensity: 100, emotion: "Mutluluk" },
      { sender: "nisa cici", time: "23:10", text: "ANKET: Ben cok iyi biriyim dimi SEÇENEK: Eed (0 oy) SEÇENEK: Evet (0 oy)", intensity: 43, emotion: "Memnuniyet" },
      { sender: "Doğukan", time: "17:59", text: "KEŞKE", intensity: 100, emotion: "Pişmanlık" }
    ],
    relationshipRoles: {
      romanticScore: { user1: 116, user2: 48 },
      funnyScore: { user1: 28, user2: 35 },
      titles: {
        "Doğukan": ["Gece Kuşu", "Romantik Lider", "Hızlı Cevapçı"],
        "nisa cici": ["Grup Neşesi", "Emoji Şampiyonu", "Meraklı"]
      }
    }
  }
};
