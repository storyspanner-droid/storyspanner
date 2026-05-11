'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useWrite } from '../hooks/useWrite';
import { useFontLoader } from '../hooks/useFontLoader';
import WriteThumbnail from './WriteThumbnail';
import WriteEditor from './WriteEditor';
import AgreementModal from './AgreementModal';
import WriteCategoryPicker from './WriteCategoryPicker';
import WriteTips from './WriteTips';
import WritePreviewPanel from './WritePreviewPanel';
import RestoreToast from './RestoreToast';
import DraftListPanel from './DraftListPanel';
import YouTubeModal from '@/components/editor/modals/YouTubeModal';
import LinkModal from '@/components/editor/modals/LinkModal';
import CodeModal from '@/components/editor/modals/CodeModal';
import WriteTocPanel from './WriteTocPanel';
import HashtagInput from './HashtagInput';

export default function WriteForm() {
  const router = useRouter();
  useFontLoader();
  const {
    form, setField, handleThumbnailUpload, handleThumbnailRemove,
    errors, loading, serverError, autoSavedAt, isSaving,
    latestDraft, restoreDraft, dismissDraft,
    imageUploading, editor, handleSubmit, handleConfirmSubmit,
    showAgreementModal, setShowAgreementModal,
    triggerAutoSave, user, splitView, draftList,
    ytModalOpen, setYtModalOpen, linkModalOpen, setLinkModalOpen, codeModalOpen, setCodeModalOpen,
    tocItems,
  } = useWrite();

  const handleTocItemClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [ytInsertAfterId, setYtInsertAfterId] = useState<string | null>(null);

  const handleYouTubeInsert = (videoId: string) => {
    const afterId = ytInsertAfterId ?? editor.blocks[editor.blocks.length - 1]?.id;
    if (afterId) {
      const newId = editor.addBlockAfter(afterId, 'youtube');
      editor.updateBlock(newId, { videoId });
    }
    setYtInsertAfterId(null);
  };

  const handleLinkInsert = (text: string, url: string) => {
    const finalUrl = url.startsWith('http') ? url : `https://${url}`;
    editor.restoreSelection?.();
    document.execCommand('insertHTML', false, `<a href="${finalUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`);
  };

  const handleCodeInsert = (code: string, language: string) => {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const html = `<pre class="code-block" data-lang="${language}"><code>${escaped}</code></pre><p><br></p>`;
    const lastId = editor.blocks[editor.blocks.length - 1]?.id;
    if (lastId) {
      editor.updateBlock(lastId, { html: (editor.blocks.find((b) => b.id === lastId) as { html?: string })?.html ?? '' });
      document.execCommand('insertHTML', false, html);
    }
  };

  const previewData = {
    title: form.title,
    category: form.category,
    content: splitView.previewHtml,
    thumbnailUrl: form.thumbnailPreview ?? '',
    nickname: user?.nickname ?? '',
  };

  const editorArea = (
    <WriteEditor
      api={editor}
      hasError={!!errors.content}
      errorMsg={errors.content}
      imageUploading={imageUploading}
      isFocusMode={editor.isFocusMode}
      spellCheckEnabled={editor.spellCheckEnabled}
      isSplitView={splitView.isOpen}
      charCount={editor.charCount}
      onInput={triggerAutoSave}
      onYouTubeModal={(afterId) => { setYtInsertAfterId(afterId ?? null); setYtModalOpen(true); }}
      onLinkModal={() => { editor.saveSelection(); setLinkModalOpen(true); }}
      onCodeModal={() => setCodeModalOpen(true)}
      onFocusMode={editor.toggleFocusMode}
      onSpellCheck={editor.toggleSpellCheck}
      onSplitView={splitView.toggle}
      onDraftList={draftList.open}
    />
  );

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-9 flex gap-6 items-start">
      {/* ── 메인 폼 영역 ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-black text-[#111111]">✏️ 새 글 작성</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-1">작성하신 글은 관리자 승인 후 게시됩니다.</p>
        </div>
        <div className="flex items-center gap-2 mt-1 h-6">
          {isSaving && <span className="text-[12px] text-[#9CA3AF]">저장 중...</span>}
          {!isSaving && autoSavedAt && (
            <span className="text-[12px] text-[#16A34A]">자동 저장됨 {autoSavedAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="bg-white border border-[#E5E7EB] rounded-[16px] px-7 py-7 flex flex-col gap-5">
          <WriteCategoryPicker value={form.category} onChange={(cat) => setField('category', cat)} error={errors.category} userLevel={user?.level} />

          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <label className="block text-[12px] font-medium text-[#6B7280] mb-2">제목 *</label>
              <input type="text" value={form.title}
                onChange={(e) => { setField('title', e.target.value); triggerAutoSave(); }}
                placeholder="제목을 입력하세요 (5~100자)" maxLength={100}
                className={`w-full px-3.5 py-3.5 border rounded-[10px] text-[14px] placeholder-[#9CA3AF] focus:outline-none transition-colors ${errors.title ? 'border-[#EF4444] bg-[#FFF5F5]' : 'border-[#E5E7EB] focus:border-[#6C3FC5]'}`}
              />
              <div className="flex justify-between mt-1">
                {errors.title ? <p className="text-[#EF4444] text-xs">{errors.title}</p> : <span />}
                <span className="text-[11px] text-[#9CA3AF]">{form.title.length}/100</span>
              </div>
            </div>
            <WriteThumbnail preview={form.thumbnailPreview} onUpload={handleThumbnailUpload} onRemove={handleThumbnailRemove} />
          </div>

          {editorArea}

          <div>
            <label className="block text-[12px] font-medium text-[#6B7280] mb-2">태그 (선택)</label>
            <HashtagInput value={form.hashtags} onChange={(v) => setField('hashtags', v)} />
          </div>
        </div>

        <WriteTips />
        {serverError && <p className="text-[#EF4444] text-[13px] text-center">{serverError}</p>}

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button type="button" onClick={draftList.open} className="h-[46px] px-5 bg-white border border-[#E5E7EB] rounded-[10px] text-[13px] font-medium text-[#6B7280] hover:bg-gray-50 transition-colors">임시저장 목록</button>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => router.back()} className="h-[46px] px-5 bg-white border border-[#E5E7EB] rounded-[10px] text-[13px] font-medium text-[#6B7280] hover:bg-gray-50 transition-colors">취소</button>
            <button type="submit" disabled={loading} className="h-[46px] px-7 bg-[#6C3FC5] text-white font-bold text-[14px] rounded-[10px] hover:bg-[#5a33a8] disabled:opacity-50 transition-colors">
              {loading ? '등록 중...' : '게시글 제출'}
            </button>
          </div>
        </div>
      </form>

      <WritePreviewPanel isOpen={splitView.isOpen} onClose={splitView.toggle} data={previewData} />
      <AgreementModal isOpen={showAgreementModal} onClose={() => setShowAgreementModal(false)} onConfirm={handleConfirmSubmit} />
      <DraftListPanel isOpen={draftList.isOpen} drafts={draftList.drafts} onClose={draftList.close}
        onRestore={(d) => { onRestoreDraftForm(d); draftList.close(); }}
        onDelete={draftList.deleteDraft}
        hasContent={editor.blocks.some((b) => b.type === 'text' && (b as { html: string }).html.length > 0)}
      />
      <YouTubeModal isOpen={ytModalOpen} onClose={() => setYtModalOpen(false)} onInsert={handleYouTubeInsert} />
      <LinkModal isOpen={linkModalOpen} onClose={() => setLinkModalOpen(false)} onInsert={handleLinkInsert}
        selectedText={typeof window !== 'undefined' ? window.getSelection()?.toString() ?? '' : ''}
      />
      <CodeModal isOpen={codeModalOpen} onClose={() => setCodeModalOpen(false)} onInsert={handleCodeInsert} />
      {latestDraft && <RestoreToast onRestore={restoreDraft} onDismiss={dismissDraft} savedAt={latestDraft.savedAt} />}
      </div>{/* end main form */}

      {/* ── 목차 사이드바 ── */}
      <aside className="w-[240px] shrink-0 sticky top-20 hidden lg:block">
        <WriteTocPanel items={tocItems} onItemClick={handleTocItemClick} />
      </aside>
    </div>
  );

  function onRestoreDraftForm(draft: import('../hooks/useAutoSave').WriteDraft) {
    setField('title', draft.title);
    if (draft.category) setField('category', draft.category as import('@/lib/types').Category);
    setField('hashtags', draft.hashtags);
    if (draft.content) editor.resetBlocks(draft.content);
  }
}
