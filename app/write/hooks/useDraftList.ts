'use client';

import { useState, useCallback } from 'react';
import { WriteDraft } from './useAutoSave';

export function useDraftList(getAllDrafts: () => WriteDraft[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [drafts, setDrafts] = useState<WriteDraft[]>([]);

  const open = useCallback(() => {
    setDrafts(
      getAllDrafts().sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
    );
    setIsOpen(true);
  }, [getAllDrafts]);

  const close = useCallback(() => setIsOpen(false), []);

  const deleteDraft = useCallback((key: string) => {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
    setDrafts((prev) => prev.filter((d) => d.key !== key));
  }, []);

  return { isOpen, drafts, open, close, deleteDraft };
}
