'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ShieldAlert, ArrowLeft } from 'lucide-react';
import { getClientOwnerToken, getClientGuestSession } from '@/lib/utils/session';
import { formatNumber } from '@/lib/utils/formatters';

// Dashboard Components
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { MessageDistributionCard } from '@/components/dashboard/MessageDistributionCard';
import { ActiveHoursChart } from '@/components/dashboard/ActiveHoursChart';
import { CommunicationDynamicsCard } from '@/components/dashboard/CommunicationDynamicsCard';
import { EmojiLeaderboard } from '@/components/dashboard/EmojiLeaderboard';
import { SentimentEvolutionCard } from '@/components/dashboard/SentimentEvolutionCard';
import { RelationshipRolesCard } from '@/components/dashboard/RelationshipRolesCard';

// 6 New Viral Feature Components
import { FlagsReportCard } from '@/components/dashboard/FlagsReportCard';
import { ToxicityRadarCard } from '@/components/dashboard/ToxicityRadarCard';
import { VocabularyDictionaryCard } from '@/components/dashboard/VocabularyDictionaryCard';
import { TimelineHighlightsCard } from '@/components/dashboard/TimelineHighlightsCard';
import { AskChatAiModal } from '@/components/dashboard/AskChatAiModal';
import { StoryCardsExporterModal } from '@/components/dashboard/StoryCardsExporterModal';

// Modals
import { OwnerControlModal } from '@/components/dashboard/OwnerControlModal';
import { IncrementalUpdateModal } from '@/components/dashboard/IncrementalUpdateModal';
import { DeleteChatModal } from '@/components/dashboard/DeleteChatModal';
import { WrappedViewer } from '@/components/wrapped/WrappedViewer';
import { WrappedPdfExporter } from '@/components/wrapped/WrappedPdfExporter';
import { Button } from '@/components/ui/Button';

// Mock and type helpers
import { chatAnalyticsData } from '@/lib/demo/demo-data';
import { formatDeterministicMetrics } from '@/lib/analytics/stats-engine';
import { AISentimentResult, DeterministicMetrics, FullChatAnalysisData } from '@/types/chat';

export default function ChatDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;

  const [chatData, setChatData] = useState<any | null>(null);
  const [analysisData, setAnalysisData] = useState<any | null>(null);
  const [metrics, setMetrics] = useState<DeterministicMetrics | null>(null);
  const [sentiment, setSentiment] = useState<AISentimentResult | null>(null);
  const [isSentimentLoading, setIsSentimentLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerToken, setOwnerToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRevoked, setIsRevoked] = useState(false);

  // Modals state
  const [isWrappedOpen, setIsWrappedOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);
  const [isStoryCardOpen, setIsStoryCardOpen] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchChatDetails = useCallback(async () => {
    if (!chatId) return;
    setIsLoading(true);
    setError(null);
    setIsRevoked(false);

    try {
      const clientOwnerToken = getClientOwnerToken();
      setOwnerToken(clientOwnerToken);

      const guestSession = getClientGuestSession(chatId);
      const guestToken = guestSession?.sessionToken || '';

      const queryParams = new URLSearchParams();
      if (clientOwnerToken) queryParams.append('owner_token', clientOwnerToken);
      if (guestToken) queryParams.append('guest_token', guestToken);

      const url = `/api/chats/${chatId}?${queryParams.toString()}`;
      const res = await fetch(url);
      const data = await res.json();

      if (res.status === 403) {
        if (data.isRevoked) {
          setIsRevoked(true);
          return;
        }
        if (data.requirePin && data.inviteCode) {
          router.replace(`/c/${data.inviteCode}`);
          return;
        }
      }

      if (!res.ok) {
        throw new Error(data.error || 'Sohbet detayları yüklenemedi.');
      }

      setChatData(data.chat);
      setAnalysisData(data.analysis);
      setIsOwner(data.chat?.isOwner || false);

      // 1. Correctly extract metrics from analysis.metrics OR chat.data
      const rawMetrics = data.analysis?.metrics || data.chat?.data;
      if (rawMetrics) {
        const formatted = rawMetrics.participants && Array.isArray(rawMetrics.participants)
          ? formatDeterministicMetrics(rawMetrics)
          : rawMetrics;
        setMetrics(formatted);
      } else {
        setMetrics(chatAnalyticsData as any);
      }

      // 2. Extract Sentiment (Progressive)
      if (data.analysis?.metrics?.sentiment) {
        setSentiment(data.analysis.metrics.sentiment);
        setIsSentimentLoading(false);
      } else if (data.chat?.data?.sentiment) {
        setSentiment(data.chat.data.sentiment);
        setIsSentimentLoading(false);
      } else {
        fetchSentimentProgressive(chatId);
      }

    } catch (err: any) {
      console.warn('API isteği başarısız oldu, demo verisi yükleniyor:', err);
      setChatData({
        id: 'demo',
        title: 'nisa cici ♡ Doğukan',
        chat_type: 'direct',
        total_messages: chatAnalyticsData.summary.totalMessages,
        total_participants: 2,
        first_message_date: chatAnalyticsData.summary.startDate,
        last_message_date: chatAnalyticsData.summary.endDate,
        isOwner: true,
        data: chatAnalyticsData
      });
      setAnalysisData({
        summary: 'Demo WhatsApp analizi',
        group_vibe: 'Dengeli Dedikodu & Geyik',
        superlatives: [],
        wrapped_slides: []
      });
      setMetrics(chatAnalyticsData as any);
      setSentiment(chatAnalyticsData.sentiment as any);
      setIsSentimentLoading(false);
      setIsOwner(true);
    } finally {
      setIsLoading(false);
    }
  }, [chatId, router]);

  const fetchSentimentProgressive = async (id: string) => {
    setIsSentimentLoading(true);
    try {
      const res = await fetch('/api/analyze-sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: id })
      });
      const data = await res.json();
      if (data.success && data.sentiment) {
        setSentiment(data.sentiment);
      }
    } catch (err) {
      console.error('Sentiment analizi alınamadı:', err);
    } finally {
      setIsSentimentLoading(false);
    }
  };

  useEffect(() => {
    fetchChatDetails();
  }, [fetchChatDetails]);

  const handleReAnalyze = async () => {
    if (!chatId || !ownerToken) return;
    const res = await fetch(`/api/chats/${chatId}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ownerToken }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Analiz yenilenemedi.');
    }
    setAnalysisData(data.analysis);
    if (data.analysis?.metrics) {
      const formatted = data.analysis.metrics.participants
        ? formatDeterministicMetrics(data.analysis.metrics)
        : data.analysis.metrics;
      setMetrics(formatted);
    }
  };

  if (isRevoked) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 bg-white rounded-3xl border border-red-200 text-center space-y-4 shadow-soft">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-serif text-slate-900">Erişim İptal Edildi</h2>
          <p className="text-xs text-slate-600">
            Sohbet sahibi tarafından bu sohbete olan davetli erişiminiz sonlandırılmıştır.
          </p>
          <Link href="/">
            <Button variant="primary" className="w-full mt-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Ana Sayfaya Dön</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-white rounded-3xl border border-slate-100 text-center space-y-4 shadow-soft animate-pulse">
          <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 animate-spin text-sky-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Sohbet Analizi Yükleniyor...</h3>
          <p className="text-xs text-slate-500">
            İstatistikler ve grafikler hazırlanıyor
          </p>
        </div>
      </div>
    );
  }

  if (error || !chatData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 bg-white rounded-3xl border border-red-200 text-center space-y-4 shadow-soft">
          <p className="text-sm text-red-600 font-semibold">{error || 'Sohbet bulunamadı.'}</p>
          <Link href="/">
            <Button variant="secondary" className="w-full">
              <ArrowLeft className="w-4 h-4" />
              <span>Ana Sayfaya Dön</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const effectiveMetrics = metrics || (chatAnalyticsData as any);
  const user1 = effectiveMetrics?.users?.user1 || chatAnalyticsData.users.user1;
  const user2 = effectiveMetrics?.users?.user2 || chatAnalyticsData.users.user2;
  const wrappedSlides = analysisData?.wrapped_slides || [];

  const fullAnalysisForStory: FullChatAnalysisData = {
    summary: {
      totalMessages: effectiveMetrics?.totalMessages || chatAnalyticsData.summary.totalMessages,
      startDate: effectiveMetrics?.startDate || chatAnalyticsData.summary.startDate,
      endDate: effectiveMetrics?.endDate || chatAnalyticsData.summary.endDate,
      daysCount: effectiveMetrics?.daysCount || chatAnalyticsData.summary.daysCount,
      dailyAverage: effectiveMetrics?.dailyAverage || chatAnalyticsData.summary.dailyAverage,
      longestSilenceHours: effectiveMetrics?.longestSilenceHours || chatAnalyticsData.summary.longestSilenceHours,
      longestSilenceDates: effectiveMetrics?.longestSilenceDates || chatAnalyticsData.summary.longestSilenceDates,
      mostActiveHour: effectiveMetrics?.mostActiveHour || chatAnalyticsData.summary.mostActiveHour,
      mostActiveDay: effectiveMetrics?.mostActiveDay || chatAnalyticsData.summary.mostActiveDay,
      mostActiveDate: effectiveMetrics?.mostActiveDate || chatAnalyticsData.summary.mostActiveDate
    },
    users: {
      user1,
      user2
    },
    timeDistribution: effectiveMetrics?.timeDistribution || chatAnalyticsData.timeDistribution,
    allTopEmojis: effectiveMetrics?.allTopEmojis || chatAnalyticsData.allTopEmojis,
    sentiment: sentiment || undefined
  };

  const flagsReportData = effectiveMetrics?.flagsReport || sentiment?.flagsReport || chatAnalyticsData.flagsReport;
  const toxicityRadarData = effectiveMetrics?.toxicityRadar || sentiment?.toxicityRadar || chatAnalyticsData.toxicityRadar;
  const chatDictionaryData = effectiveMetrics?.chatDictionary || sentiment?.chatDictionary || chatAnalyticsData.chatDictionary;
  const timelineHighlightsData = effectiveMetrics?.timelineHighlights || sentiment?.timelineHighlights || chatAnalyticsData.timelineHighlights;

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28 selection:bg-sky-200 font-sans">
      
      {/* Mobile-First Centered Container */}
      <div className="max-w-md sm:max-w-xl mx-auto px-4 sm:px-6 pt-4 space-y-6">
        
        {/* 1. Header Bar & Titles */}
        <DashboardHeader
          chat={chatData}
          user1Name={user1.name}
          user2Name={user2.name}
          onOpenWrapped={() => setIsWrappedOpen(true)}
          onOpenPdf={() => setIsPdfOpen(true)}
          onOpenAskAi={() => setIsAskAiOpen(true)}
          onOpenStoryCard={() => setIsStoryCardOpen(true)}
          onOpenOwnerControls={() => setIsOwnerModalOpen(true)}
          onOpenUpdate={() => setIsUpdateModalOpen(true)}
          onOpenDelete={() => setIsDeleteModalOpen(true)}
        />

        {/* 2. Toplam Mesaj Büyük Metrik Kartı */}
        <StatCard
          title="TOPLAM MESAJ"
          value={formatNumber(effectiveMetrics.totalMessages)}
          subtitle={`${effectiveMetrics.daysCount} günlük sohbet dönemi`}
          badge={`${user1.name} & ${user2.name}`}
          isHero={true}
        />

        {/* 3. Kim Daha Çok Yazıyor? (Katılımcı Dağılımı ve Efor Dengesi) */}
        <MessageDistributionCard
          user1={user1}
          user2={user2}
          totalMessages={effectiveMetrics.totalMessages}
          startDate={effectiveMetrics.startDate}
          endDate={effectiveMetrics.endDate}
        />

        {/* 4. Zaman Analizi & Aktivite Grafikleri */}
        <ActiveHoursChart
          timeDistribution={effectiveMetrics.timeDistribution}
          mostActiveHour={effectiveMetrics.mostActiveHour}
          mostActiveDay={effectiveMetrics.mostActiveDay}
          longestSilenceHours={effectiveMetrics.longestSilenceHours}
          longestSilenceDates={effectiveMetrics.longestSilenceDates}
        />

        {/* 5. İletişim Dinamikleri & Yanıt Hızları */}
        <CommunicationDynamicsCard
          user1={user1}
          user2={user2}
          longestSilenceHours={effectiveMetrics.longestSilenceHours}
          longestSilenceDates={effectiveMetrics.longestSilenceDates}
        />

        {/* 6. Emoji Analizi & Sıralaması */}
        <EmojiLeaderboard
          emojis={effectiveMetrics.allTopEmojis}
          user1={user1}
          user2={user2}
        />

        {/* 7. Duygusal Analiz & Evrim (Progressive AI Layer) */}
        <SentimentEvolutionCard
          sentiment={sentiment || undefined}
          isLoading={isSentimentLoading}
        />

        {/* 8. Eğlenceli Unvanlar & İlişki Rolleri (Progressive AI Layer) */}
        <RelationshipRolesCard
          sentiment={sentiment || undefined}
          user1={user1}
          user2={user2}
          isLoading={isSentimentLoading}
        />

        {/* 9. [YENİ] Red & Green Flag Raporu */}
        <FlagsReportCard
          flagsReport={flagsReportData}
          user1={user1}
          user2={user2}
        />

        {/* 10. [YENİ] Trip & Kavga Barometresi */}
        <ToxicityRadarCard
          toxicityRadar={toxicityRadarData}
          user1={user1}
          user2={user2}
        />

        {/* 11. [YENİ] İkonik Kelimeler & Sohbet Sözlüğü */}
        <VocabularyDictionaryCard
          chatDictionary={chatDictionaryData}
          user1={user1}
          user2={user2}
        />

        {/* 12. [YENİ] Zaman Tüneli & Önemli Anlar */}
        <TimelineHighlightsCard
          highlights={timelineHighlightsData}
        />

      </div>

      {/* [YENİ] Sohbetinle Konuş (AI Asistanı - 5 Soru Limitli) */}
      <AskChatAiModal
        isOpen={isAskAiOpen}
        onClose={() => setIsAskAiOpen(false)}
        chatId={chatData.id}
        chatTitle={chatData.title}
      />

      {/* [YENİ] Instagram & TikTok 9:16 Story Kartı Üretici */}
      <StoryCardsExporterModal
        isOpen={isStoryCardOpen}
        onClose={() => setIsStoryCardOpen(false)}
        chatTitle={chatData.title}
        data={fullAnalysisForStory}
      />

      {/* Fullscreen Wrapped Story Modal */}
      <WrappedViewer
        isOpen={isWrappedOpen}
        onClose={() => setIsWrappedOpen(false)}
        slides={wrappedSlides}
        chatTitle={chatData.title}
        onOpenPdf={() => {
          setIsWrappedOpen(false);
          setIsPdfOpen(true);
        }}
      />

      {/* PDF Exporter Modal */}
      <WrappedPdfExporter
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
        slides={wrappedSlides}
        chatTitle={chatData.title}
      />

      {/* Owner Control Modal */}
      {isOwner && (
        <OwnerControlModal
          isOpen={isOwnerModalOpen}
          onClose={() => setIsOwnerModalOpen(false)}
          chatId={chatData.id}
          inviteCode={chatData.invite?.invite_code}
          passwordPin={chatData.invite?.password_pin}
          ownerToken={ownerToken}
          onReAnalyze={handleReAnalyze}
        />
      )}

      {/* Incremental Update Modal */}
      {isOwner && (
        <IncrementalUpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          chatId={chatData.id}
          ownerToken={ownerToken}
          onSuccess={fetchChatDetails}
        />
      )}

      {/* Delete Chat Modal */}
      {isOwner && (
        <DeleteChatModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          chatId={chatData.id}
          chatTitle={chatData.title}
          ownerToken={ownerToken}
          onSuccess={() => router.push('/')}
        />
      )}

    </main>
  );
}
