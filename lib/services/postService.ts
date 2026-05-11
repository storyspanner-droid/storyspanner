import {
  collection, query, where, orderBy, limit,
  getDocs, getDoc, addDoc, doc, updateDoc, deleteDoc, increment, Timestamp, serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
import db from '@/lib/firebase/firestore';
import { Post, Category, TocItem } from '@/lib/types';
import { incrementUserStat } from './userService';

// 읽기 시 누락 필드에 기본값 보장
function normalizePost(id: string, data: DocumentData): Post {
  return {
    ...data,
    id,
    views: data.views ?? 0,
    likeCount: data.likeCount ?? 0,
    commentCount: data.commentCount ?? 0,
    hashtags: data.hashtags ?? [],
    imageUrls: data.imageUrls ?? [],
    thumbnailUrl: data.thumbnailUrl ?? '',
    status: data.status ?? 'approved',
    tableOfContents: data.tableOfContents ?? [],
  } as Post;
}

export async function getLatestPosts(count = 30): Promise<Post[]> {
  const q = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => normalizePost(d.id, d.data()));
}

export async function getHotPosts(): Promise<Post[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const q = query(
      collection(db, 'posts'),
      where('createdAt', '>=', Timestamp.fromDate(today)),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snap = await getDocs(q);
    const posts = snap.docs.map((d) => normalizePost(d.id, d.data()));
    return posts
      .filter((p) => p.views > 0)
      .sort((a, b) => (b.views + b.likeCount) - (a.views + a.likeCount))
      .slice(0, 10);
  } catch {
    return [];
  }
}

export async function getWeeklyPosts(): Promise<Post[]> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  try {
    const q = query(
      collection(db, 'posts'),
      where('createdAt', '>=', Timestamp.fromDate(weekAgo)),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snap = await getDocs(q);
    const posts = snap.docs.map((d) => normalizePost(d.id, d.data()));
    return posts
      .filter((p) => p.views > 0)
      .sort((a, b) => (b.views + b.likeCount) - (a.views + a.likeCount))
      .slice(0, 10);
  } catch {
    return [];
  }
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const snap = await getDoc(doc(db, 'posts', id));
    if (!snap.exists()) return null;
    return normalizePost(snap.id, snap.data());
  } catch {
    return null;
  }
}

export async function incrementPostViews(id: string): Promise<void> {
  await updateDoc(doc(db, 'posts', id), { views: increment(1) });
}

export async function createPost(data: {
  title: string;
  content: string;
  category: Category;
  userId: string;
  nickname: string;
  hashtags: string[];
  thumbnailUrl?: string;
  tableOfContents?: TocItem[];
}): Promise<string> {
  const ref = await addDoc(collection(db, 'posts'), {
    ...data,
    status: 'approved',
    views: 0,
    likeCount: 0,
    commentCount: 0,
    imageUrls: [],
    thumbnailUrl: data.thumbnailUrl ?? '',
    tableOfContents: data.tableOfContents ?? [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  // 유저 게시글 수 실시간 반영
  await incrementUserStat(data.userId, 'postCount');
  return ref.id;
}

export async function searchPosts(keyword: string): Promise<Post[]> {
  try {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(200));
    const snap = await getDocs(q);
    const posts = snap.docs.map((d) => normalizePost(d.id, d.data()));
    const kw = keyword.toLowerCase().trim();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(kw) ||
        p.content.toLowerCase().includes(kw) ||
        (p.hashtags ?? []).some((h) => h.toLowerCase().includes(kw)),
    );
  } catch {
    return [];
  }
}

export async function getPostsByUserId(userId: string, count = 20): Promise<Post[]> {
  try {
    const q = query(
      collection(db, 'posts'),
      where('userId', '==', userId),
      limit(count),
    );
    const snap = await getDocs(q);
    const posts = snap.docs.map((d) => normalizePost(d.id, d.data()));
    return posts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  } catch {
    return [];
  }
}

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, 'posts', id));
}

export async function searchPostsByTag(tagName: string): Promise<Post[]> {
  try {
    const q = query(
      collection(db, 'posts'),
      where('hashtags', 'array-contains', tagName),
      orderBy('createdAt', 'desc'),
      limit(100),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => normalizePost(d.id, d.data()));
  } catch {
    return [];
  }
}

export async function getPostsByCategory(category: Category, count = 200): Promise<Post[]> {
  try {
    // orderBy 없이 where만 사용 — 복합 인덱스 불필요, 클라이언트에서 정렬
    const q = query(
      collection(db, 'posts'),
      where('category', '==', category),
      limit(count),
    );
    const snap = await getDocs(q);
    const posts = snap.docs.map((d) => normalizePost(d.id, d.data()));
    return posts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  } catch {
    return [];
  }
}
