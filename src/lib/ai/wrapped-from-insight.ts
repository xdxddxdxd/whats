/**
 * Wrapped / Story slaytlarını güncel Insight metrikleriyle üretir.
 * Eğlenceli dil korunur; kesin hüküm (trip atıyor / toksik) yok.
 */

import { ChatMetrics } from '../analytics/stats-engine';
import { InsightBundle } from '@/types/chat';
import { WrappedSlideData } from './types';

export function buildInsightAwareSlides(
  chatTitle: string,
  metrics: ChatMetrics,
  baseSlides: WrappedSlideData[],
  insight?: InsightBundle | null
): WrappedSlideData[] {
  if (!insight) return baseSlides;

  const sessions = insight.initiation?.totalSessions ?? 0;
  const initEntries = Object.entries(insight.initiation?.byUser || {}).sort(
    (a, b) => b[1].percentage - a[1].percentage
  );
  const topInit = initEntries[0];
  const silenceH = insight.silence?.longest?.hours ?? metrics.longestSilence?.hours ?? 0;
  const change = insight.changeAnalysis;
  const health = insight.chatHealth;
  const conflictN = insight.conflictAnalysis?.totalDetected ?? 0;

  const dynamicsSlide: WrappedSlideData = {
    id: 'slide_dynamics',
    type: 'dynamics',
    title: 'Konuşma Dinamikleri',
    subtitle: sessions ? `${sessions.toLocaleString('tr-TR')} konuşma oturumu` : 'Oturum analizi',
    badge: 'DİNAMİK',
    gradient: 'from-[#0A0A0A] to-[#141414]',
    narrative: topInit
      ? `Sessizlik sonrası sohbeti en çok ${topInit[0]} başlattı (%${topInit[1].percentage}). ${sessions} oturum tespit edildi.`
      : `Bu sohbette ${sessions} konuşma oturumu ölçüldü.`,
    extraData: {
      sessions,
      initiation: insight.initiation?.byUser,
      avgSessionMin: insight.dynamics?.avgSessionDurationMinutes,
      silenceHours: silenceH,
    },
  };

  const changeSlide: WrappedSlideData | null =
    change && change.trendLabel !== 'yetersiz_veri'
      ? {
          id: 'slide_change',
          type: 'change',
          title: 'Son 30 Günün Ritmi',
          subtitle: change.trendLabel === 'artış' ? 'Tempo yükseldi' : change.trendLabel === 'azalış' ? 'Tempo yavaşladı' : 'Stabil ritim',
          badge: 'DEĞİŞİM',
          gradient: 'from-[#0A0A0A] to-[#141414]',
          narrative: `Mesaj hacmi ${change.deltas.messageCountPct > 0 ? '+' : ''}${change.deltas.messageCountPct}%, medyan cevap ${change.deltas.medianResponsePct > 0 ? '+' : ''}${change.deltas.medianResponsePct}%, ortalama mesaj uzunluğu ${change.deltas.avgMessageLengthPct > 0 ? '+' : ''}${change.deltas.avgMessageLengthPct}%.`,
          extraData: { deltas: change.deltas, trend: change.trendLabel },
        }
      : null;

  const healthSlide: WrappedSlideData | null = health
    ? {
        id: 'slide_health',
        type: 'health',
        title: 'Sohbet Sağlığı',
        subtitle: `Profil: ${health.overallLabel}`,
        badge: '5 EKSEN',
        gradient: 'from-[#0A0A0A] to-[#141414]',
        narrative: `Aktivite ${health.activity} · Karşılıklılık ${health.reciprocity} · Yanıtlılık ${health.responsiveness} · Ton dengesi ${health.toneStability} · Süreklilik ${health.continuity}.${conflictN ? ` Ölçülen gerilim dönemi: ${conflictN}.` : ''}`,
        extraData: { ...health, conflictN },
      }
    : null;

  const enriched = baseSlides.map((s) => {
    if (s.type === 'stats_overview' && sessions > 0) {
      return {
        ...s,
        narrative: `${s.narrative} Ayrıca ${sessions.toLocaleString('tr-TR')} ayrı konuşma oturumu ve en uzun sessizlik ~${silenceH} saat.`,
        extraData: { ...(s.extraData || {}), sessions, silenceH },
      };
    }
    if (s.type === 'oracle') {
      const bits: string[] = [];
      if (topInit) bits.push(`${topInit[0]} konuşmaları sık başlatmaya devam edebilir`);
      if (change?.trendLabel === 'artış') bits.push('son dönemdeki tempo artışı sürerse mesaj hacmi büyüyebilir');
      if (change?.trendLabel === 'azalış') bits.push('tempo düşüşü devam ederse daha sakin bir dönem gelebilir');
      if (!bits.length) bits.push('ritim metrikleri stabil görünüyor');
      return {
        ...s,
        title: 'Metriklerden İpucu',
        subtitle: 'Kehanet değil · trend gözlemi',
        badge: 'TREND',
        narrative: `Gözlem: ${bits.join('; ')}. Bu bir tahmin değil, mevcut sinyallerin özeti.`,
      };
    }
    return s;
  });

  const out: WrappedSlideData[] = [];
  for (const s of enriched) {
    out.push(s);
    if (s.type === 'stats_overview') out.push(dynamicsSlide);
    if (s.type === 'emoji_dna') {
      if (changeSlide) out.push(changeSlide);
      if (healthSlide) out.push(healthSlide);
    }
  }
  return out;
}
