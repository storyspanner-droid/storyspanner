'use client';

import { useState, useCallback, useEffect } from 'react';

export interface FloatingPos {
  top: number;
  left: number;
}

const TOOLBAR_H = 40;
const TOOLBAR_W = 220;

export function useFloatingToolbar(containerRef: React.RefObject<HTMLElement | null>) {
  const [pos, setPos] = useState<FloatingPos | null>(null);

  const update = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.toString().trim() === '') {
      setPos(null);
      return;
    }
    const container = containerRef.current;
    if (!container) return;
    const range = sel.getRangeAt(0);
    if (!container.contains(range.commonAncestorContainer)) {
      setPos(null);
      return;
    }
    const rect = range.getBoundingClientRect();
    if (!rect.width && !rect.height) return;

    let top = rect.top - TOOLBAR_H - 8;
    if (top < 8) top = rect.bottom + 8;

    let left = rect.left + rect.width / 2 - TOOLBAR_W / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - TOOLBAR_W - 8));

    setPos({ top, left });
  }, [containerRef]);

  useEffect(() => {
    document.addEventListener('selectionchange', update);
    document.addEventListener('mouseup', update);
    return () => {
      document.removeEventListener('selectionchange', update);
      document.removeEventListener('mouseup', update);
    };
  }, [update]);

  const hide = useCallback(() => setPos(null), []);

  return { pos, hide };
}
