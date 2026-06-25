'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '../shared/button';
import { Slider } from '../shared/slider';

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  // Read search parameters as initial states
  const searchParam = searchParams.get('search') || '';
  const minAccuracyParam = Number(searchParams.get('minAccuracy') || '0');

  const [localSearch, setLocalSearch] = useState(searchParam);
  const [localAccuracy, setLocalAccuracy] = useState(minAccuracyParam);

  // Focus search input when Ctrl+K / Cmd+K or "/" is pressed
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA' || activeEl?.getAttribute('contenteditable') === 'true';

      if (e.key === '/' && !isInput) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Sync state if URL changes externally (like clear filters)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalSearch(searchParam);
  }, [searchParam]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalAccuracy(minAccuracyParam);
  }, [minAccuracyParam]);

  const debouncedSearch = useDebounce(localSearch, 300);
  const debouncedAccuracy = useDebounce(localAccuracy, 300);

  // Write changes back to the URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (debouncedSearch.trim()) {
      params.set('search', debouncedSearch.trim());
    } else {
      params.delete('search');
    }

    if (debouncedAccuracy > 0) {
      params.set('minAccuracy', debouncedAccuracy.toString());
    } else {
      params.delete('minAccuracy');
    }

    const currentParamsStr = searchParams.toString();
    const newParamsStr = params.toString();
    if (currentParamsStr !== newParamsStr) {
      // Replace the URL state
      router.replace(`${pathname}?${newParamsStr}`, { scroll: false });
    }
  }, [debouncedSearch, debouncedAccuracy, router, pathname, searchParams]);

  const handleClear = () => {
    setLocalSearch('');
    setLocalAccuracy(0);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('minAccuracy');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const isDirty = localSearch !== '' || localAccuracy > 0;

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-zinc-900/20 border border-zinc-900 p-4 rounded-xl backdrop-blur-md w-full mb-6 relative">
      {/* Search Input Container */}
      <div className="relative w-full md:w-80 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search handles (e.g. @Trend)"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-14 bg-zinc-950/80 border border-zinc-900 text-zinc-100 rounded-lg text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
        />
        {/* Vercel-style hotkey cue / clean filter trigger */}
        {!localSearch && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 pointer-events-none select-none font-mono text-[9px] text-zinc-600 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
            <span>⌘</span>
            <span>K</span>
          </div>
        )}
        {localSearch && (
          <button
            onClick={() => setLocalSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Accuracy Filter Slider Container */}
      <div className="flex items-center gap-4 w-full md:flex-1">
        <SlidersHorizontal className="h-4 w-4 text-zinc-600 shrink-0 hidden sm:block" />
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-zinc-400">Min Accuracy Audit</span>
            <span className="text-violet-400 font-bold font-mono bg-violet-950/20 px-2 py-0.5 rounded border border-violet-500/10">
              {localAccuracy}%
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-zinc-600 font-mono">0%</span>
            <div className="flex-1 flex flex-col justify-center">
              <Slider
                min={0}
                max={100}
                step={1}
                value={[localAccuracy]}
                onValueChange={(val) => setLocalAccuracy(val[0] || 0)}
              />
              {/* Clickable range snapping markers */}
              <div className="flex justify-between px-1 text-[9px] text-zinc-600 mt-1.5 select-none font-mono">
                <span className="cursor-pointer hover:text-violet-400 transition-colors" onClick={() => setLocalAccuracy(0)}>0%</span>
                <span className="cursor-pointer hover:text-violet-400 transition-colors" onClick={() => setLocalAccuracy(25)}>25%</span>
                <span className="cursor-pointer hover:text-violet-400 transition-colors" onClick={() => setLocalAccuracy(50)}>50%</span>
                <span className="cursor-pointer hover:text-violet-400 transition-colors" onClick={() => setLocalAccuracy(75)}>75%</span>
                <span className="cursor-pointer hover:text-violet-400 transition-colors" onClick={() => setLocalAccuracy(100)}>100%</span>
              </div>
            </div>
            <span className="text-[10px] text-zinc-600 font-mono">100%</span>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      {isDirty && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-zinc-400 hover:text-white shrink-0 hover:bg-zinc-800/40 w-full md:w-auto font-mono text-xs uppercase"
        >
          Reset Filter
        </Button>
      )}
    </div>
  );
}
