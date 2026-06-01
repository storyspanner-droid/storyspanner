'use client';

import { Category } from '@/lib/types';
import { useCategoryCount } from '../hooks/useCategoryCount';
import { CATEGORY_EMOJI } from '@/lib/constants/categories';

interface Props {
  category: Category;
}

export default function CategoryBanner({ category }: Props) {
  const { totalCount } = useCategoryCount(category);

  return (
    <div
      className="px-6 py-8 flex items-center justify-between"
      style={{ background: 'linear-gradient(176deg, #5B21B6 0%, #7C3AED 100%)' }}
    >
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{CATEGORY_EMOJI[category]}</span>
          <div>
            <h1 className="text-white text-[22px] font-black tracking-tight">{category}</h1>
            <p className="text-white/70 text-[13px] mt-0.5">카테고리 게시판</p>
          </div>
        </div>
        <span
          className="text-[13px] text-white px-3.5 py-1.5 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          총 게시글 {totalCount.toLocaleString()}개
        </span>
      </div>
    </div>
  );
}
