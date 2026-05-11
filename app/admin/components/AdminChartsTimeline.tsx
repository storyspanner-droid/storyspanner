'use client';

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { DayPostCount } from '@/lib/services/adminChartService';
import { ChartTab } from '../hooks/useAdminCharts';

interface Props {
  tab: ChartTab;
  data: DayPostCount[];
  loading: boolean;
}

function Spinner() {
  return (
    <div className="h-[190px] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-[#6C3FC5] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const TOOLTIP_STYLE = {
  contentStyle: { fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' },
  formatter: (v: unknown) => [String(v) + '건', '게시글'],
};

const AXIS_PROPS = {
  tick: { fontSize: 11, fill: '#9CA3AF' },
  axisLine: false as const,
  tickLine: false as const,
};

export default function AdminChartsTimeline({ tab, data, loading }: Props) {
  if (loading) return <Spinner />;

  if (data.length === 0) {
    return (
      <div className="h-[190px] flex items-center justify-center">
        <p className="text-[12px] text-[#9CA3AF]">데이터 없음</p>
      </div>
    );
  }

  const isArea = tab === 'daily' || tab === 'custom';

  return (
    <ResponsiveContainer width="100%" height={190}>
      {isArea ? (
        <AreaChart data={data}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6C3FC5" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6C3FC5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" {...AXIS_PROPS} />
          <YAxis {...AXIS_PROPS} allowDecimals={false} />
          <Tooltip {...TOOLTIP_STYLE} />
          <Area type="monotone" dataKey="count" stroke="#6C3FC5" strokeWidth={2} fill="url(#areaGrad)" />
        </AreaChart>
      ) : (
        <BarChart data={data}>
          <XAxis dataKey="date" {...AXIS_PROPS} />
          <YAxis {...AXIS_PROPS} allowDecimals={false} />
          <Tooltip {...TOOLTIP_STYLE} />
          <Bar dataKey="count" fill="#6C3FC5" radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}
