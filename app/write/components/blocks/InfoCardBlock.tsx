'use client';

import { useState } from 'react';
import { InfoCardEditorBlock, InfoCardItem } from '../../types';

interface Props {
  block: InfoCardEditorBlock;
  onChange: (id: string, updates: Partial<InfoCardEditorBlock>) => void;
  onRemove: (id: string) => void;
}

function uid() { return Math.random().toString(36).slice(2, 9); }

const PALETTE = ['#6C3FC5', '#0EA5E9', '#16A34A', '#EF4444', '#F59E0B', '#EC4899', '#111111', '#374151', '#6B7280', '#9CA3AF'];

function AccentPicker({ color, onSelect }: { color: string; onSelect: (c: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} title="테마 색상"
        className="w-5 h-5 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110"
        style={{ backgroundColor: color }} />
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-6 z-20 bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg p-2 flex flex-wrap gap-1 w-[132px]">
            {PALETTE.map((c) => (
              <button key={c} type="button" onClick={() => { onSelect(c); setOpen(false); }}
                className="w-8 h-8 rounded-[4px] border-2 transition-transform hover:scale-110"
                style={{ backgroundColor: c, borderColor: color === c ? '#6C3FC5' : '#E5E7EB' }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function InfoCardBlock({ block, onChange, onRemove }: Props) {
  const accent = block.accent ?? '#6C3FC5';

  const updateItem = (itemId: string, updates: Partial<InfoCardItem>) => {
    const items = block.items.map((i) => i.id === itemId ? { ...i, ...updates } : i);
    onChange(block.id, { items });
  };

  const addItem = () => {
    if (block.items.length >= 6) return;
    const items = [...block.items, { id: uid(), label: '새 항목', value: '내용', icon: '📋' }];
    onChange(block.id, { items });
  };

  const removeItem = (itemId: string) => {
    if (block.items.length <= 1) return;
    const items = block.items.filter((i) => i.id !== itemId);
    onChange(block.id, { items });
  };

  return (
    <div className="relative group/block my-2">
      {/* 상단 컨트롤 */}
      <div className="flex items-center gap-2 mb-2 opacity-0 group-hover/block:opacity-100 transition-opacity h-7">
        <AccentPicker color={accent} onSelect={(c) => onChange(block.id, { accent: c })} />
        <input
          type="text" value={block.title ?? ''}
          onChange={(e) => onChange(block.id, { title: e.target.value })}
          placeholder="카드 제목 (선택)"
          className="flex-1 text-[13px] font-bold text-[#111111] bg-transparent border-b border-[#E5E7EB] focus:outline-none focus:border-[#6C3FC5] py-0.5"
        />
        <div className="flex gap-1 shrink-0">
          {([2, 3] as const).map((c) => (
            <button key={c} type="button" onClick={() => onChange(block.id, { cols: c })}
              className={`px-2 py-0.5 text-[11px] rounded-full border transition-colors ${block.cols === c ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]' : 'text-[#6B7280] border-[#D1D5DB] hover:border-[#6C3FC5]'}`}>
              {c}열
            </button>
          ))}
        </div>
        <button type="button" onClick={() => onRemove(block.id)}
          className="text-[11px] text-[#9CA3AF] hover:text-[#EF4444] transition-colors px-1">삭제</button>
      </div>

      {block.title && (
        <p className="text-[13px] font-bold mb-2" style={{ color: accent }}>{block.title}</p>
      )}

      <div className={`grid gap-2 ${block.cols === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {block.items.map((item) => (
          <div key={item.id}
            className="relative group/item bg-[#F9FAFB] rounded-[8px] p-2.5 text-center border-t-2"
            style={{ borderTopColor: accent }}>
            <button type="button" onClick={() => removeItem(item.id)}
              className="absolute top-1 right-1 w-4 h-4 text-[#9CA3AF] hover:text-[#EF4444] text-[10px] opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">×</button>
            <input
              type="text" value={item.icon ?? ''}
              onChange={(e) => updateItem(item.id, { icon: e.target.value })}
              className="w-12 text-center text-[18px] bg-transparent border-none focus:outline-none mb-1 mx-auto block"
              placeholder="🔖"
            />
            <input
              type="text" value={item.label}
              onChange={(e) => updateItem(item.id, { label: e.target.value })}
              className="w-full text-[11px] text-[#6B7280] text-center bg-transparent border-none focus:outline-none mb-0.5"
              placeholder="라벨"
            />
            <input
              type="text" value={item.value}
              onChange={(e) => updateItem(item.id, { value: e.target.value })}
              className="w-full text-[13px] font-bold text-[#111111] text-center bg-transparent border-none focus:outline-none"
              placeholder="값"
            />
          </div>
        ))}
      </div>

      {block.items.length < 6 && (
        <button type="button" onClick={addItem}
          className="mt-2 w-full py-1.5 text-[12px] border border-dashed rounded-[8px] hover:bg-[#F3EEFF] transition-colors"
          style={{ color: accent, borderColor: accent + '80' }}>
          + 항목 추가
        </button>
      )}
    </div>
  );
}
