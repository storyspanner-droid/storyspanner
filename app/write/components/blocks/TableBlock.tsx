'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { TableEditorBlock, TableStyle, CellStyle } from '../../types';

interface Props {
  block: TableEditorBlock;
  onChange: (id: string, updates: Partial<TableEditorBlock>) => void;
  onRemove: (id: string) => void;
}

const STYLES: { value: TableStyle; label: string }[] = [
  { value: 'default', label: '기본형' },
  { value: 'simple',  label: '심플형' },
  { value: 'color',   label: '컬러형' },
];

const PALETTE = [
  '#FFFFFF', '#F3F4F6', '#FEF3C7', '#FEE2E2', '#D1FAE5',
  '#DBEAFE', '#EDE9FE', '#FCE7F3', '#FFF7ED', '#F0FDF4',
  '#111111', '#6B7280',
];

function getCellBaseClass(s: TableStyle, ri: number, isH: boolean) {
  const base = 'px-3 py-2 min-w-[80px] focus:outline-none text-left text-[14px]';
  if (s === 'default') return `${base} border border-[#E5E7EB] ${isH ? 'bg-[#F3F4F6] font-semibold text-[#374151]' : 'text-[#111111]'}`;
  if (s === 'simple') return `${base} border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 ${isH ? 'font-bold text-[#111111]' : 'text-[#374151]'}`;
  const odd = !isH && ri % 2 === 1;
  return `${base} ${isH ? 'bg-[#6C3FC5] text-white font-semibold' : odd ? 'bg-[#F3EEFF] text-[#111111]' : 'text-[#111111]'}`;
}

function getCellInlineStyle(cellStyles: CellStyle[][] | undefined, ri: number, ci: number): React.CSSProperties {
  const cs = cellStyles?.[ri]?.[ci];
  if (!cs) return {};
  return {
    ...(cs.bg    ? { backgroundColor: cs.bg }   : {}),
    ...(cs.color ? { color:           cs.color } : {}),
  };
}

interface ColorPopupProps {
  onBg: (color: string) => void;
  onText: (color: string) => void;
  onReset: () => void;
  onClose: () => void;
}

function ColorPopup({ onBg, onText, onReset, onClose }: ColorPopupProps) {
  const bgInputRef  = useRef<HTMLInputElement>(null);
  const txtInputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute z-50 bg-white border border-[#E5E7EB] rounded-[10px] shadow-lg p-3 w-[220px]"
      style={{ top: '100%', left: 0 }}
    >
      <p className="text-[11px] font-bold text-[#6B7280] mb-2">배경색</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onBg(c)}
            style={{ background: c, border: '1px solid #E5E7EB' }}
            className="w-5 h-5 rounded-[4px] hover:scale-110 transition-transform shrink-0"
          />
        ))}
        <input
          ref={bgInputRef}
          type="color"
          className="w-5 h-5 rounded-[4px] cursor-pointer border border-[#E5E7EB]"
          onChange={(e) => onBg(e.target.value)}
          title="커스텀 배경색"
        />
      </div>
      <p className="text-[11px] font-bold text-[#6B7280] mb-2">글자색</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onText(c)}
            style={{ background: c, border: '1px solid #E5E7EB' }}
            className="w-5 h-5 rounded-[4px] hover:scale-110 transition-transform shrink-0"
          />
        ))}
        <input
          ref={txtInputRef}
          type="color"
          className="w-5 h-5 rounded-[4px] cursor-pointer border border-[#E5E7EB]"
          onChange={(e) => onText(e.target.value)}
          title="커스텀 글자색"
        />
      </div>
      <button
        type="button"
        onClick={onReset}
        className="w-full text-[11px] text-[#EF4444] border border-[#EF4444] rounded-[6px] py-1 hover:bg-[#FEF2F2] transition-colors"
      >
        색상 초기화
      </button>
    </div>
  );
}

export default function TableBlock({ block, onChange, onRemove }: Props) {
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState<{ ri: number; ci: number } | null>(null);
  const [colorPopup, setColorPopup] = useState<'cell' | 'row' | 'col' | null>(null);

  // 셀 DOM refs — rows × cols 2D 배열
  const cellRefs = useRef<(HTMLTableCellElement | null)[][]>([]);

  const s = block.tableStyle ?? 'default';
  const colCount = block.rows[0]?.length ?? 3;
  const outerBorder = s === 'default' ? 'border border-[#E5E7EB]' : '';

  // 최초 마운트 시에만 각 셀 innerHTML 설정
  useEffect(() => {
    block.rows.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        const el = cellRefs.current[ri]?.[ci];
        if (el) el.innerHTML = cell;
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setRows = (rows: string[][]) => onChange(block.id, { rows });

  const updateCell = useCallback((ri: number, ci: number, html: string) => {
    onChange(block.id, {
      rows: block.rows.map((r, i) => i === ri ? r.map((c, j) => j === ci ? html : c) : r),
    });
  }, [block.id, block.rows, onChange]);

  const addRow = () => {
    const newRows = [...block.rows, Array(colCount).fill('')];
    setRows(newRows);
  };
  const addCol = () => setRows(block.rows.map((r) => [...r, '']));
  const removeLastRow = () => { if (block.rows.length > 1) setRows(block.rows.slice(0, -1)); };
  const removeLastCol = () => { if (colCount > 1) setRows(block.rows.map((r) => r.slice(0, -1))); };

  const getOrInitCellStyles = (): CellStyle[][] =>
    block.cellStyles ??
    block.rows.map((r) => r.map(() => ({})));

  const setCellStyle = (ri: number, ci: number, patch: Partial<CellStyle>) => {
    const styles = getOrInitCellStyles().map((row, rowIdx) =>
      row.map((cell, colIdx) => (rowIdx === ri && colIdx === ci ? { ...cell, ...patch } : cell))
    );
    onChange(block.id, { cellStyles: styles });
  };

  const setRowStyle = (ri: number, patch: Partial<CellStyle>) => {
    const styles = getOrInitCellStyles().map((row, rowIdx) =>
      rowIdx === ri ? row.map((cell) => ({ ...cell, ...patch })) : row
    );
    onChange(block.id, { cellStyles: styles });
  };

  const setColStyle = (ci: number, patch: Partial<CellStyle>) => {
    const styles = getOrInitCellStyles().map((row) =>
      row.map((cell, colIdx) => (colIdx === ci ? { ...cell, ...patch } : cell))
    );
    onChange(block.id, { cellStyles: styles });
  };

  const resetCellStyle = () => {
    if (!selected) return;
    const styles = getOrInitCellStyles().map((row, ri) =>
      row.map((cell, ci) => (ri === selected.ri && ci === selected.ci ? {} : cell))
    );
    onChange(block.id, { cellStyles: styles });
    setColorPopup(null);
  };

  const applyPatch = (patch: Partial<CellStyle>, mode: 'cell' | 'row' | 'col') => {
    if (!selected) return;
    if (mode === 'cell') setCellStyle(selected.ri, selected.ci, patch);
    if (mode === 'row')  setRowStyle(selected.ri, patch);
    if (mode === 'col')  setColStyle(selected.ci, patch);
  };

  return (
    <div
      onFocus={() => setFocused(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) { setFocused(false); setColorPopup(null); } }}
      className="my-2"
    >
      {focused && (
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap relative">
          {/* 행/열/크기 조작 */}
          <button type="button" onClick={addCol} className="text-[11px] border border-[#E5E7EB] rounded px-2 py-1 text-[#6B7280] hover:text-[#6C3FC5] hover:border-[#6C3FC5] transition-colors">+ 열</button>
          <button type="button" onClick={removeLastCol} className="text-[11px] border border-[#E5E7EB] rounded px-2 py-1 text-[#6B7280] hover:text-[#EF4444] hover:border-[#EF4444] transition-colors">− 열</button>
          <button type="button" onClick={addRow} className="text-[11px] border border-[#E5E7EB] rounded px-2 py-1 text-[#6B7280] hover:text-[#6C3FC5] hover:border-[#6C3FC5] transition-colors">+ 행</button>
          <button type="button" onClick={removeLastRow} className="text-[11px] border border-[#E5E7EB] rounded px-2 py-1 text-[#6B7280] hover:text-[#EF4444] hover:border-[#EF4444] transition-colors">− 행</button>
          <div className="w-px h-4 bg-[#E5E7EB] mx-0.5" />
          {/* 스타일 선택 */}
          {STYLES.map((st) => (
            <button key={st.value} type="button" onClick={() => onChange(block.id, { tableStyle: st.value })}
              className={`text-[11px] border rounded px-2 py-1 transition-colors ${s === st.value ? 'border-[#6C3FC5] text-[#6C3FC5] bg-[#F3EEFF]' : 'border-[#E5E7EB] text-[#6B7280] hover:text-[#6C3FC5]'}`}>
              {st.label}
            </button>
          ))}
          <div className="w-px h-4 bg-[#E5E7EB] mx-0.5" />
          {/* 색상 적용 대상 */}
          {selected !== null && (
            <>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setColorPopup(colorPopup === 'cell' ? null : 'cell')}
                  className={`text-[11px] border rounded px-2 py-1 transition-colors flex items-center gap-1 ${colorPopup === 'cell' ? 'border-[#6C3FC5] text-[#6C3FC5] bg-[#F3EEFF]' : 'border-[#E5E7EB] text-[#6B7280] hover:text-[#6C3FC5]'}`}
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-yellow-300 to-pink-400 inline-block" />
                  셀 색상
                </button>
                {colorPopup === 'cell' && (
                  <ColorPopup
                    onBg={(c) => applyPatch({ bg: c }, 'cell')}
                    onText={(c) => applyPatch({ color: c }, 'cell')}
                    onReset={resetCellStyle}
                    onClose={() => setColorPopup(null)}
                  />
                )}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setColorPopup(colorPopup === 'row' ? null : 'row')}
                  className={`text-[11px] border rounded px-2 py-1 transition-colors flex items-center gap-1 ${colorPopup === 'row' ? 'border-[#6C3FC5] text-[#6C3FC5] bg-[#F3EEFF]' : 'border-[#E5E7EB] text-[#6B7280] hover:text-[#6C3FC5]'}`}
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-blue-300 to-purple-400 inline-block" />
                  행 색상
                </button>
                {colorPopup === 'row' && (
                  <ColorPopup
                    onBg={(c) => applyPatch({ bg: c }, 'row')}
                    onText={(c) => applyPatch({ color: c }, 'row')}
                    onReset={() => { if (selected) setRowStyle(selected.ri, {}); setColorPopup(null); }}
                    onClose={() => setColorPopup(null)}
                  />
                )}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setColorPopup(colorPopup === 'col' ? null : 'col')}
                  className={`text-[11px] border rounded px-2 py-1 transition-colors flex items-center gap-1 ${colorPopup === 'col' ? 'border-[#6C3FC5] text-[#6C3FC5] bg-[#F3EEFF]' : 'border-[#E5E7EB] text-[#6B7280] hover:text-[#6C3FC5]'}`}
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-green-300 to-teal-400 inline-block" />
                  열 색상
                </button>
                {colorPopup === 'col' && (
                  <ColorPopup
                    onBg={(c) => applyPatch({ bg: c }, 'col')}
                    onText={(c) => applyPatch({ color: c }, 'col')}
                    onReset={() => { if (selected) setColStyle(selected.ci, {}); setColorPopup(null); }}
                    onClose={() => setColorPopup(null)}
                  />
                )}
              </div>
            </>
          )}
          <button type="button" onClick={() => onRemove(block.id)} className="ml-auto text-[11px] border border-[#E5E7EB] rounded px-2 py-1 text-[#9CA3AF] hover:text-[#EF4444] hover:border-[#EF4444] transition-colors">삭제</button>
        </div>
      )}
      <div className={`overflow-x-auto rounded-[8px] ${outerBorder}`}>
        <table className="w-full border-collapse">
          <tbody>
            {block.rows.map((row, ri) => {
              const isH = block.headers && ri === 0;
              if (!cellRefs.current[ri]) cellRefs.current[ri] = [];
              return (
                <tr key={ri}>
                  {row.map((_, ci) => {
                    const Tag = isH ? 'th' : 'td';
                    const isSelected = selected?.ri === ri && selected?.ci === ci;
                    return (
                      <Tag
                        key={ci}
                        ref={(el) => { cellRefs.current[ri][ci] = el; }}
                        contentEditable
                        suppressContentEditableWarning
                        onFocus={() => setSelected({ ri, ci })}
                        onBlur={(e) => updateCell(ri, ci, e.currentTarget.innerHTML)}
                        onCompositionEnd={(e) => updateCell(ri, ci, e.currentTarget.innerHTML)}
                        className={`${getCellBaseClass(s, ri, isH ?? false)} ${isSelected ? 'outline outline-2 outline-[#6C3FC5] outline-offset-[-2px]' : ''}`}
                        style={getCellInlineStyle(block.cellStyles, ri, ci)}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
