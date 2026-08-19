'use client';

import React from 'react';
import { Flame, AlertOctagon, Snowflake } from 'lucide-react';
import { ToxicityRadarData, UserStats } from '@/types/chat';

interface ToxicityRadarCardProps {
  toxicityRadar?: ToxicityRadarData;
  user1: UserStats;
  user2: UserStats;
}

export const ToxicityRadarCard: React.FC<ToxicityRadarCardProps> = ({
  toxicityRadar,
  user1,
  user2
}) => {
  if (!toxicityRadar) return null;

  const { dramaLevel, tripScore, detectedPatterns, coldPeriods } = toxicityRadar;
  const topTripUser = tripScore.user2 >= tripScore.user1 ? user2 : user1;
  const totalTrip = tripScore.user1 + tripScore.user2 || 1;

  const user1TripPercent = Math.round((tripScore.user1 / totalTrip) * 100);
  const user2TripPercent = Math.round((tripScore.user2 / totalTrip) * 100);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pt-2">
        <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm shrink-0">
          <Flame className="w-5 h-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Trip & Kavga Barometresi
        </h2>
      </div>

      {/* Main Container Card */}
      <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-6">
        
        {/* Top Header: Drama Level */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
              DRAMA & GERİLİM SEVİYESİ
            </span>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
              {dramaLevel}
            </h3>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold font-sans shadow-sm">
            <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
            <span>Barometre Aktif</span>
          </div>
        </div>

        {/* 1. Kim Daha Çok Trip Atıyor? */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Kim Daha Çok Trip / Sitem Yapıyor?
            </span>
            <span className="text-xs font-bold text-sky-700 font-sans">
              🏆 Lider: {topTripUser.name}
            </span>
          </div>

          {/* Comparison Bars */}
          <div className="space-y-2 pt-1">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{user2.name}</span>
                <span className="font-mono font-bold text-slate-900">%{user2TripPercent}</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${user2TripPercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{user1.name}</span>
                <span className="font-mono font-bold text-slate-900">%{user1TripPercent}</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-500"
                  style={{ width: `${user1TripPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Pasif-Agresif Kalıp Dedektörü */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
              PASİF-AGRESİF KALIP DEDEKTÖRÜ
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {detectedPatterns.length} tespit
            </span>
          </div>

          <div className="space-y-2.5">
            {detectedPatterns.map((pat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1.5"
              >
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="text-xs font-bold text-slate-900">
                    "{pat.phrase}"
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {pat.tag}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold font-mono">
                      Yoğunluk: %{pat.intensity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans">
                  <span>Gönderen: <strong>{pat.sender}</strong> ({pat.time})</span>
                  <span className="italic">{pat.context}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Buz Devri (En Soğuk Dönemler) */}
        {coldPeriods.length > 0 && (
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
              <Snowflake className="w-4 h-4 text-blue-600" />
              <span>Buz Devri (En Soğuk Sessizlik Anı)</span>
            </div>
            {coldPeriods.map((cp, idx) => (
              <div key={idx} className="text-xs text-slate-700 font-sans space-y-1">
                <p className="font-bold text-blue-950 font-mono">{cp.dates} ({cp.hours} saat)</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {cp.triggerMessage || 'Mesajlaşmanın bıçak gibi kesildiği ve uzun süre kimsenin yazmadığı dönem.'}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
