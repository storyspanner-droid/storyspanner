'use client';

import { useState } from 'react';

export interface ForgotPasswordFormState {
  userId: string;
  email: string;
}

export function useForgotPasswordForm() {
  const [form, setForm] = useState<ForgotPasswordFormState>({ userId: '', email: '' });

  const setField = <K extends keyof ForgotPasswordFormState>(k: K, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  return { form, setField };
}
