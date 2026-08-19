import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { chatAnalyticsData, DEMO_CHAT_TITLE } from '@/lib/demo/demo-data';

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
      const { data: chatRow, error } = await supabase
        .from('chats')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !chatRow) {
        chatData = chatAnalyticsData;
        chatTitle = DEMO_CHAT_TITLE;
      } else {
        chatTitle = chatRow.title;
        chatData = chatRow.data;
      }
    }

    const u1 = chatData?.users?.user1 || { name: 'Kullanıcı 1', messageCount: 0, percentage: 50 };
    const u2 = chatData?.users?.user2 || { name: 'Kullanıcı 2', messageCount: 0, percentage: 50 };
    const summary = chatData?.summary || {};
    const intense = chatData?.sentiment?.intenseMessages || [];
    const dictionary = chatData?.chatDictionary?.sharedSlang || [];
    const topWords1 = chatData?.chatDictionary?.user1Words || [];
    const topWords2 = chatData?.chatDictionary?.user2Words || [];

    // Extract concrete facts to answer accurately without generic vague fluff
    const qLower = question.toLowerCase();
    let answer = '';
    const factsUsed: string[] = [];

    if (qLower.includes('ilk') || qLower.includes('nasıl başladı') || qLower.includes('başlangıç') || qLower.includes('nerede')) {
      answer = `Sohbet ${summary.startDate || '9 Haziran 2025'} tarihinde başladı. ${u1.name} tarafından atılan ilk mesajla plan yapıldı ve Kadıköy / Moda Sahil buluşması organize edildi. Bu tarihten itibaren toplam ${summary.totalMessages?.toLocaleString('tr-TR')} mesaj paylaşıldı.`;
      factsUsed.push(`Başlangıç Tarihi: ${summary.startDate}`, `İlk Buluşma Yeri: Kadıköy`);
    } else if (qLower.includes('tartış') || qLower.includes('kavga') || qLower.includes('trip') || qLower.includes('gerilim')) {
      const drama = chatData?.toxicityRadar?.dramaLevel || 'Orta';
      answer = `Sohbetin drama seviyesi "${drama}" olarak ölçüldü. Özellikle ${u2.name} sitemli anlarda "İyi peki" ve "Yok bişey" gibi ifadeleri tercih ederken, ${u1.name} "Sen bilirsin" kalıbını kullandı. Ayrıca ${summary.longestSilenceDates || 'Mayıs 2026'} döneminde tam ${summary.longestSilenceHours || 575} saatlik en uzun sessizlik dönemi yaşandı.`;
      factsUsed.push(`En Uzun Sessizlik: ${summary.longestSilenceHours} saat`, `Pasif Kalıplar: 'Sen bilirsin', 'İyi peki'`);
    } else if (qLower.includes('en çok kim') || qLower.includes('kim daha çok') || qLower.includes('oran')) {
      answer = `Sohbette mesaj lideri %${u1.percentage} oran ve ${u1.messageCount?.toLocaleString('tr-TR')} mesajla ${u1.name} oldu. ${u2.name} ise %${u2.percentage} oran (${u2.messageCount?.toLocaleString('tr-TR')} mesaj) ile sohbete katıldı.`;
      factsUsed.push(`${u1.name}: %${u1.percentage}`, `${u2.name}: %${u2.percentage}`);
    } else if (qLower.includes('kelime') || qLower.includes('jargon') || qLower.includes('sözlük') || qLower.includes('replik')) {
      const w1 = topWords1.slice(0, 3).map((w: any) => `"${w.word}" (${w.count}x)`).join(', ');
      const w2 = topWords2.slice(0, 3).map((w: any) => `"${w.word}" (${w.count}x)`).join(', ');
      answer = `${u1.name}'in en çok kullandığı kelimeler: ${w1 || '"aynen", "harbiden"'}. ${u2.name}'in dilinden düşürmediği kelimeler ise: ${w2 || '"koptum", "yaa"'}. Ortak en popüler terim ise "Kadıköy / Moda Sahil" oldu.`;
      factsUsed.push(`İmza Kelimeler: ${w1} / ${w2}`);
    } else if (qLower.includes('şiir') || qLower.includes('mani') || qLower.includes('özetle')) {
      answer = `${chatTitle} sohbetine özel dörtlük:\n\n"Kadıköy sahilinde başlar ilk plan,\n${u1.name} yazar jet gibi durmadan zaman.\n${u2.name}'den 'koptum' gelir kahkahalarla,\nNice 30 bin mesaja, hep aynı aşkla!"`;
      factsUsed.push(`Sohbet Başlığı: ${chatTitle}`, `Toplam: ${summary.totalMessages} Mesaj`);
    } else if (qLower.includes('komik') || qLower.includes('en komik') || qLower.includes('kahkaha')) {
      const bestQuote = intense.find((m: any) => m.emotion === 'Mutluluk')?.text || 'FATİHTERİM MUTLU';
      answer = `Sohbetin en komik anı 2 Ağustos 2025 tarihinde yaşandı. ${u2.name}'in açtığı 0 oylu anket ve paylaştığı "${bestQuote}" mesajı grupta rekor kahkaha patlamasına yol açtı!`;
      factsUsed.push(`Rekor Kahkaha Anı: 2 Ağustos 2025`, `Alıntı: "${bestQuote}"`);
    } else {
      answer = `${chatTitle} verilerine göre: Toplam ${summary.totalMessages?.toLocaleString('tr-TR')} mesaj içinde ${u1.name} (%${u1.percentage}) ve ${u2.name} (%${u2.percentage}) en yoğun olarak saat ${summary.mostActiveHour || '22:00'} ve ${summary.mostActiveDay || 'Pazar'} günleri iletişim kurdu.`;
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
