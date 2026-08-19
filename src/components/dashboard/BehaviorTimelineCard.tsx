'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { BehaviorTimeline } from '@/types/chat';

interface Props {
  behaviorTimeline?: BehaviorTimeline | null;
}

export const BehaviorTimelineCard: React.FC<Props> = ({ behaviorTimeline }) => {
  const points = behaviorTimeline?.points || [];
  if (points.length < 2) return null;

  const data = points.map((p) => ({
    week: p.weekLabel.replace(/^\d{4}-/, ''),
    mesaj: p.messageCount,
    cevap: p.medianResponseMin,
    uzunluk: p.avgMessageLength,
    kisa: p.shortReplyRate,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 pt-2">
        <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Davranış Zaman Çizelgesi</h2>
          <p className="text-xs text-slate-500">Haftalık mesaj · medyan cevap · kısa cevap oranı</p>
        </div>
      </div>

      <div className="p-4 rounded-[28px] bg-white border border-slate-100 shadow-sm">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={32} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12 }} />
              <Line type="monotone" dataKey="mesaj" stroke="#0ea5e9" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="cevap" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="kisa" stroke="#a855f7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-3 mt-2 text-[10px] font-semibold text-slate-500">
          <span className="text-sky-600">● mesaj</span>
          <span className="text-amber-600">● medyan cevap (dk)</span>
          <span className="text-purple-600">● kısa cevap %</span>
        </div>
      </div>
    </div>
  );
};
