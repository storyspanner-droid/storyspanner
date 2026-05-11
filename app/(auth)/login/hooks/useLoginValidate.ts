import { LoginFormState } from './useLoginForm';

export interface LoginErrors {
  userId?: string;
  password?: string;
}

export function useLoginValidate() {
  const validate = (form: LoginFormState): LoginErrors => {
    const errors: LoginErrors = {};
    if (!form.userId) errors.userId = '아이디를 입력해주세요.';
    if (!form.password) errors.password = '비밀번호를 입력해주세요.';
    return errors;
  };

  const isValid = (errors: LoginErrors) => Object.keys(errors).length === 0;

  return { validate, isValid };
}
