import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatWallClockDate } from '@/lib/utils/formatters';

/**
 * Owner-only analysis export (JSON). Useful when owner_token is about to be lost
 * or for offline backup — no raw messages, only computed metrics/summary.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chatId = params.id;
    const ownerToken =
      request.headers.get('x-owner-token') ||
      new URL(request.url).searchParams.get('owner_token');

    if (!ownerToken) {
      return NextResponse.json({ error: 'Yedekleme için owner token gerekli.' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    const { data: chat, error } = await supabase
      .from('chats')
      .select('id, title, chat_type, total_messages, total_participants, first_message_date, last_message_date, created_at, owner_token, ask_count')
      .eq('id', chatId)
      .single();

    if (error || !chat) {
      return NextResponse.json({ error: 'Sohbet bulunamadı.' }, { status: 404 });
    }

    if (chat.owner_token !== ownerToken) {
      return NextResponse.json({ error: 'Bu sohbeti yalnızca sahibi yedekleyebilir.' }, { status: 403 });
    }

    const { data: analysis } = await supabase
      .from('chat_analyses')
      .select('metrics, superlatives, wrapped_slides, ai_summary, version, created_at')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: asks } = await supabase
      .from('chat_asks')
      .select('question, answer, facts_used, created_at')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    const { data: invite } = await supabase
      .from('invites')
      .select('invite_code, password_pin, expires_at, created_at')
      .eq('chat_id', chatId)
      .maybeSingle();

    const payload = {
      exportedAt: new Date().toISOString(),
      exportVersion: 1,
      note: 'Ham mesaj metinleri dahil değildir. Yalnızca hesaplanmış istatistik ve özetler.',
      chat: {
        id: chat.id,
        title: chat.title,
        chat_type: chat.chat_type,
        total_messages: chat.total_messages,
        total_participants: chat.total_participants,
        first_message_date: chat.first_message_date,
        last_message_date: chat.last_message_date,
        first_message_label: formatWallClockDate(chat.first_message_date),
        last_message_label: formatWallClockDate(chat.last_message_date),
        created_at: chat.created_at,
        ask_count: (chat as any).ask_count ?? 0,
      },
      invite: invite
        ? {
            invite_code: invite.invite_code,
            // PIN included so owner can recover invite access from backup
            password_pin: invite.password_pin,
            expires_at: invite.expires_at,
          }
        : null,
      analysis: analysis || null,
      askHistory: asks || [],
    };

    const filename = `whatscope-backup-${(chat.title || 'chat')
      .replace(/[^\w\u00C0-\u024F]+/g, '-')
      .slice(0, 40)}-${chat.id.slice(0, 8)}.json`;

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Yedekleme başarısız.' }, { status: 500 });
  }
}
