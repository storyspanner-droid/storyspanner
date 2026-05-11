export type CalloutType = 'tip' | 'warning' | 'error' | 'info';
export type DividerStyle = 'solid' | 'dashed' | 'icon';
export type ImageLayout = 'full' | 'padded' | 'small' | 'grid-2';
export type ImageTextAlign = 'center' | 'left' | 'right';

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  content: string;
}

export interface TocItem {
  id: string;
  text: string;
  anchor: string;
}

interface BaseBlock { id: string; }

export interface TextEditorBlock extends BaseBlock {
  type: 'text';
  html: string;
}

export interface ImageEditorBlock extends BaseBlock {
  type: 'image';
  url: string;
  url2?: string;
  caption: string;
  layout: ImageLayout;
  textAlign: ImageTextAlign;
}

export interface CalloutEditorBlock extends BaseBlock {
  type: 'callout';
  calloutType: CalloutType;
  content: string;
}

export interface TimelineEditorBlock extends BaseBlock {
  type: 'timeline';
  items: TimelineItem[];
}

export interface TocEditorBlock extends BaseBlock {
  type: 'toc';
  items: TocItem[];
}

export interface DividerEditorBlock extends BaseBlock {
  type: 'divider';
  style: DividerStyle;
}

export interface YouTubeEditorBlock extends BaseBlock {
  type: 'youtube';
  videoId: string;
}

export type TableStyle = 'default' | 'simple' | 'color';

export interface CellStyle {
  bg?: string;
  color?: string;
}

export interface TableEditorBlock extends BaseBlock {
  type: 'table';
  rows: string[][];
  headers: boolean;
  tableStyle: TableStyle;
  cellStyles?: CellStyle[][];
}

// 컬럼 레이아웃 블록
export interface ColumnCell {
  id: string;
  html: string;
  imageUrl?: string;
  bg?: string;
}
export interface ColumnsEditorBlock extends BaseBlock {
  type: 'columns';
  cols: 1 | 2 | 3;
  cells: ColumnCell[];
}

// 비교표 블록
export interface CompareItem { text: string; }
export interface CompareEditorBlock extends BaseBlock {
  type: 'compare';
  leftTitle: string;
  rightTitle: string;
  leftItems: CompareItem[];
  rightItems: CompareItem[];
  leftColor?: string;
  rightColor?: string;
}

// 정보 카드 블록
export interface InfoCardItem {
  id: string;
  label: string;
  value: string;
  icon?: string;
}
export interface InfoCardEditorBlock extends BaseBlock {
  type: 'info-card';
  title?: string;
  cols: 2 | 3;
  items: InfoCardItem[];
  accent?: string;
}

// 스텝 카드 블록
export interface StepItem {
  id: string;
  number: number;
  title: string;
  content: string;
  imageUrl?: string;
  imageUrl2?: string;
}
export interface StepsEditorBlock extends BaseBlock {
  type: 'steps';
  items: StepItem[];
}

export type EditorBlock =
  | TextEditorBlock
  | ImageEditorBlock
  | CalloutEditorBlock
  | TimelineEditorBlock
  | TocEditorBlock
  | DividerEditorBlock
  | YouTubeEditorBlock
  | TableEditorBlock
  | ColumnsEditorBlock
  | CompareEditorBlock
  | InfoCardEditorBlock
  | StepsEditorBlock;

export type BlockType = EditorBlock['type'];
