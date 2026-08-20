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
  ChevronLeft,
  MoreVertical,
  Play,
  Pause,
  ShieldCheck,
  Phone,
  Video,
  Search,
  Plus,
  Mic,
  Camera,
  Smile,
  Paperclip,
  Send,
  FileText,
  Lock,
  ArrowRight,
  FolderDown,
  Trash2,
  LogOut,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface InteractivePhoneGuideProps {
  onUploadClick?: () => void;
}

export const InteractivePhoneGuide: React.FC<InteractivePhoneGuideProps> = ({ onUploadClick }) => {
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Platform specific step configs
  const iosSteps = [
    {
      stepNum: 1,
      title: 'Sohbet Başlığına Dokunun',
      subtitle: 'Grup / Kişi Bilgisi Açılır',
      desc: 'WhatsApp sohbetinde en üstteki kişi veya grup başlığına (Hafta Sonu Çetesi 🍕) dokunarak "Grup Bilgisi" sayfasına geçin.',
      actionTag: 'Üst Başlığa Tıklandı 👆',
    },
    {
      stepNum: 2,
      title: 'En Alta İnin & "Sohbeti Dışa Aktar"',
      subtitle: 'Grup Bilgisinin En Altı',
      desc: 'Grup bilgisi sayfasının en altına kaydırın. Kırmızı butonların üstündeki mavi "Sohbeti Dışa Aktar" seçeneğine dokunun.',
      actionTag: 'Sohbeti Dışa Aktar ➔',
    },
    {
      stepNum: 3,
      title: '"Medyasız" (Without Media) Seçin',
      subtitle: 'iOS Action Sheet',
      desc: 'Açılan alt menüde mutlaka "Medyasız" seçeneğini seçin. Bu sayede sadece güvenli ve hızlı .zip/.txt metni dışa aktarılır.',
      actionTag: 'Medyasız Seçildi ✓',
    },
    {
      stepNum: 4,
      title: 'Dosyayı Alın & WHATS\'a Bırakın',
      subtitle: 'Share Sheet ➔ WHATS',
      desc: 'Oluşan "WhatsApp Chat.zip" dosyasını "Dosyalar"a kaydedin veya doğrudan sitemize yükleyin. Analiz saniyeler içinde başlar!',
      actionTag: 'Analiz Hazır! 🎉',
    },
  ];

  const androidSteps = [
    {
      stepNum: 1,
      title: 'Sağ Üst Menüye (⋮) Dokunun',
      subtitle: '3 Nokta Seçenekleri',
      desc: 'Sohbet penceresinin sağ üst köşesindeki üç dikey nokta (⋮) simgesine dokunun.',
      actionTag: 'Menü (⋮) Açıldı 👆',
    },
    {
      stepNum: 2,
      title: '"Diğer" ➔ "Sohbeti Dışa Aktar"',
      subtitle: 'Diğer Alt Menüsü',
      desc: 'Açılan açılır menüden en alttaki "Diğer >" seçeneğine, ardından "Sohbeti dışa aktar" butonuna dokunun.',
      actionTag: 'Diğer ➔ Dışa Aktar',
    },
    {
      stepNum: 3,
      title: '"MEDYASIZ" Butonuna Basın',
      subtitle: 'Medya Eklensin mi? Dialogu',
      desc: '"Medya eklensin mi?" uyarısında sol taraftaki yeşil "MEDYASIZ" (Without Media) seçeneğini işaretleyin.',
      actionTag: 'MEDYASIZ Seçildi ✓',
    },
    {
      stepNum: 4,
      title: 'Metin Dosyasını WHATS\'a Yükleyin',
      subtitle: '.txt Dosyası Paylaşımı',
      desc: 'Oluşan "WhatsApp Sohbeti.txt" dosyasını tarayıcınızdan sitemize yükleyin ve Wrapped deneyiminizi başlatın!',
      actionTag: 'Analiz Hazır! 🎉',
    },
  ];

  const activeSteps = platform === 'ios' ? iosSteps : androidSteps;

  // Auto-play loop
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPlaying, platform]);

  return (
    <section className="relative rounded-3xl bg-gradient-to-b from-[#0C1015] via-[#090C10] to-[#05070A] border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden">
      
      {/* Subtle Ambient Backlight */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#0284C7]/20 via-[#00A884]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#38BDF8]/30 shadow-glow-blue">
          <Smartphone className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="text-[11px] font-mono font-bold text-[#7DD3FC] uppercase tracking-wider">
            Birebir WhatsApp Arayüz Simülatörü
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          WhatsApp Sohbeti Nasıl Dışa Aktarılır? 📱
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
          Aşağıdaki simülatörde <strong>{platform === 'ios' ? 'iPhone (iOS WhatsApp)' : 'Android (Android WhatsApp)'}</strong> için dışa aktarma adımlarını gerçek menü ve arayüz akışıyla izleyin.
        </p>

        {/* Platform Switches & Play/Pause */}
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
                  ? 'bg-[#0A84FF] text-white shadow-glow-blue'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>iPhone (iOS) Teması</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPlatform('android');
                setCurrentStep(0);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                platform === 'android'
                  ? 'bg-[#00A884] text-white shadow-glow-emerald'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android Teması</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#94A3B8] hover:text-white transition-all flex items-center gap-1.5"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Canlı Oynatılıyor</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Oynat</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container: Left Steps, Right Realistic Phone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 max-w-6xl mx-auto">
        
        {/* LEFT COLUMN: Steps Accordion & Action Triggers */}
        <div className="lg:col-span-6 space-y-3.5 order-2 lg:order-1">
          {activeSteps.map((s, idx) => {
            const isActive = currentStep === idx;
            return (
              <motion.div
                key={`${platform}-${idx}`}
                onClick={() => {
                  setCurrentStep(idx);
                  setIsPlaying(false);
                }}
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border relative overflow-hidden ${
                  isActive
                    ? platform === 'ios'
                      ? 'bg-[#161B22] border-[#0A84FF] shadow-glow-blue/20 translate-x-1.5'
                      : 'bg-[#161B22] border-[#00A884] shadow-glow-emerald/20 translate-x-1.5'
                    : 'bg-[#0E1116] border-white/5 hover:border-white/15 opacity-70 hover:opacity-100'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeBarGuide"
                    className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                      platform === 'ios' ? 'bg-[#0A84FF]' : 'bg-[#00A884]'
                    }`}
                  />
                )}

                <div className="flex items-start gap-3.5 pl-1.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                      isActive
                        ? platform === 'ios'
                          ? 'bg-[#0A84FF] text-white shadow-glow-blue'
                          : 'bg-[#00A884] text-white shadow-glow-emerald'
                        : 'bg-white/5 text-[#94A3B8]'
                    }`}
                  >
                    {s.stepNum}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-[#94A3B8]'}`}>
                        {s.title}
                      </h4>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? platform === 'ios'
                              ? 'bg-[#0A84FF]/20 text-[#38BDF8] border border-[#0A84FF]/30'
                              : 'bg-[#00A884]/20 text-[#2DD4BF] border border-[#00A884]/30'
                            : 'bg-white/5 text-[#64748B]'
                        }`}
                      >
                        {s.subtitle}
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

          {/* Bottom Upload Button */}
          <div className="pt-3 flex items-center gap-3">
            {onUploadClick && (
              <Button
                variant="blue"
                size="md"
                onClick={onUploadClick}
                className="font-bold text-xs shadow-glow-blue w-full sm:w-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Hazırım, Sohbeti Yükle</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}

            <div className="text-[11px] text-[#64748B] font-mono flex items-center gap-1.5 hidden sm:flex">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sıfır Medya • %100 Güvenli & Hızlı</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Pixel-Perfect Phone Screen */}
        <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
          
          {/* Phone Shell */}
          <div className="w-[310px] sm:w-[340px] h-[610px] sm:h-[640px] rounded-[48px] bg-[#1B1F26] p-3 shadow-2xl border-4 border-[#2E3540] relative">
            
            {/* Hardware Buttons */}
            <div className="absolute -left-[7px] top-24 w-[3px] h-9 bg-[#4B5563] rounded-l-md" />
            <div className="absolute -left-[7px] top-36 w-[3px] h-12 bg-[#4B5563] rounded-l-md" />
            <div className="absolute -right-[7px] top-28 w-[3px] h-14 bg-[#4B5563] rounded-r-md" />

            {/* Screen Inner */}
            <div className="w-full h-full rounded-[40px] bg-[#0B141A] overflow-hidden flex flex-col relative text-white select-none border border-white/5 font-sans">
              
              {/* Dynamic Island / Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-end px-2">
                <div className="w-2 h-2 rounded-full bg-[#1A2530]" />
              </div>

              {/* Status Bar */}
              <div className="h-9 bg-[#1F2C34] pt-2 px-6 flex items-center justify-between text-[10px] font-semibold text-slate-300 z-20">
                <span>09:41</span>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* SCREEN CONTENT: iOS vs Android */}
              <div className="flex-1 relative overflow-hidden bg-[#0B141A] flex flex-col">
                <AnimatePresence mode="wait">
                  
                  {/* ========================================================================= */}
                  {/* STEP 0: Chat Window (Sohbet Penceresi) */}
                  {/* ========================================================================= */}
                  {currentStep === 0 && (
                    <motion.div
                      key="step-chat"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col justify-between"
                    >
                      {/* iOS vs Android Header */}
                      {platform === 'ios' ? (
                        <div className="bg-[#1C1C1E] border-b border-white/10 px-3 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[#0A84FF] text-xs font-medium cursor-pointer">
                            <ChevronLeft className="w-4 h-4 -mr-1" />
                            <span>Sohbetler</span>
                          </div>

                          {/* Center: Tap Target for Contact Info */}
                          <div className="flex items-center gap-2 cursor-pointer relative">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-xs">
                              🍕
                            </div>
                            <div className="text-left">
                              <h5 className="text-xs font-bold text-white leading-tight">
                                Hafta Sonu Çetesi 🍕
                              </h5>
                              <span className="text-[9px] text-[#0A84FF] block leading-tight font-medium">
                                Bilgi için dokunun ➔
                              </span>
                            </div>

                            {/* Pointer Ripple Animation */}
                            <motion.div
                              initial={{ scale: 0, opacity: 1 }}
                              animate={{ scale: 2.2, opacity: 0 }}
                              transition={{ repeat: Infinity, duration: 1.2 }}
                              className="absolute -inset-1 rounded-xl border-2 border-[#0A84FF] pointer-events-none"
                            />
                          </div>

                          <div className="flex items-center gap-2.5 text-[#0A84FF]">
                            <Video className="w-4 h-4" />
                            <Phone className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#1F2C34] border-b border-white/5 px-3 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ChevronLeft className="w-4 h-4 text-slate-300" />
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-xs">
                              🍕
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-white leading-tight">
                                Hafta Sonu Çetesi 🍕
                              </h5>
                              <span className="text-[9px] text-slate-400 block leading-tight">
                                8 katılımcı
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-slate-300 relative">
                            <Video className="w-4 h-4" />
                            <Phone className="w-3.5 h-3.5" />
                            
                            {/* Android 3 Dots Target */}
                            <div className="relative p-1 rounded-full bg-emerald-500/20 text-[#00A884]">
                              <MoreVertical className="w-4 h-4" />
                              <motion.div
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 2.2, opacity: 0 }}
                                transition={{ repeat: Infinity, duration: 1.2 }}
                                className="absolute -inset-1 rounded-full border-2 border-[#00A884] pointer-events-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Chat Messages */}
                      <div className="p-3 space-y-2.5 flex-1 bg-[#0B141A] text-xs">
                        <div className="text-center my-1">
                          <span className="text-[9px] bg-[#182229] text-slate-400 px-2 py-0.5 rounded-md">
                            Bugün
                          </span>
                        </div>

                        <div className="bg-[#1F2C34] p-2 rounded-xl rounded-tl-none max-w-[80%] space-y-0.5 shadow-sm">
                          <span className="text-[10px] text-orange-400 font-bold">Ahmet</span>
                          <p className="text-[11px] text-slate-200">Akşam halı saha kesin mi beyler?</p>
                          <span className="text-[8px] text-slate-400 block text-right">21:14</span>
                        </div>

                        <div className="bg-[#005C4B] p-2 rounded-xl rounded-tr-none max-w-[80%] ml-auto space-y-0.5 shadow-sm">
                          <p className="text-[11px] text-white">Kadroyu kurdum, 22:00'de oradayız 🔥</p>
                          <span className="text-[8px] text-emerald-200 block text-right">21:15 ✓✓</span>
                        </div>

                        <div className="bg-[#1F2C34] p-2 rounded-xl rounded-tl-none max-w-[80%] space-y-0.5 shadow-sm">
                          <span className="text-[10px] text-pink-400 font-bold">Selin</span>
                          <p className="text-[11px] text-slate-200">tm ben de geliyorum</p>
                          <span className="text-[8px] text-slate-400 block text-right">21:16</span>
                        </div>
                      </div>

                      {/* Chat Input Bar */}
                      <div className="p-2 bg-[#1F2C34] flex items-center gap-2 border-t border-white/5">
                        <Plus className="w-4 h-4 text-[#0A84FF]" />
                        <div className="flex-1 bg-[#2A3942] rounded-full px-3 py-1 text-[11px] text-slate-400">
                          Mesaj yazın...
                        </div>
                        <Camera className="w-4 h-4 text-slate-400" />
                        <Mic className="w-4 h-4 text-slate-400" />
                      </div>

                      {/* Bottom Banner */}
                      <div className={`p-2 text-center text-[10px] font-bold ${
                        platform === 'ios' ? 'bg-[#0A84FF] text-white' : 'bg-[#00A884] text-white'
                      }`}>
                        1. Adım: {platform === 'ios' ? 'Üstteki Grup Başlığına Dokunun' : 'Sağ Üstteki (⋮) Menüsüne Dokunun'}
                      </div>
                    </motion.div>
                  )}

                  {/* ========================================================================= */}
                  {/* STEP 1: iOS Group Info Bottom Scroll vs Android Dropdown 'More' */}
                  {/* ========================================================================= */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step-info-or-menu"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col justify-between bg-[#111B21]"
                    >
                      {platform === 'ios' ? (
                        /* iOS Group Info Page - Scrolled to Bottom */
                        <div className="flex-1 flex flex-col justify-between p-3 space-y-2">
                          <div className="flex items-center gap-1 text-[#0A84FF] text-xs font-medium pb-1">
                            <ChevronLeft className="w-4 h-4 -mr-1" />
                            <span>Geri</span>
                            <span className="ml-auto text-slate-400 text-[10px]">Grup Bilgisi</span>
                          </div>

                          {/* Scrolled list mockup */}
                          <div className="space-y-2 flex-1 overflow-hidden">
                            <div className="bg-[#1C1C1E] rounded-2xl p-2.5 space-y-2 text-xs text-slate-300">
                              <div className="flex items-center justify-between pb-1.5 border-b border-white/5 text-[11px]">
                                <span>Medyalar, Bağlantılar ve Belgeler</span>
                                <span className="text-[10px] text-slate-400">142 ➔</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px]">
                                <span>Yıldızlı Mesajlar</span>
                                <span className="text-[10px] text-slate-400">0 ➔</span>
                              </div>
                            </div>

                            {/* Actions Box at bottom */}
                            <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden divide-y divide-white/5 text-xs">
                              
                              {/* EXPORT CHAT (TARGET) */}
                              <div className="p-3 bg-[#0A84FF]/20 border border-[#0A84FF] rounded-xl flex items-center justify-between text-[#0A84FF] font-bold relative shadow-glow-blue">
                                <div className="flex items-center gap-2">
                                  <Share2 className="w-4 h-4 text-[#0A84FF]" />
                                  <span>Sohbeti Dışa Aktar</span>
                                </div>
                                <span className="text-[9px] bg-[#0A84FF] text-white px-2 py-0.5 rounded-md">
                                  DOKUNUN 👆
                                </span>

                                <motion.div
                                  initial={{ scale: 0, opacity: 1 }}
                                  animate={{ scale: 1.8, opacity: 0 }}
                                  transition={{ repeat: Infinity, duration: 1.2 }}
                                  className="absolute inset-0 rounded-xl border-2 border-[#0A84FF] pointer-events-none"
                                />
                              </div>

                              <div className="p-2.5 flex items-center gap-2 text-red-400 opacity-60 text-[11px]">
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Sohbeti Temizle</span>
                              </div>

                              <div className="p-2.5 flex items-center gap-2 text-red-500 opacity-60 text-[11px]">
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Gruptan Çık</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-2 bg-[#0A84FF] rounded-xl text-center text-white font-bold text-[10px]">
                            2. Adım: "Sohbeti Dışa Aktar" Seçeneğine Dokunun
                          </div>
                        </div>
                      ) : (
                        /* Android 3-Dots Dropdown Menu ➔ 'Diğer' (More) */
                        <div className="flex-1 flex flex-col justify-between p-3 relative">
                          <div className="bg-[#1F2C34] p-2 rounded-xl flex items-center justify-between text-xs text-slate-300">
                            <span>Hafta Sonu Çetesi</span>
                            <MoreVertical className="w-4 h-4 text-[#00A884]" />
                          </div>

                          {/* Floating Android Popup Menu */}
                          <div className="absolute top-12 right-4 w-48 bg-[#233138] rounded-xl shadow-2xl border border-white/10 py-1 text-xs text-slate-200 z-30 space-y-0.5">
                            <div className="px-3 py-1.5 opacity-60">Grup bilgisi</div>
                            <div className="px-3 py-1.5 opacity-60">Grup medyası</div>
                            <div className="px-3 py-1.5 opacity-60">Ara</div>
                            <div className="px-3 py-1.5 opacity-60">Sessize al</div>
                            <div className="px-3 py-1.5 opacity-60">Duvar kağıdı</div>
                            
                            {/* TARGET: Diğer (More) */}
                            <div className="px-3 py-2 bg-[#00A884]/20 border-l-4 border-[#00A884] text-[#2DD4BF] font-bold flex items-center justify-between relative">
                              <span>Diğer (More)</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                              <motion.div
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ repeat: Infinity, duration: 1.2 }}
                                className="absolute right-2 top-2 w-4 h-4 rounded-full bg-[#00A884]/40 pointer-events-none"
                              />
                            </div>
                          </div>

                          <div className="p-2 bg-[#00A884] rounded-xl text-center text-white font-bold text-[10px] mt-auto">
                            2. Adım: Menüden "Diğer" ➔ "Sohbeti dışa aktar"ı Seçin
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ========================================================================= */}
                  {/* STEP 2: iOS Action Sheet vs Android Media Dialog */}
                  {/* ========================================================================= */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step-medialess"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col justify-end p-3 bg-black/80 backdrop-blur-sm relative"
                    >
                      {platform === 'ios' ? (
                        /* iOS Native Bottom Action Sheet */
                        <div className="space-y-2 mb-2">
                          <div className="bg-[#2C2C2E] rounded-2xl overflow-hidden divide-y divide-white/10 text-center text-xs">
                            <div className="p-2.5 text-slate-400 text-[11px]">
                              Medya eklemek sohbet boyutunu artırır.
                            </div>
                            <div className="p-3 text-slate-400 line-through opacity-50 font-medium">
                              Medyayı Ekle (Gereksiz & Boyut Artar)
                            </div>
                            
                            {/* TARGET: Medyasız */}
                            <div className="p-3.5 bg-gradient-to-r from-[#0A84FF] to-sky-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-glow-blue">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Medyasız (Without Media)</span>
                              <span className="text-[9px] bg-black/30 px-1.5 py-0.5 rounded-full font-mono">
                                DOĞRU SEÇİM ✓
                              </span>
                            </div>
                          </div>

                          <div className="bg-[#2C2C2E] rounded-2xl p-3 text-center text-[#0A84FF] font-bold text-xs">
                            Vazgeç
                          </div>
                        </div>
                      ) : (
                        /* Android Native Alert Dialog */
                        <div className="bg-[#233138] rounded-3xl p-4 border border-white/10 shadow-2xl space-y-3 mb-4">
                          <h4 className="text-xs font-bold text-white">Medya eklensin mi?</h4>
                          <p className="text-[10px] text-slate-300 leading-relaxed">
                            Medya eklemek sohbet dışa aktarma boyutunu artırır.
                          </p>

                          <div className="flex items-center justify-end gap-2 pt-2">
                            <span className="text-[10px] text-slate-400 px-2 py-1">
                              MEDYAYI EKLE
                            </span>
                            <div className="px-3 py-1.5 rounded-xl bg-[#00A884] text-white font-bold text-xs flex items-center gap-1 shadow-glow-emerald border border-teal-300">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>MEDYASIZ</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="p-2 bg-emerald-500 rounded-xl text-center text-white font-bold text-[10px]">
                        3. Adım: Mutlaka "Medyasız" (Without Media) Seçeneğini Seçin!
                      </div>
                    </motion.div>
                  )}

                  {/* ========================================================================= */}
                  {/* STEP 3: Share Sheet & Upload to WHATS Animation */}
                  {/* ========================================================================= */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step-upload-success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col justify-between p-4 bg-gradient-to-b from-[#07090C] to-[#0E131A] text-center"
                    >
                      <div className="my-auto space-y-4">
                        {/* Animated file ready icon */}
                        <div className="relative w-20 h-20 mx-auto">
                          <motion.div
                            animate={{ y: [-3, 3, -3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl text-white shadow-2xl ${
                              platform === 'ios' ? 'bg-[#0A84FF] shadow-glow-blue' : 'bg-[#00A884] shadow-glow-emerald'
                            }`}
                          >
                            📄
                          </motion.div>
                          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#38BDF8] text-black font-black text-xs flex items-center justify-center shadow-lg">
                            ✓
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white">
                            {platform === 'ios' ? 'WhatsApp Chat - Hafta Sonu.zip' : 'WhatsApp Sohbeti - Hafta Sonu.txt'}
                          </h4>
                          <p className="text-[10px] text-[#38BDF8] font-mono font-semibold">
                            WHATS Analizi İçin Hazır!
                          </p>
                        </div>

                        {/* Live Stat Preview */}
                        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-[9px] text-slate-300 font-mono space-y-1 text-left">
                          <div className="flex justify-between">
                            <span>Format:</span>
                            <span className="text-white font-bold">{platform === 'ios' ? 'iPhone ZIP Arşivi' : 'Android TXT'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Gizlilik:</span>
                            <span className="text-emerald-400 font-bold">%100 Medyasız & Anonim</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Süre:</span>
                            <span className="text-[#38BDF8] font-bold">5 Saniyede Wrapped 🚀</span>
                          </div>
                        </div>
                      </div>

                      <div className={`p-2 rounded-xl text-center text-white font-bold text-[10px] shadow-lg ${
                        platform === 'ios' ? 'bg-[#0A84FF]' : 'bg-[#00A884]'
                      }`}>
                        4. Adım: Dosyayı Sitemize Yükleyin & Wrapped Başlasın!
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Home Indicator Bar */}
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
