'use client';

import React from 'react';
import { Users, MessageSquare, Clock, Smile, Zap, HeartHandshake, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface SampleResultsPreviewProps {
  onOpenDemo: () => void;
  isDemoLoading: boolean;
}

export const SampleResultsPreview: React.FC<SampleResultsPreviewProps> = ({
  onOpenDemo,
  isDemoLoading,
}) => {
  const sampleStats = [
    {
      icon: <Users className="w-5 h-5 text-[#38BDF8]" />,
      value: 'Ayşe %58',
      label: 'Kim Daha Çok Yazıyor',
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-[#38BDF8]" />,
      value: '1.204',
      label: 'Toplam Mesaj',
    },
    {
      icon: <Clock className="w-5 h-5 text-[#38BDF8]" />,
      value: '21:00',
      label: 'En Aktif Saat',
    },
    {
      icon: <Smile className="w-5 h-5 text-[#38BDF8]" />,
      value: '😂 x 89',
      label: 'En Çok Kullanılan Emoji',
    },
    {
      icon: <Zap className="w-5 h-5 text-[#38BDF8]" />,
      value: '4 dk',
      label: 'Ort. Yanıt Süresi',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-[#38BDF8]" />,
      value: '%94',
      label: 'Uyum Skoru & Enerji',
    },
  ];

  return (
    <section id="how-it-works" className="space-y-12 py-10">
      
      {/* 1. How it works Header & 2-Col Cards */}
      <div className="space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white text-center">
          WhatsApp Sohbet Analizi Nasıl Çalışır?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#121519] border border-white/10 space-y-2.5 shadow-soft">
            <h4 className="text-lg font-bold text-[#38BDF8] font-serif">
              Konuşma İstatistiklerinizi Keşfedin
            </h4>
            <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed font-sans">
              <strong className="text-white">WhatsApp mesaj analizi</strong> ile sohbetlerinizin gizli yönlerini ortaya çıkarın. Mesaj sayıları, emoji kullanımı, aktif saatler ve çok daha fazlasını detaylı grafiklerle görselleştirin.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-[#121519] border border-white/10 space-y-2.5 shadow-soft">
            <h4 className="text-lg font-bold text-[#38BDF8] font-serif">
              Güvenli WhatsApp Mesaj Analizi
            </h4>
            <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed font-sans">
              Tüm WhatsApp konuşma istatistikleri tamamen gizli ve güvenli bir şekilde hesaplanır. Ham mesaj metinleriniz hiçbir zaman veritabanında saklanmaz.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Sample Results Section */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#0D1013] border border-white/10 shadow-2xl space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            Analiziniz Böyle Görünecek
          </h3>
          <p className="text-xs sm:text-sm text-[#A3A3A3] font-sans">
            Gerçek bir örnek sohbetten çıkan sonuçlardan bir kesit — sizinki saniyeler içinde hazır.
          </p>
        </div>

        {/* 6 Stat Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
          {sampleStats.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#121519] border border-white/10 hover:border-[#38BDF8]/40 transition-all text-center space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1C2128] border border-white/10 flex items-center justify-center mx-auto text-[#38BDF8] group-hover:scale-105 transition-transform">
                {stat.icon}
              </div>
              <h4 className="text-xl sm:text-2xl font-bold font-mono text-white">
                {stat.value}
              </h4>
              <p className="text-xs text-[#A3A3A3] font-sans">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Big CTA */}
        <div className="text-center pt-2">
          <Button
            variant="blue"
            size="lg"
            onClick={onOpenDemo}
            isLoading={isDemoLoading}
            className="font-bold text-sm sm:text-base px-8 shadow-glow-blue"
          >
            <Sparkles className="w-4 h-4 text-[#0A0A0A]" />
            <span>Tam Örnek Sonucu Gör</span>
          </Button>
        </div>
      </div>

    </section>
  );
};
