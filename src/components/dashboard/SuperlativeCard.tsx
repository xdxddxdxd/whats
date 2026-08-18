import React from 'react';
import { SuperlativeCard as SuperlativeType } from '@/lib/ai/types';
import { Sparkles, Quote } from 'lucide-react';

interface SuperlativeCardProps {
  card: SuperlativeType;
  index: number;
}

export const SuperlativeCard: React.FC<SuperlativeCardProps> = ({ card, index }) => {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#11141A] border border-white/10 hover:border-[#38BDF8]/50 transition-all duration-300 shadow-soft group hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden">
      
      {/* Subtle top neon corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#38BDF8]/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Top: Badge + Stat */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#1A202C] border border-[#38BDF8]/30 flex items-center justify-center text-2xl font-emoji text-[#38BDF8] shadow-glow-blue group-hover:scale-105 transition-transform">
            {card.badge || '🏆'}
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#64748B] block">
              {card.statLabel}
            </span>
            <span className="text-xs font-bold font-mono text-[#38BDF8] bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg inline-block mt-0.5">
              {card.statValue}
            </span>
          </div>
        </div>

        {/* Title & Winner */}
        <div>
          <h4 className="text-base sm:text-lg font-bold text-white tracking-wide group-hover:text-[#38BDF8] transition-colors">
            {card.title}
          </h4>
          <div className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-[#0284C7]/20 font-bold text-xs text-[#38BDF8] border border-[#38BDF8]/30">
            👑 {card.winner}
          </div>
          <p className="text-xs text-[#94A3B8] mt-2.5 leading-relaxed font-sans">
            {card.description}
          </p>
        </div>
      </div>

      {/* Quote */}
      {card.quote && (
        <div className="mt-4 pt-3 border-t border-white/5 flex items-start gap-1.5 text-xs italic text-[#64748B] font-sans">
          <Quote className="w-3 h-3 text-[#38BDF8] shrink-0 mt-0.5" />
          <span className="line-clamp-2">{card.quote}</span>
        </div>
      )}

    </div>
  );
};
