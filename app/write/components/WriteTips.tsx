'use client';

const TIPS = [
  '제목은 내용을 잘 요약해서 짧고 명확하게 작성해주세요',
  '이미지를 함께 올리면 더 많은 분들이 읽어요',
  '출처가 있는 정보는 반드시 출처를 밝혀주세요',
  '게시글은 관리자 검토 후 24시간 이내 승인됩니다',
];

export default function WriteTips() {
  return (
    <div className="bg-[#FFFBEB] border border-[#FCD34D] rounded-[12px] px-5 py-4 flex flex-col gap-2">
      <p className="text-[13px] font-bold text-[#92400E]">💡 좋은 글 작성 팁</p>
      <ul className="flex flex-col gap-0.5">
        {TIPS.map((tip, i) => (
          <li key={i} className="text-[12px] text-[#78350F] leading-[2]">• {tip}</li>
        ))}
      </ul>
    </div>
  );
}
