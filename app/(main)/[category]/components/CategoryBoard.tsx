'use client';

import { Category } from '@/lib/types';
import { useCategoryPosts } from '../hooks/useCategoryPosts';
import { useScrollRestore } from '../../hooks/useScrollRestore';
import CategoryHeader from './CategoryHeader';
import CategoryHotPosts from './CategoryHotPosts';
import CategoryPostList from './CategoryPostList';
import Pagination from './Pagination';
import { ListSkeleton } from '@/components/ui/Loading';

interface Props {
  category: Category;
}

export default function CategoryBoard({ category }: Props) {
  useScrollRestore();
  const {
    posts,
    loading,
    page,
    setPage,
    sort,
    setSort,
    totalPages,
    totalCount,
    search,
    setSearch,
    handleSearchSubmit,
  } = useCategoryPosts(category);

  return (
    <>
      <CategoryHotPosts category={category} />
      <section className="bg-white rounded-[16px] border border-[#E5E7EB] px-5 py-4">
      <CategoryHeader
        category={category}
        totalCount={totalCount}
        sort={sort}
        onSortChange={setSort}
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
      />
      {loading ? (
        <ListSkeleton count={10} />
      ) : (
        <>
          <CategoryPostList posts={posts} category={category} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
      </section>
    </>
  );
}
