'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DayPostCount, CategoryCount,
  getLast7DaysPosts, getLast4WeeksPosts, getLast12MonthsPosts,
  getCategoryDistribution, getPostsByDateRange,
} from '@/lib/services/adminChartService';

export type ChartTab = 'daily' | 'weekly' | 'monthly' | 'custom';

export function useAdminCharts() {
  const [tab, setTab] = useState<ChartTab>('daily');
  const [timelineData, setTimelineData] = useState<DayPostCount[]>([]);
  const [catData, setCatData] = useState<CategoryCount[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 카테고리 분포는 최초 1회만 로드
  useEffect(() => {
    getCategoryDistribution()
      .then(setCatData)
      .finally(() => setCatLoading(false));
  }, []);

  // 탭 변경 시 타임라인 데이터 로드
  const loadTimeline = useCallback(async () => {
    setTimelineLoading(true);
    try {
      let data: DayPostCount[] = [];
      if (tab === 'daily')   data = await getLast7DaysPosts();
      if (tab === 'weekly')  data = await getLast4WeeksPosts();
      if (tab === 'monthly') data = await getLast12MonthsPosts();
      setTimelineData(data);
    } finally {
      setTimelineLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    if (tab !== 'custom') loadTimeline();
    else setTimelineLoading(false);
  }, [tab, loadTimeline]);

  // 직접 선택 탭 조회
  const handleCustomQuery = useCallback(async () => {
    if (!startDate || !endDate) return;
    setTimelineLoading(true);
    try {
      const data = await getPostsByDateRange(new Date(startDate), new Date(endDate));
      setTimelineData(data);
    } finally {
      setTimelineLoading(false);
    }
  }, [startDate, endDate]);

  return {
    tab, setTab,
    timelineData, catData,
    timelineLoading, catLoading,
    startDate, setStartDate,
    endDate, setEndDate,
    handleCustomQuery,
  };
}
