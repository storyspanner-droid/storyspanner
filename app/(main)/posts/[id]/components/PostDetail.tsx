'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePostDetail } from '../hooks/usePostDetail';
import { useComments } from '../hooks/useComments';
import { PageLoading } from '@/components/ui/Loading';
import PostBody from './PostBody';
import PostActions from './PostActions';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import TableOfContents from './TableOfContents';

export default function PostDetail({ postId }: { postId: string }) {
  const router = useRouter();
  const { post, loading, notFound, handleDelete } = usePostDetail(postId);
  const {
    comments, loading: commentsLoading, submitting,
    replyTo, setReplyTo, submitComment, removeComment,
  } = useComments(postId);
  const { user } = useAuth();

  if (loading) return <PageLoading />;

  if (notFound || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-[#6B7280] text-[15px]">존재하지 않는 게시글입니다.</p>
        <Link href="/" className="inline-block mt-4 text-[13px] text-[#111111] underline underline-offset-2">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === post.userId;
  const categoryHref = post.category === '코인/투자' ? '/코인투자' : `/${post.category}`;

  return (
    <div className="max-w-[1180px] mx-auto px-4 py-8 flex gap-6 items-start">
      {/* ── 본문 영역 ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">

        {/* 브레드크럼 */}
        <nav className="flex items-center gap-1.5 text-[12px]">
          <Link href="/" className="text-[#9CA3AF] hover:text-[#6C3FC5] transition-colors">홈</Link>
          <span className="text-[#E5E7EB]">›</span>
          <Link href={categoryHref} className="text-[#9CA3AF] hover:text-[#6C3FC5] transition-colors">{post.category}</Link>
          <span className="text-[#E5E7EB]">›</span>
          <span className="text-[#111111] truncate">{post.title}</span>
        </nav>

        {/* 게시글 헤더 + 본문 */}
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] px-7 py-8">
          <PostBody post={post} isOwner={isOwner} />
          {isOwner && (
            <div className="flex justify-end gap-2 mt-6 pt-5 border-t border-[#F3F4F6]">
              <button
                onClick={() => router.push(`/write?edit=${post.id}`)}
                className="px-4 py-2 text-[13px] border border-[#E5E7EB] text-[#6B7280] rounded-[8px] hover:bg-gray-50 transition-colors"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-[13px] bg-[#EF4444] text-white rounded-[8px] hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 리액션 바 */}
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] px-6 py-5">
          <PostActions post={post} />
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] px-6 py-6">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="text-[15px] font-bold text-[#111111]">댓글</h3>
            {!commentsLoading && comments.length > 0 && (
              <span className="text-[12px] text-white font-medium bg-[#6C3FC5] px-2 py-0.5 rounded-full">
                {comments.length}
              </span>
            )}
          </div>

          {user ? (
            <div className="pb-5 border-b border-[#F9FAFB]">
              <CommentForm submitting={submitting} onSubmit={(content) => submitComment(content)} />
            </div>
          ) : (
            <div className="pb-5 border-b border-[#F9FAFB] text-center">
              <p className="text-[13px] text-[#9CA3AF] py-2">
                댓글을 작성하려면{' '}
                <Link href="/login" className="text-[#6C3FC5] font-medium hover:underline">
                  로그인
                </Link>
                이 필요합니다.
              </p>
            </div>
          )}

          {!commentsLoading && (
            <div className="mt-4">
              <CommentList
                comments={comments}
                replyTo={replyTo}
                submitting={submitting}
                currentUserId={user?.id}
                onReply={setReplyTo}
                onSubmit={submitComment}
                onDelete={removeComment}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── 목차 사이드바 (lg 이상에서만 표시) ── */}
      <aside className="w-[220px] shrink-0 sticky top-20 hidden lg:block">
        <TableOfContents content={post.content} />
      </aside>
    </div>
  );
}
