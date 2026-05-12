'use client';

import { useRef, useEffect, useState } from 'react';
import { TextEditorBlock, BlockType } from '../../types';

function uid() { return Math.random().toString(36).slice(2, 9); }

interface Props {
  block: TextEditorBlock;
  onChange: (id: string, html: string) => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  placeholder?: string;
  isFirst?: boolean;
  onAddBlockAfter?: (type: BlockType) => void;
}

interface SlashItem {
  icon: string;
  label: string;
  desc: string;
  isH?: boolean;
  action: () => void;
}

export default function TextBlock({ block, onChange, registerRef, placeholder = '내용을 입력하세요...', isFirst, onAddBlockAfter }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isComposing = useRef(false);
  const [showSlash, setShowSlash] = useState(false);
  const [slashIdx, setSlashIdx] = useState(0);

  useEffect(() => {
    registerRef(block.id, ref.current);
    return () => registerRef(block.id, null);
  }, [block.id, registerRef]);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== block.html) {
      ref.current.innerHTML = block.html;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setH2 = () => {
    if (!ref.current) return;
    const id = 'h2-' + uid();
    ref.current.innerHTML = `<h2 id="${id}"><br></h2>`;
    const h = ref.current.querySelector('h2');
    if (h) {
      const r = document.createRange();
      r.setStart(h, 0);
      r.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(r);
    }
    ref.current.focus();
    onChange(block.id, ref.current.innerHTML);
  };

  const slashItems: SlashItem[] = [
    { icon: '📝', label: '텍스트', desc: '일반 텍스트 블록', action: () => ref.current?.focus() },
    { icon: 'H2', label: '소제목', desc: '목차에 자동 등록', isH: true, action: setH2 },
    { icon: '🖼️', label: '이미지', desc: '이미지 업로드', action: () => onAddBlockAfter?.('image') },
    { icon: '💡', label: '콜아웃', desc: '강조 박스', action: () => onAddBlockAfter?.('callout') },
    { icon: '📊', label: '표', desc: '데이터 표', action: () => onAddBlockAfter?.('table') },
    { icon: '⏱️', label: '타임라인', desc: '연대표', action: () => onAddBlockAfter?.('timeline') },
    { icon: '▶️', label: '유튜브', desc: 'YouTube 영상', action: () => onAddBlockAfter?.('youtube') },
    { icon: '——', label: '구분선', desc: '구분 선', action: () => onAddBlockAfter?.('divider') },
    { icon: '📋', label: '목차', desc: '자동 목차 블록', action: () => onAddBlockAfter?.('toc') },
    { icon: '⬜', label: '컬럼 레이아웃', desc: '1~3열 자유 배치', action: () => onAddBlockAfter?.('columns') },
    { icon: '⚖️', label: '비교표', desc: '좌우 항목 비교', action: () => onAddBlockAfter?.('compare') },
    { icon: '🗂', label: '정보 카드', desc: '키-값 정보 카드', action: () => onAddBlockAfter?.('info-card') },
    { icon: '📝', label: '스텝 카드', desc: '번호+제목+내용', action: () => onAddBlockAfter?.('steps') },
  ];

  const execSlash = (idx: number) => {
    setShowSlash(false);
    slashItems[idx].action();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (showSlash) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSlashIdx((i) => (i + 1) % slashItems.length); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSlashIdx((i) => (i - 1 + slashItems.length) % slashItems.length); return; }
      if (e.key === 'Enter') { e.preventDefault(); execSlash(slashIdx); return; }
      if (e.key === 'Escape' || e.key === 'Backspace') { setShowSlash(false); return; }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      const sel = window.getSelection();
      if (sel) {
        const anchorNode = sel.anchorNode;
        const el = anchorNode
          ? (anchorNode.nodeType === Node.TEXT_NODE ? anchorNode.parentElement : anchorNode as Element)
          : null;
        const h2 = el?.closest('h2') as HTMLHeadingElement | null;
        if (h2) {
          e.preventDefault();
          const p = document.createElement('p');
          p.innerHTML = '<br>';
          h2.after(p);
          const range = document.createRange();
          range.setStart(p, 0);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          if (ref.current) onChange(block.id, ref.current.innerHTML);
          return;
        }
      }
    }
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if ((ref.current?.textContent ?? '').trim() === '') {
        e.preventDefault();
        setShowSlash(true);
        setSlashIdx(0);
      }
    }
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={(e) => {
          isComposing.current = false;
          onChange(block.id, e.currentTarget.innerHTML);
        }}
        onInput={(e) => {
          const el = e.currentTarget;
          el.querySelectorAll<HTMLHeadingElement>('h2:not([id])').forEach((h) => {
            h.id = 'h2-' + uid();
          });
          if (!isComposing.current) onChange(block.id, el.innerHTML);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setShowSlash(false), 150)}
        className="min-h-[28px] w-full focus:outline-none text-[16px] text-[#111111] leading-[2] empty:before:content-[attr(data-placeholder)] empty:before:text-[#9CA3AF] empty:before:pointer-events-none"
        style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        data-placeholder={isFirst ? placeholder : ''}
      />

      {showSlash && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-[12px] shadow-lg p-2 w-[280px] z-50">
          <p className="text-[11px] text-[#9CA3AF] px-3 py-1 mb-1">블록 타입 선택</p>
          {slashItems.map((item, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execSlash(i); }}
              className={`w-full text-left px-3 py-2 rounded-[8px] flex items-center gap-3 transition-colors ${slashIdx === i ? 'bg-[#F3EEFF]' : 'hover:bg-[#F3EEFF]'}`}
            >
              <span className={`shrink-0 w-6 text-center ${item.isH ? 'text-[11px] font-black text-[#6C3FC5]' : 'text-[14px]'}`}>
                {item.icon}
              </span>
              <div>
                <div className="text-[13px] text-[#111111] font-medium leading-tight">{item.label}</div>
                <div className="text-[11px] text-[#9CA3AF]">{item.desc}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
