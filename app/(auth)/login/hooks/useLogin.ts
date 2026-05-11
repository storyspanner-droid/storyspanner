'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginForm } from './useLoginForm';
import { useLoginValidate, LoginErrors } from './useLoginValidate';
import { signInWithUserId, signInWithGoogle } from '@/lib/services/authService';

function toErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code;
    if (
      code === 'auth/user-not-found' ||
      code === 'auth/wrong-password' ||
      code === 'auth/invalid-credential'
    ) return '아이디 또는 비밀번호가 올바르지 않습니다.';
    if (code === 'auth/too-many-requests') return '잠시 후 다시 시도해주세요.';
  }
  return '로그인에 실패했습니다. 다시 시도해주세요.';
}

export function useLogin() {
  const { form, setField } = useLoginForm();
  const { validate, isValid } = useLoginValidate();
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (!isValid(validationErrors)) return;

    setLoading(true);
    setServerError('');
    try {
      await signInWithUserId(form.userId, form.password);
      router.push('/');
    } catch (err) {
      setServerError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setServerError('');
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err) {
      setServerError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { form, setField, errors, loading, serverError, handleSubmit, handleGoogleLogin };
}
