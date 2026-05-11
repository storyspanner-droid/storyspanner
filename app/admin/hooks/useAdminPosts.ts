'use client';

import { useState, useEffect, useCallback } from 'react';
import { Post, Category, PostStatus } from '@/lib/types';
import { getAdminPosts, updateAdminPost, deleteAdminPost } from '@/lib/services/adminService';

export interface PostEditData {
  title: string;
  category: Category;
  status: PostStatus;
}

export function useAdminPosts(active: boolean, selectedCategory?: Category) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<Post | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminPosts(selectedCategory);
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (!active) return;
    fetchPosts();
  }, [active, fetchPosts]);

  const handleUpdate = async (id: string, data: Partial<Pick<Post, 'title' | 'category' | 'status'>>) => {
    await updateAdminPost(id, data);
    setEditTarget(null);
    await fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까? 되돌릴 수 없습니다.')) return;
    await deleteAdminPost(id);
    await fetchPosts();
  };

  return { posts, loading, editTarget, setEditTarget, handleUpdate, handleDelete };
}
