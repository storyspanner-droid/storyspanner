'use client';

import { useState, useEffect } from 'react';
import { getPostsByUserId } from '@/lib/services/postService';
import { Post } from '@/lib/types';

export interface DayPostStat {
  date: string;
  posts: number;
  views: number;
}

function aggregateLast30Days(posts: Post[]): DayPostStat[] {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 29);
  start.setHours(0, 0, 0, 0);

  const postCounts: Record<string, number> = {};
  const viewCounts: Record<string, number> = {};

  posts.forEach((p) => {
    if (!p.createdAt) return;
    const d = new Date(p.createdAt.toMillis());
    if (d < start) return;
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    postCounts[key] = (postCounts[key] ?? 0) + 1;
    viewCounts[key] = (viewCounts[key] ?? 0) + (p.views ?? 0);
  });

  const result: DayPostStat[] = [];
  const current = new Date(start);
  while (current <= now) {
    const key = `${current.getMonth() + 1}/${current.getDate()}`;
    result.push({ date: key, posts: postCounts[key] ?? 0, views: viewCounts[key] ?? 0 });
    current.setDate(current.getDate() + 1);
  }
  return result;
}

export function useMyCharts(userId: string | undefined) {
  const [data, setData] = useState<DayPostStat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getPostsByUserId(userId, 200)
      .then((posts) => setData(aggregateLast30Days(posts)))
      .finally(() => setLoading(false));
  }, [userId]);

  return { data, loading };
}
