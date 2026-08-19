'use client';

import React, { useState } from 'react';
import { BookOpen, Quote } from 'lucide-react';
import { ChatDictionaryData, UserStats } from '@/types/chat';

interface VocabularyDictionaryCardProps {
  chatDictionary?: ChatDictionaryData;
  user1: UserStats;
  user2: UserStats;
}

export const VocabularyDictionaryCard: React.FC<VocabularyDictionaryCardProps> = ({
  chatDictionary,
  user1,
  user2
}) => {
  const [activeTab, setActiveTab] = useState<'words' | 'slang'>('words');

  if (!chatDictionary) return null;

  const { user1Words, user2Words, sharedSlang } = chatDictionary;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pt-2">
        <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          İkonik Kelimeler & Sohbet Sözlüğü
        </h2>
      </div>

      {/* Main Container Card */}
      <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-6">
        
        {/* Toggle Switch */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
            DİL & JARGON ANALİZİ
          </span>
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/60 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('words')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'words'
                  ? 'bg-sky-500 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kişi İmzaları
            </button>
            <button
              onClick={() => setActiveTab('slang')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'slang'
                  ? 'bg-sky-500 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ortak Jargon & Sözlük
            </button>
          </div>
        </div>

        {/* Tab 1: Kişi İmzaları */}
        {activeTab === 'words' && (
          <div className="space-y-4">
            
            {/* User 1 Words */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>{user1.name}'in En Çok Kullandığı Kelimeler</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {user1Words.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">"{item.word}"</span>
                      <span className="font-mono font-bold text-xs text-sky-600">{item.count}x</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-sans leading-tight">
                      {item.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* User 2 Words */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{user2.name}'in En Çok Kullandığı Kelimeler</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {user2Words.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">"{item.word}"</span>
                      <span className="font-mono font-bold text-xs text-emerald-600">{item.count}x</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-sans leading-tight">
                      {item.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Ortak Jargon & Sözlük */}
        {activeTab === 'slang' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Quote className="w-4 h-4 text-sky-500" />
              <span>Sohbetin Özel Terimler Sözlüğü</span>
            </div>

            <div className="space-y-2.5">
              {sharedSlang.map((slang, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 transition-all hover:bg-white hover:border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">
                      📖 {slang.phrase}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] font-mono font-bold">
                      {slang.count} kez geçti
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {slang.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
