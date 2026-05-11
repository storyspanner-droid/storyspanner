'use client';

import { Category } from '@/lib/types';

const CATEGORIES: Category[] = [
  '게임', '의료정보', '인테리어DIY', '비즈니스', '코인/투자', '마케팅', '공지사항',
];

interface Props {
  value: string;
  onChange: (cat: Category) => void;
  error?: string;
  userLevel?: number;
}

export default function WriteCategoryPicker({ value, onChange, error, userLevel = 0 }: Props) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-[#6B7280] mb-2">카테고리 *</label>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const disabled = cat === '공지사항' && userLevel < 5;
          return (
            <button
              key={cat}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onChange(cat)}
              title={disabled ? '레벨5 관리자만 선택 가능합니다' : undefined}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                disabled
                  ? 'bg-[#F3F4F6] text-[#D1D5DB] border-[#E5E7EB] cursor-not-allowed'
                  : value === cat
                    ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]'
                    : 'bg-white text-[#6B7280] border-[#D1D5DB] hover:border-[#6C3FC5] hover:text-[#6C3FC5]'
              }`}
            >
              {cat}{disabled && ' 🔒'}
            </button>
          );
        })}
      </div>
      {error && <p className="text-[#EF4444] text-xs mt-1.5">{error}</p>}
    </div>
  );
}
