'use client';

import { useState, useCallback, useRef } from 'react';
import {
  EditorBlock, BlockType,
  TextEditorBlock, CalloutEditorBlock, TimelineEditorBlock,
  TocEditorBlock, DividerEditorBlock, YouTubeEditorBlock, ImageEditorBlock, TableEditorBlock, TableStyle,
  CellStyle,
  ColumnsEditorBlock, CompareEditorBlock, InfoCardEditorBlock, StepsEditorBlock,
} from '../types';

// blocks 상태에서 h2 태그 파싱 → toc-block용 항목 추출
export function extractTocFromBlocks(blocks: EditorBlock[]): { id: string; text: string; anchor: string }[] {
  const items: { id: string; text: string; anchor: string }[] = [];
  for (const block of blocks) {
    if (block.type !== 'text') continue;
    const html = (block as TextEditorBlock).html;
    const re = /<h2([^>]*)>([\s\S]*?)<\/h2>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      const attrs = m[1];
      const inner = m[2];
      const text = inner.replace(/<[^>]+>/g, '').trim();
      if (!text) continue;
      const idMatch = /\bid="([^"]*)"/i.exec(attrs);
      const anchor = idMatch ? idMatch[1] : '';
      items.push({ id: anchor || text, text, anchor });
    }
  }
  return items;
}

function uid() { return Math.random().toString(36).slice(2, 9); }

function defaultBlock(): TextEditorBlock { return { id: uid(), type: 'text', html: '' }; }

function createBlock(type: BlockType): EditorBlock {
  switch (type) {
    case 'callout': return { id: uid(), type: 'callout', calloutType: 'tip', content: '' } as CalloutEditorBlock;
    case 'timeline': return { id: uid(), type: 'timeline', items: [
      { id: uid(), date: '', title: '', content: '' },
    ] } as TimelineEditorBlock;
    case 'toc': return { id: uid(), type: 'toc', items: [] } as TocEditorBlock;
    case 'divider': return { id: uid(), type: 'divider', style: 'solid' } as DividerEditorBlock;
    case 'youtube': return { id: uid(), type: 'youtube', videoId: '' } as YouTubeEditorBlock;
    case 'image': return { id: uid(), type: 'image', url: '', caption: '', layout: 'full', textAlign: 'center' } as ImageEditorBlock;
    case 'table': return { id: uid(), type: 'table', rows: [['', '', ''], ['', '', ''], ['', '', '']], headers: true, tableStyle: 'default' } as TableEditorBlock;
    case 'columns': return { id: uid(), type: 'columns', cols: 2, cells: [
      { id: uid(), html: '' },
      { id: uid(), html: '' },
    ] } as ColumnsEditorBlock;
    case 'compare': return { id: uid(), type: 'compare',
      leftTitle: '방법 A', rightTitle: '방법 B',
      leftItems: [{ text: '항목 1' }, { text: '항목 2' }],
      rightItems: [{ text: '항목 1' }, { text: '항목 2' }],
      leftColor: '#6C3FC5', rightColor: '#0EA5E9',
    } as CompareEditorBlock;
    case 'info-card': return { id: uid(), type: 'info-card',
      title: '현장 개요', cols: 3,
      items: [
        { id: uid(), label: '항목 1', value: '내용', icon: '📋' },
        { id: uid(), label: '항목 2', value: '내용', icon: '📋' },
        { id: uid(), label: '항목 3', value: '내용', icon: '📋' },
      ],
    } as InfoCardEditorBlock;
    case 'steps': return { id: uid(), type: 'steps', items: [
      { id: uid(), number: 1, title: '첫 번째 단계', content: '', imageUrl: '' },
      { id: uid(), number: 2, title: '두 번째 단계', content: '', imageUrl: '' },
    ] } as StepsEditorBlock;
    default: return defaultBlock();
  }
}

export function serializeBlock(block: EditorBlock): string {
  switch (block.type) {
    case 'text': return block.html;
    case 'youtube':
      if (!block.videoId) return '';
      return `<div class="yt-embed"><iframe src="https://www.youtube.com/embed/${block.videoId}" allowfullscreen></iframe></div>`;
    case 'callout': {
      const MAP = {
        tip:     { icon: '💡', bg: '#EFF6FF', border: '#3B82F6' },
        warning: { icon: '⚠️', bg: '#FFFBEB', border: '#F59E0B' },
        error:   { icon: '❌', bg: '#FEF2F2', border: '#EF4444' },
        info:    { icon: '✅', bg: '#F0FDF4', border: '#22C55E' },
      };
      const c = MAP[block.calloutType];
      return `<div class="callout callout-${block.calloutType}" style="background:${c.bg};border-left:4px solid ${c.border}"><span class="callout-icon">${c.icon}</span><div>${block.content}</div></div>`;
    }
    case 'divider':
      if (block.style === 'dashed') return '<hr class="divider-dashed">';
      if (block.style === 'icon')   return '<div class="divider-icon">✦ ✦ ✦</div>';
      return '<hr class="divider-solid">';
    case 'image': {
      if (block.layout === 'grid-2') {
        const img1 = block.url ? `<img src="${block.url}" style="width:100%;border-radius:8px">` : '';
        const img2 = block.url2 ? `<img src="${block.url2}" style="width:100%;border-radius:8px">` : '';
        return `<figure class="img-block img-grid-2"><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${img1}${img2}</div>${block.caption ? `<figcaption>${block.caption}</figcaption>` : ''}</figure>`;
      }
      const widths: Record<'full' | 'padded' | 'small', string> = { full: '100%', padded: 'calc(100% - 80px)', small: '400px' };
      const w = widths[block.layout as 'full' | 'padded' | 'small'];
      return `<figure class="img-block img-${block.layout}" style="width:${w}"><img src="${block.url}" style="width:100%;border-radius:8px">${block.caption ? `<figcaption>${block.caption}</figcaption>` : ''}</figure>`;
    }
    case 'timeline': {
      const items = block.items.map((item) =>
        `<div class="tl-item"><div class="tl-dot"></div><div class="tl-body"><div class="tl-date">${item.date}</div><div class="tl-title">${item.title}</div><div class="tl-content">${item.content}</div></div></div>`
      ).join('');
      return `<div class="timeline">${items}</div>`;
    }
    case 'toc': {
      const items = block.items.map((item) =>
        `<li><a href="#${item.anchor}">📌 ${item.text}</a></li>`
      ).join('');
      return `<div class="toc-block"><p class="toc-title">📋 목차</p><ul>${items}</ul></div>`;
    }
    case 'table': {
      const s: TableStyle = block.tableStyle ?? 'default';
      const rows = block.rows.map((row, ri) => {
        const isH = block.headers && ri === 0;
        const T = isH ? 'th' : 'td';
        const cells = row.map((cell, ci) => {
          let cs = 'padding:8px 12px;text-align:left;';
          if (s === 'default') cs += `border:1px solid #E5E7EB;${isH ? 'background:#F9FAFB;font-weight:600;' : ''}`;
          else if (s === 'simple') cs += `border-top:none;border-left:none;border-right:none;border-bottom:1px solid #E5E7EB;${isH ? 'font-weight:700;' : ''}`;
          else { const odd = !isH && ri % 2 === 1; cs += `border:none;${isH ? 'background:#6C3FC5;color:#fff;font-weight:600;' : odd ? 'background:#F3EEFF;' : ''}`; }
          // 커스텀 셀 색상 (cellStyles가 있으면 덮어쓰기)
          const cellStyle: CellStyle = block.cellStyles?.[ri]?.[ci] ?? {};
          if (cellStyle.bg)    cs += `background:${cellStyle.bg};`;
          if (cellStyle.color) cs += `color:${cellStyle.color};`;
          return `<${T} style="${cs}">${cell}</${T}>`;
        }).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      const border = s === 'default' ? '1px solid #E5E7EB' : 'none';
      return `<table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0;border:${border}">${rows}</table>`;
    }
    case 'columns': {
      const dark = new Set(['#1E1B4B', '#111111']);
      const cells = block.cells.map((cell) => {
        const bg = cell.bg ?? '#F9FAFB';
        const color = dark.has(bg) ? '#FFFFFF' : '#111111';
        const img = cell.imageUrl ? `<img src="${cell.imageUrl}" style="width:100%;border-radius:6px;margin-bottom:8px">` : '';
        return `<div style="flex:1;min-width:0;padding:12px 16px;background:${bg};border-radius:8px;border:1px solid #E5E7EB;color:${color}">${img}<div>${cell.html}</div></div>`;
      }).join('');
      return `<div class="columns-block" style="display:flex;gap:12px;margin:12px 0">${cells}</div>`;
    }
    case 'compare': {
      const leftItems = block.leftItems.map((i) => `<li style="padding:4px 0;font-size:13px;color:#374151">✓ ${i.text}</li>`).join('');
      const rightItems = block.rightItems.map((i) => `<li style="padding:4px 0;font-size:13px;color:#374151">✓ ${i.text}</li>`).join('');
      return `<div class="compare-block" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0">
        <div style="padding:16px;border-radius:10px;border:2px solid ${block.leftColor ?? '#6C3FC5'}">
          <div style="font-weight:700;color:${block.leftColor ?? '#6C3FC5'};margin-bottom:8px">${block.leftTitle}</div>
          <ul style="list-style:none;padding:0;margin:0">${leftItems}</ul>
        </div>
        <div style="padding:16px;border-radius:10px;border:2px solid ${block.rightColor ?? '#0EA5E9'}">
          <div style="font-weight:700;color:${block.rightColor ?? '#0EA5E9'};margin-bottom:8px">${block.rightTitle}</div>
          <ul style="list-style:none;padding:0;margin:0">${rightItems}</ul>
        </div>
      </div>`;
    }
    case 'info-card': {
      const items = block.items.map((item) =>
        `<div style="padding:12px;background:#F9FAFB;border-radius:8px;border:1px solid #E5E7EB;text-align:center">
          ${item.icon ? `<div style="font-size:20px;margin-bottom:4px">${item.icon}</div>` : ''}
          <div style="font-size:11px;color:#6B7280;margin-bottom:2px">${item.label}</div>
          <div style="font-size:14px;font-weight:700;color:#111111">${item.value}</div>
        </div>`).join('');
      const cols = block.cols ?? 3;
      return `<div class="info-card-block" style="margin:12px 0">
        ${block.title ? `<div style="font-size:13px;font-weight:700;color:#111111;margin-bottom:8px">${block.title}</div>` : ''}
        <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:10px">${items}</div>
      </div>`;
    }
    case 'steps': {
      const items = block.items.map((item) => `
        <div style="background:#F9FAFB;border-radius:10px;border:1px solid #E5E7EB;padding:16px;margin-bottom:12px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span style="width:28px;height:28px;border-radius:50%;background:#6C3FC5;color:white;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${item.number}</span>
            <span style="font-size:15px;font-weight:700;color:#111111">${item.title}</span>
          </div>
          <div style="font-size:13px;color:#374151;line-height:1.6;margin-bottom:${item.imageUrl ? '10px' : '0'}">${item.content}</div>
          ${item.imageUrl || item.imageUrl2 ? `
            <div style="display:grid;grid-template-columns:${item.imageUrl2 ? '1fr 1fr' : '1fr'};gap:8px">
              ${item.imageUrl ? `<img src="${item.imageUrl}" style="width:100%;border-radius:6px">` : ''}
              ${item.imageUrl2 ? `<img src="${item.imageUrl2}" style="width:100%;border-radius:6px">` : ''}
            </div>` : ''}
        </div>`).join('');
      return `<div class="steps-block" style="margin:12px 0">${items}</div>`;
    }
    default: return '';
  }
}

function focusEl(el: HTMLElement) {
  el.focus();
  try {
    const r = document.createRange();
    r.setStart(el, 0);
    r.collapse(true);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(r);
  } catch { /* ignore */ }
}

export function useBlocks(initialHtml = '') {
  const [blocks, setBlocks] = useState<EditorBlock[]>(() =>
    initialHtml ? [{ id: uid(), type: 'text', html: initialHtml }] : [defaultBlock()]
  );
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pendingFocusId = useRef<string | null>(null);
  const blocksRef = useRef<EditorBlock[]>(blocks);
  blocksRef.current = blocks;

  const registerRef = useCallback((id: string, el: HTMLDivElement | null) => {
    blockRefs.current[id] = el;
    if (el && pendingFocusId.current === id) {
      pendingFocusId.current = null;
      focusEl(el);
    }
  }, []);

  const updateBlock = useCallback((id: string, updates: Partial<EditorBlock>) =>
    setBlocks((prev) => prev.map((b) => b.id === id ? { ...b, ...updates } as EditorBlock : b)), []);

  const addBlockAfter = useCallback((afterId: string, type: BlockType) => {
    const nb = createBlock(type);
    const tb = type !== 'text' ? defaultBlock() : null;
    if (tb) pendingFocusId.current = tb.id;

    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === afterId);
      const next = [...prev];
      next.splice(idx + 1, 0, nb);
      if (tb) next.splice(idx + 2, 0, tb);
      return next;
    });
    return nb.id;
  }, []);

  const removeBlock = useCallback((id: string) =>
    setBlocks((prev) => prev.length > 1 ? prev.filter((b) => b.id !== id) : prev), []);

  const moveBlock = useCallback((id: string, dir: 'up' | 'down') => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (dir === 'up' && idx <= 0) return prev;
      if (dir === 'down' && idx >= prev.length - 1) return prev;
      const next = [...prev];
      const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  }, []);

  const moveBlockByIndex = useCallback((fromIdx: number, toIdx: number) => {
    setBlocks((prev) => {
      if (fromIdx === toIdx || fromIdx < 0 || toIdx < 0 || fromIdx >= prev.length || toIdx >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }, []);

  const mergeImageBlocks = useCallback((id1: string, id2: string) => {
    setBlocks((prev) => {
      const b1 = prev.find((b) => b.id === id1);
      const b2 = prev.find((b) => b.id === id2);
      if (!b1 || !b2 || b1.type !== 'image' || b2.type !== 'image') return prev;
      const merged: ColumnsEditorBlock = {
        id: uid(),
        type: 'columns',
        cols: 2,
        cells: [
          { id: uid(), html: '', imageUrl: (b1 as ImageEditorBlock).url },
          { id: uid(), html: '', imageUrl: (b2 as ImageEditorBlock).url },
        ],
      };
      return prev
        .map((b) => b.id === id1 ? merged : b)
        .filter((b) => b.id !== id2);
    });
  }, []);

  const escapeBlock = useCallback((blockId: string) => {
    const idx = blocksRef.current.findIndex((b) => b.id === blockId);
    if (idx === -1) return;
    const next = blocksRef.current[idx + 1];
    if (next?.type === 'text') {
      const el = blockRefs.current[next.id];
      if (el) focusEl(el);
    }
  }, []);

  const serializeToHTML = useCallback(() => blocks.map(serializeBlock).join('\n'), [blocks]);

  const getTextContent = useCallback(() => blocks.map((b) => {
    if (b.type === 'text') { const d = document.createElement('div'); d.innerHTML = b.html; return d.textContent ?? ''; }
    if (b.type === 'callout') return b.content;
    if (b.type === 'timeline') return b.items.map((i) => `${i.title} ${i.content}`).join(' ');
    return '';
  }).join(' '), [blocks]);

  const focusBlock = useCallback((id: string) => {
    const el = blockRefs.current[id];
    if (el) focusEl(el);
  }, []);

  const resetBlocks = useCallback((html: string) => {
    setBlocks([{ id: uid(), type: 'text', html }]);
  }, []);

  return { blocks, updateBlock, addBlockAfter, removeBlock, moveBlock, moveBlockByIndex, mergeImageBlocks, serializeToHTML, getTextContent, registerRef, focusBlock, escapeBlock, resetBlocks };
}
