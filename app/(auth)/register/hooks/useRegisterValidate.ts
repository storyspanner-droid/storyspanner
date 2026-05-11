import { RegisterFormState } from './useRegisterForm';

export interface RegisterErrors {
  name?: string;
  birthDate?: string;
  phone?: string;
  nickname?: string;
  userId?: string;
  password?: string;
  email?: string;
  terms?: string;
}

export function useRegisterValidate() {
  const validate = (form: RegisterFormState): RegisterErrors => {
    const errors: RegisterErrors = {};

    if (!form.name.trim()) errors.name = '이름을 입력해주세요.';

    if (!form.birthDate) errors.birthDate = '생년월일을 입력해주세요.';

    if (!form.phone.trim()) {
      errors.phone = '전화번호를 입력해주세요.';
    } else if (!/^010-\d{4}-\d{4}$/.test(form.phone)) {
      errors.phone = '형식에 맞게 입력해주세요. (예: 010-1234-5678)';
    }

    if (!form.nickname.trim()) {
      errors.nickname = '닉네임을 입력해주세요.';
    } else if (form.nickname.length < 2 || form.nickname.length > 12) {
      errors.nickname = '닉네임은 2~12자 사이여야 합니다.';
    }

    if (!form.userId.trim()) {
      errors.userId = '아이디를 입력해주세요.';
    } else if (form.userId.length < 4 || form.userId.length > 20) {
      errors.userId = '아이디는 4~20자 사이여야 합니다.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.userId)) {
      errors.userId = '영문, 숫자, 밑줄(_)만 사용 가능합니다.';
    }

    if (!form.password) {
      errors.password = '비밀번호를 입력해주세요.';
    } else if (form.password.length < 8) {
      errors.password = '비밀번호는 8자 이상이어야 합니다.';
    } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(form.password)) {
      errors.password = '영문자와 숫자를 포함해야 합니다.';
    }

    if (!form.email) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!form.agreedToPrivacy) errors.terms = '개인정보 수집 및 이용에 동의해주세요.';

    return errors;
  };

  const isValid = (errors: RegisterErrors) => Object.keys(errors).length === 0;

  return { validate, isValid };
}
