'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const VARIANT: Record<Variant, string> = {
  primary:   'bg-[#111111] text-white hover:bg-gray-800 active:bg-gray-900',
  secondary: 'bg-white text-[#111111] border border-[#E5E7EB] hover:bg-gray-50 active:bg-gray-100',
  danger:    'bg-[#EF4444] text-white hover:bg-red-600 active:bg-red-700',
  ghost:     'bg-transparent text-[#111111] hover:bg-gray-100 active:bg-gray-200',
};

const SIZE: Record<Size, string> = {
  sm: 'h-8  px-3  text-xs  rounded-[8px]  gap-1.5',
  md: 'h-10 px-4  text-sm  rounded-[10px] gap-2',
  lg: 'h-12 px-6  text-[15px] rounded-[10px] gap-2',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-semibold transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANT[variant],
        SIZE[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
