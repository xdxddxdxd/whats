'use client';

import React from 'react';
import { Sparkles, Shield, RefreshCw, Trophy, FileDown, CheckCircle2 } from 'lucide-react';

export const BentoFeatures: React.FC = () => {
  return (
    <section id="features" className="space-y-8 py-8">
      
      {/* Section Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono font-bold tracking-widest text-[#38BDF8] uppercase px-3 py-1 rounded-full bg-white/5 border border-white/10">
          ÖZEL YETENEKLER
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Sıradan bir analiz aracı değil, <br />
          <span className="text-[#38BDF8]">arkadaş grubunuzun yıllık hafızası.</span>
        </h2>
      </div>

      {/* Bento Grid (2x2 Asymmetric) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Bento 1: Story & Wrapped Mode (Col span 7) */}
        <div className="md:col-span-7 p-7 sm:p-8 rounded-3xl bg-[#11141A] border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
          <div className="space-y-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-[#0284C7]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Spotify Wrapped Tarzı Tam Ekran Story Deneyimi
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md leading-relaxed font-sans">
              Arkadaş grubunuzun en alevli saatlerini, rekor mesaj sayılarını ve en çok kullanılan emojilerini Instagram Story akışında izleyin veya tek tıkla PDF albümü olarak indirin.
            </p>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-[#0B0D11] border border-white/10 space-y-2 relative z-10">
            <div className="flex items-center justify-between text-xs text-[#94A3B8]">
              <span className="text-[#38BDF8] font-bold font-mono">WRAPPED 2026</span>
              <span className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
                <FileDown className="w-3.5 h-3.5 text-[#38BDF8]" /> Yüksek Çözünürlüklü PDF
              </span>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <div className="h-1 flex-1 bg-[#38BDF8] rounded-full" />
              <div className="h-1 flex-1 bg-[#38BDF8] rounded-full" />
              <div className="h-1 flex-1 bg-[#38BDF8] rounded-full" />
              <div className="h-1 flex-1 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Bento 2: Superlative Kişilik Ödülleri (Col span 5) */}
        <div className="md:col-span-5 p-7 sm:p-8 rounded-3xl bg-[#11141A] border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0284C7]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Grup Kişilik Ödülleri
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-sans">
              Algoritmalarımız kimin gece kuşu olduğunu, kimin hayalete dönüştüğünü ve kimin paragraflarla yazdığını tek tek hesaplar.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#0B0D11] border border-white/5 text-center">
              <span className="text-lg block font-emoji">🦉</span>
              <span className="text-white font-bold text-[11px] block mt-0.5">Gece Kuşu</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0B0D11] border border-white/5 text-center">
              <span className="text-lg block font-emoji">👻</span>
              <span className="text-white font-bold text-[11px] block mt-0.5">Grup Hayaleti</span>
            </div>
          </div>
        </div>

        {/* Bento 3: Sıfır Veri Saklama & Gizlilik (Col span 5) */}
        <div className="md:col-span-5 p-7 sm:p-8 rounded-3xl bg-[#11141A] border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0284C7]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Sıfır Metin Saklama
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-sans">
              Ham mesaj metinleri asla veritabanında tutulmaz. Sadece sayısal metrikler ve anonim unvanlar işlenir.
            </p>
          </div>

          <div className="mt-5 p-3 rounded-2xl bg-[#0B0D11] border border-white/5 flex items-center gap-2.5 text-xs text-[#38BDF8]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="text-[11px]">Şifreli Davet Linki & Yetkili Giriş</span>
          </div>
        </div>

        {/* Bento 4: Artımlı Güncelleme (Col span 7) */}
        <div className="md:col-span-7 p-7 sm:p-8 rounded-3xl bg-[#11141A] border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0284C7]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Artımlı Analiz (Incremental Delta Tracker)
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md leading-relaxed font-sans">
              Aylar sonra yeni bir WhatsApp export'u yüklediğinizde sıfırdan başlamanıza gerek yok. Sistemimiz eski mesajları tanır, yalnızca yeni eklenen mesajları analiz eder.
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0D11] border border-white/5 text-xs">
            <span className="text-[#94A3B8]">Daha Önceki Analiz: <strong>1.420 Mesaj</strong></span>
            <span className="text-[#38BDF8] font-bold font-mono">+ 650 Yeni Mesaj</span>
          </div>
        </div>

      </div>

    </section>
  );
};
