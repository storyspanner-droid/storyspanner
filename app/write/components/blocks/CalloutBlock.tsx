'use client';

import { useRef, useEffect } from 'react';
import { CalloutEditorBlock, CalloutType } from '../../types';

const TYPES: { type: CalloutType; icon: string; label: string; bg: string; border: string }[] = [
  { type: 'tip',     icon: '💡', label: '팁',   bg: '#EFF6FF', border: '#3B82F6' },
  { type: 'warning', icon: '⚠️', label: '주의', bg: '#FFFBEB', border: '#F59E0B' },
  { type: 'error',   icon: '❌', label: '경고', bg: '#FEF2F2', border: '#EF4444' },
  { type: 'info',    icon: '✅', label: '정보', bg: '#F0FDF4', border: '#22C55E' },
];

interface Props {
  block: CalloutEditorBlock;
  onChange: (id: string, updates: Partial<CalloutEditorBlock>) => void;
  onRemove: (id: string) => void;
  onEscape?: (blockId: string) => void;
}

export default function CalloutBlock({ block, onChange, onRemove, onEscape }: Props) {
  const current = TYPES.find((t) => t.type === block.calloutType) ?? TYPES[0];
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = block.content;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="rounded-[8px] p-4 flex gap-3 relative"
      style={{ background: current.bg, borderLeft: `4px solid ${current.border}` }}
    >
      <span className="text-[20px] shrink-0 select-none">{current.icon}</span>
      <div className="flex-1">
        <div className="flex items-center gap-1 mb-2">
          {TYPES.map((t) => (
            <button
              key={t.type}
              type="button"
              onClick={() => onChange(block.id, { calloutType: t.type })}
              className={`px-2 py-0.5 text-[11px] rounded-full transition-colors ${
                block.calloutType === t.type
                  ? 'bg-white/70 font-bold'
                  : 'text-[#6B7280] hover:bg-white/50'
              }`}
              style={{ border: `1px solid ${t.border}`, color: t.border }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onChange(block.id, { content: e.currentTarget.innerHTML })}
          onCompositionEnd={(e) => onChange(block.id, { content: e.currentTarget.innerHTML })}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onChange(block.id, { content: contentRef.current?.innerHTML ?? '' });
              onEscape?.(block.id);
            }
          }}
          className="focus:outline-none text-[14px] text-[#111111] leading-[1.8] min-h-[24px] empty:before:content-['내용을_입력하세요...'] empty:before:text-[#9CA3AF] empty:before:pointer-events-none"
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(block.id)}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-[#9CA3AF] hover:text-[#EF4444] rounded hover:bg-white/60 transition-colors text-[12px]"
      >✕</button>
    </div>
  );
}
