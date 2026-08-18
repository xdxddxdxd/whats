import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateAIAnalysis } from '@/lib/ai/ai-service';
import { ChatMetrics } from '@/lib/analytics/stats-engine';
import { assertChatOwner, ApiError } from '@/lib/supabase/guards';
import { Database } from '@/lib/supabase/types';

export const maxDuration = 15;

type ChatAnalysisRow = Database['public']['Tables']['chat_analyses']['Row'];

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chatId = params.id;
    const body = await request.json().catch(() => ({}));
    const ownerToken = body.owner_token || request.headers.get('x-owner-token');

    const supabase = createServerSupabaseClient();

    // 1. Assert Ownership via central guard
    const chat = await assertChatOwner(supabase, chatId, ownerToken);

    // 2. Fetch existing metrics
    const { data: analysisData, error: analysisError } = await supabase
      .from('chat_analyses')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(1);

    const currentAnalysis = (analysisData && analysisData.length > 0 ? analysisData[0] : null) as ChatAnalysisRow | null;

    if (analysisError || !currentAnalysis || !currentAnalysis.metrics) {
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
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: err.message || 'Analiz güncellenemedi.' }, { status: 500 });
  }
}
