'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  rows?: number;
}

const BASE = 'w-full px-4 py-3 border rounded-[10px] text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none transition-colors bg-white';

function fieldCls(error?: string, disabled?: boolean) {
  if (disabled) return 'border-[#E5E7EB] bg-gray-50 opacity-60 cursor-not-allowed';
  if (error)    return 'border-[#EF4444] bg-red-50';
  return 'border-[#E5E7EB] focus:border-[#111111]';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, type = 'text', className = '', ...props }, ref) => {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className="w-full">
        {label && <label className="block text-xs font-semibold text-[#111111] mb-1.5">{label}</label>}
        <div className="relative">
          <input
            ref={ref}
            type={isPassword ? (show ? 'text' : 'password') : type}
            className={[BASE, fieldCls(error, props.disabled), isPassword ? 'pr-10' : '', className].join(' ')}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111111] transition-colors"
            >
              {show ? <EyeOff /> : <Eye />}
            </button>
          )}
        </div>
        {error && <p className="text-[#EF4444] text-xs mt-1">{error}</p>}
        {!error && hint && <p className="text-[#6B7280] text-xs mt-1">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export function Textarea({ label, error, hint, rows = 4, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-[#111111] mb-1.5">{label}</label>}
      <textarea
        rows={rows}
        className={[BASE, 'resize-none', fieldCls(error, props.disabled), className].join(' ')}
        {...props}
      />
      {error && <p className="text-[#EF4444] text-xs mt-1">{error}</p>}
      {!error && hint && <p className="text-[#6B7280] text-xs mt-1">{hint}</p>}
    </div>
  );
}

function Eye() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
