'use client';

import { useState, useEffect } from 'react';
import { getHotPosts } from '@/lib/services/postService';
import { Post } from '@/lib/types';

export function useHotPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHotPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return { posts, loading };
}
