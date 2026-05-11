'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <section
      className="flex flex-col items-center gap-2.5 px-6 py-12 border-b border-[#E5E7EB]"
      style={{ background: '#FFFFFF' }}
    >
      <p className="text-[#6C3FC5] text-[13px] font-semibold text-center tracking-wide">
        공유한 커뮤니티가 아닌, 정리된 미래형 포털
      </p>
      <p className="text-[#111111] text-[28px] font-black tracking-tight text-center leading-tight">
        지금 여러분의 정보를 검색해 보세요
      </p>
      <form
        onSubmit={handleSearch}
        className="flex w-full max-w-[600px] mt-3 rounded-[12px] overflow-hidden border border-[#E5E7EB]"
        style={{ boxShadow: '0px 4px 16px 0px rgba(0, 0, 0, 0.08)' }}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="flex-1 px-5 py-3.5 text-[14px] placeholder-[#9CA3AF] text-[#111111] bg-white focus:outline-none"
        />
        <button
          type="submit"
          className="px-7 bg-[#6C3FC5] text-white text-[14px] font-bold shrink-0 hover:bg-[#5a33a8] transition-colors"
        >
          검색
        </button>
      </form>
    </section>
  );
}
