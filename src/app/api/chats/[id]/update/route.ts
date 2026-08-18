import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { extractIncrementalMessages } from '@/lib/parser/whatsapp-parser';
import { calculateChatMetrics } from '@/lib/analytics/stats-engine';
import { generateAIAnalysis } from '@/lib/ai/ai-service';
import { assertChatOwner, ApiError } from '@/lib/supabase/guards';
import { extractRawTextFromUpload } from '@/lib/utils/extract-chat-text';
import { Database } from '@/lib/supabase/types';

export const maxDuration = 15;

type ChatAnalysisRow = Database['public']['Tables']['chat_analyses']['Row'];

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chatId = params.id;
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const ownerToken = formData.get('owner_token') as string | null;

    const supabase = createServerSupabaseClient();

    // 1. Assert Ownership
    const chat = await assertChatOwner(supabase, chatId, ownerToken);

    if (!file) {
      return NextResponse.json({ error: 'Lütfen güncel WhatsApp dosyasını (.txt veya .zip) yükleyin.' }, { status: 400 });
    }

    // 2. Extract Raw Text using shared helper
    const rawText = await extractRawTextFromUpload(file);

    // 3. Incremental Parsing: Parse all messages and detect new ones
    const { newMessages, allMessages, hasNew } = extractIncrementalMessages(rawText, chat.last_message_hash);

    if (!hasNew || allMessages.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Yeni mesaj bulunamadı. Sohbet zaten en güncel halinde.',
        newMessagesCount: 0
      });
    }

    // 4. Recalculate metrics from complete dataset
    const metrics = calculateChatMetrics(allMessages);
    const lastMsg = allMessages[allMessages.length - 1];

    // 5. Generate AI analysis
    const aiResult = await generateAIAnalysis(chat.title, metrics, chat.chat_type);

    // 6. Update Chat in Supabase
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

    // 7. Update Chat Analyses
    const { data: analysisData } = await supabase
      .from('chat_analyses')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(1);

    const currentAnalysis = (analysisData && analysisData.length > 0 ? analysisData[0] : null) as ChatAnalysisRow | null;

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
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: err.message || 'Artımlı güncelleme başarısız.' }, { status: 500 });
  }
}
