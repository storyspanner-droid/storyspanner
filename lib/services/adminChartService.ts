import { collection, query, where, Timestamp, getDocs } from 'firebase/firestore';
import db from '@/lib/firebase/firestore';
import { Post } from '@/lib/types';

export interface DayPostCount {
  date: string;
  count: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

// ─── 날짜 범위 게시글 수 집계 ──────────────────────────────────────────────

export async function getPostsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<DayPostCount[]> {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  try {
    const snap = await getDocs(
      query(
        collection(db, 'posts'),
        where('createdAt', '>=', Timestamp.fromDate(start)),
        where('createdAt', '<=', Timestamp.fromDate(end))
      )
    );

    const counts: Record<string, number> = {};
    snap.docs.forEach((d) => {
      const p = d.data() as Post;
      if (!p.createdAt) return;
      const date = new Date(p.createdAt.toMillis());
      const key = `${date.getMonth() + 1}/${date.getDate()}`;
      counts[key] = (counts[key] ?? 0) + 1;
    });

    // 범위 내 모든 날짜 채우기
    const result: DayPostCount[] = [];
    const current = new Date(start);
    while (current <= end) {
      const key = `${current.getMonth() + 1}/${current.getDate()}`;
      result.push({ date: key, count: counts[key] ?? 0 });
      current.setDate(current.getDate() + 1);
    }
    return result;
  } catch {
    return [];
  }
}

// ─── 최근 7일 (일별) ─────────────────────────────────────────────────────────

export async function getLast7DaysPosts(): Promise<DayPostCount[]> {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 6);
  return getPostsByDateRange(start, now);
}

// ─── 최근 4주 (주별) ─────────────────────────────────────────────────────────

export async function getLast4WeeksPosts(): Promise<DayPostCount[]> {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  const start = new Date();
  start.setDate(start.getDate() - 27);
  start.setHours(0, 0, 0, 0);

  const weeks: { label: string; from: number; to: number }[] = [
    { label: '4주 전', from: 27, to: 21 },
    { label: '3주 전', from: 20, to: 14 },
    { label: '2주 전', from: 13, to: 7  },
    { label: '이번 주', from: 6,  to: 0  },
  ];

  try {
    const snap = await getDocs(
      query(collection(db, 'posts'), where('createdAt', '>=', Timestamp.fromDate(start)))
    );

    const counts: Record<string, number> = {};
    snap.docs.forEach((d) => {
      const p = d.data() as Post;
      if (!p.createdAt) return;
      const daysAgo = Math.floor((now.getTime() - p.createdAt.toMillis()) / 86_400_000);
      const week = weeks.find((w) => daysAgo >= w.to && daysAgo <= w.from);
      if (week) counts[week.label] = (counts[week.label] ?? 0) + 1;
    });

    return weeks.map((w) => ({ date: w.label, count: counts[w.label] ?? 0 }));
  } catch {
    return weeks.map((w) => ({ date: w.label, count: 0 }));
  }
}

// ─── 최근 12개월 (월별) ───────────────────────────────────────────────────────

export async function getLast12MonthsPosts(): Promise<DayPostCount[]> {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  start.setHours(0, 0, 0, 0);

  const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

  try {
    const snap = await getDocs(
      query(collection(db, 'posts'), where('createdAt', '>=', Timestamp.fromDate(start)))
    );

    const counts: Record<string, number> = {};
    snap.docs.forEach((d) => {
      const p = d.data() as Post;
      if (!p.createdAt) return;
      const date = new Date(p.createdAt.toMillis());
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      counts[key] = (counts[key] ?? 0) + 1;
    });

    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      return { date: MONTHS[d.getMonth()], count: counts[key] ?? 0 };
    });
  } catch {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return { date: MONTHS[d.getMonth()], count: 0 };
    });
  }
}

// ─── 카테고리별 분포 ──────────────────────────────────────────────────────────

export async function getCategoryDistribution(): Promise<CategoryCount[]> {
  try {
    const snap = await getDocs(query(collection(db, 'posts')));
    const counts: Record<string, number> = {};
    snap.docs.forEach((d) => {
      const cat = (d.data() as Post).category;
      if (cat) counts[cat] = (counts[cat] ?? 0) + 1;
    });
    return Object.entries(counts).map(([category, count]) => ({ category, count }));
  } catch {
    return [];
  }
}
