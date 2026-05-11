'use client';

import { useRef, useState, useCallback } from 'react';
import { useBlocks } from './useBlocks';
import { uploadImage } from '@/lib/services/storageService';
import { slugify } from '@/lib/utils/headingIds';
import { TocItem } from '@/lib/types';

export type { EditorBlock } from '../types';

export interface WriteEditorAPI {
  blocks: ReturnType<typeof useBlocks>['blocks'];
  updateBlock: ReturnType<typeof useBlocks>['updateBlock'];
  addBlockAfter: ReturnType<typeof useBlocks>['addBlockAfter'];
  removeBlock: ReturnType<typeof useBlocks>['removeBlock'];
  registerRef: ReturnType<typeof useBlocks>['registerRef'];
  serializeToHTML: () => string;
  getTextContent: () => string;
  resetBlocks: (html: string) => void;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  editorContainerRef: React.RefObject<HTMLDivElement | null>;
  onImageFiles: (files: File[]) => void;
  handleImageBlockUpload: (blockId: string, file: File) => void;
  saveSelection: () => void;
  restoreSelection: () => void;
  applyFontSize: (px: number) => void;
  applyFontFamily: (family: string) => void;
  applyFontColor: (color: string) => void;
  applyFontBgColor: (color: string) => void;
  triggerImageInsert: () => void;
  charCount: { total: number; noSpace: number };
  updateCharCount: () => void;
  spellCheckEnabled: boolean;
  toggleSpellCheck: () => void;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  escapeBlock: (blockId: string) => void;
  focusBlock: (id: string) => void;
  // ── 블록 서식 ──
  execHeading2: () => void;
  execHeading3: () => void;
  execBlockquote: () => void;
  execDivider: () => void;
  // ── 목차 ──
  extractTocItems: () => TocItem[];
  addManualTocFromSelection: () => TocItem | null;
  extractH2Items: () => { id: string; text: string }[];
  // ── 블록 이동 ──
  moveBlockByIndex: (fromIdx: number, toIdx: number) => void;
  // ── 이미지 2열 업로드 ──
  handleImageBlock2Upload: (blockId: string, file: File) => void;
  // ── 이미지 블록 합치기 ──
  mergeImageBlocks: (id1: string, id2: string) => void;
  // ── 컬럼/스텝 업로드 ──
  handleColumnsBlockUpload: (blockId: string, cellId: string, file: File) => void;
  handleStepsBlockUpload: (blockId: string, stepId: string, slot: 1 | 2, file: File) => void;
}

export function useWriteEditor(
  onImageUploading: (v: boolean) => void,
  onTocUpdate?: (items: { id: string; text: string }[]) => void,
): WriteEditorAPI {
  const blocksAPI = useBlocks();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const savedRange = useRef<Range | null>(null);
  const [charCount, setCharCount] = useState({ total: 0, noSpace: 0 });
  const [spellCheckEnabled, setSpellCheckEnabled] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel?.rangeCount) savedRange.current = sel.getRangeAt(0).cloneRange();
  }, []);

  const restoreSelection = useCallback(() => {
    if (!savedRange.current) return;
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(savedRange.current);
  }, []);

  const applyFontSize = useCallback((px: number) => {
    restoreSelection();
    document.execCommand('styleWithCSS', false, 'false');
    document.execCommand('fontSize', false, '7');
    document.querySelectorAll('font[size="7"]').forEach((el) => {
      const span = document.createElement('span');
      span.style.fontSize = `${px}px`;
      span.innerHTML = (el as HTMLElement).innerHTML;
      el.parentNode?.replaceChild(span, el);
    });
  }, [restoreSelection]);

  const applyFontFamily = useCallback((family: string) => {
    restoreSelection();
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand('fontName', false, family);
  }, [restoreSelection]);

  const applyFontColor = useCallback((color: string) => {
    restoreSelection();
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand('foreColor', false, color);
  }, [restoreSelection]);

  const applyFontBgColor = useCallback((color: string) => {
    restoreSelection();
    document.execCommand('styleWithCSS', false, 'true');
    const ok = document.execCommand('hiliteColor', false, color);
    if (!ok) document.execCommand('backColor', false, color);
  }, [restoreSelection]);

  const triggerImageInsert = useCallback(() => { imageInputRef.current?.click(); }, []);

  const onImageFiles = useCallback(async (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith('image/'));
    if (!images.length) return;
    onImageUploading(true);
    try {
      for (const file of images) {
        const url = await uploadImage(file, 'content');
        const lastId = blocksAPI.blocks[blocksAPI.blocks.length - 1]?.id;
        if (lastId) {
          const newId = blocksAPI.addBlockAfter(lastId, 'image');
          blocksAPI.updateBlock(newId, { url });
        }
      }
    } catch { /* ignore */ }
    finally { onImageUploading(false); }
  }, [blocksAPI, onImageUploading]);

  const handleImageBlockUpload = useCallback(async (blockId: string, file: File) => {
    onImageUploading(true);
    try {
      const url = await uploadImage(file, 'content');
      blocksAPI.updateBlock(blockId, { url });
    } catch { /* ignore */ }
    finally { onImageUploading(false); }
  }, [blocksAPI, onImageUploading]);

  const handleImageBlock2Upload = useCallback(async (blockId: string, file: File) => {
    onImageUploading(true);
    try {
      const url2 = await uploadImage(file, 'content');
      blocksAPI.updateBlock(blockId, { url2 });
    } catch { /* ignore */ }
    finally { onImageUploading(false); }
  }, [blocksAPI, onImageUploading]);

  const handleColumnsBlockUpload = useCallback(async (blockId: string, cellId: string, file: File) => {
    onImageUploading(true);
    try {
      const url = await uploadImage(file, 'content');
      const block = blocksAPI.blocks.find((b) => b.id === blockId);
      if (block?.type === 'columns') {
        const cells = block.cells.map((c) => c.id === cellId ? { ...c, imageUrl: url } : c);
        blocksAPI.updateBlock(blockId, { cells } as Partial<typeof block>);
      }
    } catch { /* ignore */ }
    finally { onImageUploading(false); }
  }, [blocksAPI, onImageUploading]);

  const handleStepsBlockUpload = useCallback(async (blockId: string, stepId: string, slot: 1 | 2, file: File) => {
    onImageUploading(true);
    try {
      const url = await uploadImage(file, 'content');
      const block = blocksAPI.blocks.find((b) => b.id === blockId);
      if (block?.type === 'steps') {
        const items = block.items.map((s) => {
          if (s.id !== stepId) return s;
          return slot === 1 ? { ...s, imageUrl: url } : { ...s, imageUrl2: url };
        });
        blocksAPI.updateBlock(blockId, { items } as Partial<typeof block>);
      }
    } catch { /* ignore */ }
    finally { onImageUploading(false); }
  }, [blocksAPI, onImageUploading]);

  const updateCharCount = useCallback(() => {
    const text = blocksAPI.getTextContent();
    setCharCount({ total: text.length, noSpace: text.replace(/\s/g, '').length });
  }, [blocksAPI]);

  const toggleSpellCheck = useCallback(() => setSpellCheckEnabled((v) => !v), []);
  const toggleFocusMode = useCallback(() => setIsFocusMode((v) => !v), []);

  // ── 블록 서식 ──────────────────────────────────────────────────────────────

  const extractH2Items = useCallback((): { id: string; text: string }[] => {
    const items: { id: string; text: string }[] = [];
    editorContainerRef.current?.querySelectorAll('h2').forEach((el, i) => {
      const htmlEl = el as HTMLElement;
      if (!htmlEl.id) htmlEl.id = 'h2-' + i + '-' + Date.now();
      const text = el.textContent?.trim();
      if (text) items.push({ id: htmlEl.id, text });
    });
    return items;
  }, []);

  const execHeading2 = useCallback(() => {
    document.execCommand('formatBlock', false, 'h2');
    setTimeout(() => {
      editorContainerRef.current?.querySelectorAll('h2').forEach((el, i) => {
        const htmlEl = el as HTMLElement;
        if (!htmlEl.id) htmlEl.id = 'h2-' + i + '-' + Date.now();
      });
      onTocUpdate?.(extractH2Items());
    }, 0);
  }, [extractH2Items, onTocUpdate]);

  const execHeading3 = useCallback(() => {
    document.execCommand('formatBlock', false, 'h3');
  }, []);

  const execBlockquote = useCallback(() => {
    document.execCommand('formatBlock', false, 'blockquote');
  }, []);

  const execDivider = useCallback(() => {
    document.execCommand('insertHTML', false, '<hr style="border:none;border-top:2px solid #E5E7EB;margin:20px 0"><p><br></p>');
  }, []);

  // ── 목차 추출 (blocks 상태에서 h2/h3 파싱) ─────────────────────────────────

  const extractTocItems = useCallback((): TocItem[] => {
    const counter: Record<string, number> = {};
    const items: TocItem[] = [];
    for (const block of blocksAPI.blocks) {
      if (block.type !== 'text') continue;
      const re = /<(h[23])[^>]*>([\s\S]*?)<\/\1>/gi;
      let m: RegExpExecArray | null;
      while ((m = re.exec((block as { html: string }).html)) !== null) {
        const tag = m[1].toLowerCase() as 'h2' | 'h3';
        const text = m[2].replace(/<[^>]+>/g, '').trim();
        if (!text) continue;
        const base = 'heading-' + slugify(text);
        counter[base] = (counter[base] ?? 0) + 1;
        const id = counter[base] > 1 ? `${base}-${counter[base]}` : base;
        items.push({ id, text, type: tag, level: tag === 'h2' ? 1 : 2 });
      }
    }
    return items;
  }, [blocksAPI.blocks]);

  // ── 드래그 선택 텍스트 → 수동 목차 ────────────────────────────────────────

  const addManualTocFromSelection = useCallback((): TocItem | null => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return null;
    const text = sel.toString().trim().slice(0, 50);
    if (!text) return null;
    return {
      id: `toc-manual-${Date.now()}`,
      text,
      type: 'manual',
      level: 1,
    };
  }, []);

  return {
    blocks: blocksAPI.blocks,
    updateBlock: blocksAPI.updateBlock,
    addBlockAfter: blocksAPI.addBlockAfter,
    removeBlock: blocksAPI.removeBlock,
    registerRef: blocksAPI.registerRef,
    serializeToHTML: blocksAPI.serializeToHTML,
    getTextContent: blocksAPI.getTextContent,
    resetBlocks: blocksAPI.resetBlocks,
    imageInputRef,
    editorContainerRef,
    onImageFiles,
    handleImageBlockUpload,
    saveSelection,
    restoreSelection,
    applyFontSize,
    applyFontFamily,
    applyFontColor,
    applyFontBgColor,
    triggerImageInsert,
    charCount,
    updateCharCount,
    spellCheckEnabled,
    toggleSpellCheck,
    isFocusMode,
    toggleFocusMode,
    escapeBlock: blocksAPI.escapeBlock,
    focusBlock: blocksAPI.focusBlock,
    execHeading2,
    execHeading3,
    execBlockquote,
    execDivider,
    extractTocItems,
    addManualTocFromSelection,
    extractH2Items,
    moveBlockByIndex: blocksAPI.moveBlockByIndex,
    handleImageBlock2Upload,
    mergeImageBlocks: blocksAPI.mergeImageBlocks,
    handleColumnsBlockUpload,
    handleStepsBlockUpload,
  };
}
