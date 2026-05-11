'use client';

import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import Modal from '@/components/ui/Modal';
import { useAdminPosts } from '../hooks/useAdminPosts';
import { Post, Category, PostStatus } from '@/lib/types';

const ALL_CATEGORIES: (Category | undefined)[] = [
  undefined, '게임', '의료정보', '인테리어DIY', '비즈니스', '코인/투자', '마케팅', '공지사항',
];

const CAT_LABELS: Record<string, string> = {
  '게임': '게임', '의료정보': '의료정보', '인테리어DIY': '인테리어', '비즈니스': '비즈니스',
  '코인/투자': '코인', '마케팅': '마케팅', '공지사항': '공지',
};

const STATUSES: { value: PostStatus; label: string }[] = [
  { value: 'approved', label: '승인됨' },
  { value: 'pending',  label: '대기' },
  { value: 'rejected', label: '반려' },
  { value: 'deleted',  label: '삭제' },
];

function formatDate(ts: Timestamp | undefined): string {
  if (!ts) return '-';
  const d = new Date(ts.toMillis());
  return `${d.getMonth() + 1}.${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

interface EditForm {
  title: string;
  category: Category;
  status: PostStatus;
}

export default function AdminPostsTab({ active }: { active: boolean }) {
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
  const { posts, loading, editTarget, setEditTarget, handleUpdate, handleDelete } =
    useAdminPosts(active, selectedCategory);
  const [form, setForm] = useState<EditForm>({ title: '', category: '게임', status: 'approved' });

  const openEdit = (post: Post) => {
    setEditTarget(post);
    setForm({ title: post.title, category: post.category, status: post.status });
  };

  const onSave = () => {
    if (!editTarget) return;
    handleUpdate(editTarget.id, { title: form.title, category: form.category, status: form.status });
  };

  return (
    <>
      <h1 className="text-[20px] font-bold text-[#111111] mb-4">게시글 관리</h1>

      {/* 카테고리 필터 탭 */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {ALL_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat ?? 'all'}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-[6px] transition-colors ${
                isActive
                  ? 'bg-[#6C3FC5] text-white'
                  : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
              }`}
            >
              {cat ? (CAT_LABELS[cat] ?? cat) : '전체'}
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-[#6C3FC5] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-[13px] text-[#9CA3AF] py-10 text-center">게시글이 없습니다.</p>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#9CA3AF] text-left">
                <th className="pb-2 pr-3 font-medium">제목</th>
                <th className="pb-2 pr-3 font-medium w-[100px]">카테고리</th>
                <th className="pb-2 pr-3 font-medium w-[80px]">작성자</th>
                <th className="pb-2 pr-3 font-medium w-[90px]">날짜</th>
                <th className="pb-2 pr-3 font-medium w-[50px] text-center">조회</th>
                <th className="pb-2 font-medium w-[110px] text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F9FAFB]">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="py-2.5 pr-3 text-[#111111] max-w-[200px]">
                    <span className="block truncate">{post.title}</span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="px-2 py-0.5 bg-[#F3EEFF] text-[#6C3FC5] rounded-full text-[11px]">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-[#6B7280]">{post.nickname}</td>
                  <td className="py-2.5 pr-3 text-[#9CA3AF] text-[12px]">{formatDate(post.createdAt)}</td>
                  <td className="py-2.5 pr-3 text-[#9CA3AF] text-center">{(post.views ?? 0).toLocaleString()}</td>
                  <td className="py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => openEdit(post)}
                        className="px-2.5 py-1 text-[12px] bg-[#6C3FC5] text-white rounded-[6px] hover:bg-[#5a33a8] transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="px-2.5 py-1 text-[12px] bg-red-500 text-white rounded-[6px] hover:bg-red-600 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="게시글 수정"
        size="md"
        footer={
          <>
            <button
              onClick={() => setEditTarget(null)}
              className="px-4 py-2 text-[13px] border border-[#E5E7EB] rounded-[8px] text-[#6B7280] hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 text-[13px] bg-[#6C3FC5] text-white rounded-[8px] hover:bg-[#5a33a8] transition-colors"
            >
              저장
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[12px] font-medium text-[#6B7280] mb-1.5">제목</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full h-9 px-3 border border-[#E5E7EB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#6C3FC5]"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#6B7280] mb-1.5">카테고리</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
              className="w-full h-9 px-3 border border-[#E5E7EB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#6C3FC5]"
            >
              {ALL_CATEGORIES.filter(Boolean).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#6B7280] mb-1.5">상태</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as PostStatus }))}
              className="w-full h-9 px-3 border border-[#E5E7EB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#6C3FC5]"
            >
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
}
