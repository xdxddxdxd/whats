'use client';

import React, { useState } from 'react';
import { SuperlativeCard as SuperlativeType } from '@/lib/ai/types';
import { ChevronDown, ChevronUp, Quote } from 'lucide-react';

interface SuperlativeCardProps {
  card: SuperlativeType;
  index: number;
}

export const SuperlativeCard: React.FC<SuperlativeCardProps> = ({ card, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onClick={() => setIsExpanded(prev => !prev)}
      className="p-6 rounded-3xl bg-[#11141A] border border-white/10 hover:border-[#38BDF8]/50 transition-all duration-300 shadow-soft group hover:-translate-y-1 cursor-pointer flex flex-col justify-between relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#38BDF8]/10 transition-colors" />

      <div>
        {/* Top: Large Badge & Rank Pill */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0B0D11] border border-[#38BDF8]/30 flex items-center justify-center text-3xl font-emoji shadow-glow-blue group-hover:scale-105 transition-transform">
            {card.badge || '🏆'}
          </div>
          <span className="text-[11px] font-mono font-bold text-[#38BDF8] bg-[#0284C7]/15 border border-[#38BDF8]/30 px-3 py-1 rounded-full">
            {card.statValue}
          </span>
        </div>

        {/* Hierarchy: Unvan > Kazanan > Açıklama */}
        <div className="space-y-2">
          <h4 className="text-lg font-bold text-white tracking-tight group-hover:text-[#38BDF8] transition-colors">
            {card.title}
          </h4>

          {/* Winner highlight */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-bold text-xs text-white">
            <span className="text-[#38BDF8]">✦</span>
            <span>{card.winner}</span>
          </div>

          {/* Short description */}
          <p className="text-xs text-[#94A3B8] leading-relaxed font-sans pt-1">
            {card.description}
          </p>
        </div>
      </div>

      {/* Expandable Quote Section */}
      <div className="mt-4 pt-3 border-t border-white/5">
        {card.quote && isExpanded ? (
          <div className="flex items-start gap-2 text-xs italic text-[#7DD3FC] font-sans animate-in fade-in duration-200">
            <Quote className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
            <span className="leading-relaxed">{card.quote}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-[#64748B]">
            <span className="font-mono uppercase tracking-wider">{card.statLabel}</span>
            {card.quote && (
              <span className="text-[#38BDF8] flex items-center gap-0.5 hover:underline">
                Detay {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </span>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
