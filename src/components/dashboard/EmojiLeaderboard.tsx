'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Smile, Flame } from 'lucide-react';
import { UserStats } from '@/types/chat';

interface EmojiLeaderboardProps {
  emojis: Array<{ emoji: string; count: number }>;
  user1?: UserStats;
  user2?: UserStats;
}

type ViewMode = 'bar' | 'pie';

const EMOJI_BAR_COLORS = [
  '#4ADE80',
  '#818CF8',
  '#FBBF24',
  '#F472B6',
  '#38BDF8',
  '#A78BFA',
  '#34D399',
  '#60A5FA',
  '#FB923C',
  '#F87171'
];

export const EmojiLeaderboard: React.FC<EmojiLeaderboardProps> = ({
  emojis = [],
  user1,
  user2
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('bar');

  const totalEmojis = emojis.reduce((sum, e) => sum + e.count, 0) || 2177;
  const top10 = emojis.slice(0, 10);
  const topPodium = emojis.slice(0, 4);

  return (
    <div className="space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pt-2">
        <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm shrink-0">
          <Smile className="w-5 h-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Emoji Analizi & Sıralaması
        </h2>
      </div>

      {/* Main Emoji Card */}
      <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-6">
        
        {/* Header & Toggle */}
        <div className="space-y-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
              EN ÇOK KULLANILAN EMOJİLER
            </span>
            <p className="text-xs text-slate-500 font-medium font-sans mt-0.5">
              Toplam {totalEmojis.toLocaleString('tr-TR')} emoji kullanıldı
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Görünüm:</span>
            <div className="inline-flex p-0.5 bg-slate-100 rounded-xl border border-slate-200/60 text-xs font-semibold">
              <button
                onClick={() => setViewMode('bar')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'bar'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bar Grafik
              </button>
              <button
                onClick={() => setViewMode('pie')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'pie'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pasta Grafik
              </button>
            </div>
          </div>
        </div>

        {/* View Mode: Bar or Pie Chart */}
        {viewMode === 'bar' ? (
          <div className="space-y-3 pt-2">
            {top10.map((item, idx) => {
              const maxCount = top10[0]?.count || 1;
              const percent = Math.max(8, Math.round((item.count / maxCount) * 100));
              const color = EMOJI_BAR_COLORS[idx % EMOJI_BAR_COLORS.length];

              return (
                <div key={`emoji-bar-${idx}-${item.emoji}`} className="flex items-center gap-3">
                  <span className="w-8 text-center text-xl font-emoji shrink-0">
                    {item.emoji}
                  </span>
                  <div className="flex-1 h-7 bg-slate-50 rounded-lg overflow-hidden relative">
                    <div
                      className="h-full rounded-lg flex items-center justify-between px-3 transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: color
                      }}
                    >
                      <span className="text-[11px] font-bold text-slate-900 font-mono">
                        {item.count}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={top10}
                  dataKey="count"
                  nameKey="emoji"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={45}
                  paddingAngle={3}
                >
                  {top10.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={EMOJI_BAR_COLORS[index % EMOJI_BAR_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs flex items-center gap-2">
                          <span className="text-xl font-emoji">{data.emoji}</span>
                          <span className="font-mono font-bold">{data.count} kez</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>

      {/* Top Individual Mini Cards Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        {topPodium.map((item, idx) => (
          <div
            key={`podium-${idx}`}
            className="p-4 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] text-center space-y-2"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl font-emoji">
              {item.emoji}
            </div>
            <p className="text-xs font-bold text-slate-800 font-mono">
              {item.count} kez
            </p>
            <div className="w-12 h-1 bg-emerald-500 rounded-full mx-auto" />
          </div>
        ))}
      </div>

    </div>
  );
};
