'use client';

import { Timestamp } from 'firebase/firestore';
import { useAdminUsers } from '../hooks/useAdminUsers';

function formatDate(ts: Timestamp | undefined): string {
  if (!ts) return '-';
  const d = new Date(ts.toMillis());
  const yy = String(d.getFullYear() % 100).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}년 ${mm}월 ${dd}일`;
}

const STATUS_LABEL: Record<string, string> = {
  active: '정상', suspended: '정지', dormant: '휴면', withdrawn: '탈퇴',
};

const STATUS_CLASS: Record<string, string> = {
  active: 'bg-[#D1FAE5] text-[#065F46]',
  suspended: 'bg-[#FEE2E2] text-[#991B1B]',
  dormant: 'bg-[#FEF3C7] text-[#92400E]',
  withdrawn: 'bg-[#F3F4F6] text-[#6B7280]',
};

export default function AdminUsersTab({ active }: { active: boolean }) {
  const { users, loading, page, setPage, total, totalPages } = useAdminUsers(active);

  return (
    <>
      <h1 className="text-[20px] font-bold text-[#111111] mb-6">회원 관리</h1>
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
        <p className="text-[13px] text-[#6B7280] mb-4">전체 {total.toLocaleString()}명</p>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-[#6C3FC5] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-[13px] text-[#9CA3AF] py-10 text-center">회원이 없습니다.</p>
        ) : (
          <>
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[#9CA3AF] text-left">
                  <th className="pb-2 pr-3 font-medium">닉네임</th>
                  <th className="pb-2 pr-3 font-medium">이메일</th>
                  <th className="pb-2 pr-3 font-medium w-[70px] text-center">레벨</th>
                  <th className="pb-2 pr-3 font-medium w-[60px] text-center">게시글</th>
                  <th className="pb-2 pr-3 font-medium w-[100px]">가입일</th>
                  <th className="pb-2 font-medium w-[60px] text-center">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F9FAFB]">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-2.5 pr-3">
                      <p className="font-medium text-[#111111]">{user.nickname}</p>
                      <p className="text-[11px] text-[#9CA3AF]">@{user.userId}</p>
                    </td>
                    <td className="py-2.5 pr-3 text-[#6B7280] text-[12px]">{user.email}</td>
                    <td className="py-2.5 pr-3 text-center">
                      <span className="text-[11px] px-2 py-0.5 bg-[#F3EEFF] text-[#6C3FC5] rounded-full">
                        Lv.{user.level}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-[#9CA3AF] text-center">{user.postCount}</td>
                    <td className="py-2.5 pr-3 text-[#9CA3AF] text-[12px]">{formatDate(user.createdAt)}</td>
                    <td className="py-2.5 text-center">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_CLASS[user.status] ?? STATUS_CLASS.active}`}>
                        {STATUS_LABEL[user.status] ?? user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-5 pt-4 border-t border-[#F3F4F6]">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 text-[12px] border border-[#E5E7EB] rounded-[6px] text-[#6B7280] disabled:opacity-40 hover:bg-gray-50"
                >
                  이전
                </button>
                <span className="text-[12px] text-[#6B7280]">
                  {page + 1} / {totalPages} 페이지 ({total}명)
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 text-[12px] border border-[#E5E7EB] rounded-[6px] text-[#6B7280] disabled:opacity-40 hover:bg-gray-50"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
