'use client';

import React, { useState, useEffect } from 'react';
import {
  Crown,
  Check,
  Key,
  ShieldCheck,
  Sparkles,
  Copy,
  Zap,
  Lock,
  MessageSquare,
  FileText,
  Flame,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  getLicenseInfo,
  activateLicense,
  generateProLicenseKey,
  removeLicense,
  LicenseInfo,
} from '@/lib/utils/license';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'upgrade' | 'enter_key';
}

export const LicenseModal: React.FC<LicenseModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'upgrade',
}) => {
  const [activeTab, setActiveTab] = useState<'upgrade' | 'enter_key'>(initialTab);
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo>({
    isPro: false,
    tier: 'free',
    licenseKey: null,
    passkeyId: '',
    activatedAt: null,
  });
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const refreshLicense = () => {
    setLicenseInfo(getLicenseInfo());
  };

  useEffect(() => {
    if (isOpen) {
      refreshLicense();
      setError(null);
      setSuccessMsg(null);
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const handleActivateInput = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!inputKey.trim()) {
      setError('Lütfen geçerli bir lisans anahtarı girin.');
      return;
    }

    const res = activateLicense(inputKey.trim());
    if (res.success) {
      setSuccessMsg('🎉 Tebrikler! Pro üyeliğiniz başarıyla aktifleşti.');
      setInputKey('');
      refreshLicense();
    } else {
      setError(res.error || 'Lisans anahtarı doğrulanamadı.');
    }
  };

  const handleSimulatePurchase = () => {
    setIsProcessing(true);
    setError(null);

    // Simulate instant secure key generation
    setTimeout(() => {
      const newKey = generateProLicenseKey();
      activateLicense(newKey);
      setSuccessMsg(`🎉 Tebrikler! Pro Lisansınız tanımlandı: ${newKey}`);
      refreshLicense();
      setIsProcessing(false);
    }, 800);
  };

  const handleCopyKey = () => {
    if (licenseInfo.licenseKey) {
      navigator.clipboard.writeText(licenseInfo.licenseKey);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="👑 WhatsBaba PRO Üyelik & Lisans"
      subtitle="Kayıt formu ve şifre olmadan, tek lisans anahtarıyla tüm ayrıcalıkları açın."
    >
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1 font-sans">
        
        {/* If Already PRO */}
        {licenseInfo.isPro ? (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1C1A14] via-[#14120C] to-[#0A0906] border border-amber-500/40 shadow-2xl text-center space-y-4 relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-black flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(245,158,11,0.5)]">
              <Crown className="w-7 h-7 fill-black" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 uppercase tracking-wider">
                👑 PRO Üyelik Aktif
              </span>
              <h3 className="text-xl font-bold text-white mt-2">
                Tüm Premium Özellikler Açık!
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Yapay zeka asistanı, 15+ Story kartı ve tüm psikolojik unvanlar cihazınıza tanımlandı.
              </p>
            </div>

            {/* License Key Display & Copy */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3 text-left">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Kişisel Lisans / Kurtarma Anahtarınız:</span>
                <span className="text-sm font-mono font-bold text-amber-300 tracking-wider">
                  {licenseInfo.licenseKey}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyKey}
                className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-white/5">
              <span>Cihaz Passkey ID: {licenseInfo.passkeyId}</span>
              <button
                type="button"
                onClick={() => {
                  removeLicense();
                  refreshLicense();
                }}
                className="text-red-400/80 hover:text-red-300 text-xs underline"
              >
                Lisansı Kaldır
              </button>
            </div>

            <Button variant="blue" className="w-full font-bold py-3 mt-2" onClick={onClose}>
              Harika, Kullanmaya Başla
            </Button>
          </div>
        ) : (
          /* If FREE -> Show Upgrade & Enter Key Tabs */
          <div className="space-y-5">
            
            {/* Tabs Selector */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#141A22] border border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('upgrade')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'upgrade'
                    ? 'bg-[#0284C7] text-white shadow-md'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Crown className="w-4 h-4 text-yellow-300" />
                <span>👑 PRO'ya Yükselt</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('enter_key')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'enter_key'
                    ? 'bg-[#0284C7] text-white shadow-md'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Key className="w-4 h-4 text-emerald-300" />
                <span>🔑 Anahtarım Var</span>
              </button>
            </div>

            {/* TAB 1: UPGRADE (PRO BENEFITS) */}
            {activeTab === 'upgrade' && (
              <div className="space-y-4">
                
                {/* Pro Features Checklist */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#11141A] border border-slate-200 dark:border-white/10 space-y-2.5 shadow-sm">
                  <div className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                    <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong>Sınırsız Yapay Zeka Asistanı:</strong> Sohbetinize dair istediğiniz her şeyi sınırsızca sorun.</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                    <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong>15+ Slaytlık Full Spotify Wrapped:</strong> Trip, Dedikodu, Alevli Tartışma & Uyum Slaytları.</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                    <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong>15+ Psikolojik Unvan:</strong> Detaylı grup karakteri ve gizli davranış haritası.</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                    <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong>Ultra HD & Filigransız PDF:</strong> Instagram Story formatında yüksek çözünürlük indirme.</span>
                  </div>
                </div>

                {/* Offer Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-900/30 via-slate-900/40 to-emerald-900/30 border border-sky-500/30 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">Özel Tanıtım Fiyatı</span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-2xl font-extrabold text-white">₺49</span>
                      <span className="text-xs text-slate-400 line-through">₺149</span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded ml-1">%67 İndirim</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Tek seferlik ödeme • Ömür boyu geçerli lisans</span>
                  </div>

                  <Button
                    variant="blue"
                    size="md"
                    onClick={handleSimulatePurchase}
                    isLoading={isProcessing}
                    className="font-bold text-xs px-5 py-3 shadow-glow-blue shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-black" />
                    <span>Hemen Pro'ya Geç</span>
                  </Button>
                </div>

                {/* Zero Friction note */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Şifre veya e-posta gerekmez. Lisans anahtarınız doğrudan bu cihaza tanımlanır.</span>
                </div>

              </div>
            )}

            {/* TAB 2: ENTER LICENSE KEY */}
            {activeTab === 'enter_key' && (
              <form onSubmit={handleActivateInput} className="space-y-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#11141A] border border-slate-200 dark:border-white/10 space-y-3">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    12 Haneli Lisans / Kurtarma Anahtarınız
                  </label>
                  
                  <div className="relative">
                    <input
                      type="text"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value.toUpperCase())}
                      placeholder="Örn: BABA-PRO-7491 veya WHATS2026"
                      className="w-full bg-slate-50 dark:bg-[#0B0D11] border border-slate-300 dark:border-white/15 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white font-mono placeholder-slate-400 focus:outline-none focus:border-[#38BDF8] transition-colors uppercase tracking-wider"
                    />
                    <Key className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Daha önce satın aldığınız veya başka bir cihazda kullandığınız lisans kodunu buraya girerek Pro üyeliğinizi bu cihaza da anında aktarabilirsiniz.
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-semibold">
                    {error}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold">
                    {successMsg}
                  </div>
                )}

                <Button variant="blue" type="submit" className="w-full font-bold py-3">
                  <Check className="w-4 h-4 text-black" />
                  <span>Anahtarı Doğrula & Aktifleştir</span>
                </Button>
              </form>
            )}

          </div>
        )}

      </div>
    </Modal>
  );
};
