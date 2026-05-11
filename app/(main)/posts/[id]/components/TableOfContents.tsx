'use client';

import { useEffect, useState, useRef } from 'react';
import { parseH2sFromHtml, HeadingItem } from '@/lib/utils/headingIds';

interface Props {
  content: string;
}

export default function TableOfContents({ content }: Props) {
  const [items, setItems] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setItems(parseH2sFromHtml(content));
  }, [content]);

  useEffect(() => {
    if (items.length === 0) return;
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
          );
          setActiveId(topmost.target.id);
        }
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-4">
      <div className="flex items-center mb-3">
        <span className="text-[13px] font-bold text-[#111111]">📋 목차</span>
        <span className="ml-2 bg-[#6C3FC5] text-white text-[11px] px-1.5 py-0.5 rounded-full leading-none">
          {items.length}
        </span>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById(item.id);
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className={`w-full text-left px-2 py-1.5 text-[13px] rounded-[6px] transition-colors flex items-center gap-2 ${
                activeId === item.id
                  ? 'text-[#6C3FC5] font-bold bg-[#F3EEFF]'
                  : 'text-[#4B5563] hover:text-[#6C3FC5] hover:bg-[#F3EEFF]'
              }`}
            >
              <span className="text-[#6C3FC5] text-[11px] font-bold shrink-0">H2</span>
              <span className="truncate">{item.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
