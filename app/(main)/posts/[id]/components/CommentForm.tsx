'use client';

import { useCommentForm } from '../hooks/useCommentForm';

interface Props {
  placeholder?: string;
  submitting: boolean;
  compact?: boolean;
  onSubmit: (content: string) => Promise<void>;
}

export default function CommentForm({
  placeholder = '댓글을 작성해주세요. 상대방을 존중하는 댓글 문화를 만들어요 😊',
  submitting,
  compact = false,
  onSubmit,
}: Props) {
  const { content, setContent, clear } = useCommentForm();

  async function handleSubmit() {
    if (!content.trim() || submitting) return;
    await onSubmit(content.trim());
    clear();
  }

  return (
    <div className="flex gap-2.5">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
        }}
        placeholder={placeholder}
        rows={compact ? 2 : 3}
        className="flex-1 text-[13px] border border-[#E5E7EB] rounded-[10px] px-3.5 py-2.5 resize-none focus:outline-none focus:border-[#6C3FC5] transition-colors placeholder-[#9CA3AF]"
      />
      <button
        onClick={handleSubmit}
        disabled={!content.trim() || submitting}
        className="px-5 py-2 bg-[#6C3FC5] text-white text-[13px] font-bold rounded-[10px] disabled:opacity-40 self-end whitespace-nowrap transition-opacity hover:bg-[#5a33a8]"
      >
        {submitting ? '…' : '댓글 등록'}
      </button>
    </div>
  );
}
