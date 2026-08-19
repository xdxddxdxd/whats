'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  emoji?: string;
  badge?: string;
  isHero?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  emoji,
  badge,
  isHero = false,
}) => {
  return (
    <div
      className={`p-6 rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:shadow-[0_8px_28px_-4px_rgba(15,23,42,0.08)] flex flex-col justify-between ${
        isHero ? 'border-sky-100 ring-1 ring-sky-50' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
            {title}
          </p>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-600 font-mono">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 font-medium font-sans pt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {(emoji || icon || badge) && (
          <div className="shrink-0">
            {badge ? (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-600 font-sans">
                {badge}
              </span>
            ) : emoji ? (
              <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-xl font-emoji">
                {emoji}
              </div>
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                {icon}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
