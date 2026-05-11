'use client';

import { useState } from 'react';
import { Category } from '@/lib/types';

export interface WriteFormState {
  category: Category | '';
  title: string;
  hashtags: string;
  thumbnailFile: File | null;
  thumbnailPreview: string | null;
}

export function useWriteForm() {
  const [form, setForm] = useState<WriteFormState>({
    category: '',
    title: '',
    hashtags: '',
    thumbnailFile: null,
    thumbnailPreview: null,
  });

  const setField = <K extends keyof WriteFormState>(field: K, value: WriteFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const setThumbnail = (file: File) => {
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, thumbnailFile: file, thumbnailPreview: preview }));
  };

  const removeThumbnail = () => {
    if (form.thumbnailPreview) URL.revokeObjectURL(form.thumbnailPreview);
    setForm((prev) => ({ ...prev, thumbnailFile: null, thumbnailPreview: null }));
  };

  const parseHashtags = (): string[] =>
    form.hashtags
      .split(/[,\s]+/)
      .map((t) => t.replace(/^#/, '').trim())
      .filter(Boolean)
      .slice(0, 10);

  return { form, setField, setThumbnail, removeThumbnail, parseHashtags };
}
