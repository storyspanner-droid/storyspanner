'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';
import { Post } from '@/lib/types';
import { CategoryBadge } from '@/components/ui/Badge';
import { saveScrollY } from '../hooks/useScrollRestore';

function formatDate(ts: Timestamp | null): string {
  if (!ts) return '';
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

export default function PostCard({ post }: { post: Post }) {
  const router = useRouter();
  const tags = post.hashtags?.slice(0, 3) ?? [];

  function handleCardClick() {
    saveScrollY();
    router.push(`/posts/${post.id}`);
  }

  return (
    <div
      className="flex items-start gap-3 py-3.5 px-3 -mx-3 rounded-[10px] hover:bg-white transition-colors group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="shrink-0 pt-0.5">
        <CategoryBadge category={post.category} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-[#111111] truncate group-hover:text-gray-700 leading-snug">
          {post.title}
        </p>
        <div className="flex items-center gap-2.5 mt-1 text-[12px] text-[#6B7280]">
          <span>{post.nickname}</span>
          <span className="text-[#E5E7EB]">·</span>
          <span>{formatDate(post.createdAt)}</span>
          <span className="text-[#E5E7EB]">·</span>
          <span>조회 {post.views.toLocaleString()}</span>
          {post.commentCount > 0 && (
            <>
              <span className="text-[#E5E7EB]">·</span>
              <span>💬 {post.commentCount}</span>
            </>
          )}
          {post.likeCount > 0 && (
            <>
              <span className="text-[#E5E7EB]">·</span>
              <span>♥ {post.likeCount}</span>
            </>
          )}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?tag=${encodeURIComponent(tag)}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[11px] text-[#6C3FC5] bg-[#F3EEFF] px-2 py-0.5 rounded-full cursor-pointer hover:bg-[#E8D9FF] transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {post.thumbnailUrl && (
        <div className="w-[56px] h-[56px] rounded-[8px] overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
