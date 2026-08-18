'use client';

import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, Sparkles, CheckCircle, ShieldCheck, Info, FileArchive, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { processUploadedChatFile } from '@/lib/parser/zip-helper';

interface FileUploaderProps {
  ownerToken: string;
  isLimitReached: boolean;
  onSuccess: (chatId: string) => void;
  onOpenLimitModal: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
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
    <div className="space-y-4">
      
      {/* Upload Card Header */}
      <div>
        <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
          Sohbetinizi Yükleyin
        </h3>
        <p className="text-xs sm:text-sm text-[#A3A3A3] mt-1 font-sans">
          WhatsApp dosyanızı (.txt veya iPhone .zip) sürükleyin — analiz anında hazır.
        </p>
      </div>

      {/* Main Drag & Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`rounded-3xl border-2 border-dashed p-8 sm:p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-[#38BDF8] bg-[#38BDF8]/10 scale-[0.99]'
            : file
            ? 'border-[#38BDF8] bg-[#121519]'
            : 'border-white/15 hover:border-[#38BDF8]/60 bg-[#121519] hover:bg-[#161A1F]'
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
              {isZip ? <FileArchive className="w-7 h-7" /> : <CheckCircle className="w-7 h-7" />}
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-white font-mono truncate max-w-xs sm:max-w-md">
                {displayFileName || file.name}
              </p>
              <p className="text-xs text-[#38BDF8] mt-0.5">
                {isZip ? '✨ iPhone ZIP Sohbeti Hazır • ' : ''}
                {(displayFileSize ? displayFileSize / 1024 : file.size / 1024).toFixed(1)} KB • Değiştirmek için tıklayın
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#1C2128] border border-white/10 text-[#38BDF8] flex items-center justify-center shadow-sm">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-bold text-white">
                WhatsApp sohbet dosyanızı buraya sürükleyin
              </p>
              <p className="text-xs text-[#A3A3A3]">
                iPhone / Android ZIP veya .txt seçmek için tıklayın
              </p>
            </div>
            <span className="inline-block text-[11px] text-[#A3A3A3] bg-white/5 px-3 py-1 rounded-full border border-white/10">
              iPhone (.zip), Android ve Masaüstü (.txt) desteklenir
            </span>
          </div>
        )}
      </div>

      {/* Optional Title input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#A3A3A3] block">
          Sohbet Başlığı (İsteğe bağlı)
        </label>
        <input
          type="text"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          placeholder="Örn: Hafta Sonu Çetesi 🍕"
          className="w-full text-xs sm:text-sm bg-[#121519] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#38BDF8] transition-colors"
        />
      </div>

      {error && (
        <div className="p-3.5 bg-red-950/50 border border-red-800 rounded-2xl flex items-start gap-2.5 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Button */}
      <Button
        variant="blue"
        size="lg"
        onClick={handleUploadAndAnalyze}
        isLoading={isLoading}
        disabled={!file || isExtractingZip}
        className="w-full font-bold text-sm sm:text-base shadow-glow-blue"
      >
        <Sparkles className="w-4 h-4 text-[#0A0A0A]" />
        <span>Sohbeti Analiz Et & Wrapped Aç</span>
      </Button>

      {/* File & Privacy Info Box */}
      <div className="p-4 rounded-2xl bg-[#121519] border border-white/10 text-xs space-y-2">
        <div className="flex items-center justify-between text-white font-semibold">
          <span className="flex items-center gap-1.5 text-[#38BDF8]">
            <Info className="w-3.5 h-3.5" />
            <span>Apple iOS & Android Uyumlu</span>
          </span>
          <span className="font-mono text-[11px] text-[#A3A3A3]">Maks. 50MB</span>
        </div>
        <p className="text-[11px] text-[#A3A3A3] leading-relaxed">
          iPhone'dan <em>"Medyasız Aktar"</em> diyerek aldığınız <strong>.zip</strong> arşivlerini doğrudan yükleyebilirsiniz, sistem otomatik açar.
        </p>
        <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-[#38BDF8]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Gizlilik Güvencesi: Ham mesaj metinleri veritabanında saklanmaz.</span>
        </div>
      </div>

    </div>
  );
};
