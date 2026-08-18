'use client';

import React from 'react';
import { EmojiStat } from '@/lib/analytics/stats-engine';
import { Smile, Flame } from 'lucide-react';

interface EmojiLeaderboardProps {
  emojis: EmojiStat[];
  totalEmojis: number;
}

export const EmojiLeaderboard: React.FC<EmojiLeaderboardProps> = ({ emojis, totalEmojis }) => {
  const top5 = emojis.slice(0, 5);
  const remaining = emojis.slice(5, 15);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#11141A] border border-white/10 shadow-soft space-y-8 relative overflow-hidden">
      {/* Subtle blue accent glow */}
      <div className="absolute top-0 right-1/4 w-40 h-40 bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#38BDF8]" />
            <span>Sohbetin Emoji DNA'sı</span>
          </h4>
          <p className="text-xs text-[#94A3B8] font-sans">
            En çok kullanılan semboller ve duygusal dağılım
          </p>
        </div>
        <div className="px-3.5 py-1 rounded-full bg-[#0284C7]/15 text-[#38BDF8] text-xs font-mono font-bold border border-[#38BDF8]/30">
          Toplam {totalEmojis.toLocaleString('tr-TR')} adet
        </div>
      </div>

      {emojis.length === 0 ? (
        <p className="text-xs text-[#64748B] italic">Bu sohbette hiç emoji kullanılmamış.</p>
      ) : (
        <div className="space-y-6">
          
          {/* Top 5 Podium (Circular Highlights) */}
          <div className="grid grid-cols-5 gap-2 sm:gap-4 max-w-2xl mx-auto py-2">
            {top5.map((item, idx) => (
              <div
                key={`top-emoji-${idx}-${item.emoji}`}
                className="flex flex-col items-center text-center space-y-2 group"
              >
                {/* Circle Podium */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center text-2xl sm:text-3xl font-emoji transition-all group-hover:scale-110 ${
                    idx === 0
                      ? 'bg-[#0B0D11] border-2 border-[#38BDF8] shadow-glow-blue'
                      : 'bg-[#0B0D11] border border-white/10 group-hover:border-[#38BDF8]/40'
                  }`}
                >
                  {item.emoji}
                </div>

                {/* Rank & Stats */}
                <div>
                  <span className="text-[10px] font-mono text-[#94A3B8] block">#{idx + 1}</span>
                  <span className="text-xs font-bold font-mono text-white block mt-0.5">
                    {item.count.toLocaleString('tr-TR')}
                  </span>
                  <span className="text-[10px] font-mono text-[#38BDF8] block">
                    %{item.percentage}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Remaining Emoji Progress List */}
          {remaining.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-4 border-t border-white/5">
              {remaining.map((item, idx) => (
                <div
                  key={`remaining-${idx}-${item.emoji}`}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#0B0D11] border border-white/10 hover:border-[#38BDF8]/40 transition-all group"
                >
                  <span className="text-xl sm:text-2xl font-emoji shrink-0 group-hover:scale-110 transition-transform">
                    {item.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-white">{item.count.toLocaleString('tr-TR')}</span>
                      <span className="text-[10px] text-[#64748B]">%{item.percentage}</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#38BDF8] to-[#0284C7] rounded-full"
                        style={{ width: `${Math.min(100, item.percentage * 3)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
};
