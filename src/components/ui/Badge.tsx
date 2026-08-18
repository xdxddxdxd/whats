import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'black' | 'gray' | 'white' | 'neon';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'blue',
  size = 'md',
  ...props
}) => {
  const variantStyles = {
    // Light baby blue pill
    blue: 'bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD]',
    // Solid dark black pill
    black: 'bg-[#0A0A0A] text-white border border-black/20',
    // Soft neutral gray pill
    gray: 'bg-[#F1F4F9] text-[#475569] border border-[#E2E8F0]',
    // Clean white
    white: 'bg-white text-[#0A0A0A] border border-[#E5E9F0] shadow-sm',
    // Wrapped neon glow pill
    neon: 'bg-white/10 text-white border border-[#38BDF8]/40 backdrop-blur-md',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-full font-medium',
    md: 'text-xs px-3 py-1 rounded-full font-semibold',
  };

  return (
    <span
      className={twMerge(clsx('inline-flex items-center gap-1.5', sizeStyles[size], variantStyles[variant], className))}
      {...props}
    >
      {children}
    </span>
  );
};
