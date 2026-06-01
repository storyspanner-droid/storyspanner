'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Timestamp } from 'firebase/firestore';
import { Post } from '@/lib/types';
import { injectHeadingIds, parseHeadingsFromHtml } from '@/lib/utils/headingIds';

function formatDate(ts: Timestamp): string {
  const d = new Date(ts.toMillis());
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

interface Props {
  post: Post;
  isOwner: boolean;
}

// 모바일용 접이식 목차 (xl 미만에서만 표시)
function MobileToc({ content }: { content: string }) {
  const [open, setOpen] = useState(false);
  const items = parseHeadingsFromHtml(content);
  if (items.length === 0) return null;

  const INDENT: Record<1 | 2 | 3, string> = { 1: 'pl-0', 2: 'pl-3', 3: 'pl-6' };

  return (
    <div className="mb-5 xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#F8F7F4] border border-[#E5E7EB] rounded-[10px] text-[13px] font-semibold text-[#111111]"
      >
        <span>📋 목차</span>
        <span className="text-[#9CA3AF] text-[11px]">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-4 py-3 bg-white border border-t-0 border-[#E5E7EB] rounded-b-[10px] space-y-1.5">
          {items.map((item) => (
            <div key={item.id} className={INDENT[item.level]}>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById(item.id);
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                  setOpen(false);
                }}
                className="w-full text-left text-[12px] text-[#6C3FC5] hover:underline leading-relaxed"
              >
                {item.text}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PostBody({ post, isOwner }: Props) {
  const processedContent = injectHeadingIds(post.content);

  const preventHandlers = isOwner
    ? {}
    : {
        onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
        onCopy: (e: React.ClipboardEvent) => e.preventDefault(),
        onCut: (e: React.ClipboardEvent) => e.preventDefault(),
        onDragStart: (e: React.DragEvent) => e.preventDefault(),
        onKeyDown: (e: React.KeyboardEvent) => {
          const ctrl = e.ctrlKey || e.metaKey;
          if (ctrl && ['c', 'C', 'a', 'A', 'v', 'V', 'x', 'X'].includes(e.key)) {
            e.preventDefault();
          }
        },
      };

  return (
    <article>
      {/* 모바일 접이식 목차 (xl 미만) */}
      <MobileToc content={post.content} />

      {/* 카테고리 배지 */}
      <div className="mb-5">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold bg-[#F3EEFF] text-[#6C3FC5]">
          {post.category}
        </span>
      </div>

      {/* 제목 */}
      <h1 className="text-[22px] font-black text-[#111111] leading-[1.4] mb-5">
        {post.title}
      </h1>

      {/* 작성자 정보 */}
      <div className="flex items-center justify-between pt-5 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-[13px] font-bold shrink-0">
            {post.nickname[0]}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#111111]">{post.nickname}</p>
            <p className="text-[12px] text-[#9CA3AF]">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[12px] text-[#9CA3AF]">
          <span>조회 {post.views.toLocaleString()}</span>
          {post.commentCount > 0 && <span>댓글 {post.commentCount}</span>}
        </div>
      </div>

      {/* 본문 — 헤딩에 id 자동 주입 후 렌더링 */}
      <div
        className="mt-6 text-[15px] text-[#4B5563] leading-[1.9] min-h-[120px] post-content"
        dangerouslySetInnerHTML={{ __html: processedContent }}
        {...preventHandlers}
        style={isOwner ? {} : { userSelect: 'none', WebkitUserSelect: 'none' }}
      />

      {/* 해시태그 */}
      {post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-7 pt-6 border-t border-[#E5E7EB]">
          {post.hashtags.map((tag) => (
            <Link
              key={tag}
              href={`/search?tag=${encodeURIComponent(tag)}`}
              className="text-[12px] text-[#6C3FC5] bg-[#F3EEFF] px-3 py-1 rounded-full cursor-pointer hover:bg-[#E8D9FF] transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
