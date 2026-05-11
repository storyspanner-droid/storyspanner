import {
  collection, query, where, orderBy, getDocs,
  addDoc, deleteDoc, doc, updateDoc, increment, serverTimestamp,
} from 'firebase/firestore';
import db from '@/lib/firebase/firestore';
import { Comment } from '@/lib/types';
import { incrementUserStat } from './userService';

export async function getComments(postId: string): Promise<Comment[]> {
  const q = query(
    collection(db, 'comments'),
    where('postId', '==', postId),
    orderBy('createdAt', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Comment);
}

export async function addComment(
  postId: string,
  userId: string,
  nickname: string,
  content: string,
  parentId?: string
): Promise<string> {
  const ref = await addDoc(collection(db, 'comments'), {
    postId,
    userId,
    nickname,
    content,
    parentId: parentId ?? null,
    depth: parentId ? 1 : 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'posts', postId), { commentCount: increment(1) });
  // 유저 댓글 수 실시간 반영
  await incrementUserStat(userId, 'commentCount');
  return ref.id;
}

export async function deleteComment(commentId: string, postId: string): Promise<void> {
  await deleteDoc(doc(db, 'comments', commentId));
  await updateDoc(doc(db, 'posts', postId), { commentCount: increment(-1) });
}
