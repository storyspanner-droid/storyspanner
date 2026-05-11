'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (videoId: string) => void;
}

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function YouTubeModal({ isOpen, onClose, onInsert }: Props) {
  const [url, setUrl] = useState('');
  const videoId = extractVideoId(url);

  const handleInsert = () => {
    if (!videoId) return;
    onInsert(videoId);
    setUrl('');
    onClose();
  };

  const handleClose = () => { setUrl(''); onClose(); };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="YouTube 삽입" size="md"
      footer={
        <>
          <button onClick={handleClose} className="px-4 py-2 text-[13px] border border-[#E5E7EB] rounded-[8px] text-[#6B7280] hover:bg-gray-50 transition-colors">취소</button>
          <button onClick={handleInsert} disabled={!videoId} className="px-4 py-2 text-[13px] bg-[#6C3FC5] text-white rounded-[8px] hover:bg-[#5a33a8] disabled:opacity-40 transition-colors">삽입하기</button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-[12px] font-medium text-[#6B7280] mb-1.5">YouTube URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full h-9 px-3 border border-[#E5E7EB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#6C3FC5]"
            autoFocus
          />
          {url && !videoId && <p className="text-[11px] text-[#EF4444] mt-1">올바른 YouTube URL을 입력해주세요.</p>}
        </div>
        {videoId && (
          <div className="rounded-[8px] overflow-hidden" style={{ paddingBottom: '56.25%', position: 'relative', height: 0 }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="absolute inset-0 w-full h-full border-0"
              title="YouTube preview"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
