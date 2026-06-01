'use client';

import { useState, useEffect, useMemo } from 'react';
import { getPostsByCategory } from '@/lib/services/postService';
import { Post, Category } from '@/lib/types';

export type SortType = '최신순' | '인기순' | '조회수순' | '댓글많은순';

const PAGE_SIZE = 10;

export function useCategoryPosts(category: Category) {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortType>('최신순');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    getPostsByCategory(category, 200)
      .then((posts) => setAllPosts(posts.filter((p) => p.status === 'approved')))
      .catch(() => setAllPosts([]))
      .finally(() => setLoading(false));
  }, [category]);

  useEffect(() => {
    setPage(1);
  }, [sort, appliedSearch]);

  const handleSearchSubmit = () => {
    setAppliedSearch(search.trim());
  };

  const filteredPosts = useMemo(() => {
    if (!appliedSearch) return allPosts;
    const q = appliedSearch.toLowerCase();
    return allPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q),
    );
  }, [allPosts, appliedSearch]);

  const sortedPosts = useMemo(() => {
    switch (sort) {
      case '인기순':
        return [...filteredPosts].sort((a, b) => b.likeCount - a.likeCount);
      case '조회수순':
        return [...filteredPosts].sort((a, b) => b.views - a.views);
      case '댓글많은순':
        return [...filteredPosts].sort((a, b) => b.commentCount - a.commentCount);
      default:
        return filteredPosts;
    }
  }, [filteredPosts, sort]);

  const totalCount = sortedPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const posts = sortedPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return {
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
  };
}
