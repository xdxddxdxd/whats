import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { extractIncrementalMessages } from '@/lib/parser/whatsapp-parser';
import { calculateChatMetrics } from '@/lib/analytics/stats-engine';
import { generateAIAnalysis } from '@/lib/ai/ai-service';
import JSZip from 'jszip';

export const maxDuration = 60;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chatId = params.id;
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const ownerToken = formData.get('owner_token') as string | null;

    if (!ownerToken) {
      return NextResponse.json({ error: 'Yetkilendirme hatası.' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // 1. Fetch Chat
    const { data: chatData, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .single();

    const chat = chatData as any;

    if (chatError || !chat) {
      return NextResponse.json({ error: 'Sohbet bulunamadı.' }, { status: 404 });
    }

    if (chat.owner_token !== ownerToken) {
      return NextResponse.json({ error: 'Bu sohbeti güncelleme yetkiniz yok.' }, { status: 403 });
    }

    if (!file) {
      return NextResponse.json({ error: 'Lütfen güncel WhatsApp dosyasını (.txt veya .zip) yükleyin.' }, { status: 400 });
    }

    let rawText = '';
    const isZip = file.name.toLowerCase().endsWith('.zip') || file.type.includes('zip');

    if (isZip) {
      const buffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(buffer);
      let txtInZip = zip.file('_chat.txt');
      if (!txtInZip) {
        const txtFiles = zip.file(/\.txt$/i);
        if (txtFiles && txtFiles.length > 0) txtInZip = txtFiles[0];
      }
      if (!txtInZip) {
        return NextResponse.json({ error: 'ZIP arşivi içinde WhatsApp sohbet metin dosyası (_chat.txt) bulunamadı.' }, { status: 400 });
      }
      rawText = await txtInZip.async('string');
    } else {
      rawText = await file.text();
    }

    // 2. Incremental Parsing: Parse all messages and detect new ones
    const { newMessages, allMessages, hasNew } = extractIncrementalMessages(rawText, chat.last_message_hash);

    if (!hasNew || allMessages.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Yeni mesaj bulunamadı. Sohbet zaten en güncel halinde.',
        newMessagesCount: 0
      });
    }

    // 3. Recalculate metrics from complete dataset
    const metrics = calculateChatMetrics(allMessages);
    const lastMsg = allMessages[allMessages.length - 1];

    // 4. Generate AI analysis
    const aiResult = await generateAIAnalysis(chat.title, metrics, chat.chat_type);

    // 5. Update Chat in Supabase
    await supabase
      .from('chats')
      .update({
        total_messages: metrics.totalMessages,
        total_participants: metrics.participants.length,
        last_message_date: lastMsg.timestamp.toISOString(),
        last_message_hash: lastMsg.hash,
        updated_at: new Date().toISOString()
      })
      .eq('id', chatId);

    // 6. Update Chat Analyses
    const { data: currentAnalysisData } = await supabase
      .from('chat_analyses')
      .select('id, version')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const currentAnalysis = currentAnalysisData as any;

    if (currentAnalysis) {
      await supabase
        .from('chat_analyses')
        .update({
          metrics: metrics as any,
          superlatives: aiResult.superlatives as any,
          wrapped_slides: aiResult.wrappedSlides as any,
          ai_summary: aiResult.summary,
          version: (currentAnalysis.version || 1) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentAnalysis.id);
    } else {
      await supabase.from('chat_analyses').insert({
        chat_id: chatId,
        metrics: metrics as any,
        superlatives: aiResult.superlatives as any,
        wrapped_slides: aiResult.wrappedSlides as any,
        ai_summary: aiResult.summary,
        version: 1
      });
    }

    return NextResponse.json({
      success: true,
      message: `${newMessages.length} yeni mesaj başarıyla işlendi ve analiz güncellendi!`,
      newMessagesCount: newMessages.length,
      totalMessages: metrics.totalMessages
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Artımlı güncelleme başarısız.' }, { status: 500 });
  }
}
