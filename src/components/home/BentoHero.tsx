'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Moon, Zap, Ghost, Award, Play, ChevronRight, BarChart2, Flame } from 'lucide-react';
import { Button } from '../ui/Button';

interface BentoHeroProps {
  onUploadClick: () => void;
  onDemoClick: () => void;
  onOpenGuide?: () => void;
  isDemoLoading: boolean;
}

export const BentoHero: React.FC<BentoHeroProps> = ({
  onUploadClick,
  onDemoClick,
  onOpenGuide,
  isDemoLoading,
}) => {
  const [activeAwardIndex, setActiveAwardIndex] = useState(0);

  const awards = [
    { title: 'Trip Şampiyonu 🎭', winner: 'Selin', detail: '142x "tm", "ok" ve tek kelimelik mesafe ustası', icon: '🧊', stat: '%68 Mesafe' },
    { title: 'Dedikodu Bakanı ☕', winner: 'Elif', detail: 'Sessizliği 4 dakikalık bomba ses kaydıyla bozar', icon: '🎙️', stat: '28 Bomba' },
    { title: 'Gece Kuşu 🦉', winner: 'Ahmet', detail: '00:00 - 05:00 nöbetinde 340 gece mesajı', icon: '🌙', stat: '340 Mesaj' },
    { title: 'Jargon Ustası 📖', winner: 'Doğukan', detail: 'Grupta 12 yeni kelime ve kalıp üretti', icon: '✍️', stat: '12 Jargon' },
    { title: 'Grup Hayaleti 👻', winner: 'Mehmet', detail: 'Ortalama 3 iş gününde "gördüm ya" yanıtı', icon: '🫥', stat: '42 dk ort.' },
    { title: 'Jet Yanıtçı ⚡', winner: 'Zeynep', detail: 'Ortalama 45 saniyede anında jet dönüş', icon: '🏎️', stat: '45 sn ort.' },
    { title: 'Konu Açan 📢', winner: 'Can', detail: 'Sessizliği 32 kez yeni geyikle başlattı', icon: '🔥', stat: '32 Oturum' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAwardIndex((prev) => (prev + 1) % awards.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [awards.length]);

  const currentAward = awards[activeAwardIndex];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-6 pb-12">
      
      {/* Left: High-Impact Modern Headline */}
      <div className="lg:col-span-7 space-y-7 text-left">
        
        {/* Glowing Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#38BDF8]/30 shadow-glow-blue backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <span className="text-xs font-mono font-semibold tracking-wider text-[#7DD3FC] uppercase">
            WHATS 2026 ✦ Yapay Zeka Sohbet Zekası & Wrapped
          </span>
        </div>

        {/* Headline: Clean Modern Sans + ONLY the blue word in Caveat handwriting */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
          Sohbetinizin gizli dünyasını ve <br className="hidden sm:inline" />
          <span className="text-[#38BDF8] font-caveat font-bold text-5xl sm:text-6xl lg:text-7xl tracking-normal decoration-[#38BDF8]/40 underline underline-offset-8 inline-block px-1">
            ikonik karakterlerini
          </span>{' '}
          keşfedin.
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl font-sans leading-relaxed">
          WhatsApp sohbetinizi yükleyin. Kimin trip attığını, kimin geceleri nöbet tuttuğunu ve grubun imza geyiklerini Spotify Wrapped tarzı tam ekran Story formatında anında görün!
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap pt-1">
          <Button
            variant="blue"
            size="lg"
            onClick={onUploadClick}
            className="font-bold text-sm sm:text-base px-7 py-3.5 shadow-glow-blue"
          >
            <span>Hemen Sohbeti Yükle</span>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button
            variant="wrapped"
            size="lg"
            onClick={onDemoClick}
            isLoading={isDemoLoading}
            className="text-sm sm:text-base px-6 py-3.5 hover:border-[#38BDF8]"
          >
            <Play className="w-4 h-4 text-[#38BDF8] fill-[#38BDF8]" />
            <span>Canlı Demo Gör</span>
          </Button>

          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#94A3B8] hover:text-white transition-all font-mono flex items-center gap-1.5"
            >
              <span>Nasıl Yüklenir?</span>
              <span className="text-[#38BDF8] font-bold">3 Adım ➔</span>
            </button>
          )}
        </div>

        {/* Micro-proof Metrics */}
        <div className="pt-3 flex items-center gap-6 sm:gap-8 text-xs text-[#94A3B8] border-t border-white/10 font-mono">
          <div>
            <span className="text-white font-bold block text-sm sm:text-base">0 Veri Saklama</span>
            <span className="text-[11px] text-[#64748B]">Ham metinler kaydedilmez</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <span className="text-white font-bold block text-sm sm:text-base">15+ Kişilik Unvanı</span>
            <span className="text-[11px] text-[#64748B]">Gece Kuşu, Jet, Hayalet</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <span className="text-white font-bold block text-sm sm:text-base">Story & PDF</span>
            <span className="text-[11px] text-[#64748B]">Yüksek çözünürlük</span>
          </div>
        </div>

      </div>

      {/* Right: Bespoke Bento Stage Cards */}
      <div className="lg:col-span-5 relative">
        
        {/* Radial Ambient Glow */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-[#0284C7]/20 to-[#38BDF8]/20 rounded-3xl blur-3xl opacity-50 pointer-events-none" />

        <div className="relative space-y-3.5">
          
          {/* Top Card: Live Rotating Superlative Spotlight */}
          <div className="p-5 rounded-3xl bg-[#11141A]/90 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <span className="text-[10px] font-mono text-[#38BDF8] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#38BDF8]" />
                Canlı Kişilik Spotlight
              </span>
              <span className="text-[10px] font-mono text-[#64748B] bg-white/5 px-2 py-0.5 rounded-full">
                AI Analizi
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentAward.title}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A202C] border border-[#38BDF8]/30 flex items-center justify-center text-2xl font-emoji shadow-glow-blue shrink-0">
                    {currentAward.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{currentAward.title}</h4>
                    <p className="text-xs text-[#38BDF8] font-semibold">👑 {currentAward.winner}</p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">{currentAward.detail}</p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-white bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl shrink-0">
                  {currentAward.stat}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Grid: 2 Mini Visualizers */}
          <div className="grid grid-cols-2 gap-3.5">
            
            {/* Mini Visualizer 1: Wrapped Story Vibe */}
            <div className="p-4 rounded-3xl bg-[#11141A]/90 backdrop-blur-xl border border-white/10 shadow-soft space-y-2">
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span className="text-[11px] font-mono text-[#38BDF8]">WRAPPED</span>
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              </div>
              <p className="text-sm font-bold text-white">Story Deneyimi</p>
              <div className="flex items-center gap-1 pt-1">
                <span className="h-1 flex-1 bg-[#38BDF8] rounded-full" />
                <span className="h-1 flex-1 bg-[#38BDF8] rounded-full" />
                <span className="h-1 flex-1 bg-[#38BDF8]/30 rounded-full" />
                <span className="h-1 flex-1 bg-[#38BDF8]/30 rounded-full" />
              </div>
              <span className="text-[10px] text-[#64748B] block">7 İnteraktif Slayt</span>
            </div>

            {/* Mini Visualizer 2: Emoji DNA */}
            <div className="p-4 rounded-3xl bg-[#11141A]/90 backdrop-blur-xl border border-white/10 shadow-soft space-y-2">
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span className="text-[11px] font-mono text-[#38BDF8]">EMOJİ DNA</span>
                <Flame className="w-3.5 h-3.5 text-[#38BDF8]" />
              </div>
              <p className="text-sm font-bold text-white">Grup İmzası</p>
              <div className="flex items-center gap-2 pt-1 font-emoji text-lg">
                <span>🔥</span>
                <span>😂</span>
                <span>💀</span>
                <span>✨</span>
              </div>
              <span className="text-[10px] text-[#64748B] block">Apple Emoji Stack</span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
