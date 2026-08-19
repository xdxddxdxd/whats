'use client';

import React from 'react';

export const DashboardSkeleton: React.FC<{ type?: 'sentiment' | 'relationship' | 'general' }> = ({
  type = 'general'
}) => {
  return (
    <div className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] space-y-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50" />
          <div className="space-y-2">
            <div className="w-32 h-4 bg-slate-200 rounded-md" />
            <div className="w-20 h-3 bg-slate-100 rounded-md" />
          </div>
        </div>
        <div className="w-16 h-6 rounded-full bg-slate-100" />
      </div>

      {type === 'sentiment' ? (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-16 h-3 bg-slate-200 rounded" />
              <div className="w-24 h-5 bg-slate-300 rounded" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-16 h-3 bg-slate-200 rounded" />
              <div className="w-24 h-5 bg-slate-300 rounded" />
            </div>
          </div>
          <div className="h-28 w-full rounded-2xl bg-slate-50 border border-slate-100" />
          <div className="space-y-2 pt-2">
            <div className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-100" />
            <div className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-100" />
          </div>
        </div>
      ) : type === 'relationship' ? (
        <div className="space-y-4 pt-2">
          <div className="flex gap-2">
            <div className="w-24 h-8 rounded-full bg-sky-100" />
            <div className="w-28 h-8 rounded-full bg-slate-100" />
            <div className="w-24 h-8 rounded-full bg-slate-100" />
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="w-36 h-4 bg-slate-300 rounded" />
            <div className="w-full h-3 bg-slate-200 rounded-full" />
            <div className="w-28 h-3 bg-slate-200 rounded" />
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="w-36 h-4 bg-slate-300 rounded" />
            <div className="w-full h-3 bg-slate-200 rounded-full" />
            <div className="w-28 h-3 bg-slate-200 rounded" />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-full h-32 rounded-2xl bg-slate-50" />
          <div className="w-3/4 h-4 bg-slate-100 rounded" />
        </div>
      )}
    </div>
  );
};
