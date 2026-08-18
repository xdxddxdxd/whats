import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { parseWhatsAppChat } from '@/lib/parser/whatsapp-parser';
import { calculateChatMetrics } from '@/lib/analytics/stats-engine';
import { generateAIAnalysis } from '@/lib/ai/ai-service';
import { generateInviteCode, generatePin } from '@/lib/utils/session';
import JSZip from 'jszip';

export const maxDuration = 60; // Allow enough time for parsing and AI

// GET: List chats for owner
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerToken = searchParams.get('owner_token') || request.headers.get('x-owner-token');

    if (!ownerToken) {
      return NextResponse.json({ chats: [] });
    }

    const supabase = createServerSupabaseClient();
    const { data: chats, error } = await supabase
      .from('chats')
      .select('*, invites(invite_code, password_pin)')
      .eq('owner_token', ownerToken)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ chats: chats || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 });
  }
}

// POST: Upload and process new chat
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const ownerToken = formData.get('owner_token') as string | null;
    const customTitle = formData.get('title') as string | null;

    if (!ownerToken) {
      return NextResponse.json({ error: 'Kullanıcı oturum kimliği eksik.' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // 1. Check max 2 chats limit for this owner
    const { count, error: countError } = await supabase
      .from('chats')
      .select('*', { count: 'exact', head: true })
      .eq('owner_token', ownerToken);

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    if ((count || 0) >= 2) {
      return NextResponse.json(
        {
          error: 'Maksimum sohbet sınırına ulaştınız. Aynı anda en fazla 2 sohbet analiz edebilirsiniz. Yeni bir sohbet yüklemek için lütfen mevcut sohbetlerinizden birini silin.',
          limitReached: true
        },
        { status: 403 }
      );
    }

    if (!file) {
      return NextResponse.json({ error: 'Lütfen bir WhatsApp sohbet dosyası seçin.' }, { status: 400 });
    }

    let rawText = '';
    const isZip = file.name.toLowerCase().endsWith('.zip') || file.type.includes('zip');

    if (isZip) {
      const buffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(buffer);
      let txtInZip = zip.file('_chat.txt');
      if (!txtInZip) {
        const txtFiles = zip.file(/\.txt$/i);
        if (txtFiles && txtFiles.length > 0) txtInZip = txtFiles[0];
      }
      if (!txtInZip) {
        return NextResponse.json({ error: 'ZIP arşivi içinde WhatsApp sohbet metin dosyası (_chat.txt) bulunamadı.' }, { status: 400 });
      }
      rawText = await txtInZip.async('string');
    } else {
      rawText = await file.text();
    }

    // 2. Parse & Validate WhatsApp chat
    const parseResult = parseWhatsAppChat(rawText, customTitle || undefined);
    if (!parseResult.isValid || parseResult.messages.length === 0) {
      return NextResponse.json(
        {
          error: parseResult.error || 'Dosya geçerli bir WhatsApp sohbet dışa aktarımı değil.'
        },
        { status: 400 }
      );
    }

    // 3. Calculate Stats & Metrics
    const metrics = calculateChatMetrics(parseResult.messages);

    // 4. Generate AI Analysis & Wrapped Slides
    const finalTitle = customTitle || parseResult.title || 'WhatsApp Sohbeti';
    const aiAnalysis = await generateAIAnalysis(finalTitle, metrics, parseResult.chatType);

    // 5. Insert Chat into Supabase
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .insert({
        owner_token: ownerToken,
        title: finalTitle,
        chat_type: parseResult.chatType,
        total_messages: metrics.totalMessages,
        total_participants: metrics.participants.length,
        first_message_date: parseResult.firstDate ? parseResult.firstDate.toISOString() : null,
        last_message_date: parseResult.lastDate ? parseResult.lastDate.toISOString() : null,
        last_message_hash: parseResult.lastMessageHash || null
      })
      .select()
      .single();

    if (chatError || !chat) {
      return NextResponse.json({ error: chatError?.message || 'Sohbet kaydedilemedi.' }, { status: 500 });
    }

    // 6. Insert Invite Link & Fixed PIN
    const inviteCode = generateInviteCode();
    const passwordPin = generatePin();

    const { error: inviteError } = await supabase
      .from('invites')
      .insert({
        chat_id: chat.id,
        invite_code: inviteCode,
        password_pin: passwordPin
      });

    if (inviteError) {
      console.error('Davet kaydı oluşturulamadı:', inviteError);
    }

    // 7. Insert Chat Analysis
    const { error: analysisError } = await supabase
      .from('chat_analyses')
      .insert({
        chat_id: chat.id,
        metrics: metrics as any,
        superlatives: aiAnalysis.superlatives as any,
        wrapped_slides: aiAnalysis.wrappedSlides as any,
        ai_summary: aiAnalysis.summary,
        version: 1
      });

    if (analysisError) {
      console.error('Analiz kaydı oluşturulamadı:', analysisError);
    }

    return NextResponse.json({
      success: true,
      chat: {
        ...chat,
        invite: {
          invite_code: inviteCode,
          password_pin: passwordPin
        }
      }
    });
  } catch (err: any) {
    console.error('Upload handler error:', err);
    return NextResponse.json({ error: err.message || 'Analiz sırasında beklenmeyen bir hata oluştu.' }, { status: 500 });
  }
}
