'use client';

import { FloatingPos } from '../hooks/useFloatingToolbar';

interface Props {
  pos: FloatingPos;
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onLink: () => void;
  onQuote: () => void;
  onCallout: () => void;
}

function FBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className="w-7 h-7 flex items-center justify-center text-white text-[12px] hover:bg-white/20 rounded transition-colors"
    >
      {children}
    </button>
  );
}

export default function FloatingToolbar({ pos, onBold, onItalic, onUnderline, onLink, onQuote, onCallout }: Props) {
  return (
    <div
      className="fixed z-50 flex items-center gap-0.5 bg-[#1F2937] rounded-[8px] px-1.5 py-1 shadow-xl pointer-events-auto"
      style={{ top: pos.top, left: pos.left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <FBtn label="굵게" onClick={onBold}><b>B</b></FBtn>
      <FBtn label="기울임" onClick={onItalic}><i>I</i></FBtn>
      <FBtn label="밑줄" onClick={onUnderline}><u>U</u></FBtn>
      <div className="w-px h-4 bg-white/20 mx-0.5" />
      <FBtn label="링크" onClick={onLink}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
        </svg>
      </FBtn>
      <FBtn label="인용구" onClick={onQuote}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
        </svg>
      </FBtn>
      <FBtn label="강조박스" onClick={onCallout}><span className="text-[11px]">💡</span></FBtn>
    </div>
  );
}
