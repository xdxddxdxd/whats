'use client';

import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { processUploadedChatFile } from '@/lib/parser/zip-helper';

interface IncrementalUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  ownerToken: string;
  onSuccess: () => void;
}

export const IncrementalUpdateModal: React.FC<IncrementalUpdateModalProps> = ({
  isOpen,
  onClose,
  chatId,
  ownerToken,
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [displayFileName, setDisplayFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExtractingZip, setIsExtractingZip] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const rawFile = e.target.files[0];
      setError(null);
      setSuccessMsg(null);
      setIsExtractingZip(true);

      try {
        const { file: extractedFile, originalFileName } = await processUploadedChatFile(rawFile);
        setFile(extractedFile);
        setDisplayFileName(originalFileName);
      } catch (err: any) {
        setError(err.message || 'Dosya seçilirken hata oluştu.');
        setFile(null);
      } finally {
        setIsExtractingZip(false);
      }
    }
  };

  const handleUpdate = async () => {
    if (!file) {
      setError('Lütfen güncel WhatsApp export dosyasını (.txt veya iPhone .zip) seçin.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('owner_token', ownerToken);

      const res = await fetch(`/api/chats/${chatId}/update`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Güncelleme başarısız oldu.');
      }

      setSuccessMsg(data.message || 'Sohbet başarıyla güncellendi!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Güncelleme sırasında hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sohbeti Güncelle (Artımlı Analiz) 🔄"
      subtitle="Yeni dışa aktardığınız dosyayı (.txt veya iPhone .zip) yükleyin, sadece yeni mesajlar analiz edilsin."
    >
      <div className="space-y-4">
        <div className="border-2 border-dashed border-[#E5E9F0] rounded-2xl p-6 text-center hover:border-[#38BDF8] transition-colors bg-[#F7F9FC]">
          <input
            type="file"
            accept=".txt,.zip,application/zip,application/x-zip-compressed,multipart/x-zip,text/plain"
            id="update-file-input"
            className="hidden"
            onChange={handleFileChange}
          />
          <label htmlFor="update-file-input" className="cursor-pointer block">
            {isExtractingZip ? (
              <div className="flex flex-col items-center space-y-2 py-2">
                <Loader2 className="w-8 h-8 text-[#0284C7] animate-spin" />
                <span className="text-xs font-semibold text-[#0A0A0A]">ZIP açılıyor...</span>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-[#0284C7] mx-auto mb-2" />
                <span className="text-sm font-bold text-[#0A0A0A] block">
                  {displayFileName || (file ? file.name : 'Yeni .txt veya iPhone .zip seçin')}
                </span>
                <span className="text-xs text-[#6B7280] mt-1 block">
                  {file ? `${(file.size / 1024).toFixed(1)} KB` : 'WhatsApp dışa aktarımı (.txt veya .zip)'}
                </span>
              </>
            )}
          </label>
        </div>

        <p className="text-[11px] text-[#6B7280] leading-relaxed">
          ⚡ <strong>Artımlı Güncelleme:</strong> Sistem daha önce işlediği mesajları hatırlar ve sadece yeni eklenen sohbet geçmişini ayrıştırıp metrikleri günceller.
        </p>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-xs text-green-700">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleUpdate} isLoading={isLoading} disabled={!file || isExtractingZip}>
            Güncellemeyi Başlat
          </Button>
        </div>
      </div>
    </Modal>
  );
};
