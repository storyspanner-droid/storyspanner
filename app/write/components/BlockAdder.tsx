'use client';

import { useState } from 'react';
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

interface Props {
  blockId: string;
  onAdd: (afterId: string, type: BlockType) => void;
}

export default function BlockAdder({ blockId, onAdd }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute left-0 top-0 h-full flex items-center -translate-x-8 z-10 pointer-events-none">
      <div className="relative pointer-events-auto">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          title="블록 추가"
          className={`w-6 h-6 rounded-full border bg-white flex items-center justify-center text-[13px] leading-none transition-all shrink-0
            ${open
              ? 'opacity-100 border-[#6C3FC5] text-[#6C3FC5] bg-[#F3EEFF]'
              : 'opacity-0 group-hover/block:opacity-100 border-[#D1D5DB] text-[#9CA3AF] hover:border-[#6C3FC5] hover:text-[#6C3FC5] hover:bg-[#F3EEFF]'
            }`}
        >+</button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-8 z-20 bg-white border border-[#E5E7EB] rounded-[12px] shadow-xl py-1 min-w-[160px]">
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
    </div>
  );
}
