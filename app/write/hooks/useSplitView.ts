'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export function useSplitView(getContent: () => string) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const getContentRef = useRef(getContent);
  getContentRef.current = getContent;

  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const scheduleUpdate = useCallback(() => {
    if (!isOpen) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPreviewHtml(getContentRef.current());
    }, 100);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setPreviewHtml(getContentRef.current());
  }, [isOpen]);

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  return { isOpen, previewHtml, toggle, scheduleUpdate };
}
