'use client';

import { useState, useCallback } from 'react';
import { getNotifications, markAsRead, markAllAsRead } from '@/lib/services/notificationService';
import { Notification } from '@/lib/types';

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const data = await getNotifications(userId);
    setNotifications(data);
    setLoading(false);
  }, [userId]);

  const handleOpen = useCallback(async () => {
    setOpen(true);
    await fetch();
  }, [fetch]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleMarkRead = useCallback(async (id: string) => {
    await markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    if (!userId) return;
    await markAllAsRead(userId);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    loading,
    open,
    unreadCount,
    handleOpen,
    handleClose,
    handleMarkRead,
    handleMarkAllRead,
  };
}
