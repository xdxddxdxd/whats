'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
  Check,
  CheckCheck,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface InteractivePhoneGuideProps {
  onUploadClick?: () => void;
}

// Gentle translucent finger tap ripple effect
const TapRipple: React.FC<{ className?: string }> = ({ className = '' }) => (
  <motion.div
    initial={{ scale: 0.4, opacity: 0.9 }}
    animate={{ scale: 2.2, opacity: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    className={`absolute w-8 h-8 rounded-full bg-white/40 border-2 border-white/80 pointer-events-none z-50 ${className}`}
  />
);

export const InteractivePhoneGuide: React.FC<InteractivePhoneGuideProps> = ({ onUploadClick }) => {
  // Independent timeline phases for both phones (0: Chat, 1: Open Menu / Info, 2: Submenu / Scroll Down, 3: Export Dialog / Sheet)
  const [androidPhase, setAndroidPhase] = useState<number>(0);
  const [iosPhase, setIosPhase] = useState<number>(0);

  // Android Infinite Autonomous Loop
  useEffect(() => {
    const androidInterval = setInterval(() => {
      setAndroidPhase((prev) => (prev + 1) % 4);
    }, 3800);
    return () => clearInterval(androidInterval);
  }, []);

  // iOS Infinite Autonomous Loop (slightly offset for natural dual rhythm)
  useEffect(() => {
    const iosInterval = setInterval(() => {
      setIosPhase((prev) => (prev + 1) % 4);
    }, 4200);
    return () => clearInterval(iosInterval);
  }, []);

  return (
    <section className="relative rounded-3xl bg-gradient-to-b from-[#090D12] via-[#06080B] to-[#030406] border border-white/10 p-6 sm:p-12 shadow-2xl overflow-hidden font-sans">
      
      {/* Background ambient lighting */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[300px] bg-[#00A884]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -top-32 right-1/4 w-[500px] h-[300px] bg-[#0A84FF]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-sky-400/30 shadow-glow-blue">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px] font-mono font-bold text-sky-300 uppercase tracking-wider">
            Canlı WhatsApp Dışa Aktarma Demosu
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Sohbetinizi 5 Saniyede Dışa Aktarın
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Android ve iPhone cihazlar için WhatsApp'ın kendi arayüzündeki kesintisiz dışa aktarma akışını canlı izleyin.
        </p>
      </div>

      {/* DUAL PHONES CONTAINER: ANDROID (LEFT) & IPHONE (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto relative z-10 items-center justify-center">
        
        {/* ========================================================================= */}
        {/* 1. LEFT PHONE: ANDROID WHATSAPP DEMO                                      */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center">
          
          {/* Platform Label */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00A884] animate-pulse" />
            <h3 className="text-sm sm:text-base font-extrabold text-[#2DD4BF] tracking-wide uppercase font-mono">
              ANDROID
            </h3>
          </div>

          {/* Android Phone Shell */}
          <div className="w-[305px] sm:w-[335px] h-[590px] sm:h-[620px] rounded-[44px] bg-[#14181D] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.9)] border-[4px] border-[#2A313C] relative select-none">
            
            {/* Camera Punch Hole */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-40 flex items-center justify-center pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1C2733]" />
            </div>

            {/* Screen Viewport */}
            <div className="w-full h-full rounded-[34px] bg-[#0B141A] overflow-hidden flex flex-col relative text-white border border-white/5 font-sans">
              
              {/* Android Status Bar */}
              <div className="h-7 bg-[#1F2C34] pt-1 px-5 flex items-center justify-between text-[10px] font-semibold text-slate-300 z-30 shrink-0">
                <span>11:50</span>
                <div className="flex items-center gap-1.5 text-[9px]">
                  <span>LTE</span>
                  <span>%80</span>
                </div>
              </div>

              {/* WhatsApp Doodle Pattern */}
              <div
                className="absolute inset-0 top-7 bottom-0 pointer-events-none opacity-[0.06] z-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 15 L20 10 L25 15 Z M50 15 C50 10, 60 10, 60 15 Z M20 60 A 6 6 0 1 0 20 72 A 6 6 0 1 0 20 60 Z M70 65 Q75 55, 85 65 T95 65' stroke='%23ffffff' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                  backgroundSize: '100px 100px',
                }}
              />

              {/* Android Top Header */}
              <div className="bg-[#1F2C34] px-3 py-2 flex items-center justify-between border-b border-white/5 shrink-0 z-20 shadow-sm">
                <div className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4 text-slate-300" />
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-xs text-white font-bold">
                    👥
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white leading-tight">
                      Arkadaşlar Grubu
                    </h5>
                    <span className="text-[9px] text-slate-400 block leading-tight">
                      Ahmet, Ayşe, Sen
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-200 relative">
                  <Video className="w-4 h-4" />
                  <Phone className="w-3.5 h-3.5" />
                  
                  {/* 3 DOTS (Triggered with Tap Ripple on Phase 0) */}
                  <div className="relative p-0.5">
                    <MoreVertical className="w-4 h-4 text-slate-200" />
                    {androidPhase === 0 && <TapRipple className="-top-1.5 -left-1.5" />}
                  </div>
                </div>
              </div>

              {/* Chat Viewport Area */}
              <div className="flex-1 relative overflow-hidden flex flex-col justify-between z-10">
                
                {/* Chat Messages */}
                <div className="p-2.5 space-y-1.5 flex-1 overflow-hidden relative text-xs">
                  
                  {/* Security Banner */}
                  <div className="bg-[#182229] p-1.5 rounded-lg text-center mx-3 my-0.5 space-y-0.5 shadow-sm">
                    <p className="text-[8px] text-[#FFD279] leading-tight">
                      🔒 Mesajlar ve aramalar uçtan uca şifrelidir.
                    </p>
                  </div>

                  {/* Message 1 (Ahmet) */}
                  <div className="bg-[#1F2C34] px-2.5 py-1 rounded-xl rounded-tl-none max-w-[78%] text-slate-200 shadow-sm space-y-0.5">
                    <span className="text-[9px] text-orange-400 font-bold block leading-tight">Ahmet</span>
                    <p className="text-[10.5px] leading-tight">Herkese merhaba!</p>
                    <span className="text-[7.5px] text-slate-400 block text-right">11:45</span>
                  </div>

                  {/* Message 2 (You) */}
                  <div className="bg-[#005C4B] px-2.5 py-1 rounded-xl rounded-tr-none max-w-[78%] ml-auto text-white shadow-sm space-y-0.5">
                    <p className="text-[10.5px] leading-tight">Merhaba Ahmet 👋</p>
                    <span className="text-[7.5px] text-emerald-200 block text-right">11:46 ✓✓</span>
                  </div>

                  {/* Message 3 (Ayşe) */}
                  <div className="bg-[#1F2C34] px-2.5 py-1 rounded-xl rounded-tl-none max-w-[78%] text-slate-200 shadow-sm space-y-0.5">
                    <span className="text-[9px] text-pink-400 font-bold block leading-tight">Ayşe</span>
                    <p className="text-[10.5px] leading-tight">Nasılsınız?</p>
                    <span className="text-[7.5px] text-slate-400 block text-right">11:46</span>
                  </div>

                  {/* Message 4 (You) */}
                  <div className="bg-[#005C4B] px-2.5 py-1 rounded-xl rounded-tr-none max-w-[78%] ml-auto text-white shadow-sm space-y-0.5">
                    <p className="text-[10.5px] leading-tight">İyiyiz, sen nasılsın Ayşe?</p>
                    <span className="text-[7.5px] text-emerald-200 block text-right">11:47 ✓✓</span>
                  </div>

                  {/* Message 5 (You) */}
                  <div className="bg-[#005C4B] px-2.5 py-1 rounded-xl rounded-tr-none max-w-[78%] ml-auto text-white shadow-sm space-y-0.5">
                    <p className="text-[10.5px] leading-tight">Evet, 6 tamam 👍</p>
                    <span className="text-[7.5px] text-emerald-200 block text-right">11:50 ✓✓</span>
                  </div>

                  {/* ANDROID OVERLAY 1: Dropdown Menu (Phase 1) */}
                  <AnimatePresence>
                    {androidPhase === 1 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="absolute top-1 right-2 w-48 bg-[#233138] rounded-xl shadow-2xl border border-white/10 py-1 text-xs text-slate-200 z-30 divide-y divide-white/5"
                      >
                        <div className="py-0.5">
                          <div className="px-3 py-1 opacity-70 text-[10.5px]">Grup bilgisi</div>
                          <div className="px-3 py-1 opacity-70 text-[10.5px]">Grup medyası</div>
                          <div className="px-3 py-1 opacity-70 text-[10.5px]">Ara</div>
                          <div className="px-3 py-1 opacity-70 text-[10.5px]">Sessize al</div>
                          <div className="px-3 py-1 opacity-70 text-[10.5px]">Süreli mesajlar</div>
                        </div>
                        
                        {/* Diğer ▸ Option with Natural Tap */}
                        <div className="px-3 py-1.5 bg-[#00A884]/20 text-white font-bold text-[11px] flex items-center justify-between relative">
                          <span>Diğer</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          <TapRipple className="right-4 top-0.5" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ANDROID OVERLAY 2: Submenu "Sohbeti dışa aktar" (Phase 2) */}
                  <AnimatePresence>
                    {androidPhase === 2 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="absolute top-12 right-4 w-44 bg-[#233138] rounded-xl shadow-2xl border border-white/10 py-1 text-xs text-slate-200 z-30 space-y-0.5"
                      >
                        <div className="px-3 py-1 opacity-70 text-[10.5px]">Rapor et</div>
                        <div className="px-3 py-1 opacity-70 text-[10.5px]">Gruptan çık</div>
                        <div className="px-3 py-1 opacity-70 text-[10.5px]">Sohbeti temizle</div>
                        
                        {/* Sohbeti dışa aktar Option with Natural Tap */}
                        <div className="px-3 py-1.5 bg-[#00A884]/30 text-[#2DD4BF] font-bold text-[11px] relative rounded-md">
                          <span>Sohbeti dışa aktar</span>
                          <TapRipple className="right-4 top-0" />
                        </div>

                        <div className="px-3 py-1 opacity-70 text-[10.5px]">Kısayol ekle</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ANDROID OVERLAY 3: "Medya eklensin mi?" Dialog (Phase 3) */}
                  <AnimatePresence>
                    {androidPhase === 3 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 bg-black/75 backdrop-blur-[2px] z-40 flex items-center justify-center p-3"
                      >
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-[#233138] rounded-3xl p-4 border border-white/10 shadow-2xl space-y-3 w-full max-w-[260px]"
                        >
                          <h4 className="text-xs font-bold text-white">Medya eklensin mi?</h4>
                          <p className="text-[9.5px] text-slate-300 leading-relaxed">
                            Medya eklemek sohbet dışa aktarma boyutunu artırır.
                          </p>

                          <div className="flex items-center justify-end gap-2 pt-1.5">
                            <span className="text-[9.5px] text-slate-400 font-semibold px-2 py-1">
                              MEDYAYI EKLE
                            </span>
                            
                            {/* MEDYASIZ Button with Tap Ripple */}
                            <div className="relative px-3 py-1 rounded-lg bg-[#00A884] text-white font-bold text-[10.5px] shadow-glow-emerald">
                              <span>MEDYASIZ</span>
                              <TapRipple className="-top-1 -right-1" />
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* Android Bottom Input Bar */}
                <div className="p-2 bg-[#1F2C34] flex items-center gap-2 border-t border-white/5 shrink-0">
                  <div className="flex-1 bg-[#2A3942] rounded-full px-3 py-1.5 text-[10px] text-slate-400 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Smile className="w-3.5 h-3.5 text-slate-400" />
                      <span>Mesaj</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Paperclip className="w-3.5 h-3.5" />
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#00A884] text-white flex items-center justify-center shadow-md">
                    <Mic className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>

              {/* Android Home Navigation Bar */}
              <div className="h-3.5 bg-[#1F2C34] flex items-center justify-center pb-0.5 shrink-0">
                <div className="w-24 h-0.5 bg-slate-600 rounded-full" />
              </div>

            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. RIGHT PHONE: IPHONE (iOS) WHATSAPP DEMO                                */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center">
          
          {/* Platform Label */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0A84FF] animate-pulse" />
            <h3 className="text-sm sm:text-base font-extrabold text-[#38BDF8] tracking-wide uppercase font-mono">
              IPHONE (iOS)
            </h3>
          </div>

          {/* iPhone Phone Shell */}
          <div className="w-[305px] sm:w-[335px] h-[590px] sm:h-[620px] rounded-[44px] bg-[#171B21] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.9)] border-[4px] border-[#2A313C] relative select-none">
            
            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-40 flex items-center justify-end px-1.5 pointer-events-none shadow-md">
              <div className="w-1.5 h-1.5 rounded-full bg-[#111A24]" />
            </div>

            {/* Screen Viewport */}
            <div className="w-full h-full rounded-[34px] bg-black overflow-hidden flex flex-col relative text-white border border-white/5 font-sans">
              
              {/* iOS Status Bar */}
              <div className="h-7 bg-[#1C1C1E] pt-1 px-5 flex items-center justify-between text-[10px] font-semibold text-slate-300 z-30 shrink-0">
                <span>11:50</span>
                <div className="flex items-center gap-1 text-[9px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* iOS FLOW SCREENS (Switch smoothly with real scroll down on Group Info) */}
              <div className="flex-1 relative overflow-hidden flex flex-col justify-between z-10 bg-black">
                
                {/* ------------------------------------------------------------- */}
                {/* SCREEN A: iOS Chat Screen (Phase 0)                          */}
                {/* ------------------------------------------------------------- */}
                {iosPhase === 0 && (
                  <motion.div
                    key="ios-chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    {/* iOS Navigation Header */}
                    <div className="bg-[#1C1C1E] px-3 py-1.5 flex items-center justify-between border-b border-white/10 shrink-0">
                      <div className="flex items-center gap-1 text-[#0A84FF] text-xs font-medium">
                        <ChevronLeft className="w-4 h-4 -mr-1" />
                        <span>Sohbetler</span>
                      </div>

                      {/* Header Title with Tap Ripple */}
                      <div className="flex items-center gap-2 relative">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-xs text-white">
                          👥
                        </div>
                        <div className="text-left">
                          <h5 className="text-xs font-bold text-white leading-tight">
                            Arkadaşlar Grubu
                          </h5>
                          <span className="text-[8.5px] text-slate-400 block leading-tight">
                            Ahmet, Ayşe, Siz
                          </span>
                        </div>
                        <TapRipple className="-top-1 -right-2" />
                      </div>

                      <div className="flex items-center gap-2 text-[#0A84FF]">
                        <Video className="w-3.5 h-3.5" />
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* iOS Chat Messages */}
                    <div className="p-2.5 space-y-1.5 flex-1 overflow-hidden relative text-xs">
                      {/* Security Banner */}
                      <div className="bg-[#1C1C1E] p-1.5 rounded-xl text-center mx-2 my-0.5 space-y-0.5">
                        <p className="text-[8px] text-slate-400 leading-tight">
                          🔒 Mesajlar ve aramalar uçtan uca şifrelidir.
                        </p>
                      </div>

                      {/* Message 1 (Ahmet) */}
                      <div className="bg-[#1C1C1E] px-2.5 py-1 rounded-2xl rounded-tl-none max-w-[78%] text-slate-200 shadow-sm space-y-0.5">
                        <span className="text-[9px] text-[#38BDF8] font-bold block leading-tight">Ahmet</span>
                        <p className="text-[10.5px] leading-tight">Herkese merhaba!</p>
                        <span className="text-[7.5px] text-slate-400 block text-right">11:45</span>
                      </div>

                      {/* Message 2 (You) */}
                      <div className="bg-[#005C4B] px-2.5 py-1 rounded-2xl rounded-tr-none max-w-[78%] ml-auto text-white shadow-sm space-y-0.5">
                        <p className="text-[10.5px] leading-tight">Merhaba Ahmet 👋</p>
                        <span className="text-[7.5px] text-emerald-200 block text-right">11:46 ✓✓</span>
                      </div>

                      {/* Message 3 (Ayşe) */}
                      <div className="bg-[#1C1C1E] px-2.5 py-1 rounded-2xl rounded-tl-none max-w-[78%] text-slate-200 shadow-sm space-y-0.5">
                        <span className="text-[9px] text-pink-400 font-bold block leading-tight">Ayşe</span>
                        <p className="text-[10.5px] leading-tight">Nasılsınız?</p>
                        <span className="text-[7.5px] text-slate-400 block text-right">11:46</span>
                      </div>

                      {/* Message 4 (You) */}
                      <div className="bg-[#005C4B] px-2.5 py-1 rounded-2xl rounded-tr-none max-w-[78%] ml-auto text-white shadow-sm space-y-0.5">
                        <p className="text-[10.5px] leading-tight">İyiyiz, sen nasılsın Ayşe?</p>
                        <span className="text-[7.5px] text-emerald-200 block text-right">11:47 ✓✓</span>
                      </div>

                      {/* Message 5 (You) */}
                      <div className="bg-[#005C4B] px-2.5 py-1 rounded-2xl rounded-tr-none max-w-[78%] ml-auto text-white shadow-sm space-y-0.5">
                        <p className="text-[10.5px] leading-tight">Evet, 6 tamam 👍</p>
                        <span className="text-[7.5px] text-emerald-200 block text-right">11:50 ✓✓</span>
                      </div>
                    </div>

                    {/* iOS Bottom Input Bar */}
                    <div className="p-2 bg-[#1C1C1E] flex items-center gap-2 border-t border-white/10 shrink-0">
                      <Plus className="w-4 h-4 text-[#0A84FF]" />
                      <div className="flex-1 bg-[#2C2C2E] rounded-full px-3 py-1 text-[10px] text-slate-400 flex items-center justify-between">
                        <span />
                        <Sticker className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <Camera className="w-3.5 h-3.5 text-[#0A84FF]" />
                      <Mic className="w-3.5 h-3.5 text-[#0A84FF]" />
                    </div>
                  </motion.div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SCREEN B: iOS Group Info with REAL SMOOTH SCROLL (Phase 1 & 2) */}
                {/* ------------------------------------------------------------- */}
                {(iosPhase === 1 || iosPhase === 2) && (
                  <motion.div
                    key="ios-info"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col justify-between bg-black"
                  >
                    {/* iOS Group Info Header */}
                    <div className="bg-[#1C1C1E] px-3 py-2 flex items-center justify-between border-b border-white/10 shrink-0">
                      <div className="flex items-center gap-1 text-[#0A84FF] text-xs font-medium">
                        <ChevronLeft className="w-4 h-4 -mr-1" />
                        <span>Geri</span>
                      </div>
                      <span className="font-bold text-xs text-white">Grup Bilgisi</span>
                      <span className="text-[#0A84FF] text-xs font-medium">Düzenle</span>
                    </div>

                    {/* Scrollable Container with Animated Scroll Effect */}
                    <div className="flex-1 overflow-hidden p-2.5 relative">
                      <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: iosPhase === 2 ? -170 : 0 }}
                        transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
                        className="space-y-2.5"
                      >
                        {/* Profile Picture & Title */}
                        <div className="text-center space-y-1 py-1">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-xl text-white mx-auto shadow-md">
                            👥
                          </div>
                          <h4 className="text-xs font-bold text-white">Arkadaşlar Grubu</h4>
                          <p className="text-[9px] text-slate-400">Grup • 3 Katılımcı</p>
                        </div>

                        {/* 3 Circle Buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2 rounded-2xl bg-[#1C1C1E] text-center text-[9px] text-[#0A84FF] space-y-0.5">
                            <Phone className="w-3.5 h-3.5 mx-auto" />
                            <span className="text-white block">Sesli</span>
                          </div>
                          <div className="p-2 rounded-2xl bg-[#1C1C1E] text-center text-[9px] text-[#0A84FF] space-y-0.5">
                            <Video className="w-3.5 h-3.5 mx-auto" />
                            <span className="text-white block">Görüntülü</span>
                          </div>
                          <div className="p-2 rounded-2xl bg-[#1C1C1E] text-center text-[9px] text-[#0A84FF] space-y-0.5">
                            <Search className="w-3.5 h-3.5 mx-auto" />
                            <span className="text-white block">Ara</span>
                          </div>
                        </div>

                        {/* Media Cards */}
                        <div className="bg-[#1C1C1E] rounded-2xl p-2 text-[10px] text-slate-200 divide-y divide-white/5 space-y-1">
                          <div className="flex items-center justify-between pb-1">
                            <span>Medya, bağlantı ve belgeler</span>
                            <span className="text-slate-400 text-[9px]">142 ➔</span>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span>Yıldızlı mesajlar</span>
                            <span className="text-slate-400 text-[9px]">0 ➔</span>
                          </div>
                        </div>

                        {/* Participants Preview */}
                        <div className="bg-[#1C1C1E] rounded-2xl p-2 text-[10px] space-y-1.5">
                          <div className="text-slate-400 font-semibold text-[9px]">3 KATILIMCI</div>
                          <div className="flex items-center justify-between text-white">
                            <span>Siz</span>
                            <span className="text-[9px] text-[#0A84FF]">Grup Yöneticisi</span>
                          </div>
                          <div className="text-white">Ahmet</div>
                          <div className="text-white">Ayşe</div>
                        </div>

                        {/* Bottom Actions Card (Reached after scroll down in Phase 2) */}
                        <div className="bg-[#1C1C1E] rounded-2xl divide-y divide-white/5 text-[10.5px]">
                          {/* Sohbeti Dışa Aktar with Tap Ripple on Phase 2 */}
                          <div className="p-2.5 text-[#0A84FF] font-bold flex items-center justify-between relative bg-white/5">
                            <span>Sohbeti Dışa Aktar</span>
                            {iosPhase === 2 && <TapRipple className="right-4 top-1" />}
                          </div>

                          <div className="p-2 text-red-400 opacity-70">Sohbeti Temizle</div>
                          <div className="p-2 text-red-500 opacity-70">Gruptan Çık</div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SCREEN C: iOS Native Bottom Action Sheet (Phase 3)            */}
                {/* ------------------------------------------------------------- */}
                {iosPhase === 3 && (
                  <motion.div
                    key="ios-sheet"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col justify-end bg-black/85 backdrop-blur-[2px] p-2.5 relative"
                  >
                    <motion.div
                      initial={{ y: 60, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#1C1C1E] rounded-3xl p-3.5 border border-white/10 space-y-2.5 mb-1"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">Sohbeti Dışa Aktar</h4>
                        <div className="w-5 h-5 rounded-full bg-[#2C2C2E] flex items-center justify-center text-slate-400">
                          <X className="w-3 h-3" />
                        </div>
                      </div>

                      <p className="text-[9px] text-slate-400 leading-tight">
                        Medya eklemek daha büyük bir sohbet arşivi yaratır.
                      </p>

                      <div className="space-y-1.5 pt-1">
                        {/* Option 1: Medya ekle */}
                        <div className="p-2 rounded-xl bg-[#2C2C2E] text-slate-400 text-[10.5px] flex items-center gap-2 opacity-50">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Medya ekle</span>
                        </div>

                        {/* Option 2: Medyayı ekleme with Tap Ripple */}
                        <div className="p-2.5 rounded-xl bg-[#0A84FF] text-white font-bold text-[10.5px] flex items-center justify-between shadow-glow-blue relative">
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-white" />
                            <span>Medyayı ekleme</span>
                          </div>
                          <TapRipple className="-top-0.5 -right-0.5" />
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* iOS Home Bar */}
                <div className="h-3.5 bg-black flex items-center justify-center pb-0.5 shrink-0">
                  <div className="w-24 h-0.5 bg-slate-600 rounded-full" />
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom CTA */}
      {onUploadClick && (
        <div className="mt-10 text-center relative z-10">
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
            <span>%100 Güvenli & Anonim • Verileriniz sunucuda asla saklanmaz</span>
          </p>
        </div>
      )}

    </section>
  );
};
