'use client';

import { TimelineEditorBlock, TimelineItem } from '../../types';

function uid() { return Math.random().toString(36).slice(2, 9); }

interface Props {
  block: TimelineEditorBlock;
  onChange: (id: string, updates: Partial<TimelineEditorBlock>) => void;
  onRemove: (id: string) => void;
}

export default function TimelineBlock({ block, onChange, onRemove }: Props) {
  const update = (items: TimelineItem[]) => onChange(block.id, { items });

  const updateItem = (itemId: string, field: keyof TimelineItem, value: string) => {
    update(block.items.map((i) => i.id === itemId ? { ...i, [field]: value } : i));
  };

  const addItem = () => {
    if (block.items.length >= 10) return;
    update([...block.items, { id: uid(), date: '', title: '', content: '' }]);
  };

  const removeItem = (itemId: string) => {
    if (block.items.length <= 1) return;
    update(block.items.filter((i) => i.id !== itemId));
  };

  const moveItem = (itemId: string, dir: 'up' | 'down') => {
    const idx = block.items.findIndex((i) => i.id === itemId);
    if (dir === 'up' && idx <= 0) return;
    if (dir === 'down' && idx >= block.items.length - 1) return;
    const next = [...block.items];
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    update(next);
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[8px] p-4 relative">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] font-bold text-[#6C3FC5]">⏱ 타임라인</span>
        <button type="button" onClick={() => onRemove(block.id)} className="text-[11px] text-[#9CA3AF] hover:text-[#EF4444] transition-colors">삭제</button>
      </div>
      <div className="space-y-3">
        {block.items.map((item, idx) => (
          <div key={item.id} className="flex gap-3 group">
            <div className="flex flex-col items-center pt-1">
              <div className="w-3 h-3 rounded-full bg-[#6C3FC5] shrink-0" />
              {idx < block.items.length - 1 && <div className="w-0.5 flex-1 bg-[#E5E7EB] mt-1" style={{ minHeight: 32 }} />}
            </div>
            <div className="flex-1 pb-2">
              <input
                type="text"
                placeholder="날짜 (예: 2024.01)"
                value={item.date}
                onChange={(e) => updateItem(item.id, 'date', e.target.value)}
                className="w-full text-[11px] font-semibold text-[#6C3FC5] bg-transparent border-none focus:outline-none placeholder-[#C4B5FD] mb-1"
              />
              <input
                type="text"
                placeholder="제목"
                value={item.title}
                onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                className="w-full text-[14px] font-bold text-[#111111] bg-transparent border-none focus:outline-none placeholder-[#9CA3AF] mb-1"
              />
              <input
                type="text"
                placeholder="내용"
                value={item.content}
                onChange={(e) => updateItem(item.id, 'content', e.target.value)}
                className="w-full text-[13px] text-[#6B7280] bg-transparent border-none focus:outline-none placeholder-[#D1D5DB]"
              />
            </div>
            <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button type="button" onClick={() => moveItem(item.id, 'up')} className="text-[10px] text-[#9CA3AF] hover:text-[#6C3FC5]">▲</button>
              <button type="button" onClick={() => moveItem(item.id, 'down')} className="text-[10px] text-[#9CA3AF] hover:text-[#6C3FC5]">▼</button>
              <button type="button" onClick={() => removeItem(item.id)} className="text-[10px] text-[#9CA3AF] hover:text-[#EF4444]">✕</button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem} className="mt-3 text-[12px] text-[#6C3FC5] hover:text-[#5a33a8] font-medium transition-colors">+ 항목 추가</button>
    </div>
  );
}
