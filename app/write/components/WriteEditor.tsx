'use client';

import { useRef, useState } from 'react';
import WriteToolbar from './WriteToolbar';
import BlockAdder from './BlockAdder';
import FloatingToolbar from './FloatingToolbar';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import CalloutBlock from './blocks/CalloutBlock';
import TimelineBlock from './blocks/TimelineBlock';
import TableOfContentsBlock from './blocks/TableOfContentsBlock';
import DividerBlock from './blocks/DividerBlock';
import YouTubeBlock from './blocks/YouTubeBlock';
import TableBlock from './blocks/TableBlock';
import ColumnsBlock from './blocks/ColumnsBlock';
import CompareBlock from './blocks/CompareBlock';
import InfoCardBlock from './blocks/InfoCardBlock';
import StepsBlock from './blocks/StepsBlock';
import { useFloatingToolbar } from '../hooks/useFloatingToolbar';
import { extractTocFromBlocks } from '../hooks/useBlocks';
import { useEditorResize } from '../hooks/useEditorResize';
import { usePlusButton } from '../hooks/usePlusButton';
import { EditorBlock, CalloutEditorBlock, TimelineEditorBlock, TocEditorBlock, DividerEditorBlock, ImageEditorBlock, TableEditorBlock, ColumnsEditorBlock, CompareEditorBlock, InfoCardEditorBlock, StepsEditorBlock, BlockType } from '../types';
import type { WriteEditorAPI } from '../hooks/useWriteEditor';

interface Props {
  api: WriteEditorAPI;
  hasError: boolean;
  errorMsg?: string;
  imageUploading: boolean;
  isFocusMode: boolean;
  spellCheckEnabled: boolean;
  isSplitView: boolean;
  charCount: { total: number; noSpace: number };
  onInput: () => void;
  onYouTubeModal: (afterId?: string) => void;
  onLinkModal: () => void;
  onCodeModal: () => void;
  onFocusMode: () => void;
  onSpellCheck: () => void;
  onSplitView: () => void;
  onDraftList: () => void;
}

export default function WriteEditor({
  api, hasError, errorMsg, imageUploading, isFocusMode, spellCheckEnabled,
  isSplitView, charCount, onInput,
  onYouTubeModal, onLinkModal, onCodeModal, onFocusMode, onSpellCheck, onSplitView, onDraftList,
}: Props) {
  const { pos: floatPos } = useFloatingToolbar(api.editorContainerRef);
  const { blocks, updateBlock, addBlockAfter, removeBlock, registerRef, saveSelection, escapeBlock, mergeImageBlocks } = api;
  const dragIndexRef = useRef<number | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [fileDragOver, setFileDragOver] = useState(false);
  const [fileDragOverIdx, setFileDragOverIdx] = useState<number | null>(null);
  const { editorHeight, isResizing, handleResizeStart } = useEditorResize();
  const { plusButtonTop, activeBlockId, setActiveBlockId, updatePosition } = usePlusButton();

  const tocFromBlocks = extractTocFromBlocks(blocks);

  const execCmd = (cmd: string, val?: string) => { document.execCommand(cmd, false, val); };

  const handleFloatQuote = () => { saveSelection(); document.execCommand('formatBlock', false, 'blockquote'); };
  const handleFloatCallout = () => {
    const lastId = blocks[blocks.length - 1]?.id;
    if (lastId) addBlockAfter(lastId, 'callout');
  };

  const handleBlockAdd = (afterId: string, type: BlockType) => {
    if (type === 'youtube') { onYouTubeModal(afterId); return; }
    addBlockAfter(afterId, type);
  };

  const containerClass = isFocusMode
    ? 'fixed inset-0 z-50 bg-white flex flex-col'
    : 'rounded-[10px] border flex flex-col relative';

  return (
    <div>
      <label className="block text-[12px] font-medium text-[#6B7280] mb-2">내용 *</label>
      <div className={containerClass} style={isFocusMode ? {} : { borderColor: hasError ? '#EF4444' : '#E5E7EB' }}>
        <div className="flex-none">
          <WriteToolbar
            onBold={() => execCmd('bold')} onItalic={() => execCmd('italic')}
            onUnderline={() => execCmd('underline')} onStrike={() => execCmd('strikeThrough')}
            onFontSize={api.applyFontSize} onFontFamily={api.applyFontFamily}
            onFontColor={api.applyFontColor} onFontBgColor={api.applyFontBgColor}
            onAlignLeft={() => execCmd('justifyLeft')} onAlignCenter={() => execCmd('justifyCenter')} onAlignRight={() => execCmd('justifyRight')}
            onLink={onLinkModal} onCode={onCodeModal} onImage={api.triggerImageInsert}
            onYouTube={onYouTubeModal} onFocusMode={onFocusMode} onSpellCheck={onSpellCheck}
            onSplitView={onSplitView} onDraftList={onDraftList}
            onHeading2={api.execHeading2}
            onBlockquote={api.execBlockquote} onDivider={api.execDivider}
            isFocusMode={isFocusMode} spellCheckEnabled={spellCheckEnabled} isSplitView={isSplitView}
            onSaveSelection={saveSelection}
          />
        </div>

        <div
          ref={api.editorContainerRef}
          className="write-editor overflow-y-auto px-10 pt-6 pb-32 relative"
          style={{ height: isFocusMode ? 'calc(100vh - 60px)' : editorHeight, lineHeight: '1.8', backgroundColor: hasError ? '#FFF5F5' : '#fff', userSelect: isResizing ? 'none' : undefined }}
          onKeyDown={() => requestAnimationFrame(() => updatePosition(api.editorContainerRef.current))}
          onKeyUp={() => requestAnimationFrame(() => updatePosition(api.editorContainerRef.current))}
          onClick={() => requestAnimationFrame(() => updatePosition(api.editorContainerRef.current))}
          onDragEnter={(e) => { if (e.dataTransfer.types.includes('Files')) setFileDragOver(true); }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setFileDragOver(false);
              setFileDragOverIdx(null);
            }
          }}
          onDrop={(e) => {
            if (e.dataTransfer.files.length > 0 && fileDragOverIdx !== null) {
              e.preventDefault();
              setFileDragOver(false);
              setFileDragOverIdx(null);
              const file = e.dataTransfer.files[0];
              if (file?.type.startsWith('image/')) {
                const targetBlockId = blocks[fileDragOverIdx]?.id;
                if (targetBlockId) api.handleImageDropOnEditor(file, targetBlockId);
              }
            }
          }}
        >
          {floatPos && (
            <FloatingToolbar pos={floatPos}
              onBold={() => execCmd('bold')} onItalic={() => execCmd('italic')} onUnderline={() => execCmd('underline')}
              onLink={onLinkModal} onQuote={handleFloatQuote} onCallout={handleFloatCallout}
            />
          )}

          {blocks.map((block, idx) => (
            <div
              key={block.id}
              onInput={onInput}
              draggable
              onFocusCapture={() => setActiveBlockId(block.id)}
              onClickCapture={(e) => {
                setActiveBlockId(block.id);
                const target = e.currentTarget;
                requestAnimationFrame(() => updatePosition(api.editorContainerRef.current, target));
              }}
              onDragStart={() => { dragIndexRef.current = idx; setDraggingIdx(idx); }}
              onDragOver={(e) => {
                e.preventDefault();
                if (e.dataTransfer.types.includes('Files')) {
                  e.dataTransfer.dropEffect = 'copy';
                  setFileDragOverIdx(idx);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files.length > 0) {
                  dragIndexRef.current = null;
                  setDraggingIdx(null);
                  setFileDragOver(false);
                  setFileDragOverIdx(null);
                  const file = e.dataTransfer.files[0];
                  if (file?.type.startsWith('image/')) {
                    api.handleImageDropOnEditor(file, block.id);
                  }
                  return;
                }
                if (dragIndexRef.current !== null && dragIndexRef.current !== idx) {
                  api.moveBlockByIndex(dragIndexRef.current, idx);
                }
                dragIndexRef.current = null;
                setDraggingIdx(null);
              }}
              onDragEnd={() => { dragIndexRef.current = null; setDraggingIdx(null); }}
              className={`relative group/block ${draggingIdx === idx ? 'opacity-50' : ''}`}
            >
              {/* 드래그 핸들 */}
              <span className="absolute -left-6 top-3 cursor-grab text-[#D1D5DB] hover:text-[#6C3FC5] opacity-0 group-hover/block:opacity-100 transition-opacity select-none text-[18px] leading-none">
                ⠿
              </span>

              <BlockRenderer
                block={block}
                isFirst={idx === 0}
                onUpdate={(id, up) => updateBlock(id, up as Partial<EditorBlock>)}
                onRemove={removeBlock}
                onUpload={api.handleImageBlockUpload}
                onUpload2={api.handleImageBlock2Upload}
                onMerge={mergeImageBlocks}
                onColumnsUpload={api.handleColumnsBlockUpload}
                onStepsUpload={api.handleStepsBlockUpload}
                registerRef={registerRef}
                onEscape={escapeBlock}
                onAddBlock={handleBlockAdd}
                tocFromBlocks={tocFromBlocks}
              />
              {fileDragOver && fileDragOverIdx === idx && (
                <div className="absolute -bottom-[2px] left-0 right-0 z-30 pointer-events-none flex items-center" style={{ height: '4px' }}>
                  <div className="w-full h-[2px] bg-[#6C3FC5] rounded-full" />
                  <div className="absolute left-0 w-[3px] h-[16px] bg-[#6C3FC5] rounded-full -top-[7px]" />
                  <div className="absolute right-0 w-[3px] h-[16px] bg-[#6C3FC5] rounded-full -top-[7px]" />
                </div>
              )}
            </div>
          ))}

          {/* 커서 위치 추적 플로팅 + 버튼 */}
          {plusButtonTop !== null && activeBlockId && (
            <div
              className="absolute pointer-events-none"
              style={{ top: plusButtonTop, left: 8, transition: 'top 0.1s ease', zIndex: 20 }}
            >
              <div className="pointer-events-auto">
                <BlockAdder blockId={activeBlockId} onAdd={handleBlockAdd} floating />
              </div>
            </div>
          )}

          <span className="absolute bottom-2 right-4 text-[11px] text-[#9CA3AF] pointer-events-none select-none">
            {charCount.total}자 (공백 제외 {charCount.noSpace}자)
          </span>
        </div>

        {!isFocusMode && (
          <div
            onMouseDown={handleResizeStart}
            className="w-full h-[6px] cursor-ns-resize bg-[#E5E7EB] hover:bg-[#6C3FC5] transition-colors rounded-b-[12px] flex items-center justify-center"
          >
            <span className="text-[#9CA3AF] text-[12px] leading-none select-none">···</span>
          </div>
        )}
      </div>

      <input ref={api.imageInputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files?.length) api.onImageFiles(Array.from(files));
          e.target.value = '';
        }}
      />
      <div className="mt-1 h-4">
        {hasError ? <p className="text-[#EF4444] text-xs">{errorMsg}</p>
          : imageUploading ? <p className="text-[#6B7280] text-xs animate-pulse">이미지 업로드 중...</p>
          : null}
      </div>
    </div>
  );
}

function BlockRenderer({ block, isFirst, onUpdate, onRemove, onUpload, onUpload2, onMerge, onColumnsUpload, onStepsUpload, registerRef, onEscape, onAddBlock, tocFromBlocks }: {
  block: EditorBlock;
  isFirst: boolean;
  onUpdate: (id: string, up: Partial<EditorBlock>) => void;
  onRemove: (id: string) => void;
  onUpload?: (blockId: string, file: File) => void;
  onUpload2?: (blockId: string, file: File) => void;
  onMerge?: (sourceId: string, targetId: string) => void;
  onColumnsUpload?: (blockId: string, cellId: string, file: File) => void;
  onStepsUpload?: (blockId: string, stepId: string, slot: 1 | 2, file: File) => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  onEscape?: (id: string) => void;
  onAddBlock: (afterId: string, type: BlockType) => void;
  tocFromBlocks: { id: string; text: string; anchor: string }[];
}) {
  switch (block.type) {
    case 'text':       return <TextBlock block={block} onChange={(id, html) => onUpdate(id, { html })} registerRef={registerRef} isFirst={isFirst} onAddBlockAfter={(type) => onAddBlock(block.id, type)} />;
    case 'callout':    return <CalloutBlock block={block} onChange={(id, up) => onUpdate(id, up as Partial<CalloutEditorBlock>)} onRemove={onRemove} onEscape={onEscape} />;
    case 'timeline':   return <TimelineBlock block={block} onChange={(id, up) => onUpdate(id, up as Partial<TimelineEditorBlock>)} onRemove={onRemove} />;
    case 'toc':        return <TableOfContentsBlock block={block} onChange={(id, up) => onUpdate(id, up as Partial<TocEditorBlock>)} onRemove={onRemove} h2Items={tocFromBlocks} />;
    case 'divider':    return <DividerBlock block={block} onChange={(id, up) => onUpdate(id, up as Partial<DividerEditorBlock>)} onRemove={onRemove} />;
    case 'youtube':    return <YouTubeBlock block={block} onRemove={onRemove} />;
    case 'image':      return <ImageBlock block={block} onChange={(id, up) => onUpdate(id, up as Partial<ImageEditorBlock>)} onRemove={onRemove} onUpload={onUpload} onUpload2={onUpload2} onMerge={onMerge} />;
    case 'table':      return <TableBlock block={block} onChange={(id, up) => onUpdate(id, up as Partial<TableEditorBlock>)} onRemove={onRemove} />;
    case 'columns':    return <ColumnsBlock block={block} onChange={(id, up) => onUpdate(id, up as Partial<ColumnsEditorBlock>)} onRemove={onRemove} onUpload={onColumnsUpload} />;
    case 'compare':    return <CompareBlock block={block} onChange={(id, up) => onUpdate(id, up as Partial<CompareEditorBlock>)} onRemove={onRemove} />;
    case 'info-card':  return <InfoCardBlock block={block} onChange={(id, up) => onUpdate(id, up as Partial<InfoCardEditorBlock>)} onRemove={onRemove} />;
    case 'steps':      return <StepsBlock block={block} onChange={(id, up) => onUpdate(id, up as Partial<StepsEditorBlock>)} onRemove={onRemove} onUpload={onStepsUpload} />;
    default: return null;
  }
}
