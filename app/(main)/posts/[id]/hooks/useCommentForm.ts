'use client';

import { useState } from 'react';

export function useCommentForm() {
  const [content, setContent] = useState('');
  const clear = () => setContent('');
  return { content, setContent, clear };
}
