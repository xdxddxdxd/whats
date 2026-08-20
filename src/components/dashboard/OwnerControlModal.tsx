'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, UserX, UserCheck, RefreshCw, Link as LinkIcon, ShieldCheck, QrCode, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
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
  const [isExporting, setIsExporting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const inviteUrl = typeof window !== 'undefined' && inviteCode
    ? `${window.location.origin}/c/${inviteCode}`
    : `/c/${inviteCode || ''}`;

  const fetchGuests = async () => {
    if (!isOpen) return;
    setIsLoadingGuests(true);
    try {
      const res = await fetch(`/api/chats/${chatId}/guests?owner_token=${ownerToken}`);
      const data = await res.json();
      if (res.ok) {
        setGuests(data.guests || []);
      }
    } catch (err) {
      console.error('Misafir listesi hatası:', err);
    } finally {
      setIsLoadingGuests(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGuests();
    }
  }, [isOpen]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyPin = () => {
    if (typeof window !== 'undefined' && navigator.clipboard && passwordPin) {
      navigator.clipboard.writeText(passwordPin);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    }
  };

  const handleToggleRevoke = async (guestId: string, currentRevoked: boolean) => {
    setActionError(null);
    try {
      const res = await fetch(`/api/chats/${chatId}/guests`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId,
          isRevoked: !currentRevoked,
          ownerToken,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'İşlem başarısız.');
      }

      setGuests(prev =>
        prev.map(g => (g.id === guestId ? { ...g, is_revoked: !currentRevoked } : g))
      );
    } catch (err: any) {
      setActionError(err.message || 'Yetki güncellenemedi.');
    }
  };


  const handleExportBackup = async () => {
    setIsExporting(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/chats/${chatId}/export?owner_token=${encodeURIComponent(ownerToken)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Yedek indirilemedi.');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cd = res.headers.get('Content-Disposition') || '';
      const match = cd.match(/filename="([^"]+)"/);
      a.download = match?.[1] || `whatscope-backup-${chatId.slice(0, 8)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setActionError(err.message || 'Yedekleme başarısız.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRunReAnalyze = async () => {
    setIsReAnalyzing(true);
    setActionError(null);
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
        
        {/* Invite Link, QR Code & PIN Section */}
        <div className="p-5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              <QrCode className="w-4 h-4 text-[#0284C7]" />
              <span>Davet QR Kodu & Giriş Bağlantısı</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
              KAMERA İLE GİRİŞ
            </span>
          </div>

          {/* QR Code Center Box */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-inner">
              <QRCodeSVG
                value={inviteUrl}
                size={160}
                level="H"
                includeMargin={true}
                bgColor="#FFFFFF"
                fgColor="#0F172A"
              />
            </div>
            <p className="text-xs font-semibold text-slate-700 text-center">
              Telefon kamerasını QR koda tutarak sohbete anında katılın!
            </p>
          </div>

          <div>
            <label className="text-xs text-[#64748B] font-medium block mb-1">
              Davet Bağlantısı
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="flex-1 bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-mono text-[#0F172A] select-all outline-none"
              />
              <Button size="sm" variant="secondary" onClick={handleCopyLink}>
                {copiedLink ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Kopyalandı' : 'Kopyala'}</span>
              </Button>
            </div>
          </div>

          {passwordPin && (
            <div>
              <label className="text-xs text-[#64748B] font-medium block mb-1">
                Sabit Giriş PIN / Şifre
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={passwordPin || '------'}
                  className="w-36 bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-base font-mono font-bold tracking-widest text-[#0F172A] text-center select-all outline-none"
                />
                <Button size="sm" variant="secondary" onClick={handleCopyPin}>
                  {copiedPin ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedPin ? 'Kopyalandı' : 'Kopyala'}</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Guests Access Control List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1.5 uppercase tracking-wider">
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

          {guests.length === 0 ? (
            <div className="text-center py-6 px-4 bg-[#F7F9FC] rounded-2xl border border-[#E5E9F0] text-xs text-[#6B7280]">
              Henüz davet linkinizle giriş yapan kimse olmadı. Linki arkadaşlarınızla paylaşın!
            </div>
          ) : (
            <div className="divide-y divide-[#E5E9F0] border border-[#E5E9F0] rounded-2xl overflow-hidden bg-white">
              {guests.map(g => (
                <div key={g.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0A0A0A]">{g.guest_name}</span>
                      {g.is_revoked ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-semibold">
                          Erişimi Kesildi
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#F0F9FF] text-[#0284C7] text-[10px] font-semibold border border-[#BAE6FD]">
                          Aktif
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#6B7280] block mt-0.5 font-mono">
                      Giriş: {new Date(g.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>

                  <Button
                    variant={g.is_revoked ? 'blue' : 'danger'}
                    size="sm"
                    onClick={() => handleToggleRevoke(g.id, g.is_revoked)}
                    className="text-xs shrink-0"
                  >
                    {g.is_revoked ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Erişimi Aç</span>
                      </>
                    ) : (
                      <>
                        <UserX className="w-3.5 h-3.5" />
                        <span>Erişimi Kes</span>
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Backup export — owner_token kaybına karşı */}
        <div className="pt-2 border-t border-[#E5E9F0] flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-[#0A0A0A]">Analiz Yedeği (JSON)</p>
            <p className="text-[11px] text-[#6B7280]">
              İstatistik, özet ve davet bilgilerini indir. Ham mesaj yok — token kaybında kurtarma için.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportBackup}
            isLoading={isExporting}
          >
            <Download className="w-4 h-4" />
            <span>Yedek İndir</span>
          </Button>
        </div>

        {/* Re-Analyze Action */}
        <div className="pt-2 border-t border-[#E5E9F0] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#0A0A0A]">AI Analizini Yenile</p>
            <p className="text-[11px] text-[#6B7280]">Kişilik kartlarını ve Wrapped anlatılarını yeniden üretin.</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRunReAnalyze}
            isLoading={isReAnalyzing}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Yeniden Analiz Et</span>
          </Button>
        </div>

        {actionError && (
          <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
            {actionError}
          </p>
        )}

      </div>
    </Modal>
  );
};
