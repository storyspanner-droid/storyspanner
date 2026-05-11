/**
 * 에디터 폰트 설정 파일
 *
 * ── 폰트 추가 방법 ────────────────────────────────────────────────────────────
 * 아래 FONTS 배열에 FontConfig 객체를 추가하면 에디터 드롭다운에 자동 반영됩니다.
 *
 * 구글 폰트 추가 예시:
 *   1. GOOGLE_FONT_FAMILIES 배열에 폰트명 추가 (공백 포함 그대로)
 *      예: 'Nanum Gothic'
 *      웨이트 지정: 'Nanum Gothic:wght@400;700'
 *   2. FONTS 배열에 아이템 추가:
 *      { label: '나눔고딕', value: "'Nanum Gothic', sans-serif" }
 *
 * 개별 CDN 폰트 추가 예시 (배민, 카카오 등):
 *   FONTS 배열에 cdnUrl 필드를 포함해서 추가:
 *   {
 *     label: '새폰트',
 *     value: "'NewFont', sans-serif",
 *     cdnUrl: 'https://cdn.example.com/font.css',
 *   }
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface FontConfig {
  /** 드롭다운에 표시될 이름 */
  label: string;
  /** execCommand('fontName') 에 전달할 CSS font-family 값 */
  value: string;
  /** 개별 CDN CSS URL (없으면 Google Fonts 배치 로드 또는 시스템 폰트) */
  cdnUrl?: string;
}

// Google Fonts 배치 로드 목록 (한 번의 CDN 요청으로 처리)
// 웨이트 지정이 필요하면 'FontName:wght@300;400;700' 형식으로 작성
export const GOOGLE_FONT_FAMILIES: string[] = [
  'Noto+Sans+KR:wght@300;400;500;700',
  'Noto+Serif+KR:wght@300;400;700',
  'Black+Han+Sans',
  'Jua',
  'Gaegu',
  'Do+Hyeon',
  'Sunflower:wght@300;500;700',
  'Dokdo',
];

export const FONTS: FontConfig[] = [
  // ── 시스템 폰트 ──────────────────────────────────────────────────────────
  {
    label: '기본 (시스템 폰트)',
    value: "-apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
  },

  // ── 구글 폰트 ────────────────────────────────────────────────────────────
  { label: 'Noto Sans KR',   value: "'Noto Sans KR', sans-serif" },
  { label: 'Noto Serif KR',  value: "'Noto Serif KR', serif" },
  { label: 'Black Han Sans', value: "'Black Han Sans', sans-serif" },
  { label: 'Jua',            value: "'Jua', sans-serif" },
  { label: 'Gaegu',          value: "'Gaegu', cursive" },
  { label: 'Do Hyeon',       value: "'Do Hyeon', sans-serif" },
  { label: 'Sunflower',      value: "'Sunflower', sans-serif" },
  { label: 'Dokdo',          value: "'Dokdo', cursive" },

  // ── 배달의민족 ───────────────────────────────────────────────────────────
  {
    label: '한나체 (배민)',
    value: "'BaeminHannaAir', sans-serif",
    cdnUrl: 'https://cdn.jsdelivr.net/gh/webfontworld/baemin/BaeminHannaAir.css',
  },
  {
    label: '연성체 (배민)',
    value: "'BaeminYeonSung', cursive",
    cdnUrl: 'https://cdn.jsdelivr.net/gh/webfontworld/baemin/BaeminYeonSung.css',
  },
  {
    label: '도현체 (배민)',
    value: "'BaeminDohyeon', sans-serif",
    cdnUrl: 'https://cdn.jsdelivr.net/gh/webfontworld/baemin/BaeminDohyeon.css',
  },

  // ── 카카오 ───────────────────────────────────────────────────────────────
  {
    label: '카카오 Big',
    value: "'Kakao', sans-serif",
    cdnUrl: 'https://cdn.jsdelivr.net/gh/webfontworld/kakao/Kakao.css',
  },
];

// 글자 크기 목록 (px)
export const FONT_SIZES: number[] = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];
