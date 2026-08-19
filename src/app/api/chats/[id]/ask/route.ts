import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { chatAnalyticsData, DEMO_CHAT_TITLE } from '@/lib/demo/demo-data';
import { formatDeterministicMetrics } from '@/lib/analytics/stats-engine';

const MAX_QUESTIONS_PER_CHAT = 5;

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { question, questionCount = 0 } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Geçerli bir soru girilmedi.' }, { status: 400 });
    }

    if (questionCount >= MAX_QUESTIONS_PER_CHAT) {
      return NextResponse.json(
        {
          error: `Soru limitiniz doldu (${MAX_QUESTIONS_PER_CHAT}/${MAX_QUESTIONS_PER_CHAT}). Her sohbet için maksimum 5 soru sorabilirsiniz.`,
          limitReached: true
        },
        { status: 429 }
      );
    }

    let chatData: any = null;
    let chatTitle = 'WhatsApp Sohbeti';

    if (id === 'demo') {
      chatData = chatAnalyticsData;
      chatTitle = DEMO_CHAT_TITLE;
    } else {
      const supabase = createServerSupabaseClient();
      const { data: chatRow } = await supabase
        .from('chats')
        .select('*')
        .eq('id', id)
        .single();

      const { data: analysisRow } = await supabase
        .from('chat_analyses')
        .select('*')
        .eq('chat_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (chatRow) {
        chatTitle = chatRow.title || 'WhatsApp Sohbeti';
      }

      if (analysisRow?.metrics) {
        const raw = analysisRow.metrics;
        const formatted = raw.participants && Array.isArray(raw.participants)
          ? formatDeterministicMetrics(raw)
          : raw;
        chatData = formatted;
      } else {
        chatData = chatAnalyticsData;
      }
    }

    const u1 = chatData?.users?.user1 || { name: 'Kullanıcı 1', messageCount: 0, percentage: 50 };
    const u2 = chatData?.users?.user2 || { name: 'Kullanıcı 2', messageCount: 0, percentage: 50 };
    const summary = chatData?.summary || {};
    const intense = chatData?.sentiment?.intenseMessages || [];
    const dictionary = chatData?.chatDictionary?.sharedSlang || [];
    const topWords1 = chatData?.chatDictionary?.user1Words || [];
    const topWords2 = chatData?.chatDictionary?.user2Words || [];
    const timeline = chatData?.timelineHighlights || [];

    // Extract concrete facts to answer accurately without generic vague fluff
    const qLower = question.toLowerCase();
    let answer = '';
    const factsUsed: string[] = [];

    if (qLower.includes('ilk') || qLower.includes('nasıl başladı') || qLower.includes('başlangıç') || qLower.includes('nerede')) {
      const firstQuote = timeline.find((t: any) => t.id === 'tl_first')?.quote;
      answer = `Sohbet ${summary.startDate || 'ilk günden beri'} tarihinde başladı. ${u1.name} ve ${u2.name} arasında başlayan bu diyalogda toplam ${summary.totalMessages?.toLocaleString('tr-TR')} mesaj paylaşıldı.`;
      if (firstQuote) {
        answer += ` İlk mesaj alıntısı: ${firstQuote}`;
        factsUsed.push(`İlk Mesaj: ${firstQuote}`);
      }
      factsUsed.push(`Başlangıç: ${summary.startDate || 'Kayıt Başlangıcı'}`, `Toplam: ${summary.totalMessages} mesaj`);
    } else if (qLower.includes('tartış') || qLower.includes('kavga') || qLower.includes('trip') || qLower.includes('gerilim')) {
      const drama = chatData?.toxicityRadar?.dramaLevel || 'Düşük';
      const patterns = chatData?.toxicityRadar?.detectedPatterns || [];
      const patternText = patterns.length > 0
        ? `Öne çıkan sitemli kalıp: "${patterns[0].phrase}" (${patterns[0].sender})`
        : 'Sohbette yüksek gerilim kalıbı tespit edilmedi.';
      answer = `Sohbetin drama ve sitem seviyesi "${drama}" olarak ölçüldü. ${patternText}. En uzun sessizlik dönemi ise ${summary.longestSilenceDates || 'kayıtlı aralıkta'} tam ${summary.longestSilenceHours || 0} saat sürdü.`;
      factsUsed.push(`Drama Seviyesi: ${drama}`, `En Uzun Sessizlik: ${summary.longestSilenceHours} saat`);
    } else if (qLower.includes('en çok kim') || qLower.includes('kim daha çok') || qLower.includes('oran') || qLower.includes('sayı')) {
      answer = `Sohbette mesaj lideri %${u1.percentage} oran ve ${u1.messageCount?.toLocaleString('tr-TR')} mesajla ${u1.name} oldu. ${u2.name} ise %${u2.percentage} oran (${u2.messageCount?.toLocaleString('tr-TR')} mesaj) ile katılım sağladı.`;
      factsUsed.push(`${u1.name}: %${u1.percentage} (${u1.messageCount} mesaj)`, `${u2.name}: %${u2.percentage} (${u2.messageCount} mesaj)`);
    } else if (qLower.includes('kelime') || qLower.includes('jargon') || qLower.includes('sözlük') || qLower.includes('replik')) {
      const w1 = topWords1.slice(0, 3).map((w: any) => `"${w.word}" (${w.count}x)`).join(', ');
      const w2 = topWords2.slice(0, 3).map((w: any) => `"${w.word}" (${w.count}x)`).join(', ');
      const slangSample = dictionary.length > 0 ? `Ortak ifade kalıbı: "${dictionary[0].phrase}"` : '';
      answer = `${u1.name}'in en çok kullandığı kelimeler: ${w1 || 'tespit ediliyor'}. ${u2.name}'in en sık kullandığı kelimeler: ${w2 || 'tespit ediliyor'}. ${slangSample}`;
      factsUsed.push(`İmza Kelimeler: ${w1} | ${w2}`);
    } else if (qLower.includes('şiir') || qLower.includes('mani') || qLower.includes('özetle')) {
      const topWord1 = topWords1[0]?.word || 'sohbet';
      const topWord2 = topWords2[0]?.word || 'muhabbet';
      answer = `${chatTitle} sohbetine özel dörtlük:\n\n"Mesajlar akar durur ekranda her an,\n${u1.name} '${topWord1}' der, geçip gider zaman.\n${u2.name} '${topWord2}' ile neşe saçar ortama,\nNice güzel anılara, nice bol kahkahaya!"`;
      factsUsed.push(`Sohbet Başlığı: ${chatTitle}`, `Toplam: ${summary.totalMessages} Mesaj`);
    } else if (qLower.includes('komik') || qLower.includes('en komik') || qLower.includes('kahkaha') || qLower.includes('anı')) {
      const bestQuote = intense[0]?.text || chatData?.calculatedSuperlatives?.hypeTrain?.sampleMessages?.[0] || 'Harika anlar';
      const peakDay = summary.mostActiveDate || 'Yoğun gün';
      answer = `Sohbetin en hareketli ve neşeli dönemi ${peakDay} tarihinde yaşandı. Öne çıkan yoğun anlardan bir alıntı: "${bestQuote.replace(/^\[\d{2}:\d{2}\]\s*/, '')}"`;
      factsUsed.push(`Aktivite Zirvesi: ${peakDay}`, `Alıntı: "${bestQuote}"`);
    } else {
      answer = `${chatTitle} sohbet verilerine göre: Toplam ${summary.totalMessages?.toLocaleString('tr-TR')} mesaj içinde ${u1.name} (%${u1.percentage}) ve ${u2.name} (%${u2.percentage}) en yoğun olarak saat ${summary.mostActiveHour || 'belirlenen saatler'} ve ${summary.mostActiveDay || 'belirlenen gün'} günleri mesajlaştı.`;
      factsUsed.push(`Aktif Saat: ${summary.mostActiveHour}`, `Aktif Gün: ${summary.mostActiveDay}`);
    }

    return NextResponse.json({
      answer,
      factsUsed,
      remainingQuestions: Math.max(0, MAX_QUESTIONS_PER_CHAT - (questionCount + 1)),
      maxQuestions: MAX_QUESTIONS_PER_CHAT
    });

  } catch (error: any) {
    console.error('AI Chat Hatası:', error);
    return NextResponse.json(
      { error: error.message || 'AI yanıtı üretilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
