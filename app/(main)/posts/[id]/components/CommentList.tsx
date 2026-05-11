import { Timestamp } from 'firebase/firestore';
import { Comment } from '@/lib/types';
import CommentForm from './CommentForm';

function timeAgo(ts: Timestamp): string {
  const diff = Date.now() - ts.toMillis();
  if (diff < 60_000) return '방금 전';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}분 전`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}시간 전`;
  const d = new Date(ts.toMillis());
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

function Avatar({ name, size = 36, bg = '#7C3AED' }: { name: string; size?: number; bg?: string }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.35 }}
    >
      {name[0]}
    </div>
  );
}

interface ItemProps {
  comment: Comment;
  replies: Comment[];
  replyTo: string | null;
  submitting: boolean;
  currentUserId?: string;
  onReply: (id: string | null) => void;
  onSubmit: (content: string, parentId?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function CommentItem({ comment, replies, replyTo, submitting, currentUserId, onReply, onSubmit, onDelete }: ItemProps) {
  const isReplying = replyTo === comment.id;

  return (
    <div className="py-4 first:pt-0">
      <div className="flex gap-3">
        <Avatar name={comment.nickname} size={36} bg="#7C3AED" />
        <div className="flex-1 min-w-0">
          {/* 헤더 */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-bold text-[#111111]">{comment.nickname}</span>
            <span className="text-[11px] text-[#9CA3AF]">{timeAgo(comment.createdAt)}</span>
          </div>
          {/* 내용 */}
          <p className="text-[13px] text-[#4B5563] leading-[1.7] mb-2">{comment.content}</p>
          {/* 액션 버튼 */}
          <div className="flex items-center gap-3">
            <button className="text-[11px] text-[#9CA3AF] hover:text-[#EF4444] transition-colors">❤️ 0</button>
            {currentUserId && (
              <button
                onClick={() => onReply(isReplying ? null : comment.id)}
                className="text-[11px] text-[#9CA3AF] hover:text-[#111111] transition-colors"
              >
                {isReplying ? '취소' : '답글'}
              </button>
            )}
            <button className="text-[11px] text-[#9CA3AF] hover:text-[#EF4444] transition-colors">신고</button>
            {currentUserId === comment.userId && (
              <button onClick={() => onDelete(comment.id)} className="text-[11px] text-[#9CA3AF] hover:text-[#EF4444] transition-colors">
                삭제
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 대댓글 목록 */}
      {replies.length > 0 && (
        <div className="mt-3 ml-[48px] border-l-2 border-[#E5E7EB] pl-4 flex flex-col gap-0 divide-y divide-[#F9FAFB]">
          {replies.map((r) => (
            <div key={r.id} className="py-3 first:pt-0">
              <div className="flex gap-2.5">
                <Avatar name={r.nickname} size={28} bg="#E0E7FF" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-bold text-[#111111]">{r.nickname}</span>
                    <span className="text-[11px] text-[#9CA3AF]">{timeAgo(r.createdAt)}</span>
                  </div>
                  <p className="text-[13px] text-[#4B5563] leading-[1.7] mb-1.5">{r.content}</p>
                  <div className="flex items-center gap-3">
                    <button className="text-[11px] text-[#9CA3AF] hover:text-[#EF4444] transition-colors">❤️ 0</button>
                    {currentUserId === r.userId && (
                      <button onClick={() => onDelete(r.id)} className="text-[11px] text-[#9CA3AF] hover:text-[#EF4444] transition-colors">
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 답글 입력 */}
      {isReplying && (
        <div className="mt-3 ml-[48px] border-l-2 border-[#E5E7EB] pl-4">
          <CommentForm
            placeholder="답글을 입력하세요"
            submitting={submitting}
            compact
            onSubmit={(content) => onSubmit(content, comment.id)}
          />
        </div>
      )}
    </div>
  );
}

interface Props {
  comments: Comment[];
  replyTo: string | null;
  submitting: boolean;
  currentUserId?: string;
  onReply: (id: string | null) => void;
  onSubmit: (content: string, parentId?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function CommentList({ comments, replyTo, submitting, currentUserId, onReply, onSubmit, onDelete }: Props) {
  const roots = comments.filter((c) => c.depth === 0);
  const repliesMap = comments.reduce<Record<string, Comment[]>>((acc, c) => {
    if (c.parentId) acc[c.parentId] = [...(acc[c.parentId] ?? []), c];
    return acc;
  }, {});

  if (roots.length === 0) {
    return <p className="text-[13px] text-[#9CA3AF] text-center py-6">첫 댓글을 남겨보세요.</p>;
  }

  return (
    <div className="divide-y divide-[#F3F4F6]">
      {roots.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          replies={repliesMap[c.id] ?? []}
          replyTo={replyTo}
          submitting={submitting}
          currentUserId={currentUserId}
          onReply={onReply}
          onSubmit={onSubmit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
