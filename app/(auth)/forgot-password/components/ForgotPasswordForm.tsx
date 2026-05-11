'use client';

import Link from 'next/link';
import { useForgotPassword } from '../hooks/useForgotPassword';

const STEPS = ['이메일 인증', '인증코드 확인', '비밀번호 변경'];

function StepIndicator({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors ${
                i === active ? 'bg-[#6C3FC5] text-white' : 'bg-[#F3F4F6] text-[#9CA3AF]'
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-[11px] whitespace-nowrap ${i === active ? 'text-[#6C3FC5] font-medium' : 'text-[#9CA3AF]'}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="w-14 h-px bg-[#E5E7EB] mx-2 mb-4" />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ForgotPasswordForm() {
  const { form, setField, errors, loading, sent, serverError, handleSubmit } = useForgotPassword();

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[420px] bg-white border border-[#E5E7EB] rounded-[20px] shadow-sm px-8 py-10">
        {/* 로고 */}
        <Link href="/" className="block text-center text-[22px] font-black text-[#6C3FC5] tracking-tight mb-6">
          스토리슈페너
        </Link>

        <h1 className="text-[20px] font-bold text-[#111111] text-center mb-1">비밀번호 찾기</h1>
        <p className="text-[13px] text-[#9CA3AF] text-center leading-[1.8] mb-6">
          가입 시 등록한 이메일로 인증하면<br />새 비밀번호를 설정할 수 있어요.
        </p>

        <StepIndicator active={0} />

        {sent ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <span className="text-[48px]">📧</span>
            <p className="text-[15px] font-bold text-[#111111]">이메일을 확인해주세요</p>
            <p className="text-[13px] text-[#9CA3AF] text-center leading-[1.8]">
              <strong className="text-[#111111]">{form.email}</strong>으로<br />
              비밀번호 재설정 링크를 발송했습니다.<br />
              이메일의 링크를 클릭해 비밀번호를 변경하세요.
            </p>
            <Link href="/login" className="mt-2 h-[46px] px-6 bg-[#6C3FC5] text-white text-[14px] font-bold rounded-[12px] flex items-center hover:bg-[#5a33a8] transition-colors">
              로그인으로 돌아가기
            </Link>
          </div>
        ) : (
          <>
            {/* 안내 박스 */}
            <div className="bg-[#F3EEFF] border border-[#D8B4FE] rounded-[10px] px-4 py-3 mb-5">
              <p className="text-[12px] text-[#6C3FC5] leading-[1.8]">
                📧 가입 시 등록한 <strong>아이디와 이메일</strong>을 입력해주세요.<br />
                일치하는 계정이 있으면 재설정 링크를 발송합니다.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div>
                <label className="block text-[13px] font-bold text-[#4B5563] mb-1.5">아이디</label>
                <input
                  type="text"
                  value={form.userId}
                  onChange={(e) => setField('userId', e.target.value)}
                  placeholder="가입 시 사용한 아이디"
                  className={`w-full h-[46px] px-3.5 border rounded-[10px] text-[14px] placeholder-[#9CA3AF] focus:outline-none transition-colors ${
                    errors.userId ? 'border-[#EF4444] bg-[#FFF5F5]' : 'border-[#E5E7EB] focus:border-[#6C3FC5]'
                  }`}
                />
                {errors.userId && <p className="text-[#EF4444] text-xs mt-1">{errors.userId}</p>}
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#4B5563] mb-1.5">이메일</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  placeholder="hong@example.com"
                  className={`w-full h-[46px] px-3.5 border rounded-[10px] text-[14px] placeholder-[#9CA3AF] focus:outline-none transition-colors ${
                    errors.email ? 'border-[#EF4444] bg-[#FFF5F5]' : 'border-[#E5E7EB] focus:border-[#6C3FC5]'
                  }`}
                />
                {errors.email && <p className="text-[#EF4444] text-xs mt-1">{errors.email}</p>}
              </div>

              {serverError && <p className="text-[#EF4444] text-[13px] text-center">{serverError}</p>}

              <button
                type="submit"
                disabled={loading}
                className="h-[46px] bg-[#6C3FC5] text-white font-bold text-[14px] rounded-[12px] hover:bg-[#5a33a8] disabled:opacity-50 transition-colors mt-1"
              >
                {loading ? '확인 중...' : '다음 단계 →'}
              </button>
            </form>
          </>
        )}

        <div className="flex items-center justify-center gap-3 mt-5 text-[12px] text-[#9CA3AF]">
          <Link href="/" className="text-[#6C3FC5] hover:underline">← 메인으로</Link>
          <span>·</span>
          <Link href="/login" className="text-[#6C3FC5] hover:underline">로그인</Link>
        </div>
      </div>
    </div>
  );
}
