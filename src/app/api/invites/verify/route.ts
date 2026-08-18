import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inviteCode, passwordPin, guestName } = body;

    if (!inviteCode || !passwordPin || !guestName || !guestName.trim()) {
      return NextResponse.json({ error: 'Lütfen tüm alanları (Şifre ve İsminiz) eksiksiz doldurun.' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // 1. Find invite record
    const { data: invite, error: inviteError } = await supabase
      .from('invites')
      .select('*, chats(id, title, chat_type)')
      .eq('invite_code', inviteCode.trim().toLowerCase())
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş davet bağlantısı.' }, { status: 404 });
    }

    // 2. Check PIN
    if (invite.password_pin.trim() !== passwordPin.trim()) {
      return NextResponse.json({ error: 'Girdiğiniz PIN / Şifre hatalı. Lütfen kontrol edip tekrar deneyin.' }, { status: 401 });
    }

    const chatId = invite.chat_id;
    const cleanGuestName = guestName.trim().slice(0, 50);

    // 3. Check if guest session exists or create new
    const sessionToken = 'gst_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const { data: newGuest, error: guestInsertError } = await supabase
      .from('guest_sessions')
      .insert({
        chat_id: chatId,
        guest_name: cleanGuestName,
        session_token: sessionToken,
        is_revoked: false
      })
      .select()
      .single();

    if (guestInsertError || !newGuest) {
      return NextResponse.json({ error: 'Giriş oturumu oluşturulamadı.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      chatId,
      chatTitle: (invite.chats as any)?.title || 'WhatsApp Sohbeti',
      sessionToken: newGuest.session_token,
      guestName: newGuest.guest_name
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Giriş yapılamadı.' }, { status: 500 });
  }
}
