'use client';

import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, Sparkles, CheckCircle2, ShieldCheck, FileArchive, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { processUploadedChatFile } from '@/lib/parser/zip-helper';

interface UploadStationProps {
  ownerToken: string;
  isLimitReached: boolean;
  onSuccess: (chatId: string) => void;
  onOpenLimitModal: () => void;
}

export const UploadStation: React.FC<UploadStationProps> = ({
  ownerToken,
  isLimitReached,
  onSuccess,
  onOpenLimitModal,
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
    setIsExtractingZip(true);

    try {
      const { file: extractedTxtFile, inferredTitle, originalFileName } = await processUploadedChatFile(rawFile);
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

    if (!file) {
      setError('Lütfen bir WhatsApp sohbet dosyası (.txt veya iPhone .zip) seçin.');
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

      const res = await fetch('/api/chats', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.limitReached) {
          onOpenLimitModal();
        }
        throw new Error(data.error || 'Sohbet analiz edilemedi.');
      }

      if (data.chat?.id) {
        onSuccess(data.chat.id);
      }
    } catch (err: any) {
      setError(err.message || 'Dosya işlenirken beklenmeyen bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="upload-hub" className="scroll-mt-24">
      <div className="max-w-3xl mx-auto rounded-3xl bg-[#11141A] border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent opacity-80" />

        <div className="text-center space-y-2 max-w-lg mx-auto">
          <span className="w-12 h-12 rounded-2xl bg-[#0284C7]/20 border border-[#38BDF8]/30 text-[#38BDF8] inline-flex items-center justify-center font-emoji text-2xl shadow-glow-blue mb-1">
            💬✨
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Sohbetinizi Yükleyin
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] font-sans">
            WhatsApp uygulamasından <strong>"Sohbeti Dışa Aktar"</strong> (.txt veya iPhone .zip) ile aldığınız dosyayı bırakın.
          </p>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
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
              <Loader2 className="w-10 h-10 text-[#38BDF8] animate-spin" />
              <p className="text-sm font-semibold text-white">
                iPhone ZIP arşivi açılıyor ve sohbet ayıklanıyor...
              </p>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shadow-glow-blue">
                {isZip ? <FileArchive className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-white font-mono truncate max-w-xs sm:max-w-md">
                  {displayFileName || file.name}
                </p>
                <p className="text-xs text-[#38BDF8] mt-0.5 font-mono">
                  {isZip ? '✨ iPhone ZIP Sohbeti Hazır • ' : ''}
                  {(displayFileSize ? displayFileSize / 1024 : file.size / 1024).toFixed(1)} KB • Değiştirmek için tıklayın
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#161B22] border border-white/10 text-[#38BDF8] flex items-center justify-center shadow-sm">
                <Upload className="w-6 h-6" />
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
        <div className="max-w-md mx-auto space-y-1">
          <label className="text-xs font-semibold text-[#94A3B8] block">
            Özel Sohbet Başlığı (İsteğe bağlı)
          </label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="Örn: Kadıköy Ekibi ☕"
            className="w-full text-xs sm:text-sm bg-[#0B0D11] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8] transition-colors"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 rounded-2xl flex items-center gap-2.5 text-xs text-red-300 max-w-md mx-auto">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="max-w-md mx-auto pt-1">
          <Button
            variant="blue"
            size="lg"
            onClick={handleUploadAndAnalyze}
            isLoading={isLoading}
            disabled={!file || isExtractingZip}
            className="w-full font-bold text-sm sm:text-base py-3.5 shadow-glow-blue"
          >
            <Sparkles className="w-4 h-4 text-[#0A0C0E]" />
            <span>Analiz Et & Wrapped'ı Aç</span>
          </Button>
        </div>

        {/* Trust Guarantee */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-[#94A3B8]">
          <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
          <span>Verileriniz güvendedir — ham mesaj metinleri hiçbir zaman sunucuya kaydedilmez.</span>
        </div>

      </div>
    </section>
  );
};
