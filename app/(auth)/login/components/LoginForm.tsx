'use client';

import Link from 'next/link';
import { useLogin } from '../hooks/useLogin';

function SocialBadge({
  letter,
  bg,
  color = '#ffffff',
}: {
  letter: string;
  bg: string;
  color?: string;
}) {
  return (
    <span
      style={{ backgroundColor: bg, color }}
      className="absolute left-4 w-7 h-7 rounded-[6px] flex items-center justify-center text-xs font-bold shrink-0"
    >
      {letter}
    </span>
  );
}

function InputField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[12px] font-medium text-[#6B7280]">{label}</p>
      {children}
      {error && <p className="text-[#EF4444] text-xs">{error}</p>}
    </div>
  );
}

export default function LoginForm() {
  const { form, setField, errors, loading, serverError, handleSubmit, handleGoogleLogin } =
    useLogin();

  const inputCls = (hasError: boolean) =>
    `w-full px-4 py-3.5 border rounded-[10px] text-[14px] placeholder-[#757575] focus:outline-none transition-colors ${
      hasError
        ? 'border-[#EF4444] bg-[#FFF5F5] text-[#EF4444] placeholder-red-300'
        : 'border-[#E5E7EB] text-[#111111] focus:border-[#6C3FC5]'
    }`;

  return (
    <div className="w-full max-w-[400px] bg-white border border-[#E5E7EB] rounded-2xl px-8 py-10">
      {/* 로고 */}
      <div className="text-center mb-7">
        <h1 className="text-2xl font-black text-[#111111] tracking-tight">스토리슈페너</h1>
        <p className="text-[13px] text-[#9CA3AF] mt-1">로그인</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        {/* 아이디 */}
        <InputField label="아이디" error={errors.userId}>
          <input
            type="text"
            placeholder="아이디를 입력하세요"
            value={form.userId}
            onChange={(e) => setField('userId', e.target.value)}
            className={inputCls(!!errors.userId)}
          />
        </InputField>

        {/* 비밀번호 */}
        <InputField label="비밀번호" error={errors.password}>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={form.password}
            onChange={(e) => setField('password', e.target.value)}
            className={inputCls(!!errors.password)}
          />
        </InputField>

        {/* 비밀번호 찾기 */}
        <div className="flex justify-end -mt-1">
          <Link
            href="/forgot-password"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            비밀번호를 잊으셨나요?
          </Link>
        </div>

        {serverError && (
          <p className="text-[#EF4444] text-xs text-center">{serverError}</p>
        )}

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-[14.5px] bg-[#111111] text-white font-bold text-[15px] rounded-[10px] hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      {/* 소셜 구분선 */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 whitespace-nowrap">소셜 계정으로 로그인</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* 소셜 로그인 버튼 */}
      <div className="flex flex-col gap-2.5">
        {/* 카카오 */}
        <button
          type="button"
          disabled={loading}
          onClick={() => alert('카카오 로그인 준비 중입니다.')}
          className="w-full h-[46px] relative flex items-center justify-center rounded-[10px] font-bold text-[14px] text-gray-900 disabled:opacity-50 hover:brightness-95 transition-all"
          style={{ backgroundColor: '#FEE500' }}
        >
          <SocialBadge letter="K" bg="#3D1C02" />
          카카오로 로그인
        </button>

        {/* 네이버 */}
        <button
          type="button"
          disabled={loading}
          onClick={() => alert('네이버 로그인 준비 중입니다.')}
          className="w-full h-[46px] relative flex items-center justify-center rounded-[10px] font-bold text-[14px] text-white disabled:opacity-50 hover:brightness-95 transition-all"
          style={{ backgroundColor: '#03C75A' }}
        >
          <SocialBadge letter="N" bg="#02A84B" />
          네이버로 로그인
        </button>

        {/* 구글 */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleLogin}
          className="w-full h-[46px] relative flex items-center justify-center rounded-[10px] font-bold text-[14px] text-[#374151] bg-white border border-[#E5E7EB] disabled:opacity-50 hover:bg-gray-50 transition-colors"
        >
          <SocialBadge letter="G" bg="#F3F4F6" color="#374151" />
          구글로 로그인
        </button>
      </div>

      {/* 회원가입 링크 */}
      <p className="text-center text-[13px] text-[#9CA3AF] mt-6">
        아직 계정이 없으신가요?{' '}
        <Link href="/register" className="text-[#111111] font-bold hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
