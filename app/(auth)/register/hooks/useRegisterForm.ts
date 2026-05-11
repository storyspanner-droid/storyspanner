'use client';

import { useState } from 'react';
import { Category } from '@/lib/types';

export interface RegisterFormState {
  name: string;
  birthDate: string;
  phone: string;
  nickname: string;
  userId: string;
  password: string;
  email: string;
  interests: Category[];
  agreedToPrivacy: boolean;
  agreedToMarketing: boolean;
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function useRegisterForm() {
  const [form, setForm] = useState<RegisterFormState>({
    name: '',
    birthDate: '',
    phone: '',
    nickname: '',
    userId: '',
    password: '',
    email: '',
    interests: [],
    agreedToPrivacy: false,
    agreedToMarketing: false,
  });

  const setField = <K extends keyof RegisterFormState>(field: K, value: RegisterFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const setPhone = (raw: string) => {
    setForm((prev) => ({ ...prev, phone: formatPhone(raw) }));
  };

  const toggleInterest = (category: Category) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(category)
        ? prev.interests.filter((c) => c !== category)
        : [...prev.interests, category],
    }));
  };

  return { form, setField, setPhone, toggleInterest };
}
