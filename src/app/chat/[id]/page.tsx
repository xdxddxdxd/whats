'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ShieldAlert, ArrowLeft, Heart } from 'lucide-react';
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
import { AISentimentResult, DeterministicMetrics } from '@/types/chat';

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

      const res = await fetch(`/api/chats/${chatId}?${queryParams.toString()}`, {
        headers: {
          ...(clientOwnerToken ? { 'x-owner-token': clientOwnerToken } : {}),
          ...(guestToken ? { 'x-guest-token': guestToken } : {})
        }
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.isRevoked) {
          setIsRevoked(true);
        }
        throw new Error(data.error || 'Sohbet yüklenemedi.');
      }

      setChatData(data.chat);
      setAnalysisData(data.analysis);
      setIsOwner(data.isOwner);

      // Process deterministic metrics immediately
      if (data.analysis?.metrics) {
        const formatted = formatDeterministicMetrics(data.analysis.metrics);
        setMetrics(formatted);
      } else {
        // Fallback to rich mock deterministic metrics
        setMetrics({
          totalMessages: chatAnalyticsData.summary.totalMessages,
          startDate: chatAnalyticsData.summary.startDate,
          endDate: chatAnalyticsData.summary.endDate,
          daysCount: chatAnalyticsData.summary.daysCount,
          dailyAverage: chatAnalyticsData.summary.dailyAverage,
          longestSilenceHours: chatAnalyticsData.summary.longestSilenceHours,
          longestSilenceDates: chatAnalyticsData.summary.longestSilenceDates,
          mostActiveHour: chatAnalyticsData.summary.mostActiveHour,
          mostActiveDay: chatAnalyticsData.summary.mostActiveDay,
          mostActiveDate: chatAnalyticsData.summary.mostActiveDate,
          timeDistribution: chatAnalyticsData.timeDistribution,
          users: chatAnalyticsData.users,
          allTopEmojis: chatAnalyticsData.allTopEmojis
        });
      }

      // Check if sentiment already cached
      if (data.analysis?.sentiment) {
        setSentiment(data.analysis.sentiment);
        setIsSentimentLoading(false);
      } else {
        // Fetch AI Sentiment progressively in background
        fetchSentiment(chatId, data.chat?.title);
      }
    } catch (err: any) {
      setError(err.message || 'Veriler alınırken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  const fetchSentiment = async (id: string, title?: string) => {
    setIsSentimentLoading(true);
    try {
      const res = await fetch('/api/analyze-sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: id, chatTitle: title })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.sentiment) {
          setSentiment(data.sentiment);
        }
      }
    } catch (err) {
      console.warn('Sentiment fetching fallback:', err);
      // Ensure fallback sentiment is applied
      setSentiment(chatAnalyticsData.sentiment || null);
    } finally {
      setIsSentimentLoading(false);
    }
  };

  useEffect(() => {
    fetchChatDetails();
  }, [fetchChatDetails]);

  const handleReAnalyze = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-owner-token': ownerToken
        },
        body: JSON.stringify({ owner_token: ownerToken })
      });
      if (res.ok) {
        await fetchChatDetails();
      }
    } catch (err) {
      console.error('Yeniden analiz hatası:', err);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center text-slate-900 font-sans">
        <div className="w-16 h-16 rounded-3xl bg-white border border-sky-200 flex items-center justify-center mb-4 text-3xl font-emoji shadow-sm animate-pulse">
          ✨
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Sohbet Analizi Hazırlanıyor...
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-sans">
          Mesajlar, emojiler ve zaman ritimleri hesaplanıyor.
        </p>
      </div>
    );
  }

  // Access Revoked State
  if (isRevoked) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center text-slate-900 font-sans">
        <div className="max-w-md bg-white p-8 rounded-[28px] border border-red-200 shadow-sm">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Erişiminiz Sınırlandırıldı
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Bu sohbete olan erişiminiz sohbet sahibi tarafından kaldırılmıştır.
          </p>
          <div className="mt-6">
            <Link href="/">
              <Button variant="primary">
                <ArrowLeft className="w-4 h-4" />
                <span>Ana Sayfaya Dön</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // General Error
  if (error || !chatData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center text-slate-900 font-sans">
        <div className="max-w-md bg-white p-8 rounded-[28px] border border-slate-200 shadow-sm">
          <div className="text-4xl mb-3 font-emoji">🔍</div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Sohbet Bulunamadı veya Yetkiniz Yok
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {error || 'Bu sohbeti görüntülemek için geçerli bir davet bağlantısına ve şifreye ihtiyacınız var.'}
          </p>
          <div className="mt-6">
            <Link href="/">
              <Button variant="primary">
                <ArrowLeft className="w-4 h-4" />
                <span>Ana Sayfaya Dön</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const user1 = metrics?.users?.user1 || chatAnalyticsData.users.user1;
  const user2 = metrics?.users?.user2 || chatAnalyticsData.users.user2;
  const wrappedSlides = analysisData?.wrapped_slides || [];

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
          onOpenOwnerControls={() => setIsOwnerModalOpen(true)}
          onOpenUpdate={() => setIsUpdateModalOpen(true)}
          onOpenDelete={() => setIsDeleteModalOpen(true)}
        />

        {/* 2. Toplam Mesaj Büyük Metrik Kartı */}
        {metrics && (
          <StatCard
            title="TOPLAM MESAJ"
            value={formatNumber(metrics.totalMessages)}
            subtitle={`${metrics.daysCount} günlük sohbet dönemi`}
            badge={`${user1.name} & ${user2.name}`}
            isHero={true}
          />
        )}

        {/* 3. Kim Daha Çok Yazıyor? (Katılımcı Dağılımı ve Efor Dengesi) */}
        {metrics && (
          <MessageDistributionCard
            user1={user1}
            user2={user2}
            totalMessages={metrics.totalMessages}
            startDate={metrics.startDate}
            endDate={metrics.endDate}
          />
        )}

        {/* 4. Zaman Analizi & Aktivite Grafikleri */}
        {metrics && (
          <ActiveHoursChart
            timeDistribution={metrics.timeDistribution}
            mostActiveHour={metrics.mostActiveHour}
            mostActiveDay={metrics.mostActiveDay}
            longestSilenceHours={metrics.longestSilenceHours}
            longestSilenceDates={metrics.longestSilenceDates}
          />
        )}

        {/* 5. İletişim Dinamikleri & Yanıt Hızları */}
        {metrics && (
          <CommunicationDynamicsCard
            user1={user1}
            user2={user2}
            longestSilenceHours={metrics.longestSilenceHours}
            longestSilenceDates={metrics.longestSilenceDates}
          />
        )}

        {/* 6. Emoji Analizi & Sıralaması */}
        {metrics && (
          <EmojiLeaderboard
            emojis={metrics.allTopEmojis}
            user1={user1}
            user2={user2}
          />
        )}

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

      </div>

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
