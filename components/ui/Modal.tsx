'use client';

import { ReactNode, useEffect } from 'react';

type Size = 'sm' | 'md' | 'lg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: Size;
}

const SIZE: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      <div className={`relative w-full ${SIZE[size]} bg-white rounded-[16px] shadow-xl`}>
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E5E7EB]">
            <h2 className="text-base font-bold text-[#111111]">{title}</h2>
            <button
              onClick={onClose}
              className="text-[#6B7280] hover:text-[#111111] p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <XIcon />
            </button>
          </div>
        )}

        <div className="px-6 py-5 text-sm text-[#111111] leading-relaxed">{children}</div>

        {footer && (
          <div className="flex justify-end gap-2 px-6 pb-6 pt-2">{footer}</div>
        )}
      </div>
    </div>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
