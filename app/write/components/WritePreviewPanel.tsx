'use client';

import { useEffect } from 'react';

export interface PreviewData {
  title: string;
  category: string;
  content: string;
  thumbnailUrl: string;
  nickname: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: PreviewData;
}

function PreviewBody({ data }: { data: PreviewData }) {
  return (
    <div className="p-5">
      {data.thumbnailUrl && (
        <img src={data.thumbnailUrl} alt="thumbnail" className="w-full rounded-[8px] mb-4 aspect-video object-cover" />
      )}
      {data.category && (
        <span className="inline-block px-2.5 py-1 bg-[#F3EEFF] text-[#6C3FC5] text-[11px] font-medium rounded-full mb-3">{data.category}</span>
      )}
      <h1 className="text-[20px] font-bold text-[#111111] leading-[1.4] mb-4">{data.title || '(제목 없음)'}</h1>
      <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF] mb-5 pb-4 border-b border-[#F3F4F6]">
        <span>{data.nickname || '작성자'}</span>
        <span>·</span>
        <span>{new Date().toLocaleDateString('ko-KR')}</span>
      </div>
      <div
        className="text-[15px] text-[#111111] leading-[1.8] editor-preview"
        style={{ maxWidth: '100%', overflowX: 'hidden' }}
        dangerouslySetInnerHTML={{ __html: data.content || '<p style="color:#9CA3AF">내용을 입력하면 여기에 표시됩니다.</p>' }}
      />
    </div>
  );
}

export default function WritePreviewPanel({ isOpen, onClose, data }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <div
      className="fixed top-0 right-0 h-full w-[420px] bg-white z-50 flex flex-col transition-transform duration-300"
      style={{
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        borderLeft: '0.5px solid #E5E7EB',
        boxShadow: isOpen ? '-4px 0 24px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] shrink-0">
        <span className="text-[14px] font-bold text-[#111111]">미리보기</span>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#111111] rounded-full hover:bg-[#F3F4F6] transition-colors text-[18px]"
        >✕</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <PreviewBody data={data} />
      </div>
    </div>
  );
}
