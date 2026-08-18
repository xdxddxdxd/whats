import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  bubbleTail?: 'left' | 'right' | 'none';
  variant?: 'white' | 'soft' | 'dark' | 'glass';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  bubbleTail = 'none',
  variant = 'white',
  ...props
}) => {
  const variantStyles = {
    white: 'bg-white border border-[#E5E9F0] shadow-soft hover:shadow-soft-hover',
    soft: 'bg-[#F7F9FC] border border-[#E5E9F0] shadow-soft',
    dark: 'bg-[#141414] border border-white/10 text-white shadow-glow-dark',
    glass: 'bg-white/80 backdrop-blur-md border border-white/70 shadow-soft',
  };

  const tailStyles = {
    left: 'chat-bubble-tail-left',
    right: 'chat-bubble-tail-right',
    none: '',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'rounded-3xl p-6 transition-all duration-300',
          variantStyles[variant],
          tailStyles[bubbleTail],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
