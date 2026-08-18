'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, UserX, UserCheck, RefreshCw, Link as LinkIcon, ShieldCheck } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface GuestSession {
  id: string;
  guest_name: string;
  is_revoked: boolean;
  created_at: string;
  last_active_at: string;
}

interface OwnerControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  inviteCode?: string;
  passwordPin?: string;
  ownerToken: string;
  onReAnalyze: () => Promise<void>;
}

export const OwnerControlModal: React.FC<OwnerControlModalProps> = ({
  isOpen,
  onClose,
  chatId,
  inviteCode,
  passwordPin,
  ownerToken,
  onReAnalyze,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [guests, setGuests] = useState<GuestSession[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(false);
  const [isReAnalyzing, setIsReAnalyzing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const inviteUrl = typeof window !== 'undefined' && inviteCode
    ? `${window.location.origin}/c/${inviteCode}`
    : `/c/${inviteCode || ''}`;

  const fetchGuests = async () => {
    if (!isOpen) return;
    setIsLoadingGuests(true);
    try {
      const res = await fetch(`/api/chats/${chatId}/guests?owner_token=${ownerToken}`);
      if (res.ok) {
        const data = await res.json();
        setGuests(data.guests || []);
      }
    } catch (err) {
      console.error('Misafir listesi yüklenemedi:', err);
    } finally {
      setIsLoadingGuests(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGuests();
    }
  }, [isOpen, chatId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPin = () => {
    if (passwordPin) {
      navigator.clipboard.writeText(passwordPin);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    }
  };

  const handleToggleRevoke = async (guestId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/chats/${chatId}/guests`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId,
          isRevoked: !currentStatus,
          ownerToken
        })
      });

      if (res.ok) {
        setGuests(prev =>
          prev.map(g => (g.id === guestId ? { ...g, is_revoked: !currentStatus } : g))
        );
      } else {
        const data = await res.json();
        setActionError(data.error || 'İşlem başarısız');
      }
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleRunReAnalyze = async () => {
    setIsReAnalyzing(true);
    try {
      await onReAnalyze();
      onClose();
    } catch (err: any) {
      setActionError(err.message || 'Analiz yenilenemedi.');
    } finally {
      setIsReAnalyzing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sohbet Yönetim & Davet Paneli ⚙️"
      subtitle="Arkadaşlarınızı davet edin veya davetli erişimlerini tek tıkla yönetin."
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
        
        {/* Invite Link & PIN Section */}
        <div className="p-4 bg-[#F7F9FC] rounded-2xl border border-[#E5E9F0] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0A0A0A] uppercase tracking-wider">
            <LinkIcon className="w-4 h-4 text-[#0284C7]" />
            <span>Otomatik Davet Linki & Şifre</span>
          </div>

          <div>
            <label className="text-xs text-[#6B7280] font-medium block mb-1">
              Davet Bağlantısı (Sabit)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="w-full text-xs font-mono bg-white border border-[#E5E9F0] rounded-xl px-3 py-2 text-[#0A0A0A] select-all"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copiedLink ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Kopyalandı' : 'Kopyala'}</span>
              </Button>
            </div>
          </div>

          <div>
            <label className="text-xs text-[#6B7280] font-medium block mb-1">
              Giriş Şifresi / PIN
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={passwordPin || '------'}
                className="w-full text-sm font-mono font-bold tracking-widest bg-white border border-[#E5E9F0] rounded-xl px-3 py-2 text-[#0A0A0A] select-all"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyPin}
                className="shrink-0"
              >
                {copiedPin ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPin ? 'Kopyalandı' : 'Kopyala'}</span>
              </Button>
            </div>
          </div>

          <p className="text-[11px] text-[#6B7280] leading-relaxed">
            💡 Arkadaşlarınız bu bağlantıya tıklayıp şifreyi ve isimlerini girerek analizi ve Wrapped'ı anında görüntüleyebilir.
          </p>
        </div>

        {/* Guest Sessions & Revocation Management */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[#0A0A0A] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
              <span>Giriş Yapan Davetliler ({guests.length})</span>
            </h4>
            <button
              onClick={fetchGuests}
              className="text-xs text-[#6B7280] hover:text-[#0A0A0A] flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingGuests ? 'animate-spin' : ''}`} />
              <span>Yenile</span>
            </button>
          </div>

          {guests.length === 0 ? (\n            <div className=\"text-center py-6 px-4 bg-[#F7F9FC] rounded-2xl border border-[#E5E9F0] text-xs text-[#6B7280]\">\n              Henüz davet linkinizle giriş yapan kimse olmadı. Linki arkadaşlarınızla paylaşın!\n            </div>\n          ) : (\n            <div className=\"divide-y divide-[#E5E9F0] border border-[#E5E9F0] rounded-2xl overflow-hidden bg-white\">\n              {guests.map(g => (\n                <div key={g.id} className=\"p-3 flex items-center justify-between gap-3 text-xs\">\n                  <div>\n                    <div className=\"flex items-center gap-2\">\n                      <span className=\"font-bold text-[#0A0A0A]\">{g.guest_name}</span>\n                      {g.is_revoked ? (\n                        <span className=\"px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-semibold\">\n                          Erişimi Kesildi\n                        </span>\n                      ) : (\n                        <span className=\"px-2 py-0.5 rounded-full bg-[#F0F9FF] text-[#0284C7] text-[10px] font-semibold border border-[#BAE6FD]\">\n                          Aktif\n                        </span>\n                      )}\n                    </div>\n                    <span className=\"text-[11px] text-[#6B7280] block mt-0.5 font-mono\">\n                      Giriş: {new Date(g.created_at).toLocaleDateString('tr-TR')}\n                    </span>\n                  </div>\n\n                  <Button\n                    variant={g.is_revoked ? 'blue' : 'danger'}\n                    size=\"sm\"\n                    onClick={() => handleToggleRevoke(g.id, g.is_revoked)}\n                    className=\"text-xs shrink-0\"\n                  >\n                    {g.is_revoked ? (\n                      <>\n                        <UserCheck className=\"w-3.5 h-3.5\" />\n                        <span>Erişimi Aç</span>\n                      </>\n                    ) : (\n                      <>\n                        <UserX className=\"w-3.5 h-3.5\" />\n                        <span>Erişimi Kes</span>\n                      </>\n                    )}\n                  </Button>\n                </div>\n              ))}\n            </div>\n          )}\n        </div>\n\n        {/* Re-Analyze Action */}\n        <div className=\"pt-2 border-t border-[#E5E9F0] flex items-center justify-between\">\n          <div>\n            <p className=\"text-xs font-bold text-[#0A0A0A]\">AI Analizini Yenile</p>\n            <p className=\"text-[11px] text-[#6B7280]\">Kişilik kartlarını ve Wrapped anlatılarını yeniden üretin.</p>\n          </div>\n          <Button\n            variant=\"secondary\"\n            size=\"sm\"\n            onClick={handleRunReAnalyze}\n            isLoading={isReAnalyzing}\n          >\n            <RefreshCw className=\"w-4 h-4\" />\n            <span>Yeniden Analiz Et</span>\n          </Button>\n        </div>\n\n        {actionError && (\n          <p className=\"text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200\">\n            {actionError}\n          </p>\n        )}\n\n      </div>\n    </Modal>\n  );\n};\n