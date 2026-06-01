# Storyspanner Web - Claude Code 가이드

## 프로젝트 개요
- 서비스명: 스토리슈페너 (Storyspanner)
- 종류: 커뮤니티 포털 웹사이트
- 벤치마킹: 디시인사이드 (기능) + 네이버 (UI)
- 스택: Next.js 15 + TypeScript + Tailwind CSS + Firebase

---

## 핵심 원칙 (반드시 준수)

### 1. 클린 아키텍처
모든 코드는 역할별로 반드시 분리한다.
page.tsx 안에 로직 직접 작성 절대 금지.

### 2. 리액트 통일
useState, useEffect 등 React 훅은 반드시 hooks/ 폴더에서만 사용.
컴포넌트는 UI 렌더링만 담당.

### 3. Firebase 우선
모든 데이터는 Firebase에 저장. localStorage 사용 금지.

---

## 폴더 구조 규칙

```
app/
├── (auth)/
│   ├── login/
│   │   ├── page.tsx                ← 화면 껍데기만
│   │   ├── components/
│   │   │   ├── LoginForm.tsx       ← UI 조립
│   │   │   └── LoginInput.tsx      ← 공용 입력창
│   │   └── hooks/
│   │       ├── useLogin.ts         ← 최종 실행
│   │       ├── useLoginForm.ts     ← 입력값 상태
│   │       └── useLoginValidate.ts ← 유효성 검사
│   └── register/
│       ├── page.tsx
│       ├── components/
│       └── hooks/
├── (main)/
│   ├── page.tsx                    ← 홈
│   ├── [category]/
│   │   ├── page.tsx
│   │   ├── components/
│   │   └── hooks/
│   └── posts/
│       └── [id]/
│           ├── page.tsx
│           ├── components/
│           └── hooks/
├── mypage/
│   ├── page.tsx
│   ├── components/
│   └── hooks/
├── admin/
│   ├── page.tsx
│   ├── components/
│   └── hooks/
└── write/
    ├── page.tsx
    ├── components/
    └── hooks/

lib/
├── firebase/
│   ├── config.ts                   ← Firebase 초기화
│   ├── auth.ts                     ← 인증 관련
│   ├── firestore.ts                ← DB 관련
│   └── storage.ts                  ← 파일 업로드
├── services/
│   ├── authService.ts              ← 로그인/회원가입 로직
│   ├── postService.ts              ← 게시글 CRUD
│   ├── userService.ts              ← 회원 관리
│   ├── commentService.ts           ← 댓글
│   ├── likeService.ts              ← 좋아요
│   ├── reportService.ts            ← 신고
│   └── notificationService.ts     ← 알림
├── hooks/
│   └── useAuth.ts                  ← 전역 인증 상태
└── types/
    └── index.ts                    ← 타입 정의 모음

components/
└── ui/
    ├── Button.tsx                  ← 공용 버튼
    ├── Input.tsx                   ← 공용 입력창
    ├── Modal.tsx                   ← 공용 모달
    ├── Badge.tsx                   ← 공용 뱃지
    └── Header.tsx                  ← 공용 헤더
```

---

## hooks 분리 규칙

훅은 반드시 역할별로 3개로 쪼갠다:

```
useXxxForm.ts      → 입력값 상태만 (useState)
useXxxValidate.ts  → 유효성 검사만
useXxx.ts          → 위 두개 합쳐서 최종 실행 + Firebase 연동
```

---

## 파일 확장자 규칙

- `.ts`  → 로직만 (hooks, services, types)
- `.tsx` → 화면 포함 (components, page)

---

## Firebase 구조

### Firestore 컬렉션 전체 목록

```
users / posts / comments / likes / reports / notifications / ads
```

### 컬렉션별 필드 정의

#### `users` — 회원 정보
| 필드 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|------|------|
| id | string | - | ✓ | Firebase UID (= 문서 ID) |
| userId | string | - | ✓ | 로그인용 username (unique) |
| email | string | - | ✓ | 이메일 |
| name | string | - | ✓ | 실명 |
| nickname | string | - | ✓ | 닉네임 |
| phone | string | '' | - | 전화번호 (소셜 로그인 시 빈 문자열) |
| birthDate | string | '' | - | YYYY-MM-DD (소셜 로그인 시 빈 문자열) |
| level | number | 1 | ✓ | 1~5 (일반→관리자) |
| status | string | 'active' | ✓ | active / suspended / dormant / withdrawn |
| provider | string | 'email' | ✓ | email / google / kakao / naver |
| interests | string[] | [] | ✓ | Category[] |
| points | number | 0 | ✓ | 포인트 잔액 |
| postCount | number | 0 | ✓ | 작성 글 수 |
| commentCount | number | 0 | ✓ | 작성 댓글 수 |
| followerCount | number | 0 | ✓ | 팔로워 수 |
| followingCount | number | 0 | ✓ | 팔로잉 수 |
| agreedToPrivacy | boolean | true | ✓ | 개인정보 동의 여부 |
| agreedToMarketing | boolean | false | ✓ | 마케팅 동의 여부 |
| lastActiveAt | Timestamp | serverTimestamp() | ✓ | 마지막 활동 시각 |
| createdAt | Timestamp | serverTimestamp() | ✓ | 가입 시각 |

#### `posts` — 게시글
| 필드 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|------|------|
| title | string | - | ✓ | 제목 |
| content | string | - | ✓ | 본문 HTML |
| category | string | - | ✓ | Category (게임/의료정보/…) |
| userId | string | - | ✓ | 작성자 Firebase UID |
| nickname | string | - | ✓ | 작성자 닉네임 |
| status | string | 'approved' | ✓ | pending / approved / rejected / deleted |
| views | number | 0 | ✓ | 조회수 |
| likeCount | number | 0 | ✓ | 좋아요 수 |
| commentCount | number | 0 | ✓ | 댓글 수 |
| hashtags | string[] | [] | ✓ | 해시태그 목록 (최대 10개) |
| imageUrls | string[] | [] | ✓ | 본문 이미지 URL 목록 |
| thumbnailUrl | string | '' | - | 썸네일 이미지 URL |
| createdAt | Timestamp | serverTimestamp() | ✓ | 작성 시각 |
| updatedAt | Timestamp | serverTimestamp() | ✓ | 수정 시각 |

#### `comments` — 댓글
| 필드 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|------|------|
| postId | string | - | ✓ | 게시글 ID |
| userId | string | - | ✓ | 작성자 UID |
| nickname | string | - | ✓ | 작성자 닉네임 |
| content | string | - | ✓ | 댓글 내용 |
| parentId | string\|null | null | - | 대댓글이면 부모 댓글 ID |
| depth | number | 0 | ✓ | 0: 댓글, 1: 대댓글 |
| createdAt | Timestamp | serverTimestamp() | ✓ | |
| updatedAt | Timestamp | serverTimestamp() | ✓ | |

#### `likes` — 좋아요
| 필드 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|------|------|
| postId | string | - | ✓ | 게시글 ID |
| userId | string | - | ✓ | 누른 사용자 UID |
| createdAt | Timestamp | serverTimestamp() | ✓ | |

#### `reports` — 신고
| 필드 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|------|------|
| postId | string | - | ✓ | 신고 대상 게시글 ID |
| userId | string | - | ✓ | 신고한 사용자 UID |
| reason | string | - | ✓ | ReportReason 열거값 |
| detail | string | '' | - | 신고 상세 내용 |
| status | string | 'pending' | ✓ | pending / resolved / ignored |
| createdAt | Timestamp | serverTimestamp() | ✓ | |

#### `notifications` — 알림
| 필드 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|------|------|
| userId | string | - | ✓ | 알림 수신자 UID |
| type | string | - | ✓ | comment/reply/like/follow/announcement/post_approved/post_rejected |
| message | string | - | ✓ | 알림 본문 |
| postId | string | - | - | 관련 게시글 ID |
| commentId | string | - | - | 관련 댓글 ID |
| fromUserId | string | - | - | 알림 발생 사용자 UID |
| read | boolean | false | ✓ | 읽음 여부 |
| createdAt | Timestamp | serverTimestamp() | ✓ | |

#### `ads` — 광고 배너
| 필드 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|------|------|
| title | string | - | ✓ | 광고 제목 |
| imageUrl | string | - | ✓ | 배너 이미지 URL |
| linkUrl | string | - | ✓ | 클릭 시 이동 URL |
| position | string | 'list' | ✓ | list / sidebar / top / bottom |
| startDate | Timestamp | - | ✓ | 게재 시작일 |
| endDate | Timestamp | - | ✓ | 게재 종료일 |
| active | boolean | true | ✓ | 활성화 여부 |
| createdAt | Timestamp | serverTimestamp() | ✓ | |

### 서비스 레이어 규칙

- **저장 시**: undefined 필드 금지 → 항상 기본값(빈 문자열/''/0/[]/false)으로 대체
- **읽기 시**: `normalizePost()` 등 정규화 함수로 누락 필드에 기본값 보장
- **날짜**: 저장 시 `serverTimestamp()` 사용, 읽기 시 `Timestamp` 타입으로 처리
- **숫자 카운터**: views / likeCount / commentCount 기본값 0, 증가는 `increment()`

---

## 디자인 시스템

- 모드: 라이트 모드
- 배경색: #F8F7F4 (전체), #FFFFFF (카드)
- 주요색: #111111 (버튼, 강조)
- 보조색: #6B7280 (설명 텍스트)
- 테두리: #E5E7EB
- 에러색: #EF4444
- 성공색: #16A34A
- 폰트: -apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif
- 버튼 border-radius: 10px
- 카드 border-radius: 16px

---

## 카테고리 목록

10개 대분류. 상수는 `lib/constants/categories.ts`의 `CATEGORY_LIST`에서 중앙 관리.
컴포넌트/페이지에 카테고리 목록 직접 하드코딩 금지.

| ID (URL slug)   | Label (Firestore 저장값) | Emoji |
|-----------------|--------------------------|-------|
| food-review     | 맛집 / 리뷰              | 🍽️   |
| life-local      | 생활 / 지역 정보          | 🏘️   |
| health          | 의료 / 건강              | 🏥   |
| interior-diy    | 인테리어 / DIY           | 🛠️   |
| finance-law     | 금융 / 법률              | ⚖️   |
| lifestyle       | 라이프스타일             | ✨   |
| education       | 교육 / 육아              | 📚   |
| travel-culture  | 여행 / 문화              | ✈️   |
| auto            | 자동차 / 모빌리티         | 🚗   |
| beauty-fashion  | 뷰티 / 패션              | 💄   |

---

## 회원 레벨

- 레벨1: 일반회원
- 레벨2: 활동회원
- 레벨3: 우수회원
- 레벨4: 운영회원
- 레벨5: 관리자

---

## 광고 배너 규칙

게시글 목록에서 3개마다 광고 배너 1개 삽입.

---

## 코드 작성 시 절대 금지 사항

- page.tsx 안에 로직 직접 작성
- localStorage 사용
- 하드코딩된 데이터 (반드시 Firebase에서 가져올 것)
- 기존 아키텍처 임의 변경
- 파일 하나에 200줄 이상 작성 (반드시 쪼갤 것)

---

## 새 기능 추가 순서

1. types/index.ts 에 타입 먼저 정의
2. lib/services/ 에 서비스 함수 작성
3. hooks/ 에 훅 작성 (Form → Validate → 실행)
4. components/ 에 UI 작성
5. page.tsx 에 조립

---

## 현재 개발 우선순위

1. Firebase 연동 설정
2. 공용 타입 정의
3. 공용 UI 컴포넌트
4. 인증 (로그인 / 회원가입)
5. 홈페이지
6. 카테고리 게시판
7. 게시글 상세
8. 글쓰기
9. 마이페이지
10. 관리자 페이지
