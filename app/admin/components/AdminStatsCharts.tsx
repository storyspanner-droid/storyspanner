'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useAdminStatsCharts } from '../hooks/useAdminStatsCharts';

const AXIS_PROPS = {
  tick: { fontSize: 10, fill: '#9CA3AF' },
  axisLine: false as const,
  tickLine: false as const,
};

const TOOLTIP_STYLE = {
  contentStyle: { fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' },
};

function tickFormatter(_: string, index: number): string {
  return index % 5 === 0 ? _ : '';
}

export default function AdminStatsCharts({ active }: { active: boolean }) {
  const { usersData, reportStats, hourlyData, loading } = useAdminStatsCharts(active);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="w-5 h-5 border-2 border-[#6C3FC5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const reportPie = [
    { name: '미처리', value: reportStats.pending, color: '#EF4444' },
    { name: '처리완료', value: reportStats.resolved, color: '#10B981' },
    { name: '무시', value: reportStats.ignored, color: '#9CA3AF' },
  ].filter((d) => d.value > 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        {/* 신규 가입자 추이 */}
        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-4">
          <p className="text-[13px] font-bold text-[#111111] mb-3">신규 가입자 추이 (최근 30일)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={usersData}>
              <XAxis dataKey="date" {...AXIS_PROPS} tickFormatter={tickFormatter} />
              <YAxis {...AXIS_PROPS} allowDecimals={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: unknown) => [String(v) + '명', '신규 가입']} />
              <Bar dataKey="count" fill="#8B5CF6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 신고 처리 현황 */}
        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-4">
          <p className="text-[13px] font-bold text-[#111111] mb-3">신고 처리 현황</p>
          {reportPie.length === 0 ? (
            <div className="h-[160px] flex items-center justify-center">
              <p className="text-[12px] text-[#9CA3AF]">신고 데이터 없음</p>
            </div>
          ) : (
            <div className="flex items-center gap-4 h-[160px]">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={reportPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={38} outerRadius={62}>
                    {reportPie.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v: unknown) => [String(v) + '건', '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {reportPie.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-[12px] text-[#6B7280]">{d.name} ({d.value}건)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 시간대별 게시글 등록 */}
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-4">
        <p className="text-[13px] font-bold text-[#111111] mb-3">시간대별 게시글 등록 (최근 7일)</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={hourlyData}>
            <XAxis dataKey="hour" {...AXIS_PROPS} interval={2} />
            <YAxis {...AXIS_PROPS} allowDecimals={false} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v: unknown) => [String(v) + '건', '게시글']} />
            <Bar dataKey="count" fill="#6C3FC5" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
