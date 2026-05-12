'use client';

import { useState } from 'react';
import { FONTS, FONT_SIZES } from '@/lib/config/fonts';
import ColorPicker from './ColorPicker';
import { Tooltip, Btn, Sep, SELECT_CLS, PickerType } from './WriteToolbarHelpers';

interface Props {
  onBold: () => void; onItalic: () => void; onUnderline: () => void; onStrike: () => void;
  onFontSize: (px: number) => void; onFontFamily: (family: string) => void;
  onFontColor: (color: string) => void; onFontBgColor: (color: string) => void;
  onAlignLeft: () => void; onAlignCenter: () => void; onAlignRight: () => void;
  onLink: () => void; onCode: () => void; onImage: () => void;
  onYouTube: () => void; onFocusMode: () => void; onSpellCheck: () => void;
  onSplitView: () => void; onDraftList: () => void;
  onHeading2: () => void;
  onBlockquote: () => void; onDivider: () => void;
  isFocusMode?: boolean; spellCheckEnabled?: boolean; isSplitView?: boolean;
  onSaveSelection?: () => void;
}

export default function WriteToolbar({
  onBold, onItalic, onUnderline, onStrike,
  onFontSize, onFontFamily, onFontColor, onFontBgColor,
  onAlignLeft, onAlignCenter, onAlignRight,
  onLink, onCode, onImage, onYouTube, onFocusMode, onSpellCheck, onSplitView, onDraftList,
  onHeading2, onBlockquote, onDivider,
  isFocusMode, spellCheckEnabled, isSplitView, onSaveSelection,
}: Props) {
  const [picker, setPicker] = useState<PickerType>('none');
  const [fontColorPreview, setFontColorPreview] = useState('#000000');
  const [bgColorPreview, setBgColorPreview] = useState('#FFFF00');

  const togglePicker = (type: PickerType) => { onSaveSelection?.(); setPicker((p) => (p === type ? 'none' : type)); };
  const handleFontColor = (c: string) => { setFontColorPreview(c); onFontColor(c); setPicker('none'); };
  const handleBgColor = (c: string) => { setBgColorPreview(c); onFontBgColor(c); setPicker('none'); };

  return (
    <div className="bg-[#FAFAFA] border-b border-[#E5E7EB] px-3 py-2 flex items-center gap-0.5 flex-wrap">
      <Btn tooltip="굵게 (Ctrl+B)" onClick={onBold}><b>B</b></Btn>
      <Btn tooltip="기울임 (Ctrl+I)" onClick={onItalic}><i>I</i></Btn>
      <Btn tooltip="밑줄 (Ctrl+U)" onClick={onUnderline}><u>U</u></Btn>
      <Btn tooltip="취소선" onClick={onStrike}><s>S</s></Btn>
      <Sep />
      <div className="relative group">
        <select defaultValue="" className={`${SELECT_CLS} w-[68px]`}
          onChange={(e) => { const v = Number(e.target.value); if (v) onFontSize(v); e.target.value = ''; }}>
          <option value="" disabled>크기</option>
          {FONT_SIZES.map((s) => <option key={s} value={s}>{s}px</option>)}
        </select>
        <Tooltip label="글자 크기" />
      </div>
      <div className="relative group">
        <select defaultValue="" className={`${SELECT_CLS} w-[110px]`}
          onChange={(e) => { if (e.target.value) onFontFamily(e.target.value); e.target.value = ''; }}>
          <option value="" disabled>폰트 선택</option>
          {FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <Tooltip label="폰트 선택" />
      </div>
      <Sep />
      <div className="relative group">
        <button type="button" onMouseDown={(e) => { e.preventDefault(); togglePicker('fontColor'); }}
          className="w-7 h-7 flex flex-col items-center justify-center gap-0.5 hover:bg-[#E5E7EB] rounded transition-colors">
          <span className="text-[12px] font-bold text-[#4B5563] leading-none">A</span>
          <span className="w-4 h-1 rounded-sm" style={{ backgroundColor: fontColorPreview }} />
        </button>
        <Tooltip label="글자 색" />
        {picker === 'fontColor' && <ColorPicker onSelect={handleFontColor} onClose={() => setPicker('none')} />}
      </div>
      <div className="relative group">
        <button type="button" onMouseDown={(e) => { e.preventDefault(); togglePicker('bgColor'); }}
          className="w-7 h-7 flex flex-col items-center justify-center gap-0.5 hover:bg-[#E5E7EB] rounded transition-colors">
          <span className="text-[12px] font-bold text-[#4B5563] leading-none" style={{ backgroundColor: bgColorPreview, padding: '0 2px', borderRadius: 2 }}>A</span>
          <span className="text-[8px] text-[#9CA3AF] leading-none">배경</span>
        </button>
        <Tooltip label="배경 색" />
        {picker === 'bgColor' && <ColorPicker onSelect={handleBgColor} onClose={() => setPicker('none')} />}
      </div>
      <Sep />
      <Btn tooltip="왼쪽" onClick={onAlignLeft}><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="5" width="18" height="2" rx="1"/><rect x="3" y="11" width="12" height="2" rx="1"/><rect x="3" y="17" width="15" height="2" rx="1"/></svg></Btn>
      <Btn tooltip="가운데" onClick={onAlignCenter}><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="5" width="18" height="2" rx="1"/><rect x="6" y="11" width="12" height="2" rx="1"/><rect x="4" y="17" width="16" height="2" rx="1"/></svg></Btn>
      <Btn tooltip="오른쪽" onClick={onAlignRight}><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="5" width="18" height="2" rx="1"/><rect x="9" y="11" width="12" height="2" rx="1"/><rect x="6" y="17" width="15" height="2" rx="1"/></svg></Btn>
      <Sep />
      <Btn tooltip="링크" onClick={onLink}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg></Btn>
      <Btn tooltip="코드" onClick={onCode}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></Btn>
      <Btn tooltip="이미지" onClick={onImage}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></Btn>
      <Btn tooltip="YouTube" onClick={onYouTube}><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.4 2.7 12 2.7 12 2.7s-4.4 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.3.3 4.3s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.5 21.8 12 21.8 12 21.8s4.4 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.3v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/></svg></Btn>
      <Sep />
      <Btn tooltip="맞춤법 검사" onClick={onSpellCheck} active={spellCheckEnabled}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></Btn>
      <Btn tooltip={isFocusMode ? '집중모드 종료' : '집중모드'} onClick={onFocusMode} active={isFocusMode}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg></Btn>
      <Btn tooltip={isSplitView ? '미리보기 닫기' : '미리보기'} onClick={onSplitView} active={isSplitView}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></Btn>
      <Btn tooltip="저장 목록" onClick={onDraftList}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg></Btn>
      <Sep />
      <Btn tooltip="소제목 H2 (목차 자동 등록)" onClick={onHeading2}><span className="text-[12px] font-black text-[#6C3FC5]">H2</span></Btn>
      <Btn tooltip="인용구" onClick={onBlockquote}><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg></Btn>
      <Btn tooltip="구분선" onClick={onDivider}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/></svg></Btn>
    </div>
  );
}
