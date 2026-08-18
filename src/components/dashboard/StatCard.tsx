import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  emoji?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  emoji,
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#11141A] border border-white/10 hover:border-[#38BDF8]/40 transition-all duration-300 shadow-soft group hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#94A3B8]">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-mono mt-1.5 tracking-tight text-white group-hover:text-[#38BDF8] transition-colors">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs mt-1 text-[#64748B] font-sans font-medium line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>
        {/* Baby Blue Glow Icon Circle */}
        <div className="w-11 h-11 rounded-2xl bg-[#0284C7]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0 text-xl font-emoji shadow-glow-blue group-hover:scale-105 transition-transform">
          {emoji ? <span className="font-emoji">{emoji}</span> : icon}
        </div>
      </div>
    </div>
  );
};
