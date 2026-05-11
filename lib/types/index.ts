import { Timestamp } from 'firebase/firestore';

// ─── TocItem (목차 항목) ─────────────────────────────────────────────────────

export interface TocItem {
  id: string;              // DOM id (heading-slug) 또는 수동 id (toc-manual-xxx)
  text: string;            // 목차 표시 텍스트
  type: 'h2' | 'h3' | 'manual';  // h2: 소제목 자동, h3: 소소제목 자동, manual: 수동
  level: 1 | 2;            // 1: 최상위, 2: 들여쓰기
}

// ─── 공통 ──────────────────────────────────────────────────────────────────

export type Category =
  | '게임'
  | '의료정보'
  | '인테리어DIY'
  | '비즈니스'
  | '코인/투자'
  | '마케팅'
  | '공지사항';

export type UserLevel = 1 | 2 | 3 | 4 | 5;
// 1: 일반회원 | 2: 활동회원 | 3: 우수회원 | 4: 운영회원 | 5: 관리자

export type UserStatus = 'active' | 'suspended' | 'dormant' | 'withdrawn';
// active: 정상 | suspended: 정지 | dormant: 휴면 | withdrawn: 탈퇴

export type SocialProvider = 'kakao' | 'naver' | 'google' | 'email';

// ─── User ──────────────────────────────────────────────────────────────────

export interface User {
  id: string;              // Firebase UID (= Firestore 문서 ID)
  userId: string;          // 로그인용 username, unique
  email: string;
  name: string;            // 실명
  nickname: string;
  phone?: string;          // 소셜 로그인 시 미수집 가능
  birthDate?: string;      // YYYY-MM-DD, 소셜 로그인 시 미수집 가능
  level: UserLevel;        // 기본값 1
  status: UserStatus;      // 기본값 'active'
  provider: SocialProvider;
  interests: Category[];   // 기본값 []
  points: number;          // 기본값 0
  postCount: number;       // 기본값 0
  commentCount: number;    // 기본값 0
  followerCount: number;   // 기본값 0
  followingCount: number;  // 기본값 0
  agreedToPrivacy: boolean;
  agreedToMarketing: boolean;
  lastActiveAt: Timestamp;
  createdAt: Timestamp;
}

// ─── Post ──────────────────────────────────────────────────────────────────

export type PostStatus = 'pending' | 'approved' | 'rejected' | 'deleted';
// pending: 승인 대기 | approved: 승인됨 | rejected: 반려 | deleted: 삭제

export type AIGrade = 'A' | 'B' | 'C' | 'D';

export interface AIScore {
  total: number;           // 0~100점
  grade: AIGrade;
  completeness: number;    // 정보 완결성 점수
  abuseDetected: boolean;  // 어뷰징 탐지 여부
  detail: string;          // 판단 근거 — 관리자 전용 비공개
  scoredAt: Timestamp;
}

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
  endsAt?: Timestamp;
}

export interface Post {
  id: string;              // Firestore 문서 ID
  title: string;
  content: string;         // HTML 문자열
  category: Category;
  userId: string;
  nickname: string;
  status: PostStatus;      // 기본값 'approved'
  views: number;           // 기본값 0
  likeCount: number;       // 기본값 0
  commentCount: number;    // 기본값 0
  hashtags: string[];      // 기본값 []
  imageUrls: string[];     // 본문 삽입 이미지 URL 목록, 기본값 []
  thumbnailUrl?: string;   // 기본값 ''
  tableOfContents?: TocItem[];  // 목차 항목 목록 (선택)
  poll?: Poll;
  aiScore?: AIScore;       // 관리자 전용
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── TempPost (임시저장) ────────────────────────────────────────────────────

export interface TempPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  category?: Category;
  hashtags: string[];
  imageUrls: string[];
  savedAt: Timestamp;
}

// ─── DailyView (조회수 통계) ────────────────────────────────────────────────

export interface DailyView {
  id: string;
  postId: string;
  date: string;            // YYYY-MM-DD
  count: number;
}

// ─── Comment ───────────────────────────────────────────────────────────────

export type CommentDepth = 0 | 1;
// 0: 댓글 | 1: 대댓글 (2단계까지만 허용)

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  nickname: string;
  content: string;
  parentId?: string;       // 대댓글이면 부모 댓글 ID
  depth: CommentDepth;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Like ──────────────────────────────────────────────────────────────────

export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: Timestamp;
}

// ─── Bookmark ──────────────────────────────────────────────────────────────

export interface Bookmark {
  id: string;
  postId: string;
  userId: string;
  createdAt: Timestamp;
}

// ─── Report ────────────────────────────────────────────────────────────────

export type ReportStatus = 'pending' | 'resolved' | 'ignored';

export type ReportReason =
  | '스팸/광고'
  | '욕설/혐오'
  | '음란물'
  | '개인정보 침해'
  | '저작권 침해'
  | '기타';

export interface Report {
  id: string;
  postId: string;
  userId: string;
  reason: ReportReason;
  detail?: string;
  status: ReportStatus;
  createdAt: Timestamp;
}

// ─── Follow ────────────────────────────────────────────────────────────────

export interface Follow {
  id: string;
  followerId: string;      // 팔로우 하는 사람
  followingId: string;     // 팔로우 받는 사람
  createdAt: Timestamp;
}

// ─── Notification ──────────────────────────────────────────────────────────

export type NotificationType =
  | 'comment'
  | 'reply'
  | 'like'
  | 'follow'
  | 'announcement'
  | 'post_approved'
  | 'post_rejected';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  postId?: string;
  commentId?: string;
  fromUserId?: string;
  read: boolean;
  createdAt: Timestamp;
}

// ─── Ad ────────────────────────────────────────────────────────────────────

export type AdPosition = 'list' | 'sidebar' | 'top' | 'bottom';

export interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: AdPosition;
  startDate: Timestamp;
  endDate: Timestamp;
  active: boolean;
  createdAt: Timestamp;
}

// ─── SearchLog (인기 검색어) ────────────────────────────────────────────────

export interface SearchLog {
  id: string;
  keyword: string;
  count: number;
  updatedAt: Timestamp;
}

// ─── PointLog (포인트 적립 내역) ────────────────────────────────────────────

export type PointAction =
  | 'post_write'
  | 'comment_write'
  | 'like_received'
  | 'level_up';

export interface PointLog {
  id: string;
  userId: string;
  action: PointAction;
  points: number;
  createdAt: Timestamp;
}

// ─── PollVote (투표) ────────────────────────────────────────────────────────

export interface PollVote {
  id: string;
  postId: string;
  userId: string;
  optionId: string;
  createdAt: Timestamp;
}

// ─── Tag (해시태그 / 세부 카테고리) ─────────────────────────────────────────

export interface Tag {
  id: string;       // tagName을 slug화한 값 (Firestore 문서 ID)
  tagName: string;  // 실제 태그 이름
  count: number;    // 사용 횟수
  categoryId: string; // 주로 사용된 카테고리
}
