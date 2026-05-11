'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AgreementModal({ isOpen, onClose, onConfirm }: Props) {
  const [agreedRules, setAgreedRules] = useState(false);
  const [agreedCopyright, setAgreedCopyright] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAgreedRules(false);
      setAgreedCopyright(false);
    }
  }, [isOpen]);

  const canSubmit = agreedRules && agreedCopyright;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="게시글 제출 전 확인해주세요"
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] border border-[#E5E7EB] rounded-[8px] text-[#6B7280] hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={!canSubmit}
            className="px-4 py-2 text-[13px] bg-[#6C3FC5] text-white rounded-[8px] hover:bg-[#5a33a8] disabled:opacity-50 transition-colors"
          >
            제출하기
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreedRules}
            onChange={(e) => setAgreedRules(e.target.checked)}
            className="w-4 h-4 accent-[#6C3FC5] mt-0.5 shrink-0"
          />
          <span className="text-[13px] text-[#4B5563] leading-relaxed">
            커뮤니티 규칙을 읽고 동의합니다. <span className="text-[#EF4444]">(필수)</span>
          </span>
        </label>
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreedCopyright}
            onChange={(e) => setAgreedCopyright(e.target.checked)}
            className="w-4 h-4 accent-[#6C3FC5] mt-0.5 shrink-0"
          />
          <span className="text-[13px] text-[#4B5563] leading-relaxed">
            이미지 및 내용의 저작권을 확인했습니다.
          </span>
        </label>
        {!canSubmit && (agreedRules || agreedCopyright) && (
          <p className="text-[12px] text-[#9CA3AF]">두 항목 모두 동의해야 제출할 수 있습니다.</p>
        )}
      </div>
    </Modal>
  );
}
