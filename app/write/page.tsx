'use client';

import { useState, useEffect } from 'react';
import WriteForm from './components/WriteForm';

export default function WritePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    setChecked(true);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!checked) return null;

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-3">
        <span className="text-[48px]">📝</span>
        <h2 className="text-[18px] font-bold text-[#111111]">
          글 작성은 태블릿 또는 PC에서 가능해요.
        </h2>
        <p className="text-[14px] text-[#6B7280] max-w-[340px] leading-[1.7]">
          더 나은 작성 환경을 위해 PC 또는 태블릿(768px 이상)에서 접속해주세요.
        </p>
      </div>
    );
  }

  return <WriteForm />;
}
