'use client';

import { useState, useEffect } from 'react';
import {
  DayCount, ReportStats, HourCount,
  getLast30DaysUsers, getReportStats, getHourlyActivity,
} from '@/lib/services/adminStatsService';

export function useAdminStatsCharts(active: boolean) {
  const [usersData, setUsersData] = useState<DayCount[]>([]);
  const [reportStats, setReportStats] = useState<ReportStats>({ pending: 0, resolved: 0, ignored: 0 });
  const [hourlyData, setHourlyData] = useState<HourCount[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!active) return;
    setLoading(true);
    Promise.all([getLast30DaysUsers(), getReportStats(), getHourlyActivity()])
      .then(([users, reports, hourly]) => {
        setUsersData(users);
        setReportStats(reports);
        setHourlyData(hourly);
      })
      .finally(() => setLoading(false));
  }, [active]);

  return { usersData, reportStats, hourlyData, loading };
}
