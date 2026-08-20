'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Apple,
  Share2,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  MoreVertical,
  Play,
  RotateCcw,
  Zap,
  ShieldCheck,
  FileText,
  UploadCloud,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface InteractivePhoneGuideProps {
  onUploadClick?: () => void;
}

export const InteractivePhoneGuide: React.FC<InteractivePhoneGuideProps> = ({ onUploadClick }) => {
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const steps = [
    {
      id: 0,
      badge: '1. Adım',
      title: 'Sohbet Detayına Dokunun',
      desc: platform === 'ios'
        ? 'WhatsApp\'ta grup veya kişi isminin olduğu üst bara dokunarak Sohbet Bilgisi ekranına geçin.'
        : 'Sağ üst köşedeki üç nokta (⋮) simgesine dokunun ve menüyü açın.',
      actionHint: platform === 'ios' ? 'Üst başlığa tıklandı 👆' : 'Üç noktaya (⋮) basıldı 👆',
    },
    {
      id: 1,
      badge: '2. Adım',
      title: 'Sohbeti Dışa Aktar',
      desc: platform === 'ios'
        ? 'Açılan sayfanın en altına kaydırın ve "Sohbeti Dışa Aktar" butonuna dokunun.'
        : '"Diğer" seçeneğine, ardından "Sohbeti Dışa Aktar"a dokunun.',
      actionHint: 'Dışa Aktar seçildi 🚀',
    },
    {
      id: 2,
      badge: '3. Adım',
      title: '"Medyasız" Seçeneğini İşaretleyin',
      desc: 'Çıkan popup menüde mutlaka "Medyasız" (Attach Without Media) seçeneğini seçin. Bu sayede yalnızca hızlı ve güvenli metin dosyası (.txt/.zip) alınır.',
      actionHint: 'Medyasız seçildi (Sıfır Medya) 🛡️',
    },
    {
      id: 3,
      badge: '4. Adım',
      title: 'WHATS\'a Yükleyin & Wrapped Başlasın!',
      desc: 'Oluşan dosyayı WHATS yükleme kutusuna sürükleyin veya dosya seçiciyle yükleyin. Yapay zeka analizi saniyeler içinde başlar!',
      actionHint: 'Analiz Başlatılıyor! 🎉',
    },
  ];

  // Auto-play loop
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4200);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  return (
    <section className="relative rounded-3xl bg-gradient-to-b from-[#0F1318] via-[#0B0D11] to-[#07090C] border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#0284C7]/20 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#38BDF8]/30 shadow-glow-blue">
          <Smartphone className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="text-[11px] font-mono font-bold text-[#7DD3FC] uppercase tracking-wider">
            İnteraktif Görsel Rehber
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          WhatsApp'tan Nasıl Çıktı Alınır? 📱
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
          Aşağıdaki canlı telefon simülatöründe <strong>{platform === 'ios' ? 'iPhone (iOS)' : 'Android'}</strong> üzerinde medyasız sohbet çıktısı alma adımlarını adım adım izleyin.
        </p>

        {/* Platform Tabs & Play/Pause Controls */}
        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
          <div className="inline-flex p-1 rounded-2xl bg-[#161B22] border border-white/10">
            <button
              type="button"
              onClick={() => {
                setPlatform('ios');
                setCurrentStep(0);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                platform === 'ios'
                  ? 'bg-[#0284C7] text-white shadow-glow-blue'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>iPhone (iOS)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPlatform('android');
                setCurrentStep(0);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                platform === 'android'
                  ? 'bg-emerald-600 text-white shadow-glow-emerald'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#94A3B8] hover:text-white transition-all flex items-center gap-1.5"
          >
            {isPlaying ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Otomatik Oynatılıyor</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#38BDF8]" />
                <span>Oynat</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Left Step Timeline, Right Phone Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 max-w-6xl mx-auto">
        
        {/* LEFT: Step Progress & Detailed Cards */}
        <div className="lg:col-span-6 space-y-3.5 order-2 lg:order-1">
          {steps.map((s, idx) => {
            const isActive = currentStep === idx;
            return (
              <motion.div
                key={s.id}
                onClick={() => {
                  setCurrentStep(idx);
                  setIsPlaying(false);
                }}
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border relative overflow-hidden ${
                  isActive
                    ? 'bg-[#161B22] border-[#38BDF8] shadow-glow-blue/20 translate-x-1'
                    : 'bg-[#0E1116] border-white/5 hover:border-white/15 opacity-70 hover:opacity-100'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#38BDF8]"
                  />
                )}

                <div className="flex items-start gap-3.5 pl-1.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#0284C7] text-white shadow-glow-blue'
                        : 'bg-white/5 text-[#94A3B8]'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-[#94A3B8]'}`}>
                        {s.title}
                      </h4>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30'
                            : 'bg-white/5 text-[#64748B]'
                        }`}
                      >
                        {s.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Quick CTA */}
          <div className="pt-3 flex items-center gap-3">
            {onUploadClick && (
              <Button
                variant="blue"
                size="md"
                onClick={onUploadClick}
                className="font-bold text-xs shadow-glow-blue w-full sm:w-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Hazırım, Hemen Yükle</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}

            <div className="text-[11px] text-[#64748B] font-mono flex items-center gap-1.5 hidden sm:flex">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sıfır Medya • 5 Saniyede Analiz</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Realistic Phone Simulator */}
        <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
          
          {/* Phone Outer Chassis */}
          <div className="w-[300px] sm:w-[330px] h-[580px] sm:h-[620px] rounded-[44px] bg-[#1E232B] p-3 shadow-2xl border-4 border-[#333C4A] relative">
            
            {/* Volume / Power Buttons Mock */}
            <div className="absolute -left-[7px] top-24 w-[3px] h-9 bg-[#4B5563] rounded-l-md" />
            <div className="absolute -left-[7px] top-36 w-[3px] h-12 bg-[#4B5563] rounded-l-md" />
            <div className="absolute -right-[7px] top-28 w-[3px] h-14 bg-[#4B5563] rounded-r-md" />

            {/* Phone Screen Inner */}
            <div className="w-full h-full rounded-[36px] bg-[#0B141A] overflow-hidden flex flex-col relative text-white select-none border border-white/5">
              
              {/* Dynamic Island / Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-end px-2">
                <div className="w-2 h-2 rounded-full bg-[#1A2530]" />
              </div>

              {/* Status Bar */}
              <div className="h-10 bg-[#1F2C34] pt-2 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-300 z-20">
                <span>09:41</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Phone Content Screen Views by Step */}
              <div className="flex-1 relative overflow-hidden bg-[#0B141A] flex flex-col">
                <AnimatePresence mode="wait">
                  
                  {/* STEP 0: WhatsApp Chat Screen */}
                  {currentStep === 0 && (
                    <motion.div
                      key="step-0"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col justify-between"
                    >
                      {/* WhatsApp Header */}
                      <div className="bg-[#1F2C34] p-3 flex items-center justify-between border-b border-white/5 relative">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-sm font-emoji">
                            🍕
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white flex items-center gap-1">
                              Hafta Sonu Çetesi 🍕
                            </h5>
                            <span className="text-[10px] text-slate-400">Ahmet, Selin, Doğukan, Elif...</span>
                          </div>
                        </div>

                        {platform === 'android' ? (
                          <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 animate-bounce">
                            <MoreVertical className="w-4 h-4" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-400/30 animate-pulse">
                            Detaya Dokun 👆
                          </span>
                        )}

                        {/* Finger Tap Ripple on Header for iOS */}
                        {platform === 'ios' && (
                          <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.2 }}
                            className="absolute top-4 left-24 w-6 h-6 rounded-full bg-sky-400/40 border border-sky-300 pointer-events-none"
                          />
                        )}
                      </div>

                      {/* Chat Bubbles */}
                      <div className="p-3 space-y-2.5 flex-1 bg-[#0B141A] text-xs font-sans">
                        <div className="bg-[#1F2C34] p-2.5 rounded-2xl rounded-tl-none max-w-[80%] space-y-0.5 shadow-sm">
                          <span className="text-[10px] text-orange-400 font-bold">Ahmet</span>
                          <p className="text-[11px] text-slate-200">Akşam halı saha kesin mi beyler?</p>
                          <span className="text-[9px] text-slate-400 block text-right">21:14</span>
                        </div>

                        <div className="bg-[#005C4B] p-2.5 rounded-2xl rounded-tr-none max-w-[80%] ml-auto space-y-0.5 shadow-sm">
                          <p className="text-[11px] text-white">Kadroyu kurdum, 22:00'de oradayız 🔥</p>
                          <span className="text-[9px] text-emerald-200 block text-right">21:15 ✓✓</span>
                        </div>

                        <div className="bg-[#1F2C34] p-2.5 rounded-2xl rounded-tl-none max-w-[80%] space-y-0.5 shadow-sm">
                          <span className="text-[10px] text-pink-400 font-bold">Selin</span>
                          <p className="text-[11px] text-slate-200">tm</p>
                          <span className="text-[9px] text-slate-400 block text-right">21:16</span>
                        </div>
                      </div>

                      {/* Step Indicator Banner */}
                      <div className="p-3 bg-[#1F2C34] border-t border-white/10 text-center">
                        <span className="text-[11px] font-bold text-[#38BDF8]">
                          1. Adım: {platform === 'ios' ? 'Grup Başlığına Dokunun' : 'Sağ Üstteki ⋮ Menüsüne Basın'}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 1: Group Info / Export Button */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col justify-between p-3 space-y-3 bg-[#111B21]"
                    >
                      <div className="space-y-3 pt-2">
                        {/* Profile Header */}
                        <div className="text-center space-y-1">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 mx-auto flex items-center justify-center text-2xl">
                            🍕
                          </div>
                          <h4 className="text-xs font-bold text-white">Hafta Sonu Çetesi</h4>
                          <p className="text-[10px] text-slate-400">Grup • 8 Katılımcı</p>
                        </div>

                        {/* Dummy Settings List */}
                        <div className="bg-[#1F2C34] rounded-2xl p-2.5 space-y-2 text-xs text-slate-300">
                          <div className="flex items-center justify-between pb-1.5 border-b border-white/5 text-[11px]">
                            <span>Medyalar, Bağlantılar ve Belgeler</span>
                            <span className="text-[10px] text-slate-400">142 ➔</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span>Süreli Mesajlar</span>
                            <span className="text-[10px] text-slate-400">Kapalı</span>
                          </div>
                        </div>

                        {/* Highlighted Export Button */}
                        <div className="relative">
                          <div className="p-3 rounded-2xl bg-[#0284C7]/20 border-2 border-[#38BDF8] text-white flex items-center justify-between shadow-glow-blue">
                            <div className="flex items-center gap-2">
                              <Share2 className="w-4 h-4 text-[#38BDF8]" />
                              <span className="text-xs font-bold text-white">Sohbeti Dışa Aktar</span>
                            </div>
                            <span className="text-[10px] font-mono text-[#38BDF8] font-bold">BURAYA DOKUN 👆</span>
                          </div>

                          {/* Ripple Animation */}
                          <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 1.8, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.2 }}
                            className="absolute inset-0 rounded-2xl border-2 border-sky-300 pointer-events-none"
                          />
                        </div>
                      </div>

                      <div className="p-2.5 bg-[#1F2C34] rounded-xl text-center">
                        <span className="text-[11px] font-bold text-amber-400">
                          2. Adım: "Sohbeti Dışa Aktar" Seçeneğine Basın
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Media-less Popup Choice */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col justify-end p-4 bg-black/70 backdrop-blur-sm relative"
                    >
                      {/* Floating Modal Prompt */}
                      <div className="bg-[#222E35] rounded-3xl p-4 border border-white/10 shadow-2xl space-y-3 text-center mb-6">
                        <div className="w-9 h-9 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
                          <Share2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">Medyalar Eklensin mi?</h5>
                          <p className="text-[10px] text-slate-300 mt-0.5">
                            Medya eklemek sohbet dışa aktarma boyutunu artırır.
                          </p>
                        </div>

                        <div className="space-y-2 pt-1">
                          {/* WRONG OPTION */}
                          <div className="p-2.5 rounded-xl bg-white/5 text-slate-400 text-xs line-through opacity-50">
                            Medyayı Ekle (Gereksiz & Yavaş)
                          </div>

                          {/* RIGHT OPTION */}
                          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs flex items-center justify-between shadow-glow-emerald border border-emerald-300">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" />
                              Medyasız (Attach Without Media)
                            </span>
                            <span className="text-[10px] font-mono bg-black/30 px-2 py-0.5 rounded-full">
                              DOĞRU SEÇİM ✓
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-[#1F2C34] rounded-xl text-center">
                        <span className="text-[11px] font-bold text-emerald-400">
                          3. Adım: Mutlaka "Medyasız" Seçeneğini Seçin!
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Upload to WHATS Animation */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col justify-between p-4 bg-gradient-to-b from-[#07090C] to-[#0E131A] text-center"
                    >
                      <div className="my-auto space-y-4">
                        {/* Flying File to Cloud Icon */}
                        <div className="relative w-20 h-20 mx-auto">
                          <motion.div
                            animate={{ y: [-4, 4, -4] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-20 h-20 rounded-3xl bg-[#0284C7] text-white flex items-center justify-center shadow-glow-blue text-3xl"
                          >
                            📁
                          </motion.div>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#38BDF8] text-black font-black text-xs flex items-center justify-center shadow-md"
                          >
                            ✓
                          </motion.div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white">_chat.txt / WhatsApp.zip</h4>
                          <p className="text-[11px] text-[#38BDF8] font-mono font-semibold">
                            WHATS Yapay Zeka Hazır!
                          </p>
                        </div>

                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono space-y-1 text-left">
                          <div className="flex justify-between">
                            <span>Sohbet:</span>
                            <span className="text-white font-bold">Hafta Sonu Çetesi 🍕</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Kişilik Ödülleri:</span>
                            <span className="text-[#38BDF8] font-bold">Hesaplanıyor ⚡</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Wrapped Story:</span>
                            <span className="text-emerald-400 font-bold">7 Slayt Hazır 🎉</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-[#0284C7] rounded-xl text-center shadow-glow-blue">
                        <span className="text-[11px] font-bold text-white">
                          4. Adım: Sitemize Bırakın, Wrapped Başlasın! 🚀
                        </span>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Phone Home Bar */}
              <div className="h-4 bg-[#0B141A] flex items-center justify-center pb-1">
                <div className="w-28 h-1 bg-slate-600 rounded-full" />
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
