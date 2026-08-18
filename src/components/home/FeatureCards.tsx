'use client';

import React from 'react';
import { Zap, BarChart3, Sparkles } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-5 h-5 text-[#38BDF8]" />,
      title: 'Işık Hızında Analiz',
      description:
        'WhatsApp dosyanızı yükleyin, sistemimiz saniyeler içinde binlerce mesajı analiz etsin. Tüm veriler güvenli şekilde işlenir.',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-[#38BDF8]" />,
      title: 'Viral İstatistikler',
      description:
        '15+ kategori analiz, eğlenceli karşılaştırmalar, sosyal medya için hazır kartlar. Arkadaşlarınızı challenge edin!',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#38BDF8]" />,
      title: 'AI Yıllık Özet (Wrapped) & Hikayeler',
      description:
        'Yapay zeka ile duygu analizi, kişilik unvanları (Gece Kuşu, Hayalet, Jet Yanıtçı), grup enerjisi ve Spotify Wrapped tarzı tam ekran Story deneyimi.',
    },
  ];

  return (
    <div className="space-y-4 flex flex-col justify-center h-full">
      {features.map((feat, idx) => (
        <div
          key={idx}
          className="p-6 rounded-3xl bg-[#121519] border border-white/10 hover:border-[#38BDF8]/50 transition-all duration-300 shadow-soft group"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#1C2128] border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-[#38BDF8]/40 transition-all shadow-sm">
              {feat.icon}
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white font-serif tracking-wide group-hover:text-[#38BDF8] transition-colors">
                {feat.title}
              </h4>
              <p className="text-xs sm:text-sm text-[#A3A3A3] mt-1.5 leading-relaxed font-sans">
                {feat.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
