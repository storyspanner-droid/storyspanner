'use client';

import { useState, useEffect } from 'react';
import { getPopularPosts } from '@/lib/services/scoreService';
import { Post } from '@/lib/types';

export function useHotPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPopularPosts(10)
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return { posts, loading };
}
