import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'premium';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:pointer-events-none disabled:opacity-50',
          {
            // default violet/indigo gradient button
            'bg-violet-600 text-white hover:bg-violet-500 active:scale-95 shadow-lg shadow-violet-950/20': variant === 'default',
            // destructive
            'bg-rose-600 text-white hover:bg-rose-500': variant === 'destructive',
            // outline
            'border border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-900/60 hover:text-white': variant === 'outline',
            // secondary
            'bg-zinc-800 text-zinc-100 hover:bg-zinc-700': variant === 'secondary',
            // ghost
            'text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-100': variant === 'ghost',
            // link
            'text-violet-400 underline-offset-4 hover:underline': variant === 'link',
            // premium killshill glowing style
            'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:brightness-110 transition-all active:scale-[0.98]': variant === 'premium',
          },
          {
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-md px-3 text-xs': size === 'sm',
            'h-11 rounded-md px-8': size === 'lg',
            'h-9 w-9 p-0': size === 'icon',
          },
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
