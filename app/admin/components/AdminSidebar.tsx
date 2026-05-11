'use client';

import Link from 'next/link';
import { AdminTab } from '../hooks/useAdmin';

const NAV_ITEMS: { label: string; tab: AdminTab }[] = [
  { label: '대시보드',   tab: 'dashboard' },
  { label: '게시글 관리', tab: 'posts' },
  { label: '회원 관리',  tab: 'users' },
  { label: '신고 관리',  tab: 'reports' },
  { label: '공지 발송',  tab: 'notices' },
  { label: '광고 관리',  tab: 'ads' },
  { label: '통계',       tab: 'stats' },
];

interface Props {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  nickname: string;
  pendingPosts: number;
  pendingReports: number;
}

export default function AdminSidebar({ activeTab, onTabChange, nickname, pendingPosts, pendingReports }: Props) {
  const getBadge = (tab: AdminTab): number => {
    if (tab === 'posts') return pendingPosts;
    if (tab === 'reports') return pendingReports;
    return 0;
  };

  return (
    <aside className="w-[240px] shrink-0 min-h-screen bg-[#111111] flex flex-col">
      {/* 로고 */}
      <div className="px-5 py-6 border-b border-white/10">
        <p className="text-white text-[18px] font-black tracking-tight">스토리슈페너</p>
        <p className="text-[#AAAAAA] text-[12px] mt-0.5">관리자 패널</p>
      </div>

      {/* 어드민 유저 */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#6C3FC5] flex items-center justify-center text-white text-[13px] font-bold">
          {nickname[0]}
        </div>
        <div>
          <p className="text-white text-[13px] font-semibold">{nickname}</p>
          <p className="text-[#AAAAAA] text-[11px]">레벨5 관리자</p>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 py-3">
        {NAV_ITEMS.map(({ label, tab }) => {
          const active = activeTab === tab;
          const badge = getBadge(tab);
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`w-full flex items-center justify-between px-5 py-3 text-[13px] transition-colors ${
                active
                  ? 'bg-[#222222] text-white border-l-[3px] border-l-[#6C3FC5]'
                  : 'text-[#AAAAAA] hover:bg-[#1a1a1a] hover:text-white border-l-[3px] border-l-transparent'
              }`}
            >
              <span>{label}</span>
              {badge > 0 && (
                <span className="bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 하단 */}
      <div className="px-5 py-4 border-t border-white/10">
        <Link
          href="/"
          className="block text-[12px] text-[#AAAAAA] hover:text-white transition-colors mb-2"
        >
          ← 사이트로 돌아가기
        </Link>
      </div>
    </aside>
  );
}
