'use client';

interface Props {
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
  agreedToMarketing: boolean;
  onTermsChange: (v: boolean) => void;
  onPrivacyChange: (v: boolean) => void;
  onMarketingChange: (v: boolean) => void;
  error?: string;
}

export default function TermsAgreement({
  agreedToTerms,
  agreedToPrivacy,
  agreedToMarketing,
  onTermsChange,
  onPrivacyChange,
  onMarketingChange,
  error,
}: Props) {
  const allChecked = agreedToTerms && agreedToPrivacy && agreedToMarketing;

  const handleAll = (checked: boolean) => {
    onTermsChange(checked);
    onPrivacyChange(checked);
    onMarketingChange(checked);
  };

  return (
    <div className="border border-line rounded-[10px] p-4 space-y-2 text-sm">
      {/* 전체 동의 */}
      <label className="flex items-center gap-2 font-medium text-ink cursor-pointer">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={(e) => handleAll(e.target.checked)}
          className="w-4 h-4 accent-ink"
        />
        전체 동의
      </label>

      <div className="border-t border-line pt-2 space-y-2">
        <label className="flex items-center gap-2 text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => onTermsChange(e.target.checked)}
            className="w-4 h-4 accent-ink"
          />
          <span>
            <span className="text-danger">[필수]</span> 이용약관 동의
          </span>
          <a href="#" className="ml-auto text-xs text-muted hover:text-ink underline">보기</a>
        </label>

        <label className="flex items-center gap-2 text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToPrivacy}
            onChange={(e) => onPrivacyChange(e.target.checked)}
            className="w-4 h-4 accent-ink"
          />
          <span>
            <span className="text-danger">[필수]</span> 개인정보 처리방침 동의
          </span>
          <a href="#" className="ml-auto text-xs text-muted hover:text-ink underline">보기</a>
        </label>

        <label className="flex items-center gap-2 text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToMarketing}
            onChange={(e) => onMarketingChange(e.target.checked)}
            className="w-4 h-4 accent-ink"
          />
          <span>[선택] 마케팅 정보 수신 동의</span>
        </label>
      </div>

      {error && <p className="text-danger text-xs pt-1">{error}</p>}
    </div>
  );
}
