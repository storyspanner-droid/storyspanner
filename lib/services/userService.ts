import { doc, getDoc, collection, query, where, limit, getDocs, updateDoc, increment } from 'firebase/firestore';
import db from '@/lib/firebase/firestore';
import { User } from '@/lib/types';

export async function getUserById(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as User;
}

export async function getUserByUserId(userId: string): Promise<User | null> {
  const q = query(collection(db, 'users'), where('userId', '==', userId), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as User;
}

export async function incrementUserStat(
  uid: string,
  field: 'postCount' | 'commentCount' | 'followerCount' | 'followingCount' | 'points',
  delta: number = 1,
): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', uid), { [field]: increment(delta) });
  } catch {
    // 통계 업데이트 실패는 사용자 경험에 영향 없도록 무시
  }
}
