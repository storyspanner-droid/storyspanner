'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (text: string, url: string) => void;
  selectedText?: string;
}

export default function LinkModal({ isOpen, onClose, onInsert, selectedText = '' }: Props) {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => { if (isOpen) setText(selectedText); }, [isOpen, selectedText]);

  const handleInsert = () => {
    if (!url) return;
    onInsert(text || url, url);
    setText('');
    setUrl('');
    onClose();
  };

  const handleClose = () => { setText(''); setUrl(''); onClose(); };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="링크 삽입" size="md"
      footer={
        <>
          <button onClick={handleClose} className="px-4 py-2 text-[13px] border border-[#E5E7EB] rounded-[8px] text-[#6B7280] hover:bg-gray-50 transition-colors">취소</button>
          <button onClick={handleInsert} disabled={!url} className="px-4 py-2 text-[13px] bg-[#6C3FC5] text-white rounded-[8px] hover:bg-[#5a33a8] disabled:opacity-40 transition-colors">삽입하기</button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-[12px] font-medium text-[#6B7280] mb-1.5">링크 텍스트</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="표시할 텍스트"
            className="w-full h-9 px-3 border border-[#E5E7EB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#6C3FC5]"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-[#6B7280] mb-1.5">URL *</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleInsert(); }}
            placeholder="https://example.com"
            className="w-full h-9 px-3 border border-[#E5E7EB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#6C3FC5]"
          />
        </div>
      </div>
    </Modal>
  );
}
