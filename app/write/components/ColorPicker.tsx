'use client';

import { useRef, useEffect } from 'react';

const PRESET_COLORS = [
  '#000000', '#EF4444', '#F97316', '#EAB308',
  '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899',
  '#FFFFFF', '#6B7280', '#1E293B', '#6C3FC5',
];

interface Props {
  onSelect: (color: string) => void;
  onClose: () => void;
}

export default function ColorPicker({ onSelect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleDown);
    return () => document.removeEventListener('mousedown', handleDown);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-1 z-50 bg-white border border-[#E5E7EB] rounded-[10px] shadow-lg p-3 w-[172px]"
    >
      <div className="grid grid-cols-6 gap-1.5 mb-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(color);
            }}
            style={{
              backgroundColor: color,
              border: color === '#FFFFFF' ? '1px solid #D1D5DB' : '1px solid transparent',
            }}
            className="w-6 h-6 rounded-full hover:scale-110 transition-transform"
            title={color}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-[#F3F4F6]">
        <span className="text-[11px] text-[#6B7280] shrink-0">직접 입력</span>
        <input
          type="color"
          defaultValue="#000000"
          className="flex-1 h-6 rounded cursor-pointer border border-[#E5E7EB] bg-transparent"
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => onSelect(e.target.value)}
        />
      </div>
    </div>
  );
}
