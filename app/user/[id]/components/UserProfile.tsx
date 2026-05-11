'use client';

import Link from 'next/link';
import { Timestamp } from 'firebase/firestore';
import { useUserProfile } from '../hooks/useUserProfile';
import { PageLoading } from '@/components/ui/Loading';
import { Category } from '@/lib/types';

const LEVEL_LABELS: Record<number, string> = {
  1: '일반회원', 2: '활동회원', 3: '우수회원', 4: '운영회원', 5: '관리자',
};

const CATEGORY_EMOJI: Record<Category, string> = {
  '게임': '🎮', '의료정보': '🏥', '인테리어DIY': '🛠️',
  '비즈니스': '💼', '코인/투자': '💰', '마케팅': '📢', '공지사항': '📣',
};

function formatDate(ts: Timestamp): string {
  const d = ts?.toDate?.() ?? new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function UserProfile({ userId }: { userId: string }) {
  const { profileUser, posts, loading, notFound } = useUserProfile(userId);

  if (loading) return <PageLoading />;

  if (notFound || !profileUser) {
    return (
      <div className="max-w-[860px] mx-auto px-4 py-20 text-center">
        <p className="text-[15px] text-[#6B7280]">존재하지 않는 사용자입니다.</p>
        <Link href="/" className="inline-block mt-4 text-[13px] text-[#6C3FC5] hover:underline">홈으로</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[860px] mx-auto px-4 py-8 flex flex-col gap-5">
      {/* 히어로 배너 */}
      <div
        className="rounded-[20px] px-8 py-10 text-white"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #6C3FC5 100%)' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-5">
            {/* 아바타 */}
            <div
              className="w-[80px] h-[80px] rounded-full flex items-center justify-center text-white text-[32px] font-black shrink-0 border-[3px]"
              style={{ borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.15)' }}
            >
              {profileUser.nickname[0]}
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <div>
                <p className="text-[20px] font-black">{profileUser.nickname}</p>
                <p className="text-[13px] mt-0.5" style={{ opacity: 0.7 }}>@{profileUser.userId}</p>
              </div>
              <span
                className="self-start px-3 py-1 rounded-full text-[12px] font-medium"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                ⭐ 레벨{profileUser.level} {LEVEL_LABELS[profileUser.level]}
              </span>
              {profileUser.interests.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {profileUser.interests.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 rounded-full text-[11px]"
                      style={{ background: 'rgba(255,255,255,0.15)' }}
                    >
                      {CATEGORY_EMOJI[cat] ?? ''} {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 팔로우 버튼 */}
          <button className="shrink-0 px-5 py-2 bg-white text-[#6C3FC5] text-[13px] font-bold rounded-[10px] hover:bg-[#F3EEFF] transition-colors">
            + 팔로우
          </button>
        </div>

        {/* 통계 */}
        <div className="flex gap-8 mt-8 pt-5 border-t border-white/20">
          {[
            { label: '게시글', value: profileUser.postCount ?? 0 },
            { label: '팔로워', value: profileUser.followerCount ?? 0 },
            { label: '팔로잉', value: profileUser.followingCount ?? 0 },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[22px] font-black">{value.toLocaleString()}</p>
              <p className="text-[12px] mt-0.5" style={{ opacity: 0.8 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 최근 게시글 */}
      <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-bold text-[#111111]">최근 게시글</h2>
          <span className="text-[13px] text-[#6C3FC5] hover:underline cursor-pointer">전체보기 →</span>
        </div>

        {posts.length === 0 ? (
          <p className="text-[13px] text-[#9CA3AF] text-center py-8">작성한 게시글이 없습니다.</p>
        ) : (
          <div className="flex flex-col divide-y divide-[#F9FAFB]">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="py-4 first:pt-0 last:pb-0 hover:bg-[#FAFAFA] -mx-2 px-2 rounded-[8px] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-[8px] bg-[#F3F4F6] flex items-center justify-center text-[16px] shrink-0">
                    {CATEGORY_EMOJI[post.category] ?? '📄'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-[#F3EEFF] text-[#6C3FC5] text-[11px] rounded-full font-medium">{post.category}</span>
                    </div>
                    <p className="text-[14px] font-semibold text-[#111111] truncate">{post.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-[#9CA3AF]">
                      <span>조회 {post.views.toLocaleString()}</span>
                      <span>❤️ {post.likeCount}</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
