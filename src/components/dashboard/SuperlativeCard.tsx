'use client';

import React, { useState } from 'react';
import { SuperlativeCard as SuperlativeType } from '@/lib/ai/types';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

interface SuperlativeCardProps {
  card: SuperlativeType;
  index: number;
}

export const SuperlativeCard: React.FC<SuperlativeCardProps> = ({ card, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Real chat messages associated with this superlative
  const chatMessages = card.sampleQuotes && card.sampleQuotes.length > 0
    ? card.sampleQuotes
    : card.quote
    ? [card.quote]
    : [];

  return (
    <div
      onClick={() => setIsExpanded(prev => !prev)}
      className="p-6 rounded-3xl bg-[#11141A] border border-white/10 hover:border-[#38BDF8]/50 transition-all duration-300 shadow-soft group cursor-pointer flex flex-col justify-between relative overflow-hidden select-none"
    >
      {/* Subtle ambient background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#38BDF8]/10 transition-colors" />

      <div>
        {/* Top: Large Badge & Stat Pill */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0B0D11] border border-[#38BDF8]/30 flex items-center justify-center text-3xl font-emoji shadow-glow-blue group-hover:scale-105 transition-transform">
            {card.badge || '🏆'}
          </div>
          <span className="text-xs font-mono font-bold text-[#38BDF8] bg-[#0284C7]/15 border border-[#38BDF8]/30 px-3 py-1 rounded-full">
            {card.statValue}
          </span>
        </div>

        {/* Hierarchy: Unvan > Kazanan > Açıklama */}
        <div className="space-y-2">
          <h4 className="text-lg font-bold text-white tracking-tight group-hover:text-[#38BDF8] transition-colors">
            {card.title}
          </h4>

          {/* Winner highlight */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-bold text-xs text-white">
            <span className="text-[#38BDF8]">✦</span>
            <span>{card.winner}</span>
          </div>

          {/* Short description */}
          <p className="text-xs text-[#94A3B8] leading-relaxed font-sans pt-1">
            {card.description}
          </p>
        </div>
      </div>

      {/* Expanded Detailed Section with Actual Chat Messages */}
      {isExpanded ? (
        <div className="mt-5 pt-4 border-t border-white/10 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          
          <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Sohbetten Mesajlar</span>
            </div>
            <span className="text-[10px] text-[#94A3B8] font-normal lowercase">
              {chatMessages.length > 0 ? `${chatMessages.length} kayıt` : ''}
            </span>
          </div>

          {/* Message List */}
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {chatMessages.length > 0 ? (
              chatMessages.map((msgText, mIdx) => (
                <div
                  key={`real-msg-${mIdx}`}
                  className="p-2.5 rounded-2xl bg-[#0B0D11] border border-white/5 text-xs text-[#E2E8F0] font-sans leading-relaxed flex items-start gap-2"
                >
                  <span className="text-[#38BDF8] shrink-0 font-mono text-[11px]">💬</span>
                  <span className="break-words">{msgText.replace(/^["']|["']$/g, '')}</span>
                </div>
              ))
            ) : (
              <div className="p-2.5 rounded-2xl bg-[#0B0D11] border border-white/5 text-xs text-[#64748B] italic">
                Bu unvan için kayıtlı mesaj alıntısı bulunmuyor.
              </div>
            )}
          </div>

          {/* Toggle Action */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span className="font-mono">{card.statLabel}: <strong className="text-white">{card.statValue}</strong></span>
            <span className="text-[#38BDF8] flex items-center gap-1 font-medium hover:underline">
              <span>Gizle</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </span>
          </div>

        </div>
      ) : (
        /* Collapsed Footer */
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#64748B]">
          <span className="font-mono uppercase tracking-wider">{card.statLabel}</span>
          <span className="text-[#38BDF8] flex items-center gap-1 font-medium group-hover:underline">
            <span>Mesajları Gör ({chatMessages.length > 0 ? chatMessages.length : card.statValue})</span>
            <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </span>
        </div>
      )}

    </div>
  );
};
