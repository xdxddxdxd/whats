'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { HeartHandshake, Smile, Frown, Sparkles, MessageCircle } from 'lucide-react';
import { AISentimentResult } from '@/types/chat';
import { DashboardSkeleton } from './DashboardSkeleton';

interface SentimentEvolutionCardProps {
  sentiment?: AISentimentResult;
  isLoading?: boolean;
}

export const SentimentEvolutionCard: React.FC<SentimentEvolutionCardProps> = ({
  sentiment,
  isLoading = false
}) => {
  if (isLoading || !sentiment) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 pt-2">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Duygusal Analiz & Evrim
          </h2>
        </div>
        <DashboardSkeleton type="sentiment" />
      </div>
    );
  }

  const {
    overallTone = 'Nötr',
    dominantEmotion = 'Memnuniyet',
    happiestDate = '31 Mayıs 2026',
    saddestDate = '26 Ocak 2026',
    categoryDistribution = [],
    emotionalTimeline = [],
    intenseMessages = []
  } = sentiment;

  return (
    <div className="space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pt-2">
        <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm shrink-0">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Duygusal Analiz & Evrim
        </h2>
      </div>

      {/* 1. Tone & Key Dates Overview Cards */}
      <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
            GENEL DUYGU TONU
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-sky-700 text-xs font-bold font-sans">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>{overallTone}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <Smile className="w-4 h-4" />
              <span>En Mutlu Gün</span>
            </div>
            <p className="text-sm font-bold text-slate-900 font-sans">{happiestDate}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <Frown className="w-4 h-4" />
              <span>En Sessiz / Hüzünlü</span>
            </div>
            <p className="text-sm font-bold text-slate-900 font-sans">{saddestDate}</p>
          </div>
        </div>

        {/* Emotion Category Distribution */}
        {categoryDistribution.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
              DUYGU KATEGORİ DAĞILIMI
            </span>
            <div className="space-y-2">
              {categoryDistribution.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="font-semibold text-slate-700">{cat.category}</span>
                    <span className="font-mono text-slate-500 font-medium">{cat.count} ifade</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(8, (cat.count / 500) * 100))}%`,
                        backgroundColor: cat.color || '#38BDF8'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 2. Emotional Timeline Line Chart */}
      {emotionalTimeline.length > 0 && (
        <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
            ZAMAN İÇİNDE DUYGU DEĞİŞİMİ
          </span>

          <div className="h-48 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emotionalTimeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="week" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  domain={[30, 100]}
                  ticks={[40, 60, 80, 100]}
                  tickFormatter={(val) => (val >= 80 ? 'Çok Pozitif' : val >= 60 ? 'Pozitif' : 'Nötr')}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs">
                          <p className="font-bold text-sky-400">{item.week}</p>
                          <p className="mt-0.5">{item.label || 'Pozitif'}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#38BDF8"
                  strokeWidth={3}
                  dot={{ fill: '#0284C7', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 3. En Yoğun Duygusal Mesajlar Feed */}
      {intenseMessages.length > 0 && (
        <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
              EN YOĞUN DUYGUSAL MESAJLAR
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {intenseMessages.length} kayıt
            </span>
          </div>

          <div className="space-y-3">
            {intenseMessages.map((msg, idx) => (
              <div
                key={`intense-msg-${idx}`}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-2.5 transition-all hover:bg-slate-50"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{msg.sender}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold font-mono">
                      Yoğunluk: %{msg.intensity}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold">
                      {msg.emotion}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-800 font-sans font-medium leading-relaxed italic bg-white p-3 rounded-xl border border-slate-100">
                  "{msg.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
