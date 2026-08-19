'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { ChatHealthAxes } from '@/types/chat';

interface Props {
  chatHealth?: ChatHealthAxes | null;
}

const AXES: { key: keyof Omit<ChatHealthAxes, 'overallLabel'>; label: string }[] = [
  { key: 'activity', label: 'Aktivite' },
  { key: 'reciprocity', label: 'Karşılıklılık' },
  { key: 'responsiveness', label: 'Yanıtlılık' },
  { key: 'toneStability', label: 'Ton dengesi' },
  { key: 'continuity', label: 'Süreklilik' },
];

const labelText: Record<string, string> = {
  dengeli: 'Dengeli profil',
  aktif: 'Aktif profil',
  düzensiz: 'Düzensiz ritim',
  sakin: 'Sakin profil',
  yetersiz_veri: 'Yetersiz veri',
};

export const ChatHealthCard: React.FC<Props> = ({ chatHealth }) => {
  if (!chatHealth || chatHealth.overallLabel === 'yetersiz_veri') {
    return (
      <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-sm">
        <p className="text-sm text-slate-500">Sohbet sağlığı eksenleri için yeterli veri yok.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 pt-2">
        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Sohbet Sağlığı (5 Eksen)</h2>
          <p className="text-xs text-slate-500">Tek skor yok · her eksen ayrı ölçülür · {labelText[chatHealth.overallLabel]}</p>
        </div>
      </div>

      <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-4">
        {AXES.map(({ key, label }) => {
          const v = chatHealth[key] as number;
          return (
            <div key={key} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">{label}</span>
                <span className="font-mono font-bold text-slate-900">{v}</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 transition-all"
                  style={{ width: `${Math.min(100, v)}%` }}
                />
              </div>
            </div>
          );
        })}
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Aktivite = mesaj ritmi · Karşılıklılık = cevap dengesi · Yanıtlılık = medyan hız · Ton dengesi = gerilim
          sinyali azlığı · Süreklilik = uzun sessizlik azlığı.
        </p>
      </div>
    </div>
  );
};
