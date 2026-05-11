import {
  collection, query, where, Timestamp, getDocs,
  orderBy, limit, QueryConstraint, doc, updateDoc, deleteDoc, serverTimestamp,
} from 'firebase/firestore';
import db from '@/lib/firebase/firestore';
import { Post, PostStatus, Category } from '@/lib/types';

// ─── Stats 탭 데이터 ─────────────────────────────────────────────────────────

export interface AdminStats {
  totalPosts: number;
  totalUsers: number;
  totalComments: number;
  postsToday: number;
  usersToday: number;
  pendingReports: number;
}

async function safeCount(col: string, ...constraints: QueryConstraint[]): Promise<number> {
  try {
    const q = constraints.length
      ? query(collection(db, col), ...constraints)
      : query(collection(db, col));
    const snap = await getDocs(q);
    return snap.size;
  } catch {
    return 0;
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = Timestamp.fromDate(today);

  const [totalPosts, totalUsers, totalComments, postsToday, usersToday, pendingReports] =
    await Promise.all([
      safeCount('posts'),
      safeCount('users'),
      safeCount('comments'),
      safeCount('posts', where('createdAt', '>=', todayTs)),
      safeCount('users', where('createdAt', '>=', todayTs)),
      safeCount('reports', where('status', '==', 'pending')),
    ]);

  return { totalPosts, totalUsers, totalComments, postsToday, usersToday, pendingReports };
}

// ─── Dashboard 탭 데이터 ─────────────────────────────────────────────────────

export interface AdminDashboardStats {
  totalUsers: number;
  usersToday: number;
  totalPosts: number;
  postsToday: number;
  pendingPosts: number;
  pendingReports: number;
  suspendedUsers: number;
  adminUsers: number;
  likesToday: number;
  totalViews: number;
  totalLikes: number;
  recentPosts: Pick<Post, 'id' | 'title' | 'nickname' | 'category' | 'createdAt' | 'views'>[];
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = Timestamp.fromDate(today);

  const empty: AdminDashboardStats = {
    totalUsers: 0, usersToday: 0, totalPosts: 0, postsToday: 0,
    pendingPosts: 0, pendingReports: 0, suspendedUsers: 0,
    adminUsers: 0, likesToday: 0, totalViews: 0, totalLikes: 0,
    recentPosts: [],
  };

  try {
    const [
      usersSnap, usersTodaySnap, suspendedSnap, adminSnap,
      postsSnap, postsTodaySnap, pendingPostsSnap,
      pendingReportsSnap, likesTodaySnap, recentPostsSnap,
    ] = await Promise.all([
      getDocs(query(collection(db, 'users'))),
      getDocs(query(collection(db, 'users'), where('createdAt', '>=', todayTs))),
      getDocs(query(collection(db, 'users'), where('status', '==', 'suspended'))),
      getDocs(query(collection(db, 'users'), where('level', '==', 5))),
      getDocs(query(collection(db, 'posts'))),
      getDocs(query(collection(db, 'posts'), where('createdAt', '>=', todayTs))),
      getDocs(query(collection(db, 'posts'), where('status', '==', 'pending'))),
      getDocs(query(collection(db, 'reports'), where('status', '==', 'pending'))),
      getDocs(query(collection(db, 'likes'), where('createdAt', '>=', todayTs))),
      getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(5))),
    ]);

    const posts = postsSnap.docs.map((d) => d.data() as Post);
    const totalViews = posts.reduce((sum, p) => sum + (p.views ?? 0), 0);
    const totalLikes = posts.reduce((sum, p) => sum + (p.likeCount ?? 0), 0);

    const recentPosts = recentPostsSnap.docs.map((d) => {
      const p = d.data() as Post;
      return { id: d.id, title: p.title, nickname: p.nickname, category: p.category, createdAt: p.createdAt, views: p.views };
    });

    return {
      totalUsers: usersSnap.size, usersToday: usersTodaySnap.size,
      totalPosts: postsSnap.size, postsToday: postsTodaySnap.size,
      pendingPosts: pendingPostsSnap.size, pendingReports: pendingReportsSnap.size,
      suspendedUsers: suspendedSnap.size, adminUsers: adminSnap.size,
      likesToday: likesTodaySnap.size, totalViews, totalLikes, recentPosts,
    };
  } catch {
    return empty;
  }
}

// ─── Posts 관리 ───────────────────────────────────────────────────────────────

export async function getAdminPosts(category?: Category): Promise<Post[]> {
  try {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(20)];
    if (category) constraints.unshift(where('category', '==', category));
    const snap = await getDocs(query(collection(db, 'posts'), ...constraints));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
  } catch {
    return [];
  }
}

export async function updateAdminPost(
  id: string,
  data: Partial<Pick<Post, 'title' | 'category' | 'status'>>
): Promise<void> {
  await updateDoc(doc(db, 'posts', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteAdminPost(id: string): Promise<void> {
  await deleteDoc(doc(db, 'posts', id));
}

// ─── 회원 관리 ─────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  userId: string;
  email: string;
  nickname: string;
  postCount: number;
  commentCount: number;
  status: string;
  level: number;
  createdAt: Timestamp;
}

export async function getAdminUsers(
  page: number = 0,
  pageSize: number = 20
): Promise<{ users: AdminUser[]; total: number }> {
  try {
    const snap = await getDocs(query(collection(db, 'users')));
    const all: AdminUser[] = snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId ?? '',
          email: data.email ?? '',
          nickname: data.nickname ?? '',
          postCount: data.postCount ?? 0,
          commentCount: data.commentCount ?? 0,
          status: data.status ?? 'active',
          level: data.level ?? 1,
          createdAt: data.createdAt,
        };
      })
      .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
    return { users: all.slice(page * pageSize, (page + 1) * pageSize), total: all.length };
  } catch {
    return { users: [], total: 0 };
  }
}

// 하위 호환: chart 함수는 adminChartService.ts에서 가져오세요
export type { PostStatus, Category };
