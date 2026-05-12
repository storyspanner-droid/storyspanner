'use client';

import { useRef, useEffect, useState } from 'react';
import { CompareEditorBlock, CompareItem } from '../../types';

interface Props {
  block: CompareEditorBlock;
  onChange: (id: string, updates: Partial<CompareEditorBlock>) => void;
  onRemove: (id: string) => void;
}

const PALETTE = ['#6C3FC5', '#0EA5E9', '#16A34A', '#EF4444', '#F59E0B', '#EC4899', '#111111', '#374151', '#6B7280', '#9CA3AF'];

function ColorPicker({ color, onSelect }: { color: string; onSelect: (c: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="w-4 h-4 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110"
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

function ItemsEditor({ items, color, side, onChange }: {
  items: CompareItem[];
  color: string;
  side: 'left' | 'right';
  onChange: (items: CompareItem[]) => void;
}) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, idx: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentText = e.currentTarget.textContent ?? '';
      const next = [...items];
      next[idx] = { text: currentText };
      next.splice(idx + 1, 0, { text: '' });
      onChange(next);
      setTimeout(() => refs.current[idx + 1]?.focus(), 0);
    }
    if (e.key === 'Backspace') {
      const el = e.currentTarget;
      if (!el.textContent?.trim() && items.length > 1) {
        e.preventDefault();
        const next = items.filter((_, i) => i !== idx);
        onChange(next);
        setTimeout(() => refs.current[Math.max(0, idx - 1)]?.focus(), 0);
      }
    }
  };

  const handleBlur = (idx: number, text: string) => {
    const next = items.map((item, i) => i === idx ? { text } : item);
    onChange(next);
  };

  useEffect(() => {
    refs.current.forEach((el, i) => {
      if (!el || items[i] === undefined) return;
      if (items[i].text === '' && el.textContent !== '') {
        el.textContent = '';
      }
      if (items[i].text !== '' && el !== document.activeElement && el.textContent !== items[i].text) {
        el.textContent = items[i].text;
      }
    });
  }, [items]);

  return (
    <ul className="space-y-1 mt-2 list-none p-0">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="text-[12px] mt-0.5 shrink-0 select-none" style={{ color }}>✓</span>
          <div
            ref={(el) => { refs.current[i] = el; }}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={(e) => handleKeyDown(e, i)}
            onBlur={(e) => handleBlur(i, e.currentTarget.textContent ?? '')}
            className="flex-1 text-[13px] text-[#374151] focus:outline-none min-h-[20px] leading-snug"
          />
        </li>
      ))}
    </ul>
  );
}

function TitleEditor({ value, color, onChange }: { value: string; color: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) ref.current.textContent = value;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.textContent ?? '')}
      className="text-[14px] font-bold focus:outline-none min-h-[20px] empty:before:content-['제목'] empty:before:text-white/40 empty:before:pointer-events-none"
      style={{ color }}
    />
  );
}

export default function CompareBlock({ block, onChange, onRemove }: Props) {
  const leftColor = block.leftColor ?? '#6C3FC5';
  const rightColor = block.rightColor ?? '#0EA5E9';

  return (
    <div className="relative group/block my-2">
      <div className="absolute -top-6 right-0 opacity-0 group-hover/block:opacity-100 transition-opacity">
        <button type="button" onClick={() => onRemove(block.id)}
          className="text-[11px] text-[#9CA3AF] hover:text-[#EF4444] transition-colors px-1">삭제</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* 좌측 */}
        <div className="p-4 rounded-[10px] border-2 transition-colors" style={{ borderColor: leftColor }}>
          <div className="flex items-center gap-2 mb-1">
            <ColorPicker color={leftColor} onSelect={(c) => onChange(block.id, { leftColor: c })} />
            <TitleEditor value={block.leftTitle} color={leftColor}
              onChange={(v) => onChange(block.id, { leftTitle: v })} />
          </div>
          <ItemsEditor items={block.leftItems} color={leftColor} side="left"
            onChange={(items) => onChange(block.id, { leftItems: items })} />
        </div>

        {/* 우측 */}
        <div className="p-4 rounded-[10px] border-2 transition-colors" style={{ borderColor: rightColor }}>
          <div className="flex items-center gap-2 mb-1">
            <ColorPicker color={rightColor} onSelect={(c) => onChange(block.id, { rightColor: c })} />
            <TitleEditor value={block.rightTitle} color={rightColor}
              onChange={(v) => onChange(block.id, { rightTitle: v })} />
          </div>
          <ItemsEditor items={block.rightItems} color={rightColor} side="right"
            onChange={(items) => onChange(block.id, { rightItems: items })} />
        </div>
      </div>
    </div>
  );
}
