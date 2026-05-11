'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/types';

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: {
        sendDefault: (options: object) => void;
      };
    };
  }
}

export function useShare(post: Post) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [kakaoReady, setKakaoReady] = useState(false);

  // Kakao SDK 로드
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.Kakao) { setKakaoReady(true); return; }

    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      const key = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
      if (key && window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(key);
      }
      setKakaoReady(true);
    };
    document.head.appendChild(script);
  }, []);

  const postUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/posts/${post.id}`
      : `/posts/${post.id}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback: select + execCommand
      const el = document.createElement('textarea');
      el.value = postUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareKakao = () => {
    if (!window.Kakao?.Share) return;
    const description = post.content
      .replace(/<[^>]+>/g, '')
      .trim()
      .slice(0, 100);

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: post.title,
        description,
        imageUrl: post.thumbnailUrl || undefined,
        link: {
          mobileWebUrl: postUrl,
          webUrl: postUrl,
        },
      },
      buttons: [
        {
          title: '게시글 보기',
          link: { mobileWebUrl: postUrl, webUrl: postUrl },
        },
      ],
    });
  };

  return { open, setOpen, copied, copyLink, kakaoReady, shareKakao, postUrl };
}
