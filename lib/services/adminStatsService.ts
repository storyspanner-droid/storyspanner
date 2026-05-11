import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import db from '@/lib/firebase/firestore';

export interface DayCount {
  date: string;
  count: number;
}

export interface ReportStats {
  pending: number;
  resolved: number;
  ignored: number;
}

export interface HourCount {
  hour: string;
  count: number;
}

export async function getLast30DaysUsers(): Promise<DayCount[]> {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 29);
  start.setHours(0, 0, 0, 0);

  try {
    const snap = await getDocs(
      query(collection(db, 'users'), where('createdAt', '>=', Timestamp.fromDate(start)))
    );

    const counts: Record<string, number> = {};
    snap.docs.forEach((d) => {
      const data = d.data();
      if (!data.createdAt) return;
      const date = new Date(data.createdAt.toMillis());
      const key = `${date.getMonth() + 1}/${date.getDate()}`;
      counts[key] = (counts[key] ?? 0) + 1;
    });

    const result: DayCount[] = [];
    const current = new Date(start);
    while (current <= now) {
      const key = `${current.getMonth() + 1}/${current.getDate()}`;
      result.push({ date: key, count: counts[key] ?? 0 });
      current.setDate(current.getDate() + 1);
    }
    return result;
  } catch {
    return [];
  }
}

export async function getReportStats(): Promise<ReportStats> {
  try {
    const snap = await getDocs(query(collection(db, 'reports')));
    const stats: ReportStats = { pending: 0, resolved: 0, ignored: 0 };
    snap.docs.forEach((d) => {
      const status = d.data().status as string;
      if (status === 'pending') stats.pending++;
      else if (status === 'resolved') stats.resolved++;
      else if (status === 'ignored') stats.ignored++;
    });
    return stats;
  } catch {
    return { pending: 0, resolved: 0, ignored: 0 };
  }
}

export async function getHourlyActivity(): Promise<HourCount[]> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);

  try {
    const snap = await getDocs(
      query(collection(db, 'posts'), where('createdAt', '>=', Timestamp.fromDate(weekAgo)))
    );

    const counts: Record<number, number> = {};
    snap.docs.forEach((d) => {
      const data = d.data();
      if (!data.createdAt) return;
      const hour = new Date(data.createdAt.toMillis()).getHours();
      counts[hour] = (counts[hour] ?? 0) + 1;
    });

    return Array.from({ length: 24 }, (_, h) => ({
      hour: `${h}시`,
      count: counts[h] ?? 0,
    }));
  } catch {
    return Array.from({ length: 24 }, (_, h) => ({ hour: `${h}시`, count: 0 }));
  }
}
