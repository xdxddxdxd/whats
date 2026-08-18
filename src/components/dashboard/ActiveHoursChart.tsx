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
import { HourlyDistribution } from '@/lib/analytics/stats-engine';
import { Clock } from 'lucide-react';

interface ActiveHoursChartProps {
  data: HourlyDistribution[];
  peakHour: number;
}

export const ActiveHoursChart: React.FC<ActiveHoursChartProps> = ({ data, peakHour }) => {
  return (
    <div className="p-6 rounded-3xl bg-[#11141A] border border-white/10 shadow-soft space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#38BDF8]" />
            <span>24-Saatlik Aktivite Ritmi</span>
          </h4>
          <p className="text-xs text-[#94A3B8] font-sans">
            Günün hangi saatlerinde mesaj trafiği zirveye ulaştı?
          </p>
        </div>
        <div className="px-3 py-1 rounded-xl bg-[#0284C7]/20 text-[#38BDF8] text-xs font-mono font-bold border border-[#38BDF8]/30">
          Zirve: {peakHour.toString().padStart(2, '0')}:00
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="hour"
              tickFormatter={(hour) => (hour % 3 === 0 ? `${hour}:00` : '')}
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
                  const item = payload[0].payload as HourlyDistribution;
                  return (
                    <div className="bg-[#0B0D11] text-white p-3 rounded-2xl shadow-xl text-xs border border-white/15">
                      <p className="font-bold text-[#38BDF8]">{item.label}</p>
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
                  key={`cell-${entry.hour}`}
                  fill={entry.hour === peakHour ? '#38BDF8' : '#0284C7'}
                  opacity={entry.hour === peakHour ? 1 : 0.45}
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
