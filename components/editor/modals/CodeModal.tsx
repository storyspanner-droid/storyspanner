'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS', 'SQL', '기타'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (code: string, language: string) => void;
}

export default function CodeModal({ isOpen, onClose, onInsert }: Props) {
  const [lang, setLang] = useState('JavaScript');
  const [code, setCode] = useState('');

  const lines = code.split('\n');

  const handleInsert = () => {
    if (!code.trim()) return;
    onInsert(code, lang);
    setCode('');
    setLang('JavaScript');
    onClose();
  };

  const handleClose = () => { setCode(''); onClose(); };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="코드 블록 삽입" size="lg"
      footer={
        <>
          <button onClick={handleClose} className="px-4 py-2 text-[13px] border border-[#E5E7EB] rounded-[8px] text-[#6B7280] hover:bg-gray-50 transition-colors">취소</button>
          <button onClick={handleInsert} disabled={!code.trim()} className="px-4 py-2 text-[13px] bg-[#6C3FC5] text-white rounded-[8px] hover:bg-[#5a33a8] disabled:opacity-40 transition-colors">삽입하기</button>
        </>
      }
    >
      <div className="flex flex-col gap-3" style={{ width: 600, maxWidth: '100%' }}>
        <div className="flex gap-2 flex-wrap">
          {LANGUAGES.map((l) => (
            <button key={l} type="button" onClick={() => setLang(l)}
              className={`px-3 py-1 text-[12px] rounded-full border transition-colors ${lang === l ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]' : 'text-[#6B7280] border-[#D1D5DB] hover:border-[#6C3FC5]'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex border border-[#E5E7EB] rounded-[8px] overflow-hidden" style={{ minHeight: 200 }}>
          <div className="bg-[#F3F4F6] border-r border-[#E5E7EB] py-3 px-2 text-right select-none" style={{ minWidth: 40 }}>
            {lines.map((_, i) => (
              <div key={i} className="text-[12px] text-[#9CA3AF] leading-[1.6]" style={{ fontFamily: 'monospace' }}>{i + 1}</div>
            ))}
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`${lang} 코드를 입력하세요...`}
            autoFocus
            className="flex-1 p-3 text-[13px] text-[#111111] bg-white focus:outline-none resize-none leading-[1.6]"
            style={{ fontFamily: 'monospace', minHeight: 200 }}
          />
        </div>
        <p className="text-[11px] text-[#9CA3AF]">{lang} · {lines.length}줄</p>
      </div>
    </Modal>
  );
}
