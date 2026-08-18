'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Download, Settings, RefreshCw, Trash2, ArrowLeft, Users, MessageSquare, MoreVertical, Crown } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatDate } from '@/lib/utils/formatters';

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
  onOpenWrapped: () => void;
  onOpenPdf: () => void;
  onOpenOwnerControls?: () => void;
  onOpenUpdate?: () => void;
  onOpenDelete?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  chat,
  onOpenWrapped,
  onOpenPdf,
  onOpenOwnerControls,
  onOpenUpdate,
  onOpenDelete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
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

  return (
    <header className="bg-[#07090C]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Back & Title Metadata */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white hover:border-[#38BDF8]/40 transition-colors shrink-0"
              title="Ana Sayfaya Dön"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate max-w-[220px] sm:max-w-md">
                  {chat.title}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#7DD3FC] font-mono">
                  {chat.chat_type === 'group' ? (
                    <>
                      <Users className="w-3 h-3" />
                      <span>{chat.total_participants} Kişi</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-3 h-3" />
                      <span>İkili</span>
                    </>
                  )}
                </span>
                {chat.isOwner && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0284C7]/20 text-[#38BDF8] border border-[#38BDF8]/30 font-bold">
                    <Crown className="w-3 h-3" />
                    <span>Sahip</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#94A3B8] font-sans truncate">
                {formatDate(chat.first_message_date)} — {formatDate(chat.last_message_date)}
              </p>
            </div>
          </div>

          {/* Right: Primary Wrapped CTA + More Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Primary Action Button */}
            <Button
              variant="blue"
              size="md"
              onClick={onOpenWrapped}
              className="font-bold text-xs sm:text-sm shadow-glow-blue py-2.5 px-4 sm:px-5"
            >
              <Sparkles className="w-4 h-4 text-[#07090C]" />
              <span>Wrapped'ı Başlat</span>
            </Button>

            {/* Overflow Dropdown (⋯) */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(prev => !prev)}
                className="p-2.5 rounded-2xl bg-[#11141A] border border-white/10 text-[#94A3B8] hover:text-white hover:border-[#38BDF8]/40 transition-colors"
                title="Diğer Seçenekler"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#11141A] border border-white/10 shadow-2xl p-1.5 z-50 text-xs font-medium text-white space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenPdf();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 hover:text-[#38BDF8] transition-colors text-left"
                  >
                    <Download className="w-4 h-4 text-[#38BDF8]" />
                    <span>PDF Olarak İndir</span>
                  </button>

                  {chat.isOwner && onOpenOwnerControls && (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenOwnerControls();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 hover:text-[#38BDF8] transition-colors text-left"
                    >
                      <Settings className="w-4 h-4 text-[#38BDF8]" />
                      <span>Davet & Yönetim</span>
                    </button>
                  )}

                  {chat.isOwner && onOpenUpdate && (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenUpdate();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 hover:text-[#38BDF8] transition-colors text-left"
                    >
                      <RefreshCw className="w-4 h-4 text-[#38BDF8]" />
                      <span>Sohbeti Güncelle</span>
                    </button>
                  )}

                  {chat.isOwner && onOpenDelete && (
                    <div className="pt-1 mt-1 border-t border-white/10">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onOpenDelete();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors text-left"
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

        </div>
      </div>
    </header>
  );
};
