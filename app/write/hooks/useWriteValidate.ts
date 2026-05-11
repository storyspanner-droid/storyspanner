'use client';

import { WriteFormState } from './useWriteForm';

export interface WriteErrors {
  category?: string;
  title?: string;
  content?: string;
}

export function useWriteValidate() {
  const validate = (form: WriteFormState, contentText: string): WriteErrors => {
    const errors: WriteErrors = {};
    if (!form.category) errors.category = '카테고리를 선택해주세요.';
    if (!form.title.trim()) errors.title = '제목을 입력해주세요.';
    else if (form.title.trim().length < 5) errors.title = '제목은 5자 이상 입력해주세요.';
    else if (form.title.trim().length > 100) errors.title = '제목은 100자 이하로 입력해주세요.';
    if (contentText.trim().length < 10) errors.content = '내용은 10자 이상 입력해주세요.';
    return errors;
  };

  const isValid = (errors: WriteErrors) => Object.keys(errors).length === 0;

  return { validate, isValid };
}
