import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '@/lib/firebase/firestore';
import { Post } from '@/lib/types';

export interface UserPostStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  postsThisMonth: number;
  postsLastMonth: number;
  likesThisMonth: number;
}

export async function getUserPostStats(userId: string): Promise<UserPostStats> {
  const empty: UserPostStats = {
    totalPosts: 0, totalViews: 0, totalLikes: 0,
    postsThisMonth: 0, postsLastMonth: 0, likesThisMonth: 0,
  };
  try {
    const snap = await getDocs(
      query(collection(db, 'posts'), where('userId', '==', userId)),
    );
    const posts = snap.docs.map((d) => d.data() as Post);

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    let totalViews = 0;
    let totalLikes = 0;
    let postsThisMonth = 0;
    let postsLastMonth = 0;

    for (const p of posts) {
      totalViews += p.views ?? 0;
      totalLikes += p.likeCount ?? 0;
      if (p.createdAt) {
        const created = p.createdAt.toDate();
        if (created >= thisMonthStart) postsThisMonth++;
        else if (created >= lastMonthStart) postsLastMonth++;
      }
    }

    // 이번달 좋아요: 이번달에 작성된 글에 달린 좋아요 합계
    const thisMonthPostLikes = posts
      .filter((p) => p.createdAt && p.createdAt.toDate() >= thisMonthStart)
      .reduce((sum, p) => sum + (p.likeCount ?? 0), 0);

    return {
      totalPosts: posts.length,
      totalViews,
      totalLikes,
      postsThisMonth,
      postsLastMonth,
      likesThisMonth: thisMonthPostLikes,
    };
  } catch {
    return empty;
  }
}
