import Link from 'next/link';
import { Timestamp } from 'firebase/firestore';
import { Post, Category } from '@/lib/types';

// 피그마 아바타 색상 순환
const AVATAR_COLORS = ['#6C3FC5', '#7C3AED', '#8B5CF6', '#6D28D9', '#5B21B6'];

const CAT_EMOJI: Record<Category, string> = {
  '게임':       '🎮',
  '의료정보':   '🏥',
  '인테리어DIY': '🏠',
  '비즈니스':   '💼',
  '코인/투자':  '💰',
  '마케팅':     '📣',
  '공지사항':   '📢',
};

function timeAgo(ts: Timestamp): string {
  const diff = Date.now() - ts.toMillis();
  if (diff < 60_000)    return '방금 전';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}분 전`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}시간 전`;
  const d = new Date(ts.toMillis());
  const yy = String(d.getFullYear() % 100).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}년 ${mm}월 ${dd}일`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function avatarColor(nickname: string): string {
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) hash += nickname.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

interface Props {
  post: Post;
}

export default function CategoryPostCard({ post }: Props) {
  const isHot = post.likeCount > 10 || post.views > 200;
  const isNew = Date.now() - post.createdAt.toMillis() < 86_400_000;
  const preview = stripHtml(post.content);

  return (
    <Link
      href={`/posts/${post.id}`}
      className="flex items-start gap-3.5 p-4 bg-white border border-[#E5E7EB] rounded-[12px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#D1D5DB] group"
    >
      {/* 아바타 */}
      <div
        className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white text-[14px] font-bold shrink-0 mt-0.5"
        style={{ backgroundColor: avatarColor(post.nickname) }}
      >
        {post.nickname[0]}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* 메타 상단 행: 작성자 + 조회수 + 뱃지 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] font-bold text-[#111111]">{post.nickname}</span>
          <span className="text-[11px] text-[#9CA3AF]">조회 {post.views.toLocaleString()}</span>
          {isHot && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#DC2626] leading-none">
              HOT
            </span>
          )}
          {isNew && !isHot && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#D1FAE5] text-[#065F46] leading-none">
              NEW
            </span>
          )}
        </div>

        {/* 제목 */}
        <p className="text-[14px] font-bold text-[#111111] truncate group-hover:text-[#6C3FC5] transition-colors">
          {post.title}
        </p>

        {/* 본문 미리보기 — HTML 태그 제거, 4줄 */}
        {preview && (
          <p className="text-[12px] text-[#4B5563] leading-[1.6] line-clamp-4 break-all">
            {preview}
          </p>
        )}

        {/* 하단 메타: 좋아요 + 댓글 + 날짜 */}
        <div className="flex items-center gap-3 pt-1 flex-wrap">
          <span className="text-[11px] text-[#9CA3AF]">❤️ {post.likeCount.toLocaleString()}</span>
          <span className="text-[11px] text-[#9CA3AF]">💬 {post.commentCount.toLocaleString()}</span>
          <span className="text-[11px] text-[#9CA3AF]">📅 {timeAgo(post.createdAt)}</span>
        </div>
      </div>

      {/* 썸네일 (우측 80×80) */}
      <div className="w-[80px] h-[80px] rounded-[8px] bg-[#F3F4F6] flex items-center justify-center shrink-0 overflow-hidden">
        {post.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[22px] select-none">{CAT_EMOJI[post.category] ?? '📄'}</span>
        )}
      </div>
    </Link>
  );
}
