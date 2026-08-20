'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Sparkles,
  Download,
  Settings,
  RefreshCw,
  Trash2,
  MoreVertical,
  ArrowLeft,
  Bot,
  Instagram,
  QrCode
} from 'lucide-react';

interface DashboardHeaderProps {
  chat: {
    id: string;
    title: string;
    chat_type: 'group' | 'direct';
    total_messages: number;
    total_participants: number;
    first_message_date: string | null;
    last_message_date: string | null;
    isOwner: boolean;
  };
  user1Name?: string;
  user2Name?: string;
  onOpenWrapped: () => void;
  onOpenPdf: () => void;
  onOpenAskAi?: () => void;
  onOpenStoryCard?: () => void;
  onOpenQr?: () => void;
  onOpenOwnerControls?: () => void;
  onOpenUpdate?: () => void;
  onOpenDelete?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  chat,
  user1Name = 'Doğukan',
  user2Name = 'nisa cici',
  onOpenWrapped,
  onOpenPdf,
  onOpenAskAi,
  onOpenStoryCard,
  onOpenQr,
  onOpenOwnerControls,
  onOpenUpdate,
  onOpenDelete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const displayParticipantsTitle = (chat?.title || '').includes('♡') || (chat?.title || '').includes('&')
    ? (chat?.title || '')
    : `${user2Name} ♡ ${user1Name}`;

  return (
    <div className="w-full space-y-6 font-sans">
      
      {/* 1. Top Navbar Header */}
      <header className="flex items-center justify-between py-2 border-b border-slate-100/80">
        
        {/* Left: Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-sky-100 border border-sky-200 text-sky-600 flex items-center justify-center font-emoji text-lg shadow-sm group-hover:scale-105 transition-transform">
            💬
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5 font-sans">
            WHATS <span className="text-sky-500 font-sans text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200">2026</span>
          </span>
        </Link>

        {/* Right: Action Buttons & Menu */}
        <div className="flex items-center gap-2">
          
          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Ana Sayfa</span>
          </Link>

          {/* AI Ask Button */}
          {onOpenAskAi && (
            <button
              onClick={onOpenAskAi}
              className="inline-flex items-center gap-1.5 rounded-full bg-sky-500 hover:bg-sky-600 border border-sky-600 px-3.5 py-1.5 text-xs font-bold text-white transition-all shadow-sm"
            >
              <Bot className="w-3.5 h-3.5 text-sky-100" />
              <span>AI'a Sor</span>
            </button>
          )}

          {/* QR Code Button */}
          {onOpenQr && (
            <button
              onClick={onOpenQr}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              title="QR Kod ile Giriş & Paylaş"
            >
              <QrCode className="w-3.5 h-3.5 text-sky-600" />
              <span>QR Kod</span>
            </button>
          )}

          {/* Story Card Exporter Button */}
          {onOpenStoryCard && (
            <button
              onClick={onOpenStoryCard}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-500" />
              <span>Story İndir</span>
            </button>
          )}

          {/* Wrapped Action Button */}
          <button
            onClick={onOpenWrapped}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200/80 px-3.5 py-1.5 text-xs font-bold text-sky-700 hover:bg-sky-100 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Story</span>
          </button>

          {/* More Actions Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="p-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
              title="Seçenekler"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.12)] p-1.5 z-50 text-xs font-medium text-slate-700 space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                {onOpenQr && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenQr();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition-colors text-left"
                  >
                    <QrCode className="w-4 h-4 text-sky-500" />
                    <span>QR Kod ile Katıl</span>
                  </button>
                )}

                {onOpenAskAi && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenAskAi();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition-colors text-left"
                  >
                    <Bot className="w-4 h-4 text-sky-500" />
                    <span>Sohbetinle Konuş (AI)</span>
                  </button>
                )}

                {onOpenStoryCard && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenStoryCard();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition-colors text-left"
                  >
                    <Instagram className="w-4 h-4 text-pink-500" />
                    <span>Story PNG İndir</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenWrapped();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition-colors text-left"
                >
                  <Sparkles className="w-4 h-4 text-sky-500" />
                  <span>Story'yi İzle (Wrapped)</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenPdf();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition-colors text-left"
                >
                  <Download className="w-4 h-4 text-sky-500" />
                  <span>PDF Olarak İndir</span>
                </button>

                {chat.isOwner && onOpenOwnerControls && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenOwnerControls();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition-colors text-left"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Yönetim & Davetliler</span>
                  </button>
                )}

                {chat.isOwner && onOpenUpdate && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenUpdate();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition-colors text-left"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                    <span>Yeni Mesajları Ekle</span>
                  </button>
                )}

                {chat.isOwner && onOpenDelete && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenDelete();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-left border-t border-slate-100 mt-1 pt-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Sohbeti Sil</span>
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </header>

      {/* 2. Hero Title & Metadata Badge */}
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {chat?.title || 'Sohbet Analizi'}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-700">
              <CheckCircle2 className="w-3 h-3" />
              <span>Analiz Tamamlandı</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {chat?.chat_type === 'group'
              ? `${chat.total_participants} katılımcılı grup sohbeti`
              : displayParticipantsTitle}
          </p>
        </div>

        {/* Dynamic Quick Stats Bar */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-200/60">
          <span className="font-semibold text-slate-900">
            {(chat?.total_messages || 0).toLocaleString('tr-TR')} Mesaj
          </span>
          <span className="text-slate-300">•</span>
          <span>{chat?.first_message_date ? new Date(chat.first_message_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Kayıt Başı'}</span>
          <span className="text-slate-400">→</span>
          <span>{chat?.last_message_date ? new Date(chat.last_message_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Kayıt Sonu'}</span>
        </div>
      </div>

    </div>
  );
};
