'use client';

import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { DayPostStat } from '../hooks/useMyCharts';

const AXIS_PROPS = {
  tick: { fontSize: 10, fill: '#9CA3AF' },
  axisLine: false as const,
  tickLine: false as const,
};

const TOOLTIP_STYLE = {
  contentStyle: { fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' },
};

interface Props {
  data: DayPostStat[];
  loading: boolean;
}

function Spinner() {
  return (
    <div className="h-[160px] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-[#6C3FC5] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function tickFormatter(_: string, index: number): string {
  return index % 5 === 0 ? _ : '';
}

export default function MyCharts({ data, loading }: Props) {
  if (loading) return <Spinner />;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-4">
        <p className="text-[13px] font-bold text-[#111111] mb-3">게시글 수 추이 (최근 30일)</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data}>
            <XAxis dataKey="date" {...AXIS_PROPS} tickFormatter={tickFormatter} />
            <YAxis {...AXIS_PROPS} allowDecimals={false} />
            <Tooltip
              {...TOOLTIP_STYLE}
              formatter={(v: unknown) => [String(v) + '건', '게시글']}
            />
            <Bar dataKey="posts" fill="#6C3FC5" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-4">
        <p className="text-[13px] font-bold text-[#111111] mb-3">조회수 추이 (최근 30일)</p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={data}>
            <XAxis dataKey="date" {...AXIS_PROPS} tickFormatter={tickFormatter} />
            <YAxis {...AXIS_PROPS} allowDecimals={false} />
            <Tooltip
              {...TOOLTIP_STYLE}
              formatter={(v: unknown) => [String(v) + '회', '조회수']}
            />
            <Line type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
