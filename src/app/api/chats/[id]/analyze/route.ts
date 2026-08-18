import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateAIAnalysis } from '@/lib/ai/ai-service';
import { ChatMetrics } from '@/lib/analytics/stats-engine';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chatId = params.id;
    const body = await request.json().catch(() => ({}));
    const ownerToken = body.owner_token || request.headers.get('x-owner-token');

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
      return NextResponse.json({ error: 'Analiz tetikleme yetkiniz yok.' }, { status: 403 });
    }

    // 2. Fetch existing metrics
    const { data: currentAnalysisData } = await supabase
      .from('chat_analyses')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })\n      .limit(1)
      .single();

    const currentAnalysis = currentAnalysisData as any;

    if (!currentAnalysis || !currentAnalysis.metrics) {
      return NextResponse.json({ error: 'Hesaplanmış metrikler bulunamadı.' }, { status: 400 });
    }

    const metrics = currentAnalysis.metrics as unknown as ChatMetrics;

    // 3. Generate fresh AI analysis
    const aiResult = await generateAIAnalysis(chat.title, metrics, chat.chat_type);

    // 4. Update analysis record
    const { data: updatedAnalysis, error: updateError } = await supabase
      .from('chat_analyses')
      .update({
        superlatives: aiResult.superlatives as any,
        wrapped_slides: aiResult.wrappedSlides as any,
        ai_summary: aiResult.summary,
        version: (currentAnalysis.version || 1) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', currentAnalysis.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      analysis: updatedAnalysis
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Analiz güncellenemedi.' }, { status: 500 });
  }
}
