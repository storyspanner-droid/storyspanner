'use client';

interface Props {
  items: { id: string; text: string }[];
  onItemClick: (id: string) => void;
}

export default function WriteTocPanel({ items, onItemClick }: Props) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-4">
      <div className="flex items-center mb-3">
        <span className="text-[13px] font-bold text-[#111111]">📋 목차</span>
        {items.length > 0 && (
          <span className="ml-2 bg-[#6C3FC5] text-white text-[11px] px-1.5 py-0.5 rounded-full leading-none">
            {items.length}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-[12px] text-[#9CA3AF] text-center py-4 leading-relaxed">
          소제목을 입력하면 자동으로 등록됩니다
        </p>
      ) : (
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onItemClick(item.id)}
                className="w-full text-left px-2 py-1.5 text-[13px] text-[#4B5563] hover:text-[#6C3FC5] hover:bg-[#F3EEFF] rounded-[6px] transition-colors flex items-center gap-2"
              >
                <span className="bg-[#F3EEFF] text-[#6C3FC5] text-[10px] font-bold shrink-0 px-1.5 py-0.5 rounded-[4px]">소제목</span>
                <span className="truncate">{item.text}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-[11px] text-[#9CA3AF] mt-3 pt-3 border-t border-[#F3F4F6]">
        소제목을 입력하면 자동으로 등록됩니다
      </p>
    </div>
  );
}
