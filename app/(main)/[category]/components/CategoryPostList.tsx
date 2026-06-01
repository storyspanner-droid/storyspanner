import { Post, Category } from '@/lib/types';
import CategoryPostCard from './CategoryPostCard';
import CategoryAdBanner from './CategoryAdBanner';

const AD_SLOTS: Record<number, 1 | 2 | 3> = { 2: 1, 5: 2, 8: 3 };

interface Props {
  posts: Post[];
  category: Category;
}

export default function CategoryPostList({ posts, category }: Props) {
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
          {AD_SLOTS[i] && (
            <div className="mt-2.5">
              <CategoryAdBanner category={category} slot={AD_SLOTS[i]} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
