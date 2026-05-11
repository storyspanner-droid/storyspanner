'use client';

import { useState, useEffect } from 'react';
import { getUserByUserId } from '@/lib/services/userService';
import { getPostsByUserId } from '@/lib/services/postService';
import { User, Post } from '@/lib/types';

export function useUserProfile(userId: string) {
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUserByUserId(userId)
      .then(async (user) => {
        if (!user) { setNotFound(true); return; }
        setProfileUser(user);
        const userPosts = await getPostsByUserId(user.id, 10).catch(() => []);
        setPosts(userPosts);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [userId]);

  return { profileUser, posts, loading, notFound };
}
