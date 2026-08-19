'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, Award, Laugh, Users, Flame } from 'lucide-react';
import { AISentimentResult, UserStats } from '@/types/chat';
import { DashboardSkeleton } from './DashboardSkeleton';

interface RelationshipRolesCardProps {
  sentiment?: AISentimentResult;
  user1: UserStats;
  user2: UserStats;
  isLoading?: boolean;
}

type TabType = 'tarz' | 'kisilik' | 'uyum';

export const RelationshipRolesCard: React.FC<RelationshipRolesCardProps> = ({
  sentiment,
  user1,
  user2,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('tarz');

  if (isLoading || !sentiment) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 pt-2">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            İlişki Analizi
          </h2>
        </div>
        <DashboardSkeleton type="relationship" />
      </div>
    );
  }

  const { relationshipRoles } = sentiment;
  const romanticScore = relationshipRoles?.romanticScore || { user1: 116, user2: 48 };
  const funnyScore = relationshipRoles?.funnyScore || { user1: 28, user2: 35 };
  const titles = relationshipRoles?.titles || {
    [user1.name]: ['Gece Kuşu', 'Romantik Lider', 'Hızlı Yanıtçı'],
    [user2.name]: ['Grup Neşesi', 'Emoji Şampiyonu', 'Meraklı']
  };

  const topRomantic = romanticScore.user1 >= romanticScore.user2 ? user1 : user2;
  const topRomanticCount = Math.max(romanticScore.user1, romanticScore.user2);

  const topFunny = funnyScore.user2 >= funnyScore.user1 ? user2 : user1;
  const topFunnyCount = Math.max(funnyScore.user1, funnyScore.user2);

  return (
    <div className="space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pt-2">
        <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm shrink-0">
          <Heart className="w-5 h-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          İlişki Analizi
        </h2>
      </div>

      {/* Segmented Tab Buttons */}
      <div className="inline-flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/50 text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('tarz')}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            activeTab === 'tarz'
              ? 'bg-emerald-100 text-emerald-800 shadow-sm font-bold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          İlişki Tarzınız
        </button>
        <button
          onClick={() => setActiveTab('kisilik')}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            activeTab === 'kisilik'
              ? 'bg-emerald-100 text-emerald-800 shadow-sm font-bold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          Sohbet Kişiliğiniz
        </button>
        <button
          onClick={() => setActiveTab('uyum')}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            activeTab === 'uyum'
              ? 'bg-emerald-100 text-emerald-800 shadow-sm font-bold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          Uyum Skorları
        </button>
      </div>

      {/* Dynamic Tab Content */}
      <div className="space-y-3.5">
        
        {/* Tab 1: İlişki Tarzınız */}
        {activeTab === 'tarz' && (
          <>
            {/* 1. Kim Daha Romantik? */}
            <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
                KİM DAHA ROMANTİK?
              </span>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {topRomantic.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium font-sans mt-0.5">
                  {topRomanticCount} romantik ifade ve emoji kullanımı
                </p>
              </div>

              {/* Horizontal Comparison Bar */}
              <div className="space-y-2 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{user2.name}</span>
                    <span className="font-mono text-slate-500">{romanticScore.user2}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, (romanticScore.user2 / (romanticScore.user1 + romanticScore.user2)) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{user1.name}</span>
                    <span className="font-mono text-slate-500">{romanticScore.user1}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, (romanticScore.user1 / (romanticScore.user1 + romanticScore.user2)) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Kim Daha Komik? */}
            <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
                KİM DAHA KOMİK?
              </span>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {topFunny.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium font-sans mt-0.5">
                  {topFunnyCount} komik ifade ve emoji kullanımı
                </p>
              </div>

              {/* Horizontal Comparison Bar */}
              <div className="space-y-2 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{user2.name}</span>
                    <span className="font-mono text-slate-500">{funnyScore.user2}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, (funnyScore.user2 / (funnyScore.user1 + funnyScore.user2)) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{user1.name}</span>
                    <span className="font-mono text-slate-500">{funnyScore.user1}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, (funnyScore.user1 / (funnyScore.user1 + funnyScore.user2)) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Sohbet Kişiliğiniz */}
        {activeTab === 'kisilik' && (
          <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
              KATILIMCI UNVANLARI & KİŞİLİKLERİ
            </span>

            <div className="space-y-3">
              {/* User 1 Titles */}
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{user1.name}</h4>
                  <span className="text-xs text-sky-700 font-mono font-semibold">%{user1.percentage} Pay</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(titles[user1.name] || ['Gece Kuşu', 'Hızlı Cevapçı', 'Grup Lideri']).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-white border border-sky-200 text-sky-800 text-[11px] font-semibold"
                    >
                      ✦ {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* User 2 Titles */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{user2.name}</h4>
                  <span className="text-xs text-emerald-700 font-mono font-semibold">%{user2.percentage} Pay</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(titles[user2.name] || ['Grup Neşesi', 'Emoji Şampiyonu', 'Meraklı']).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800 text-[11px] font-semibold"
                    >
                      ✦ {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Uyum Skorları */}
        {activeTab === 'uyum' && (
          <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
              SOHBET UYUM MATRİSİ
            </span>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Cevap Verme Dengesi</span>
                  <span className="font-bold text-emerald-600 font-mono">%94 Uyum</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[94%]" />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Duygu & Mizah Senkronu</span>
                  <span className="font-bold text-sky-600 font-mono">%88 Uyum</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full w-[88%]" />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Gece & Gündüz Ritmi</span>
                  <span className="font-bold text-indigo-600 font-mono">%91 Uyum</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full w-[91%]" />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
