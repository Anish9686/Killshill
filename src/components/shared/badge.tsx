import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'destructive' | 'warning' | 'info' | 'buy' | 'sell';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        {
          // default / fallback
          'border-transparent bg-violet-600 text-slate-50 hover:bg-violet-600/80': variant === 'default',
          'border-transparent bg-zinc-800 text-zinc-300': variant === 'secondary',
          'border-zinc-700 bg-transparent text-zinc-300': variant === 'outline',
          
          // success (Target Hit)
          'border-emerald-500/20 bg-emerald-500/10 text-emerald-400': variant === 'success',
          
          // destructive (Stoploss Hit)
          'border-rose-500/20 bg-rose-500/10 text-rose-400': variant === 'destructive',
          
          // warning / open
          'border-amber-500/20 bg-amber-500/10 text-amber-400': variant === 'warning',
          
          // info / expired
          'border-zinc-500/20 bg-zinc-800/40 text-zinc-400': variant === 'info',
          
          // Buy (neon green background style)
          'border-emerald-500/30 bg-emerald-950/40 text-emerald-400 font-bold': variant === 'buy',
          
          // Sell (neon red/rose background style)
          'border-rose-500/30 bg-rose-950/40 text-rose-400 font-bold': variant === 'sell',
        },
        className
      )}
      {...props}
    />
  );
}
