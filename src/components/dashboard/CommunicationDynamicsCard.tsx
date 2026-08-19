'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { MessageSquare, Zap, Clock, TrendingUp } from 'lucide-react';
import { UserStats } from '@/types/chat';

interface CommunicationDynamicsCardProps {
  user1: UserStats;
  user2: UserStats;
  longestSilenceHours?: number;
  longestSilenceDates?: string;
}

type SortFilter = 'count' | 'name';

export const CommunicationDynamicsCard: React.FC<CommunicationDynamicsCardProps> = ({
  user1,
  user2,
  longestSilenceHours = 575,
  longestSilenceDates = '1 Mayıs 2026 – 25 Mayıs 2026'
}) => {
  const [sortFilter, setSortFilter] = useState<SortFilter>('count');

  const topStarter = user1.startedPercentage >= user2.startedPercentage ? user1 : user2;

  let chartData = [
    { name: user1.name, count: user1.messageCount, color: '#38BDF8' },
    { name: user2.name, count: user2.messageCount, color: '#10B981' }
  ];

  if (sortFilter === 'count') {
    chartData = [...chartData].sort((a, b) => b.count - a.count);
  } else {
    chartData = [...chartData].sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pt-2">
        <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          İletişim Dinamikleri
        </h2>
      </div>

      {/* Grid of Dynamic Metric Cards */}
      <div className="space-y-3.5">
        
        {/* 1. Konuşma Başlatıcısı */}
        <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
            KONUŞMA BAŞLATICISI
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {topStarter.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium font-sans">
            konuşmaların %{topStarter.startedPercentage}'ini başlatıyor
          </p>
        </div>

        {/* 2. Yanıt Hızı */}
        <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
            YANIT HIZI
          </span>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="flex items-center gap-2 font-medium text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>{user2.name}</span>
              </span>
              <span className="font-mono font-bold text-slate-900">
                {user2.avgResponseTimeMin.toFixed(1)} dk
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="flex items-center gap-2 font-medium text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>{user1.name}</span>
              </span>
              <span className="font-mono font-bold text-slate-900">
                {user1.avgResponseTimeMin.toFixed(1)} dk
              </span>
            </div>
          </div>
        </div>

        {/* 3. En Uzun Sessizlik */}
        <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
            EN UZUN SESSİZLİK
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">
            {longestSilenceHours} <span className="text-lg font-bold font-sans">saat</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium font-sans">
            {longestSilenceDates}
          </p>
        </div>

        {/* 4. Kişi Bazında Mesaj Sayıları Chart */}
        <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
              KİŞİ BAZINDA MESAJ SAYILARI
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-[11px] text-slate-400">Sırala:</span>
              <div className="inline-flex p-0.5 bg-slate-100 rounded-xl border border-slate-200/60 text-[11px] font-semibold">
                <button
                  onClick={() => setSortFilter('count')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    sortFilter === 'count' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                  }`}
                >
                  Mesaj Sayısı
                </button>
                <button
                  onClick={() => setSortFilter('name')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    sortFilter === 'name' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                  }`}
                >
                  İsim
                </button>
              </div>
            </div>
          </div>

          <div className="h-52 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs">
                          <p className="font-bold">{item.name}</p>
                          <p className="font-mono mt-0.5">{Number(item.count).toLocaleString('tr-TR')} mesaj</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
