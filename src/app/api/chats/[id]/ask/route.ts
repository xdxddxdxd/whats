import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { chatAnalyticsData, DEMO_CHAT_TITLE } from '@/lib/demo/demo-data';
import { formatDeterministicMetrics } from '@/lib/analytics/stats-engine';
import { buildAskPrompt, GroundedFacts } from '@/lib/ai/insight-context';
import { retrieveContextNotes } from '@/lib/ai/retrieval';
import { formatWallClockDate } from '@/lib/utils/formatters';
import { assertChatAccess, ApiError } from '@/lib/supabase/guards';

const MAX_QUESTIONS_PER_CHAT = 5;

function buildUsersFromChatData(chatData: any): Array<{ name: string; messageCount: number; percentage: number }> {
  // Prefer full participants list (groups)
  if (Array.isArray(chatData?.participants) && chatData.participants.length > 0) {
    return chatData.participants.map((p: any) => ({
      name: p.name || p.sender || 'Katılımcı',
      messageCount: p.messageCount || p.count || 0,
      percentage: Math.round(p.messagePercentage ?? p.percentage ?? 0),
    }));
  }
  // DeterministicMetrics shape
  if (chatData?.users?.user1 || chatData?.users?.user2) {
    const list = [];
    if (chatData.users.user1) {
      list.push({
        name: chatData.users.user1.name,
        messageCount: chatData.users.user1.messageCount || 0,
        percentage: chatData.users.user1.percentage || 0,
      });
    }
    if (chatData.users.user2) {
      list.push({
        name: chatData.users.user2.name,
        messageCount: chatData.users.user2.messageCount || 0,
        percentage: chatData.users.user2.percentage || 0,
      });
    }
    return list;
  }
  return [
    { name: 'Kullanıcı 1', messageCount: 0, percentage: 50 },
    { name: 'Kullanıcı 2', messageCount: 0, percentage: 50 },
  ];
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { question } = body;

    if (!question || typeof question !== 'string' || question.trim().length === 0 || question.length > 500) {
      return NextResponse.json({ error: 'Geçerli bir soru girilmedi (Maksimum 500 karakter).' }, { status: 400 });
    }

    let chatData: any = null;
    let chatTitle = 'WhatsApp Sohbeti';
    let rawChatTotal = 0;
    let firstDateRaw: string | null = null;
    let lastDateRaw: string | null = null;
    let serverAskCount = 0;
    let reservationSucceeded = false;
    let priorAsks: Array<{ question: string; answer: string }> = [];

    if (id === 'demo') {
      chatData = chatAnalyticsData;
      chatTitle = DEMO_CHAT_TITLE;
    } else {
      const ownerToken = req.headers.get('x-owner-token') || new URL(req.url).searchParams.get('owner_token');
      const guestToken = req.headers.get('x-guest-token') || new URL(req.url).searchParams.get('guest_token');

      const supabase = createServerSupabaseClient();
      
      // 1. Verify Access via central guard
      const { chat: chatRow } = await assertChatAccess(supabase, id, { ownerToken, guestToken });

      const isProHeader = req.headers.get('x-is-pro') === 'true' || body.isPro === true;

      // 2. Atomic Question Count Reservation / Check (Pro kullanıcılar sınırsızdır)
      serverAskCount = typeof (chatRow as any).ask_count === 'number' ? (chatRow as any).ask_count : 0;
      if (!isProHeader && serverAskCount >= MAX_QUESTIONS_PER_CHAT) {
        return NextResponse.json(
          {
            error: `Yapay zeka asistanı PRO üyelere özeldir. Lütfen PRO'ya geçin.`,
            limitReached: true,
            remainingQuestions: 0,
            maxQuestions: MAX_QUESTIONS_PER_CHAT,
          },
          { status: 429 }
        );
      }

      // Try atomic RPC increment first if migration function exists
      try {
        const { data: rpcVal, error: rpcErr } = await supabase.rpc('increment_chat_ask_count', {
          target_chat_id: id,
          max_allowed: MAX_QUESTIONS_PER_CHAT
        });
        if (!rpcErr && typeof rpcVal === 'number') {
          if (rpcVal === -1) {
            return NextResponse.json(
              {
                error: `Soru limitiniz doldu (${MAX_QUESTIONS_PER_CHAT}/${MAX_QUESTIONS_PER_CHAT}). Her sohbet için maksimum 5 soru sorabilirsiniz.`,
                limitReached: true,
                remainingQuestions: 0,
                maxQuestions: MAX_QUESTIONS_PER_CHAT,
              },
              { status: 429 }
            );
          }
          serverAskCount = rpcVal - 1;
          reservationSucceeded = true;
        }
      } catch {
        // RPC might not exist yet, fallback to check
      }

      const { data: analysisRow } = await supabase
        .from('chat_analyses')
        .select('*')
        .eq('chat_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Prior Q&A history (last 5)
      try {
        const { data: asks } = await supabase
          .from('chat_asks')
          .select('question, answer')
          .eq('chat_id', id)
          .order('created_at', { ascending: false })
          .limit(5);
        priorAsks = (asks || []).reverse();
      } catch {
        priorAsks = [];
      }

      chatTitle = chatRow.title || 'WhatsApp Sohbeti';
      rawChatTotal = chatRow.total_messages || 0;
      firstDateRaw = chatRow.first_message_date;
      lastDateRaw = chatRow.last_message_date;

      if (analysisRow?.metrics) {
        const raw = analysisRow.metrics as any;
        const formatted = raw.participants && Array.isArray(raw.participants)
          ? formatDeterministicMetrics(raw)
          : raw;
        // Keep participants array for group-aware prompts
        chatData = {
          ...formatted,
          participants: raw.participants || formatted.participants,
        };
      } else {
        chatData = chatAnalyticsData;
      }
    }

    const totalMessages = chatData?.totalMessages || chatData?.summary?.totalMessages || rawChatTotal || 0;
    const startDate =
      chatData?.startDate ||
      chatData?.summary?.startDate ||
      (firstDateRaw ? formatWallClockDate(firstDateRaw) : 'Kayıt Başlangıcı');
    const endDate =
      chatData?.endDate ||
      chatData?.summary?.endDate ||
      (lastDateRaw ? formatWallClockDate(lastDateRaw) : 'Kayıt Sonu');
    const daysCount = chatData?.daysCount || chatData?.summary?.daysCount || 1;
    const longestSilenceHours = chatData?.longestSilenceHours || chatData?.summary?.longestSilenceHours || 0;
    const longestSilenceDates = chatData?.longestSilenceDates || chatData?.summary?.longestSilenceDates || '-';
    const mostActiveHour = chatData?.mostActiveHour || chatData?.summary?.mostActiveHour || '22:00';
    const mostActiveDay = chatData?.mostActiveDay || chatData?.summary?.mostActiveDay || 'Pazar';
    const mostActiveDate = chatData?.mostActiveDate || chatData?.summary?.mostActiveDate || '-';

    const users = buildUsersFromChatData(chatData);
    const u1 = users[0] || { name: 'Kullanıcı 1', messageCount: 0, percentage: 50 };
    const u2 = users[1] || { name: 'Kullanıcı 2', messageCount: 0, percentage: 50 };
    const toxicity = chatData?.toxicityRadar || {};
    const dramaLevel = toxicity?.dramaLevel || 'Düşük';
    const detectedPatterns = (toxicity?.detectedPatterns || [])
      .map((p: any) => `"${p.phrase}" (${p.sender} - ${p.tag})`)
      .join(', ');
    const dictionary = chatData?.chatDictionary?.sharedSlang || [];
    const topWords1 = chatData?.chatDictionary?.user1Words || [];
    const topWords2 = chatData?.chatDictionary?.user2Words || [];
    const timeline = chatData?.timelineHighlights || [];
    const intense = chatData?.sentiment?.intenseMessages || [];

    const participantRankNote =
      users.length > 2
        ? `Grup sıralaması: ${users
            .slice()
            .sort((a, b) => b.messageCount - a.messageCount)
            .map((u, i) => `${i + 1}. ${u.name} (${u.messageCount} / %${u.percentage})`)
            .join(' · ')}`
        : '';

    const historyNote =
      priorAsks.length > 0
        ? `Önceki soru-cevaplar:\n${priorAsks
            .map((a, i) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer.slice(0, 280)}`)
            .join('\n')}`
        : '';

    const geminiKey = process.env.GEMINI_API_KEY;
    const qLower = question.toLowerCase();
    let answer = '';
    const factsUsed: string[] = [];

    if (geminiKey) {
      try {
        const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

        const groundedFacts: GroundedFacts = {
          title: chatTitle,
          totalMessages,
          startDate,
          endDate,
          daysCount,
          users,
          mostActiveHour,
          mostActiveDay,
          longestSilenceHours,
          longestSilenceDates,
          insight: chatData?.insightBundle || null,
          extraNotes: [
            ...retrieveContextNotes(question, chatData),
            participantRankNote,
            historyNote,
            detectedPatterns
              ? `İfade kalıpları: ${detectedPatterns}`
              : 'Belirgin sitem/küslük kalıbı listelenmedi.',
            `Gerilim sinyal yoğunluğu: ${dramaLevel}`,
            topWords1.length
              ? `${u1.name} ikonik: ${topWords1.slice(0, 5).map((w: any) => `${w.word}(${w.count})`).join(', ')}`
              : '',
            topWords2.length
              ? `${u2.name} ikonik: ${topWords2.slice(0, 5).map((w: any) => `${w.word}(${w.count})`).join(', ')}`
              : '',
            dictionary.length
              ? `Ortak jargon: ${dictionary.slice(0, 5).map((d: any) => d.phrase).join(', ')}`
              : '',
            timeline.length
              ? `Önemli anlar: ${timeline.slice(0, 4).map((t: any) => t.title).join(' | ')}`
              : '',
          ].filter(Boolean),
        };

        const prompt = buildAskPrompt(question, groundedFacts);

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': geminiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.4 },
          }),
          signal: AbortSignal.timeout(5000),
        });

        if (res.ok) {
          const data = await res.json();
          const generated = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generated && generated.trim().length > 5 && !generated.includes('sunulmadı')) {
            answer = generated.trim();
            factsUsed.push(
              `Sohbet: ${chatTitle}`,
              `Toplam: ${totalMessages.toLocaleString('tr-TR')} mesaj`,
              users.length > 2 ? `${users.length} katılımcı` : 'Insight grounded'
            );
          }
        }
      } catch (llmErr) {
        console.warn('Gemini ask assistant notice:', llmErr);
      }
    }

    if (!answer) {
      if (users.length > 2 && (qLower.includes('en çok kim') || qLower.includes('kim daha çok') || qLower.includes('sessiz') || qLower.includes('oran') || qLower.includes('sayı'))) {
        const ranked = [...users].sort((a, b) => b.messageCount - a.messageCount);
        const quiet = [...users].sort((a, b) => a.messageCount - b.messageCount)[0];
        answer = `Grupta mesaj lideri ${ranked[0].name} (%${ranked[0].percentage}, ${ranked[0].messageCount.toLocaleString('tr-TR')} mesaj). En az yazan: ${quiet.name} (%${quiet.percentage}). Sıra: ${ranked.map((u) => `${u.name} %${u.percentage}`).join(' → ')}.`;
        factsUsed.push(...ranked.slice(0, 4).map((u) => `${u.name}: %${u.percentage}`));
      } else if (qLower.includes('nerede') || qLower.includes('nerde') || qLower.includes('yaşıyor') || qLower.includes('tanıştık') || qLower.includes('şehir') || qLower.includes('mekan')) {
        const firstQuote = timeline.find((t: any) => t.id === 'tl_first')?.quote;
        answer = `Sohbet kayıtlarında belirli bir tanışma şehri veya mekan ismi geçmiyor. İlk mesajlaşma ${startDate} tarihinde${firstQuote ? ` "${firstQuote}" ile` : ''} başlamıştır.`;
        factsUsed.push(`Başlangıç: ${startDate}`);
      } else if (qLower.includes('tartış') || qLower.includes('kavga') || qLower.includes('trip') || qLower.includes('gerilim') || qLower.includes('sitem')) {
        const patternText = detectedPatterns
          ? `Ölçülen ifade kalıpları: ${detectedPatterns}`
          : 'Belirgin gerilim kalıbı listelenmedi.';
        answer = `Gerilim sinyal yoğunluğu "${dramaLevel}" olarak hesaplandı (hüküm değil, kalıp yoğunluğu). ${patternText} En uzun sessizlik ${longestSilenceDates} aralığında ${longestSilenceHours} saat.`;
        factsUsed.push(`Sinyal yoğunluğu: ${dramaLevel}`, `En uzun sessizlik: ${longestSilenceHours} saat`);
      } else if (qLower.includes('ilk') || qLower.includes('nasıl başladı') || qLower.includes('başlangıç')) {
        const firstQuote = timeline.find((t: any) => t.id === 'tl_first')?.quote;
        answer = `Sohbet ${startDate} tarihinde başladı. Toplam ${totalMessages.toLocaleString('tr-TR')} mesaj, ${users.length} katılımcı.${firstQuote ? ` İlk mesaj: ${firstQuote}` : ''}`;
        factsUsed.push(`Başlangıç: ${startDate}`, `Katılımcı: ${users.length}`);
      } else if (qLower.includes('en çok kim') || qLower.includes('kim daha çok') || qLower.includes('oran') || qLower.includes('sayı')) {
        answer = `Sohbette mesaj lideri %${u1.percentage} oran ve ${(u1.messageCount || 0).toLocaleString('tr-TR')} mesajla ${u1.name} oldu. ${u2.name} ise %${u2.percentage} oran (${(u2.messageCount || 0).toLocaleString('tr-TR')} mesaj) ile sohbete katıldı.`;
        factsUsed.push(`${u1.name}: %${u1.percentage}`, `${u2.name}: %${u2.percentage}`);
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
        factsUsed.push(`Sohbet: ${chatTitle}`);
      } else if (qLower.includes('komik') || qLower.includes('en komik') || qLower.includes('kahkaha') || qLower.includes('anı')) {
        const bestQuote = intense[0]?.text || chatData?.calculatedSuperlatives?.hypeTrain?.sampleMessages?.[0] || 'Harika anlar';
        answer = `Sohbetin en hareketli ve neşeli dönemi ${mostActiveDate} tarihinde yaşandı. Öne çıkan yoğun anlardan bir alıntı: "${String(bestQuote).replace(/^\[\d{2}:\d{2}\]\s*/, '')}"`;
        factsUsed.push(`Aktivite Zirvesi: ${mostActiveDate}`);
      } else {
        const names = users.map((u) => `${u.name} (%${u.percentage})`).join(', ');
        answer = `${chatTitle} sohbet verilerine göre: Toplam ${totalMessages.toLocaleString('tr-TR')} mesaj. Katılımcılar: ${names}. En yoğun saat ${mostActiveHour}, en aktif gün ${mostActiveDay}.`;
        factsUsed.push(`Aktif Saat: ${mostActiveHour}`, `Aktif Gün: ${mostActiveDay}`);
      }
    }

    let newAskCount = reservationSucceeded ? serverAskCount + 1 : serverAskCount + 1;
    if (id !== 'demo') {
      try {
        const supabase = createServerSupabaseClient();
        if (!reservationSucceeded) {
          const { data: updated } = await supabase
            .from('chats')
            .update({ ask_count: newAskCount } as any)
            .eq('id', id)
            .select('ask_count')
            .single();
          if (updated && typeof (updated as any).ask_count === 'number') {
            newAskCount = (updated as any).ask_count;
          }
        }

        // Persist Q&A history
        await supabase.from('chat_asks').insert({
          chat_id: id,
          question: question.trim(),
          answer,
          facts_used: factsUsed as any,
        });
      } catch (incErr) {
        console.warn('ask_count / chat_asks write skipped:', incErr);
      }
    }

    return NextResponse.json({
      answer,
      factsUsed,
      remainingQuestions: isProHeader ? 999 : Math.max(0, MAX_QUESTIONS_PER_CHAT - newAskCount),
      maxQuestions: MAX_QUESTIONS_PER_CHAT,
      questionCount: newAskCount,
    });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('AI Chat Hatası:', error);
    return NextResponse.json(
      { error: error.message || 'AI yanıtı üretilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
