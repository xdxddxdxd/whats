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
  Paperclip,
  Trash2,
  X,
  FileText,
  Users,
  Image as ImageIcon,
  FolderDown,
  HardDrive,
  Star,
  Bell,
  Palette,
  UserPlus,
  Heart,
  ListPlus,
  Ban,
  AlertTriangle,
  Sticker,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface InteractivePhoneGuideProps {
  onUploadClick?: () => void;
}

export const InteractivePhoneGuide: React.FC<InteractivePhoneGuideProps> = ({ onUploadClick }) => {
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // iOS Steps (4 distinct visual phases matching the user screenshots)
  const iosSteps = [
    {
      stepNum: 1,
      title: 'Kişi / Grup İsmine Dokunun',
      desc: 'Sohbet ekranında en üstteki isme (Doğukan) dokunarak Kişi Bilgisi ekranını açın.',
    },
    {
      stepNum: 2,
      title: 'Kişi Bilgisinde Aşağı Kaydırın',
      desc: 'Açılan profilde aşağı doğru kaydırarak eylem seçeneklerinin olduğu alt bölüme gelin.',
    },
    {
      stepNum: 3,
      title: '"Sohbeti dışa aktar" Butonuna Basın',
      desc: 'En alttaki eylem menüsünden "Sohbeti dışa aktar" seçeneğine dokunun.',
    },
    {
      stepNum: 4,
      title: '"Medyayı ekleme" Seçeneğini Seçin',
      desc: 'Alttan açılan pencerede "Medyayı ekleme" butonuna basarak hafif .zip arşivinizi alın.',
    },
  ];

  // Android Steps (4 distinct visual phases matching the user screenshots)
  const androidSteps = [
    {
      stepNum: 1,
      title: 'Sağ Üstteki Üç Noktaya (⋮) Dokunun',
      desc: 'Sohbet penceresinin sağ üst köşesindeki üç nokta simgesine dokunup menüyü açın.',
    },
    {
      stepNum: 2,
      title: 'Açılan Menüden "Diğer ▸" Seçeneğine Basın',
      desc: 'Menü listesinin en altında yer alan "Diğer" seçeneğine dokunun.',
    },
    {
      stepNum: 3,
      title: '"Sohbeti dışa aktar" Seçeneğine Dokunun',
      desc: 'Açılan ikinci alt menüden "Sohbeti dışa aktar" butonuna dokunun.',
    },
    {
      stepNum: 4,
      title: '"MEDYASIZ" Butonuna Basın',
      desc: 'Ekrana gelen uyarıda yeşil "MEDYASIZ" seçeneğini seçip .txt dosyanızı yükleyin.',
    },
  ];

  const activeSteps = platform === 'ios' ? iosSteps : androidSteps;

  // Auto-play loop: advances steps smoothly
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
    }, 4600);

    return () => clearInterval(timer);
  }, [isPlaying, platform]);

  return (
    <section className="relative rounded-3xl bg-gradient-to-b from-[#0C1015] via-[#090C10] to-[#05070A] border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden">
      
      {/* Ambient Radial Backlight */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#0284C7]/20 via-[#00A884]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Header info */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#38BDF8]/30 shadow-glow-blue">
          <Smartphone className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="text-[11px] font-mono font-bold text-[#7DD3FC] uppercase tracking-wider">
            Birebir WhatsApp Dışa Aktarma Rehberi
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          WhatsApp Sohbeti Nasıl Dışa Aktarılır? 📱
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
          <strong>{platform === 'ios' ? 'iPhone (iOS)' : 'Android'}</strong> cihazınızdaki orijinal WhatsApp ekranlarını ve dışa aktarma adımlarını canlı simülatörde izleyin.
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
                  ? 'bg-[#00A884] text-white shadow-glow-emerald'
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
                <Pause className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Oynatılıyor</span>
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

      {/* Main Grid: Left Clean Step Cards, Right Exact Phone Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 max-w-6xl mx-auto">
        
        {/* LEFT COLUMN: Clean, uncluttered step cards */}
        <div className="lg:col-span-6 space-y-3 order-2 lg:order-1">
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
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
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
                    <h4 className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-[#94A3B8]'}`}>
                      {s.title}
                    </h4>
                    <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Bottom CTA */}
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
          <div className="w-[310px] sm:w-[340px] h-[610px] sm:h-[640px] rounded-[48px] bg-[#1A1E24] p-3 shadow-2xl border-4 border-[#2A303A] relative">
            
            {/* Buttons on Side */}
            <div className="absolute -left-[7px] top-24 w-[3px] h-9 bg-[#4B5563] rounded-l-md" />
            <div className="absolute -left-[7px] top-36 w-[3px] h-12 bg-[#4B5563] rounded-l-md" />
            <div className="absolute -right-[7px] top-28 w-[3px] h-14 bg-[#4B5563] rounded-r-md" />

            {/* Screen Viewport */}
            <div className="w-full h-full rounded-[40px] bg-[#0B141A] overflow-hidden flex flex-col relative text-white select-none border border-white/5 font-sans">
              
              {/* Dynamic Island / Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-end px-2">
                <div className="w-2 h-2 rounded-full bg-[#1A2530]" />
              </div>

              {/* Status Bar */}
              <div className="h-8 bg-[#111B21] pt-1.5 px-6 flex items-center justify-between text-[10px] font-semibold text-slate-300 z-20">
                <span>16:17</span>
                <div className="flex items-center gap-1 text-[9px]">
                  <span>LTE</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-1 rounded">35</span>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* SCREEN CONTENT: iOS vs Android                                            */}
              {/* ========================================================================= */}
              <div className="flex-1 relative overflow-hidden bg-[#0B141A] flex flex-col">
                <AnimatePresence mode="wait">
                  
                  {/* ======================================================================= */}
                  {/* ANDROID FLOW: (Exact match to uploaded screenshots 1, 2, 3)             */}
                  {/* ======================================================================= */}
                  {platform === 'android' && (
                    <motion.div
                      key={`android-${currentStep}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col justify-between relative"
                    >
                      {/* Android Header */}
                      <div className="bg-[#111B21] border-b border-white/5 px-3 py-2 flex items-center justify-between z-10">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-amber-700/80 text-amber-200 font-bold text-[10px] flex items-center justify-center">
                            D
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white leading-tight">
                              Doğukan
                            </h5>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-slate-300 relative">
                          <Video className="w-4 h-4" />
                          <Phone className="w-3.5 h-3.5" />
                          
                          {/* 3 DOTS (Highlighted on Step 0) */}
                          <div className={`p-1 rounded-full relative ${
                            currentStep === 0 ? 'bg-sky-500/30 text-[#38BDF8]' : 'text-slate-300'
                          }`}>
                            <MoreVertical className="w-4 h-4" />

                            {currentStep === 0 && (
                              <motion.div
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 2.2, opacity: 0 }}
                                transition={{ repeat: Infinity, duration: 1.2 }}
                                className="absolute -inset-1.5 rounded-full border-2 border-[#38BDF8] pointer-events-none"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Chat Messages Body */}
                      <div className="p-3 space-y-2 flex-1 bg-[#0B141A] text-xs relative overflow-hidden">
                        
                        {/* Received message */}
                        <div className="bg-[#202C33] p-2 rounded-xl rounded-tl-none max-w-[78%] space-y-0.5 shadow-sm text-slate-200">
                          <p className="text-[11px]">Sohbeti dışa aktarmayı denedin mi kanka?</p>
                          <span className="text-[8px] text-slate-400 block text-right">16:04</span>
                        </div>

                        {/* Sent message */}
                        <div className="bg-[#005C4B] p-2 rounded-xl rounded-tr-none max-w-[78%] ml-auto space-y-0.5 shadow-sm text-white">
                          <p className="text-[11px]">Şimdi yapıyorum, 3 noktaya basıyorum</p>
                          <span className="text-[8px] text-emerald-200 block text-right">16:04 ✓✓</span>
                        </div>

                        {/* Received message */}
                        <div className="bg-[#202C33] p-2 rounded-xl rounded-tl-none max-w-[78%] space-y-0.5 shadow-sm text-slate-200">
                          <p className="text-[11px]">Medyasız seçmeyi unutma hızlı olsun 🔥</p>
                          <span className="text-[8px] text-slate-400 block text-right">16:05</span>
                        </div>

                        {/* ANDROID STEP 1: First Popup Menu ("Diğer ▸" highlighted) */}
                        {currentStep === 1 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="absolute top-1 right-2 w-48 bg-[#233138] rounded-2xl shadow-2xl border border-white/10 py-1.5 text-xs text-slate-200 z-30 divide-y divide-white/5"
                          >
                            <div className="py-0.5">
                              <div className="px-3 py-1.5 opacity-60 text-[11px]">Yeni grup</div>
                              <div className="px-3 py-1.5 opacity-60 text-[11px]">Kişiyi görüntüle</div>
                              <div className="px-3 py-1.5 opacity-60 text-[11px]">Ara</div>
                              <div className="px-3 py-1.5 opacity-60 text-[11px]">Medya, bağlantı ve belgeler</div>
                              <div className="px-3 py-1.5 opacity-60 text-[11px]">Bildirimleri sessize al</div>
                              <div className="px-3 py-1.5 opacity-60 text-[11px]">Süreli mesajlar</div>
                              <div className="px-3 py-1.5 opacity-60 text-[11px]">Sohbet teması</div>
                            </div>
                            
                            {/* TARGET: Diğer ▸ */}
                            <div className="px-3 py-2 bg-[#00A884]/25 text-[#2DD4BF] font-extrabold flex items-center justify-between relative">
                              <span className="text-xs">Diğer</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                              
                              <motion.div
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 1.8, opacity: 0 }}
                                transition={{ repeat: Infinity, duration: 1.2 }}
                                className="absolute inset-0 rounded-lg border-2 border-[#38BDF8] pointer-events-none"
                              />
                            </div>
                          </motion.div>
                        )}

                        {/* ANDROID STEP 2: Second Sub-Menu ("Sohbeti dışa aktar" highlighted) */}
                        {currentStep === 2 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="absolute top-12 right-6 w-44 bg-[#233138] rounded-2xl shadow-2xl border border-white/10 py-1 text-xs text-slate-200 z-30"
                          >
                            <div className="px-3 py-1.5 opacity-60 text-[11px]">Şikayet et</div>
                            <div className="px-3 py-1.5 opacity-60 text-[11px]">Engelle</div>
                            <div className="px-3 py-1.5 opacity-60 text-[11px]">Sohbeti temizle</div>
                            
                            {/* TARGET: Sohbeti dışa aktar */}
                            <div className="px-3 py-2 bg-[#00A884]/30 text-white font-black text-xs flex items-center justify-between relative rounded-lg border border-[#38BDF8]">
                              <span>Sohbeti dışa aktar</span>
                              
                              <motion.div
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 1.8, opacity: 0 }}
                                transition={{ repeat: Infinity, duration: 1.2 }}
                                className="absolute inset-0 rounded-lg border-2 border-[#38BDF8] pointer-events-none"
                              />
                            </div>

                            <div className="px-3 py-1.5 opacity-60 text-[11px]">Kısayol ekle</div>
                            <div className="px-3 py-1.5 opacity-60 text-[11px]">Listeye ekle</div>
                          </motion.div>
                        )}

                        {/* ANDROID STEP 3: "Medya eklensin mi?" Dialog ("MEDYASIZ" highlighted) */}
                        {currentStep === 3 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-3"
                          >
                            <div className="bg-[#233138] rounded-3xl p-4 border border-white/10 shadow-2xl space-y-3 w-full">
                              <h4 className="text-xs font-bold text-white">Medya eklensin mi?</h4>
                              <p className="text-[10px] text-slate-300 leading-relaxed">
                                Medya eklemek sohbet dışa aktarma boyutunu artırır.
                              </p>

                              <div className="flex items-center justify-end gap-2 pt-2">
                                <span className="text-[10px] text-slate-400 px-2 py-1">
                                  MEDYAYI EKLE
                                </span>
                                <div className="px-3 py-1.5 rounded-xl bg-[#00A884] text-white font-black text-xs flex items-center gap-1 shadow-glow-emerald border-2 border-[#38BDF8] relative">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>MEDYASIZ</span>

                                  <motion.div
                                    initial={{ scale: 0, opacity: 1 }}
                                    animate={{ scale: 1.8, opacity: 0 }}
                                    transition={{ repeat: Infinity, duration: 1.2 }}
                                    className="absolute inset-0 rounded-xl border-2 border-[#38BDF8] pointer-events-none"
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                      </div>

                      {/* Android Chat Input Bar */}
                      <div className="p-2 bg-[#111B21] flex items-center gap-2 border-t border-white/5">
                        <div className="flex-1 bg-[#202C33] rounded-full px-3 py-1.5 text-[11px] text-slate-400 flex items-center justify-between">
                          <span>Mesaj</span>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Paperclip className="w-3.5 h-3.5" />
                            <Camera className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#00A884] text-white flex items-center justify-center">
                          <Mic className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ======================================================================= */}
                  {/* iOS FLOW: (Exact match to uploaded screenshots 1, 2, 3, 4)              */}
                  {/* ======================================================================= */}
                  {platform === 'ios' && (
                    <motion.div
                      key={`ios-${currentStep}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col justify-between relative bg-[#000000]"
                    >
                      {/* iOS STEP 0: Chat Screen */}
                      {currentStep === 0 && (
                        <div className="flex-1 flex flex-col justify-between">
                          {/* iOS Header */}
                          <div className="bg-[#1C1C1E] border-b border-white/10 px-3 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-1 text-[#0A84FF] text-xs font-semibold">
                              <ChevronLeft className="w-4 h-4 -mr-1" />
                              <span>2</span>
                            </div>

                            {/* Center: Tap Target for Contact Info */}
                            <div className="flex items-center gap-2 relative cursor-pointer">
                              <div className="w-7 h-7 rounded-full bg-amber-700/80 text-amber-200 text-[10px] font-bold flex items-center justify-center">
                                D
                              </div>
                              <div className="text-left">
                                <h5 className="text-xs font-bold text-white leading-tight">
                                  Doğukan
                                </h5>
                                <span className="text-[8px] text-slate-400 block leading-tight">
                                  kişi bilgisi için dokunun
                                </span>
                              </div>

                              <motion.div
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 2.2, opacity: 0 }}
                                transition={{ repeat: Infinity, duration: 1.2 }}
                                className="absolute -inset-1.5 rounded-xl border-2 border-[#38BDF8] pointer-events-none"
                              />
                            </div>

                            <div className="flex items-center gap-2.5 text-[#0A84FF]">
                              <Video className="w-4 h-4" />
                              <Phone className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          {/* Chat Bubbles */}
                          <div className="p-3 space-y-2 flex-1 bg-[#000000] text-xs">
                            <div className="bg-[#1C1C1E] p-2 rounded-2xl rounded-tl-none max-w-[78%] space-y-0.5 text-white">
                              <p className="text-[11px]">Sohbeti dışa aktaralım mı?</p>
                              <span className="text-[8px] text-slate-400 block text-right">16:04</span>
                            </div>

                            <div className="bg-[#3D2C24] p-2 rounded-2xl rounded-tr-none max-w-[78%] ml-auto space-y-0.5 text-white">
                              <p className="text-[11px]">Profilime dokun en alta in</p>
                              <span className="text-[8px] text-slate-300 block text-right">16:04 ✓✓</span>
                            </div>
                          </div>

                          {/* iOS Chat Input Bar */}
                          <div className="p-2 bg-[#1C1C1E] flex items-center gap-2 border-t border-white/10">
                            <Plus className="w-4 h-4 text-[#0A84FF]" />
                            <div className="flex-1 bg-[#2C2C2E] rounded-full px-3 py-1 text-[11px] text-slate-400 flex items-center justify-between">
                              <span />
                              <Sticker className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <Camera className="w-4 h-4 text-[#0A84FF]" />
                            <Mic className="w-4 h-4 text-[#0A84FF]" />
                          </div>
                        </div>
                      )}

                      {/* iOS STEP 1: Contact Info Page - Top Section (Animated Scroll Down) */}
                      {currentStep === 1 && (
                        <div className="flex-1 flex flex-col justify-between bg-[#000000] p-3 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <div className="w-6 h-6 rounded-full bg-[#1C1C1E] flex items-center justify-center text-white">
                              <ChevronLeft className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-white text-xs">Kişi bilgisi</span>
                            <span className="bg-[#1C1C1E] text-white px-2 py-0.5 rounded-full text-[10px]">Düzenle</span>
                          </div>

                          {/* Profile Avatar & Name */}
                          <div className="text-center space-y-1">
                            <div className="w-14 h-14 rounded-full bg-amber-700/80 text-amber-200 text-xl font-bold flex items-center justify-center mx-auto shadow-md">
                              D
                            </div>
                            <h4 className="text-sm font-bold text-white">Doğukan</h4>
                            <p className="text-[10px] text-slate-400">+90 551 639 33 69</p>
                          </div>

                          {/* Call / Video / Search 3 Circle Buttons */}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="p-2 rounded-2xl bg-[#1C1C1E] text-center text-[10px] text-emerald-400 space-y-1">
                              <Phone className="w-4 h-4 mx-auto" />
                              <span className="text-white block text-[9px]">Sesli</span>
                            </div>
                            <div className="p-2 rounded-2xl bg-[#1C1C1E] text-center text-[10px] text-emerald-400 space-y-1">
                              <Video className="w-4 h-4 mx-auto" />
                              <span className="text-white block text-[9px]">Görüntülü</span>
                            </div>
                            <div className="p-2 rounded-2xl bg-[#1C1C1E] text-center text-[10px] text-emerald-400 space-y-1">
                              <Search className="w-4 h-4 mx-auto" />
                              <span className="text-white block text-[9px]">Ara</span>
                            </div>
                          </div>

                          {/* First Group List Card */}
                          <div className="bg-[#1C1C1E] rounded-2xl p-2.5 space-y-2 text-[11px] text-slate-200">
                            <div className="flex items-center justify-between pb-1 border-b border-white/5">
                              <span>Medya, bağlantı ve belgeler</span>
                              <span className="text-slate-400 text-[10px]">150 ➔</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Depolama alanını yönet</span>
                              <span className="text-slate-400 text-[10px]">64,8 MB ➔</span>
                            </div>
                          </div>

                          {/* Scroll Down Indicator */}
                          <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="text-center text-[10px] font-mono text-[#38BDF8] font-bold bg-[#1C1C1E] py-1.5 rounded-xl border border-[#38BDF8]/40"
                          >
                            ⬇️ Aşağı Kaydırın (Scroll Down)
                          </motion.div>
                        </div>
                      )}

                      {/* iOS STEP 2: Contact Info Page - Bottom Section ("Sohbeti dışa aktar" highlighted) */}
                      {currentStep === 2 && (
                        <div className="flex-1 flex flex-col justify-between bg-[#000000] p-3 space-y-2">
                          <div className="flex items-center justify-between text-xs pb-1">
                            <div className="w-6 h-6 rounded-full bg-[#1C1C1E] flex items-center justify-center text-white">
                              <ChevronLeft className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-white text-xs">Doğukan</span>
                            <span className="bg-[#1C1C1E] text-white px-2 py-0.5 rounded-full text-[10px]">Düzenle</span>
                          </div>

                          <div className="text-[10px] text-slate-400 font-bold px-1">2 ortak grup</div>

                          {/* Group Cards */}
                          <div className="bg-[#1C1C1E] rounded-2xl p-2 text-[10px] space-y-1.5">
                            <div className="flex items-center gap-2 text-white">
                              <Users className="w-3.5 h-3.5 text-pink-400" />
                              <span>EFE KURS 2026 SINAV GRUBU</span>
                            </div>
                          </div>

                          {/* Actions Card */}
                          <div className="bg-[#1C1C1E] rounded-2xl divide-y divide-white/5 text-[11px]">
                            <div className="p-2 text-emerald-400">Kişiyi paylaş</div>
                            <div className="p-2 text-emerald-400">Favoriler'e ekle</div>
                            
                            {/* TARGET: Sohbeti dışa aktar */}
                            <div className="p-2.5 bg-[#0A84FF]/25 text-white font-extrabold flex items-center justify-between border-2 border-[#38BDF8] rounded-xl relative">
                              <span>Sohbeti dışa aktar</span>
                              <span className="text-[9px] bg-[#0A84FF] text-white px-2 py-0.5 rounded-md">DOKUNUN 👆</span>

                              <motion.div
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 1.8, opacity: 0 }}
                                transition={{ repeat: Infinity, duration: 1.2 }}
                                className="absolute inset-0 rounded-xl border-2 border-[#38BDF8] pointer-events-none"
                              />
                            </div>

                            <div className="p-2 text-red-400 opacity-60">Sohbeti temizle</div>
                          </div>

                          {/* Red Block Cards */}
                          <div className="bg-[#1C1C1E] rounded-2xl p-2 text-[10px] text-red-500 space-y-1 opacity-70">
                            <div>Doğukan kişisini engelle</div>
                          </div>
                        </div>
                      )}

                      {/* iOS STEP 3: Action Sheet Modal ("Medyayı ekleme" highlighted) */}
                      {currentStep === 3 && (
                        <div className="flex-1 flex flex-col justify-end bg-black/80 backdrop-blur-sm p-3 relative">
                          
                          {/* Bottom Action Sheet Card (Exact replica of Image 4) */}
                          <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-[#1C1C1E] rounded-3xl p-4 border border-white/10 space-y-3 mb-2"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-white">Sohbeti dışa aktar</h4>
                              <div className="w-6 h-6 rounded-full bg-[#2C2C2E] flex items-center justify-center text-slate-400">
                                <X className="w-3.5 h-3.5" />
                              </div>
                            </div>

                            <p className="text-[10px] text-slate-400 leading-snug">
                              Medya eklemek daha büyük bir sohbet arşivi yaratır.
                            </p>

                            <div className="space-y-2 pt-1">
                              {/* Option 1: Medya ekle */}
                              <div className="p-2.5 rounded-2xl bg-[#2C2C2E] text-slate-400 text-xs flex items-center gap-2 opacity-60">
                                <ImageIcon className="w-4 h-4" />
                                <span>Medya ekle</span>
                              </div>

                              {/* Option 2: Medyayı ekleme (TARGET) */}
                              <div className="p-3 rounded-2xl bg-gradient-to-r from-[#0A84FF] to-sky-500 text-white font-black text-xs flex items-center justify-between border-2 border-white shadow-glow-blue relative">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-white" />
                                  <span>Medyayı ekleme</span>
                                </div>
                                <span className="text-[9px] bg-black/40 px-2 py-0.5 rounded-full font-mono">
                                  DOĞRU SEÇİM ✓
                                </span>

                                <motion.div
                                  initial={{ scale: 0, opacity: 1 }}
                                  animate={{ scale: 1.8, opacity: 0 }}
                                  transition={{ repeat: Infinity, duration: 1.2 }}
                                  className="absolute inset-0 rounded-2xl border-2 border-white pointer-events-none"
                                />
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )}

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
