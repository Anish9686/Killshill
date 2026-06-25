'use client';

import React, { useEffect, Suspense } from 'react';
import { useKolStore } from '@/store/use-kol-store';
import { HeaderSection } from '@/components/dashboard/header-section';
import { StatsSummary } from '@/components/dashboard/stats-summary';
import { FilterBar } from '@/components/filters/filter-bar';
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { MobileCards } from '@/components/mobile/mobile-cards';
import { SignalDrawer } from '@/components/drawer/signal-drawer';
import { ErrorState } from '@/components/shared/error-state';
import { Toaster } from 'sonner';
import {
  SkeletonHeader,
  SkeletonStats,
  SkeletonTable,
  SkeletonMobileCards,
} from '@/components/shared/skeletons';

function DashboardContent() {
  const kols = useKolStore((state) => state.kols);
  const isLoading = useKolStore((state) => state.isLoading);
  const error = useKolStore((state) => state.error);
  const fetchData = useKolStore((state) => state.fetchData);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error && kols.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <ErrorState
          message={error}
          onRetry={() => fetchData(true)}
          isLoading={isLoading}
        />
      </div>
    );
  }

  if (isLoading && kols.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <SkeletonHeader />
        <SkeletonStats />
        <div className="h-14 bg-zinc-900/10 border border-zinc-800 rounded-xl mb-6 animate-pulse" />
        <SkeletonTable />
        <SkeletonMobileCards />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col">
      {/* Page Header */}
      <HeaderSection />

      {/* Aggregated Stats Overview */}
      <StatsSummary />

      {/* Live Search & Accuracy Sliders */}
      <FilterBar />

      {/* Desktop Layout Table */}
      <LeaderboardTable />

      {/* Mobile Layout Cards Stack */}
      <MobileCards />

      {/* Sliding Details Drawer */}
      <SignalDrawer />
    </div>
  );
}

// Fallback Loader Wrapper for search param initialization
function LoadingFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <SkeletonHeader />
      <SkeletonStats />
      <div className="h-14 bg-zinc-900/10 border border-zinc-800 rounded-xl mb-6 animate-pulse" />
      <SkeletonTable />
      <SkeletonMobileCards />
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050811] text-zinc-100 selection:bg-violet-500/30">
      <main className="flex-1 flex flex-col">
        <Suspense fallback={<LoadingFallback />}>
          <DashboardContent />
        </Suspense>
      </main>
      
      {/* Toast Notification Container */}
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0b0f19',
            borderColor: '#1e293b',
            color: '#f8fafc',
          },
        }}
      />
    </div>
  );
}
