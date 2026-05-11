'use client';

import Link from 'next/link';
import { useMyPosts } from '../hooks/useMyPosts';

const STATUS_LABEL: Record<string, string> = {
  approved: '승인',
  pending: '검토중',
  rejected: '거부',
  deleted: '삭제',
};

const STATUS_CLASS: Record<string, string> = {
  approved: 'bg-[#D1FAE5] text-[#065F46]',
  pending: 'bg-[#FEF3C7] text-[#92400E]',
  rejected: 'bg-[#FEE2E2] text-[#991B1B]',
  deleted: 'bg-[#F3F4F6] text-[#6B7280]',
};

export default function MyPostsList({ userId }: { userId: string }) {
  const { posts, loading, selected, toggle, toggleAll, downloading, downloadPDF, handleEdit, handleDelete } =
    useMyPosts(userId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-[#111111]">내가 쓴 글</h2>
        <button
          onClick={downloadPDF}
          disabled={selected.size === 0 || downloading}
          className="flex items-center gap-2 px-4 py-2 bg-[#6C3FC5] text-white text-[13px] font-bold rounded-[8px] hover:bg-[#5a33a8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {downloading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
          ) : (
            <span>📄</span>
          )}
          PDF 다운로드{selected.size > 0 && ` (${selected.size}개)`}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-5 h-5 border-2 border-[#6C3FC5] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 text-center py-16">
          <p className="text-[#6B7280] text-[15px] mb-1">📝 작성한 글이 없습니다.</p>
          <p className="text-[13px] text-[#9CA3AF]">첫 번째 글을 작성해보세요!</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-[12px] overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 border-b border-[#E5E7EB] bg-[#FAFAFA]">
            <input
              type="checkbox"
              checked={selected.size === posts.length}
              onChange={toggleAll}
              className="w-4 h-4 accent-[#6C3FC5] cursor-pointer"
            />
            <span className="text-[12px] text-[#6B7280]">
              {selected.size > 0 ? `${selected.size}개 선택됨` : `전체 선택 (${posts.length}개)`}
            </span>
          </div>

          {posts.map((post) => {
            const dateStr = post.createdAt?.toDate?.()?.toLocaleDateString('ko-KR') ?? '';
            const isSelected = selected.has(post.id);
            return (
              <div
                key={post.id}
                className={`flex items-center gap-3 px-5 py-4 border-b border-[#F9FAFB] last:border-0 transition-colors ${
                  isSelected ? 'bg-[#F3EEFF]' : 'hover:bg-[#FAFAFA]'
                }`}
                onClick={() => toggle(post.id)}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(post.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 accent-[#6C3FC5] shrink-0 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/posts/${post.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[14px] font-medium text-[#111111] hover:text-[#6C3FC5] transition-colors truncate block"
                  >
                    {post.title}
                  </Link>
                  <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                    {post.category} · {dateStr} · 조회 {post.views.toLocaleString()} · 좋아요 {post.likeCount}
                  </p>
                </div>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 font-medium ${
                    STATUS_CLASS[post.status] ?? STATUS_CLASS.pending
                  }`}
                >
                  {STATUS_LABEL[post.status] ?? post.status}
                </span>
                <div className="flex items-center gap-1.5 shrink-0 ml-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleEdit(post.id)}
                    className="px-2.5 py-1 text-[11px] bg-white border border-[#E5E7EB] text-[#6B7280] rounded-[6px] hover:border-[#6C3FC5] hover:text-[#6C3FC5] transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-2.5 py-1 text-[11px] bg-white border border-[#E5E7EB] text-[#EF4444] rounded-[6px] hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected.size > 0 && (
        <p className="text-[12px] text-[#6B7280] text-center">
          {selected.size}개 선택됨 · PDF 다운로드 버튼을 눌러 저장하세요
        </p>
      )}
    </div>
  );
}
