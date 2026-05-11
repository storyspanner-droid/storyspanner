'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib/types';
import { getPostsByUserId, deletePost } from '@/lib/services/postService';

export function useMyPosts(userId: string | undefined) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getPostsByUserId(userId, 50)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [userId]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === posts.length ? new Set() : new Set(posts.map((p) => p.id))
    );
  };

  const handleEdit = (postId: string) => {
    router.push(`/write?edit=${postId}`);
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm('정말 삭제하시겠습니까? 되돌릴 수 없습니다.')) return;
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    } catch {
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const downloadPDF = useCallback(async () => {
    if (selected.size === 0) return;
    setDownloading(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      const selectedPosts = posts.filter((p) => selected.has(p.id));

      for (const post of selectedPosts) {
        const container = document.createElement('div');
        container.style.cssText =
          'position:fixed;left:-9999px;top:-9999px;width:780px;padding:48px;background:#fff;font-family:-apple-system,"Apple SD Gothic Neo","Noto Sans KR",sans-serif;color:#111;';

        const dateStr = post.createdAt?.toDate?.()?.toLocaleDateString('ko-KR') ?? '';
        container.innerHTML = `
          <h1 style="font-size:22px;font-weight:800;margin:0 0 8px;line-height:1.4;">${post.title}</h1>
          <p style="font-size:12px;color:#6B7280;margin:0 0 28px;">${post.category} · ${dateStr} · 조회 ${post.views} · 좋아요 ${post.likeCount}</p>
          <hr style="border:none;border-top:1px solid #E5E7EB;margin-bottom:28px;" />
          <div style="font-size:15px;line-height:1.9;">${post.content}</div>
        `;
        document.body.appendChild(container);

        const canvas = await html2canvas(container, { useCORS: true, allowTaint: true, scale: 2, logging: false });
        document.body.removeChild(container);

        const pdf = new jsPDF({ unit: 'px', format: 'a4', orientation: 'portrait' });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const imgW = pageW;
        const imgH = (canvas.height * imgW) / canvas.width;

        let remaining = imgH;
        let posY = 0;
        let page = 0;
        while (remaining > 0) {
          if (page > 0) pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, -posY, imgW, imgH);
          posY += pageH;
          remaining -= pageH;
          page++;
        }

        const safeName = post.title.replace(/[\\/:*?"<>|]/g, '_').slice(0, 40);
        pdf.save(`${safeName}.pdf`);
      }
    } catch {
      // silently ignore
    } finally {
      setDownloading(false);
    }
  }, [posts, selected]);

  return { posts, loading, selected, toggle, toggleAll, downloading, downloadPDF, handleEdit, handleDelete };
}
