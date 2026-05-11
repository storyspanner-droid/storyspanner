'use client';

import Link from 'next/link';
import { useMyPage, MyPageTab } from '../hooks/useMyPage';
import { useMyPageStats } from '../hooks/useMyPageStats';
import { useMyCharts } from '../hooks/useMyCharts';
import { LevelBadge } from '@/components/ui/Badge';
import MyPostsList from './MyPostsList';
import MyCharts from './MyCharts';

const NAV_ITEMS: { label: string; tab: MyPageTab; red?: boolean }[] = [
  { label: '대시보드',    tab: 'dashboard' },
  { label: '내가 쓴 글',  tab: 'posts' },
  { label: '좋아요한 글', tab: 'likes' },
  { label: '친구 관리',   tab: 'friends' },
  { label: '상세 통계',   tab: 'stats' },
  { label: '내 정보 수정', tab: 'settings' },
  { label: '회원 탈퇴',   tab: 'withdraw', red: true },
];

const LEVEL_LABELS: Record<number, string> = {
  1: '일반회원', 2: '활동회원', 3: '우수회원', 4: '운영회원', 5: '관리자',
};

export default function MyPageDashboard() {
  const { user, activeTab, setActiveTab, handleSignOut } = useMyPage();
  const { stats, loading: statsLoading } = useMyPageStats(user?.id);
  const { data: chartData, loading: chartLoading } = useMyCharts(activeTab === 'stats' ? user?.id : undefined);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-[15px] text-[#6B7280]">로그인이 필요합니다.</p>
        <Link href="/login" className="px-5 py-2.5 bg-[#6C3FC5] text-white text-[13px] font-bold rounded-[10px] hover:bg-[#5a33a8] transition-colors">
          로그인하기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8 flex gap-6 items-start">
      {/* 사이드바 */}
      <aside className="w-[240px] shrink-0 flex flex-col gap-4">
        {/* 프로필 카드 */}
        <div className="bg-white border border-[#E5E7EB] rounded-[16px] overflow-hidden">
          <div className="flex flex-col items-center py-7 px-4">
            <div className="w-[68px] h-[68px] rounded-full bg-[#111111] flex items-center justify-center text-white text-[24px] font-black mb-3">
              {user.nickname[0]}
            </div>
            <p className="text-[15px] font-bold text-[#111111]">{user.nickname}</p>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">@{user.userId}</p>
            <div className="mt-2 px-3 py-1 bg-[#F3F4F6] rounded-full">
              <span className="text-[11px] text-[#6B7280]">레벨{user.level} {LEVEL_LABELS[user.level]}</span>
            </div>
            <div className="mt-2">
              <LevelBadge level={user.level} />
            </div>
          </div>
          <div className="border-t border-[#E5E7EB] grid grid-cols-3 divide-x divide-[#E5E7EB]">
            {[
              { label: '게시글', value: user.postCount },
              { label: '팔로워', value: user.followerCount },
              { label: '팔로잉', value: user.followingCount },
            ].map(({ label, value }) => (
              <div key={label} className="py-3 text-center">
                <p className="text-[14px] font-bold text-[#111111]">{value ?? 0}</p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 네비게이션 */}
        <nav className="bg-white border border-[#E5E7EB] rounded-[16px] overflow-hidden">
          {NAV_ITEMS.map(({ label, tab, red }) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-[13px] transition-colors border-b border-[#F9FAFB] last:border-0 ${
                  active
                    ? 'font-semibold bg-[#F9FAFB] border-l-[3px] border-l-[#111111] text-[#111111]'
                    : red
                    ? 'text-[#EF4444] hover:bg-red-50'
                    : 'text-[#374151] hover:bg-[#F9FAFB]'
                }`}
              >
                <span>{label}</span>
                <span className="text-[#D1D5DB] text-[12px]">›</span>
              </button>
            );
          })}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-[13px] text-[#9CA3AF] hover:bg-[#F9FAFB] transition-colors"
          >
            로그아웃
          </button>
        </nav>
      </aside>

      {/* 메인 */}
      <main className="flex-1 min-w-0 flex flex-col gap-4">
        {activeTab === 'dashboard' && (
          <>
            <h2 className="text-[20px] font-bold text-[#111111]">대시보드</h2>
            {statsLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-5 h-5 border-2 border-[#6C3FC5] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: '총 조회수',
                    sub: `이번달 글 ${stats.postsThisMonth}개`,
                    value: stats.totalViews,
                    color: '#6C3FC5',
                  },
                  {
                    label: '받은 좋아요',
                    sub: `이번달 +${stats.likesThisMonth}`,
                    value: stats.totalLikes,
                    color: '#EF4444',
                  },
                  {
                    label: '총 게시글',
                    sub: `지난달 ${stats.postsLastMonth}개`,
                    value: stats.totalPosts,
                    color: '#8B5CF6',
                  },
                  {
                    label: '팔로워',
                    sub: `팔로잉 ${user.followingCount ?? 0}명`,
                    value: user.followerCount ?? 0,
                    color: '#F59E0B',
                  },
                ].map(({ label, sub, value, color }) => (
                  <div key={label} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] p-5">
                    <p className="text-[11px] text-[#9CA3AF] mb-1">{label}</p>
                    <p className="text-[24px] font-bold" style={{ color }}>{value.toLocaleString()}</p>
                    <p className="text-[11px] text-[#16A34A] mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
              <h3 className="text-[14px] font-bold text-[#111111] mb-3">관심분야</h3>
              {user.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((cat) => (
                    <span key={cat} className="px-3 py-1 rounded-full text-[12px] font-medium bg-[#F3EEFF] text-[#6C3FC5]">
                      {cat}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[#9CA3AF]">등록된 관심분야가 없습니다.</p>
              )}
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5 flex items-center justify-between">
              <div>
                <p className="text-[14px] font-bold text-[#111111]">오늘도 글을 작성해보세요!</p>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">글을 작성하면 포인트를 받을 수 있어요.</p>
              </div>
              <Link href="/write" className="px-4 py-2 bg-[#6C3FC5] text-white text-[13px] font-bold rounded-[8px] hover:bg-[#5a33a8] transition-colors shrink-0">
                글쓰기
              </Link>
            </div>
          </>
        )}

        {activeTab === 'posts' && <MyPostsList userId={user.id} />}

        {activeTab === 'likes' && (
          <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 text-center py-16">
            <p className="text-[#6B7280] text-[15px] mb-1">❤️ 좋아요한 글</p>
            <p className="text-[13px] text-[#9CA3AF]">좋아요한 게시글이 여기에 표시됩니다.</p>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 text-center py-16">
            <p className="text-[#6B7280] text-[15px] mb-1">👥 친구 관리</p>
            <p className="text-[13px] text-[#9CA3AF]">팔로워 / 팔로잉 목록이 표시됩니다.</p>
          </div>
        )}

        {activeTab === 'stats' && (
          <>
            <h2 className="text-[20px] font-bold text-[#111111]">상세 통계</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '총 게시글',    value: user.postCount ?? 0,       sub: '작성한 게시글 수',    color: '#6C3FC5' },
                { label: '총 댓글',      value: user.commentCount ?? 0,    sub: '작성한 댓글 수',      color: '#8B5CF6' },
                { label: '팔로워',       value: user.followerCount ?? 0,   sub: '나를 팔로우한 수',    color: '#0EA5E9' },
                { label: '팔로잉',       value: user.followingCount ?? 0,  sub: '내가 팔로우한 수',    color: '#10B981' },
                { label: '포인트',       value: user.points ?? 0,          sub: '누적 포인트',          color: '#F59E0B' },
                { label: '레벨',         value: user.level ?? 1,           sub: `레벨${user.level} 회원`, color: '#EF4444' },
              ].map(({ label, value, sub, color }) => (
                <div key={label} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] p-5">
                  <p className="text-[11px] text-[#9CA3AF] mb-1">{label}</p>
                  <p className="text-[24px] font-bold" style={{ color }}>{value.toLocaleString()}</p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
            <MyCharts data={chartData} loading={chartLoading} />
          </>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-6">
            <h3 className="text-[15px] font-bold text-[#111111] mb-5">내 정보 수정</h3>
            <div className="flex flex-col gap-0">
              {[
                { label: '이메일',   value: user.email },
                { label: '닉네임',   value: user.nickname },
                { label: '전화번호', value: user.phone || '미등록' },
                { label: '생년월일', value: user.birthDate || '미등록' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3.5 border-b border-[#F9FAFB]">
                  <span className="text-[13px] font-medium text-[#6B7280]">{label}</span>
                  <span className="text-[13px] text-[#111111]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div className="bg-white border border-[#FECACA] rounded-[12px] p-6">
            <h3 className="text-[15px] font-bold text-[#EF4444] mb-2">회원 탈퇴</h3>
            <p className="text-[13px] text-[#6B7280] mb-4">탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.</p>
            <button className="px-4 py-2 bg-[#EF4444] text-white text-[13px] font-bold rounded-[8px] hover:bg-red-600 transition-colors">
              탈퇴 신청
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
