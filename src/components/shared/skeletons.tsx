import * as React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-md animate-shimmer shrink-0', className)}
      {...props}
    />
  );
}

export function SkeletonHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-6 mb-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4.5 w-24" />
        </div>
        <Skeleton className="h-8.5 w-60 sm:w-80" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="flex items-center gap-3 mt-4 sm:mt-0">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-zinc-900 bg-zinc-900/10 p-5 flex items-center justify-between"
        >
          <div className="space-y-2 flex-1 mr-4">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl overflow-hidden hidden md:block">
      {/* Table Header */}
      <div className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-zinc-900 bg-zinc-950/40">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16 justify-self-end" />
      </div>
      
      {/* Table Rows */}
      <div className="divide-y divide-zinc-900/50">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="grid grid-cols-7 gap-4 px-6 py-4 items-center">
            <Skeleton className="h-4 w-4" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-8.5 w-8.5 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="space-y-1 w-24">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-1.5 w-full" />
            </div>
            <Skeleton className="h-4 w-8" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-10 shrink-0" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-16 rounded-lg justify-self-end shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonMobileCards() {
  return (
    <div className="flex flex-col gap-4 md:hidden">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4 space-y-4"
        >
          {/* Header row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-6.5 w-6.5 rounded shrink-0" />
              <Skeleton className="h-8.5 w-8.5 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <Skeleton className="h-4 w-10 shrink-0" />
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-3 gap-2 bg-zinc-950/40 p-3 rounded-lg border border-zinc-900/50">
            <div className="flex flex-col items-center gap-1.5">
              <Skeleton className="h-2 w-10" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Skeleton className="h-2 w-10" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Skeleton className="h-2 w-10" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>

          {/* Footer row */}
          <div className="flex items-center gap-2 border-t border-zinc-900/80 pt-3">
            <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0" />
            <Skeleton className="h-3.5 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}
