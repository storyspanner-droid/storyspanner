'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDocsFromServer } from 'firebase/firestore';
import db from '@/lib/firebase/firestore';

export function useAdminBadgeCounts() {
  // 게시글은 createPost에서 항상 'approved'로 저장되므로 pending 워크플로우 없음.
  // Firestore에 잔존하는 legacy pending 문서로 인한 오표시를 방지하기 위해 0으로 고정.
  const pendingPosts = 0;
  const [pendingReports, setPendingReports] = useState(0);

  useEffect(() => {
    const reportsQuery = query(collection(db, 'reports'), where('status', '==', 'pending'));

    getDocsFromServer(reportsQuery)
      .then((snap) => setPendingReports(snap.size))
      .catch(() => setPendingReports(0));

    const unsubReports = onSnapshot(
      reportsQuery,
      (snap) => setPendingReports(snap.size),
      () => setPendingReports(0)
    );

    return () => unsubReports();
  }, []);

  return { pendingPosts, pendingReports };
}
