'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchPosts, searchPostsByTag } from '@/lib/services/postService';
import { Post, Category } from '@/lib/types';

const SORT_OPTIONS = ['관련도순', '최신순', '인기순'] as const;
type SortType = (typeof SORT_OPTIONS)[number];

export function useSearchPosts() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') ?? '';
  const tagParam = searchParams.get('tag') ?? '';
  const isTagSearch = !!tagParam && !keyword;

  const [allResults, setAllResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<Category | '전체'>('전체');
  const [sort, setSort] = useState<SortType>('관련도순');

  useEffect(() => {
    setCategoryFilter('전체');

    if (isTagSearch) {
      setLoading(true);
      searchPostsByTag(tagParam)
        .then(setAllResults)
        .catch(() => setAllResults([]))
        .finally(() => setLoading(false));
    } else if (keyword.trim()) {
      setLoading(true);
      searchPosts(keyword)
        .then(setAllResults)
        .catch(() => setAllResults([]))
        .finally(() => setLoading(false));
    } else {
      setAllResults([]);
    }
  }, [keyword, tagParam, isTagSearch]);

  const filtered = useMemo(() => {
    let posts = categoryFilter === '전체' ? allResults : allResults.filter((p) => p.category === categoryFilter);
    if (sort === '최신순') posts = [...posts].sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
    if (sort === '인기순') posts = [...posts].sort((a, b) => (b.views + b.likeCount) - (a.views + a.likeCount));
    return posts;
  }, [allResults, categoryFilter, sort]);

  const categoryGroups = useMemo(() => {
    const map = new Map<string, number>();
    allResults.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
    return map;
  }, [allResults]);

  return {
    keyword,
    tagParam,
    isTagSearch,
    loading,
    filtered,
    categoryFilter,
    setCategoryFilter,
    sort,
    setSort,
    SORT_OPTIONS,
    categoryGroups,
    totalCount: allResults.length,
  };
}
