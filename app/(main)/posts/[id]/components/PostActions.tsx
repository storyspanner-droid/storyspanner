'use client';

import { Post } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLike } from '../hooks/useLike';
import { useReport } from '../hooks/useReport';
import { useShare } from '../hooks/useShare';
import ReportModal from './ReportModal';
import SharePopup from './SharePopup';

export default function PostActions({ post }: { post: Post }) {
  const { user } = useAuth();
  const { liked, count, pending, toggleLike } = useLike(post.id, post.likeCount);
  const report = useReport(post.id);
  const { open, setOpen, copied, copyLink, kakaoReady, shareKakao, postUrl } = useShare(post);

  return (
    <>
      {/* 리액션 바 */}
      <div className="flex items-center justify-center gap-4 mt-6">
        {/* 좋아요 */}
        <button
          onClick={toggleLike}
          disabled={pending}
          className={`flex flex-col items-center gap-1.5 px-6 py-3 rounded-[12px] border text-[12px] font-bold transition-colors disabled:opacity-50 ${
            liked
              ? 'bg-[#6C3FC5] border-[#6C3FC5] text-white'
              : 'bg-white border-[#E5E7EB] text-[#111111] hover:border-[#6C3FC5] hover:text-[#6C3FC5]'
          }`}
        >
          <span className="text-[22px]">{liked ? '❤️' : '🤍'}</span>
          <span>좋아요</span>
          {count > 0 && (
            <span className={liked ? 'text-white/80' : 'text-[#9CA3AF]'}>{count}</span>
          )}
        </button>

        {/* 공유 */}
        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex flex-col items-center gap-1.5 px-6 py-3 rounded-[12px] border border-[#E5E7EB] text-[12px] font-bold text-[#111111] hover:border-[#6C3FC5] hover:text-[#6C3FC5] transition-colors"
          >
            <span className="text-[22px]">🔗</span>
            <span>공유</span>
          </button>

          {open && (
            <SharePopup
              postUrl={postUrl}
              copied={copied}
              kakaoReady={kakaoReady}
              onCopy={copyLink}
              onKakao={shareKakao}
              onClose={() => setOpen(false)}
            />
          )}
        </div>

        {/* 신고 */}
        {user && (
          <button
            onClick={() => report.setOpen(true)}
            className="flex flex-col items-center gap-1.5 px-6 py-3 rounded-[12px] border border-[#FECACA] text-[12px] font-bold text-[#EF4444] hover:bg-red-50 transition-colors"
          >
            <span className="text-[22px]">🚨</span>
            <span>신고</span>
          </button>
        )}
      </div>

      <ReportModal
        open={report.open}
        done={report.done}
        reason={report.reason}
        detail={report.detail}
        submitting={report.submitting}
        setReason={report.setReason}
        setDetail={report.setDetail}
        submit={report.submit}
        reset={report.reset}
      />
    </>
  );
}
