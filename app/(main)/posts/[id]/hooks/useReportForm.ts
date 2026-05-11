'use client';

import { useState } from 'react';
import { ReportReason } from '@/lib/types';

export function useReportForm() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | ''>('');
  const [detail, setDetail] = useState('');
  const [done, setDone] = useState(false);

  function reset() {
    setOpen(false);
    setReason('');
    setDetail('');
    setDone(false);
  }

  return { open, setOpen, reason, setReason, detail, setDetail, done, setDone, reset };
}
