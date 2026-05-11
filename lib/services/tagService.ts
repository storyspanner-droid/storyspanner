import {
  collection, query, orderBy, limit, getDocs,
  doc, setDoc, increment, serverTimestamp,
} from 'firebase/firestore';
import db from '@/lib/firebase/firestore';
import { Tag } from '@/lib/types';

export async function getPopularTags(count = 30): Promise<Tag[]> {
  try {
    const q = query(collection(db, 'tags'), orderBy('count', 'desc'), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Tag));
  } catch {
    return [];
  }
}

export async function incrementTag(tagName: string, categoryId: string): Promise<void> {
  const id = tagName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9가-힣-]/g, '');
  await setDoc(
    doc(db, 'tags', id || tagName),
    { tagName, count: increment(1), categoryId, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function savePostTags(tags: string[], categoryId: string): Promise<void> {
  await Promise.all(tags.map((tag) => incrementTag(tag, categoryId)));
}
