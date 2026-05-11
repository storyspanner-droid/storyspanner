'use client';

import { useState, useEffect } from 'react';
import { getLikeStatus, addLike, removeLike } from '@/lib/services/likeService';
import { useAuth } from '@/lib/hooks/useAuth';

export function useLike(postId: string, initialCount: number) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeDocId, setLikeDocId] = useState<string | null>(null);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!user) return;
    getLikeStatus(postId, user.id).then(({ liked: l, likeDocId: id }) => {
      setLiked(l);
      setLikeDocId(id);
    });
  }, [postId, user]);

  async function toggleLike() {
    if (!user || pending) return;
    setPending(true);
    try {
      if (liked) {
        if (likeDocId) await removeLike(likeDocId, postId);
        setLiked(false);
        setLikeDocId(null);
        setCount((c) => c - 1);
      } else {
        const id = await addLike(postId, user.id);
        setLiked(true);
        setLikeDocId(id);
        setCount((c) => c + 1);
      }
    } finally {
      setPending(false);
    }
  }

  return { liked, count, pending, toggleLike };
}
