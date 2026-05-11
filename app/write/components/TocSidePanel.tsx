'use client';

import { TocItem } from '../types';

interface Props {
  items: TocItem[];
}

export default function TocSidePanel({ items }: Props) {
  if (items.length === 0) return null;

  const scrollTo = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    // 2xl(1536px) 이상에서만 표시 — 그 아래에서는 에디터와 겹침
    // 에디터 폼 960px + padding 48px = 1008px 양쪽 → 264px 여백 확보 (2xl)
    <div
      className="hidden 2xl:block"
      style={{
        position: 'fixed',
        top: '50%',
        // 에디터 우측 끝(calc(50vw + 480px))에서 24px 떨어진 위치
        left: 'calc(50vw + 504px)',
        transform: 'translateY(-50%)',
        width: '200px',
        background: '#FFFFFF',
        border: '0.5px solid #E5E7EB',
        borderRadius: '12px',
        padding: '16px',
        zIndex: 40,
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}
    >
      <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">목차</p>
      <ul className="space-y-1.5">
        {items.map((item, idx) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => scrollTo(item.anchor)}
              className="w-full text-left text-[12px] text-[#6C3FC5] hover:text-[#5a33a8] hover:underline transition-colors truncate leading-relaxed"
            >
              <span className="text-[10px] text-[#9CA3AF] mr-1">{idx + 1}.</span>
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
