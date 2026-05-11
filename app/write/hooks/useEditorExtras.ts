'use client';

import { useState, useCallback, RefObject } from 'react';

export function useEditorExtras(editorRef: RefObject<HTMLDivElement | null>) {
  const [charCount, setCharCount] = useState({ total: 0, noSpace: 0 });
  const [spellCheckEnabled, setSpellCheckEnabled] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const updateCharCount = useCallback(() => {
    const text = editorRef.current?.textContent ?? '';
    setCharCount({ total: text.length, noSpace: text.replace(/\s/g, '').length });
  }, [editorRef]);

  const toggleSpellCheck = useCallback(() => setSpellCheckEnabled((v) => !v), []);
  const toggleFocusMode = useCallback(() => setIsFocusMode((v) => !v), []);

  const insertYouTube = useCallback(() => {
    const url = window.prompt('YouTube URL을 입력하세요 (예: https://www.youtube.com/watch?v=...)');
    if (!url) return;
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (!match) { window.alert('올바른 YouTube URL을 입력해주세요.'); return; }
    const editor = editorRef.current;
    if (!editor) return;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${match[1]}`;
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');
    Object.assign(iframe.style, {
      aspectRatio: '16/9', display: 'block', margin: '12px 0', borderRadius: '8px',
    });
    editor.focus();
    const sel = window.getSelection();
    if (sel?.rangeCount) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(iframe);
      range.setStartAfter(iframe);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      editor.appendChild(iframe);
    }
  }, [editorRef]);

  return { charCount, updateCharCount, spellCheckEnabled, toggleSpellCheck, isFocusMode, toggleFocusMode, insertYouTube };
}
