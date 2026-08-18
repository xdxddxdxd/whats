'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface LimitWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LimitWarningModal: React.FC<LimitWarningModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sohbet Sınırına Ulaşıldı 🔒"
      subtitle="Aynı anda en fazla 2 sohbet analiz edebilirsiniz."
    >
      <div className="space-y-4">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800 text-xs">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
          <div className="space-y-1.5">
            <p className="font-bold text-sm">2 Sohbet Kotanız Doldu</p>
            <p className="leading-relaxed">
              Her kullanıcının gizliliğini korumak ve sunucu kaynaklarını dengeli tutmak için sistem aynı anda en fazla 2 aktif sohbet tutmanıza izin verir.
            </p>
            <p className="leading-relaxed font-semibold text-amber-900">
              Yeni bir sohbet analiz etmek için lütfen ana sayfadaki mevcut sohbetlerinizden birini silin.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" onClick={onClose}>
            Anladım
          </Button>
        </div>
      </div>
    </Modal>
  );
};
