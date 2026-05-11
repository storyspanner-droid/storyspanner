'use client';

export function Tooltip({ label }: { label: string }) {
  return (
    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#111111] text-white text-[11px] px-2 py-1 rounded-[4px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
      {label}
    </span>
  );
}

export function Btn({
  tooltip, onClick, active, children,
}: {
  tooltip: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group">
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); onClick(); }}
        className={`w-7 h-7 flex items-center justify-center text-[13px] rounded transition-colors ${
          active ? 'bg-[#6C3FC5] text-white' : 'text-[#4B5563] hover:bg-[#E5E7EB]'
        }`}
      >
        {children}
      </button>
      <Tooltip label={tooltip} />
    </div>
  );
}

export function Sep() {
  return <div className="w-px h-4 bg-[#E5E7EB] mx-0.5 shrink-0" />;
}

export const SELECT_CLS =
  'h-7 px-1.5 text-[11px] text-[#4B5563] border border-[#E5E7EB] rounded bg-white focus:outline-none focus:border-[#6C3FC5] cursor-pointer transition-colors';

export type PickerType = 'none' | 'fontColor' | 'bgColor';
