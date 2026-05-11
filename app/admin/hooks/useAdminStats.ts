'use client';

import { useState, useEffect } from 'react';
import { getAdminStats, AdminStats } from '@/lib/services/adminService';

const EMPTY: AdminStats = {
  totalPosts: 0,
  totalUsers: 0,
  totalComments: 0,
  postsToday: 0,
  usersToday: 0,
  pendingReports: 0,
};

export function useAdminStats(active: boolean) {
  const [stats, setStats] = useState<AdminStats>(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!active) return;
    setLoading(true);
    getAdminStats()
      .then(setStats)
      .catch(() => setStats(EMPTY))
      .finally(() => setLoading(false));
  }, [active]);

  return { stats, loading };
}
