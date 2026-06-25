'use client';

import React from 'react';
import { useKolStore } from '@/store/use-kol-store';
import { Badge } from '../shared/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../shared/drawer-sheet';
import { formatRoi, formatNumber, cn } from '@/lib/utils';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { TrendingUp, TrendingDown, Target, ShieldAlert, Clock, Star } from 'lucide-react';

export function SignalDrawer() {
  const selectedKolId = useKolStore((state) => state.selectedKolId);
  const setSelectedKolId = useKolStore((state) => state.setSelectedKolId);
  const kols = useKolStore((state) => state.kols);
  const signals = useKolStore((state) => state.signals);

  const kol = kols.find((k) => k.id === selectedKolId);
  const kolSignals = React.useMemo(() => {
    if (!selectedKolId) return [];
    return signals
      .filter((s) => s.kol_id === selectedKolId)
      .sort((a, b) => new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime())
      .slice(0, 10);
  }, [selectedKolId, signals]);

  const isOpen = selectedKolId !== null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedKolId(null);
    }
  };

  if (!kol) return null;

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="overflow-y-auto w-full sm:max-w-xl bg-[#050811]/98 border-l border-zinc-900 shadow-[0_0_50px_rgba(0,0,0,0.9)] pr-2">
        <div className="pr-4 flex flex-col h-full">
          {/* KOL Profile Header with Glow Frame */}
          <SheetHeader className="text-left mb-6 border-b border-zinc-900 pb-5">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={kol.avatar}
                  alt={kol.name}
                  className="w-14 h-14 rounded-full border border-zinc-800 bg-zinc-950 ring-2 ring-violet-500/30 ring-offset-2 ring-offset-zinc-950"
                />
                {kol.verified && (
                  <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-violet-600 border-2 border-zinc-950 text-[10px] text-white">
                    ✓
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <SheetTitle className="text-xl font-black text-white leading-tight">
                    {kol.name}
                  </SheetTitle>
                  <div className="flex items-center gap-1 bg-violet-950/20 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                    <Star className="h-3 w-3 fill-current text-violet-400" />
                    KOL AUDITED
                  </div>
                </div>
                <p className="text-xs text-zinc-500 font-mono mt-1">{kol.handle}</p>
              </div>
            </div>
            <SheetDescription className="mt-4 text-xs text-zinc-400 leading-relaxed italic border-l-2 border-violet-500/40 pl-3.5">
              {kol.bio || 'No bio registered.'}
            </SheetDescription>
          </SheetHeader>

          {/* Quick Performance Indicators Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6 bg-zinc-950/60 border border-zinc-900/60 p-4 rounded-xl font-mono text-center relative overflow-hidden shadow-inner">
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider">Accuracy</span>
              <span className="text-lg font-black text-emerald-400 mt-1">
                {kol.accuracy_pct.toFixed(1)}%
              </span>
            </div>
            <div className="flex flex-col border-x border-zinc-900/80">
              <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider">Avg ROI</span>
              <span className={cn('text-lg font-black mt-1', kol.avg_roi_pct >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                {formatRoi(kol.avg_roi_pct)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider">Total Calls</span>
              <span className="text-lg font-black text-zinc-200 mt-1">
                {kol.total_signals}
              </span>
            </div>
          </div>

          {/* Signals List Title */}
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3.5 flex items-center gap-2">
            <Clock className="h-4 w-4 text-violet-400" />
            Trade Signal Ledger Feed (Top 10)
          </h4>

          {/* Color-Coded Signals Card Stack */}
          <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pb-6">
            {kolSignals.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm font-mono border border-dashed border-zinc-900 rounded-xl uppercase tracking-wider">
                No trading signals logged.
              </div>
            ) : (
              kolSignals.map((signal) => {
                const formattedTime = formatDistanceToNow(parseISO(signal.entry_time), {
                  addSuffix: true,
                });

                // Status outcome label
                let outcomeLabel = 'Expired';

                if (signal.status === 'TARGET_HIT') {
                  outcomeLabel = 'Target Hit';
                } else if (signal.status === 'STOPLOSS_HIT') {
                  outcomeLabel = 'Stoploss Hit';
                } else if (signal.status === 'OPEN') {
                  outcomeLabel = 'Active Call';
                } else if (signal.status === 'EXPIRED') {
                  outcomeLabel = 'Expired';
                }

                const roiValue = signal.roi_pct;
                const isPositiveRoi = roiValue >= 0;

                return (
                  <div
                    key={signal.id}
                    className={cn(
                      'relative border-r border-y border-zinc-900/60 rounded-r-xl rounded-l p-4 transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex flex-col gap-3',
                      signal.status === 'TARGET_HIT' && 'border-l-3 border-l-emerald-500 bg-emerald-950/5 hover:bg-emerald-950/10',
                      signal.status === 'STOPLOSS_HIT' && 'border-l-3 border-l-rose-500 bg-rose-950/5 hover:bg-rose-950/10',
                      signal.status === 'OPEN' && 'border-l-3 border-l-amber-500 bg-amber-950/5 hover:bg-amber-950/10',
                      signal.status === 'EXPIRED' && 'border-l-3 border-l-zinc-700 bg-zinc-900/5 hover:bg-zinc-900/10'
                    )}
                  >
                    {/* Signal Top Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-white text-base tracking-tight font-sans">
                          {signal.symbol}
                        </span>
                        <Badge variant={signal.direction === 'BUY' ? 'buy' : 'sell'}>
                          {signal.direction}
                        </Badge>
                      </div>
                      
                      {/* ROI Display with custom gradient glows */}
                      <span className={cn(
                        'text-xs font-mono font-black flex items-center gap-0.5 px-2 py-0.5 rounded border',
                        isPositiveRoi 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      )}>
                        {isPositiveRoi ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {roiValue >= 0 ? '+' : ''}
                        {roiValue.toFixed(2)}%
                      </span>
                    </div>

                    {/* Status LED Ticker */}
                    <div className="flex items-center justify-between text-xs border-b border-zinc-900/40 pb-2.5">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        {/* Pulse LED indicator lights */}
                        <span className={cn(
                          'w-1.5 h-1.5 rounded-full shrink-0',
                          signal.status === 'TARGET_HIT' && 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]',
                          signal.status === 'STOPLOSS_HIT' && 'bg-rose-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]',
                          signal.status === 'OPEN' && 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-led',
                          signal.status === 'EXPIRED' && 'bg-zinc-600'
                        )} />
                        <span className={cn(
                          'font-semibold',
                          signal.status === 'TARGET_HIT' && 'text-emerald-400',
                          signal.status === 'STOPLOSS_HIT' && 'text-rose-400',
                          signal.status === 'OPEN' && 'text-amber-400',
                          signal.status === 'EXPIRED' && 'text-zinc-500'
                        )}>
                          {outcomeLabel}
                        </span>
                      </div>
                      <span className="text-zinc-500 font-mono text-[10px]">{formattedTime}</span>
                    </div>

                    {/* Ledger Pricing Grid */}
                    <div className="grid grid-cols-4 gap-2 bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-900/50 text-center font-mono relative">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider">Entry</span>
                        <span className="text-xs text-zinc-300 font-bold mt-1">
                          {signal.entry_price < 1 ? signal.entry_price.toFixed(4) : formatNumber(signal.entry_price)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider flex items-center justify-center gap-0.5">
                          <Target className="h-2 w-2 text-emerald-500" />
                          Target
                        </span>
                        <span className="text-xs text-emerald-400 font-bold mt-1">
                          {signal.target_price < 1 ? signal.target_price.toFixed(4) : formatNumber(signal.target_price)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider flex items-center justify-center gap-0.5">
                          <ShieldAlert className="h-2 w-2 text-rose-500" />
                          Stop
                        </span>
                        <span className="text-xs text-rose-400 font-bold mt-1">
                          {signal.stop_loss < 1 ? signal.stop_loss.toFixed(4) : formatNumber(signal.stop_loss)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider">Current</span>
                        <span className="text-xs text-zinc-400 font-bold mt-1">
                          {signal.current_price < 1 ? signal.current_price.toFixed(4) : formatNumber(signal.current_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
