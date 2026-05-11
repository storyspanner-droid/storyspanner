'use client';

import { useEffect } from 'react';
import { FONTS, GOOGLE_FONT_FAMILIES } from '@/lib/config/fonts';

function injectLink(href: string) {
  if (typeof document === 'undefined') return;
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

export function useFontLoader() {
  useEffect(() => {
    // Google Fonts 배치 로드 (단일 CDN 요청)
    const googleUrl = `https://fonts.googleapis.com/css2?${GOOGLE_FONT_FAMILIES.map(
      (f) => `family=${f}`,
    ).join('&')}&display=swap`;
    injectLink(googleUrl);

    // 개별 CDN 폰트 (배민, 카카오 등)
    FONTS.filter((f) => f.cdnUrl).forEach((f) => injectLink(f.cdnUrl!));
  }, []);
}
