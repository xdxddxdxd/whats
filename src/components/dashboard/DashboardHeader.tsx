'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Download, Settings, RefreshCw, Trash2, ArrowLeft, Users, MessageSquare, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
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
  return (
    <header className="bg-[#07090C]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Left: Title & Metadata */}
          <div className="flex items-start sm:items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white hover:border-[#38BDF8]/40 transition-colors shrink-0"
              title="Ana Sayfaya Dön"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                  {chat.title}
                </h1>
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#7DD3FC] font-mono">
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
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0284C7]/20 text-[#38BDF8] border border-[#38BDF8]/30 font-bold">
                    👑 Sahip
                  </span>
                )}
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5 font-sans font-medium">
                {formatDate(chat.first_message_date)} — {formatDate(chat.last_message_date)}
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            
            {/* Wrapped Story Mode */}
            <Button
              variant="blue"
              size="md"
              onClick={onOpenWrapped}
              className="font-bold text-xs sm:text-sm shadow-glow-blue py-2.5"
            >
              <Sparkles className="w-4 h-4 text-[#07090C]" />
              <span>Wrapped'ı Başlat</span>
            </Button>

            {/* PDF Download */}
            <Button
              variant="secondary"
              size="md"
              onClick={onOpenPdf}
              className="bg-[#11141A] border-white/10 text-white hover:bg-[#161B22] hover:border-[#38BDF8]/40 text-xs sm:text-sm py-2.5"
            >
              <Download className="w-4 h-4 text-[#38BDF8]" />
              <span className="hidden sm:inline">PDF İndir</span>
            </Button>

            {/* Owner Controls */}
            {chat.isOwner && (
              <>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={onOpenOwnerControls}
                  className="bg-[#11141A] border-white/10 text-white hover:bg-[#161B22] hover:border-[#38BDF8]/40 text-xs sm:text-sm py-2.5"
                  title="Davet Linki ve Davetli Yönetimi"
                >
                  <Settings className="w-4 h-4 text-[#38BDF8]" />
                  <span className="hidden md:inline">Yönetim</span>
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={onOpenUpdate}
                  className="bg-[#11141A] border-white/10 text-white hover:bg-[#161B22] hover:border-[#38BDF8]/40 text-xs sm:text-sm py-2.5"
                  title="Yeni Mesaj Exportu Yükle (Artımlı)"
                >
                  <RefreshCw className="w-4 h-4 text-[#38BDF8]" />
                  <span className="hidden lg:inline">Güncelle</span>
                </Button>

                <button
                  onClick={onOpenDelete}
                  className="p-2.5 rounded-2xl bg-red-950/40 border border-red-800/60 text-red-400 hover:bg-red-900/50 transition-colors"
                  title="Sohbeti Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
