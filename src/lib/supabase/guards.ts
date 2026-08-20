import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export type ChatRow = Database['public']['Tables']['chats']['Row'];

/**
 * Asserts that the chat exists and the provided ownerToken matches the chat's owner_token.
 */
export async function assertChatOwner(
  supabase: SupabaseClient<Database>,
  chatId: string,
  ownerToken: string | null
): Promise<ChatRow> {
  if (!ownerToken) {
    throw new ApiError(401, 'Yetkilendirme hatası: Yönetici anahtarı eksik.');
  }

  const { data: chatData, error } = await supabase
    .from('chats')
    .select('*')
    .eq('id', chatId)
    .single();

  const chat = chatData as ChatRow | null;

  if (error || !chat) {
    throw new ApiError(404, 'Sohbet bulunamadı.');
  }

  if (chat.owner_token !== ownerToken.trim()) {
    throw new ApiError(403, 'Bu işlem için yetkiniz bulunmamaktadır.');
  }

  return chat;
}

export interface AccessCredentials {
  ownerToken?: string | null;
  guestToken?: string | null;
}

export type ChatWithInvites = ChatRow & {
  invites?: Array<{
    invite_code: string;
    password_pin: string;
  }>;
};

export interface VerifiedChatAccess {
  chat: ChatWithInvites;
  isOwner: boolean;
  guestId?: string;
}

/**
 * Asserts that the requester is either the chat owner or a verified, non-revoked guest.
 */
export async function assertChatAccess(
  supabase: SupabaseClient<Database>,
  chatId: string,
  creds: AccessCredentials
): Promise<VerifiedChatAccess> {
  const { data: chatData, error: chatError } = await supabase
    .from('chats')
    .select('*, invites(invite_code, password_pin)')
    .eq('id', chatId)
    .single();

  const chat = chatData as (ChatRow & { invites?: Array<{ invite_code: string; password_pin: string }> }) | null;

  if (chatError || !chat) {
    throw new ApiError(404, 'Sohbet bulunamadı.');
  }

  const isOwner = !!creds.ownerToken && chat.owner_token === creds.ownerToken.trim();
  if (isOwner) {
    return { chat, isOwner: true };
  }

  if (!creds.guestToken) {
    throw new ApiError(401, 'Bu sohbeti görüntülemek için davet kodu veya şifre ile giriş yapmalısınız.');
  }

  const { data: guestData, error: guestError } = await supabase
    .from('guest_sessions')
    .select('id, is_revoked')
    .eq('chat_id', chatId)
    .eq('session_token', creds.guestToken.trim())
    .single();

  const guest = guestData as { id: string; is_revoked: boolean } | null;

  if (guestError || !guest) {
    throw new ApiError(401, 'Geçersiz davetli oturumu. Lütfen tekrar giriş yapın.');
  }

  if (guest.is_revoked) {
    throw new ApiError(403, 'Bu sohbete erişiminiz sohbet sahibi tarafından kaldırılmıştır.');
  }

  // Update last active in background
  (supabase as any)
    .from('guest_sessions')
    .update({ last_active_at: new Date().toISOString() })
    .eq('id', guest.id)
    .then();

  return { chat, isOwner: false, guestId: guest.id };
}
