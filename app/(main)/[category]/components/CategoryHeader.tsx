'use client';

import { Category } from '@/lib/types';
import { SortType } from '../hooks/useCategoryPosts';

interface Props {
  category: Category;
  totalCount: number;
  sort: SortType;
  onSortChange: (sort: SortType) => void;
  search: string;
  onSearchChange: (v: string) => void;
  onSearchSubmit: () => void;
}

const SORT_OPTIONS: SortType[] = ['최신순', '인기순', '조회수순', '댓글많은순'];

export default function CategoryHeader({
  category,
  totalCount,
  sort,
  onSortChange,
  search,
  onSearchChange,
  onSearchSubmit,
}: Props) {
  return (
    <div className="flex flex-col gap-3 mb-3 pb-3 border-b border-[#E5E7EB]">
      {/* 상단: 카테고리명 + 글 수 */}
      <div className="flex items-center gap-2">
        <h2 className="text-[15px] font-bold text-[#111111]">{category}</h2>
        <span className="text-[13px] text-[#9CA3AF]">{totalCount.toLocaleString()}개</span>
      </div>

      {/* 하단: 정렬 버튼 + 검색 */}
      <div className="flex items-center justify-between gap-3">
        {/* 정렬 버튼 */}
        <div className="flex items-center gap-1">
          {SORT_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSortChange(s)}
              className={`px-3 py-1 text-[12px] font-medium rounded-[6px] transition-colors ${
                sort === s
                  ? 'bg-[#6C3FC5] text-white'
                  : 'text-[#6B7280] hover:bg-[#F3F4F6]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* 검색창 */}
        <form
          onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}
          className="flex items-center gap-1.5"
        >
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={`${category} 글 검색...`}
              className="h-8 pl-3 pr-3 w-[180px] border border-[#E5E7EB] rounded-[8px] text-[12px] placeholder-[#9CA3AF] focus:outline-none focus:border-[#6C3FC5] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="h-8 px-3 bg-[#6C3FC5] text-white text-[12px] font-bold rounded-[8px] hover:bg-[#5a33a8] transition-colors shrink-0"
          >
            검색
          </button>
        </form>
      </div>
    </div>
  );
}
