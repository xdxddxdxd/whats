'use client';

import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, CheckCircle, FileDown } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { WrappedSlideData } from '@/lib/ai/types';
import { WrappedSlide } from './WrappedSlide';

interface WrappedPdfExporterProps {
  isOpen: boolean;
  onClose: () => void;
  slides: WrappedSlideData[];
  chatTitle: string;
}

export const WrappedPdfExporter: React.FC<WrappedPdfExporterProps> = ({
  isOpen,
  onClose,
  slides,
  chatTitle,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!containerRef.current || slides.length === 0) return;

    setIsExporting(true);
    setIsSuccess(false);
    setExportProgress(10);

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [108, 192],
      });

      const slideElements = containerRef.current.querySelectorAll('.pdf-slide-container');

      for (let i = 0; i < slideElements.length; i++) {
        const el = slideElements[i] as HTMLElement;
        setExportProgress(Math.round(((i + 1) / slideElements.length) * 80) + 10);

        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#0A0A0A',
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (i > 0) {
          pdf.addPage([108, 192], 'portrait');
        }

        pdf.addImage(imgData, 'JPEG', 0, 0, 108, 192);
      }

      setExportProgress(100);
      const safeFilename = `${chatTitle.replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ]/g, '_')}_Wrapped_2026.pdf`;
      pdf.save(safeFilename);

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('PDF üretilirken hata oluştu:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Wrapped PDF Albümü İndir 📄✨"
      subtitle="Tüm Story kartlarını yüksek çözünürlüklü renkli bir PDF albümü olarak indirin."
    >
      <div className="space-y-5">
        <div className="p-4 bg-[#0A0A0A] rounded-2xl text-white border border-white/10 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#7DD3FC]">
            <FileDown className="w-4 h-4" />
            <span>Story Formatında {slides.length} Kart</span>
          </div>
          <p className="text-[#A3A3A3] leading-relaxed font-sans">
            Her bir Wrapped slaytı telefon ekranı (Story) boyutunda bağımsız yüksek kaliteli bir PDF sayfası olarak arşivlenir.
          </p>
        </div>

        {isExporting && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#6B7280] font-medium">
              <span>Slaytlar PDF'e aktarılıyor...</span>
              <span className="font-mono">{exportProgress}%</span>
            </div>
            <div className="w-full h-2 bg-[#F1F4F9] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#7DD3FC] to-[#0284C7] transition-all duration-200"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-xs text-green-700">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>PDF başarıyla indirildi!</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={isExporting}>
            Kapat
          </Button>
          <Button
            variant="wrapped"
            onClick={handleExport}
            isLoading={isExporting}
            disabled={slides.length === 0}
          >
            <Download className="w-4 h-4 text-[#7DD3FC]" />
            <span>PDF Olarak İndir</span>
          </Button>
        </div>
      </div>

      {/* Hidden off-screen container */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '540px',
        }}
      >
        {slides.map((slide, idx) => (
          <div
            key={`pdf-slide-${idx}`}
            className="pdf-slide-container w-[540px] h-[960px] relative overflow-hidden bg-[#0A0A0A]"
            style={{ width: '540px', height: '960px' }}
          >
            <WrappedSlide slide={slide} isActive={true} />
          </div>
        ))}
      </div>
    </Modal>
  );
};
