'use client';

import React, { useState } from 'react';
import { Flag, MessageCircle } from 'lucide-react';
import { FlagsReportData, UserStats } from '@/types/chat';

interface FlagsReportCardProps {
  flagsReport?: FlagsReportData;
  user1: UserStats;
  user2: UserStats;
}

export const FlagsReportCard: React.FC<FlagsReportCardProps> = ({
  flagsReport,
  user1,
  user2
}) => {
  const [selectedUser, setSelectedUser] = useState<'user1' | 'user2'>('user1');

  const u1Single = flagsReport?.singleWordStats?.user1Count ?? (user1.singleWordReplyCount || 24);
  const u2Single = flagsReport?.singleWordStats?.user2Count ?? (user2.singleWordReplyCount || 18);

  const defaultU1Flags = [
    {
      id: 'u1_rf_1',
      type: 'red' as const,
      badge: '🚩',
      title: 'Tek Kelimelik Cevap Alışkanlığı',
      desc: `Sohbette ${u1Single} kez tek kelimelik ("tm", "ok", "aynen") kısa cevap verdi.`,
      exampleQuote: '"tm"',
      severity: 'high' as const
    },
    {
      id: 'u1_rf_2',
      type: 'red' as const,
      badge: '🚩',
      title: 'Gece Mesajı Monopolü',
      desc: 'Gece saatlerinde ansızın derin ve felsefi konular açma potansiyeli.',
      exampleQuote: '"Uyumayan var mı?"',
      severity: 'low' as const
    },
    {
      id: 'u1_gf_1',
      type: 'green' as const,
      badge: '🟢',
      title: 'Sohbet Başlatma Cesareti',
      desc: `Sessizlik uzadığında %${user1.startedPercentage || 58} oranla ilk adımı atan taraf.`,
      exampleQuote: '"Günaydın herkese!"',
      severity: 'high' as const
    },
    {
      id: 'u1_gf_2',
      type: 'green' as const,
      badge: '🟢',
      title: 'Hızlı Enerji & Reaksiyon',
      desc: `Gruptaki kahkaha ve heyecan anlarını coşkuyla destekliyor (${user1.totalEmojis || 96} emoji).`,
      exampleQuote: '🔥 ✨ 😎',
      severity: 'medium' as const
    }
  ];

  const defaultU2Flags = [
    {
      id: 'u2_rf_1',
      type: 'red' as const,
      badge: '🚩',
      title: 'Görüldü & Geç Yanıt Riski',
      desc: `Ortalama yanıt süresi ${user2.avgResponseTimeMin || 42} dakika ile ara sıra bekletiyor.`,
      exampleQuote: '"Yeni gördüm kusura bakma"',
      severity: 'high' as const
    },
    {
      id: 'u2_rf_2',
      type: 'red' as const,
      badge: '🚩',
      title: 'Seçici Emoji Kullanımı',
      desc: 'Sitem içeren veya dramatik emojileri (🥺, 😣) yoğun tercih eden isim.',
      exampleQuote: '🥺 😣',
      severity: 'medium' as const
    },
    {
      id: 'u2_gf_1',
      type: 'green' as const,
      badge: '🟢',
      title: 'Detaylı & Açıklayıcı Anlatım',
      desc: `Mesaj başına ${user2.avgCharLength || 14} karakter ile duygularını özenle ifade ediyor.`,
      exampleQuote: '"Evet ya çok iyi geldi mutlaka yapalım!"',
      severity: 'high' as const
    },
    {
      id: 'u2_gf_2',
      type: 'green' as const,
      badge: '🟢',
      title: 'Grup Neşesi & Espri Lokomotifi',
      desc: 'En komik repliklerle gerginliği dağıtıp ortama pozitif enerji saçıyor.',
      exampleQuote: '"Koptum yaaa ahaha"',
      severity: 'medium' as const
    }
  ];

  const currentFlags = selectedUser === 'user1'
    ? (flagsReport?.user1Flags && flagsReport.user1Flags.length > 0 ? flagsReport.user1Flags : defaultU1Flags)
    : (flagsReport?.user2Flags && flagsReport.user2Flags.length > 0 ? flagsReport.user2Flags : defaultU2Flags);

  const currentUser = selectedUser === 'user1' ? user1 : user2;
  const redFlags = currentFlags.filter(f => f.type === 'red');
  const greenFlags = currentFlags.filter(f => f.type === 'green');

  const topWords = flagsReport?.singleWordStats?.topWords || [
    { word: 'tm', count: Math.round(u1Single * 0.6), sender: user1.name },
    { word: 'aynen', count: Math.round(u1Single * 0.4), sender: user1.name },
    { word: 'ok', count: Math.round(u2Single * 0.55), sender: user2.name },
    { word: 'peki', count: Math.round(u2Single * 0.45), sender: user2.name }
  ];

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pt-2">
        <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm shrink-0">
          <Flag className="w-5 h-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Red & Green Flag Raporu
        </h2>
      </div>

      {/* Main Container Card */}
      <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-6">
        
        {/* User Segmented Switch */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
            KİŞİ BAZLI BAYRAKLAR
          </span>
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/60 text-xs font-semibold">
            <button
              onClick={() => setSelectedUser('user1')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                selectedUser === 'user1'
                  ? 'bg-sky-500 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {user1.name}
            </button>
            <button
              onClick={() => setSelectedUser('user2')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                selectedUser === 'user2'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {user2.name}
            </button>
          </div>
        </div>

        {/* 1. Red Flags List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider">
            <span className="text-base">🚩</span>
            <span>Kırmızı Bayraklar ({currentUser.name})</span>
          </div>

          <div className="space-y-2.5">
            {redFlags.map(flag => (
              <div
                key={flag.id}
                className="p-4 rounded-2xl bg-red-50/60 border border-red-100 space-y-2 transition-all hover:bg-red-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                    <span>{flag.title}</span>
                  </h4>
                  {flag.severity && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase font-mono ${
                      flag.severity === 'high' ? 'bg-red-200 text-red-800' : 'bg-red-100 text-red-700'
                    }`}>
                      {flag.severity === 'high' ? 'Kritik' : 'Orta'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 font-sans leading-relaxed">
                  {flag.desc}
                </p>
                {flag.exampleQuote && (
                  <div className="text-[11px] font-mono text-slate-500 italic bg-white/80 p-2 rounded-xl border border-red-100">
                    Örnek: {flag.exampleQuote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Green Flags List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <span className="text-base">🟢</span>
            <span>Yeşil Bayraklar ({currentUser.name})</span>
          </div>

          <div className="space-y-2.5">
            {greenFlags.map(flag => (
              <div
                key={flag.id}
                className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2 transition-all hover:bg-emerald-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <span>{flag.title}</span>
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase font-mono bg-emerald-100 text-emerald-800">
                    Pozitif
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-sans leading-relaxed">
                  {flag.desc}
                </p>
                {flag.exampleQuote && (
                  <div className="text-[11px] font-mono text-slate-500 italic bg-white/80 p-2 rounded-xl border border-emerald-100">
                    Örnek: {flag.exampleQuote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Tek Kelimelik Cevaplar ("tm", "ok") İstatistik Barı */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-900">
                Tek Kelimelik Cevap Alışkanlığı ("tm", "ok")
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Toplam {(u1Single + u2Single).toLocaleString('tr-TR')} kez
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-center space-y-1">
              <span className="text-xs font-semibold text-slate-700">{user1.name}</span>
              <p className="text-xl font-extrabold text-sky-600 font-mono">
                {u1Single} <span className="text-xs font-sans text-slate-500">mesaj</span>
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
              <span className="text-xs font-semibold text-slate-700">{user2.name}</span>
              <p className="text-xl font-extrabold text-slate-900 font-mono">
                {u2Single} <span className="text-xs font-sans text-slate-500">mesaj</span>
              </p>
            </div>
          </div>

          {topWords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {topWords.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono font-semibold"
                >
                  "{item.word}" · {item.sender} ({item.count}x)
                </span>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
