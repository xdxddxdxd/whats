import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateGuestSessionToken } from '@/lib/utils/session';

// In-memory rate limiting map for PIN attempts (key: ip+inviteCode -> { count, lockUntil })
const attemptMap = new Map<string, { count: number; lockUntil: number }>();

function checkRateLimit(key: string): { allowed: boolean; waitMinutes?: number } {
  const now = Date.now();
  const entry = attemptMap.get(key);

  if (entry) {
    if (entry.lockUntil > now) {
      const waitMinutes = Math.ceil((entry.lockUntil - now) / (60 * 1000));
      return { allowed: false, waitMinutes };
    }
    // Reset if lockout period expired
    if (entry.lockUntil > 0 && entry.lockUntil <= now) {
      attemptMap.delete(key);
    }
  }
  return { allowed: true };
}

function recordFailedAttempt(key: string) {
  const now = Date.now();
  const entry = attemptMap.get(key) || { count: 0, lockUntil: 0 };
  entry.count += 1;

  if (entry.count >= 5) {
    entry.lockUntil = now + 15 * 60 * 1000; // Lock for 15 minutes
  }
  attemptMap.set(key, entry);
}

function resetAttempts(key: string) {
  attemptMap.delete(key);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inviteCode, passwordPin, guestName } = body;

    const ip = request.headers.get('x-forwarded-for') || 'anon';
    const rateLimitKey = `${ip}__${(inviteCode || '').trim().toLowerCase()}`;

    // 1. Rate Limit Check
    const rateLimit = checkRateLimit(rateLimitKey);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Çok fazla hatalı PIN denemesi yapıldı. Lütfen ${rateLimit.waitMinutes} dakika sonra tekrar deneyin.` },
        { status: 429 }
      );
    }

    if (!inviteCode || !passwordPin || !guestName || !guestName.trim()) {
      return NextResponse.json({ error: 'Lütfen tüm alanları (Şifre ve İsminiz) eksiksiz doldurun.' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // 2. Find invite record
    const { data: invite, error: inviteError } = await supabase
      .from('invites')
      .select('*, chats(id, title, chat_type)')
      .eq('invite_code', inviteCode.trim().toLowerCase())
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş davet bağlantısı.' }, { status: 404 });
    }

    // 3. Verify PIN
    if (invite.password_pin.trim() !== passwordPin.trim()) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json({ error: 'Girdiğiniz PIN / Şifre hatalı. Lütfen kontrol edip tekrar deneyin.' }, { status: 401 });
    }

    // PIN is correct, reset rate limit attempts
    resetAttempts(rateLimitKey);

    const chatId = invite.chat_id;
    const cleanGuestName = guestName.trim().slice(0, 50);

    // 4. Session Deduplication: Check if an active non-revoked session already exists for this guest in this chat
    const { data: existingGuest } = await supabase
      .from('guest_sessions')
      .select('*')
      .eq('chat_id', chatId)
      .eq('guest_name', cleanGuestName)
      .eq('is_revoked', false)
      .limit(1)
      .maybeSingle();

    if (existingGuest) {
      // Update last active time
      await supabase
        .from('guest_sessions')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', existingGuest.id);

      return NextResponse.json({
        success: true,
        chatId,
        chatTitle: (invite.chats as any)?.title || 'WhatsApp Sohbeti',
        sessionToken: existingGuest.session_token,
        guestName: existingGuest.guest_name
      });
    }

    // 5. Create new session token with crypto
    const sessionToken = generateGuestSessionToken();

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
