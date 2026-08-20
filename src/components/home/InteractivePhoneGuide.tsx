'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Apple,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Phone,
  Video,
  Search,
  Plus,
  Mic,
  Camera,
  Paperclip,
  Smile,
  X,
  FileText,
  Users,
  Image as ImageIcon,
  Sticker,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface InteractivePhoneGuideProps {
  onUploadClick?: () => void;
}

// Clean hand-drawn glowing blue marker border that encapsulates text without covering it
const BlueCapsuleMarker: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 160 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute pointer-events-none drop-shadow-[0_0_10px_rgba(59,130,246,0.9)] ${className}`}
    preserveAspectRatio="none"
  >
    <motion.path
      d="M15 8 C 50 4, 110 5, 145 10 C 158 13, 158 37, 142 42 C 105 46, 55 45, 15 40 C 2 37, 2 13, 18 8 Z"
      stroke="#3B82F6"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    />
  </svg>
);

const BlueCircleMarker: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute pointer-events-none drop-shadow-[0_0_10px_rgba(59,130,246,0.95)] ${className}`}
  >
    <motion.ellipse
      cx="24"
      cy="24"
      rx="18"
      ry="18"
      stroke="#3B82F6"
      strokeWidth="3.2"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    />
  </svg>
);

export const InteractivePhoneGuide: React.FC<InteractivePhoneGuideProps> = ({ onUploadClick }) => {
  const [platform, setPlatform] = useState<'android' | 'ios'>('android');
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Seamless continuous video-like flow (no pauses, constantly advancing)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
    }, 3800);

    return () => clearInterval(timer);
  }, [platform]);

  return (
    <section className="relative rounded-3xl bg-gradient-to-b from-[#0B0F14] via-[#080B0F] to-[#040608] border border-white/10 p-6 sm:p-12 shadow-2xl overflow-hidden font-sans">
      
      {/* Background ambient glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#2563eb]/20 via-[#00A884]/15 to-transparent rounded-full blur-[130px] pointer-events-none" />

      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-sky-400/30 shadow-glow-blue">
          <Smartphone className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px] font-mono font-bold text-sky-300 uppercase tracking-wider">
            WhatsApp Dışa Aktarma Canlı Rehberi
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          WhatsApp Sohbetinizi Nasıl Dışa Aktarırsınız?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {platform === 'android' ? 'Android' : 'iPhone (iOS)'} cihazınızdaki gerçek ekran akışını canlı animasyon ile izleyin.
        </p>

        {/* Platform selection pills */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <div className="inline-flex p-1 rounded-2xl bg-[#141A22] border border-white/10 shadow-lg">
            <button
              type="button"
              onClick={() => {
                setPlatform('android');
                setCurrentStep(0);
              }}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                platform === 'android'
                  ? 'bg-[#00A884] text-white shadow-[0_0_15px_rgba(0,168,132,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Android</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPlatform('ios');
                setCurrentStep(0);
              }}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                platform === 'ios'
                  ? 'bg-[#0A84FF] text-white shadow-[0_0_15px_rgba(10,132,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Apple className="w-4 h-4" />
              <span>iPhone (iOS)</span>
            </button>
          </div>
        </div>
      </div>

      {/* CENTERED ULTRA-REALISTIC PHONE MOCKUP */}
      <div className="flex justify-center items-center relative z-10 max-w-xl mx-auto my-2">
        
        {/* Phone Outer Chassis */}
        <div className="w-[325px] sm:w-[365px] h-[640px] sm:h-[680px] rounded-[52px] bg-[#171B21] p-3.5 shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-[5px] border-[#2B323D] relative select-none">
          
          {/* Physical Side Buttons */}
          <div className="absolute -left-[8px] top-24 w-[3px] h-10 bg-[#4B5563] rounded-l-md" />
          <div className="absolute -left-[8px] top-38 w-[3px] h-14 bg-[#4B5563] rounded-l-md" />
          <div className="absolute -right-[8px] top-30 w-[3px] h-16 bg-[#4B5563] rounded-r-md" />

          {/* Screen Inner Display */}
          <div className="w-full h-full rounded-[42px] bg-[#0B141A] overflow-hidden flex flex-col relative text-white border border-white/5 font-sans">
            
            {/* Dynamic Island / Top Camera Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 flex items-center justify-end px-2 pointer-events-none shadow-md">
              <div className="w-2 h-2 rounded-full bg-[#111A24]" />
            </div>

            {/* Status Bar */}
            <div className="h-8 bg-[#0B141A] pt-1.5 px-6 flex items-center justify-between text-[10px] font-semibold text-slate-300 z-30 shrink-0 border-b border-white/5">
              <span>16:17</span>
              <div className="flex items-center gap-1.5 text-[9px]">
                <span>LTE</span>
                <span className="bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-mono font-bold">35</span>
              </div>
            </div>

            {/* SVG WhatsApp Doodle Wallpaper Pattern */}
            <div
              className="absolute inset-0 top-8 bottom-4 pointer-events-none opacity-[0.07] z-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20 L25 15 L30 20 Z M60 20 C60 15, 70 15, 70 20 C70 25, 60 25, 60 20 Z M95 30 L105 30 L100 20 Z M30 70 A 8 8 0 1 0 30 86 A 8 8 0 1 0 30 70 Z M80 75 Q85 65, 95 75 T110 75 M15 100 L25 105 L20 115 Z' stroke='%23ffffff' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                backgroundSize: '120px 120px',
              }}
            />

            {/* SCREEN VIEWPORT: iOS vs Android */}
            <div className="flex-1 relative overflow-hidden flex flex-col z-10">
              <AnimatePresence mode="wait">
                
                {/* ========================================================================= */}
                {/* ANDROID FLOW (Exact replica of User Screenshots 1, 2, 3)                */}
                {/* ========================================================================= */}
                {platform === 'android' && (
                  <motion.div
                    key={`android-step-${currentStep}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex flex-col justify-between relative"
                  >
                    {/* Android WhatsApp Header */}
                    <div className="bg-[#0B141A] px-3 py-2.5 flex items-center justify-between border-b border-white/5 shrink-0 z-20">
                      <div className="flex items-center gap-2.5">
                        <ChevronLeft className="w-4 h-4 text-slate-300" />
                        <div className="w-8 h-8 rounded-full bg-[#A3704C] text-[#F3E5AB] font-bold text-xs flex items-center justify-center shadow-inner">
                          MS
                        </div>
                        <div>
                          <h5 className="text-[13px] font-semibold text-white leading-tight">
                            merve sarıcıvciv
                          </h5>
                        </div>
                      </div>

                      <div className="flex items-center gap-3.5 text-slate-200 relative">
                        <Video className="w-4 h-4" />
                        <Phone className="w-3.5 h-3.5" />
                        
                        {/* 3 DOTS TRIGGER (Highlighted cleanly with Blue Circle Marker) */}
                        <div className="relative p-1 flex items-center justify-center">
                          <MoreVertical className="w-4 h-4 text-slate-200 relative z-10" />

                          {currentStep === 0 && (
                            <BlueCircleMarker className="-inset-2.5 w-9 h-9" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages Body */}
                    <div className="p-3 space-y-2 flex-1 overflow-hidden relative text-xs">
                      
                      {/* Received Message 1 */}
                      <div className="bg-[#1F2C34] p-2 rounded-2xl rounded-tl-none max-w-[82%] text-slate-200 shadow-sm space-y-0.5">
                        <p className="text-[11px] leading-relaxed">Ay gozukmuyo acaba yapmadım mı</p>
                        <span className="text-[8px] text-slate-400 block text-right">16:04</span>
                      </div>

                      {/* Sent with Quote */}
                      <div className="bg-[#005C4B] p-2 rounded-2xl rounded-tr-none max-w-[82%] ml-auto text-white shadow-sm space-y-1">
                        <div className="bg-[#025142] p-1.5 rounded-lg border-l-2 border-emerald-300 text-[9px] text-emerald-100">
                          <span className="font-bold block text-emerald-200">Siz</span>
                          <span>onda varmı</span>
                        </div>
                        <p className="text-[11px]">Bılmıyom dedi</p>
                        <span className="text-[8px] text-emerald-200 block text-right">16:04 ✓✓</span>
                      </div>

                      {/* Sent 2 */}
                      <div className="bg-[#005C4B] px-2.5 py-1.5 rounded-2xl rounded-tr-none max-w-[65%] ml-auto text-white shadow-sm flex items-center justify-between text-[11px]">
                        <span>iki dakika</span>
                        <span className="text-[8px] text-emerald-200 pl-2">16:04 ✓✓</span>
                      </div>

                      {/* Sent 3 */}
                      <div className="bg-[#005C4B] px-2.5 py-1.5 rounded-2xl rounded-tr-none max-w-[65%] ml-auto text-white shadow-sm flex items-center justify-between text-[11px]">
                        <span>alıksındır</span>
                        <span className="text-[8px] text-emerald-200 pl-2">16:04 ✓✓</span>
                      </div>

                      {/* ANDROID STEP 1: Main Dropdown Menu with Clean Blue Marker around "Diğer" */}
                      {currentStep === 1 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.94, y: -8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="absolute top-1 right-2 w-52 bg-[#1F2C34] rounded-xl shadow-2xl border border-white/10 py-1 text-xs text-slate-200 z-30 divide-y divide-white/5"
                        >
                          <div className="py-0.5">
                            <div className="px-3.5 py-1.5 opacity-70 text-[11px]">Yeni grup</div>
                            <div className="px-3.5 py-1.5 opacity-70 text-[11px]">Kişiyi görüntüle</div>
                            <div className="px-3.5 py-1.5 opacity-70 text-[11px]">Ara</div>
                            <div className="px-3.5 py-1.5 opacity-70 text-[11px]">Medya, bağlantı ve belgeler</div>
                            <div className="px-3.5 py-1.5 opacity-70 text-[11px]">Bildirimleri sessize al</div>
                            <div className="px-3.5 py-1.5 opacity-70 text-[11px]">Süreli mesajlar</div>
                            <div className="px-3.5 py-1.5 opacity-70 text-[11px]">Sohbet teması</div>
                          </div>
                          
                          {/* TARGET: Diğer with Blue Capsule Marker */}
                          <div className="px-3.5 py-2.5 text-white font-bold text-[12px] flex items-center justify-between relative">
                            <span className="relative z-10">Diğer</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 relative z-10" />
                            
                            <BlueCapsuleMarker className="-inset-x-2 -inset-y-1.5 w-[calc(100%+16px)] h-[calc(100%+12px)]" />
                          </div>
                        </motion.div>
                      )}

                      {/* ANDROID STEP 2: Secondary "Diğer" Menu with Blue Marker around "Sohbeti dışa aktar" */}
                      {currentStep === 2 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.94, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="absolute top-14 right-4 w-48 bg-[#1F2C34] rounded-xl shadow-2xl border border-white/10 py-1.5 text-xs text-slate-200 z-30 space-y-0.5"
                        >
                          <div className="px-3.5 py-1.5 opacity-70 text-[11px]">Şikayet et</div>
                          <div className="px-3.5 py-1.5 opacity-70 text-[11px]">Engelle</div>
                          <div className="px-3.5 py-1.5 opacity-70 text-[11px]">Sohbeti temizle</div>
                          
                          {/* TARGET: Sohbeti dışa aktar with Blue Capsule Marker */}
                          <div className="px-3.5 py-2 text-white font-bold text-[11.5px] relative">
                            <span className="relative z-10">Sohbeti dışa aktar</span>

                            <BlueCapsuleMarker className="-inset-x-2 -inset-y-1.5 w-[calc(100%+16px)] h-[calc(100%+12px)]" />
                          </div>

                          <div className="px-3.5 py-1.5 opacity-70 text-[11px]">Kısayol ekle</div>
                          <div className="px-3.5 py-1.5 opacity-70 text-[11px]">Listeye ekle</div>
                        </motion.div>
                      )}

                      {/* ANDROID STEP 3: "Medya eklensin mi?" Dialog with Blue Marker around MEDYASIZ */}
                      {currentStep === 3 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 bg-black/75 backdrop-blur-[2px] z-40 flex items-center justify-center p-3"
                        >
                          <div className="bg-[#1F2C34] rounded-3xl p-5 border border-white/10 shadow-2xl space-y-3.5 w-full max-w-[280px]">
                            <h4 className="text-xs font-bold text-white">Medya eklensin mi?</h4>
                            <p className="text-[10px] text-slate-300 leading-relaxed">
                              Medya eklemek sohbet dışa aktarma boyutunu artırır.
                            </p>

                            <div className="flex items-center justify-end gap-3 pt-2">
                              <span className="text-[10px] text-slate-400 font-semibold px-2 py-1">
                                MEDYAYI EKLE
                              </span>
                              
                              {/* TARGET: MEDYASIZ */}
                              <div className="relative px-3.5 py-1.5 rounded-lg bg-[#00A884] text-white font-bold text-[11px] shadow-glow-emerald">
                                <span className="relative z-10">MEDYASIZ</span>
                                <BlueCapsuleMarker className="-inset-x-2 -inset-y-1.5 w-[calc(100%+16px)] h-[calc(100%+12px)]" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                    </div>

                    {/* Android Chat Input Bar */}
                    <div className="p-2 bg-[#0B141A] flex items-center gap-2 border-t border-white/5 shrink-0">
                      <div className="flex-1 bg-[#1F2C34] rounded-full px-3 py-2 text-[11px] text-slate-400 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Smile className="w-3.5 h-3.5 text-slate-400" />
                          <span>Mesaj</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-400">
                          <Paperclip className="w-3.5 h-3.5" />
                          <Camera className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#00A884] text-white flex items-center justify-center shadow-md">
                        <Mic className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ========================================================================= */}
                {/* iOS FLOW (Exact replica of User Screenshots 1, 2, 3, 4)                  */}
                {/* ========================================================================= */}
                {platform === 'ios' && (
                  <motion.div
                    key={`ios-step-${currentStep}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex flex-col justify-between relative bg-black"
                  >
                    {/* iOS STEP 0: Chat Screen with Blue Marker on Header */}
                    {currentStep === 0 && (
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="bg-[#161719] px-3 py-2 flex items-center justify-between border-b border-white/10 shrink-0">
                          <div className="flex items-center gap-1 text-white text-xs font-semibold">
                            <ChevronLeft className="w-4 h-4 -mr-1" />
                            <span>2</span>
                          </div>

                          {/* Center: Tap Target for Contact Info */}
                          <div className="flex items-center gap-2 relative">
                            <div className="w-7 h-7 rounded-full bg-[#A3704C] text-[#F3E5AB] text-[10px] font-bold flex items-center justify-center relative z-10">
                              MS
                            </div>
                            <div className="text-left relative z-10">
                              <h5 className="text-xs font-bold text-white leading-tight">
                                merve sarıcıvciv
                              </h5>
                              <span className="text-[8.5px] text-slate-400 block leading-tight">
                                kişi bilgisi için dokunun
                              </span>
                            </div>

                            <BlueCapsuleMarker className="-inset-x-3 -inset-y-1.5 w-[calc(100%+24px)] h-[calc(100%+12px)]" />
                          </div>

                          <div className="flex items-center gap-2 text-white">
                            <div className="w-7 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                              <Video className="w-3.5 h-3.5" />
                            </div>
                            <div className="w-7 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                              <Phone className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="p-3 space-y-2 flex-1 text-xs">
                          <div className="bg-[#1C1C1E] p-2 rounded-2xl rounded-tl-none max-w-[80%] text-slate-200">
                            <p className="text-[11px]">Ay gozukmuyo acaba yapmadım mı</p>
                            <span className="text-[8px] text-slate-400 block text-right">16:04</span>
                          </div>

                          <div className="bg-[#3A2922] p-2 rounded-2xl rounded-tr-none max-w-[80%] ml-auto text-white">
                            <p className="text-[11px]">bakaydı</p>
                            <span className="text-[8px] text-slate-300 block text-right">16:04 ✓✓</span>
                          </div>
                        </div>

                        {/* iOS Input Bar */}
                        <div className="p-2 bg-[#161719] flex items-center gap-2 border-t border-white/10 shrink-0">
                          <Plus className="w-5 h-5 text-white" />
                          <div className="flex-1 bg-[#242528] rounded-full px-3 py-1.5 text-[11px] text-slate-400 flex items-center justify-between">
                            <span />
                            <Sticker className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <Camera className="w-4 h-4 text-white" />
                          <Mic className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    {/* iOS STEP 1: Contact Info Page - Top Section & Scroll Down Indicator */}
                    {currentStep === 1 && (
                      <div className="flex-1 flex flex-col justify-between bg-black p-3 space-y-2.5 overflow-hidden">
                        <div className="flex items-center justify-between text-xs">
                          <div className="w-6 h-6 rounded-full bg-[#1C1C1E] flex items-center justify-center text-white">
                            <ChevronLeft className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-white text-xs">Kişi bilgisi</span>
                          <span className="bg-[#1C1C1E] text-white px-2.5 py-0.5 rounded-full text-[10px]">Düzenle</span>
                        </div>

                        {/* Profile Avatar & Name */}
                        <div className="text-center space-y-1">
                          <div className="w-14 h-14 rounded-full bg-[#A3704C] text-[#F3E5AB] text-xl font-bold flex items-center justify-center mx-auto shadow-md">
                            MS
                          </div>
                          <h4 className="text-xs font-bold text-white">merve sarıcıvciv</h4>
                          <p className="text-[9px] text-slate-400">+90 551 639 33 69</p>
                        </div>

                        {/* 3 Green Action Buttons (Sesli, Görüntülü, Ara) */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2 rounded-2xl bg-[#1C1C1E] text-center text-[9px] text-emerald-400 space-y-0.5">
                            <Phone className="w-3.5 h-3.5 mx-auto" />
                            <span className="text-white block">Sesli</span>
                          </div>
                          <div className="p-2 rounded-2xl bg-[#1C1C1E] text-center text-[9px] text-emerald-400 space-y-0.5">
                            <Video className="w-3.5 h-3.5 mx-auto" />
                            <span className="text-white block">Görüntülü</span>
                          </div>
                          <div className="p-2 rounded-2xl bg-[#1C1C1E] text-center text-[9px] text-emerald-400 space-y-0.5">
                            <Search className="w-3.5 h-3.5 mx-auto" />
                            <span className="text-white block">Ara</span>
                          </div>
                        </div>

                        {/* List Cards */}
                        <div className="bg-[#1C1C1E] rounded-2xl p-2.5 text-[10px] text-slate-200 divide-y divide-white/5 space-y-1.5">
                          <div className="flex items-center justify-between pb-1">
                            <span>Medya, bağlantı ve belgeler</span>
                            <span className="text-slate-400 text-[9px]">150 ➔</span>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span>Depolama alanını yönet</span>
                            <span className="text-slate-400 text-[9px]">64,8 MB ➔</span>
                          </div>
                        </div>

                        {/* Animated Scroll Down Prompt */}
                        <motion.div
                          animate={{ y: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.2 }}
                          className="text-center py-2 px-3 rounded-2xl bg-[#1C1C1E] border border-sky-400/40 text-[10px] font-mono font-bold text-sky-400 flex items-center justify-center gap-1.5 shadow-glow-blue"
                        >
                          <span>⬇️ Aşağı Kaydırılıyor (Scroll Down)</span>
                        </motion.div>
                      </div>
                    )}

                    {/* iOS STEP 2: Contact Info Page - Bottom Section with "Sohbeti dışa aktar" Highlight */}
                    {currentStep === 2 && (
                      <div className="flex-1 flex flex-col justify-between bg-black p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs pb-1">
                          <div className="w-6 h-6 rounded-full bg-[#1C1C1E] flex items-center justify-center text-white">
                            <ChevronLeft className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-white text-xs">merve sarıcıvciv</span>
                          <span className="bg-[#1C1C1E] text-white px-2 py-0.5 rounded-full text-[10px]">Düzenle</span>
                        </div>

                        <div className="text-[10px] text-slate-400 font-bold px-1">2 ortak grup</div>

                        <div className="bg-[#1C1C1E] rounded-2xl p-2 text-[10px] space-y-1">
                          <div className="flex items-center gap-2 text-white">
                            <Users className="w-3.5 h-3.5 text-pink-400" />
                            <span>EFE KURS 2026 SINAV GRUBU</span>
                          </div>
                        </div>

                        {/* Actions List with Clean Blue Marker around Sohbeti dışa aktar */}
                        <div className="bg-[#1C1C1E] rounded-2xl divide-y divide-white/5 text-[11px]">
                          <div className="p-2 text-emerald-400">Kişiyi paylaş</div>
                          <div className="p-2 text-emerald-400">Favoriler'e ekle</div>
                          <div className="p-2 text-emerald-400">Listeye ekle</div>
                          
                          {/* TARGET: Sohbeti dışa aktar */}
                          <div className="p-2.5 text-white font-bold relative">
                            <span className="relative z-10">Sohbeti dışa aktar</span>
                            <BlueCapsuleMarker className="-inset-x-2.5 -inset-y-1.5 w-[calc(100%+20px)] h-[calc(100%+12px)]" />
                          </div>

                          <div className="p-2 text-red-400 opacity-70">Sohbeti temizle</div>
                        </div>

                        <div className="bg-[#1C1C1E] rounded-2xl p-2 text-[10px] text-red-500 opacity-70">
                          <div>merve sarıcıvciv kişisini engelle</div>
                        </div>
                      </div>
                    )}

                    {/* iOS STEP 3: Action Sheet Modal ("Medyayı ekleme" Highlighted) */}
                    {currentStep === 3 && (
                      <div className="flex-1 flex flex-col justify-end bg-black/85 backdrop-blur-[2px] p-3 relative">
                        
                        {/* iOS Bottom Sheet (Exact replica of Image 4) */}
                        <motion.div
                          initial={{ y: 60, opacity: 0 }}
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

                            {/* Option 2: Medyayı ekleme (TARGET with Clean Blue Capsule Marker) */}
                            <div className="p-3 rounded-2xl bg-[#2C2C2E] text-white font-bold text-xs flex items-center justify-between relative">
                              <div className="flex items-center gap-2 relative z-10">
                                <FileText className="w-4 h-4 text-white" />
                                <span>Medyayı ekleme</span>
                              </div>

                              <BlueCapsuleMarker className="-inset-x-2 -inset-y-1.5 w-[calc(100%+16px)] h-[calc(100%+12px)]" />
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}

                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Bottom Home Bar Indicator */}
            <div className="h-4 bg-black flex items-center justify-center pb-1 shrink-0">
              <div className="w-28 h-1 bg-slate-600 rounded-full" />
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Quick Upload Action */}
      {onUploadClick && (
        <div className="mt-6 text-center relative z-10">
          <Button
            variant="blue"
            size="lg"
            onClick={onUploadClick}
            className="font-bold text-sm shadow-glow-blue px-8 py-3.5"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Hazırım, WhatsApp Sohbetini Yükle</span>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <p className="text-[11px] text-slate-500 font-mono mt-2 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>%100 Güvenli • Verileriniz sunucuda asla saklanmaz</span>
          </p>
        </div>
      )}

    </section>
  );
};
