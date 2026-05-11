'use client';

import { ForgotPasswordFormState } from './useForgotPasswordForm';

export interface ForgotPasswordErrors {
  userId?: string;
  email?: string;
}

export function useForgotPasswordValidate() {
  const validate = (form: ForgotPasswordFormState): ForgotPasswordErrors => {
    const errors: ForgotPasswordErrors = {};
    if (!form.userId.trim()) errors.userId = '아이디를 입력해주세요.';
    if (!form.email.trim()) errors.email = '이메일을 입력해주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = '올바른 이메일 형식이 아닙니다.';
    return errors;
  };

  const isValid = (e: ForgotPasswordErrors) => Object.keys(e).length === 0;

  return { validate, isValid };
}
