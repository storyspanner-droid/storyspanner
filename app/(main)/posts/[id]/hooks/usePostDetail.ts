'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPostById, deletePost } from '@/lib/services/postService';
import { recordView } from '@/lib/services/scoreService';
import { Post } from '@/lib/types';

export function usePostDetail(postId: string, uid: string | null = null) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPostById(postId)
      .then((p) => {
        if (!p) { setNotFound(true); return; }
        setPost(p);
        recordView(postId, uid).catch(() => {});
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [postId, uid]);

  const handleDelete = async () => {
    if (!post) return;
    if (!window.confirm('정말 삭제하시겠습니까? 되돌릴 수 없습니다.')) return;
    try {
      await deletePost(post.id);
      router.push('/');
    } catch {
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return { post, loading, notFound, handleDelete };
}
