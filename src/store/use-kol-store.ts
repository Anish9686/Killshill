import { create } from 'zustand';
import { KOL, Signal } from '@/types';
import { ApiService } from '@/services/api';
import { toast } from 'sonner';

interface KolStore {
  kols: KOL[];
  signals: Signal[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: string | null;
  selectedKolId: string | null;
  
  // Actions
  fetchData: (force?: boolean) => Promise<void>;
  refreshData: () => Promise<void>;
  setSelectedKolId: (id: string | null) => void;
  clearError: () => void;
}

export const useKolStore = create<KolStore>((set, get) => ({
  kols: [],
  signals: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,
  selectedKolId: null,

  setSelectedKolId: (id) => set({ selectedKolId: id }),

  clearError: () => set({ error: null }),

  fetchData: async (force = false) => {
    const { kols, isLoading } = get();
    // Avoid double fetching if we already have data and are not forcing a refresh
    if (kols.length > 0 && !force && !isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const [kolsData, signalsData] = await Promise.all([
        ApiService.fetchKols(),
        ApiService.fetchSignals(),
      ]);

      set({
        kols: kolsData,
        signals: signalsData,
        isLoading: false,
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve audit data';
      set({
        isLoading: false,
        error: errorMessage,
      });
      toast.error(`Loading error: ${errorMessage}`);
    }
  },

  refreshData: async () => {
    const { isRefreshing } = get();
    if (isRefreshing) return;

    // Optimistic refresh: preserve existing data while loading
    set({ isRefreshing: true });
    
    // Simulate a brief loading delay (e.g. 800ms) to ensure premium feel and visibility of states
    const apiCallPromise = Promise.all([
      ApiService.fetchKols(),
      ApiService.fetchSignals(),
    ]);

    const delayPromise = new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const [results] = await Promise.all([apiCallPromise, delayPromise]);
      const [kolsData, signalsData] = results;

      set({
        kols: kolsData,
        signals: signalsData,
        isRefreshing: false,
        lastUpdated: new Date().toISOString(),
      });
      toast.success('Audit data updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network sync failed';
      set({ isRefreshing: false });
      toast.error(`Refresh failed: ${errorMessage}`);
    }
  },
}));
