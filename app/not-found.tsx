'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { label: '🎮 게임', href: '/게임' },
  { label: '💼 비즈니스', href: '/비즈니스' },
  { label: '🏥 의료정보', href: '/의료정보' },
  { label: '📣 마케팅', href: '/마케팅' },
  { label: '💰 코인/투자', href: '/코인투자' },
  { label: '🛠️ 인테리어', href: '/인테리어DIY' },
  { label: '📢 공지사항', href: '/공지사항' },
];

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
      {/* 심플 헤더 */}
      <header className="bg-white border-b border-[#E5E7EB] px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-[18px] font-black text-[#6C3FC5] tracking-tight">
          스토리슈페너
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login" className="text-[13px] text-[#6B7280] hover:text-[#111111] px-3 py-1.5 transition-colors">로그인</Link>
          <Link href="/register" className="text-[13px] font-bold text-white bg-[#6C3FC5] px-3 py-1.5 rounded-[8px] hover:bg-[#5a33a8] transition-colors">회원가입</Link>
        </div>
      </header>

      {/* 메인 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden">
        {/* 배경 404 텍스트 */}
        <p className="absolute text-[200px] font-black text-[#6C3FC5] select-none pointer-events-none" style={{ opacity: 0.07 }}>
          404
        </p>

        <div className="relative flex flex-col items-center gap-5 max-w-[480px]">
          <span className="text-[56px]">🔍</span>

          <div className="flex flex-col gap-2">
            <h1 className="text-[24px] font-bold text-[#111111]">페이지를 찾을 수 없어요</h1>
            <p className="text-[14px] text-[#9CA3AF] leading-[1.8]">
              요청하신 페이지가 존재하지 않거나<br />
              이동되었거나 삭제되었을 수 있습니다.<br />
              주소를 다시 확인해보시거나 아래 버튼을 눌러주세요.
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 mt-2">
            <Link
              href="/"
              className="h-[46px] px-6 bg-[#6C3FC5] text-white text-[14px] font-bold rounded-[12px] flex items-center hover:bg-[#5a33a8] transition-colors"
            >
              🏠 메인으로 가기
            </Link>
            <button
              onClick={() => router.back()}
              className="h-[46px] px-6 bg-white border border-[#E5E7EB] text-[#4B5563] text-[14px] rounded-[12px] hover:bg-[#F9FAFB] transition-colors"
            >
              ← 이전 페이지
            </button>
          </div>

          {/* 카테고리 링크 */}
          <div className="flex flex-col items-center gap-3 mt-4 w-full">
            <p className="text-[13px] text-[#6B7280]">이런 페이지를 찾고 계신가요?</p>
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3.5 py-1.5 bg-white border border-[#E5E7EB] rounded-full text-[12px] text-[#4B5563] hover:border-[#6C3FC5] hover:text-[#6C3FC5] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* 검색 */}
          <form
            className="flex gap-2 w-full mt-2"
            onSubmit={(e) => {
              e.preventDefault();
              const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value.trim();
              if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
            }}
          >
            <p className="sr-only">원하는 내용을 검색해보세요</p>
            <input
              name="q"
              type="text"
              placeholder="검색어 입력..."
              className="flex-1 h-[44px] px-4 border border-[#E5E7EB] rounded-[10px] text-[14px] placeholder-[#9CA3AF] focus:outline-none focus:border-[#6C3FC5] transition-colors"
            />
            <button
              type="submit"
              className="h-[44px] px-5 bg-[#6C3FC5] text-white text-[13px] font-bold rounded-[10px] hover:bg-[#5a33a8] transition-colors"
            >
              검색
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
