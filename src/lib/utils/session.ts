export function generateOwnerToken(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return 'own_' + crypto.randomUUID().replace(/-/g, '');
  }
  return 'own_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateInviteCode(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const OWNER_STORAGE_KEY = 'whats_owner_token';

export function getClientOwnerToken(): string {
  if (typeof window === 'undefined') return '';
  let token = localStorage.getItem(OWNER_STORAGE_KEY);
  if (!token) {
    token = generateOwnerToken();
    localStorage.setItem(OWNER_STORAGE_KEY, token);
    document.cookie = `whats_owner_token=${token}; path=/; max-age=31536000; SameSite=Lax`;
  }
  return token;
}

export function setClientOwnerToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(OWNER_STORAGE_KEY, token);
  document.cookie = `whats_owner_token=${token}; path=/; max-age=31536000; SameSite=Lax`;
}

export interface GuestSessionInfo {
  sessionToken: string;
  guestName: string;
}

export function getClientGuestSession(chatId: string): GuestSessionInfo | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(`whats_guest_${chatId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setClientGuestSession(chatId: string, session: GuestSessionInfo) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`whats_guest_${chatId}`, JSON.stringify(session));
}

export function removeClientGuestSession(chatId: string) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`whats_guest_${chatId}`);
}
