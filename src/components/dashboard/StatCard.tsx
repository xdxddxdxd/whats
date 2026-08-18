import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  emoji?: string;
  isHero?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  emoji,
  isHero = false,
}) => {
  return (
    <div
      className={`p-5 sm:p-6 rounded-3xl transition-all duration-300 shadow-soft group hover:-translate-y-1 relative overflow-hidden ${
        isHero
          ? 'bg-[#11141A] border border-[#38BDF8]/40 shadow-glow-blue'
          : 'bg-[#11141A] border border-white/10 hover:border-[#38BDF8]/40'
      }`}
    >
      {isHero && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#38BDF8]/10 rounded-full blur-2xl pointer-events-none" />
      )}

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#94A3B8]">{title}</p>
          <h3
            className={`font-mono mt-1.5 tracking-tight text-white group-hover:text-[#38BDF8] transition-colors ${
              isHero ? 'text-3xl sm:text-4xl font-black text-[#7DD3FC]' : 'text-2xl sm:text-3xl font-extrabold'
            }`}
          >
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs mt-1 text-[#64748B] font-sans font-normal line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Icon Circle */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-2xl font-emoji transition-transform group-hover:scale-105 ${
            isHero
              ? 'bg-[#0284C7]/20 border border-[#38BDF8]/40 text-[#38BDF8] shadow-glow-blue'
              : 'bg-[#0B0D11] border border-white/10 text-white'
          }`}
        >
          {emoji ? <span className="font-emoji">{emoji}</span> : icon}
        </div>
      </div>
    </div>
  );
};
