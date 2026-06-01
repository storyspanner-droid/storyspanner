'use client';

import Link from 'next/link';
import { useRegister } from '../hooks/useRegister';
import { Category } from '@/lib/types';
import { CATEGORY_LIST } from '@/lib/constants/categories';

const inputCls = (hasError: boolean) =>
  `w-full px-4 py-3.5 border rounded-[10px] text-[14px] placeholder-[#757575] focus:outline-none transition-colors ${
    hasError
      ? 'border-[#EF4444] bg-[#FFF5F5] text-[#EF4444] placeholder-red-300'
      : 'border-[#D1D5DB] text-[#111111] focus:border-[#6C3FC5]'
  }`;

export default function RegisterForm() {
  const { form, setField, setPhone, toggleInterest, errors, loading, serverError, handleSubmit } =
    useRegister();

  return (
    <div className="w-full max-w-[400px] bg-white border border-[#E5E7EB] rounded-2xl px-8 py-10">
      {/* 로고 */}
      <div className="text-center mb-7">
        <h1 className="text-[22px] font-black text-[#111111] tracking-tight">스토리슈페너</h1>
        <p className="text-[13px] text-[#9CA3AF] mt-1">회원가입</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        {/* 이름 */}
        <div>
          <input
            type="text"
            placeholder="이름"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            className={inputCls(!!errors.name)}
          />
          {errors.name && <p className="text-[#EF4444] text-xs mt-1">{errors.name}</p>}
        </div>

        {/* 생년월일 */}
        <div>
          <input
            type="date"
            value={form.birthDate}
            onChange={(e) => setField('birthDate', e.target.value)}
            className={inputCls(!!errors.birthDate)}
          />
          {errors.birthDate && <p className="text-[#EF4444] text-xs mt-1">{errors.birthDate}</p>}
        </div>

        {/* 전화번호 */}
        <div>
          <input
            type="tel"
            placeholder="전화번호 예: 010-1234-5678"
            value={form.phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputCls(!!errors.phone)}
          />
          {errors.phone && <p className="text-[#EF4444] text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* 닉네임 */}
        <div>
          <input
            type="text"
            placeholder="닉네임"
            value={form.nickname}
            onChange={(e) => setField('nickname', e.target.value)}
            className={inputCls(!!errors.nickname)}
          />
          {errors.nickname && <p className="text-[#EF4444] text-xs mt-1">{errors.nickname}</p>}
        </div>

        {/* 아이디 */}
        <div>
          <input
            type="text"
            placeholder="아이디"
            value={form.userId}
            onChange={(e) => setField('userId', e.target.value)}
            className={inputCls(!!errors.userId)}
          />
          {errors.userId && <p className="text-[#EF4444] text-xs mt-1">{errors.userId}</p>}
        </div>

        {/* 비밀번호 */}
        <div>
          <input
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={(e) => setField('password', e.target.value)}
            className={inputCls(!!errors.password)}
          />
          {errors.password && <p className="text-[#EF4444] text-xs mt-1">{errors.password}</p>}
        </div>

        {/* 이메일 */}
        <div>
          <input
            type="email"
            placeholder="이메일"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            className={inputCls(!!errors.email)}
          />
          {errors.email && <p className="text-[#EF4444] text-xs mt-1">{errors.email}</p>}
        </div>

        {/* 관심분야 */}
        <div>
          <p className="text-[12px] text-[#6B7280] mb-2">관심분야 (선택, 복수 가능)</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_LIST.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleInterest(cat.label as Category)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  form.interests.includes(cat.label as Category)
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-[#6B7280] border-[#D1D5DB] hover:border-[#6C3FC5] hover:text-[#6C3FC5]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 약관 동의 */}
        <div className="flex flex-col gap-2 pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.agreedToPrivacy}
              onChange={(e) => setField('agreedToPrivacy', e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#6C3FC5] shrink-0"
            />
            <span className="text-xs text-[#6B7280] flex-1 leading-relaxed">
              [필수] 개인정보 수집 및 이용에 동의합니다.
            </span>
            <a href="#" className="text-xs text-[#9CA3AF] hover:text-[#6C3FC5] hover:underline whitespace-nowrap transition-colors">
              자세히보기
            </a>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.agreedToMarketing}
              onChange={(e) => setField('agreedToMarketing', e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#6C3FC5] shrink-0"
            />
            <span className="text-xs text-[#6B7280] flex-1 leading-relaxed">
              [선택] 마케팅 및 광고성 정보 수신에 동의합니다.
            </span>
            <a href="#" className="text-xs text-[#9CA3AF] hover:text-[#6C3FC5] hover:underline whitespace-nowrap transition-colors">
              자세히보기
            </a>
          </label>

          {errors.terms && <p className="text-[#EF4444] text-xs">{errors.terms}</p>}
        </div>

        {serverError && (
          <p className="text-[#EF4444] text-xs text-center">{serverError}</p>
        )}

        {/* 가입하기 버튼 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-[14.5px] bg-[#111111] text-white font-bold text-[15px] rounded-[10px] hover:bg-gray-800 disabled:opacity-50 transition-colors mt-1"
        >
          {loading ? '가입 중...' : '가입하기'}
        </button>
      </form>

      {/* 로그인 링크 */}
      <p className="text-center text-[13px] text-[#9CA3AF] mt-5">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-[#111111] font-bold hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
