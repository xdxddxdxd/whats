'use client';

import React, { useState } from 'react';
import { Smartphone, Apple, CheckCircle2, FileText, Share2, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface HowToExportGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReadyToUpload?: () => void;
}

export const HowToExportGuideModal: React.FC<HowToExportGuideModalProps> = ({
  isOpen,
  onClose,
  onReadyToUpload,
}) => {
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');

  const iosSteps = [
    {
      step: '1',
      title: 'Sohbet Detayına Girin',
      desc: 'WhatsApp\'ta analiz etmek istediğiniz sohbeti açın ve en üstteki kişi veya grup ismine dokunun.',
      icon: Smartphone,
      highlight: 'Kişi / Grup Bilgisi',
    },
    {
      step: '2',
      title: '"Sohbeti Dışa Aktar" & "Medyasız"',
      desc: 'Açılan sayfanın en altına inin. "Sohbeti Dışa Aktar" seçeneğine basın ve çıkan uyarıda mutlaka "Medyasız" (Attach Without Media) seçin.',
      icon: Share2,
      highlight: 'Medyasız Seçin (Hızlı ve Güvenli)',
    },
    {
      step: '3',
      title: 'Dosyayı Buraya Yükleyin',
      desc: 'Oluşan .zip veya .txt dosyasını "Dosyalar"a kaydedin veya doğrudan sitemize yükleyin. Analiziniz 5 saniyede hazır!',
      icon: FileText,
      highlight: '.zip veya .txt Desteklenir',
    },
  ];

  const androidSteps = [
    {
      step: '1',
      title: 'Üç Nokta Menüsüne Dokunun',
      desc: 'Sohbet penceresinin sağ üst köşesindeki üç nokta (⋮) simgesine dokunun.',
      icon: Smartphone,
      highlight: 'Sağ Üst Menü (⋮)',
    },
    {
      step: '2',
      title: 'Diğer > Sohbeti Dışa Aktar',
      desc: '"Diğer" seçeneğine, ardından "Sohbeti Dışa Aktar"a basın. "Medyasız" seçeneğini işaretleyin.',
      icon: Share2,
      highlight: 'Diğer ➔ Sohbeti Dışa Aktar',
    },
    {
      step: '3',
      title: 'Metin Dosyasını Yükleyin',
      desc: 'Oluşan .txt dosyasını kendinize gönderip buraya bırakın veya dosya seçiciyle yükleyin.',
      icon: FileText,
      highlight: 'Sıfır Bekleme • Anında Sonuç',
    },
  ];

  const currentSteps = platform === 'ios' ? iosSteps : androidSteps;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="WhatsApp Sohbeti Nasıl Dışa Aktarılır? 📱"
      subtitle="Yalnızca 3 basit adımda sohbetinizi medyasız olarak alıp yükleyebilirsiniz."
    >
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
        
        {/* Platform Selector Tabs */}
        <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setPlatform('ios')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              platform === 'ios'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-900" />
            <span>iPhone / iOS Rehberi</span>
          </button>

          <button
            type="button"
            onClick={() => setPlatform('android')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              platform === 'android'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Android Rehberi</span>
          </button>
        </div>

        {/* Steps Cards */}
        <div className="space-y-3">
          {currentSteps.map((s, idx) => {
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-3.5 hover:border-sky-300 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-mono font-black text-sm shrink-0">
                  {s.step}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{s.title}</h4>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 truncate">
                      {s.highlight}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Privacy Note */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="leading-snug">
            <strong>%100 Gizlilik Garantisi:</strong> Fotoğraf, video ve ham mesaj metinleri sunucuda saklanmaz; yalnızca anonim istatistikler ve unvanlar hesaplanır.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="ghost" onClick={onClose}>
            Kapat
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              if (onReadyToUpload) onReadyToUpload();
            }}
          >
            <Sparkles className="w-4 h-4 text-sky-200" />
            <span>Hazırım, Sohbeti Yükle</span>
          </Button>
        </div>

      </div>
    </Modal>
  );
};
