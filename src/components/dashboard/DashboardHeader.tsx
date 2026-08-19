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
  Heart,
  Share2,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../ui/Button';

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

  const displayParticipantsTitle = chat.title.includes('♡') || chat.title.includes('&')
    ? chat.title
    : `${user2Name} ♡ ${user1Name}`;

  return (
    <div className="w-full space-y-6">
      
      {/* 1. Top Navbar Header */}
      <header className="flex items-center justify-between py-2 border-b border-slate-100/80">
        
        {/* Left: Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-sky-100 border border-sky-200 text-sky-600 flex items-center justify-center font-emoji text-lg shadow-sm group-hover:scale-105 transition-transform">
            💬
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
            WhatsScope
          </span>
        </Link>

        {/* Right: "Ana Sayfa" Pill Button & Menu */}
        <div className="flex items-center gap-2">
          
          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Ana Sayfa</span>
          </Link>

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
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.12)] p-1.5 z-50 text-xs font-medium text-slate-700 space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
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
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Davet & Yönetim</span>
                  </button>
                )}

                {chat.isOwner && onOpenUpdate && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenUpdate();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                    <span>Sohbeti Güncelle</span>
                  </button>
                )}

                {chat.isOwner && onOpenDelete && (
                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenDelete();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Sohbeti Sil</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </header>

      {/* 2. Status Badge & Main Heading */}
      <div className="text-center space-y-3 pt-2">
        
        {/* "Analiz Tamamlandı" Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Analiz Tamamlandı</span>
        </div>

        {/* Page Main Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          WhatsScope Sonuçları
        </h1>

      </div>

      {/* 3. "Kişi 1 ♡ Kişi 2 - Analiz Edildi" Header Bubble Card */}
      <div className="max-w-xs mx-auto p-4 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] text-center space-y-1">
        <h3 className="text-base font-bold text-emerald-700 flex items-center justify-center gap-1.5">
          <span>{displayParticipantsTitle}</span>
        </h3>
        <p className="text-[11px] font-medium text-slate-400 font-sans">
          Analiz Edildi
        </p>
      </div>

    </div>
  );
};
