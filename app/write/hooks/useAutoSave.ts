'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const PREFIX = 'storyspanner_draft_';
const MAX_SLOTS = 10;

export interface WriteDraft {
  key: string;
  title: string;
  category: string;
  content: string;
  hashtags: string;
  savedAt: string;
  charCount: number;
}

function getAllDrafts(): WriteDraft[] {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(PREFIX));
    return keys
      .map((k) => { try { return JSON.parse(localStorage.getItem(k) ?? ''); } catch { return null; } })
      .filter(Boolean) as WriteDraft[];
  } catch { return []; }
}

function saveSlot(data: Omit<WriteDraft, 'key'>) {
  try {
    const all = getAllDrafts().sort((a, b) => new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime());
    if (all.length >= MAX_SLOTS) localStorage.removeItem(all[0].key);
    const key = `${PREFIX}${Date.now()}`;
    localStorage.setItem(key, JSON.stringify({ ...data, key }));
    return key;
  } catch { return null; }
}

export function useAutoSave(
  getData: () => Omit<WriteDraft, 'key' | 'savedAt' | 'charCount'> & { charCount?: number },
  onRestore: (draft: WriteDraft) => void,
) {
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [latestDraft, setLatestDraft] = useState<WriteDraft | null>(null);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const dataRef = useRef(getData);
  dataRef.current = getData;

  useEffect(() => {
    const all = getAllDrafts();
    if (all.length === 0) return;
    const latest = all.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())[0];
    if (latest.title || latest.content) setLatestDraft(latest);
  }, []);

  useEffect(() => {
    const save = () => {
      const data = dataRef.current();
      if (!data.title && !data.content) return;
      setIsSaving(true);
      const savedAt = new Date().toISOString();
      const charCount = data.charCount ?? data.content.replace(/\s/g, '').length;
      if (currentKey) {
        try { localStorage.setItem(currentKey, JSON.stringify({ ...data, key: currentKey, savedAt, charCount })); }
        catch { /* ignore */ }
      } else {
        const key = saveSlot({ ...data, savedAt, charCount });
        if (key) setCurrentKey(key);
      }
      setSavedAt(new Date());
      setTimeout(() => setIsSaving(false), 800);
    };

    const id = setInterval(save, 30000);
    const onCtrlS = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save(); } };
    document.addEventListener('keydown', onCtrlS);
    return () => { clearInterval(id); document.removeEventListener('keydown', onCtrlS); };
  }, [currentKey]);

  const restoreDraft = useCallback(() => {
    if (!latestDraft) return;
    onRestore(latestDraft);
    setCurrentKey(latestDraft.key);
    setLatestDraft(null);
  }, [latestDraft, onRestore]);

  const dismissDraft = useCallback(() => setLatestDraft(null), []);

  const clearCurrentDraft = useCallback(() => {
    if (currentKey) { try { localStorage.removeItem(currentKey); } catch { /* ignore */ } }
    setCurrentKey(null);
  }, [currentKey]);

  return { savedAt, isSaving, latestDraft, restoreDraft, dismissDraft, clearCurrentDraft, getAllDrafts };
}
