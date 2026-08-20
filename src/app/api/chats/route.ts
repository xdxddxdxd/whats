import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { parseWhatsAppChat } from '@/lib/parser/whatsapp-parser';
import { calculateChatMetrics } from '@/lib/analytics/stats-engine';
import { generateAIAnalysis } from '@/lib/ai/ai-service';
import { extractSmartSample } from '@/lib/ai/smart-sampling';
import { analyzeSentimentAndRoles } from '@/lib/ai/ai-engine';
import { generateInviteCode, generatePin, generateOwnerToken } from '@/lib/utils/session';
import { extractRawTextFromUpload } from '@/lib/utils/extract-chat-text';

export const maxDuration = 60;

// GET: List chats for owner
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerToken = request.headers.get('x-owner-token') || searchParams.get('owner_token');

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
    const headerOwnerToken = request.headers.get('x-owner-token');
    const rawOwnerToken = (formData.get('owner_token') as string | null) || headerOwnerToken;
    const customTitle = formData.get('title') as string | null;

    // Ensure we always have an ownerToken (client or auto-generated)
    const ownerToken = rawOwnerToken && rawOwnerToken.trim() ? rawOwnerToken.trim() : generateOwnerToken();

    const supabase = createServerSupabaseClient();

    if (!file) {
      return NextResponse.json({ error: 'Lütfen bir WhatsApp sohbet dosyası (.txt veya .zip) seçin.' }, { status: 400 });
    }

    // 2. Extract Raw Text using shared helper
    let rawText = '';
    try {
      rawText = await extractRawTextFromUpload(file);
    } catch (extractErr: any) {
      return NextResponse.json({ error: extractErr.message || 'Dosya okunamadı.' }, { status: 400 });
    }

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json({ error: 'Seçilen dosya boş görünüyor. Lütfen mesaj içeren geçerli bir WhatsApp sohbet dosyası seçin.' }, { status: 400 });
    }

    // 3. Parse & Validate WhatsApp chat
    const parseResult = parseWhatsAppChat(rawText, customTitle || undefined);
    if (!parseResult.isValid || parseResult.messages.length === 0) {
      return NextResponse.json(
        {
          error: parseResult.error || 'Dosya geçerli bir WhatsApp sohbet dışa aktarımı değil. Lütfen WhatsApp\'tan dışa aktarılmış orijinal dosyayı seçin.'
        },
        { status: 400 }
      );
    }

    // 4. Calculate Stats & Metrics directly from 100% real parsed messages
    const metrics = calculateChatMetrics(parseResult.messages);
    const finalTitle = customTitle || parseResult.title || 'WhatsApp Sohbeti';

    // 5. Extract Smart Sampling and generate AI Sentiment directly from real messages
    const smartSample = extractSmartSample(parseResult.messages, 200);

    const [aiAnalysis, sentimentResult] = await Promise.all([\n      generateAIAnalysis(finalTitle, metrics, parseResult.chatType),\n      analyzeSentimentAndRoles(finalTitle, metrics, smartSample)\n    ]);\n\n    const enrichedMetrics = {\n      ...metrics,\n      sentiment: sentimentResult\n    };\n\n    // 6. Insert Chat into Supabase\n    const { data: chat, error: chatError } = await supabase\n      .from('chats')\n      .insert({\n        owner_token: ownerToken,\n        title: finalTitle,\n        chat_type: parseResult.chatType,\n        total_messages: metrics.totalMessages,\n        total_participants: metrics.participants.length,\n        first_message_date: parseResult.firstDate ? parseResult.firstDate.toISOString() : null,\n        last_message_date: parseResult.lastDate ? parseResult.lastDate.toISOString() : null,\n        last_message_hash: parseResult.lastMessageHash || null\n      })\n      .select()\n      .single();\n\n    if (chatError || !chat) {\n      return NextResponse.json({ error: chatError?.message || 'Sohbet kaydedilemedi.' }, { status: 500 });\n    }\n\n    // 7. Insert Invite Link & Fixed PIN, and Chat Analysis in Parallel\n    const inviteCode = generateInviteCode();\n    const passwordPin = generatePin();\n\n    const [inviteRes, analysisRes] = await Promise.all([\n      supabase.from('invites').insert({\n        chat_id: chat.id,\n        invite_code: inviteCode,\n        password_pin: passwordPin,\n        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),\n      }),\n      supabase.from('chat_analyses').insert({\n        chat_id: chat.id,\n        metrics: enrichedMetrics as any,\n        superlatives: aiAnalysis.superlatives as any,\n        wrapped_slides: aiAnalysis.wrappedSlides as any,\n        ai_summary: aiAnalysis.summary,\n        version: 1\n      })\n    ]);\n\n    if (inviteRes.error) {\n      console.warn('Invite creation notice:', inviteRes.error);\n    }\n    if (analysisRes.error) {\n      console.warn('Analysis creation notice:', analysisRes.error);\n    }\n\n    return NextResponse.json({\n      success: true,\n      owner_token: ownerToken,\n      chat: {\n        ...chat,\n        invite: {\n          invite_code: inviteCode,\n          password_pin: passwordPin\n        }\n      }\n    });\n  } catch (err: any) {\n    console.error('Upload handler error:', err);\n    return NextResponse.json({ error: err.message || 'Analiz sırasında beklenmeyen bir hata oluştu.' }, { status: 500 });\n  }\n}\n