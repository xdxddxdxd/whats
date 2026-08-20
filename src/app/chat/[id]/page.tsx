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
import { ActiveHoursChart } from '@/components/dashboard/ActiveHoursChart';
import { ConversationDynamicsHub } from '@/components/dashboard/ConversationDynamicsHub';
import { ChangeAnalysisCard } from '@/components/dashboard/ChangeAnalysisCard';
import { TensionSignalsHub } from '@/components/dashboard/TensionSignalsHub';
import { OverviewScoreCard } from '@/components/dashboard/OverviewScoreCard';
import { BehaviorTimelineCard } from '@/components/dashboard/BehaviorTimelineCard';
import { DashboardSectionNav, DashboardSection } from '@/components/dashboard/DashboardSectionNav';
import { EmojiLeaderboard } from '@/components/dashboard/EmojiLeaderboard';
import { SentimentEvolutionCard } from '@/components/dashboard/SentimentEvolutionCard';
import { RelationshipRolesCard } from '@/components/dashboard/RelationshipRolesCard';

// Viral Feature Components
import { WordCloudCard } from '@/components/dashboard/WordCloudCard';
import { VocabularyDictionaryCard } from '@/components/dashboard/VocabularyDictionaryCard';
import { TimelineHighlightsCard } from '@/components/dashboard/TimelineHighlightsCard';
import { AskChatAiModal } from '@/components/dashboard/AskChatAiModal';
import { StoryCardsExporterModal } from '@/components/dashboard/StoryCardsExporterModal';
import { QrCodeModal } from '@/components/dashboard/QrCodeModal';

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
import { AISentimentResult, DeterministicMetrics, FullChatAnalysisData, UserStats } from '@/types/chat';

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
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
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
      const ownerTok = getClientOwnerToken();
      const guestSession = getClientGuestSession(id);
      const guestTok = guestSession?.sessionToken || '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (ownerTok) headers['x-owner-token'] = ownerTok;
      if (guestTok) headers['x-guest-token'] = guestTok;
      const res = await fetch('/api/analyze-sentiment', {
        method: 'POST',
        headers,
        body: JSON.stringify({ chatId: id })\n      });
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
  
  const user1: UserStats = {
    name: effectiveMetrics?.users?.user1?.name || 'Kullanıcı 1',
    color: effectiveMetrics?.users?.user1?.color || '#38BDF8',
    messageCount: effectiveMetrics?.users?.user1?.messageCount || 0,
    percentage: effectiveMetrics?.users?.user1?.percentage || 50,
    avgCharLength: effectiveMetrics?.users?.user1?.avgCharLength || 0,
    avgResponseTimeMin: effectiveMetrics?.users?.user1?.avgResponseTimeMin || 0,
    startedPercentage: effectiveMetrics?.users?.user1?.startedPercentage || 50,
    totalEmojis: effectiveMetrics?.users?.user1?.totalEmojis || 0,
    topEmojis: effectiveMetrics?.users?.user1?.topEmojis || [],
    singleWordReplyCount: effectiveMetrics?.users?.user1?.singleWordReplyCount || 0
  };

  const user2: UserStats = {
    name: effectiveMetrics?.users?.user2?.name || 'Kullanıcı 2',
    color: effectiveMetrics?.users?.user2?.color || '#10B981',
    messageCount: effectiveMetrics?.users?.user2?.messageCount || 0,
    percentage: effectiveMetrics?.users?.user2?.percentage || 50,
    avgCharLength: effectiveMetrics?.users?.user2?.avgCharLength || 0,
    avgResponseTimeMin: effectiveMetrics?.users?.user2?.avgResponseTimeMin || 0,
    startedPercentage: effectiveMetrics?.users?.user2?.startedPercentage || 50,
    totalEmojis: effectiveMetrics?.users?.user2?.totalEmojis || 0,
    topEmojis: effectiveMetrics?.users?.user2?.topEmojis || [],
    singleWordReplyCount: effectiveMetrics?.users?.user2?.singleWordReplyCount || 0
  };

  const wrappedSlides = analysisData?.wrapped_slides || [];

  const fullAnalysisForStory: FullChatAnalysisData = {
    summary: {
      totalMessages: effectiveMetrics?.totalMessages || 0,
      startDate: effectiveMetrics?.startDate || 'Kayıt Başlangıcı',
      endDate: effectiveMetrics?.endDate || 'Kayıt Sonu',
      daysCount: effectiveMetrics?.daysCount || 1,
      dailyAverage: effectiveMetrics?.dailyAverage || 0,
      longestSilenceHours: effectiveMetrics?.longestSilenceHours || 0,
      longestSilenceDates: effectiveMetrics?.longestSilenceDates || '-',
      mostActiveHour: effectiveMetrics?.mostActiveHour || '22:00',
      mostActiveDay: effectiveMetrics?.mostActiveDay || 'Pazar',
      mostActiveDate: effectiveMetrics?.mostActiveDate || '-'
    },
    users: {
      user1,
      user2
    },
    timeDistribution: effectiveMetrics?.timeDistribution || chatAnalyticsData.timeDistribution,
    allTopEmojis: effectiveMetrics?.allTopEmojis || [],
    sentiment: sentiment || undefined
  };

  const flagsReportData = effectiveMetrics?.flagsReport || sentiment?.flagsReport || chatAnalyticsData.flagsReport;
  const toxicityRadarData = effectiveMetrics?.toxicityRadar || sentiment?.toxicityRadar || chatAnalyticsData.toxicityRadar;
  const chatDictionaryData = effectiveMetrics?.chatDictionary || sentiment?.chatDictionary || chatAnalyticsData.chatDictionary;
  const timelineHighlightsData = effectiveMetrics?.timelineHighlights || sentiment?.timelineHighlights || chatAnalyticsData.timelineHighlights;
  const compatibilityScoresData = effectiveMetrics?.compatibilityScores || chatAnalyticsData.compatibilityScores;
  const wordCloudData = effectiveMetrics?.wordCloud || chatAnalyticsData.wordCloud;

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28 selection:bg-sky-200 font-sans">
      
      {/* Mobile-First Centered Container */}
      <div className="max-w-md sm:max-w-xl mx-auto px-4 sm:px-6 pt-4 space-y-6">
        
        {/* Header */}
        <DashboardHeader
          chat={chatData}
          user1Name={user1.name}
          user2Name={user2.name}
          onOpenWrapped={() => setIsWrappedOpen(true)}
          onOpenPdf={() => setIsPdfOpen(true)}
          onOpenAskAi={() => setIsAskAiOpen(true)}
          onOpenStoryCard={() => setIsStoryCardOpen(true)}
          onOpenQr={() => setIsQrModalOpen(true)}
          onOpenOwnerControls={() => setIsOwnerModalOpen(true)}
          onOpenUpdate={() => setIsUpdateModalOpen(true)}
          onOpenDelete={() => setIsDeleteModalOpen(true)}
        />

        {/* Sticky 7-section navigation */}
        <DashboardSectionNav />

        {/* 01 — Genel Bakış */}
        <DashboardSection id="genel">
          <StatCard
            title="TOPLAM MESAJ"
            value={formatNumber(effectiveMetrics.totalMessages)}
            subtitle={`${effectiveMetrics.daysCount} günlük sohbet dönemi`}
            badge={`${user1.name} & ${user2.name}`}
            isHero={true}
          />
          <OverviewScoreCard
            scores={compatibilityScoresData}
            chatHealth={effectiveMetrics.chatHealth || effectiveMetrics.insightBundle?.chatHealth}
            user1Name={user1.name}
            user2Name={user2.name}
          />
          <ChangeAnalysisCard changeAnalysis={effectiveMetrics.changeAnalysis} />
        </DashboardSection>

        {/* 02 — Kim Nasıl Konuşuyor? */}
        <DashboardSection id="dinamikler">
          <ConversationDynamicsHub
            user1={user1}
            user2={user2}
            totalMessages={effectiveMetrics.totalMessages}
            dynamics={effectiveMetrics.conversationDynamics}
            initiation={effectiveMetrics.initiationStats}
            enhancedResponseTimes={effectiveMetrics.enhancedResponseTimes}
            messageLengthStats={
              effectiveMetrics.messageLengthStats || effectiveMetrics.insightBundle?.messageLength
            }
            userNames={[user1.name, user2.name]}
          />
        </DashboardSection>

        {/* 03 — Zaman */}
        <DashboardSection id="zaman">
          <ActiveHoursChart
            timeDistribution={effectiveMetrics.timeDistribution}
            mostActiveHour={effectiveMetrics.mostActiveHour}
            mostActiveDay={effectiveMetrics.mostActiveDay}
            longestSilenceHours={effectiveMetrics.longestSilenceHours}
            longestSilenceDates={effectiveMetrics.longestSilenceDates}
          />
          <BehaviorTimelineCard
            behaviorTimeline={
              effectiveMetrics.behaviorTimeline || effectiveMetrics.insightBundle?.behaviorTimeline
            }
          />
        </DashboardSection>

        {/* 04 — Duygu & Ton */}
        <DashboardSection id="duygu">
          <SentimentEvolutionCard
            sentiment={sentiment || undefined}
            isLoading={isSentimentLoading}
          />
          <TensionSignalsHub
            conflictAnalysis={
              effectiveMetrics.conflictAnalysis || effectiveMetrics.insightBundle?.conflictAnalysis
            }
            silence={effectiveMetrics.silenceAnalysis}
            signals={effectiveMetrics.insightBundle?.signals}
            toxicityRadar={toxicityRadarData}
            flagsReport={flagsReportData}
            user1={user1}
            user2={user2}
          />
        </DashboardSection>

        {/* 05 — Kelimeler */}
        <DashboardSection id="kelimeler">
          <WordCloudCard words={wordCloudData} />
          <EmojiLeaderboard
            emojis={effectiveMetrics.allTopEmojis}
            user1={user1}
            user2={user2}
          />
          <VocabularyDictionaryCard
            chatDictionary={chatDictionaryData}
            user1={user1}
            user2={user2}
          />
        </DashboardSection>

        {/* 06 — Önemli Anlar */}
        <DashboardSection id="anlar">
          <TimelineHighlightsCard highlights={timelineHighlightsData} />
        </DashboardSection>

        {/* 07 — Eğlence (sinyal tabanlı, hüküm yok) */}
        <DashboardSection id="eglence">
          <RelationshipRolesCard
            sentiment={sentiment || undefined}
            user1={user1}
            user2={user2}
            isLoading={isSentimentLoading}
          />
        </DashboardSection>

      </div>

      {/* [YENİ] Sohbetinle Konuş (AI Asistanı) */}
      <AskChatAiModal
        isOpen={isAskAiOpen}
        onClose={() => setIsAskAiOpen(false)}
        chatId={chatData.id}
        chatTitle={chatData.title}
      />

      {/* [YENİ] QR Kod ile Giriş & Paylaş Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        chatTitle={chatData.title}
        inviteCode={chatData.invite?.invite_code}
        passwordPin={chatData.invite?.password_pin}
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
