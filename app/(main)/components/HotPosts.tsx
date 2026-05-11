'use client';

import Link from 'next/link';
import { useHotPosts } from '../hooks/useHotPosts';
import { CategoryBadge } from '@/components/ui/Badge';
import { SkeletonBox } from '@/components/ui/Loading';

const RANK_COLOR: Record<number, string> = {
  0: 'text-[#EF4444] font-bold',
  1: 'text-[#F97316] font-bold',
  2: 'text-[#EAB308] font-bold',
};

export default function HotPosts() {
  const { posts, loading } = useHotPosts();

  return (
    <section className="bg-white rounded-[16px] border border-[#E5E7EB] p-5 mb-5">
      <h2 className="text-[15px] font-bold text-[#111111] mb-4 flex items-center gap-1.5">
        🔥 오늘의 인기글
      </h2>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonBox className="w-5 h-4" />
              <SkeletonBox className="h-4 flex-1" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-sm text-[#6B7280] text-center py-6">오늘 등록된 인기글이 없습니다.</p>
      ) : (
        <ol className="space-y-0 divide-y divide-[#F3F4F6]">
          {posts.map((post, i) => (
            <li key={post.id} className="py-2.5 first:pt-0 last:pb-0">
              <Link
                href={`/posts/${post.id}`}
                className="flex items-center gap-3 group"
              >
                <span className={`w-5 text-center text-[13px] shrink-0 ${RANK_COLOR[i] ?? 'text-[#6B7280]'}`}>
                  {i + 1}
                </span>
                <CategoryBadge category={post.category} />
                <span className="flex-1 text-[13px] text-[#111111] truncate group-hover:text-gray-600 transition-colors">
                  {post.title}
                </span>
                <span className="text-[11px] text-[#9CA3AF] shrink-0">
                  조회 {post.views.toLocaleString()}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
