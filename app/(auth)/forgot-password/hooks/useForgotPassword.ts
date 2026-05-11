'use client';

import { useState } from 'react';
import { sendPasswordReset } from '@/lib/services/authService';
import { getUserByUserId } from '@/lib/services/userService';
import { useForgotPasswordForm } from './useForgotPasswordForm';
import { useForgotPasswordValidate, ForgotPasswordErrors } from './useForgotPasswordValidate';

export function useForgotPassword() {
  const { form, setField } = useForgotPasswordForm();
  const { validate, isValid } = useForgotPasswordValidate();
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (!isValid(errs)) return;

    setLoading(true);
    setServerError('');
    try {
      const user = await getUserByUserId(form.userId.trim());
      if (!user || user.email.toLowerCase() !== form.email.trim().toLowerCase()) {
        setServerError('아이디와 이메일이 일치하는 계정을 찾을 수 없습니다.');
        return;
      }
      await sendPasswordReset(user.email);
      setSent(true);
    } catch {
      setServerError('이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return { form, setField, errors, loading, sent, serverError, handleSubmit };
}
