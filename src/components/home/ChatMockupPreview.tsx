'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const ChatMockupPreview: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 800);
    const timer2 = setTimeout(() => setStep(2), 2000);
    const timer3 = setTimeout(() => setStep(3), 3200);
    const timer4 = setTimeout(() => setStep(4), 4500);
    const timer5 = setTimeout(() => setStep(0), 11000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [step === 0]);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E9F0] shadow-soft relative overflow-hidden">
      
      {/* Top Simulated Chat Bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E9F0]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center font-emoji text-sm">
            👥
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0A0A0A]">Arkadaş Grubu</h4>
            <p className="text-[10px] text-[#0284C7] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] animate-pulse" />
              Çevrimiçi
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[#6B7280] bg-[#F7F9FC] px-2 py-0.5 rounded-full border border-[#E5E9F0]">
          WhatsApp .txt
        </span>
      </div>

      {/* Messages Stream */}
      <div className="space-y-3 min-h-[220px] flex flex-col justify-end">
        
        {/* Message 1 (Left / Zeynep) */}
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex flex-col items-start max-w-[85%]"
          >
            <span className="text-[10px] text-[#6B7280] font-semibold mb-0.5 ml-1">Zeynep</span>
            <div className="bg-[#F7F9FC] text-[#0A0A0A] text-xs p-3 rounded-2xl rounded-tl-sm border border-[#E5E9F0] shadow-sm">
              Akşam planı kesinleştirelim mi? ☕✨
              <span className="text-[9px] text-[#6B7280] block text-right mt-1">20:14</span>
            </div>
          </motion.div>
        )}

        {/* Message 2 (Right / Ahmet) */}
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex flex-col items-end max-w-[85%] self-end"
          >
            <span className="text-[10px] text-[#6B7280] font-semibold mb-0.5 mr-1">Ahmet</span>
            <div className="bg-[#38BDF8] text-[#0A0A0A] text-xs p-3 rounded-2xl rounded-tr-sm font-medium shadow-sm">
              Ben geçtim bile mekana, masadayım! 🏎️⚡
              <span className="text-[9px] text-[#0A0A0A]/70 block text-right mt-1">20:15</span>
            </div>
          </motion.div>
        )}

        {/* Message 3: Typing indicator */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 p-2.5 rounded-2xl bg-[#F7F9FC] border border-[#E5E9F0] w-20 shadow-sm"
          >
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </motion.div>
        )}

        {/* Message 4: Instant Analysis Result Card */}
        {step >= 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 220 }}
            className="p-3.5 rounded-2xl bg-[#0A0A0A] text-white border border-[#38BDF8]/40 shadow-glow-blue space-y-2 mt-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#7DD3FC]">
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Analiz Sonucu</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1F1F1F] text-white border border-white/10">
                1.420 Mesaj
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#A3A3A3]">Grup Enerjisi & Hızı</span>
              <span className="font-mono font-bold text-white text-sm">94 / 100</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-[#1F1F1F] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '94%' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#7DD3FC] via-[#38BDF8] to-[#0284C7] rounded-full"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 text-[#A3A3A3]">
              <span>👑 Jet Yanıtçı: <strong className="text-white">Ahmet (1.2 dk)</strong></span>
              <span className="text-[#7DD3FC] font-semibold">Wrapped Hazır</span>
            </div>
          </motion.div>
        )}

      </div>

    </div>
  );
};
