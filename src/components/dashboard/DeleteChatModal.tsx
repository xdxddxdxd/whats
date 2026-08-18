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

export const DeleteChatModal: React.FC<DeleteChatModalProps> = ({\n  isOpen,\n  onClose,\n  chatId,\n  chatTitle,\n  ownerToken,\n  onSuccess,\n}) => {\n  const [isLoading, setIsLoading] = useState(false);\n  const [error, setError] = useState<string | null>(null);\n\n  const handleDelete = async () => {\n    setIsLoading(true);\n    setError(null);\n\n    try {\n      const res = await fetch(`/api/chats/${chatId}?owner_token=${ownerToken}`, {\n        method: 'DELETE',\n      });\n\n      const data = await res.json();\n\n      if (!res.ok) {\n        throw new Error(data.error || 'Silme işlemi başarısız.');\n      }\n\n      onSuccess();\n      onClose();\n    } catch (err: any) {\n      setError(err.message || 'Sohbet silinirken hata oluştu.');\n    } finally {\n      setIsLoading(false);\n    }\n  };\n\n  return (\n    <Modal\n      isOpen={isOpen}\n      onClose={onClose}\n      title=\"Sohbeti Kalıcı Olarak Sil 🗑️\"\n      subtitle=\"Bu işlem geri alınamaz.\"\n    >\n      <div className=\"space-y-4\">\n        <div className=\"p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-900 text-xs\">\n          <AlertTriangle className=\"w-5 h-5 shrink-0 mt-0.5 text-red-600\" />\n          <div>\n            <p className=\"font-bold\">\"{chatTitle}\" sohbetini silmek istediğinize emin misiniz?</p>\n            <p className=\"mt-1 opacity-90 leading-relaxed\">\n              Bu sohbete ait tüm analizler, kişilik kartları, Wrapped slaytları ve davet bağlantıları veritabanından tamamen silinecektir.\n            </p>\n          </div>\n        </div>\n\n        {error && (\n          <p className=\"text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200\">\n            {error}\n          </p>\n        )}\n\n        <div className=\"flex items-center justify-end gap-2 pt-2\">\n          <Button variant=\"ghost\" onClick={onClose} disabled={isLoading}>\n            Vazgeç\n          </Button>\n          <Button variant=\"danger\" onClick={handleDelete} isLoading={isLoading}>\n            <Trash2 className=\"w-4 h-4\" />\n            <span>Evet, Tamamen Sil</span>\n          </Button>\n        </div>\n      </div>\n    </Modal>\n  );\n};\n