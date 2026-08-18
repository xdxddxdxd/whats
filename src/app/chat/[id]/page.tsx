'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ShieldAlert, ArrowLeft, Award, BarChart3 } from 'lucide-react';
import { getClientOwnerToken, getClientGuestSession } from '@/lib/utils/session';
import { formatNumber } from '@/lib/utils/formatters';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { SuperlativeCard } from '@/components/dashboard/SuperlativeCard';
import { ActiveHoursChart } from '@/components/dashboard/ActiveHoursChart';
import { DailyActivityChart } from '@/components/dashboard/DailyActivityChart';
import { EmojiLeaderboard } from '@/components/dashboard/EmojiLeaderboard';
import { ParticipantList } from '@/components/dashboard/ParticipantList';
import { OwnerControlModal } from '@/components/dashboard/OwnerControlModal';
import { IncrementalUpdateModal } from '@/components/dashboard/IncrementalUpdateModal';
import { DeleteChatModal } from '@/components/dashboard/DeleteChatModal';
import { WrappedViewer } from '@/components/wrapped/WrappedViewer';
import { WrappedPdfExporter } from '@/components/wrapped/WrappedPdfExporter';
import { Button } from '@/components/ui/Button';

export default function ChatDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;

  const [chatData, setChatData] = useState<any | null>(null);
  const [analysisData, setAnalysisData] = useState<any | null>(null);
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

      const res = await fetch(`/api/chats/${chatId}?${queryParams.toString()}`);
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
    } catch (err: any) {
      setError(err.message || 'Veriler alınırken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchChatDetails();
  }, [fetchChatDetails]);

  const handleReAnalyze = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      <div className="min-h-screen bg-[#07090C] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="text-4xl animate-bounce mb-3 font-emoji">🍿✨</div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Sohbet Analizi Hazırlanıyor...
        </h2>
        <p className="text-xs text-[#94A3B8] mt-1 font-sans">
          Mesajlar, emojiler ve kişilik unvanları hesaplanıyor.
        </p>
      </div>
    );
  }

  // Access Revoked State
  if (isRevoked) {
    return (
      <div className="min-h-screen bg-[#07090C] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="max-w-md bg-[#11141A] p-8 rounded-3xl border border-red-800/60 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Erişiminiz Sınırlandırıldı
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 leading-relaxed">
            Bu sohbete olan erişiminiz sohbet sahibi tarafından kaldırılmıştır. Yeniden erişim sağlamak için sohbet sahibiyle iletişime geçebilirsiniz.
          </p>
          <div className="mt-6">
            <Link href="/">
              <Button variant="blue">
                <ArrowLeft className="w-4 h-4" />
                <span>Ana Sayfaya Dön</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // General Error / Not Found
  if (error || !chatData) {
    return (
      <div className="min-h-screen bg-[#07090C] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="max-w-md bg-[#11141A] p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="text-4xl mb-3 font-emoji">🔍</div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Sohbet Bulunamadı veya Yetkiniz Yok
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 leading-relaxed">
            {error || 'Bu sohbeti görüntülemek için geçerli bir davet bağlantısına ve şifreye ihtiyacınız var.'}
          </p>
          <div className="mt-6">
            <Link href="/">
              <Button variant="blue">
                <ArrowLeft className="w-4 h-4" />
                <span>Ana Sayfaya Dön</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const metrics = analysisData?.metrics || null;
  const superlatives = analysisData?.superlatives || [];
  const wrappedSlides = analysisData?.wrapped_slides || [];

  return (
    <main className="min-h-screen bg-[#07090C] text-white pb-24 selection:bg-[#38BDF8]/30 font-sans relative overflow-hidden">
      
      {/* Background Subtle Glows */}
      <div className="absolute top-0 left-1/3 w-[800px] h-[400px] bg-[#0284C7]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <DashboardHeader
        chat={chatData}
        onOpenWrapped={() => setIsWrappedOpen(true)}
        onOpenPdf={() => setIsPdfOpen(true)}
        onOpenOwnerControls={() => setIsOwnerModalOpen(true)}
        onOpenUpdate={() => setIsUpdateModalOpen(true)}
        onOpenDelete={() => setIsDeleteModalOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10 relative z-10">
        
        {/* Top Summary Banner: Elevated Spotlight Card */}
        {analysisData?.ai_summary && (
          <div className="p-6 sm:p-7 rounded-3xl bg-[#11141A] border border-white/10 shadow-glow-blue flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent opacity-80" />
            
            <div className="flex items-start gap-4">
              <span className="w-12 h-12 rounded-2xl bg-[#0284C7]/20 border border-[#38BDF8]/30 text-[#38BDF8] flex items-center justify-center text-2xl font-emoji shrink-0 shadow-glow-blue">
                ✨
              </span>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                  GRUP ÖZETİ & VIBE CHECK
                </span>
                <p className="text-sm sm:text-base text-white/95 font-sans font-medium leading-relaxed max-w-3xl">
                  {analysisData.ai_summary}
                </p>
              </div>
            </div>

            <Button
              variant="blue"
              size="md"
              onClick={() => setIsWrappedOpen(true)}
              className="shrink-0 font-bold text-xs sm:text-sm shadow-glow-blue"
            >
              <Sparkles className="w-4 h-4 text-[#07090C]" />
              <span>Wrapped Story'yi İzle</span>
            </Button>
          </div>
        )}

        {/* 1. Key Stat Cards */}
        {metrics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Toplam Mesaj"
              value={formatNumber(metrics.totalMessages)}
              subtitle={`${metrics.daysSpan} günde paylaşıldı`}
              emoji="💬"
            />
            <StatCard
              title="En Çok Konuşan"
              value={metrics.participants?.[0]?.name || '-'}
              subtitle={`Toplamın %${metrics.participants?.[0]?.messagePercentage || 0}'i`}
              emoji="👑"
            />
            <StatCard
              title="En Alevli Saat"
              value={metrics.peakHour?.label || '-'}
              subtitle={`${formatNumber(metrics.peakHour?.count || 0)} mesaj`}
              emoji="⏰"
            />
            <StatCard
              title="Toplam Emoji"
              value={formatNumber(metrics.totalEmojis)}
              subtitle={`En popüler: ${metrics.topEmojis?.[0]?.emoji || '🔥'}`}
              emoji="🎭"
            />
          </div>
        )}

        {/* 2. Superlatives / Kişilik Kartları */}
        {superlatives.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#38BDF8]" />
                  <span>Grup Kişilik Ödülleri (Superlatives)</span>
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5 font-sans">
                  Sohbet dinamiklerine göre yapay zeka tarafından belirlenen unvanlar
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {superlatives.map((card: any, idx: number) => (
                <SuperlativeCard
                  key={card.id || idx}
                  card={card}
                  index={idx}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. Activity Charts (24-Hour & Days) */}
        {metrics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActiveHoursChart
              data={metrics.hourlyDistribution || []}
              peakHour={metrics.peakHour?.hour || 0}
            />
            <DailyActivityChart
              data={metrics.dailyDistribution || []}
              peakDay={metrics.peakDay?.dayName || 'Cuma'}
            />
          </div>
        )}

        {/* 4. Emoji Leaderboard */}
        {metrics && (
          <EmojiLeaderboard
            emojis={metrics.topEmojis || []}
            totalEmojis={metrics.totalEmojis || 0}
          />
        )}

        {/* 5. Detailed Participant Table */}
        {metrics?.participants && (
          <ParticipantList participants={metrics.participants} />
        )}

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
