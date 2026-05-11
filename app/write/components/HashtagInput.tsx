'use client';

import { useRef } from 'react';
import { useTagAutocomplete } from '../hooks/useTagAutocomplete';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function HashtagInput({ value, onChange }: Props) {
  const { suggestions, showDropdown, onInputChange, selectSuggestion, setShowDropdown } = useTagAutocomplete();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    onChange(v);
    onInputChange(v);
  };

  const handleSelect = (tag: string) => {
    const next = selectSuggestion(tag, value);
    onChange(next);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        onFocus={() => onInputChange(value)}
        placeholder="쉼표 또는 공백으로 구분 (예: 게임공략, 초보자팁)"
        className="w-full px-3.5 py-3 border border-[#E5E7EB] rounded-[10px] text-[14px] placeholder-[#9CA3AF] focus:outline-none focus:border-[#6C3FC5] transition-colors"
      />
      {showDropdown && (
        <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-[10px] shadow-lg overflow-hidden">
          {suggestions.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); handleSelect(tag); }}
                className="w-full text-left px-4 py-2 text-[13px] text-[#111111] hover:bg-[#F3EEFF] hover:text-[#6C3FC5] transition-colors flex items-center gap-2"
              >
                <span className="text-[#9CA3AF] text-[11px]">#</span>
                {tag}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
