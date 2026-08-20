'use client';

import React from 'react';
import { Play, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { InteractivePhoneGuide } from './InteractivePhoneGuide';

interface BentoHeroProps {
  onUploadClick: () => void;
  onDemoClick: () => void;
  onOpenGuide?: () => void;
  isDemoLoading: boolean;
}

export const BentoHero: React.FC<BentoHeroProps> = ({
  onUploadClick,
  onDemoClick,
  isDemoLoading,
}) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-4 pb-8">
      
      {/* Left: High-Impact Modern Headline */}
      <div className="lg:col-span-6 space-y-6 text-left">
        
        {/* Sleek Pill Badge (No AI buzzwords) */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <span className="text-xs font-mono font-medium tracking-wider text-slate-300 uppercase">
            WHATS 2026 • WhatsApp Sohbet Analizi & Wrapped
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Sohbetinizin gizli dünyasını ve{' '}
          <span className="text-[#38BDF8] font-caveat font-bold text-5xl sm:text-6xl lg:text-7xl tracking-normal decoration-[#38BDF8]/40 underline underline-offset-8 inline-block px-1">
            ikonik anlarını
          </span>{' '}
          keşfedin.
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-400 max-w-lg font-sans leading-relaxed">
          WhatsApp sohbetinizi yükleyin; mesajlaşma alışkanlıklarınızı, en aktif saatlerinizi ve grubun en komik unvanlarını interaktif Story formatında anında görün.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap pt-2">
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
            <span>Örnek Sohbeti İncele</span>
          </Button>
        </div>

      </div>

      {/* Right: Live Interactive Phone Video Simulator directly in Hero */}
      <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-[#0284C7]/15 to-[#38BDF8]/15 rounded-3xl blur-3xl opacity-60 pointer-events-none" />

        <div className="relative w-full max-w-sm">
          <InteractivePhoneGuide />
        </div>

      </div>

    </section>
  );
};
