'use client';

import { useState, useEffect } from 'react';
import { getUserPostStats, UserPostStats } from '@/lib/services/userStatsService';

const EMPTY: UserPostStats = {
  totalPosts: 0,
  totalViews: 0,
  totalLikes: 0,
  postsThisMonth: 0,
  postsLastMonth: 0,
  likesThisMonth: 0,
};

export function useMyPageStats(userId: string | undefined) {
  const [stats, setStats] = useState<UserPostStats>(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getUserPostStats(userId)
      .then(setStats)
      .catch(() => setStats(EMPTY))
      .finally(() => setLoading(false));
  }, [userId]);

  return { stats, loading };
}
