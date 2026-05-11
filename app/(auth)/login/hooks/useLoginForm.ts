'use client';

import { useState } from 'react';

export interface LoginFormState {
  userId: string;
  password: string;
}

export function useLoginForm() {
  const [form, setForm] = useState<LoginFormState>({ userId: '', password: '' });

  const setField = (field: keyof LoginFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return { form, setField };
}
