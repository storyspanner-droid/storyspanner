'use client';

import { useRef, useEffect } from 'react';

interface Props {
  postUrl: string;
  copied: boolean;
  kakaoReady: boolean;
  onCopy: () => void;
  onKakao: () => void;
  onClose: () => void;
}

export default function SharePopup({
  postUrl, copied, kakaoReady, onCopy, onKakao, onClose,
}: Props) {
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
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 bg-white border border-[#E5E7EB] rounded-[14px] shadow-xl p-4 w-[280px]"
    >
      {/* 화살표 */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-[#E5E7EB] rotate-45" />

      <p className="text-[13px] font-bold text-[#111111] mb-3">공유하기</p>

      {/* URL 복사 */}
      <div className="flex items-center gap-2 mb-3">
        <input
          readOnly
          value={postUrl}
          className="flex-1 min-w-0 text-[11px] text-[#6B7280] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[7px] px-2.5 py-1.5 truncate"
        />
        <button
          onClick={onCopy}
          className={`shrink-0 px-3 py-1.5 rounded-[7px] text-[12px] font-bold transition-colors ${
            copied
              ? 'bg-[#16A34A] text-white'
              : 'bg-[#111111] text-white hover:bg-[#333]'
          }`}
        >
          {copied ? '✓ 복사됨' : '복사'}
        </button>
      </div>

      {/* 토스트 메시지 */}
      {copied && (
        <p className="text-[12px] text-[#16A34A] text-center mb-2 animate-pulse">
          링크가 복사되었습니다!
        </p>
      )}

      {/* 카카오 공유 */}
      <button
        onClick={onKakao}
        disabled={!kakaoReady}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#FEE500] hover:bg-[#fad900] disabled:opacity-50 text-[#111111] text-[13px] font-bold rounded-[8px] transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 1C4.582 1 1 3.814 1 7.25c0 2.19 1.456 4.116 3.653 5.23l-.931 3.456a.25.25 0 00.373.275L8.22 13.8A9.9 9.9 0 009 13.5c4.418 0 8-2.813 8-6.25S13.418 1 9 1z"
            fill="#111111"
          />
        </svg>
        카카오톡 공유
      </button>
    </div>
  );
}
