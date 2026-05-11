'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAdminUsers, AdminUser } from '@/lib/services/adminService';

const PAGE_SIZE = 20;

export function useAdminUsers(active: boolean) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const result = await getAdminUsers(p, PAGE_SIZE);
      setUsers(result.users);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    fetchUsers(page);
  }, [active, page, fetchUsers]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return { users, loading, page, setPage, total, totalPages, PAGE_SIZE };
}
