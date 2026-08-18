'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WrappedSlideData } from '@/lib/ai/types';
import { Sparkles, Trophy, Moon, MessageSquare, Zap, Eye, Check } from 'lucide-react';

interface WrappedSlideProps {
  slide: WrappedSlideData;
  isActive: boolean;
}

export const WrappedSlide: React.FC<WrappedSlideProps> = ({ slide, isActive }) => {
  if (!isActive) return null;

  const renderContent = () => {
    switch (slide.type) {
      case 'intro':
        return (
          <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="w-20 h-20 rounded-3xl bg-[#141414] border border-[#38BDF8]/40 shadow-glow-blue flex items-center justify-center text-4xl font-emoji"
            >
              🍿✨
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="px-3.5 py-1 rounded-full bg-[#141414] text-xs font-mono font-bold tracking-widest text-[#7DD3FC] border border-[#38BDF8]/30 uppercase">
                {slide.badge || 'WRAPPED 2026'}
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white mt-4 tracking-tight leading-tight">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-sm sm:text-base text-[#A3A3A3] mt-2 font-medium">
                  {slide.subtitle}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-5 rounded-2xl bg-[#141414] border border-white/10 text-[#E5E5E5] text-sm sm:text-base leading-relaxed"
            >
              {slide.narrative}
            </motion.div>
          </div>
        );

      case 'stats_overview':
        return (
          <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-3xl bg-[#141414] border border-[#38BDF8]/30 flex items-center justify-center text-3xl font-emoji shadow-glow-blue"
            >
              📊
            </motion.div>

            <div>
              <span className="px-3 py-1 rounded-full bg-[#141414] text-xs font-mono font-bold tracking-widest text-[#7DD3FC] border border-[#38BDF8]/30 uppercase">
                {slide.badge || 'BÜYÜK SAYILAR'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white mt-3">
                {slide.title}
              </h2>
            </div>

            {slide.extraData?.totalMessages && (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-3xl bg-[#141414] border border-[#38BDF8]/40 shadow-glow-blue w-full"
              >
                <span className="text-xs uppercase tracking-widest text-[#A3A3A3] block">Toplam Mesaj</span>
                <span className="text-4xl sm:text-5xl font-mono font-extrabold text-[#7DD3FC] tracking-tight block mt-1">
                  {slide.extraData.totalMessages.toLocaleString('tr-TR')}
                </span>
                {slide.extraData.topParticipant && (
                  <p className="text-xs text-[#E5E5E5] mt-3 pt-3 border-t border-white/10">
                    👑 En çok yazan: <strong className="text-white">{slide.extraData.topParticipant}</strong> (%{slide.extraData.topPercent})
                  </p>
                )}
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm sm:text-base text-[#E5E5E5] leading-relaxed"
            >
              {slide.narrative}
            </motion.p>
          </div>
        );

      case 'night_vibe':
        return (
          <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              className="w-16 h-16 rounded-3xl bg-[#141414] border border-[#38BDF8]/30 flex items-center justify-center text-3xl font-emoji shadow-glow-blue"
            >
              🌙⏰
            </motion.div>

            <div>
              <span className="px-3 py-1 rounded-full bg-[#141414] text-xs font-mono font-bold tracking-widest text-[#7DD3FC] border border-[#38BDF8]/30 uppercase">
                {slide.badge || 'ZAMAN YOLCULUĞU'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white mt-3">
                {slide.title}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 text-center">
                <span className="text-[11px] text-[#A3A3A3] block uppercase">En Alevli Saat</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-[#7DD3FC] mt-1 block">
                  {slide.extraData?.peakHour || '22:00'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 text-center">
                <span className="text-[11px] text-[#A3A3A3] block uppercase">En Aktif Gün</span>
                <span className="text-xl sm:text-2xl font-bold text-white mt-1 block">
                  {slide.extraData?.peakDay || 'Cuma'}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 text-[#E5E5E5] text-sm sm:text-base leading-relaxed">
              {slide.narrative}
            </div>
          </div>
        );

      case 'superlatives':
        const items = slide.extraData?.items || [];
        return (
          <div className="flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-14 h-14 rounded-3xl bg-[#141414] border border-[#38BDF8]/30 flex items-center justify-center text-2xl font-emoji shadow-glow-blue"
            >
              🏆
            </motion.div>

            <div>
              <span className="px-3 py-1 rounded-full bg-[#141414] text-xs font-mono font-bold tracking-widest text-[#7DD3FC] border border-[#38BDF8]/30 uppercase">
                {slide.badge || 'GRUP OSCARLARI'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-2">
                {slide.title}
              </h2>
            </div>

            <div className="space-y-2.5 w-full text-left">
              {items.map((item: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -15 : 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="p-3.5 rounded-2xl bg-[#141414] border border-white/10 flex items-center justify-between gap-3 hover:border-[#38BDF8]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-emoji shrink-0">{item.badge}</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#A3A3A3] uppercase tracking-wider">{item.title}</h4>
                      <p className="text-sm font-bold text-white">👑 {item.winner}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#7DD3FC] bg-black/60 px-2.5 py-1 rounded-xl shrink-0 border border-[#38BDF8]/20">
                    {item.statValue}
                  </span>
                </motion.div>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed pt-1">
              {slide.narrative}
            </p>
          </div>
        );

      case 'emoji_dna':
        const topEmojis = slide.extraData?.topEmojis || [];
        return (
          <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
            <motion.div
              initial={{ rotate: 180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              className="w-16 h-16 rounded-3xl bg-[#141414] border border-[#38BDF8]/30 flex items-center justify-center text-3xl font-emoji shadow-glow-blue"
            >
              🎭
            </motion.div>

            <div>
              <span className="px-3 py-1 rounded-full bg-[#141414] text-xs font-mono font-bold tracking-widest text-[#7DD3FC] border border-[#38BDF8]/30 uppercase">
                {slide.badge || 'EMOJİ DNA'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white mt-3">
                {slide.title}
              </h2>
            </div>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              {topEmojis.map((e: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="flex flex-col items-center p-3 rounded-2xl bg-[#141414] border border-white/10 min-w-[70px]"
                >
                  <span className="text-3xl font-emoji">{e.emoji}</span>
                  <span className="text-xs font-mono font-bold text-[#7DD3FC] mt-1.5">
                    {e.count}x
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 text-[#E5E5E5] text-sm sm:text-base leading-relaxed">
              {slide.narrative}
            </div>
          </div>
        );

      case 'oracle':
        return (
          <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
            <motion.div
              initial={{ scale: 0, y: -15 }}
              animate={{ scale: 1, y: 0 }}
              className="w-16 h-16 rounded-3xl bg-[#141414] border border-[#38BDF8]/40 shadow-glow-blue flex items-center justify-center text-3xl font-emoji"
            >
              🔮✨
            </motion.div>

            <div>
              <span className="px-3 py-1 rounded-full bg-[#141414] text-xs font-mono font-bold tracking-widest text-[#7DD3FC] border border-[#38BDF8]/30 uppercase">
                {slide.badge || 'AI KEHANETİ'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white mt-3">
                {slide.title}
              </h2>
            </div>

            <div className="p-6 rounded-3xl bg-[#141414] border border-[#38BDF8]/30 text-white shadow-2xl">
              <p className="text-base sm:text-lg italic font-serif leading-relaxed text-[#E5E5E5]">
                "{slide.extraData?.prediction || slide.narrative}"
              </p>
              {slide.extraData?.vibe && (
                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-[#7DD3FC] font-bold uppercase tracking-wider">
                  Grup Enerjisi: {slide.extraData.vibe}
                </div>
              )}
            </div>
          </div>
        );

      case 'outro':
      default:
        return (
          <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="w-20 h-20 rounded-3xl bg-[#141414] border border-[#38BDF8]/40 shadow-glow-blue flex items-center justify-center text-4xl font-emoji"
            >
              ✨🎉
            </motion.div>

            <div>
              <span className="px-3.5 py-1 rounded-full bg-[#141414] text-xs font-mono font-bold tracking-widest text-[#7DD3FC] border border-[#38BDF8]/30 uppercase">
                {slide.badge || 'TEBRİKLER'}
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white mt-4">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-sm sm:text-base text-[#A3A3A3] mt-2">
                  {slide.subtitle}
                </p>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 text-[#E5E5E5] text-sm sm:text-base leading-relaxed">
              {slide.narrative}
            </div>

            <p className="text-xs text-[#A3A3A3] pt-2">
              ✨ Wrapped deneyimini tamamladınız! Bu kartları PDF olarak indirebilir veya arkadaşlarınızla paylaşabilirsiniz.
            </p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full h-full flex flex-col justify-center items-center p-6 sm:p-12 bg-[#0A0A0A] relative overflow-hidden"
    >
      {/* Soft Baby Blue Radial Glows */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-[#0284C7]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Slide Content */}
      <div className="relative z-10 w-full">{renderContent()}</div>
    </motion.div>
  );
};
