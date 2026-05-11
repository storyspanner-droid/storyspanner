'use client';

import { useState, useEffect, useCallback } from 'react';
import { getComments, addComment, deleteComment } from '@/lib/services/commentService';
import { Comment } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';

export function useComments(postId: string) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    const data = await getComments(postId).catch(() => []);
    setComments(data);
  }, [postId]);

  useEffect(() => {
    setLoading(true);
    fetchComments().finally(() => setLoading(false));
  }, [fetchComments]);

  async function submitComment(content: string, parentId?: string) {
    if (!user || !content.trim()) return;
    setSubmitting(true);
    try {
      await addComment(postId, user.id, user.nickname, content.trim(), parentId);
      await fetchComments();
      setReplyTo(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function removeComment(commentId: string) {
    await deleteComment(commentId, postId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }

  return { comments, loading, submitting, replyTo, setReplyTo, submitComment, removeComment };
}
