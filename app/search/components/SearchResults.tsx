'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useSearchPosts } from '../hooks/useSearchPosts';
import { Category } from '@/lib/types';
import { CATEGORY_EMOJI } from '@/lib/constants/categories';

function highlight(text: string, keyword: string): React.ReactNode {
  if (!keyword.trim()) return text;
  const parts = text.split(new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <mark key={i} className="bg-[#F3EEFF] text-[#6C3FC5] rounded-[3px] px-0.5 not-italic">{part}</mark>
    ) : part
  );
}

function formatDate(ts: Timestamp): string {
  const d = ts?.toDate?.() ?? new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function SearchResults() {
  const router = useRouter();
  const [inputVal, setInputVal] = useState('');
  const {
    keyword, tagParam, effectiveTag, isTagSearch,
    loading, filtered, categoryFilter, setCategoryFilter,
    sort, setSort, SORT_OPTIONS, categoryGroups, totalCount,
  } = useSearchPosts();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const v = inputVal.trim();
    if (!v) return;
    if (v.startsWith('#')) {
      router.push(`/search?tag=${encodeURIComponent(v.slice(1))}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(v)}`);
    }
  };

  const hasQuery = isTagSearch || !!keyword;
  return (
    <div className="max-w-[860px] mx-auto px-4 py-8 flex flex-col gap-6">
      {/* 검색 바 */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          defaultValue={isTagSearch ? `#${effectiveTag}` : keyword}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="검색어 또는 #태그로 검색하세요"
          className="flex-1 h-[48px] px-4 border-2 border-[#6C3FC5] rounded-[12px] text-[14px] placeholder-[#9CA3AF] focus:outline-none"
        />
        <button type="submit" className="h-[48px] px-6 bg-[#6C3FC5] text-white text-[14px] font-bold rounded-[12px] hover:bg-[#5a33a8] transition-colors shrink-0">
          검색
        </button>
      </form>

      {hasQuery && (
        <>
          {/* 결과 요약 */}
          <p className="text-[14px] text-[#4B5563]">
            {isTagSearch ? (
              <>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[13px] font-bold bg-[#F3EEFF] text-[#6C3FC5] mr-1">#{effectiveTag}</span>
                태그 게시글{' '}
                <span className="text-[#6C3FC5] font-bold">{totalCount}개</span>
              </>
            ) : (
              <>
                <span className="font-bold text-[#111111]">"{keyword}"</span> 검색 결과 · 총{' '}
                <span className="text-[#6C3FC5] font-bold">{totalCount}개</span>의 글이 있습니다
              </>
            )}
          </p>

          {/* 필터 */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter('전체')}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                  categoryFilter === '전체' ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]' : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#6C3FC5]'
                }`}
              >
                전체 ({totalCount})
              </button>
              {Array.from(categoryGroups.entries()).map(([cat, count]) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat as Category)}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                    categoryFilter === cat ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]' : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#6C3FC5]'
                  }`}
                >
                  {cat} ({count})
                </button>
              ))}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-8 px-3 border border-[#E5E7EB] rounded-[8px] text-[12px] focus:outline-none focus:border-[#6C3FC5] bg-white"
            >
              {SORT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* 결과 목록 */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-[#6C3FC5] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[15px] text-[#6B7280]">검색 결과가 없습니다.</p>
              <p className="text-[13px] text-[#9CA3AF] mt-1">다른 검색어를 입력해보세요.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="bg-white border border-[#E5E7EB] rounded-[12px] p-5 hover:border-[#6C3FC5] hover:shadow-sm transition-all block"
                >
                  <div className="flex gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-[34px] h-[34px] rounded-full bg-[#6C3FC5] flex items-center justify-center text-white text-[13px] font-bold shrink-0">
                            {post.nickname[0]}
                          </div>
                          <div>
                            <span className="text-[13px] font-semibold text-[#111111]">{post.nickname}</span>
                            <span className="ml-2 px-2 py-0.5 bg-[#F3EEFF] text-[#6C3FC5] text-[11px] rounded-full">{post.category}</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-[#9CA3AF] shrink-0">조회 {post.views.toLocaleString()}</span>
                      </div>
                      <h3 className="text-[15px] font-semibold text-[#111111] mb-1.5 leading-snug">
                        {isTagSearch ? post.title : highlight(post.title, keyword)}
                      </h3>
                      <p className="text-[13px] text-[#6B7280] line-clamp-2 leading-relaxed mb-3">
                        {isTagSearch
                          ? post.content.replace(/<[^>]*>/g, '').slice(0, 150)
                          : highlight(post.content.replace(/<[^>]*>/g, '').slice(0, 150), keyword)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[11px] text-[#9CA3AF]">
                          <span>❤️ {post.likeCount}</span>
                          <span>💬 {post.commentCount}</span>
                          <span>📅 {formatDate(post.createdAt)}</span>
                        </div>
                        <span className="w-7 h-7 bg-[#F3F4F6] rounded-[8px] flex items-center justify-center text-[14px]">
                          {CATEGORY_EMOJI[post.category] ?? '📄'}
                        </span>
                      </div>
                      {/* 태그 목록 */}
                      {post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {post.hashtags.slice(0, 5).map((tag) => (
                            <span
                              key={tag}
                              onClick={(e) => { e.preventDefault(); router.push(`/search?tag=${encodeURIComponent(tag)}`); }}
                              className={`text-[11px] px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                                tag === effectiveTag
                                  ? 'bg-[#6C3FC5] text-white'
                                  : 'bg-[#F3EEFF] text-[#6C3FC5] hover:bg-[#E8D9FF]'
                              }`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {post.thumbnailUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.thumbnailUrl}
                        alt=""
                        className="w-[88px] h-[88px] rounded-[10px] object-cover shrink-0 self-center"
                      />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {!hasQuery && (
        <div className="text-center py-20">
          <p className="text-[15px] text-[#6B7280]">검색어를 입력하세요.</p>
          <p className="text-[12px] text-[#9CA3AF] mt-1"># 을 앞에 붙이면 태그 검색이 됩니다</p>
        </div>
      )}
    </div>
  );
}
