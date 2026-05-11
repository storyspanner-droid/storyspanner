'use client';

import { DividerEditorBlock, DividerStyle } from '../../types';

interface Props {
  block: DividerEditorBlock;
  onChange: (id: string, updates: Partial<DividerEditorBlock>) => void;
  onRemove: (id: string) => void;
}

const STYLES: { value: DividerStyle; label: string; preview: React.ReactNode }[] = [
  { value: 'solid',  label: '실선',   preview: <div className="h-0.5 bg-[#E5E7EB] w-full" /> },
  { value: 'dashed', label: '점선',   preview: <div className="border-t-2 border-dashed border-[#E5E7EB] w-full" /> },
  { value: 'icon',   label: '아이콘', preview: <div className="text-center text-[#9CA3AF] text-[14px] tracking-[8px]">✦ ✦ ✦</div> },
];

export default function DividerBlock({ block, onChange, onRemove }: Props) {
  const current = STYLES.find((s) => s.value === block.style) ?? STYLES[0];

  return (
    <div className="group relative py-2">
      <div className="mb-2">{current.preview}</div>
      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {STYLES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange(block.id, { style: s.value })}
            className={`px-2.5 py-1 text-[11px] rounded-full border transition-colors ${
              block.style === s.value
                ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]'
                : 'text-[#6B7280] border-[#D1D5DB] hover:border-[#6C3FC5]'
            }`}
          >
            {s.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onRemove(block.id)}
          className="px-2.5 py-1 text-[11px] text-[#9CA3AF] hover:text-[#EF4444] rounded-full border border-[#E5E7EB] transition-colors"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
