'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { createPost } from '@/lib/services/postService';
import { uploadImage } from '@/lib/services/storageService';
import { useWriteForm } from './useWriteForm';
import { useWriteValidate, WriteErrors } from './useWriteValidate';
import { useWriteEditor } from './useWriteEditor';
import { useAutoSave, WriteDraft } from './useAutoSave';
import { usePreviewPanel } from './usePreviewPanel';
import { useSplitView } from './useSplitView';
import { useDraftList } from './useDraftList';
import { Category } from '@/lib/types';

export function useWrite() {
  const { user } = useAuth();
  const { form, setField, setThumbnail, removeThumbnail, parseHashtags } = useWriteForm();
  const { validate, isValid } = useWriteValidate();
  const [errors, setErrors] = useState<WriteErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [thumbnailUploadedUrl, setThumbnailUploadedUrl] = useState('');
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [ytModalOpen, setYtModalOpen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const router = useRouter();

  const [tocItems, setTocItems] = useState<{ id: string; text: string }[]>([]);
  const handleTocUpdate = useCallback((items: { id: string; text: string }[]) => { setTocItems(items); }, []);

  const editor = useWriteEditor(setImageUploading, handleTocUpdate);
  const preview = usePreviewPanel();
  const splitView = useSplitView(editor.serializeToHTML);

  const onRestoreDraft = useCallback((draft: WriteDraft) => {
    setField('title', draft.title);
    if (draft.category) setField('category', draft.category as Category);
    setField('hashtags', draft.hashtags);
    if (draft.content) editor.resetBlocks(draft.content);
  }, [setField, editor]);

  const { savedAt: autoSavedAt, isSaving, latestDraft, restoreDraft, dismissDraft, clearCurrentDraft, getAllDrafts } =
    useAutoSave(
      () => ({ title: form.title, category: form.category, content: editor.serializeToHTML(), hashtags: form.hashtags }),
      onRestoreDraft,
    );

  const draftList = useDraftList(getAllDrafts);

  const handleThumbnailUpload = async (file: File) => {
    setThumbnail(file);
    setImageUploading(true);
    try { const url = await uploadImage(file, 'thumbnails'); setThumbnailUploadedUrl(url); }
    catch { /* ignore */ }
    finally { setImageUploading(false); }
  };

  const handleThumbnailRemove = () => { removeThumbnail(); setThumbnailUploadedUrl(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }
    const contentText = editor.getTextContent();
    const validationErrors = validate(form, contentText);
    setErrors(validationErrors);
    if (!isValid(validationErrors)) return;
    setShowAgreementModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!user) return;
    setShowAgreementModal(false);
    setLoading(true);
    setServerError('');
    try {
      let thumbnailUrl = thumbnailUploadedUrl;
      if (!thumbnailUrl && form.thumbnailFile) thumbnailUrl = await uploadImage(form.thumbnailFile, 'thumbnails');
      await createPost({
        title: form.title.trim(),
        content: editor.serializeToHTML(),
        category: form.category as Category,
        userId: user.id,
        nickname: user.nickname,
        hashtags: parseHashtags(),
        thumbnailUrl,
        tableOfContents: tocItems.map((item) => ({ id: item.id, text: item.text, type: 'h2' as const, level: 1 as const })),
      });
      clearCurrentDraft();
      router.push('/');
    } catch {
      setServerError('글 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const triggerAutoSave = useCallback(() => {
    editor.updateCharCount();
    splitView.scheduleUpdate();
    const h2Items = editor.extractH2Items();
    setTocItems(h2Items);
    // toc 타입 블록이 있으면 자동 동기화
    const tocBlockItems = h2Items.map((item) => ({ id: item.id, text: item.text, anchor: item.id }));
    editor.blocks
      .filter((b) => b.type === 'toc')
      .forEach((b) => editor.updateBlock(b.id, { items: tocBlockItems }));
  }, [editor, splitView]);

  return {
    form, setField, handleThumbnailUpload, handleThumbnailRemove,
    errors, loading, serverError, autoSavedAt, isSaving,
    latestDraft, restoreDraft, dismissDraft,
    imageUploading, editor, handleSubmit, handleConfirmSubmit,
    showAgreementModal, setShowAgreementModal,
    triggerAutoSave, user, preview, splitView, draftList,
    ytModalOpen, setYtModalOpen,
    linkModalOpen, setLinkModalOpen,
    codeModalOpen, setCodeModalOpen,
    tocItems,
  };
}
