'use client';

import { useAdmin } from '../hooks/useAdmin';
import { useAdminStats } from '../hooks/useAdminStats';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { useAdminBadgeCounts } from '../hooks/useAdminBadgeCounts';
import AdminSidebar from './AdminSidebar';
import AdminDashboardTab from './AdminDashboardTab';
import AdminPostsTab from './AdminPostsTab';
import AdminUsersTab from './AdminUsersTab';
import AdminCharts from './AdminCharts';
import AdminStatsCharts from './AdminStatsCharts';

export default function AdminDashboard() {
  const { user, loading, isAdmin, activeTab, setActiveTab } = useAdmin();
  const { stats: dashStats, loading: dashLoading } = useAdminDashboard(activeTab === 'dashboard');
  const { stats, loading: statsLoading } = useAdminStats(activeTab === 'stats');
  const { pendingPosts, pendingReports } = useAdminBadgeCounts();

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#6C3FC5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F8F7F4]">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        nickname={user!.nickname}
        pendingPosts={pendingPosts}
        pendingReports={pendingReports}
      />

      <main className="flex-1 min-w-0 px-8 py-8">
        <p className="text-[13px] text-[#9CA3AF] mb-1">
          {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* 대시보드 탭 */}
        {activeTab === 'dashboard' && (
          <>
            <h1 className="text-[20px] font-bold text-[#111111] mb-6">대시보드</h1>
            <AdminDashboardTab stats={dashStats} loading={dashLoading} />
          </>
        )}

        {/* 게시글 탭 */}
        {activeTab === 'posts' && <AdminPostsTab active={activeTab === 'posts'} />}

        {/* 회원 탭 */}
        {activeTab === 'users' && <AdminUsersTab active={activeTab === 'users'} />}

        {/* 신고 탭 */}
        {activeTab === 'reports' && (
          <>
            <h1 className="text-[20px] font-bold text-[#111111] mb-6">신고 관리</h1>
            <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
              <div className="flex border-b border-[#E5E7EB] mb-4">
                {[`처리 대기 (${pendingReports})`, '처리 완료'].map((label, i) => (
                  <button key={label} className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${i === 0 ? 'border-[#111111] text-[#111111]' : 'border-transparent text-[#9CA3AF] hover:text-[#6B7280]'}`}>
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-[13px] text-[#9CA3AF] py-10 text-center">신고 관리 기능은 순차적으로 추가됩니다.</p>
            </div>
          </>
        )}

        {/* 공지/광고 탭 */}
        {(activeTab === 'notices' || activeTab === 'ads') && (
          <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
            <p className="text-[13px] text-[#9CA3AF] py-10 text-center">준비 중입니다.</p>
          </div>
        )}

        {/* 통계 탭 */}
        {activeTab === 'stats' && (
          <>
            <h1 className="text-[20px] font-bold text-[#111111] mb-6">통계</h1>
            {statsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-[#6C3FC5] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: '총 게시글', value: stats.totalPosts,    sub: `오늘 +${stats.postsToday}`,    color: '#6C3FC5' },
                    { label: '총 회원',   value: stats.totalUsers,    sub: `오늘 +${stats.usersToday}`,    color: '#8B5CF6' },
                    { label: '총 댓글',   value: stats.totalComments, sub: '전체 누적',                    color: '#0EA5E9' },
                  ].map(({ label, value, sub, color }) => (
                    <div key={label} className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
                      <p className="text-[11px] text-[#9CA3AF] mb-1">{label}</p>
                      <p className="text-[28px] font-bold mb-0.5" style={{ color }}>{value.toLocaleString()}</p>
                      <p className="text-[11px] text-[#16A34A]">{sub}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: '오늘 신규 게시글', value: stats.postsToday,     sub: '오늘 작성된 글',   color: '#F59E0B' },
                    { label: '오늘 신규 회원',   value: stats.usersToday,     sub: '오늘 가입한 회원', color: '#10B981' },
                    { label: '미처리 신고',      value: pendingReports,        sub: '처리 필요',        color: '#EF4444' },
                  ].map(({ label, value, sub, color }) => (
                    <div key={label} className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
                      <p className="text-[11px] text-[#9CA3AF] mb-1">{label}</p>
                      <p className="text-[28px] font-bold mb-0.5" style={{ color }}>{value.toLocaleString()}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{sub}</p>
                    </div>
                  ))}
                </div>
                <AdminCharts />
                <AdminStatsCharts active={activeTab === 'stats'} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
