import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import db from '@/lib/firebase/firestore';
import { ReportReason } from '@/lib/types';

export async function submitReport(
  postId: string,
  userId: string,
  reason: ReportReason,
  detail?: string
): Promise<void> {
  await addDoc(collection(db, 'reports'), {
    postId,
    userId,
    reason,
    detail: detail ?? '',
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}
