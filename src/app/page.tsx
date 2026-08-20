'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play, HelpCircle } from 'lucide-react';
import { getClientOwnerToken } from '@/lib/utils/session';
import { BentoHero } from '@/components/home/BentoHero';
import { UploadAndFeaturesSection } from '@/components/home/UploadAndFeaturesSection';
import { InteractiveFaq } from '@/components/home/InteractiveFaq';
import { HowToExportGuideModal } from '@/components/home/HowToExportGuideModal';
import { CorporateFooter } from '@/components/home/CorporateFooter';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const router = useRouter();
  const [ownerToken, setOwnerToken] = useState<string>('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    const token = getClientOwnerToken();
    setOwnerToken(token);
  }, []);

  const handleUploadSuccess = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const handleCreateDemo = async () => {
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
      }
    } catch (err) {
      console.error('Demo oluşturulamadı:', err);
    } finally {
      setIsDemoLoading(false);
    }
  };

  const scrollToUpload = () => {
    const el = document.getElementById('upload-hub');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openGuide = () => {
    setIsGuideOpen(true);
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
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              type="button"
              onClick={openGuide}
              className="text-xs sm:text-sm text-[#94A3B8] hover:text-[#38BDF8] transition-colors flex items-center gap-1.5 font-medium"
            >
              <HelpCircle className="w-4 h-4 text-[#38BDF8]" />
              <span>Nasıl Dışa Aktarılır? 📱</span>
            </button>
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
        
        {/* 1. Bento Hero Section (with Embedded Live Phone Simulator) */}
        <BentoHero
          onUploadClick={scrollToUpload}
          onDemoClick={handleCreateDemo}
          onOpenGuide={() => setIsGuideOpen(true)}
          isDemoLoading={isDemoLoading}
        />

        {/* 2. Side-by-Side: Yükleme (Solda) + Özellikler (Sağda) */}
        <UploadAndFeaturesSection
          ownerToken={ownerToken}
          isLimitReached={false}
          onSuccess={handleUploadSuccess}
          onOpenLimitModal={() => {}}
          onOpenGuide={() => setIsGuideOpen(true)}
        />

        {/* 4. Interactive Accordion FAQ */}
        <InteractiveFaq />

      </div>

      {/* 3-Step WhatsApp Export Guide Modal */}
      <HowToExportGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onReadyToUpload={scrollToUpload}
      />

      {/* Corporate & Legal Footer */}
      <CorporateFooter onOpenGuide={() => setIsGuideOpen(true)} />

    </main>
  );
}
