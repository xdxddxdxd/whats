'use client';

import React, { useState, useRef } from 'react';
import { Download, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FullChatAnalysisData } from '@/types/chat';

interface StoryCardsExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatTitle: string;
  data: FullChatAnalysisData;
}

export const StoryCardsExporterModal: React.FC<StoryCardsExporterModalProps> = ({
  isOpen,
  onClose,
  chatTitle,
  data
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const user1 = data.users.user1;
  const summary = data.summary;
  const topEmojis = data.allTopEmojis.slice(0, 5);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setDownloadSuccess(false);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: null
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${chatTitle.replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ]/g, '_')}_Story_${selectedTemplate + 1}.png`;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Görsel indirme hatası:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Instagram & TikTok Story Kartı Üretici 📸"
      subtitle="9:16 dikey formatta yüksek çözünürlüklü hikaye kartı oluşturup indirin."
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
        
        {/* Template Selector Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {['1. Sohbet Karnesi', '2. Emojiler & Skor', '3. Red/Green Flag', '4. Gece Ritmi'].map((title, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTemplate(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedTemplate === idx
                  ? 'bg-sky-500 text-white shadow-sm font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {title}
            </button>
          ))}
        </div>

        {/* 9:16 Vertical Story Canvas Container */}
        <div className="flex justify-center items-center py-2">
          <div
            ref={cardRef}
            className="w-[320px] h-[568px] rounded-[32px] p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl border border-white/10"
            style={{
              background: selectedTemplate === 0
                ? 'linear-gradient(145deg, #0A0D14 0%, #151E2E 50%, #080B10 100%)'
                : selectedTemplate === 1
                ? 'linear-gradient(145deg, #0F172A 0%, #0284C7 60%, #0369A1 100%)'
                : selectedTemplate === 2
                ? 'linear-gradient(145deg, #18181B 0%, #27272A 50%, #09090B 100%)'
                : 'linear-gradient(145deg, #0A0A0A 0%, #1E1B4B 60%, #0F172A 100%)'
            }}
          >
            {/* Top Branding */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-sky-400/20 border border-sky-400/30 flex items-center justify-center text-xs">
                  💬
                </div>
                <span className="text-xs font-bold tracking-wider uppercase text-sky-300 font-mono">
                  WHATS WRAPPED
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                2026 ÖZETİ
              </span>
            </div>

            {/* Template 0: Genel Sohbet Karnesi */}
            {selectedTemplate === 0 && (
              <div className="space-y-4 my-auto">
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-extrabold font-serif text-white tracking-tight">
                    {chatTitle}
                  </h3>
                  <p className="text-xs text-sky-300/80 font-sans">
                    {summary.startDate} – {summary.endDate}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    TOPLAM PAYLAŞILAN MESAJ
                  </span>
                  <p className="text-3xl font-extrabold text-sky-400 font-mono">
                    {summary.totalMessages.toLocaleString('tr-TR')}
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Günde ortalama {summary.dailyAverage} mesaj
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 text-[10px] block">LİDER</span>
                    <strong className="text-sky-300 font-mono">{user1.name} (%{user1.percentage})</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 text-[10px] block">EN AKTİF SAAT</span>
                    <strong className="text-white font-mono">{summary.mostActiveHour}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Template 1: Emojiler & Skor */}
            {selectedTemplate === 1 && (
              <div className="space-y-4 my-auto">
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-extrabold font-serif text-white">
                    Sohbetin Emoji DNA'sı ✨
                  </h3>
                  <p className="text-xs text-sky-100/80">Kelimeleri unutup emojilerle konuştuk</p>
                </div>

                <div className="flex items-center justify-center gap-3 py-3">
                  {topEmojis.map((e, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <span className="text-3xl font-emoji animate-bounce">{e.emoji}</span>
                      <span className="text-[10px] font-mono text-sky-200">{e.count}x</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-black/20 border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>👑 Jet Yanıtçı:</span>
                    <strong>{user1.name} ({user1.avgResponseTimeMin} dk)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>🦉 Gece Kuşu:</span>
                    <strong>{user1.name}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Template 2: Red / Green Flag */}
            {selectedTemplate === 2 && (
              <div className="space-y-4 my-auto">
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-extrabold font-serif text-white">
                    İlişki Bayrakları 🚩🟢
                  </h3>
                  <p className="text-xs text-slate-400">Tüm sırlar ortaya çıktı</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 space-y-1">
                    <span className="font-bold flex items-center gap-1">🚩 Tek Kelimelik Cevaplar:</span>
                    <p className="text-[11px] text-red-300">{user1.name} ({user1.singleWordReplyCount || 120}x "tm", "ok")</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 space-y-1">
                    <span className="font-bold flex items-center gap-1">🟢 Sohbet Başlatıcı:</span>
                    <p className="text-[11px] text-emerald-300">%{user1.startedPercentage} ile {user1.name}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Template 3: Gece Ritmi */}
            {selectedTemplate === 3 && (
              <div className="space-y-4 my-auto text-center">
                <span className="text-4xl block">🌙</span>
                <h3 className="text-xl font-extrabold font-serif text-white">
                  Zamanın Durduğu Yer
                </h3>
                <p className="text-xs text-slate-300">
                  En derin muhabbetler gece 00:00 - 05:00 arasında döndü.
                </p>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
                  <p className="text-sky-300 font-bold">En Aktif Gün: {summary.mostActiveDay}</p>
                  <p className="text-slate-400 text-[11px] mt-1">Rekor Gün: {summary.mostActiveDate}</p>
                </div>
              </div>
            )}

            {/* Bottom Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>whats-scope.app</span>
              <span>#WhatsAppWrapped</span>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Kapat
          </Button>
          <Button variant="primary" onClick={handleDownload} isLoading={isExporting}>
            {downloadSuccess ? <Check className="w-4 h-4 text-green-300" /> : <Download className="w-4 h-4 text-sky-200" />}
            <span>{downloadSuccess ? 'Görsel İndirildi!' : 'Story PNG Olarak İndir'}</span>
          </Button>
        </div>

      </div>
    </Modal>
  );
};
