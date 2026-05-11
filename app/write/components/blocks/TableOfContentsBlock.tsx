'use client';

import { TocEditorBlock } from '../../types';

interface Props {
  block: TocEditorBlock;
  onChange: (id: string, updates: Partial<TocEditorBlock>) => void;
  onRemove: (id: string) => void;
  h2Items: { id: string; text: string; anchor: string }[];
}

function scrollToH2(text: string, anchor: string) {
  if (anchor) {
    const byId = document.getElementById(anchor);
    if (byId) { byId.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  }
  const h2s = document.querySelectorAll('.write-editor h2');
  const target = Array.from(h2s).find((el) => el.textContent?.trim() === text);
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function TableOfContentsBlock({ block, onRemove, h2Items }: Props) {
  return (
    <div className="bg-[#F8F7F4] border border-[#E5E7EB] rounded-[8px] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#111111]">📋 목차</span>
          {h2Items.length > 0 && (
            <span className="bg-[#6C3FC5] text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">{h2Items.length}</span>
          )}
        </div>
        <button type="button" onClick={() => onRemove(block.id)} className="text-[11px] text-[#9CA3AF] hover:text-[#EF4444] transition-colors">삭제</button>
      </div>

      {h2Items.length === 0 ? (
        <p className="text-[12px] text-[#9CA3AF] leading-relaxed py-2">
          소제목(H2)을 입력하면<br />자동으로 목차가 생성됩니다
        </p>
      ) : (
        <ul className="space-y-1">
          {h2Items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollToH2(item.text, item.anchor)}
                className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-[6px] hover:bg-[#EDE9FF] transition-colors group/item"
              >
                <span className="text-[#6C3FC5] text-[10px] font-bold shrink-0">H2</span>
                <span className="text-[13px] text-[#6C3FC5] truncate group-hover/item:underline">{item.text}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-[10px] text-[#9CA3AF] mt-3 border-t border-[#E5E7EB] pt-2">H2 소제목 입력 시 자동 반영</p>
    </div>
  );
}
