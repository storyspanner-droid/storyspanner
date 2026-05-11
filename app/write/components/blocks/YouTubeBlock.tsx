'use client';

import { YouTubeEditorBlock } from '../../types';

interface Props {
  block: YouTubeEditorBlock;
  onRemove: (id: string) => void;
}

export default function YouTubeBlock({ block, onRemove }: Props) {
  if (!block.videoId) {
    return (
      <div className="bg-[#F3F4F6] rounded-[8px] p-6 text-center">
        <p className="text-[13px] text-[#9CA3AF]">🎬 YouTube URL이 설정되지 않았습니다.</p>
        <button type="button" onClick={() => onRemove(block.id)} className="mt-2 text-[11px] text-[#9CA3AF] hover:text-[#EF4444] transition-colors">블록 삭제</button>
      </div>
    );
  }

  return (
    <div className="relative group rounded-[8px] overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${block.videoId}`}
        style={{ width: '100%', height: 400, border: 'none', borderRadius: 8, display: 'block' }}
        allowFullScreen
        title="YouTube video"
      />
      <button
        type="button"
        onClick={() => onRemove(block.id)}
        className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white text-[12px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
      >✕</button>
    </div>
  );
}
