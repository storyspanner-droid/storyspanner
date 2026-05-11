import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import db from '@/lib/firebase/firestore';
import { Ad } from '@/lib/types';

export async function getActiveAds(position: Ad['position'] = 'list'): Promise<Ad[]> {
  const now = Timestamp.now();
  const q = query(
    collection(db, 'ads'),
    where('active', '==', true),
    where('position', '==', position)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => d.data() as Ad)
    .filter((ad) => ad.startDate <= now && ad.endDate >= now);
}
