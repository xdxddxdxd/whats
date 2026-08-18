'use client';

import React from 'react';
import { EmojiStat } from '@/lib/analytics/stats-engine';
import { Smile } from 'lucide-react';

interface EmojiLeaderboardProps {
  emojis: EmojiStat[];
  totalEmojis: number;
}

export const EmojiLeaderboard: React.FC<EmojiLeaderboardProps> = ({ emojis, totalEmojis }) => {
  return (
    <div className="p-6 rounded-3xl bg-[#11141A] border border-white/10 shadow-soft space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <Smile className="w-4 h-4 text-[#38BDF8]" />
            <span>Sohbetin Emoji Şöleni</span>
          </h4>
          <p className="text-xs text-[#94A3B8] font-sans">
            Duyguları en çok hangi sembollerle ifade ettiniz?
          </p>
        </div>
        <div className="px-3 py-1 rounded-xl bg-[#0284C7]/20 text-[#38BDF8] text-xs font-mono font-bold border border-[#38BDF8]/30">
          Toplam: {totalEmojis.toLocaleString('tr-TR')}
        </div>
      </div>

      {emojis.length === 0 ? (
        <p className="text-xs text-[#64748B] italic">Bu sohbette hiç emoji kullanılmamış.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {emojis.slice(0, 10).map((item, idx) => (
            <div
              key={`emoji-${idx}-${item.emoji}`}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0B0D11] border border-white/10 hover:border-[#38BDF8]/40 transition-all group"
            >
              <span className="text-2xl sm:text-3xl font-emoji shrink-0 group-hover:scale-110 transition-transform">
                {item.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold font-mono text-white">
                    {item.count.toLocaleString('tr-TR')}
                  </span>
                  <span className="text-[10px] text-[#64748B] font-mono">
                    %{item.percentage}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#38BDF8] to-[#0284C7] rounded-full"
                    style={{ width: `${Math.min(100, item.percentage * 2.5)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
