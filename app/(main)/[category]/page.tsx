import { notFound } from 'next/navigation';
import { Category } from '@/lib/types';
import CategoryBoard from './components/CategoryBoard';
import CategoryBanner from './components/CategoryBanner';

const SLUG_TO_CATEGORY: Record<string, Category> = {
  '게임': '게임',
  '의료정보': '의료정보',
  '인테리어DIY': '인테리어DIY',
  '비즈니스': '비즈니스',
  '코인투자': '코인/투자',
  '마케팅': '마케팅',
  '공지사항': '공지사항',
};

interface Props {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const category = SLUG_TO_CATEGORY[decodedSlug];

  if (!category) notFound();

  return (
    <>
      <CategoryBanner category={category} totalCount={0} />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <CategoryBoard category={category} />
      </div>
    </>
  );
}
