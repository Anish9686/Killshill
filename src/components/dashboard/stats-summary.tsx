'use client';

import React from 'react';
import { useKolStore } from '@/store/use-kol-store';
import { Card, CardContent } from '../shared/card';
import { Percent, TrendingUp, Radio, Award } from 'lucide-react';
import { formatRoi, formatNumber } from '@/lib/utils';

export function StatsSummary() {
  const kols = useKolStore((state) => state.kols);
  const signals = useKolStore((state) => state.signals);

  const stats = React.useMemo(() => {
    if (kols.length === 0) {
      return {
        avgAccuracy: 0,
        avgRoi: 0,
        totalSignals: 0,
        bestKol: 'N/A',
      };
    }

    const totalAcc = kols.reduce((sum, k) => sum + k.accuracy_pct, 0);
    const totalRoi = kols.reduce((sum, k) => sum + k.avg_roi_pct, 0);
    const avgAccuracy = totalAcc / kols.length;
    const avgRoi = totalRoi / kols.length;

    // Find KOL with highest accuracy + minimum of 20 signals
    const qualifiedKols = kols.filter((k) => k.total_signals >= 20);
    const bestKolsList = qualifiedKols.length > 0 ? qualifiedKols : kols;
    const best = [...bestKolsList].sort((a, b) => b.accuracy_pct - a.accuracy_pct)[0];

    return {
      avgAccuracy,
      avgRoi,
      totalSignals: signals.length || kols.reduce((sum, k) => sum + k.total_signals, 0),
      bestKol: best ? best.handle : 'N/A',
    };
  }, [kols, signals]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Accuracy Card */}
      <Card className="hover:border-violet-500/30 transition-all duration-300">
        <CardContent className="flex items-center justify-between p-4 sm:p-5">
          <div>
            <p className="text-xs text-zinc-500 font-mono tracking-wider uppercase">Platform Avg Accuracy</p>
            <h3 className="text-lg sm:text-2xl font-black text-emerald-400 mt-1">
              {stats.avgAccuracy.toFixed(1)}%
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Award className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Avg ROI Card */}
      <Card className="hover:border-violet-500/30 transition-all duration-300">
        <CardContent className="flex items-center justify-between p-4 sm:p-5">
          <div>
            <p className="text-xs text-zinc-500 font-mono tracking-wider uppercase">Platform Avg ROI</p>
            <h3 className={`text-lg sm:text-2xl font-black mt-1 ${stats.avgRoi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatRoi(stats.avgRoi)}
            </h3>
          </div>
          <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
            stats.avgRoi >= 0 
              ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-400' 
              : 'bg-rose-950/30 border-rose-500/20 text-rose-400'
          }`}>
            <TrendingUp className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Signals Tracked Card */}
      <Card className="hover:border-violet-500/30 transition-all duration-300">
        <CardContent className="flex items-center justify-between p-4 sm:p-5">
          <div>
            <p className="text-xs text-zinc-500 font-mono tracking-wider uppercase">Signals Audited</p>
            <h3 className="text-lg sm:text-2xl font-black text-zinc-100 mt-1">
              {formatNumber(stats.totalSignals)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
            <Radio className="h-5 w-5 animate-pulse text-violet-400" />
          </div>
        </CardContent>
      </Card>

      {/* Star Performer Card */}
      <Card className="hover:border-violet-500/30 transition-all duration-300">
        <CardContent className="flex items-center justify-between p-4 sm:p-5">
          <div>
            <p className="text-xs text-zinc-500 font-mono tracking-wider uppercase">Top Performer</p>
            <h3 className="text-lg sm:text-2xl font-black text-violet-400 mt-1 font-mono truncate max-w-[140px] sm:max-w-none">
              {stats.bestKol}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-violet-950/30 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Percent className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
