'use client';

import React from 'react';
import { ParticipantStat } from '@/lib/analytics/stats-engine';
import { Users } from 'lucide-react';

interface ParticipantListProps {
  participants: ParticipantStat[];
}

export const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
  return (
    <div className="p-6 rounded-3xl bg-[#11141A] border border-white/10 shadow-soft space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-[#38BDF8]" />
            <span>Katılımcı Karnesi</span>
          </h4>
          <p className="text-xs text-[#94A3B8] font-sans">
            Gruptaki herkesin ayrıntılı mesaj ve aktivite istatistikleri
          </p>
        </div>
        <div className="px-3 py-1 rounded-xl bg-white/5 text-[#94A3B8] text-xs font-mono font-bold border border-white/10">
          {participants.length} Katılımcı
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[#64748B] font-mono text-[11px] uppercase">
              <th className="pb-3 pr-4">Sıra</th>
              <th className="pb-3 pr-4">Katılımcı</th>
              <th className="pb-3 pr-4 text-right">Mesaj</th>
              <th className="pb-3 pr-4 text-right">Pay (%)</th>
              <th className="pb-3 pr-4 text-right hidden sm:table-cell">Kelime</th>
              <th className="pb-3 pr-4 text-right hidden md:table-cell">Medya</th>
              <th className="pb-3 pr-4 text-right hidden lg:table-cell">Gece Mesajı</th>
              <th className="pb-3 pr-4 text-right hidden lg:table-cell">Ort. Yanıt</th>
              <th className="pb-3 text-right">Favori Emojiler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {participants.map((p, idx) => (
              <tr key={p.name} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 pr-4 font-mono font-bold text-[#64748B]">
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                </td>
                <td className="py-4 pr-4 font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <span>{p.name}</span>
                    {idx === 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0284C7]/20 text-[#38BDF8] font-mono font-bold border border-[#38BDF8]/30">
                        Lider
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 pr-4 text-right font-mono font-bold text-white">
                  {p.messageCount.toLocaleString('tr-TR')}
                </td>
                <td className="py-4 pr-4 text-right font-mono text-white">
                  <div className="flex items-center justify-end gap-2">
                    <span className="w-10">%{p.messagePercentage}</span>
                    <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-[#38BDF8] rounded-full"
                        style={{ width: `${Math.min(100, p.messagePercentage)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-4 pr-4 text-right font-mono text-[#94A3B8] hidden sm:table-cell">
                  {p.wordCount.toLocaleString('tr-TR')}
                </td>
                <td className="py-4 pr-4 text-right font-mono text-[#94A3B8] hidden md:table-cell">
                  {p.mediaCount.toLocaleString('tr-TR')}
                </td>
                <td className="py-4 pr-4 text-right font-mono text-[#94A3B8] hidden lg:table-cell">
                  {p.nightMessages} ({p.nightPercentage}%)
                </td>
                <td className="py-4 pr-4 text-right font-mono text-[#94A3B8] hidden lg:table-cell">
                  {p.avgResponseTimeMinutes !== null ? `${p.avgResponseTimeMinutes} dk` : '-'}
                </td>
                <td className="py-4 text-right font-emoji text-base sm:text-lg">
                  {p.topEmojis.length > 0 ? (
                    p.topEmojis.slice(0, 3).map((e, i) => (
                      <span key={i} className="inline-block mr-1" title={`${e.emoji}: ${e.count} adet`}>
                        {e.emoji}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#64748B]">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
