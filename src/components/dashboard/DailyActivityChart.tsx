'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { DailyDistribution } from '@/lib/analytics/stats-engine';
import { Calendar } from 'lucide-react';

interface DailyActivityChartProps {
  data: DailyDistribution[];
  peakDay: string;
}

export const DailyActivityChart: React.FC<DailyActivityChartProps> = ({ data, peakDay }) => {
  return (
    <div className="p-6 rounded-3xl bg-[#11141A] border border-white/10 shadow-soft space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#38BDF8]" />
            <span>Haftalık Gün Dağılımı</span>
          </h4>
          <p className="text-xs text-[#94A3B8] font-sans">
            Haftanın en çok konuşulan ve en sessiz günleri
          </p>
        </div>
        <div className="px-3 py-1 rounded-xl bg-[#0284C7]/20 text-[#38BDF8] text-xs font-mono font-bold border border-[#38BDF8]/30">
          En Yoğun: {peakDay}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="dayName"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as DailyDistribution;
                  return (
                    <div className="bg-[#0B0D11] text-white p-3 rounded-2xl shadow-xl text-xs border border-white/15">
                      <p className="font-bold text-[#38BDF8]">{item.dayName}</p>
                      <p className="mt-1 font-mono">{item.count.toLocaleString('tr-TR')} mesaj</p>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5">Toplamın %{item.percentage}'i</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={`cell-day-${entry.day}`}
                  fill={entry.dayName === peakDay ? '#38BDF8' : '#0284C7'}
                  opacity={entry.dayName === peakDay ? 1 : 0.45}
                  className="hover:opacity-100 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
