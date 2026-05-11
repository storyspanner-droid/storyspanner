'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterForm } from './useRegisterForm';
import { useRegisterValidate, RegisterErrors } from './useRegisterValidate';
import { signUpWithEmail } from '@/lib/services/authService';

function toErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code;
    if (code === 'auth/email-already-in-use') return '이미 사용 중인 이메일입니다.';
    if (code === 'auth/weak-password') return '비밀번호가 너무 약합니다. (8자 이상, 영문+숫자 포함)';
    if (code === 'auth/operation-not-allowed') return '이메일/비밀번호 로그인이 비활성화되어 있습니다. 관리자에게 문의하세요.';
    if (code === 'auth/invalid-email') return '올바르지 않은 이메일 형식입니다.';
    if (code === 'auth/network-request-failed') return '네트워크 오류가 발생했습니다. 연결을 확인해주세요.';
    if (code === 'auth/too-many-requests') return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
    if (code === 'auth/timeout') return '서버 응답이 없습니다. 인터넷 연결을 확인하고 다시 시도해주세요.';
  }
  return '회원가입에 실패했습니다. 다시 시도해주세요.';
}

export function useRegister() {
  const { form, setField, setPhone, toggleInterest } = useRegisterForm();
  const { validate, isValid } = useRegisterValidate();
  const [errors, setErrors] = useState<RegisterErrors>({});
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

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject({ code: 'auth/timeout' }), 30000)
    );

    try {
      await Promise.race([
        signUpWithEmail(form.email, form.password, {
          userId: form.userId,
          name: form.name,
          nickname: form.nickname,
          phone: form.phone,
          birthDate: form.birthDate,
          interests: form.interests,
          agreedToMarketing: form.agreedToMarketing,
        }),
        timeout,
      ]);
      router.push('/');
    } catch (err) {
      setServerError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { form, setField, setPhone, toggleInterest, errors, loading, serverError, handleSubmit };
}
