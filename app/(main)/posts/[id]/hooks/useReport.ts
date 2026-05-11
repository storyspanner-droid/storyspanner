'use client';

import { useState } from 'react';
import { submitReport } from '@/lib/services/reportService';
import { useAuth } from '@/lib/hooks/useAuth';
import { ReportReason } from '@/lib/types';
import { useReportForm } from './useReportForm';

export function useReport(postId: string) {
  const { user } = useAuth();
  const form = useReportForm();
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!user || !form.reason || submitting) return;
    setSubmitting(true);
    try {
      await submitReport(postId, user.id, form.reason as ReportReason, form.detail);
      form.setDone(true);
    } finally {
      setSubmitting(false);
    }
  }

  return { ...form, submitting, submit };
}
