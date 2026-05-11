import {
  collection, query, where, orderBy, limit,
  getDocs, doc, updateDoc, writeBatch,
} from 'firebase/firestore';
import db from '@/lib/firebase/firestore';
import { Notification } from '@/lib/types';

export async function getNotifications(userId: string, count = 30): Promise<Notification[]> {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(count),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Notification);
  } catch {
    return [];
  }
}

export async function markAsRead(notificationId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), { read: true });
  } catch {
    // ignore
  }
}

export async function markAllAsRead(userId: string): Promise<void> {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false),
    );
    const snap = await getDocs(q);
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.update(d.ref, { read: true }));
    await batch.commit();
  } catch {
    // ignore
  }
}
