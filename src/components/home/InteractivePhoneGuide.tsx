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
} from 'lucide-react';

interface InteractivePhoneGuideProps {
  className?: string;
}

// Gentle translucent finger tap ripple effect
const TapRipple: React.FC<{ className?: string }> = ({ className = '' }) => (
  <motion.div
    initial={{ scale: 0.3, opacity: 0.95 }}
    animate={{ scale: 2.2, opacity: 0 }}
    transition={{ duration: 0.75, ease: 'easeOut' }}
    className={`absolute w-8 h-8 rounded-full bg-white/40 border-2 border-white/90 pointer-events-none z-50 shadow-md ${className}`}
  />
);

export const InteractivePhoneGuide: React.FC<InteractivePhoneGuideProps> = ({ className = '' }) => {
  const [platform, setPlatform] = useState<'android' | 'ios'>('android');
  
  // Independent autonomous phase timelines (0: Chat, 1: Open Menu/Info, 2: Submenu/Scroll Down, 3: Export Modal/Sheet)
  const [androidPhase, setAndroidPhase] = useState<number>(0);
  const [iosPhase, setIosPhase] = useState<number>(0);

  // Android infinite loop
  useEffect(() => {
    const timer = setInterval(() => {
      setAndroidPhase((prev) => (prev + 1) % 4);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  // iOS infinite loop
  useEffect(() => {
    const timer = setInterval(() => {
      setIosPhase((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      
      {/* Platform Switcher Tabs */}
      <div className="flex items-center justify-center mb-4 z-20">
        <div className="inline-flex p-1 rounded-2xl bg-[#141A22] border border-white/10 shadow-lg">
          <button
            type="button"
            onClick={() => setPlatform('android')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              platform === 'android'
                ? 'bg-[#00A884] text-white shadow-[0_0_15px_rgba(0,168,132,0.45)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
          </button>

          <button
            type="button"
            onClick={() => setPlatform('ios')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              platform === 'ios'
                ? 'bg-[#0A84FF] text-white shadow-[0_0_15px_rgba(10,132,255,0.45)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>iPhone (iOS)</span>
          </button>
        </div>
      </div>

      {/* Phone Chassis */}
      <div className="w-[300px] sm:w-[335px] h-[580px] sm:h-[620px] rounded-[48px] bg-[#161B22] p-3 shadow-[0_25px_70px_rgba(0,0,0,0.9)] border-[4px] border-[#2A313C] relative">
        
        {/* Physical Side Buttons */}
        <div className="absolute -left-[7px] top-24 w-[3px] h-9 bg-[#4B5563] rounded-l-md" />
        <div className="absolute -left-[7px] top-36 w-[3px] h-12 bg-[#4B5563] rounded-l-md" />
        <div className="absolute -right-[7px] top-28 w-[3px] h-14 bg-[#4B5563] rounded-r-md" />

        {/* Screen Inner Display */}
        <div className="w-full h-full rounded-[38px] bg-[#0B141A] overflow-hidden flex flex-col relative text-white border border-white/5 font-sans">
          
          {/* Top Camera Punch Hole / Dynamic Island */}
          {platform === 'android' ? (
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-40 flex items-center justify-center pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1C2733]" />
            </div>
          ) : (
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-22 h-4.5 bg-black rounded-full z-40 flex items-center justify-end px-2 pointer-events-none shadow-md">
              <div className="w-1.5 h-1.5 rounded-full bg-[#111A24]" />
            </div>
          )}

          {/* Status Bar */}
          <div className={`h-7 ${platform === 'android' ? 'bg-[#1F2C34]' : 'bg-[#161719]'} pt-1 px-5 flex items-center justify-between text-[10px] font-semibold text-slate-300 z-30 shrink-0`}>
            <span>16:17</span>
            <div className="flex items-center gap-1 text-[9px]">
              <span>LTE</span>
              <span className="bg-emerald-500/20 text-emerald-400 px-1 rounded font-mono font-bold">35</span>
            </div>
          </div>

          {/* SVG WhatsApp Wallpaper Pattern */}
          <div
            className="absolute inset-0 top-7 bottom-3 pointer-events-none opacity-[0.06] z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20 L25 15 L30 20 Z M60 20 C60 15, 70 15, 70 20 C70 25, 60 25, 60 20 Z M95 30 L105 30 L100 20 Z M30 70 A 8 8 0 1 0 30 86 A 8 8 0 1 0 30 70 Z M80 75 Q85 65, 95 75 T110 75 M15 100 L25 105 L20 115 Z' stroke='%23ffffff' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
              backgroundSize: '120px 120px',
            }}
          />

          {/* SCREEN VIEWPORT */}
          <div className="flex-1 relative overflow-hidden flex flex-col z-10">
            
            {/* ========================================================================= */}
            {/* 1. ANDROID FLOW (Doğukan - App Promo Chat)                                 */}
            {/* ========================================================================= */}
            {platform === 'android' && (
              <div className="flex-1 flex flex-col justify-between relative">
                
                {/* Android Header */}
                <div className="bg-[#1F2C34] px-3 py-2 flex items-center justify-between border-b border-white/5 shrink-0 z-20 shadow-sm">
                  <div className="flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4 text-slate-300" />
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                      D
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-white leading-tight">
                        Doğukan
                      </h5>
                      <span className="text-[8.5px] text-emerald-400 block leading-tight">çevrimiçi</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-200 relative">
                    <Video className="w-3.5 h-3.5" />
                    <Phone className="w-3.5 h-3.5" />
                    
                    {/* 3 Dots Menu Button with Natural Tap Ripple */}
                    <div className="relative p-0.5">
                      <MoreVertical className="w-4 h-4 text-slate-200" />
                      {androidPhase === 0 && <TapRipple className="-top-1 -left-1" />}
                    </div>
                  </div>
                </div>

                {/* Chat Messages Body */}
                <div className="p-2.5 space-y-1.5 flex-1 overflow-hidden relative text-xs">
                  
                  {/* Received Message 1 */}
                  <div className="bg-[#1F2C34] p-2 rounded-2xl rounded-tl-none max-w-[84%] text-slate-200 shadow-sm space-y-0.5">
                    <p className="text-[10.5px] leading-relaxed">Kanka bu seneki WhatsApp özetimizi çıkardın mı?</p>
                    <span className="text-[7.5px] text-slate-400 block text-right">16:04</span>
                  </div>

                  {/* Sent with Quote */}
                  <div className="bg-[#005C4B] p-2 rounded-2xl rounded-tr-none max-w-[84%] ml-auto text-white shadow-sm space-y-1">
                    <div className="bg-[#025142] p-1 rounded-lg border-l-2 border-emerald-300 text-[8.5px] text-emerald-100">
                      <span className="font-bold block text-emerald-200">Doğukan</span>
                      <span>WhatsApp özetimizi çıkardın mı?</span>
                    </div>
                    <p className="text-[10.5px]">WhatsBaba'ya yükledim, grupta en çok kim mesaj atmış hepsi çıktı 😂</p>
                    <span className="text-[7.5px] text-emerald-200 block text-right">16:04 ✓✓</span>
                  </div>

                  {/* Received 2 */}
                  <div className="bg-[#1F2C34] px-2 py-1 rounded-2xl rounded-tl-none max-w-[75%] text-slate-200 shadow-sm flex items-center justify-between text-[10.5px]">
                    <span>Harbi mi kim şampiyon olmuş?</span>
                    <span className="text-[7.5px] text-slate-400 pl-1.5">16:04</span>
                  </div>

                  {/* Sent 3 */}
                  <div className="bg-[#005C4B] px-2 py-1 rounded-2xl rounded-tr-none max-w-[84%] ml-auto text-white shadow-sm flex items-center justify-between text-[10.5px]">
                    <span>Sen 'Trip Şampiyonu' ben 'Dedikodu Bakanı' ahaha</span>
                    <span className="text-[7.5px] text-emerald-200 pl-1.5">16:05 ✓✓</span>
                  </div>

                  {/* ANDROID OVERLAY 1: Dropdown Menu (Phase 1) */}
                  <AnimatePresence>
                    {androidPhase === 1 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.22 }}
                        className="absolute top-1 right-2 w-48 bg-[#1F2C34] rounded-xl shadow-2xl border border-white/10 py-1 text-xs text-slate-200 z-30 divide-y divide-white/5"
                      >
                        <div className="py-0.5">
                          <div className="px-3 py-1 opacity-70 text-[10px]">Yeni grup</div>
                          <div className="px-3 py-1 opacity-70 text-[10px]">Kişiyi görüntüle</div>
                          <div className="px-3 py-1 opacity-70 text-[10px]">Ara</div>
                          <div className="px-3 py-1 opacity-70 text-[10px]">Medya, bağlantı ve belgeler</div>
                          <div className="px-3 py-1 opacity-70 text-[10px]">Bildirimleri sessize al</div>
                          <div className="px-3 py-1 opacity-70 text-[10px]">Süreli mesajlar</div>
                        </div>
                        
                        {/* Diğer ▸ Option with Natural Tap */}
                        <div className="px-3 py-2 bg-[#00A884]/25 text-white font-bold text-[11px] flex items-center justify-between relative">
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
                        initial={{ opacity: 0, scale: 0.92, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.22 }}
                        className="absolute top-12 right-3 w-44 bg-[#1F2C34] rounded-xl shadow-2xl border border-white/10 py-1 text-xs text-slate-200 z-30 space-y-0.5"
                      >
                        <div className="px-3 py-1 opacity-70 text-[10px]">Şikayet et</div>
                        <div className="px-3 py-1 opacity-70 text-[10px]">Engelle</div>
                        <div className="px-3 py-1 opacity-70 text-[10px]">Sohbeti temizle</div>
                        
                        {/* Sohbeti dışa aktar Option with Natural Tap */}
                        <div className="px-3 py-1.5 bg-[#00A884]/35 text-[#2DD4BF] font-bold text-[10.5px] relative rounded-md">
                          <span>Sohbeti dışa aktar</span>
                          <TapRipple className="right-4 top-0" />
                        </div>

                        <div className="px-3 py-1 opacity-70 text-[10px]">Kısayol ekle</div>
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
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/75 backdrop-blur-[2px] z-40 flex items-center justify-center p-3"
                      >
                        <motion.div
                          initial={{ scale: 0.92, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-[#1F2C34] rounded-3xl p-4 border border-white/10 shadow-2xl space-y-3 w-full max-w-[260px]"
                        >
                          <h4 className="text-xs font-bold text-white">Medya eklensin mi?</h4>
                          <p className="text-[9.5px] text-slate-300 leading-relaxed">
                            Medya eklemek sohbet dışa aktarma boyutunu artırır.
                          </p>

                          <div className="flex items-center justify-end gap-2.5 pt-1.5">
                            <span className="text-[9.5px] text-slate-400 font-semibold px-2 py-1">
                              MEDYAYI EKLE
                            </span>
                            
                            {/* MEDYASIZ Button with Natural Tap */}
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

                {/* Android Input Bar */}
                <div className="p-2 bg-[#0B141A] flex items-center gap-2 border-t border-white/5 shrink-0">
                  <div className="flex-1 bg-[#1F2C34] rounded-full px-3 py-1.5 text-[10px] text-slate-400 flex items-center justify-between">
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
            )}

            {/* ========================================================================= */}
            {/* 2. IPHONE (iOS) FLOW (Doğukan - App Promo Chat & Green Export Button)       */}
            {/* ========================================================================= */}
            {platform === 'ios' && (
              <div className="flex-1 flex flex-col justify-between relative bg-black">
                
                {/* SCREEN A: iOS Chat Screen (Phase 0) */}
                {iosPhase === 0 && (
                  <motion.div
                    key="ios-hero-chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    {/* iOS Header */}
                    <div className="bg-[#161719] px-3 py-1.5 flex items-center justify-between border-b border-white/10 shrink-0">
                      <div className="flex items-center gap-1 text-white text-xs font-semibold">
                        <ChevronLeft className="w-4 h-4 -mr-1" />
                        <span>2</span>
                      </div>

                      {/* Center: Tap Target for Contact Info */}
                      <div className="flex items-center gap-2 relative cursor-pointer">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 text-white text-[10px] font-bold flex items-center justify-center">
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
                        <TapRipple className="-top-1 -right-2" />
                      </div>

                      <div className="flex items-center gap-2 text-white">
                        <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                          <Video className="w-3 h-3" />
                        </div>
                        <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                          <Phone className="w-3 h-3" />
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-2.5 space-y-1.5 flex-1 text-xs">
                      <div className="bg-[#1C1C1E] p-2 rounded-2xl rounded-tl-none max-w-[82%] text-slate-200">
                        <p className="text-[10.5px]">Kanka bu seneki WhatsApp özetimizi çıkardın mı?</p>
                        <span className="text-[7.5px] text-slate-400 block text-right">16:04</span>
                      </div>

                      <div className="bg-[#005C4B] p-2 rounded-2xl rounded-tr-none max-w-[82%] ml-auto text-white">
                        <p className="text-[10.5px]">WhatsBaba'ya yükledim, grupta en çok mesaj atan sen çıktın 😂</p>
                        <span className="text-[7.5px] text-emerald-200 block text-right">16:04 ✓✓</span>
                      </div>

                      <div className="bg-[#1C1C1E] p-2 rounded-2xl rounded-tl-none max-w-[82%] text-slate-200">
                        <p className="text-[10.5px]">Nasıl dışa aktarılıyor göster de ben de bakayım</p>
                        <span className="text-[7.5px] text-slate-400 block text-right">16:05</span>
                      </div>
                    </div>

                    {/* iOS Input Bar */}
                    <div className="p-2 bg-[#161719] flex items-center gap-2 border-t border-white/10 shrink-0">
                      <Plus className="w-4 h-4 text-white" />
                      <div className="flex-1 bg-[#242528] rounded-full px-3 py-1 text-[10px] text-slate-400 flex items-center justify-between">
                        <span />
                        <Sticker className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <Camera className="w-3.5 h-3.5 text-white" />
                      <Mic className="w-3.5 h-3.5 text-white" />
                    </div>
                  </motion.div>
                )}

                {/* SCREEN B: iOS Kişi Bilgisi with REAL SMOOTH SCROLL DOWN (Phase 1 & 2) */}
                {(iosPhase === 1 || iosPhase === 2) && (
                  <motion.div
                    key="ios-hero-info"
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col justify-between bg-black"
                  >
                    {/* Top Bar */}
                    <div className="bg-[#161719] px-3 py-1.5 flex items-center justify-between border-b border-white/10 shrink-0">
                      <div className="flex items-center gap-1 text-white text-xs font-semibold">
                        <ChevronLeft className="w-4 h-4 -mr-1" />
                        <span>Geri</span>
                      </div>
                      <span className="font-bold text-white text-xs">Kişi Bilgisi</span>
                      <span className="bg-[#1C1C1E] text-white px-2 py-0.5 rounded-full text-[9px]">Düzenle</span>
                    </div>

                    {/* Scrollable Container */}
                    <div className="flex-1 overflow-hidden p-2.5 relative">
                      <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: iosPhase === 2 ? -210 : 0 }}
                        transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
                        className="space-y-2"
                      >
                        {/* Profile Avatar & Name */}
                        <div className="text-center space-y-0.5 py-0.5">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 text-white text-xl font-bold flex items-center justify-center mx-auto shadow-md">
                            D
                          </div>
                          <h4 className="text-xs font-bold text-white">Doğukan</h4>
                          <p className="text-[9px] text-slate-400">+90 555 000 00 00</p>
                        </div>

                        {/* 3 Action Buttons */}
                        <div className="grid grid-cols-3 gap-1.5">
                          <div className="p-1.5 rounded-2xl bg-[#1C1C1E] text-center text-[9px] text-emerald-400 space-y-0.5">
                            <Phone className="w-3 h-3 mx-auto" />
                            <span className="text-white block">Sesli</span>
                          </div>
                          <div className="p-1.5 rounded-2xl bg-[#1C1C1E] text-center text-[9px] text-emerald-400 space-y-0.5">
                            <Video className="w-3 h-3 mx-auto" />
                            <span className="text-white block">Görüntülü</span>
                          </div>
                          <div className="p-1.5 rounded-2xl bg-[#1C1C1E] text-center text-[9px] text-emerald-400 space-y-0.5">
                            <Search className="w-3 h-3 mx-auto" />
                            <span className="text-white block">Ara</span>
                          </div>
                        </div>

                        {/* Media Cards */}
                        <div className="bg-[#1C1C1E] rounded-2xl p-2 text-[9.5px] text-slate-200 divide-y divide-white/5 space-y-1">
                          <div className="flex items-center justify-between pb-0.5">
                            <span>Medya, bağlantı ve belgeler</span>
                            <span className="text-slate-400 text-[8.5px]">150 ➔</span>
                          </div>
                          <div className="flex items-center justify-between pt-0.5">
                            <span>Depolama alanını yönet</span>
                            <span className="text-slate-400 text-[8.5px]">64,8 MB ➔</span>
                          </div>
                        </div>

                        {/* 2 Ortak Grup */}
                        <div className="text-[9.5px] text-slate-400 font-bold px-1 pt-0.5">2 ortak grup</div>
                        <div className="bg-[#1C1C1E] rounded-2xl p-2 text-[9.5px] space-y-1.5 divide-y divide-white/5">
                          <div className="flex items-center gap-1.5 text-white">
                            <Users className="w-3 h-3 text-pink-400" />
                            <span>Yazılımcılar & Girişimciler 💻</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-white pt-1">
                            <Users className="w-3 h-3 text-amber-400" />
                            <span>Halı Saha Ekibi ⚽</span>
                          </div>
                        </div>

                        {/* Actions List (Sohbeti Dışa Aktar Yeşil) */}
                        <div className="bg-[#1C1C1E] rounded-2xl divide-y divide-white/5 text-[10px]">
                          <div className="p-2 text-emerald-400">Kişiyi paylaş</div>
                          <div className="p-2 text-emerald-400">Favoriler'e ekle</div>
                          <div className="p-2 text-emerald-400">Listeye ekle</div>
                          
                          {/* Sohbeti dışa aktar Option */}
                          <div className="p-2.5 text-emerald-400 font-medium relative bg-white/5 flex items-center justify-between">
                            <span>Sohbeti dışa aktar</span>
                            {iosPhase === 2 && <TapRipple className="right-4 top-0.5" />}
                          </div>

                          <div className="p-2 text-red-400 opacity-70">Sohbeti temizle</div>
                        </div>

                        <div className="bg-[#1C1C1E] rounded-2xl p-2 text-[9.5px] text-red-500 opacity-70">
                          <div>Doğukan kişisini engelle</div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* SCREEN C: iOS Action Sheet Modal ("Medyayı ekleme") (Phase 3) */}
                {iosPhase === 3 && (
                  <motion.div
                    key="ios-hero-sheet"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col justify-end bg-black/85 backdrop-blur-[2px] p-2.5 relative"
                  >
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#1C1C1E] rounded-3xl p-3.5 border border-white/10 space-y-2.5 mb-1"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">Sohbeti dışa aktar</h4>
                        <div className="w-5 h-5 rounded-full bg-[#2C2C2E] flex items-center justify-center text-slate-400">
                          <X className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <p className="text-[9px] text-slate-400 leading-snug">
                        Medya eklemek daha büyük bir sohbet arşivi yaratır.
                      </p>

                      <div className="space-y-1.5 pt-0.5">
                        {/* Option 1: Medya ekle */}
                        <div className="p-2 rounded-xl bg-[#2C2C2E] text-slate-400 text-[10px] flex items-center gap-2 opacity-50">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Medya ekle</span>
                        </div>

                        {/* Option 2: Medyayı ekleme with Natural Tap */}
                        <div className="p-2.5 rounded-xl bg-[#00A884] text-white font-bold text-[10.5px] flex items-center justify-between shadow-glow-emerald relative">
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-white" />
                            <span>Medyayı ekleme</span>
                          </div>
                          <TapRipple className="-top-1 -right-1" />
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

              </div>
            )}

          </div>

          {/* Bottom Home Indicator */}
          <div className="h-3.5 bg-black flex items-center justify-center pb-0.5 shrink-0">
            <div className="w-24 h-0.5 bg-slate-600 rounded-full" />
          </div>

        </div>

      </div>

    </div>
  );
};
