'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export type AdminTab = 'dashboard' | 'posts' | 'users' | 'reports' | 'notices' | 'ads' | 'stats';

export function useAdmin() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  useEffect(() => {
    if (loading) return;
    if (!user || user.level !== 5) {
      router.replace('/');
    }
  }, [user, loading, router]);

  return { user, loading, isAdmin: user?.level === 5, activeTab, setActiveTab };
}
