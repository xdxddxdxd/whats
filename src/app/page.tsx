'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Copy, Check } from 'lucide-react';
import { getClientOwnerToken } from '@/lib/utils/session';
import { BentoHero } from '@/components/home/BentoHero';
import { UploadAndFeaturesSection } from '@/components/home/UploadAndFeaturesSection';
import { InteractiveFaq } from '@/components/home/InteractiveFaq';
import { ChatList } from '@/components/home/ChatList';
import { LimitWarningModal } from '@/components/home/LimitWarningModal';
import { DeleteChatModal } from '@/components/dashboard/DeleteChatModal';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const router = useRouter();
  const [ownerToken, setOwnerToken] = useState<string>('');
  const [chats, setChats] = useState<any[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    const token = getClientOwnerToken();
    setOwnerToken(token);
    fetchChats(token);
  }, []);

  const fetchChats = async (token: string) => {
    if (!token) return;
    setIsLoadingChats(true);
    try {
      const res = await fetch(`/api/chats?owner_token=${token}`);
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats || []);
      }
    } catch (err) {
      console.error('Sohbetler alınamadı:', err);
    } finally {
      setIsLoadingChats(false);
    }
  };

  const handleUploadSuccess = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const handleCreateDemo = async () => {
    if (chats.length >= 2) {
      setIsLimitModalOpen(true);
      return;
    }

    setIsDemoLoading(true);
    try {
      const res = await fetch('/api/chats/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner_token: ownerToken })
      });

      const data = await res.json();

      if (res.ok && data.chat?.id) {
        router.push(`/chat/${data.chat.id}`);
      } else if (data.limitReached) {
        setIsLimitModalOpen(true);
      }
    } catch (err) {
      console.error('Demo oluşturulamadı:', err);
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleCopyKey = () => {
    if (ownerToken) {
      navigator.clipboard.writeText(ownerToken);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const scrollToUpload = () => {
    const el = document.getElementById('upload-hub');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[#07090C] text-white selection:bg-[#38BDF8]/30 font-sans relative overflow-hidden">
      
      {/* Background Subtle Radial Backdrops */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#0284C7]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[800px] -right-40 w-[600px] h-[600px] bg-[#38BDF8]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-[#07090C]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#0284C7] text-white flex items-center justify-center font-emoji text-base shadow-glow-blue">
              💬
            </span>
            <span className="font-bold text-xl tracking-tight text-white">
              WHATS <span className="text-[#38BDF8] font-sans text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10">2026</span>
            </span>
          </div>

          {/* Nav Links & Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="#upload-hub"
              className="text-xs sm:text-sm text-[#94A3B8] hover:text-white transition-colors hidden md:inline"
            >
              Özellikler & Yükle
            </a>
            <a
              href="#faq"
              className="text-xs sm:text-sm text-[#94A3B8] hover:text-white transition-colors hidden md:inline"
            >
              SSS
            </a>

            <Button
              variant="wrapped"
              size="sm"
              onClick={handleCreateDemo}
              isLoading={isDemoLoading}
              className="text-xs hidden sm:inline-flex"
            >
              <Play className="w-3 h-3 text-[#38BDF8] fill-[#38BDF8]" />
              <span>Örnek Sohbet</span>
            </Button>

            <Button
              variant="blue"
              size="sm"
              onClick={scrollToUpload}
              className="font-bold text-xs sm:text-sm shadow-glow-blue"
            >
              <span>Sohbeti Yükle</span>
            </Button>
          </div>

        </div>
      </header>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28 relative z-10">
        
        {/* 1. Bento Hero Section */}
        <BentoHero
          onUploadClick={scrollToUpload}
          onDemoClick={handleCreateDemo}
          isDemoLoading={isDemoLoading}
        />

        {/* 2. Side-by-Side: Yükleme (Solda) + Özellikler (Sağda) */}
        <UploadAndFeaturesSection
          ownerToken={ownerToken}
          isLimitReached={chats.length >= 2}
          onSuccess={handleUploadSuccess}
          onOpenLimitModal={() => setIsLimitModalOpen(true)}
        />

        {/* 3. Saved Chats Section (if any exists) */}
        {chats.length > 0 && (
          <section className="p-6 sm:p-8 rounded-3xl bg-[#11141A] border border-white/10 space-y-6">
            <ChatList
              chats={chats}
              onDeleteClick={(chat) => setDeleteTarget(chat)}
            />

            {/* Owner Key Recovery */}
            <div className="p-4 bg-[#0B0D11] rounded-2xl border border-white/10 text-center max-w-md mx-auto">
              <p className="text-[11px] text-[#94A3B8]">
                🔑 <strong>Yönetici Anahtarınız:</strong> Tarayıcınızda kayıtlıdır. Farklı cihazda sohbetlerinizi açmak için kopyalayabilirsiniz.
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-[10px] font-mono bg-[#161B22] px-2.5 py-1 rounded text-[#38BDF8] border border-white/10 truncate max-w-[200px]">
                  {ownerToken}
                </span>
                <button
                  onClick={handleCopyKey}
                  className="text-[11px] font-semibold text-[#38BDF8] hover:underline flex items-center gap-1"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 4. Interactive Accordion FAQ */}
        <InteractiveFaq />

      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050608] py-12 mt-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-sm text-white">WHATS</span>
            <span>✦ WhatsApp Sohbet Analiz & Yıllık Özet (Wrapped)</span>
          </div>
          <p>© 2026 WHATS. Arkadaş grupları için tasarlanmıştır.</p>
        </div>
      </footer>

      {/* Limit Modal */}
      <LimitWarningModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteChatModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          chatId={deleteTarget.id}
          chatTitle={deleteTarget.title}
          ownerToken={ownerToken}
          onSuccess={() => fetchChats(ownerToken)}
        />
      )}

    </main>
  );
}
