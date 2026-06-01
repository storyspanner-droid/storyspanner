'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { signOut } from '@/lib/services/authService';

export type MyPageTab = 'dashboard' | 'posts' | 'likes' | 'friends' | 'stats' | 'myads' | 'settings' | 'withdraw';

export function useMyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MyPageTab>('dashboard');

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return { user, activeTab, setActiveTab, handleSignOut };
}
