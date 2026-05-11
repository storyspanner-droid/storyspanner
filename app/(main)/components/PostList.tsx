'use client';

import { useLatestPosts } from '../hooks/useLatestPosts';
import PostCard from './PostCard';
import AdBanner from './AdBanner';
import { ListSkeleton } from '@/components/ui/Loading';

export default function PostList() {
  const { posts, loading } = useLatestPosts();

  return (
    <section className="bg-white rounded-[16px] border border-[#E5E7EB] px-5 py-4">
      <h2 className="text-[15px] font-bold text-[#111111] mb-3 pb-3 border-b border-[#E5E7EB]">
        최신 게시글
      </h2>

      {loading ? (
        <ListSkeleton count={6} />
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#6B7280] text-sm">아직 게시글이 없습니다.</p>
          <p className="text-[#9CA3AF] text-xs mt-1">첫 번째 글을 작성해보세요!</p>
        </div>
      ) : (
        <div className="divide-y divide-[#F3F4F6]">
          {posts.map((post, i) => (
            <div key={post.id}>
              <PostCard post={post} />
              {(i + 1) % 3 === 0 && i !== posts.length - 1 && (
                <AdBanner />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
