import React from 'react';

export function Skeleton({ className = '', style = {} }) {
  return (
    <div
      className={`skeleton-meta rounded-xl ${className}`}
      style={style}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="kc-card p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}
export default Skeleton;
