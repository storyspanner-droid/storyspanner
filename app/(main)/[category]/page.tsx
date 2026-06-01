import { notFound } from 'next/navigation';
import { Category } from '@/lib/types';
import CategoryBoard from './components/CategoryBoard';
import CategoryBanner from './components/CategoryBanner';
import { SLUG_TO_LABEL } from '@/lib/constants/categories';

interface Props {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const category = SLUG_TO_LABEL[decodedSlug] as Category | undefined;

  if (!category) notFound();

  return (
    <>
      <CategoryBanner category={category} />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <CategoryBoard category={category} />
      </div>
    </>
  );
}
