import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateRuleBasedSentiment } from '@/lib/ai/rules-engine';
import { chatAnalyticsData } from '@/lib/demo/demo-data';
import { assertChatAccess, ApiError } from '@/lib/supabase/guards';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { chatId } = body;

    // If demo or no chatId, return mock sentiment data directly
    if (!chatId || chatId === 'demo') {
      return NextResponse.json({
        success: true,
        sentiment: chatAnalyticsData.sentiment
      });
    }

    const ownerToken =
      request.headers.get('x-owner-token') ||
      body.owner_token ||
      new URL(request.url).searchParams.get('owner_token');
    const guestToken =
      request.headers.get('x-guest-token') ||
      body.guest_token ||
      new URL(request.url).searchParams.get('guest_token');

    const supabase = createServerSupabaseClient();

    // Auth: require owner or valid guest session via central guard
    await assertChatAccess(supabase, chatId, { ownerToken, guestToken });

    // Fetch existing analysis from DB
    const { data: analysisData } = await supabase
      .from('chat_analyses')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const analysis = analysisData as any;

    // 1. Check if sentiment was already generated on upload and stored
    if (analysis?.metrics?.sentiment) {
      return NextResponse.json({
        success: true,
        sentiment: analysis.metrics.sentiment
      });
    }

    if (analysis?.sentiment) {
      return NextResponse.json({
        success: true,
        sentiment: analysis.sentiment
      });
    }

    // 2. If analysis has metrics, compute sentiment using strictly real metrics
    if (analysis?.metrics) {
      const sentiment = generateRuleBasedSentiment(analysis.metrics);

      // Save to database cache
      try {
        await supabase
          .from('chat_analyses')
          .update({
            metrics: {
              ...analysis.metrics,
              sentiment
            }
          })
          .eq('id', analysis.id);
      } catch (saveErr) {
        console.warn('Could not cache sentiment into DB:', saveErr);
      }

      return NextResponse.json({
        success: true,
        sentiment
      });
    }

    return NextResponse.json({
      success: true,
      sentiment: null
    });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return NextResponse.json({ success: false, error: err.message }, { status: err.statusCode });
    }
    console.error('Sentiment route error:', err);
    return NextResponse.json({
      success: false,
      error: err.message || 'Duygu analizi alınamadı.'
    }, { status: 500 });
  }
}
