'use client';

import React, { useState } from 'react';
import {
  Heart,
  Flame,
  Smile,
  Clock,
  MessageCircle,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CompatibilityScores, ChatHealthAxes } from '@/types/chat';

interface Props {
  scores?: CompatibilityScores | null;
  chatHealth?: ChatHealthAxes | null;
  user1Name?: string;
  user2Name?: string;
}

const HEALTH_AXES: { key: keyof Omit<ChatHealthAxes, 'overallLabel'>; label: string }[] = [
  { key: 'activity', label: 'Aktivite' },
  { key: 'reciprocity', label: 'Karşılıklılık' },
  { key: 'responsiveness', label: 'Yanıtlılık' },
  { key: 'toneStability', label: 'Ton dengesi' },
  { key: 'continuity', label: 'Süreklilik' },
];

const labelText: Record<string, string> = {
  dengeli: 'Dengeli profil',
  aktif: 'Aktif profil',
  düzensiz: 'Düzensiz ritim',
  sakin: 'Sakin profil',
  yetersiz_veri: 'Yetersiz veri',
};

export const OverviewScoreCard: React.FC<Props> = ({
  scores,
  chatHealth,
  user1Name = 'Kullanıcı 1',
  user2Name = 'Kullanıcı 2',
}) => {
  const [healthOpen, setHealthOpen] = useState(false);

  if (!scores && (!chatHealth || chatHealth.overallLabel === 'yetersiz_veri')) {
    return null;
  }

  const overallScore = scores?.overallScore ?? null;
  const overallDescription =
    scores?.overallDescription ||
    'Mesaj dengesi, ritim ve ifade frekansına göre hesaplanan sohbet uyum skoru.';

  const breakdowns = scores
    ? [
        {
          title: 'Mizah',
          score: scores.comedyScore ?? 0,
          icon: Smile,
          color: 'from-amber-400 to-orange-500',
        },
        {
          title: 'Zaman',
          score: scores.timeScore ?? 0,
          icon: Clock,
          color: 'from-emerald-400 to-teal-500',
        },
        {
          title: 'İletişim',
          score: scores.communicationScore ?? 0,
          icon: MessageCircle,
          color: 'from-sky-400 to-blue-500',
        },
        {
          title: 'Emoji',
          score: scores.emojiScore ?? 0,
          icon: Heart,
          color: 'from-pink-400 to-rose-500',
        },
      ]
    : [];

  // Top 3 health axes for compact strip
  const topHealth =
    chatHealth && chatHealth.overallLabel !== 'yetersiz_veri'
      ? HEALTH_AXES.map(({ key, label }) => ({
          key,
          label,
          value: chatHealth[key] as number,
        })).sort((a, b) => b.value - a.value)
      : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 pt-2">
        <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shadow-sm shrink-0">
          <Heart className="w-5 h-5 fill-pink-500" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Sohbet Uyum Skoru</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
              ANA SKOR
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {user1Name} & {user2Name} — tek özet metrik · sağlık eksenleri detayda
          </p>
        </div>
      </div>

      <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-5">
        {overallScore != null && (\n          <div className=\"p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50/30 border border-pink-100 flex items-center justify-between gap-4\">\n            <div className=\"flex items-start gap-3 min-w-0\">\n              <div className=\"p-2 rounded-xl bg-pink-500 text-white shrink-0 shadow-sm mt-0.5\">\n                <Flame className=\"w-4 h-4\" />\n              </div>\n              <div className=\"min-w-0\">\n                <span className=\"text-[11px] font-bold uppercase tracking-wider text-pink-700 block\">\n                  Genel uyum\n                </span>\n                <p className=\"text-xs sm:text-sm font-medium text-slate-700 mt-0.5 leading-snug\">\n                  {overallDescription}\n                </p>\n              </div>\n            </div>\n            <div className=\"text-right shrink-0\">\n              <span className=\"text-3xl sm:text-4xl font-black text-pink-600 font-mono tracking-tight\">\n                %{overallScore}\n              </span>\n            </div>\n          </div>\n        )}\n\n        {breakdowns.length > 0 && (\n          <div className=\"grid grid-cols-2 sm:grid-cols-4 gap-2.5\">\n            {breakdowns.map((item) => {\n              const Icon = item.icon;\n              return (\n                <div\n                  key={item.title}\n                  className=\"p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2\"\n                >\n                  <div className=\"flex items-center gap-1.5 text-slate-600\">\n                    <Icon className=\"w-3.5 h-3.5\" />\n                    <span className=\"text-[11px] font-bold\">{item.title}</span>\n                  </div>\n                  <p className=\"text-xl font-black font-mono text-slate-900\">%{item.score}</p>\n                  <div className=\"h-1.5 rounded-full bg-slate-200 overflow-hidden\">\n                    <div\n                      className={`h-full rounded-full bg-gradient-to-r ${item.color}`}\n                      style={{ width: `${Math.min(100, item.score)}%` }}\n                    />\n                  </div>\n                </div>\n              );\n            })}\n          </div>\n        )}\n\n        {/* Embedded chat health — not a second \"main score\" */}\n        {topHealth.length > 0 && (\n          <div className=\"border-t border-slate-100 pt-4 space-y-3\">\n            <button\n              type=\"button\"\n              onClick={() => setHealthOpen((v) => !v)}\n              className=\"w-full flex items-center justify-between gap-2 text-left\"\n            >\n              <div className=\"flex items-center gap-2\">\n                <Activity className=\"w-4 h-4 text-teal-600\" />\n                <div>\n                  <p className=\"text-xs font-bold text-slate-800\">Sohbet sağlığı eksenleri</p>\n                  <p className=\"text-[11px] text-slate-400\">\n                    Alt metrik · {labelText[chatHealth!.overallLabel] || chatHealth!.overallLabel}\n                  </p>\n                </div>\n              </div>\n              {healthOpen ? (\n                <ChevronUp className=\"w-4 h-4 text-slate-400\" />\n              ) : (\n                <ChevronDown className=\"w-4 h-4 text-slate-400\" />\n              )}\n            </button>\n\n            {/* Always show top 3 compact */}\n            <div className=\"grid grid-cols-3 gap-2\">\n              {topHealth.slice(0, 3).map((h) => (\n                <div key={h.key} className=\"rounded-xl bg-teal-50/60 border border-teal-100 px-2.5 py-2\">\n                  <p className=\"text-[10px] font-bold text-teal-700/80 uppercase truncate\">\n                    {h.label}\n                  </p>\n                  <p className=\"text-lg font-black font-mono text-teal-900\">{h.value}</p>\n                </div>\n              ))}\n            </div>\n\n            {healthOpen && (\n              <div className=\"space-y-2.5 pt-1\">\n                {HEALTH_AXES.map(({ key, label }) => {\n                  const v = chatHealth![key] as number;\n                  return (\n                    <div key={key} className=\"space-y-1\">\n                      <div className=\"flex justify-between text-xs\">\n                        <span className=\"font-semibold text-slate-700\">{label}</span>\n                        <span className=\"font-mono font-bold text-slate-900\">{v}</span>\n                      </div>\n                      <div className=\"h-2 rounded-full bg-slate-100 overflow-hidden\">\n                        <div\n                          className=\"h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-500\"\n                          style={{ width: `${Math.min(100, v)}%` }}\n                        />\n                      </div>\n                    </div>\n                  );\n                })}\n                <p className=\"text-[11px] text-slate-400 leading-relaxed\">\n                  Bu eksenler teşhis değil; aktivite, karşılıklılık, yanıt hızı, ton ve süreklilik\n                  ölçümleridir. Ana özet skor yukarıdaki uyum yüzdesidir.\n                </p>\n              </div>\n            )}\n          </div>\n        )}\n      </div>\n    </div>\n  );\n};\n