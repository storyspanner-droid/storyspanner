'use client';

import { Category } from '@/lib/types';
import { CATEGORY_LIST } from '@/lib/constants/categories';

interface Props {
  value: string;
  onChange: (cat: Category) => void;
  error?: string;
}

export default function WriteCategoryPicker({ value, onChange, error }: Props) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-[#6B7280] mb-2">카테고리 *</label>
      <div className="flex flex-wrap gap-2">
        {CATEGORY_LIST.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.label as Category)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
              value === cat.label
                ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]'
                : 'bg-white text-[#6B7280] border-[#D1D5DB] hover:border-[#6C3FC5] hover:text-[#6C3FC5]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      {error && <p className="text-[#EF4444] text-xs mt-1.5">{error}</p>}
    </div>
  );
}
