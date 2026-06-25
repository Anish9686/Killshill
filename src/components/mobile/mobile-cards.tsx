'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useKolStore } from '@/store/use-kol-store';
import { Card, CardContent } from '../shared/card';
import { cn, formatRoi } from '@/lib/utils';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Trophy, TrendingUp, TrendingDown, Clock } from 'lucide-react';

export function MobileCards() {
  const searchParams = useSearchParams();
  const kols = useKolStore((state) => state.kols);
  const setSelectedKolId = useKolStore((state) => state.setSelectedKolId);

  // Parse filters and sort from URL
  const searchQuery = searchParams.get('search') || '';
  const minAccuracy = Number(searchParams.get('minAccuracy') || '0');
  const sortBy = (searchParams.get('sortBy') || 'avg_roi_pct') as 'accuracy_pct' | 'total_signals' | 'avg_roi_pct';
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

  // Apply search filtering and sorting in sync with the table
  const processedData = useMemo(() => {
    let result = [...kols];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (kol) =>
          kol.handle.toLowerCase().includes(q) ||
          kol.name.toLowerCase().includes(q)
      );
    }

    if (minAccuracy > 0) {
      result = result.filter((kol) => kol.accuracy_pct >= minAccuracy);
    }

    result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [kols, searchQuery, minAccuracy, sortBy, sortOrder]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    kolId: string,
    index: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSelectedKolId(kolId);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextCard = document.querySelector(`[data-card-index="${index + 1}"]`) as HTMLElement;
      if (nextCard) nextCard.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevCard = document.querySelector(`[data-card-index="${index - 1}"]`) as HTMLElement;
      if (prevCard) prevCard.focus();
    }
  };

  return (
    <div className="flex flex-col gap-3.5 md:hidden">
      {processedData.map((kol, index) => {
        const isPositiveRoi = kol.avg_roi_pct >= 0;
        let lastSignalStr = 'Never';

        if (kol.last_signal_at) {
          try {
            lastSignalStr = formatDistanceToNow(parseISO(kol.last_signal_at), { addSuffix: true });
          } catch {
            lastSignalStr = 'Recently';
          }
        }

        return (
          <Card
            key={kol.id}
            tabIndex={0}
            data-card-index={index}
            onKeyDown={(e) => handleKeyDown(e, kol.id, index)}
            onClick={() => setSelectedKolId(kol.id)}
            className="border-zinc-900 bg-zinc-900/15 hover:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500/80 active:bg-zinc-900/35 transition-all duration-200 cursor-pointer relative overflow-hidden group"
          >
            <CardContent className="p-4 flex flex-col gap-3">
              {/* Header Info */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  {index === 0 ? (
                    <div className="flex items-center justify-center w-6.5 h-6.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <Trophy className="h-3.5 w-3.5" />
                    </div>
                  ) : index === 1 ? (
                    <div className="flex items-center justify-center w-6.5 h-6.5 rounded bg-slate-400/10 border border-slate-400/20 text-slate-300">
                      <Trophy className="h-3.5 w-3.5" />
                    </div>
                  ) : index === 2 ? (
                    <div className="flex items-center justify-center w-6.5 h-6.5 rounded bg-amber-700/10 border border-amber-700/20 text-amber-600">
                      <Trophy className="h-3.5 w-3.5" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-6.5 h-6.5 rounded bg-zinc-950 border border-zinc-900 text-xs font-mono font-bold text-zinc-550">
                      {index + 1}
                    </div>
                  )}
                  
                  {/* Avatar */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={kol.avatar}
                    alt={kol.name}
                    className="w-8.5 h-8.5 rounded-full border border-zinc-850 bg-zinc-950 shrink-0 ring-1 ring-zinc-800/40 ring-offset-1 ring-offset-zinc-950"
                  />

                  {/* Handle Name */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-zinc-150 text-sm group-hover:text-violet-400 transition-colors">{kol.name}</span>
                      {kol.verified && (
                        <span className="text-[9px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded px-1 shrink-0 select-none">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono leading-none mt-0.5">{kol.handle}</span>
                  </div>
                </div>

                {/* Audit trigger text */}
                <div className="text-[10px] uppercase font-mono font-bold text-violet-400 tracking-wider">
                  Audit &rarr;
                </div>
              </div>

              {/* Stats Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-900/60 text-center font-mono">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Accuracy</span>
                  <span className="text-xs font-bold text-emerald-400 mt-1">
                    {kol.accuracy_pct.toFixed(1)}%
                  </span>
                  {/* Mini visual indicator */}
                  <div className="w-8 h-1 bg-zinc-900 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: `${kol.accuracy_pct}%` }} />
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Avg ROI</span>
                  <span className={cn(
                    'text-xs font-bold mt-1 px-1.5 py-0.2 rounded border tracking-tight flex items-center gap-0.5',
                    isPositiveRoi 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  )}>
                    {isPositiveRoi ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {formatRoi(kol.avg_roi_pct)}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Signals</span>
                  <span className="text-xs font-bold text-zinc-200 mt-1">
                    {kol.total_signals}
                  </span>
                </div>
              </div>

              {/* Footer row */}
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-1 border-t border-zinc-900/60 pt-2.5">
                <Clock className="h-3.5 w-3.5 text-zinc-650" />
                <span>Last Signal:</span>
                <span className="font-mono text-zinc-400 font-medium">{lastSignalStr}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {processedData.length === 0 && (
        <div className="text-center py-12 text-zinc-500 text-sm font-mono uppercase tracking-wider bg-zinc-900/10 border border-dashed border-zinc-900 rounded-xl">
          No records match search filters.
        </div>
      )}
    </div>
  );
}
