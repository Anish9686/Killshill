export const API_ENDPOINTS = {
  KOLS: 'https://gist.githubusercontent.com/Sandeepsorout01/4fef48fa4ddaa7551ad9fdeb5a0087e1/raw/kols.json',
  SIGNALS: 'https://gist.githubusercontent.com/Sandeepsorout01/4fef48fa4ddaa7551ad9fdeb5a0087e1/raw/signals.json',
};

export const DEFAULT_FILTERS = {
  search: '',
  minAccuracy: 0,
};

export const DEFAULT_SORT = {
  field: 'avg_roi_pct' as const,
  order: 'desc' as const,
};

export const APP_METADATA = {
  title: 'Killshill KOL Audit',
  description: 'Premium dark-themed leaderboard auditing crypto KOL trading signal accuracy and ROI performance.',
};
