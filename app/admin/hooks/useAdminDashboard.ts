'use client';

import { useState, useEffect } from 'react';
import { getAdminDashboardStats, AdminDashboardStats } from '@/lib/services/adminService';

const EMPTY: AdminDashboardStats = {
  totalUsers: 0, usersToday: 0, totalPosts: 0, postsToday: 0,
  pendingPosts: 0, pendingReports: 0, suspendedUsers: 0,
  adminUsers: 0, likesToday: 0, totalViews: 0, totalLikes: 0,
  recentPosts: [],
};

export function useAdminDashboard(active: boolean) {
  const [stats, setStats] = useState<AdminDashboardStats>(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!active) return;
    setLoading(true);
    getAdminDashboardStats()
      .then(setStats)
      .catch(() => setStats(EMPTY))
      .finally(() => setLoading(false));
  }, [active]);

  return { stats, loading };
}
