import {
  collection, query, where, limit,
  getDocs, addDoc, deleteDoc, doc, updateDoc, increment, serverTimestamp,
} from 'firebase/firestore';
import db from '@/lib/firebase/firestore';

export async function getLikeStatus(
  postId: string,
  userId: string
): Promise<{ liked: boolean; likeDocId: string | null }> {
  const q = query(
    collection(db, 'likes'),
    where('postId', '==', postId),
    where('userId', '==', userId),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return { liked: false, likeDocId: null };
  return { liked: true, likeDocId: snap.docs[0].id };
}

export async function addLike(postId: string, userId: string): Promise<string> {
  const ref = await addDoc(collection(db, 'likes'), {
    postId,
    userId,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'posts', postId), { likeCount: increment(1) });
  return ref.id;
}

export async function removeLike(likeDocId: string, postId: string): Promise<void> {
  await deleteDoc(doc(db, 'likes', likeDocId));
  await updateDoc(doc(db, 'posts', postId), { likeCount: increment(-1) });
}
