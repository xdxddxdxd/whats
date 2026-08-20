'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Trophy,
  RefreshCw,
  Lock,
  FileArchive,
  Loader2,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { processUploadedChatFile } from '@/lib/parser/zip-helper';
import { getClientOwnerToken, setClientOwnerToken } from '@/lib/utils/session';

interface UploadAndFeaturesSectionProps {
  ownerToken: string;
  isLimitReached: boolean;
  onSuccess: (chatId: string) => void;
  onOpenLimitModal: () => void;
  onOpenGuide?: () => void;
}

export const UploadAndFeaturesSection: React.FC<UploadAndFeaturesSectionProps> = ({
  ownerToken,
  isLimitReached,
  onSuccess,
  onOpenLimitModal,
  onOpenGuide,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [displayFileName, setDisplayFileName] = useState<string>('');
  const [displayFileSize, setDisplayFileSize] = useState<number>(0);
  const [isZip, setIsZip] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExtractingZip, setIsExtractingZip] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = async (rawFile: File) => {
    setError(null);

    if (rawFile.size === 0) {
      setError('Seçilen dosya boş (0 KB). Lütfen mesaj içeren gerçek bir sohbet dosyası seçin.');
      setFile(null);
      return;
    }

    setIsExtractingZip(true);

    try {
      const { file: extractedTxtFile, inferredTitle, originalFileName } = await processUploadedChatFile(rawFile);
      
      if (extractedTxtFile.size === 0) {
        throw new Error('Çıkarılan sohbet dosyasının içi boş görünüyor.');
      }

      setFile(extractedTxtFile);
      setDisplayFileName(originalFileName);
      setDisplayFileSize(rawFile.size);
      setIsZip(originalFileName.toLowerCase().endsWith('.zip'));

      if (inferredTitle && !customTitle.trim()) {
        setCustomTitle(inferredTitle);
      }
    } catch (err: any) {
      setError(err.message || 'Dosya seçilirken bir hata oluştu.');
      setFile(null);
    } finally {
      setIsExtractingZip(false);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (isLimitReached) {
      onOpenLimitModal();
      return;
    }

    if (!file || file.size === 0) {
      setError('Lütfen mesaj içeren geçerli bir WhatsApp sohbet dosyası (.txt veya iPhone .zip) seçin.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = ownerToken || getClientOwnerToken();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('owner_token', token);
      if (customTitle.trim()) {
        formData.append('title', customTitle.trim());
      }

      const res = await fetch('/api/chats', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.limitReached) {
          onOpenLimitModal();
        }
        throw new Error(data.error || 'Sohbet analiz edilirken sunucu yanıt vermedi.');
      }

      if (data.owner_token) {
        setClientOwnerToken(data.owner_token);
      }

      if (data.chat?.id) {
        onSuccess(data.chat.id);
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError('Sunucu bağlantısı sağlanamadı veya işlem zaman aşımına uğradı. Lütfen tekrar deneyin.');
      } else {
        setError(err.message || 'Dosya işlenirken beklenmeyen bir hata oluştu.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="upload-hub" className="scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SOL: Yükleme İstasyonu & 3 Adımlı Rehber (Upload Box) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#11141A] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Ambient Top Glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent opacity-80" />

          {/* Header & Step Guide Trigger */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="w-10 h-10 rounded-2xl bg-[#0284C7]/20 border border-[#38BDF8]/30 text-[#38BDF8] inline-flex items-center justify-center font-emoji text-xl shadow-glow-blue mb-2">
                💬✨
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Sohbetinizi Yükleyin
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] font-sans mt-1">
                WhatsApp'tan <strong>"Medyasız"</strong> dışa aktardığınız sohbet dosyasını yükleyin.
              </p>
            </div>

            {onOpenGuide && (
              <button
                type="button"
                onClick={onOpenGuide}
                className="shrink-0 px-3 py-2 rounded-xl bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/30 text-xs font-bold text-[#38BDF8] transition-all flex items-center gap-1.5 font-mono shadow-sm"
              >
                <span>Nasıl Yapılır?</span>
                <span>📱</span>
              </button>
            )}
          </div>

          {/* 3-Step Mini Onboarding Strip */}
          <div className="p-3.5 rounded-2xl bg-[#0B0D11] border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#38BDF8] font-bold uppercase tracking-wider">
              <span>3 Adımda Hızlı Başlangıç</span>
              <span className="text-[#64748B] font-normal">Sıfır Kurulum</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <span className="w-5 h-5 rounded-lg bg-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center text-[10px] font-mono font-black">1</span>
                  <span>Sohbeti Açın</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-tight">WhatsApp'ta kişi veya grup ismine dokunun.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <span className="w-5 h-5 rounded-lg bg-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center text-[10px] font-mono font-black">2</span>
                  <span>Dışa Aktar</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-tight">En alttan <strong>"Medyasız"</strong> seçin.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <span className="w-5 h-5 rounded-lg bg-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center text-[10px] font-mono font-black">3</span>
                  <span>Buraya Bırakın</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-tight">.txt veya .zip dosyasını seçin.</p>
              </div>
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-3xl border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-[#38BDF8] bg-[#38BDF8]/10 scale-[0.99]'
                : file
                ? 'border-[#38BDF8] bg-[#0B0D11]'
                : 'border-white/15 hover:border-[#38BDF8]/60 bg-[#0B0D11] hover:bg-[#0E1015]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.zip,application/zip,application/x-zip-compressed,multipart/x-zip,text/plain"
              className="hidden"
              onChange={handleFileChange}
            />

            {isExtractingZip ? (
              <div className="flex flex-col items-center space-y-3 py-2">
                <Loader2 className="w-9 h-9 text-[#38BDF8] animate-spin" />
                <p className="text-xs font-semibold text-white">
                  iPhone ZIP arşivi açılıyor ve sohbet ayıklanıyor...
                </p>
              </div>
            ) : file ? (
              <div className="flex flex-col items-center space-y-2.5">
                <div className="w-12 h-12 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shadow-glow-blue">
                  {isZip ? <FileArchive className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white font-mono truncate max-w-xs sm:max-w-md">
                    {displayFileName || file.name}
                  </p>
                  <p className="text-xs text-[#38BDF8] mt-0.5 font-mono">
                    {isZip ? '✨ iPhone ZIP Sohbeti Hazır • ' : ''}
                    {(displayFileSize ? displayFileSize / 1024 : file.size / 1024).toFixed(1)} KB • Değiştirmek için tıklayın
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2.5">
                <div className="w-12 h-12 rounded-2xl bg-[#161B22] border border-white/10 text-[#38BDF8] flex items-center justify-center shadow-sm">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-white">
                    WhatsApp dosyasını buraya sürükleyin
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    iPhone / Android .zip veya .txt seçmek için tıklayın
                  </p>
                </div>
                <span className="text-[11px] text-[#94A3B8] bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  iPhone (.zip), Android ve Masaüstü (.txt) desteklenir
                </span>
              </div>
            )}
          </div>

          {/* Optional Title input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#94A3B8] block">
              Özel Sohbet Başlığı (İsteğe bağlı)
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Örn: Hafta Sonu Çetesi 🍕 veya nisa & Doğukan 🤍"
              className="w-full text-xs sm:text-sm bg-[#0B0D11] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8] transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800 rounded-2xl flex items-center gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <Button
            variant="blue"
            size="lg"
            onClick={handleUploadAndAnalyze}
            isLoading={isLoading}
            disabled={!file || file.size === 0 || isExtractingZip}
            className="w-full font-bold text-sm sm:text-base py-3.5 shadow-glow-blue"
          >
            <Sparkles className="w-4 h-4 text-[#0A0C0E]" />
            <span>Analiz Et & Wrapped'ı Aç</span>
          </Button>

          {/* Trust Guarantee */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-[#94A3B8]">
            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
            <span>Verileriniz güvendedir — ham mesaj metinleri sunucuya kaydedilmez.</span>
          </div>

        </div>

        {/* SAĞ: Özellik Kartları (Features Showcase) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          
          {/* Feature 1: Wrapped Story Modu */}
          <div className="p-5 rounded-3xl bg-[#11141A] border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0284C7]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Spotify Wrapped Tarzı Story</h4>
                <span className="text-[11px] text-[#38BDF8] font-mono">7 İnteraktif Slayt & PDF Albümü</span>
              </div>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed font-sans pt-1">
              Gruptaki en alevli saatleri, rekor mesaj sayılarını ve en çok kullanılan emojileri Instagram Story akışında izleyin veya PDF olarak indirin.
            </p>
          </div>

          {/* Feature 2: Grup Kişilik Ödülleri */}
          <div className="p-5 rounded-3xl bg-[#11141A] border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0284C7]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Grup Kişilik & Geyik Ödülleri</h4>
                <span className="text-[11px] text-[#38BDF8] font-mono">Trip Şampiyonu 🎭 • Dedikodu ☕ • Hayalet 👻</span>
              </div>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed font-sans pt-1">
              Yapay zekamız kimin geç cevap verdiğini, kimin geceleri nöbet tuttuğunu ve kimin trip attığını hesaplayıp unvanlarını dağıtır.
            </p>
          </div>

          {/* Feature 3: Sıfır Metin Depolama & Güvenlik */}
          <div className="p-5 rounded-3xl bg-[#11141A] border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0284C7]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Sıfır Metin Saklama & Şifreli Giriş</h4>
                <span className="text-[11px] text-[#38BDF8] font-mono">%100 Gizli & Şifreli Erişim</span>
              </div>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed font-sans pt-1">
              Ham mesaj metinleri veritabanına kaydedilmez. Sadece hesaplanan istatistikler ve PIN ile korunan davet linkiniz saklanır.
            </p>
          </div>

          {/* Feature 4: Artımlı Güncelleme */}
          <div className="p-5 rounded-3xl bg-[#11141A] border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0284C7]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Artımlı Güncelleme & AI Soru Sorma</h4>
                <span className="text-[11px] text-[#38BDF8] font-mono">Delta Tracker • 5 Soru Limitli AI</span>
              </div>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed font-sans pt-1">
              Yeni bir dışa aktarım yüklediğinizde sıfırdan başlamazsınız; sistem önceki mesajları tanır ve yalnızca yeni mesajları ekler.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
