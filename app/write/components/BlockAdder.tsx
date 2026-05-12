'use client';

import { useState, useRef, useEffect } from 'react';
import { BlockType } from '../types';

const BLOCK_MENU: { type: BlockType; icon: string; label: string }[] = [
  { type: 'image',      icon: '🖼',  label: '이미지 업로드' },
  { type: 'youtube',    icon: '🎬', label: '유튜브 임베드' },
  { type: 'callout',    icon: '💡', label: '강조박스' },
  { type: 'timeline',   icon: '⏱', label: '타임라인' },
  { type: 'toc',        icon: '📋', label: '목차' },
  { type: 'table',      icon: '📊', label: '표' },
  { type: 'divider',    icon: '➖', label: '구분선' },
  { type: 'columns',    icon: '⬜', label: '컬럼 레이아웃' },
  { type: 'compare',    icon: '⚖️', label: '비교표' },
  { type: 'info-card',  icon: '🗂', label: '정보 카드' },
  { type: 'steps',      icon: '📝', label: '스텝 카드' },
];

const MENU_HEIGHT = 320;

interface MenuPosition {
  top?: number;
  bottom?: number;
  left: number;
}

interface Props {
  blockId: string;
  onAdd: (afterId: string, type: BlockType) => void;
  floating?: boolean;
}

export default function BlockAdder({ blockId, onAdd, floating }: Props) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleScroll = () => setOpen(false);

    let scrollParent: Element | null = buttonRef.current?.parentElement ?? null;
    while (scrollParent) {
      const overflow = window.getComputedStyle(scrollParent).overflowY;
      if (overflow === 'auto' || overflow === 'scroll') break;
      scrollParent = scrollParent.parentElement;
    }

    const target = scrollParent ?? window;
    target.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      target.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [open]);

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;

      if (spaceBelow < MENU_HEIGHT) {
        setMenuPosition({ bottom: window.innerHeight - rect.top + 4, left: rect.left });
      } else {
        setMenuPosition({ top: rect.bottom + 4, left: rect.left });
      }
    }
    setOpen((v) => !v);
  };

  const buttonAndMenu = (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        title="블록 추가"
        className={`w-6 h-6 rounded-full border bg-white flex items-center justify-center text-[13px] leading-none transition-all shrink-0
          ${open
            ? 'border-[#6C3FC5] text-[#6C3FC5] bg-[#F3EEFF]'
            : 'border-[#D1D5DB] text-[#9CA3AF] hover:border-[#6C3FC5] hover:text-[#6C3FC5] hover:bg-[#F3EEFF]'
          }`}
      >+</button>

      {open && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[9999] bg-white border border-[#E5E7EB] rounded-[12px] shadow-xl py-1 min-w-[160px] max-h-[300px] overflow-y-auto"
            style={{ top: menuPosition.top, bottom: menuPosition.bottom, left: menuPosition.left }}
          >
            {BLOCK_MENU.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => { onAdd(blockId, item.type); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#111111] hover:bg-[#F3EEFF] hover:text-[#6C3FC5] transition-colors text-left"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  if (floating) {
    return buttonAndMenu;
  }

  return (
    <div className="absolute left-0 top-0 h-full flex items-center -translate-x-8 z-10 pointer-events-none">
      <div className="pointer-events-auto">
        {buttonAndMenu}
      </div>
    </div>
  );
}
