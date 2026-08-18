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

    if (!ownerToken) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Verify chat ownership
    const { data: chatData } = await supabase
      .from('chats')
      .select('id, owner_token')
      .eq('id', chatId)
      .single();

    const chat = chatData as any;

    if (!chat || chat.owner_token !== ownerToken) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 403 });
    }

    const { data: guests, error } = await supabase
      .from('guest_sessions')
      .select('id, guest_name, is_revoked, created_at, last_active_at')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ guests: guests || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Hata oluştu.' }, { status: 500 });
  }
}

// PATCH: Toggle revoke status for a guest
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chatId = params.id;
    const body = await request.json();
    const { guestId, isRevoked, ownerToken } = body;

    if (!ownerToken || !guestId) {
      return NextResponse.json({ error: 'Eksik parametreler.' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Verify chat ownership
    const { data: chatData } = await supabase
      .from('chats')
      .select('id, owner_token')
      .eq('id', chatId)
      .single();

    const chat = chatData as any;

    if (!chat || chat.owner_token !== ownerToken) {
      return NextResponse.json({ error: 'Yetkisiz işlem.' }, { status: 403 });
    }

    const { data: updated, error } = await supabase
      .from('guest_sessions')
      .update({ is_revoked: isRevoked })
      .eq('id', guestId)
      .eq('chat_id', chatId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, guest: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Hata oluştu.' }, { status: 500 });
  }
}
