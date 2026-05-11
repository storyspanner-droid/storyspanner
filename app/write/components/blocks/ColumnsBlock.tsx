'use client';

import { useRef, useEffect, useState } from 'react';
import { ColumnsEditorBlock, ColumnCell } from '../../types';

interface Props {
  block: ColumnsEditorBlock;
  onChange: (id: string, updates: Partial<ColumnsEditorBlock>) => void;
  onRemove: (id: string) => void;
  onUpload?: (blockId: string, cellId: string, file: File) => void;
}

const PALETTE = ['#FFFFFF', '#F9FAFB', '#F3EEFF', '#EFF6FF', '#F0FDF4', '#FFFBEB', '#FEF2F2', '#F8FAFC', '#1E1B4B', '#111111'];
const DARK_BG = new Set(['#1E1B4B', '#111111']);

function uid() { return Math.random().toString(36).slice(2, 9); }

function CellEditor({ cell, blockId, onChange, onUpload }: {
  cell: ColumnCell;
  blockId: string;
  onChange: (updates: Partial<ColumnCell>) => void;
  onUpload?: (blockId: string, cellId: string, file: File) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [showPalette, setShowPalette] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== cell.html) {
      ref.current.innerHTML = cell.html;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bg = cell.bg ?? '#F9FAFB';
  const isDark = DARK_BG.has(bg);
  const textColor = isDark ? '#FFFFFF' : '#111111';

  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); setDragOver(true); }
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/') && onUpload) onUpload(blockId, cell.id, file);
  };

  return (
    <div
      className={`relative flex-1 min-w-0 rounded-[8px] p-3 group/cell transition-all ${dragOver ? 'ring-2 ring-[#6C3FC5] ring-dashed' : 'border border-[#E5E7EB]'}`}
      style={{ backgroundColor: bg }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 색상 팔레트 */}
      <div className="absolute top-1.5 right-1.5 z-10 opacity-0 group-hover/cell:opacity-100 transition-opacity">
        <button type="button" onClick={() => setShowPalette((v) => !v)}
          className="w-5 h-5 text-[11px] flex items-center justify-center rounded hover:bg-black/10">🎨</button>
        {showPalette && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowPalette(false)} />
            <div className="absolute right-0 top-6 z-20 bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg p-2 flex flex-wrap gap-1 w-[126px]">
              {PALETTE.map((color) => (
                <button key={color} type="button"
                  onClick={() => { onChange({ bg: color }); setShowPalette(false); }}
                  title={color}
                  className="w-8 h-8 rounded-[4px] border-2 transition-transform hover:scale-110"
                  style={{ backgroundColor: color, borderColor: bg === color ? '#6C3FC5' : '#D1D5DB' }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 드래그 이미지 표시 */}
      {cell.imageUrl && (
        <div className="relative group/img mb-2">
          <img src={cell.imageUrl} alt="" className="w-full rounded-[6px] block" />
          <button type="button" onClick={() => onChange({ imageUrl: '' })}
            className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white text-[10px] rounded-full opacity-0 group-hover/img:opacity-100 flex items-center justify-center">✕</button>
        </div>
      )}

      {dragOver && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[8px] bg-[#6C3FC5]/10 pointer-events-none z-5">
          <span className="text-[12px] text-[#6C3FC5] font-medium">이미지를 놓으세요</span>
        </div>
      )}

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange({ html: e.currentTarget.innerHTML })}
        className="min-h-[60px] focus:outline-none text-[14px] leading-relaxed empty:before:content-['내용을_입력하세요...'] empty:before:text-[#9CA3AF] empty:before:pointer-events-none"
        style={{ color: textColor }}
      />
    </div>
  );
}

export default function ColumnsBlock({ block, onChange, onRemove, onUpload }: Props) {
  const adjustCells = (newCols: 1 | 2 | 3) => {
    const current = block.cells;
    const cells: ColumnCell[] = newCols > current.length
      ? [...current, ...Array.from({ length: newCols - current.length }, () => ({ id: uid(), html: '' }))]
      : current.slice(0, newCols);
    onChange(block.id, { cols: newCols, cells });
  };

  const updateCell = (cellId: string, updates: Partial<ColumnCell>) => {
    const cells = block.cells.map((c) => c.id === cellId ? { ...c, ...updates } : c);
    onChange(block.id, { cells });
  };

  return (
    <div className="relative group/block my-2">
      {/* hover 시 컨트롤 */}
      <div className="flex items-center gap-1 mb-1.5 h-6 opacity-0 group-hover/block:opacity-100 transition-opacity">
        <span className="text-[11px] text-[#6B7280]">열:</span>
        {([1, 2, 3] as const).map((c) => (
          <button key={c} type="button" onClick={() => adjustCells(c)}
            className={`px-2 py-0.5 text-[11px] rounded-full border transition-colors ${block.cols === c ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]' : 'text-[#6B7280] border-[#D1D5DB] hover:border-[#6C3FC5]'}`}>
            {c}열
          </button>
        ))}
        <button type="button" onClick={() => onRemove(block.id)}
          className="ml-auto text-[11px] text-[#9CA3AF] hover:text-[#EF4444] transition-colors px-1">삭제</button>
      </div>

      <div className="flex gap-3">
        {block.cells.map((cell) => (
          <CellEditor key={cell.id} cell={cell} blockId={block.id}
            onChange={(updates) => updateCell(cell.id, updates)}
            onUpload={onUpload}
          />
        ))}
      </div>
    </div>
  );
}
