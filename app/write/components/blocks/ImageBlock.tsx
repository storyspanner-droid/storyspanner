'use client';

import { ImageEditorBlock, ImageLayout, ImageTextAlign } from '../../types';

interface Props {
  block: ImageEditorBlock;
  onChange: (id: string, updates: Partial<ImageEditorBlock>) => void;
  onRemove: (id: string) => void;
  onUpload?: (blockId: string, file: File) => void;
  onUpload2?: (blockId: string, file: File) => void;
  onMerge?: (sourceId: string, targetId: string) => void;
}

const LAYOUTS: { value: ImageLayout; label: string }[] = [
  { value: 'full',    label: '1열' },
  { value: 'grid-2',  label: '2열' },
  { value: 'small',   label: '작게' },
  { value: 'padded',  label: '여백' },
];

const ALIGNS: { value: ImageTextAlign; label: string }[] = [
  { value: 'center', label: '가운데' },
  { value: 'left',   label: '좌' },
  { value: 'right',  label: '우' },
];

function UploadSlot({ url, blockId, onUpload, label }: { url: string; blockId: string; onUpload?: (blockId: string, file: File) => void; label?: string }) {
  if (url) return <img src={url} alt={label} className="w-full h-full object-cover rounded-[8px] block" />;
  return (
    <label className="block w-full min-h-[120px] border-2 border-dashed border-[#D1D5DB] rounded-[8px] flex flex-col items-center justify-center cursor-pointer hover:border-[#6C3FC5] transition-colors gap-1">
      <span className="text-[20px]">🖼</span>
      <span className="text-[12px] text-[#9CA3AF]">{label ?? '이미지 업로드'}</span>
      <input type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f && onUpload) onUpload(blockId, f); }} />
    </label>
  );
}

export default function ImageBlock({ block, onChange, onRemove, onUpload, onUpload2, onMerge }: Props) {
  const isGrid = block.layout === 'grid-2';

  const containerStyle: React.CSSProperties = isGrid
    ? { width: '100%' }
    : {
        maxWidth: block.layout === 'full' ? '100%' : block.layout === 'padded' ? 'calc(100% - 80px)' : '400px',
        margin: block.layout === 'padded' ? '0 40px' : '0 auto',
        textAlign: block.textAlign,
      };

  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('text/x-image-block-id')) e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/x-image-block-id');
    if (sourceId && sourceId !== block.id && onMerge) {
      onMerge(sourceId, block.id);
    }
  };

  return (
    <div
      className="relative group"
      draggable={!!block.url}
      onDragStart={(e) => { e.stopPropagation(); e.dataTransfer.setData('text/x-image-block-id', block.id); }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <button type="button" onClick={() => onRemove(block.id)}
        className="absolute top-1 right-1 z-10 w-6 h-6 bg-black/50 text-white text-[11px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">✕</button>

      {/* Layout + Align buttons */}
      <div className="flex gap-1 mb-2 flex-wrap">
        {LAYOUTS.map((l) => (
          <button key={l.value} type="button" onClick={() => onChange(block.id, { layout: l.value })}
            className={`px-2 py-0.5 text-[11px] rounded-full border transition-colors ${block.layout === l.value ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]' : 'text-[#6B7280] border-[#D1D5DB] hover:border-[#6C3FC5]'}`}>
            {l.label}
          </button>
        ))}
        {!isGrid && (
          <>
            <span className="w-px h-4 bg-[#E5E7EB] self-center mx-1" />
            {ALIGNS.map((a) => (
              <button key={a.value} type="button" onClick={() => onChange(block.id, { textAlign: a.value })}
                className={`px-2 py-0.5 text-[11px] rounded-full border transition-colors ${block.textAlign === a.value ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]' : 'text-[#6B7280] border-[#D1D5DB] hover:border-[#6C3FC5]'}`}>
                {a.label}
              </button>
            ))}
          </>
        )}
      </div>

      <figure style={containerStyle} className="my-2">
        {isGrid ? (
          <div className="grid grid-cols-2 gap-3">
            <UploadSlot url={block.url} blockId={block.id} onUpload={onUpload} label="이미지 1" />
            <UploadSlot url={block.url2 ?? ''} blockId={block.id} onUpload={onUpload2} label="이미지 2" />
          </div>
        ) : (
          block.url ? (
            <img src={block.url} alt={block.caption} className="w-full rounded-[8px] block" />
          ) : (
            <label className="block w-full min-h-[120px] border-2 border-dashed border-[#D1D5DB] rounded-[8px] flex items-center justify-center cursor-pointer hover:border-[#6C3FC5] transition-colors">
              <span className="text-[13px] text-[#9CA3AF]">🖼 이미지를 클릭하여 업로드</span>
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f && onUpload) onUpload(block.id, f); }} />
            </label>
          )
        )}
        <input
          type="text"
          value={block.caption}
          onChange={(e) => onChange(block.id, { caption: e.target.value })}
          placeholder="캡션 입력 (선택)"
          className="w-full mt-2 text-[12px] text-[#6B7280] text-center bg-transparent border-none focus:outline-none placeholder-[#D1D5DB]"
        />
      </figure>
    </div>
  );
}
