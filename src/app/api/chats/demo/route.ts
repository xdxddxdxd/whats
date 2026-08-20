import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { parseWhatsAppChat } from '@/lib/parser/whatsapp-parser';
import { calculateChatMetrics } from '@/lib/analytics/stats-engine';
import { generateAIAnalysis } from '@/lib/ai/ai-service';
import { DEMO_CHAT_TEXT, DEMO_CHAT_TITLE } from '@/lib/demo/demo-data';
import { generateInviteCode, generatePin } from '@/lib/utils/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const ownerToken = body.owner_token || request.headers.get('x-owner-token');

    if (!ownerToken) {
      return NextResponse.json({ error: 'Kullanıcı oturum kimliği eksik.' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Parse demo text
    const parseResult = parseWhatsAppChat(DEMO_CHAT_TEXT, DEMO_CHAT_TITLE);
    const metrics = calculateChatMetrics(parseResult.messages);
    const aiAnalysis = await generateAIAnalysis(DEMO_CHAT_TITLE, metrics, 'group');

    // Create chat
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .insert({
        owner_token: ownerToken,
        title: DEMO_CHAT_TITLE,
        chat_type: 'group',
        total_messages: metrics.totalMessages,
        total_participants: metrics.participants.length,
        first_message_date: parseResult.firstDate?.toISOString() || null,
        last_message_date: parseResult.lastDate?.toISOString() || null,
        last_message_hash: parseResult.lastMessageHash || null
      })
      .select()
      .single();

    if (chatError || !chat) {
      return NextResponse.json({ error: chatError?.message || 'Demo sohbet oluşturulamadı.' }, { status: 500 });
    }

    const inviteCode = generateInviteCode();
    const passwordPin = generatePin();

    await supabase.from('invites').insert({
      chat_id: chat.id,
      invite_code: inviteCode,
      password_pin: passwordPin,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    await supabase.from('chat_analyses').insert({
      chat_id: chat.id,
      metrics: metrics as any,
      superlatives: aiAnalysis.superlatives as any,
      wrapped_slides: aiAnalysis.wrappedSlides as any,
      ai_summary: aiAnalysis.summary,
      version: 1
    });

    return NextResponse.json({
      success: true,
      chat: {
        ...chat,
        invite: {
          invite_code: inviteCode,
          password_pin: passwordPin,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Demo oluşturulurken hata.' }, { status: 500 });
  }
}
