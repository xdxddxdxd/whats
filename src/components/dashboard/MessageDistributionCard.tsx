'use client';

import React from 'react';
import { UserStats } from '@/types/chat';

interface MessageDistributionCardProps {
  user1: UserStats;
  user2: UserStats;
  totalMessages: number;
  startDate: string;
  endDate: string;
}

export const MessageDistributionCard: React.FC<MessageDistributionCardProps> = ({
  user1,
  user2,
  totalMessages,
  startDate,
  endDate
}) => {
  return (
    <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-5">
      
      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
        Kim Daha Çok Yazıyor?
      </h3>

      {/* User 2 (e.g. nisa cici) Bar Section */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-bold text-slate-900">{user2.name}</span>
          <span className="font-mono text-slate-500 font-medium">
            {user2.messageCount.toLocaleString('tr-TR')} mesaj · %{user2.percentage}
          </span>
        </div>
        
        {/* Progress Bar with Pill inside */}
        <div className="w-full h-4 bg-emerald-50 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-emerald-500 rounded-full flex items-center justify-end pr-2 transition-all duration-700 ease-out"
            style={{ width: `${Math.max(12, user2.percentage)}%` }}
          >
            <span className="text-[10px] font-bold text-white font-mono leading-none">
              %{user2.percentage}
            </span>
          </div>
        </div>
      </div>

      {/* User 1 (e.g. Doğukan) Bar Section */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-bold text-slate-900">{user1.name}</span>
          <span className="font-mono text-slate-500 font-medium">
            {user1.messageCount.toLocaleString('tr-TR')} mesaj · %{user1.percentage}
          </span>
        </div>

        {/* Progress Bar with Pill inside */}
        <div className="w-full h-4 bg-sky-50 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full flex items-center justify-end pr-2 transition-all duration-700 ease-out"
            style={{ width: `${Math.max(12, user1.percentage)}%` }}
          >
            <span className="text-[10px] font-bold text-white font-mono leading-none">
              %{user1.percentage}
            </span>
          </div>
        </div>
      </div>

      {/* Dual Combined Proportion Bar */}
      <div className="pt-1">
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-sky-400"
            style={{ width: `${user1.percentage}%` }}
            title={`${user1.name}: %${user1.percentage}`}
          />
          <div
            className="h-full bg-slate-900"
            style={{ width: `${user2.percentage}%` }}
            title={`${user2.name}: %${user2.percentage}`}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 font-sans">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>{user1.name} (%{user1.percentage})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-900" />
            <span>{user2.name} (%{user2.percentage})</span>
          </span>
        </div>
      </div>

      {/* Bottom Subtitle / Date Span */}
      <div className="pt-2 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500 font-sans font-medium">
          {totalMessages.toLocaleString('tr-TR')} mesaj · {startDate} – {endDate}
        </p>
      </div>

    </div>
  );
};
