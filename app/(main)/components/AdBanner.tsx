import { Ad } from '@/lib/types';

interface Props {
  ad?: Ad;
}

export default function AdBanner({ ad }: Props) {
  if (ad) {
    return (
      <a
        href={ad.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block my-2 rounded-[12px] overflow-hidden border border-[#E5E7EB] hover:opacity-95 transition-opacity"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ad.imageUrl} alt={ad.title} className="w-full h-[80px] object-cover" />
      </a>
    );
  }

  return (
    <div
      className="my-2 flex items-center justify-between px-5 py-4 rounded-[12px] border"
      style={{
        background: 'linear-gradient(90deg, #F3EEFF 0%, #EDE9FE 100%)',
        borderColor: '#D8B4FE',
      }}
    >
      <div>
        <p className="text-[12px] font-bold text-[#6C3FC5]">광고 배너</p>
        <p className="text-[11px] text-[#8B5CF6] mt-0.5">스토리슈페너 광고 문의</p>
      </div>
      <span className="text-[11px] font-medium text-[#6C3FC5] bg-white px-3 py-1 rounded-[6px]">
        문의하기
      </span>
    </div>
  );
}
