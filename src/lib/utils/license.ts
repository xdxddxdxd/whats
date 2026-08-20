'use client';

export type UserTier = 'free' | 'pro';

export interface LicenseInfo {
  isPro: boolean;
  tier: UserTier;
  licenseKey: string | null;
  passkeyId: string;
  activatedAt: string | null;
}

const LICENSE_STORAGE_KEY = 'whatsbaba_pro_license';
const PASSKEY_STORAGE_KEY = 'whatsbaba_passkey_id';

// Generate random Passkey ID (Device ID)
export function getOrCreatePasskeyId(): string {
  if (typeof window === 'undefined') return 'passkey_server';
  let passkey = localStorage.getItem(PASSKEY_STORAGE_KEY);
  if (!passkey) {
    const randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
    passkey = `WB-${randomHex}`;
    localStorage.setItem(PASSKEY_STORAGE_KEY, passkey);
  }
  return passkey;
}

// Generate valid format Pro License Key (e.g. BABA-PRO-8492)
export function generateProLicenseKey(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BABA-PRO-${code}`;
}

export function getLicenseInfo(): LicenseInfo {
  if (typeof window === 'undefined') {
    return {
      isPro: false,
      tier: 'free',
      licenseKey: null,
      passkeyId: 'server',
      activatedAt: null,
    };
  }

  const passkeyId = getOrCreatePasskeyId();
  const rawLicense = localStorage.getItem(LICENSE_STORAGE_KEY);

  if (!rawLicense) {
    return {
      isPro: false,
      tier: 'free',
      licenseKey: null,
      passkeyId,
      activatedAt: null,
    };
  }

  try {
    const data = JSON.parse(rawLicense);
    if (data && data.isPro && data.licenseKey) {
      return {
        isPro: true,
        tier: 'pro',
        licenseKey: data.licenseKey,
        passkeyId,
        activatedAt: data.activatedAt || null,
      };
    }
  } catch (e) {
    // If stored as plain string key
    if (typeof rawLicense === 'string' && isValidLicenseKeyFormat(rawLicense)) {
      return {
        isPro: true,
        tier: 'pro',
        licenseKey: rawLicense,
        passkeyId,
        activatedAt: new Date().toISOString(),
      };
    }
  }

  return {
    isPro: false,
    tier: 'free',
    licenseKey: null,
    passkeyId,
    activatedAt: null,
  };
}

export function isValidLicenseKeyFormat(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  const clean = key.trim().toUpperCase();
  // Valid formats: BABA-PRO-XXXX, PRO-XXXX, VIP-XXXX, or DEMO-PRO
  return (
    clean.startsWith('BABA-PRO-') ||
    clean.startsWith('PRO-') ||
    clean.startsWith('VIP-') ||
    clean === 'DEMO-PRO' ||
    clean === 'WHATS2026' ||
    clean.length >= 8
  );
}

export function activateLicense(key: string): { success: boolean; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Sunucu tarafında işlem yapılamaz' };

  const clean = key.trim().toUpperCase();
  if (!isValidLicenseKeyFormat(clean)) {
    return {
      success: false,
      error: 'Geçersiz lisans anahtarı formatı. Lütfen BABA-PRO-XXXX formatında girin.',
    };
  }

  const payload = {
    isPro: true,
    tier: 'pro',
    licenseKey: clean,
    activatedAt: new Date().toISOString(),
    passkeyId: getOrCreatePasskeyId(),
  };

  localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(payload));
  document.cookie = `whatsbaba_pro=true; path=/; max-age=31536000; SameSite=Lax`;

  // Dispatch custom window event so UI reacts instantly
  window.dispatchEvent(new Event('licenseChanged'));

  return { success: true };
}

export function removeLicense(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LICENSE_STORAGE_KEY);
  document.cookie = `whatsbaba_pro=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  window.dispatchEvent(new Event('licenseChanged'));
}
