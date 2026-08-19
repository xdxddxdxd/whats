'use client';

import React from 'react';
import { Type } from 'lucide-react';
import { MessageLengthStats } from '@/types/chat';

interface Props {
  messageLengthStats?: MessageLengthStats | null;
}

export const MessageLengthCard: React.FC<Props> = ({ messageLengthStats }) => {
  const entries = messageLengthStats ? Object.entries(messageLengthStats.byUser) : [];
  if (!entries.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 pt-2">
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
          <Type className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Mesaj Uzunluğu</h2>
          <p className="text-xs text-slate-500">Ortalama / medyan · son 30g değişim</p>
        </div>
      </div>

      <div className="space-y-3">
        {entries.map(([name, s]) => (
          <div
            key={name}
            className="p-5 rounded-[24px] bg-white border border-slate-100 shadow-sm space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900 text-sm">{name}</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  s.changePct > 5
                    ? 'bg-emerald-50 text-emerald-700'
                    : s.changePct < -5
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                }`}
              >
                {s.changePct > 0 ? '+' : ''}
                {s.changePct}% (30g)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-50 py-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Ort.</p>
                <p className="font-mono font-bold text-slate-900">{s.avgChars}</p>
              </div>
              <div className="rounded-xl bg-slate-50 py-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Medyan</p>
                <p className="font-mono font-bold text-slate-900">{s.medianChars}</p>
              </div>
              <div className="rounded-xl bg-slate-50 py-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Kelime</p>
                <p className="font-mono font-bold text-slate-900">{s.avgWords}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
