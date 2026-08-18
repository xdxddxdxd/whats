import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chatId = params.id;
    const { searchParams } = new URL(request.url);
    const ownerToken = searchParams.get('owner_token') || request.headers.get('x-owner-token');
    const guestToken = searchParams.get('guest_token') || request.headers.get('x-guest-token');

    const supabase = createServerSupabaseClient();

    // 1. Fetch Chat
    const { data: chatData, error: chatError } = await supabase
      .from('chats')
      .select('*, invites(invite_code, password_pin)')
      .eq('id', chatId)
      .single();

    const chat = chatData as any;

    if (chatError || !chat) {
      return NextResponse.json({ error: 'Sohbet bulunamadı.' }, { status: 404 });
    }

    const isOwner = !!ownerToken && chat.owner_token === ownerToken;

    // 2. If not owner, verify guest session
    if (!isOwner) {
      if (!guestToken) {
        return NextResponse.json({ error: 'Bu sohbeti görüntülemek için davet kodu veya şifre ile giriş yapmalısınız.' }, { status: 401 });
      }

      const { data: guestData, error: guestError } = await supabase
        .from('guest_sessions')
        .select('*')
        .eq('chat_id', chatId)
        .eq('session_token', guestToken)
        .single();

      const guest = guestData as any;

      if (guestError || !guest) {
        return NextResponse.json({ error: 'Geçersiz davetli oturumu. Lütfen tekrar giriş yapın.' }, { status: 401 });
      }

      if (guest.is_revoked) {
        return NextResponse.json(
          {
            error: 'Bu sohbete erişiminiz sohbet sahibi tarafından kaldırılmıştır.',
            isRevoked: true
          },
          { status: 403 }
        );
      }

      // Update last active
      await supabase
        .from('guest_sessions')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', guest.id);
    }

    // 3. Fetch Analyses
    const { data: analysis, error: analysisError } = await supabase
      .from('chat_analyses')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Hide owner_token from response for security
    const safeChat = {
      id: chat.id,
      title: chat.title,
      chat_type: chat.chat_type,
      total_messages: chat.total_messages,
      total_participants: chat.total_participants,
      first_message_date: chat.first_message_date,
      last_message_date: chat.last_message_date,
      created_at: chat.created_at,
      updated_at: chat.updated_at,
      isOwner,
      invite: isOwner ? chat.invites?.[0] || null : null
    };

    return NextResponse.json({
      chat: safeChat,
      analysis: analysis || null,
      isOwner
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chatId = params.id;
    const { searchParams } = new URL(request.url);
    const ownerToken = searchParams.get('owner_token') || request.headers.get('x-owner-token');

    if (!ownerToken) {
      return NextResponse.json({ error: 'Silme işlemi için yetkiniz yok.' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Verify ownership
    const { data: chatData, error: chatError } = await supabase
      .from('chats')
      .select('id, owner_token')
      .eq('id', chatId)
      .single();

    const chat = chatData as any;

    if (chatError || !chat) {
      return NextResponse.json({ error: 'Sohbet bulunamadı.' }, { status: 404 });
    }

    if (chat.owner_token !== ownerToken) {
      return NextResponse.json({ error: 'Bu sohbeti sadece sahibi silebilir.' }, { status: 403 });
    }

    // Cascade delete on foreign keys will remove invites, guest_sessions, chat_analyses
    const { error: deleteError } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Sohbet ve tüm analiz verileri tamamen silindi.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Silme işlemi başarısız.' }, { status: 500 });
  }
}
