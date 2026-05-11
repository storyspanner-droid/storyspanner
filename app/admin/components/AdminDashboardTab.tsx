'use client';

import { Timestamp } from 'firebase/firestore';
import { AdminDashboardStats } from '@/lib/services/adminService';
import AdminCharts from './AdminCharts';

function timeAgo(ts: Timestamp | undefined): string {
  if (!ts) return '-';
  const diff = Date.now() - ts.toMillis();
  if (diff < 60_000) return '방금 전';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}분 전`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}시간 전`;
  const d = new Date(ts.toMillis());
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

interface Props {
  stats: AdminDashboardStats;
  loading: boolean;
}

export default function AdminDashboardTab({ stats: s, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-[#6C3FC5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: '총 회원 수',  sub: `+${s.usersToday} 오늘 가입`,    value: s.totalUsers,    color: '#6C3FC5' },
    { label: '총 게시글',   sub: `+${s.postsToday} 오늘 작성`,    value: s.totalPosts,    color: '#8B5CF6' },
    { label: '승인 대기',   sub: '처리 필요',                      value: s.pendingPosts,  color: '#F59E0B' },
    { label: '신고 대기',   sub: '처리 필요',                      value: s.pendingReports,color: '#EF4444' },
    {
      label: '정지 회원',
      sub: s.totalUsers > 0 ? `전체의 ${((s.suspendedUsers / s.totalUsers) * 100).toFixed(1)}%` : '0%',
      value: s.suspendedUsers,
      color: '#6B7280',
    },
    { label: '총 조회수',   sub: '전체 누적', value: s.totalViews,  color: '#0EA5E9' },
    { label: '오늘 좋아요', sub: '오늘 기준', value: s.likesToday,  color: '#EC4899' },
    { label: '관리자 수',   sub: '레벨5 회원', value: s.adminUsers, color: '#10B981' },
  ];

  return (
    <>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {cards.map(({ label, sub, value, color }) => (
          <div key={label} className="bg-white border border-[#E5E7EB] rounded-[12px] p-4">
            <p className="text-[11px] text-[#9CA3AF] mb-1">{label}</p>
            <p className="text-[24px] font-bold mb-0.5" style={{ color }}>{value.toLocaleString()}</p>
            <p className="text-[11px] text-[#16A34A]">{sub}</p>
          </div>
        ))}
      </div>

      <AdminCharts />

      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
        <h3 className="text-[14px] font-bold text-[#111111] mb-3">최근 활동</h3>
        {s.recentPosts.length === 0 ? (
          <p className="text-[13px] text-[#9CA3AF] py-6 text-center">아직 게시글이 없습니다.</p>
        ) : (
          <ul className="divide-y divide-[#F9FAFB]">
            {s.recentPosts.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] font-medium px-2 py-0.5 bg-[#F3EEFF] text-[#6C3FC5] rounded-full shrink-0">
                    {p.category}
                  </span>
                  <span className="text-[13px] text-[#111111] truncate">{p.title}</span>
                  <span className="text-[12px] text-[#9CA3AF] shrink-0">by {p.nickname}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span className="text-[11px] text-[#9CA3AF]">조회 {(p.views ?? 0).toLocaleString()}</span>
                  <span className="text-[11px] text-[#9CA3AF]">{timeAgo(p.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
