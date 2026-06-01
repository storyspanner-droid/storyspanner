'use client';

import Link from 'next/link';
import { useHeader } from '@/lib/hooks/useHeader';
import { useNotifications } from '@/lib/hooks/useNotifications';
import NotificationPopup from './NotificationPopup';
import { CATEGORY_LIST } from '@/lib/constants/categories';


const ALL_NAV = [
  { label: '전체', href: '/' },
  ...CATEGORY_LIST.map((cat) => ({ label: cat.label, href: `/${cat.id}` })),
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export default function Header() {
  const { user, menuOpen, setMenuOpen, menuRef, pathname, handleSignOut } = useHeader();
  const {
    notifications, loading: notiLoading, open: notiOpen,
    unreadCount, handleOpen: openNoti, handleClose: closeNoti,
    handleMarkRead, handleMarkAllRead,
  } = useNotifications(user?.id);

  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40 shadow-[0_1px_4px_0_rgba(0,0,0,0.04)]">
      {/* 상단 바 */}
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* 로고 */}
        <Link href="/" className="text-[18px] font-black text-[#6C3FC5] tracking-tight shrink-0">
          스토리슈페너
        </Link>

        {/* 우측 영역 */}
        <div className="ml-auto flex items-center gap-1.5 shrink-0 pl-4">
          {user ? (
            <>
              {/* 글쓰기 버튼 */}
              <Link
                href="/write"
                className="hidden sm:flex h-9 px-4 items-center text-[13px] font-bold text-white bg-[#6C3FC5] rounded-[8px] hover:bg-[#5a33a8] transition-colors"
              >
                ✏️ 글쓰기
              </Link>

              {/* 알림 */}
              <div className="relative">
                <button
                  onClick={notiOpen ? closeNoti : openNoti}
                  className="relative w-9 h-9 flex items-center justify-center text-[#6B7280] hover:text-[#111111] hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <BellIcon />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] rounded-full text-[9px] font-bold text-white flex items-center justify-center leading-none">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {notiOpen && (
                  <NotificationPopup
                    notifications={notifications}
                    loading={notiLoading}
                    onClose={closeNoti}
                    onMarkRead={handleMarkRead}
                    onMarkAllRead={handleMarkAllRead}
                  />
                )}
              </div>

              {/* 유저 드롭다운 */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1.5 h-9 px-3 text-sm font-semibold text-[#111111] hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="max-w-[80px] truncate">{user.nickname}</span>
                  <ChevronIcon open={menuOpen} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-[#E5E7EB] rounded-[12px] shadow-lg py-1 overflow-hidden">
                    <Link href="/mypage"    className="menu-item" onClick={() => setMenuOpen(false)}>마이페이지</Link>
                    <Link href="/write"     className="menu-item" onClick={() => setMenuOpen(false)}>글쓰기</Link>
                    {user.level === 5 && (
                      <Link href="/admin"   className="menu-item" onClick={() => setMenuOpen(false)}>관리자</Link>
                    )}
                    <div className="border-t border-[#E5E7EB] my-1" />
                    <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-[#EF4444] hover:bg-red-50 transition-colors">
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login"    className="h-9 px-4 flex items-center text-[13px] font-medium text-[#4B5563] hover:bg-gray-100 rounded-[10px] transition-colors">
                로그인
              </Link>
              <Link href="/register" className="h-9 px-4 flex items-center text-[13px] font-bold bg-[#6C3FC5] text-white rounded-[8px] hover:bg-[#5a33a8] transition-colors">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 카테고리 탭 — /admin 경로에서는 숨김 */}
      {!pathname.startsWith('/admin') && (
        <nav className="border-t border-[#E5E7EB]">
          <div className="max-w-6xl mx-auto px-4">
            <ul className="flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {ALL_NAV.map(({ label, href }) => {
                const active = isActive(pathname, href);
                return (
                  <li key={href} className="shrink-0">
                    <Link
                      href={href}
                      className={`block px-4 py-2.5 text-[13px] whitespace-nowrap border-b-2 transition-colors ${
                        active
                          ? 'text-[#6C3FC5] font-bold border-[#6C3FC5]'
                          : 'text-[#6B7280] font-medium border-transparent hover:text-[#111111] hover:bg-[#F8F7F4]'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      className={`transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
