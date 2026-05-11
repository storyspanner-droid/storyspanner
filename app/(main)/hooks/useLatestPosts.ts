'use client';

import { useState, useEffect } from 'react';
import { getLatestPosts } from '@/lib/services/postService';
import { Post } from '@/lib/types';

export function useLatestPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestPosts(30)
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return { posts, loading };
}
