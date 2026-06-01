import {
  collection, query, where, orderBy, limit,
  getDocs, getDoc, addDoc, doc, updateDoc, increment, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import db from '@/lib/firebase/firestore';
import { Ad, AdStatus, Category } from '@/lib/types';

function normalizeAd(id: string, data: Record<string, unknown>): Ad {
  return {
    ...data,
    id,
    credits: (data.credits as number) ?? 0,
    clicks: (data.clicks as number) ?? 0,
    impressions: (data.impressions as number) ?? 0,
    status: (data.status as AdStatus) ?? 'pending',
  } as Ad;
}

function getAnonId(): string {
  if (typeof sessionStorage === 'undefined') return 'server';
  const key = 'ss_ad_anon';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, id);
  }
  return id;
}

export async function getAdsByCategory(category: Category): Promise<Ad[]> {
  try {
    const q = query(
      collection(db, 'ads'),
      where('category', '==', category),
      where('status', '==', 'approved'),
      orderBy('bidPrice', 'desc'),
      limit(10),
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => normalizeAd(d.id, d.data() as Record<string, unknown>))
      .filter((ad) => ad.credits > 0);
  } catch {
    return [];
  }
}

export function calcActualPrice(ads: Ad[]): Ad[] {
  if (ads.length === 0) return ads;
  const sorted = [...ads].sort((a, b) => b.bidPrice - a.bidPrice);
  return sorted.map((ad, i) => {
    const nextBid = sorted[i + 1]?.bidPrice ?? 0;
    return { ...ad, actualPrice: nextBid + 10, rank: i + 1 };
  });
}

export async function recordAdClick(adId: string, userId: string | null): Promise<boolean> {
  try {
    const dedupKey = userId ?? getAnonId();
    const oneDayAgo = Timestamp.fromMillis(Date.now() - 86400000);

    const existingQ = query(
      collection(db, 'adClicks'),
      where('adId', '==', adId),
      where('dedupKey', '==', dedupKey),
      where('clickedAt', '>=', oneDayAgo),
      limit(1),
    );
    const existing = await getDocs(existingQ);
    if (!existing.empty) return false;

    const adRef = doc(db, 'ads', adId);
    const adSnap = await getDoc(adRef);
    if (!adSnap.exists()) return false;
    const ad = normalizeAd(adSnap.id, adSnap.data() as Record<string, unknown>);
    if (ad.status !== 'approved') return false;

    const charge = ad.actualPrice ?? ad.bidPrice;
    if (ad.credits < charge) return false;

    await updateDoc(adRef, { credits: increment(-charge), clicks: increment(1) });
    await addDoc(collection(db, 'adClicks'), {
      adId,
      userId: userId ?? null,
      dedupKey,
      clickedAt: serverTimestamp(),
      creditCharged: charge,
    });

    return true;
  } catch {
    return false;
  }
}

export async function recordAdImpression(adId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'ads', adId), { impressions: increment(1) });
  } catch {
    // silent — impression tracking is best-effort
  }
}

export async function createAd(data: {
  advertiserId: string;
  advertiserNickname: string;
  category: Category;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl: string;
  bidPrice: number;
}): Promise<string> {
  const ref = await addDoc(collection(db, 'ads'), {
    ...data,
    description: data.description ?? '',
    status: 'pending',
    credits: 0,
    clicks: 0,
    impressions: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateAdBidPrice(adId: string, bidPrice: number): Promise<void> {
  await updateDoc(doc(db, 'ads', adId), { bidPrice, updatedAt: serverTimestamp() });
}

export async function updateAdStatus(adId: string, status: AdStatus): Promise<void> {
  await updateDoc(doc(db, 'ads', adId), { status, updatedAt: serverTimestamp() });
}

export async function chargeAdCredit(adId: string, amount: number): Promise<void> {
  await updateDoc(doc(db, 'ads', adId), { credits: increment(amount), updatedAt: serverTimestamp() });
}

export async function getAllAds(): Promise<Ad[]> {
  try {
    const q = query(collection(db, 'ads'), orderBy('createdAt', 'desc'), limit(200));
    const snap = await getDocs(q);
    return snap.docs.map((d) => normalizeAd(d.id, d.data() as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function getMyAds(userId: string): Promise<Ad[]> {
  try {
    const q = query(
      collection(db, 'ads'),
      where('advertiserId', '==', userId),
      orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => normalizeAd(d.id, d.data() as Record<string, unknown>));
  } catch {
    return [];
  }
}
