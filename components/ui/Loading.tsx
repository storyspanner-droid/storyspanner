type SpinnerSize = 'sm' | 'md' | 'lg';

const SPIN_SIZE: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function Spinner({ size = 'md' }: { size?: SpinnerSize }) {
  return (
    <svg className={`animate-spin text-[#111111] ${SPIN_SIZE[size]}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function PageLoading() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-[#6B7280]">로딩 중...</p>
      </div>
    </div>
  );
}

export function SkeletonBox({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />;
}

export function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <SkeletonBox className="h-5 w-14" />
        <SkeletonBox className="h-4 w-10" />
      </div>
      <SkeletonBox className="h-4 w-3/4" />
      <SkeletonBox className="h-3 w-full" />
      <SkeletonBox className="h-3 w-2/3" />
      <div className="flex justify-between pt-1">
        <SkeletonBox className="h-4 w-20" />
        <SkeletonBox className="h-4 w-16" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
