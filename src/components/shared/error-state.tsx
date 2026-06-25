import * as React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isLoading?: boolean;
}

export function ErrorState({
  title = 'Database Synchronization Offline',
  message = 'We encountered an error connecting to the KOL audit registry nodes. Please check your internet connection or retry standard fetch sync.',
  onRetry,
  isLoading = false,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-rose-950/5 border border-dashed border-rose-950/40 rounded-xl max-w-lg mx-auto mt-10">
      <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-zinc-950 border border-rose-950/40 text-rose-500 mb-4 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
        <AlertCircle className="h-6 w-6 text-rose-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} loading={isLoading} className="border-rose-950/40 hover:bg-rose-950/10 hover:text-white text-rose-300">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry Connection
        </Button>
      )}
    </div>
  );
}
