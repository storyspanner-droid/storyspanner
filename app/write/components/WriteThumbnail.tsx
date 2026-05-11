'use client';

import { useRef } from 'react';

interface Props {
  preview: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export default function WriteThumbnail({ preview, onUpload, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = '';
  };

  return (
    <div className="shrink-0 w-[160px]">
      <p className="text-[12px] font-medium text-[#6B7280] mb-2">썸네일 (선택)</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleChange}
        className="hidden"
      />
      {preview ? (
        <div className="relative w-full h-[100px] rounded-[10px] overflow-hidden border border-[#E5E7EB]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="썸네일 미리보기" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/50 text-white text-[10px] rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-[100px] border-2 border-dashed border-[#D1D5DB] rounded-[10px] flex flex-col items-center justify-center gap-1.5 hover:border-[#6C3FC5] hover:bg-[#F3EEFF] transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span className="text-[11px] text-[#9CA3AF]">JPG, PNG 1장</span>
        </button>
      )}
    </div>
  );
}
