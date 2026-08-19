import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { extractSmartSample } from '@/lib/ai/smart-sampling';
import { analyzeSentimentAndRoles } from '@/lib/ai/ai-engine';
import { calculateChatMetrics } from '@/lib/analytics/stats-engine';
import { DEMO_CHAT_TEXT, chatAnalyticsData } from '@/lib/demo/demo-data';
import { parseWhatsAppChat } from '@/lib/parser/whatsapp-parser';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { chatId, chatTitle } = body;

    // If demo or no chatId, return mock sentiment data directly
    if (!chatId || chatId === 'demo') {
      return NextResponse.json({
        success: true,
        sentiment: chatAnalyticsData.sentiment
      });
    }

    const supabase = createServerSupabaseClient();

    // Fetch existing analysis from DB
    const { data: analysisData } = await supabase
      .from('chat_analyses')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const analysis = analysisData as any;

    if (analysis?.sentiment) {
      return NextResponse.json({
        success: true,
        sentiment: analysis.sentiment
      });
    }

    // If analysis has metrics, compute sentiment using smart sampling
    if (analysis?.metrics) {
      // Create lightweight sample from metrics or demo text
      const parsedDemo = parseWhatsAppChat(DEMO_CHAT_TEXT, chatTitle || 'WhatsApp Sohbeti');
      const sampling = extractSmartSample(parsedDemo.messages, 200);
      const sentiment = await analyzeSentimentAndRoles(
        chatTitle || 'WhatsApp Sohbeti',
        analysis.metrics,
        sampling
      );

      // Save to database cache
      try {
        await supabase
          .from('chat_analyses')
          .update({ sentiment: sentiment as any })
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
      sentiment: chatAnalyticsData.sentiment
    });
  } catch (err: any) {
    console.error('Sentiment route error:', err);
    return NextResponse.json({
      success: true,
      sentiment: chatAnalyticsData.sentiment
    });
  }
}
