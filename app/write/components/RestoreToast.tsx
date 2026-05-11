'use client';

interface Props {
  onRestore: () => void;
  onDismiss: () => void;
  savedAt?: string;
}

export default function RestoreToast({ onRestore, onDismiss, savedAt }: Props) {
  const timeStr = savedAt
    ? new Date(savedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-white rounded-[12px] px-5 py-3 flex items-center gap-4 shadow-xl">
      <div>
        <p className="text-[13px] font-medium">이전에 작성 중인 글이 있어요</p>
        {timeStr && <p className="text-[11px] text-[#9CA3AF] mt-0.5">{timeStr}에 자동저장됨</p>}
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={onRestore}
          className="px-3 py-1.5 bg-[#6C3FC5] text-white text-[12px] font-medium rounded-[8px] hover:bg-[#5a33a8] transition-colors"
        >
          불러오기
        </button>
        <button
          onClick={onDismiss}
          className="px-3 py-1.5 bg-white/20 text-white text-[12px] font-medium rounded-[8px] hover:bg-white/30 transition-colors"
        >
          무시
        </button>
      </div>
    </div>
  );
}
