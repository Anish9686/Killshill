'use client';

import React, { useMemo, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { useKolStore } from '@/store/use-kol-store';
import { KOL } from '@/types';
import { SparklineChart } from './sparkline-chart';
import { Button } from '../shared/button';
import { cn, formatRoi } from '@/lib/utils';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight, Trophy } from 'lucide-react';

export function LeaderboardTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const kols = useKolStore((state) => state.kols);
  const signals = useKolStore((state) => state.signals);
  const setSelectedKolId = useKolStore((state) => state.setSelectedKolId);

  // 1. Parse filter/sort options from the URL
  const searchQuery = searchParams.get('search') || '';
  const minAccuracy = Number(searchParams.get('minAccuracy') || '0');
  const sortBy = (searchParams.get('sortBy') || 'avg_roi_pct') as 'accuracy_pct' | 'total_signals' | 'avg_roi_pct';
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

  // 2. Perform filtering & sorting in useMemo
  const processedData = useMemo(() => {
    let result = [...kols];

    // Filter by handle search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (kol) =>
          kol.handle.toLowerCase().includes(q) ||
          kol.name.toLowerCase().includes(q)
      );
    }

    // Filter by min accuracy
    if (minAccuracy > 0) {
      result = result.filter((kol) => kol.accuracy_pct >= minAccuracy);
    }

    // Sort by field
    result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [kols, searchQuery, minAccuracy, sortBy, sortOrder]);

  // 3. Helper to update sorting URL params
  const handleSortChange = useCallback((field: 'accuracy_pct' | 'total_signals' | 'avg_roi_pct') => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortBy === field) {
      // Toggle direction
      params.set('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to desc
      params.set('sortBy', field);
      params.set('sortOrder', 'desc');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, sortBy, sortOrder, router, pathname]);

  // 4. Keyboard navigation handler
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    kolId: string,
    index: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSelectedKolId(kolId);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextRow = document.querySelector(`[data-row-index="${index + 1}"]`) as HTMLElement;
      if (nextRow) nextRow.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevRow = document.querySelector(`[data-row-index="${index - 1}"]`) as HTMLElement;
      if (prevRow) prevRow.focus();
    }
  };

  // 5. TanStack Table Column Definitions
  const columns = useMemo<ColumnDef<KOL>[]>(
    () => [
      {
        id: 'rank',
        header: '#',
        cell: (info) => {
          const index = info.row.index;
          if (index === 0) {
            return (
              <div className="flex items-center justify-center w-6 h-6 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Trophy className="h-3 w-3" />
              </div>
            );
          }
          if (index === 1) {
            return (
              <div className="flex items-center justify-center w-6 h-6 rounded bg-slate-400/10 border border-slate-400/20 text-slate-300">
                <Trophy className="h-3 w-3" />
              </div>
            );
          }
          if (index === 2) {
            return (
              <div className="flex items-center justify-center w-6 h-6 rounded bg-amber-700/10 border border-amber-700/20 text-amber-600">
                <Trophy className="h-3 w-3" />
              </div>
            );
          }
          return <span className="font-mono text-zinc-650 font-bold text-xs pl-2">{index + 1}</span>;
        },
      },
      {
        accessorKey: 'handle',
        header: 'KOL Handle',
        cell: (info) => {
          const kol = info.row.original;
          return (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={kol.avatar}
                alt={kol.name}
                className="w-8.5 h-8.5 rounded-full border border-zinc-800 bg-zinc-900 shrink-0 ring-1 ring-zinc-800/40 ring-offset-1 ring-offset-zinc-950"
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-zinc-100 group-hover:text-violet-400 transition-colors truncate max-w-[120px] sm:max-w-none">
                    {kol.name}
                  </span>
                  {kol.verified && (
                    <span className="text-[9px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded px-1 shrink-0 select-none">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-zinc-500 font-mono leading-none mt-0.5">
                  {kol.handle}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'accuracy_pct',
        header: () => {
          const active = sortBy === 'accuracy_pct';
          return (
            <button
              onClick={() => handleSortChange('accuracy_pct')}
              className={cn(
                'flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-left font-mono text-[11px] uppercase tracking-wider',
                active ? 'text-violet-400 font-bold' : 'text-zinc-500'
              )}
            >
              Accuracy
              {active ? (
                sortOrder === 'asc' ? <ArrowUp className="h-3.5 w-3.5 text-violet-400" /> : <ArrowDown className="h-3.5 w-3.5 text-violet-400" />
              ) : (
                <ArrowUpDown className="h-3.5 w-3.5 text-zinc-650" />
              )}
            </button>
          );
        },
        cell: (info) => {
          const acc = info.getValue() as number;
          return (
            <div className="flex flex-col gap-1 w-24">
              <span className="font-mono text-zinc-200 font-bold text-xs">{acc.toFixed(1)}%</span>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-950">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)] rounded-full"
                  style={{ width: `${acc}%` }}
                />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'total_signals',
        header: () => {
          const active = sortBy === 'total_signals';
          return (
            <button
              onClick={() => handleSortChange('total_signals')}
              className={cn(
                'flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-left font-mono text-[11px] uppercase tracking-wider',
                active ? 'text-violet-400 font-bold' : 'text-zinc-500'
              )}
            >
              Signals
              {active ? (
                sortOrder === 'asc' ? <ArrowUp className="h-3.5 w-3.5 text-violet-400" /> : <ArrowDown className="h-3.5 w-3.5 text-violet-400" />
              ) : (
                <ArrowUpDown className="h-3.5 w-3.5 text-zinc-650" />
              )}
            </button>
          );
        },
        cell: (info) => {
          const signalsCount = info.getValue() as number;
          return <span className="font-mono text-zinc-200 text-xs font-semibold">{signalsCount}</span>;
        },
      },
      {
        accessorKey: 'avg_roi_pct',
        header: () => {
          const active = sortBy === 'avg_roi_pct';
          return (
            <button
              onClick={() => handleSortChange('avg_roi_pct')}
              className={cn(
                'flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-left font-mono text-[11px] uppercase tracking-wider',
                active ? 'text-violet-400 font-bold' : 'text-zinc-500'
              )}
            >
              Avg ROI
              {active ? (
                sortOrder === 'asc' ? <ArrowUp className="h-3.5 w-3.5 text-violet-400" /> : <ArrowDown className="h-3.5 w-3.5 text-violet-400" />
              ) : (
                <ArrowUpDown className="h-3.5 w-3.5 text-zinc-650" />
              )}
            </button>
          );
        },
        cell: (info) => {
          const roi = info.getValue() as number;
          const original = info.row.original;
          
          // Generate ROI sparkline from specific KOL signal data
          const kolSignalsRoi = signals
            .filter((s) => s.kol_id === original.id)
            .sort((a, b) => new Date(a.entry_time).getTime() - new Date(b.entry_time).getTime())
            .map((s) => s.roi_pct);

          const isPositive = roi >= 0;

          return (
            <div className="flex items-center gap-4 min-w-[150px]">
              <span className={cn(
                'font-mono font-bold text-xs shrink-0 px-2 py-0.5 rounded border tracking-tight',
                isPositive 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.05)]'
              )}>
                {formatRoi(roi)}
              </span>
              <div className="flex-1 opacity-60 hover:opacity-100 transition-opacity max-w-[80px]">
                <SparklineChart data={kolSignalsRoi} />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'last_signal_at',
        header: 'Last Signal',
        cell: (info) => {
          const dateStr = info.getValue() as string;
          if (!dateStr) return <span className="text-zinc-600 font-mono text-xs">Never</span>;
          try {
            const time = formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
            return <span className="text-zinc-450 font-mono text-[11px] whitespace-nowrap">{time}</span>;
          } catch {
            return <span className="text-zinc-450 font-mono text-[11px]">Recently</span>;
          }
        },
      },
      {
        id: 'actions',
        cell: (info) => {
          const kol = info.row.original;
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedKolId(kol.id)}
              className="border-zinc-900 bg-zinc-950/20 text-zinc-400 group-hover:text-white group-hover:bg-violet-600 group-hover:border-transparent text-xs gap-1 font-mono transition-all duration-200 cursor-pointer h-7 px-2.5"
            >
              Audit
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          );
        },
      },
    ],
    [signals, sortBy, sortOrder, handleSortChange, setSelectedKolId]
  );

  // 6. Build the table instance
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: processedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative overflow-x-auto border border-zinc-900 bg-zinc-950/20 rounded-xl backdrop-blur-md hidden md:block">
      <table className="w-full text-sm text-left text-zinc-300">
        <thead className="text-[10px] uppercase font-mono text-zinc-500 border-b border-zinc-900 bg-zinc-950/60 tracking-wider">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-5 py-3 font-semibold select-none">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-zinc-900/60">
          {table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              tabIndex={0}
              data-row-index={index}
              onKeyDown={(e) => handleKeyDown(e, row.original.id, index)}
              className="group hover:bg-zinc-900/20 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-transparent focus:before:bg-violet-500 focus:bg-violet-950/10 focus:ring-0 focus:outline-none transition-all duration-150 cursor-pointer"
              onClick={() => setSelectedKolId(row.original.id)}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-5 py-2.5 align-middle">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {processedData.length === 0 && (
        <div className="text-center py-16 text-zinc-500 text-sm font-mono uppercase tracking-wider">
          No records match current search filters.
        </div>
      )}
    </div>
  );
}
