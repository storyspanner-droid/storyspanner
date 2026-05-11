'use client';

import { useRef, useState } from 'react';
import { StepsEditorBlock, StepItem } from '../../types';

interface Props {
  block: StepsEditorBlock;
  onChange: (id: string, updates: Partial<StepsEditorBlock>) => void;
  onRemove: (id: string) => void;
  onUpload?: (blockId: string, stepId: string, slot: 1 | 2, file: File) => void;
}

function uid() { return Math.random().toString(36).slice(2, 9); }

function ImageDropZone({ url, blockId, stepId, slot, onUpload, onClear }: {
  url?: string;
  blockId: string;
  stepId: string;
  slot: 1 | 2;
  onUpload?: (blockId: string, stepId: string, slot: 1 | 2, file: File) => void;
  onClear: () => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); setDragOver(true); }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/') && onUpload) onUpload(blockId, stepId, slot, file);
  };

  if (url) {
    return (
      <div className="relative group/img">
        <img src={url} alt="" className="w-full rounded-[6px] block" />
        <button type="button" onClick={onClear}
          className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white text-[10px] rounded-full opacity-0 group-hover/img:opacity-100 flex items-center justify-center">✕</button>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[72px] rounded-[6px] border-2 border-dashed transition-colors ${dragOver ? 'border-[#6C3FC5] bg-[#F3EEFF]' : 'border-[#D1D5DB]'}`}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <span className="text-[12px] text-[#9CA3AF]">{dragOver ? '이미지를 놓으세요' : `🖼 이미지 ${slot} 드래그`}</span>
    </div>
  );
}

function StepEditor({ step, blockId, onUpdate, onRemove, onUpload, dragging, onDragStart, onDragOver, onDrop }: {
  step: StepItem;
  blockId: string;
  onUpdate: (updates: Partial<StepItem>) => void;
  onRemove: () => void;
  onUpload?: (blockId: string, stepId: string, slot: 1 | 2, file: File) => void;
  dragging: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  return (
    <div
      className={`bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] p-3 relative group/step transition-opacity ${dragging ? 'opacity-40' : ''}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          draggable
          onDragStart={onDragStart}
          className="cursor-grab text-[#D1D5DB] hover:text-[#6C3FC5] select-none text-[16px]">⠿</span>
        <span className="w-6 h-6 rounded-full bg-[#6C3FC5] text-white text-[11px] font-bold flex items-center justify-center shrink-0">{step.number}</span>
        <input
          type="text" value={step.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="단계 제목"
          className="flex-1 text-[13px] font-bold text-[#111111] bg-transparent border-b border-[#E5E7EB] focus:outline-none focus:border-[#6C3FC5] py-0.5"
        />
        <button type="button" onClick={onRemove}
          className="text-[#9CA3AF] hover:text-[#EF4444] text-[12px] opacity-0 group-hover/step:opacity-100 transition-opacity">×</button>
      </div>

      <textarea
        value={step.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder="단계 설명..."
        rows={2}
        className="w-full text-[13px] text-[#374151] bg-white border border-[#E5E7EB] rounded-[6px] p-2 focus:outline-none focus:border-[#6C3FC5] resize-none mb-2"
      />

      <div className="grid grid-cols-2 gap-2">
        <ImageDropZone url={step.imageUrl} blockId={blockId} stepId={step.id} slot={1}
          onUpload={onUpload} onClear={() => onUpdate({ imageUrl: '' })} />
        <ImageDropZone url={step.imageUrl2} blockId={blockId} stepId={step.id} slot={2}
          onUpload={onUpload} onClear={() => onUpdate({ imageUrl2: '' })} />
      </div>
    </div>
  );
}

export default function StepsBlock({ block, onChange, onRemove, onUpload }: Props) {
  const dragIdx = useRef<number | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const updateItem = (stepId: string, updates: Partial<StepItem>) => {
    const items = block.items.map((s) => s.id === stepId ? { ...s, ...updates } : s);
    onChange(block.id, { items });
  };

  const removeItem = (stepId: string) => {
    if (block.items.length <= 1) return;
    const items = block.items.filter((s) => s.id !== stepId).map((s, i) => ({ ...s, number: i + 1 }));
    onChange(block.id, { items });
  };

  const addStep = () => {
    const items = [...block.items, { id: uid(), number: block.items.length + 1, title: '새 단계', content: '', imageUrl: '' }];
    onChange(block.id, { items });
  };

  const handleDrop = (toIdx: number) => {
    if (dragIdx.current === null || dragIdx.current === toIdx) return;
    const next = [...block.items];
    const [moved] = next.splice(dragIdx.current, 1);
    next.splice(toIdx, 0, moved);
    const renumbered = next.map((s, i) => ({ ...s, number: i + 1 }));
    onChange(block.id, { items: renumbered });
    dragIdx.current = null;
    setDraggingIdx(null);
  };

  return (
    <div className="relative group/block my-2">
      <div className="flex items-center justify-between mb-1.5 opacity-0 group-hover/block:opacity-100 transition-opacity h-6">
        <span className="text-[11px] font-bold text-[#6B7280]">스텝 카드</span>
        <button type="button" onClick={() => onRemove(block.id)}
          className="text-[11px] text-[#9CA3AF] hover:text-[#EF4444] transition-colors px-1">삭제</button>
      </div>

      <div className="space-y-2">
        {block.items.map((step, idx) => (
          <StepEditor key={step.id}
            step={step} blockId={block.id}
            onUpdate={(updates) => updateItem(step.id, updates)}
            onRemove={() => removeItem(step.id)}
            onUpload={onUpload}
            dragging={draggingIdx === idx}
            onDragStart={(e) => { e.stopPropagation(); dragIdx.current = idx; setDraggingIdx(idx); }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleDrop(idx); }}
          />
        ))}
      </div>

      <button type="button" onClick={addStep}
        className="mt-2 w-full py-1.5 text-[12px] text-[#6C3FC5] border border-dashed border-[#C4B5FD] rounded-[8px] hover:bg-[#F3EEFF] transition-colors">
        + 단계 추가
      </button>
    </div>
  );
}
