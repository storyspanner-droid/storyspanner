import { Post } from '@/lib/types';
import CategoryPostCard from './CategoryPostCard';
import AdBanner from '../../components/AdBanner';

interface Props {
  posts: Post[];
}

export default function CategoryPostList({ posts }: Props) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[#6B7280] text-sm">아직 게시글이 없습니다.</p>
        <p className="text-[#9CA3AF] text-xs mt-1">첫 번째 글을 작성해보세요!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {posts.map((post, i) => (
        <div key={post.id}>
          <CategoryPostCard post={post} />
          {(i + 1) % 3 === 0 && i !== posts.length - 1 && (
            <div className="mt-2.5">
              <AdBanner />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
