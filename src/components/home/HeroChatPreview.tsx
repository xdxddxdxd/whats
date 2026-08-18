'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, CheckCheck } from 'lucide-react';

export const HeroChatPreview: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 600);
    const timer2 = setTimeout(() => setStep(2), 1800);
    const timer3 = setTimeout(() => setStep(3), 3000);
    const timer4 = setTimeout(() => setStep(4), 4200);
    const timer5 = setTimeout(() => setStep(5), 5600); // Analysis card
    const timer6 = setTimeout(() => setStep(0), 12000); // Loop reset

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, [step === 0]);

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl bg-[#121519] border border-white/10 p-5 shadow-2xl relative overflow-hidden">
      
      {/* Background WhatsApp Doodle Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-repeat"
        style={{
          backgroundImage: `radial-gradient(#38BDF8 1px, transparent 1px)`,
          backgroundSize: '16px 16px'
        }}
      />

      {/* Simulated WhatsApp Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0284C7] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
            SA
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">Sen & Ayşe</h4>
            <p className="text-[11px] text-[#38BDF8] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
              yazıyor...
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[#A3A3A3] bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
          WhatsApp .txt
        </span>
      </div>

      {/* Messages Stream */}
      <div className="space-y-3 min-h-[260px] flex flex-col justify-end relative z-10">
        
        {/* Message 1 (Ayşe - Left) */}
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex flex-col items-start max-w-[85%]"
          >
            <div className="bg-[#1C2128] text-white text-xs p-3.5 rounded-2xl rounded-tl-sm border border-white/5 shadow-sm leading-relaxed">
              Bu sohbeti yükleyince ne çıkacak bakalım 👀
              <span className="text-[9px] text-[#A3A3A3] block text-right mt-1 font-mono">21:04</span>
            </div>
          </motion.div>
        )}

        {/* Message 2 (You - Right) */}
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex flex-col items-end max-w-[85%] self-end"
          >
            <div className="bg-[#0284C7] text-white text-xs p-3.5 rounded-2xl rounded-tr-sm shadow-sm leading-relaxed font-medium">
              Yüklüyorum, saniyeler sürüyormuş
              <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-white/80 font-mono">
                <span>21:04</span>
                <CheckCheck className="w-3 h-3 text-[#BAE6FD]" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Message 3 (Ayşe - Left) */}
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex flex-col items-start max-w-[85%]"
          >
            <div className="bg-[#1C2128] text-white text-xs p-3.5 rounded-2xl rounded-tl-sm border border-white/5 shadow-sm leading-relaxed">
              Kim daha çok yazıyor sence?
              <span className="text-[9px] text-[#A3A3A3] block text-right mt-1 font-mono">21:05</span>
            </div>
          </motion.div>
        )}

        {/* Message 4 (You - Right) */}
        {step >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex flex-col items-end max-w-[85%] self-end"
          >
            <div className="bg-[#0284C7] text-white text-xs p-3.5 rounded-2xl rounded-tr-sm shadow-sm leading-relaxed font-medium">
              Kesin ben 😂
              <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-white/80 font-mono">
                <span>21:05</span>
                <CheckCheck className="w-3 h-3 text-[#BAE6FD]" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Analysis Result Card Reveal */}
        {step >= 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 220 }}
            className="p-4 rounded-2xl bg-[#0A0C0E] text-white border border-[#38BDF8]/40 shadow-glow-blue space-y-2 mt-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#7DD3FC]">
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                <span>Analiz Sonucu: Ayşe %58 👑</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1C2128] text-white border border-white/10">
                1.204 Mesaj
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#A3A3A3]">İlişki / Grup Uyum Skoru</span>
              <span className="font-mono font-bold text-[#38BDF8] text-sm">%94</span>
            </div>

            <div className="w-full h-2 bg-[#1C2128] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '94%' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#7DD3FC] via-[#38BDF8] to-[#0284C7] rounded-full"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 text-[#A3A3A3]">
              <span>Ort. Yanıt: <strong className="text-white font-mono">4 dk</strong></span>
              <span className="text-[#7DD3FC] font-semibold">✨ Wrapped Hazır</span>
            </div>
          </motion.div>
        )}

      </div>

    </div>
  );
};
