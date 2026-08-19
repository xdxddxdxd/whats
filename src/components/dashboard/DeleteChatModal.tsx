'use client';

import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface DeleteChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  chatTitle: string;
  ownerToken: string;
  onSuccess: () => void;
}

export const DeleteChatModal: React.FC<DeleteChatModalProps> = ({
  isOpen,
  onClose,
  chatId,
  chatTitle,
  ownerToken,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/chats/${chatId}?owner_token=${ownerToken}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Silme işlemi başarısız.');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Sohbet silinirken hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sohbeti Kalıcı Olarak Sil 🗑️"
      subtitle="Bu işlem geri alınamaz."
    >
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-900 text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <div>
            <p className="font-bold">"{chatTitle}" sohbetini silmek istediğinize emin misiniz?</p>
            <p className="mt-1 opacity-90 leading-relaxed">
              Bu sohbete ait tüm analizler, kişilik kartları, Wrapped slaytları ve davet bağlantıları veritabanından tamamen silinecektir.
            </p>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Vazgeç
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isLoading}>
            <Trash2 className="w-4 h-4" />
            <span>Evet, Tamamen Sil</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
