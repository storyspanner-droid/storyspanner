'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAdminCharts, ChartTab } from '../hooks/useAdminCharts';
import AdminChartsTimeline from './AdminChartsTimeline';

const TABS: { id: ChartTab; label: string }[] = [
  { id: 'daily',   label: '일별' },
  { id: 'weekly',  label: '주별' },
  { id: 'monthly', label: '월별' },
  { id: 'custom',  label: '직접 선택' },
];

const PIE_COLORS = ['#6C3FC5', '#8B5CF6', '#0EA5E9', '#10B981', '#F59E0B', '#EC4899', '#EF4444'];

const TAB_TITLE: Record<ChartTab, string> = {
  daily:   '최근 7일',
  weekly:  '최근 4주',
  monthly: '최근 12개월',
  custom:  '날짜 범위',
};

export default function AdminCharts() {
  const {
    tab, setTab,
    timelineData, catData,
    timelineLoading, catLoading,
    startDate, setStartDate,
    endDate, setEndDate,
    handleCustomQuery,
  } = useAdminCharts();

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      {/* 게시글 추이 차트 */}
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-bold text-[#111111]">
            게시글 {TAB_TITLE[tab]} 추이
          </p>
          <div className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-2.5 py-1 text-[11px] rounded-[6px] transition-colors ${
                  tab === t.id
                    ? 'bg-[#6C3FC5] text-white'
                    : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 직접 선택 날짜 입력 */}
        {tab === 'custom' && (
          <div className="flex gap-2 mb-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 h-8 px-2 border border-[#E5E7EB] rounded-[6px] text-[12px] focus:outline-none focus:border-[#6C3FC5]"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 h-8 px-2 border border-[#E5E7EB] rounded-[6px] text-[12px] focus:outline-none focus:border-[#6C3FC5]"
            />
            <button
              onClick={handleCustomQuery}
              disabled={!startDate || !endDate}
              className="px-3 h-8 text-[12px] bg-[#6C3FC5] text-white rounded-[6px] hover:bg-[#5a33a8] disabled:opacity-50 transition-colors"
            >
              조회
            </button>
          </div>
        )}

        <AdminChartsTimeline tab={tab} data={timelineData} loading={timelineLoading} />
      </div>

      {/* 카테고리 분포 차트 */}
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
        <p className="text-[13px] font-bold text-[#111111] mb-4">카테고리별 분포</p>
        {catLoading ? (
          <div className="h-[190px] flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-[#6C3FC5] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : catData.length === 0 ? (
          <p className="text-[12px] text-[#9CA3AF] text-center py-16">데이터 없음</p>
        ) : (
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie
                data={catData}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={60}
              >
                {catData.map((entry, i) => (
                  <Cell key={entry.category} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' }}
                formatter={(v, n) => [String(v) + '건', String(n)]}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
