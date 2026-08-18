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
  FileDown,
  Lock,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface UploadAndFeaturesSectionProps {
  ownerToken: string;
  isLimitReached: boolean;
  onSuccess: (chatId: string) => void;
  onOpenLimitModal: () => void;
}

export const UploadAndFeaturesSection: React.FC<UploadAndFeaturesSectionProps> = ({
  ownerToken,
  isLimitReached,
  onSuccess,
  onOpenLimitModal,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    if (!selectedFile.name.endsWith('.txt')) {
      setError('Lütfen sadece WhatsApp sohbet dışa aktarım metin dosyasını (.txt) seçin.');
      return;
    }
    setFile(selectedFile);
  };

  const handleUploadAndAnalyze = async () => {
    if (isLimitReached) {
      onOpenLimitModal();
      return;
    }

    if (!file) {
      setError('Lütfen bir WhatsApp .txt sohbet dosyası seçin.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('owner_token', ownerToken);
      if (customTitle.trim()) {
        formData.append('title', customTitle.trim());
      }

      const res = await fetch('/api/chats', {\n        method: 'POST',\n        body: formData,\n      });\n\n      const data = await res.json();\n\n      if (!res.ok) {\n        if (data.limitReached) {\n          onOpenLimitModal();\n        }\n        throw new Error(data.error || 'Sohbet analiz edilemedi.');\n      }\n\n      if (data.chat?.id) {\n        onSuccess(data.chat.id);\n      }\n    } catch (err: any) {\n      setError(err.message || 'Dosya işlenirken beklenmeyen bir hata oluştu.');\n    } finally {\n      setIsLoading(false);\n    }\n  };\n\n  return (\n    <section id=\"upload-hub\" className=\"scroll-mt-24\">\n      <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-8 items-start\">\n        \n        {/* SOL: Yükleme İstasyonu (Upload Box) */}\n        <div className=\"lg:col-span-7 rounded-3xl bg-[#11141A] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5 relative overflow-hidden\">\n          \n          {/* Ambient Top Glow */}\n          <div className=\"absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent opacity-80\" />\n\n          <div>\n            <span className=\"w-10 h-10 rounded-2xl bg-[#0284C7]/20 border border-[#38BDF8]/30 text-[#38BDF8] inline-flex items-center justify-center font-emoji text-xl shadow-glow-blue mb-2\">\n              💬✨\n            </span>\n            <h2 className=\"text-2xl sm:text-3xl font-extrabold tracking-tight text-white\">\n              Sohbetinizi Yükleyin\n            </h2>\n            <p className=\"text-xs sm:text-sm text-[#94A3B8] font-sans mt-1\">\n              WhatsApp uygulamasından <strong>\"Sohbeti Dışa Aktar\"</strong> (.txt) ile aldığınız dosyayı bırakın.\n            </p>\n          </div>\n\n          {/* Drag & Drop Zone */}\n          <div\n            onDragOver={handleDragOver}\n            onDragLeave={handleDragLeave}\n            onDrop={handleDrop}\n            onClick={() => fileInputRef.current?.click()}\n            className={`rounded-3xl border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ${\n              isDragging\n                ? 'border-[#38BDF8] bg-[#38BDF8]/10 scale-[0.99]'\n                : file\n                ? 'border-[#38BDF8] bg-[#0B0D11]'\n                : 'border-white/15 hover:border-[#38BDF8]/60 bg-[#0B0D11] hover:bg-[#0E1015]'\n            }`}\n          >\n            <input\n              ref={fileInputRef}\n              type=\"file\"\n              accept=\".txt\"\n              className=\"hidden\"\n              onChange={handleFileChange}\n            />\n\n            {file ? (\n              <div className=\"flex flex-col items-center space-y-2.5\">\n                <div className=\"w-12 h-12 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shadow-glow-blue\">\n                  <CheckCircle2 className=\"w-6 h-6\" />\n                </div>\n                <div>\n                  <p className=\"text-sm font-bold text-white font-mono truncate max-w-xs sm:max-w-md\">\n                    {file.name}\n                  </p>\n                  <p className=\"text-xs text-[#38BDF8] mt-0.5 font-mono\">\n                    {(file.size / 1024).toFixed(1)} KB • Değiştirmek için tıklayın\n                  </p>\n                </div>\n              </div>\n            ) : (\n              <div className=\"flex flex-col items-center space-y-2.5\">\n                <div className=\"w-12 h-12 rounded-2xl bg-[#161B22] border border-white/10 text-[#38BDF8] flex items-center justify-center shadow-sm\">\n                  <Upload className=\"w-5 h-5\" />\n                </div>\n                <div>\n                  <p className=\"text-sm sm:text-base font-bold text-white\">\n                    WhatsApp .txt dosyasını buraya sürükleyin\n                  </p>\n                  <p className=\"text-xs text-[#94A3B8] mt-0.5\">\n                    veya dosya seçmek için tıklayın\n                  </p>\n                </div>\n                <span className=\"text-[11px] text-[#94A3B8] bg-white/5 px-3 py-1 rounded-full border border-white/10\">\n                  iOS ve Android sohbet dışa aktarımları desteklenir\n                </span>\n              </div>\n            )}\n          </div>\n\n          {/* Optional Title input */}\n          <div className=\"space-y-1\">\n            <label className=\"text-xs font-semibold text-[#94A3B8] block\">\n              Özel Sohbet Başlığı (İsteğe bağlı)\n            </label>\n            <input\n              type=\"text\"\n              value={customTitle}\n              onChange={(e) => setCustomTitle(e.target.value)}\n              placeholder=\"Örn: Hafta Sonu Çetesi 🍕\"\n              className=\"w-full text-xs sm:text-sm bg-[#0B0D11] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8] transition-colors\"\n            />\n          </div>\n\n          {error && (\n            <div className=\"p-3 bg-red-950/60 border border-red-800 rounded-2xl flex items-center gap-2.5 text-xs text-red-300\">\n              <AlertCircle className=\"w-4 h-4 shrink-0\" />\n              <span>{error}</span>\n            </div>\n          )}\n\n          {/* Action Button */}\n          <Button\n            variant=\"blue\"\n            size=\"lg\"\n            onClick={handleUploadAndAnalyze}\n            isLoading={isLoading}\n            disabled={!file}\n            className=\"w-full font-bold text-sm sm:text-base py-3.5 shadow-glow-blue\"\n          >\n            <Sparkles className=\"w-4 h-4 text-[#0A0C0E]\" />\n            <span>Analiz Et & Wrapped'ı Aç</span>\n          </Button>\n\n          {/* Trust Guarantee */}\n          <div className=\"pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-[#94A3B8]\">\n            <ShieldCheck className=\"w-4 h-4 text-[#38BDF8]\" />\n            <span>Verileriniz güvendedir — ham mesajlar sunucuya kaydedilmez.</span>\n          </div>\n\n        </div>\n\n        {/* SAĞ: Özellik Kartları (Features Showcase) */}\n        <div className=\"lg:col-span-5 space-y-4 flex flex-col justify-between\">\n          \n          {/* Feature 1: Wrapped Story Modu */}\n          <div className=\"p-5 rounded-3xl bg-[#11141A] border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 space-y-2\">\n            <div className=\"flex items-center gap-3\">\n              <div className=\"w-10 h-10 rounded-2xl bg-[#0284C7]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0\">\n                <Sparkles className=\"w-5 h-5\" />\n              </div>\n              <div>\n                <h4 className=\"text-base font-bold text-white\">Spotify Wrapped Tarzı Story</h4>\n                <span className=\"text-[11px] text-[#38BDF8] font-mono\">Tam Ekran & PDF Albümü</span>\n              </div>\n            </div>\n            <p className=\"text-xs text-[#94A3B8] leading-relaxed font-sans pt-1\">\n              Gruptaki en alevli saatleri, rekor mesaj sayılarını ve en çok kullanılan emojileri Instagram Story akışında izleyin veya PDF olarak indirin.\n            </p>\n          </div>\n\n          {/* Feature 2: Grup Kişilik Ödülleri */}\n          <div className=\"p-5 rounded-3xl bg-[#11141A] border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 space-y-2\">\n            <div className=\"flex items-center gap-3\">\n              <div className=\"w-10 h-10 rounded-2xl bg-[#0284C7]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0\">\n                <Trophy className=\"w-5 h-5\" />\n              </div>\n              <div>\n                <h4 className=\"text-base font-bold text-white\">Grup Kişilik Ödülleri</h4>\n                <span className=\"text-[11px] text-[#38BDF8] font-mono\">Gece Kuşu 🦉 • Hayalet 👻 • Jet ⚡</span>\n              </div>\n            </div>\n            <p className=\"text-xs text-[#94A3B8] leading-relaxed font-sans pt-1\">\n              Yapay zekamız kimin geç cevap verdiğini, kimin geceleri yazdığını ve kimin paragraflara doyamadığını hesaplayıp unvanlarını dağıtır.\n            </p>\n          </div>\n\n          {/* Feature 3: Sıfır Metin Depolama & Güvenlik */}\n          <div className=\"p-5 rounded-3xl bg-[#11141A] border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 space-y-2\">\n            <div className=\"flex items-center gap-3\">\n              <div className=\"w-10 h-10 rounded-2xl bg-[#0284C7]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0\">\n                <Lock className=\"w-5 h-5\" />\n              </div>\n              <div>\n                <h4 className=\"text-base font-bold text-white\">Sıfır Metin Saklama & Şifreli Giriş</h4>\n                <span className=\"text-[11px] text-[#38BDF8] font-mono\">%100 Gizli & Şifreli Erişim</span>\n              </div>\n            </div>\n            <p className=\"text-xs text-[#94A3B8] leading-relaxed font-sans pt-1\">\n              Ham mesaj metinleri veritabanına kaydedilmez. Sadece hesaplanan istatistikler ve PIN ile korunan davet linkiniz saklanır.\n            </p>\n          </div>\n\n          {/* Feature 4: Artımlı Güncelleme */}\n          <div className=\"p-5 rounded-3xl bg-[#11141A] border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 space-y-2\">\n            <div className=\"flex items-center gap-3\">\n              <div className=\"w-10 h-10 rounded-2xl bg-[#0284C7]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0\">\n                <RefreshCw className=\"w-5 h-5\" />\n              </div>\n              <div>\n                <h4 className=\"text-base font-bold text-white\">Artımlı Sohbet Güncelleme</h4>\n                <span className=\"text-[11px] text-[#38BDF8] font-mono\">Incremental Delta Tracker</span>\n              </div>\n            </div>\n            <p className=\"text-xs text-[#94A3B8] leading-relaxed font-sans pt-1\">\n              Yeni bir dışa aktarım yüklediğinizde sıfırdan başlamazsınız; sistem önceki mesajları tanır ve yalnızca yeni mesajları ekler.\n            </p>\n          </div>\n\n        </div>\n\n      </div>\n    </section>\n  );\n};\n