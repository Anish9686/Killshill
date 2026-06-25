import { API_ENDPOINTS } from '@/lib/constants';
import { KOL, Signal } from '@/types';

interface RawKol {
  id?: string | number;
  handle?: string;
  name?: string;
  avatar?: string;
  bio?: string;
  verified?: boolean;
  total_signals?: number;
  accuracy_pct?: number;
  avg_roi_pct?: number;
  joined_at?: string;
  last_signal_at?: string;
}

interface RawSignal {
  id?: string | number;
  kol_id?: string | number;
  symbol?: string;
  direction?: string;
  entry_price?: number;
  target_price?: number;
  stop_loss?: number;
  current_price?: number;
  status?: string;
  roi_pct?: number;
  entry_time?: string;
  expiry_time?: string;
  created_at?: string;
}

export class ApiService {
  /**
   * Fetches the complete list of KOLs from the remote database
   */
  static async fetchKols(): Promise<KOL[]> {
    try {
      const response = await fetch(API_ENDPOINTS.KOLS, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Real-time revalidation check but allow caching
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch KOL data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Malformed KOL API response: expected an array');
      }

      return data.map((kol: RawKol) => ({
        id: String(kol.id || ''),
        handle: String(kol.handle || ''),
        name: String(kol.name || ''),
        avatar: String(kol.avatar || ''),
        bio: String(kol.bio || ''),
        verified: Boolean(kol.verified),
        total_signals: Number(kol.total_signals || 0),
        accuracy_pct: Number(kol.accuracy_pct || 0),
        avg_roi_pct: Number(kol.avg_roi_pct || 0),
        joined_at: String(kol.joined_at || ''),
        last_signal_at: String(kol.last_signal_at || ''),
      }));
    } catch (error) {
      // Re-throw for Zustand error management to capture
      throw error instanceof Error ? error : new Error('Unknown API network failure fetching KOLs');
    }
  }

  /**
   * Fetches the complete list of trading signals from the remote database
   */
  static async fetchSignals(): Promise<Signal[]> {
    try {
      const response = await fetch(API_ENDPOINTS.SIGNALS, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch signals data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Malformed Signals API response: expected an array');
      }

      return data.map((sig: RawSignal) => ({
        id: String(sig.id || ''),
        kol_id: String(sig.kol_id || ''),
        symbol: String(sig.symbol || ''),
        direction: (sig.direction === 'SELL' ? 'SELL' : 'BUY') as 'BUY' | 'SELL',
        entry_price: Number(sig.entry_price || 0),
        target_price: Number(sig.target_price || 0),
        stop_loss: Number(sig.stop_loss || 0),
        current_price: Number(sig.current_price || 0),
        status: String(sig.status || 'OPEN') as 'OPEN' | 'TARGET_HIT' | 'STOPLOSS_HIT' | 'EXPIRED',
        roi_pct: Number(sig.roi_pct || 0),
        entry_time: String(sig.entry_time || ''),
        expiry_time: String(sig.expiry_time || ''),
        created_at: String(sig.created_at || ''),
      }));
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown API network failure fetching Signals');
    }
  }
}
