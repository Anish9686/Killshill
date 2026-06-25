export interface KOL {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  bio: string;
  verified: boolean;
  total_signals: number;
  accuracy_pct: number;
  avg_roi_pct: number;
  joined_at: string;
  last_signal_at: string;
}

export type SignalDirection = 'BUY' | 'SELL';

export type SignalStatus = 'OPEN' | 'TARGET_HIT' | 'STOPLOSS_HIT' | 'EXPIRED';

export interface Signal {
  id: string;
  kol_id: string;
  symbol: string;
  direction: SignalDirection;
  entry_price: number;
  target_price: number;
  stop_loss: number;
  current_price: number;
  status: SignalStatus;
  roi_pct: number;
  entry_time: string;
  expiry_time: string;
  created_at: string;
}

export interface FilterState {
  search: string;
  minAccuracy: number;
}

export interface SortState {
  field: 'accuracy_pct' | 'total_signals' | 'avg_roi_pct';
  order: 'asc' | 'desc';
}

export interface GlobalStats {
  totalKols: number;
  averageAccuracy: number;
  averageRoi: number;
  totalSignals: number;
}
