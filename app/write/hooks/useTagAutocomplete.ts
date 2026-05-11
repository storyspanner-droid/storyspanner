'use client';

import { useState, useEffect, useRef } from 'react';
import { getPopularTags } from '@/lib/services/tagService';
import { Tag } from '@/lib/types';

export function useTagAutocomplete() {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeWord, setActiveWord] = useState('');
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    getPopularTags(50).then(setAllTags).catch(() => {});
  }, []);

  const onInputChange = (value: string) => {
    // 마지막으로 입력 중인 단어 추출
    const parts = value.split(/[,\s]+/);
    const last = parts[parts.length - 1].replace(/^#/, '').trim();
    setActiveWord(last);

    if (!last) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const lower = last.toLowerCase();
    const matched = allTags
      .filter((t) => t.tagName.toLowerCase().includes(lower))
      .map((t) => t.tagName)
      .slice(0, 8);

    setSuggestions(matched);
    setShowDropdown(matched.length > 0);
  };

  const selectSuggestion = (tag: string, currentValue: string): string => {
    const parts = currentValue.split(/([,\s]+)/);
    // 구분자 포함해서 마지막 단어 교체
    let rebuilt = '';
    let lastWordIdx = -1;
    for (let i = 0; i < parts.length; i++) {
      if (!parts[i].match(/^[,\s]+$/) && i > lastWordIdx) lastWordIdx = i;
    }
    if (lastWordIdx !== -1) {
      parts[lastWordIdx] = tag;
      rebuilt = parts.join('');
    } else {
      rebuilt = tag;
    }
    // 후행 구분자가 없으면 쉼표+공백 추가
    if (!rebuilt.endsWith(', ') && !rebuilt.endsWith(' ')) rebuilt += ', ';
    setSuggestions([]);
    setShowDropdown(false);
    return rebuilt;
  };

  return { suggestions, showDropdown, activeWord, onInputChange, selectSuggestion, setShowDropdown };
}
