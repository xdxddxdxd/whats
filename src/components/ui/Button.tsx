import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'wrapped' | 'blue' | 'black';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-2xl gap-2',
    lg: 'text-base px-6 py-3.5 rounded-2xl gap-2.5 font-semibold',
  };

  const variantStyles = {
    // Primary: Solid sleek black with white text and subtle blue glow
    primary: 'bg-[#0A0A0A] text-white hover:bg-[#1C1C1C] shadow-sm hover:shadow-md border border-black/10',
    // Blue: Baby blue accent button
    blue: 'bg-[#38BDF8] text-[#0A0A0A] hover:bg-[#7DD3FC] font-semibold shadow-sm hover:shadow-glow-blue',
    // Black / Wrapped: Sleek dark button with baby blue border/glow
    wrapped: 'bg-[#0A0A0A] text-white hover:bg-[#171717] border border-[#38BDF8]/40 shadow-glow-blue',
    // Black: Pure dark
    black: 'bg-[#0A0A0A] text-white hover:bg-[#1A1A1A]',
    // Secondary: Clean white with soft border
    secondary: 'bg-white text-[#0A0A0A] border border-[#E5E9F0] hover:bg-[#F7F9FC] hover:border-[#CBD5E1] shadow-sm',
    // Ghost: Subtle transparent
    ghost: 'bg-transparent text-[#6B7280] hover:text-[#0A0A0A] hover:bg-black/5',
    // Danger: Soft rose / red
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>İşleniyor...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
