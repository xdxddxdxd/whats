'use client';

import React from 'react';
import { History } from 'lucide-react';
import { TimelineHighlight } from '@/types/chat';

interface TimelineHighlightsCardProps {
  highlights?: TimelineHighlight[];
}

export const TimelineHighlightsCard: React.FC<TimelineHighlightsCardProps> = ({
  highlights = []
}) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pt-2">
        <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm shrink-0">
          <History className="w-5 h-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Zaman Tüneli & Önemli Anlar
        </h2>
      </div>

      {/* Main Container Card */}
      <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-6">
        
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
            DÖNÜM NOKTALARI & REKORLAR
          </span>
          <p className="text-xs text-slate-500 font-medium font-sans mt-0.5">
            Sohbet geçmişindeki en kritik tarihler ve olaylar
          </p>
        </div>

        {/* Timeline Items List */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-sky-100">
          {highlights.map((item, idx) => (
            <div key={item.id || idx} className="relative group">
              {/* Timeline Node Icon */}
              <div className="absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-white border-2 border-sky-400 flex items-center justify-center text-xs font-emoji shadow-sm">
                {item.emoji}
              </div>

              {/* Card Body */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/90 space-y-2 transition-all hover:bg-white hover:border-slate-200 hover:shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-700 text-[10px] font-bold font-sans">
                    {item.date}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {item.messageCount ? `${item.messageCount} mesaj/saat` : ''}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{item.title}</span>
                </h4>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  {item.description}
                </p>

                {item.quote && (
                  <div className="text-[11px] font-mono text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-100">
                    {item.quote}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
