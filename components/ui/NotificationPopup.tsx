'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Notification, NotificationType } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

const TYPE_ICON: Record<NotificationType, string> = {
  comment:       '💬',
  reply:         '↩️',
  like:          '❤️',
  follow:        '👤',
  announcement:  '📢',
  post_approved: '✅',
  post_rejected: '❌',
};

function timeAgo(ts: Timestamp): string {
  const diff = Date.now() - ts.toMillis();
  if (diff < 60_000) return '방금 전';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}분 전`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}시간 전`;
  const d = new Date(ts.toMillis());
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

interface Props {
  notifications: Notification[];
  loading: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export default function NotificationPopup({
  notifications,
  loading,
  onClose,
  onMarkRead,
  onMarkAllRead,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-[340px] bg-white border border-[#E5E7EB] rounded-[16px] shadow-xl overflow-hidden z-50"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-[#111111]">알림</span>
          {unread > 0 && (
            <span className="text-[11px] font-bold text-white bg-[#EF4444] px-1.5 py-0.5 rounded-full leading-none">
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-[12px] text-[#6C3FC5] hover:underline transition-colors"
          >
            모두 읽음
          </button>
        )}
      </div>

      {/* 목록 */}
      <div className="max-h-[380px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-5 h-5 border-2 border-[#6C3FC5] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <span className="text-[28px]">🔔</span>
            <p className="text-[13px] text-[#9CA3AF]">알림이 없습니다</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#F9FAFB]">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`flex gap-3 px-5 py-3.5 transition-colors cursor-pointer hover:bg-[#F8F7F4] ${
                  !n.read ? 'bg-[#FAFAFF]' : ''
                }`}
                onClick={() => {
                  if (!n.read) onMarkRead(n.id);
                }}
              >
                {/* 아이콘 */}
                <span className="text-[20px] shrink-0 mt-0.5">{TYPE_ICON[n.type]}</span>

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] leading-[1.6] ${!n.read ? 'font-medium text-[#111111]' : 'text-[#4B5563]'}`}>
                    {n.message}
                  </p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">{timeAgo(n.createdAt)}</p>
                </div>

                {/* 읽지 않은 점 */}
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-[#6C3FC5] shrink-0 mt-1.5" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 푸터 */}
      <div className="border-t border-[#F3F4F6] px-5 py-3 text-center">
        <Link
          href="/mypage"
          onClick={onClose}
          className="text-[12px] text-[#6B7280] hover:text-[#6C3FC5] transition-colors"
        >
          마이페이지에서 전체 보기 →
        </Link>
      </div>
    </div>
  );
}
