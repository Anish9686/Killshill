'use client';

import React, { useEffect, useState } from 'react';
import { useKolStore } from '@/store/use-kol-store';
import { Button } from '../shared/button';
import { RefreshCw, Database, Activity } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

export function HeaderSection() {
  const kols = useKolStore((state) => state.kols);
  const lastUpdated = useKolStore((state) => state.lastUpdated);
  const isRefreshing = useKolStore((state) => state.isRefreshing);
  const refreshData = useKolStore((state) => state.refreshData);

  const [relativeTime, setRelativeTime] = useState('Never');

  // Periodically refresh relative time string
  useEffect(() => {
    if (!lastUpdated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRelativeTime('Never');
      return;
    }

    const updateTime = () => {
      try {
        const time = formatDistanceToNow(parseISO(lastUpdated), { addSuffix: true });
        setRelativeTime(time);
      } catch {
        setRelativeTime('Just now');
      }
    };

    updateTime();
    // Update string every 15 seconds
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-6 mb-6">
      {/* Title block */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="relative flex items-center justify-center w-7.5 h-7.5 rounded bg-violet-950/40 border border-violet-500/20 text-violet-400">
            <Activity className="h-4.5 w-4.5 animate-pulse" />
          </div>
          <span className="text-xs font-semibold font-mono tracking-widest text-violet-400 uppercase">
            Alpha Database
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
          KILLSHILL KOL AUDIT
        </h1>
        <p className="text-sm text-zinc-400 mt-1 max-w-xl">
          Verifying accuracy, total signal counts, and average ROI performance of crypto influence leaders.
        </p>
      </div>

      {/* Sync stats & Refresh Button */}
      <div className="flex flex-wrap items-center gap-3 sm:self-end">
        {/* Tracked status info card */}
        <div className="flex items-center gap-2 bg-zinc-900/40 border border-zinc-850 px-3.5 py-1.5 rounded-lg text-xs font-mono">
          <Database className="h-3.5 w-3.5 text-zinc-500" />
          <span className="text-zinc-500">Tracked:</span>
          <span className="text-zinc-200 font-bold">{kols.length} KOLs</span>
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-500">Sync:</span>
          <span className="text-zinc-300 font-bold">{relativeTime}</span>
        </div>

        {/* Action Button */}
        <Button
          variant="premium"
          size="sm"
          onClick={refreshData}
          loading={isRefreshing}
          className="font-mono text-xs uppercase font-bold tracking-wider"
        >
          {!isRefreshing && <RefreshCw className="mr-2 h-3.5 w-3.5" />}
          {isRefreshing ? 'Syncing...' : 'Sync Registry'}
        </Button>
      </div>
    </header>
  );
}
