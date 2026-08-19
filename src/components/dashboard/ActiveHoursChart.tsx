'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Clock, Calendar, Moon } from 'lucide-react';

interface ActiveHoursChartProps {
  timeDistribution: {
    hourly: Array<{ label: string; count: number }>;
    daily: Array<{ label: string; count: number }>;
    monthly: Array<{ label: string; count: number }>;
    timeline: Array<{ label: string; count: number }>;
  };
  mostActiveHour: string;
  mostActiveDay: string;
  longestSilenceHours: number;
  longestSilenceDates?: string;
}

type TimeFilter = 'Saat' | 'Gün' | 'Ay' | 'Tarih';

export const ActiveHoursChart: React.FC<ActiveHoursChartProps> = ({
  timeDistribution,
  mostActiveHour = '22:00',
  mostActiveDay = 'Pazar',
  longestSilenceHours = 575,
  longestSilenceDates = '1 Mayıs 2026 – 25 Mayıs 2026'
}) => {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('Tarih');

  const getChartData = () => {
    switch (activeFilter) {
      case 'Saat':
        return timeDistribution.hourly;
      case 'Gün':
        return timeDistribution.daily;
      case 'Ay':
        return timeDistribution.monthly;
      case 'Tarih':
      default:
        return timeDistribution.timeline && timeDistribution.timeline.length > 0
          ? timeDistribution.timeline
          : timeDistribution.monthly;
    }
  };

  const chartData = getChartData();

  return (
    <div className="space-y-4">
      
      {/* Section Header Standard */}
      <div className="flex items-center gap-2.5 pt-2">
        <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Zaman Analizi
        </h2>
      </div>

      {/* Main Activity Card */}
      <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-6">
        
        {/* Top Header & Filter */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
            ZAMAN İÇİNDE AKTİVİTE
          </span>

          <div className="space-y-1.5">
            <span className="text-xs text-slate-500 font-medium font-sans">
              Zaman Birimi:
            </span>
            
            {/* Segmented Filter Pills */}
            <div className="inline-flex p-1 bg-slate-100/80 rounded-2xl border border-slate-200/50 text-xs font-semibold text-slate-600">
              {(['Saat', 'Gün', 'Ay', 'Tarih'] as TimeFilter[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
                    activeFilter === tab
                      ? 'bg-emerald-600 text-white shadow-sm font-bold'
                      : 'hover:text-slate-900 text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Smooth Curved Degrade Area Chart */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="babyBlueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#94A3B8"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl text-xs border border-slate-800">
                        <p className="font-bold text-sky-400">{item.label}</p>
                        <p className="mt-1 font-mono">{Number(item.count).toLocaleString('tr-TR')} mesaj</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#0284C7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#babyBlueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* En Aktif Saat */}
        <div className="p-5 rounded-[24px] bg-emerald-50/70 border border-emerald-100 shadow-[0_2px_12px_rgba(16,185,129,0.04)] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl shadow-sm shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">En Aktif Saat</p>
              <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">{mostActiveHour}</p>
            </div>
          </div>
        </div>

        {/* En Aktif Gün */}
        <div className="p-5 rounded-[24px] bg-sky-50/70 border border-sky-100 shadow-[0_2px_12px_rgba(56,189,248,0.04)] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-xl shadow-sm shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">En Aktif Gün</p>
              <p className="text-2xl font-black text-slate-900 font-sans tracking-tight">{mostActiveDay}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
