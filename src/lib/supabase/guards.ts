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

  if (chat.owner_token !== ownerToken) {
    throw new ApiError(403, 'Bu işlem için yetkiniz bulunmamaktadır.');
  }

  return chat;
}
