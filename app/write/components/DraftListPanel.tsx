'use client';

import { WriteDraft } from '../hooks/useAutoSave';

interface Props {
  isOpen: boolean;
  drafts: WriteDraft[];
  onClose: () => void;
  onRestore: (draft: WriteDraft) => void;
  onDelete: (key: string) => void;
  hasContent: boolean;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
}

export default function DraftListPanel({ isOpen, drafts, onClose, onRestore, onDelete, hasContent }: Props) {
  if (!isOpen) return null;

  const handleRestore = (draft: WriteDraft) => {
    if (hasContent && !window.confirm('현재 작성 중인 내용이 있습니다. 불러오면 현재 내용이 사라집니다. 계속할까요?')) return;
    onRestore(draft);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[380px] bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] shrink-0">
          <span className="text-[14px] font-bold text-[#111111]">임시저장 목록</span>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111111] text-[18px] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] transition-colors">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {drafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2">
              <span className="text-[32px]">📭</span>
              <p className="text-[13px] text-[#9CA3AF]">저장된 임시글이 없어요</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {drafts.map((draft) => (
                <div key={draft.key} className="border border-[#E5E7EB] rounded-[10px] p-3.5 bg-white hover:border-[#6C3FC5] transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-[13px] font-medium text-[#111111] truncate flex-1">{draft.title || '(제목 없음)'}</p>
                    {draft.category && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#F3EEFF] text-[#6C3FC5] rounded-full shrink-0">{draft.category}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] mb-2">{fmtDate(draft.savedAt)} · {draft.charCount ?? 0}자</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleRestore(draft)}
                      className="flex-1 py-1.5 text-[12px] font-medium bg-[#6C3FC5] text-white rounded-[6px] hover:bg-[#5a33a8] transition-colors">
                      불러오기
                    </button>
                    <button onClick={() => onDelete(draft.key)}
                      className="px-3 py-1.5 text-[12px] text-[#9CA3AF] border border-[#E5E7EB] rounded-[6px] hover:text-[#EF4444] hover:border-[#EF4444] transition-colors">
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
