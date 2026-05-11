'use client';

import { ReportReason } from '@/lib/types';
import Modal from '@/components/ui/Modal';

const REASONS: ReportReason[] = [
  '스팸/광고', '욕설/혐오', '음란물', '개인정보 침해', '저작권 침해', '기타',
];

interface Props {
  open: boolean;
  done: boolean;
  reason: ReportReason | '';
  detail: string;
  submitting: boolean;
  setReason: (r: ReportReason | '') => void;
  setDetail: (v: string) => void;
  submit: () => void;
  reset: () => void;
}

export default function ReportModal({
  open, done, reason, detail, submitting,
  setReason, setDetail, submit, reset,
}: Props) {
  return (
    <Modal isOpen={open} onClose={reset} title="게시글 신고" size="sm">
      {done ? (
        <div className="text-center py-4">
          <p className="text-[#111111] font-medium mb-1">신고가 접수되었습니다.</p>
          <p className="text-[13px] text-[#6B7280]">검토 후 조치하겠습니다.</p>
          <button
            onClick={reset}
            className="mt-5 w-full py-2.5 bg-[#111111] text-white text-[14px] rounded-[10px]"
          >
            확인
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-2.5 mb-4">
            {REASONS.map((r) => (
              <label key={r} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="report-reason"
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="w-4 h-4 accent-[#111111]"
                />
                <span className="text-[14px] text-[#111111]">{r}</span>
              </label>
            ))}
          </div>

          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="추가 내용 (선택)"
            rows={3}
            className="w-full text-[14px] border border-[#E5E7EB] rounded-[10px] px-3 py-2.5 resize-none focus:outline-none focus:border-[#111111] mb-4"
          />

          <div className="flex gap-2">
            <button
              onClick={reset}
              className="flex-1 py-2.5 border border-[#E5E7EB] text-[14px] text-[#6B7280] rounded-[10px] hover:bg-[#F3F4F6] transition-colors"
            >
              취소
            </button>
            <button
              onClick={submit}
              disabled={!reason || submitting}
              className="flex-1 py-2.5 bg-[#EF4444] text-white text-[14px] rounded-[10px] disabled:opacity-40 transition-opacity"
            >
              {submitting ? '신고 중…' : '신고하기'}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
