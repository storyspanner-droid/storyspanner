import { ReactNode } from 'react';
import { UserLevel, UserStatus, Category } from '@/lib/types';

// ─── Level ────────────────────────────────────────────────────────────────

const LEVEL_CFG: Record<UserLevel, { label: string; cls: string }> = {
  1: { label: 'Lv.1 일반',  cls: 'bg-gray-100 text-gray-600' },
  2: { label: 'Lv.2 활동',  cls: 'bg-blue-100 text-blue-700' },
  3: { label: 'Lv.3 우수',  cls: 'bg-green-100 text-green-700' },
  4: { label: 'Lv.4 운영',  cls: 'bg-purple-100 text-purple-700' },
  5: { label: 'Lv.5 관리자', cls: 'bg-red-100 text-red-700' },
};

export function LevelBadge({ level }: { level: UserLevel }) {
  const { label, cls } = LEVEL_CFG[level];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls}`}>{label}</span>;
}

// ─── Status ───────────────────────────────────────────────────────────────

const STATUS_CFG: Record<UserStatus, { label: string; cls: string }> = {
  active:    { label: '정상', cls: 'bg-[#DCFCE7] text-[#16A34A]' },
  suspended: { label: '정지', cls: 'bg-red-100 text-[#EF4444]' },
  dormant:   { label: '휴면', cls: 'bg-yellow-100 text-yellow-700' },
  withdrawn: { label: '탈퇴', cls: 'bg-gray-100 text-gray-500' },
};

export function StatusBadge({ status }: { status: UserStatus }) {
  const { label, cls } = STATUS_CFG[status];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls}`}>{label}</span>;
}

// ─── Category ─────────────────────────────────────────────────────────────

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#F3EEFF] text-[#6C3FC5] whitespace-nowrap">
      {category}
    </span>
  );
}

// ─── Generic ──────────────────────────────────────────────────────────────

type Variant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

const VARIANT_CLS: Record<Variant, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-[#111111] text-white',
  success: 'bg-[#DCFCE7] text-[#16A34A]',
  warning: 'bg-yellow-100 text-yellow-700',
  danger:  'bg-red-100 text-[#EF4444]',
};

export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: Variant }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${VARIANT_CLS[variant]}`}>
      {children}
    </span>
  );
}
