'use client';

import Link from 'next/link';
import { useWeeklyPosts } from '../hooks/useWeeklyPosts';
import { CategoryBadge } from '@/components/ui/Badge';
import { SkeletonBox } from '@/components/ui/Loading';

const RANK_COLOR: Record<number, string> = {
  0: 'text-[#EF4444] font-bold',
  1: 'text-[#F97316] font-bold',
  2: 'text-[#EAB308] font-bold',
};

export default function WeeklySidebar() {
  const { posts, loading } = useWeeklyPosts();

  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-5 sticky top-[97px]">
      <h2 className="text-[14px] font-bold text-[#111111] mb-4 flex items-center gap-1.5">
        📈 주간 인기글
      </h2>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <SkeletonBox className="w-4 h-3.5" />
              <SkeletonBox className="h-3.5 flex-1" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-xs text-[#6B7280] text-center py-4">이번 주 인기글이 없습니다.</p>
      ) : (
        <ol className="space-y-0 divide-y divide-[#F3F4F6]">
          {posts.map((post, i) => (
            <li key={post.id} className="py-2.5 first:pt-0 last:pb-0">
              <Link href={`/posts/${post.id}`} className="flex items-start gap-2.5 group">
                <span className={`w-4 text-center text-[12px] shrink-0 mt-0.5 ${RANK_COLOR[i] ?? 'text-[#9CA3AF]'}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#111111] leading-snug truncate group-hover:text-gray-600 transition-colors">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <CategoryBadge category={post.category} />
                    <span className="text-[10px] text-[#9CA3AF]">
                      조회 {post.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
