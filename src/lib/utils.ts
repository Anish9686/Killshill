import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a percentage value to 1 decimal place.
 */
export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

/**
 * Formats ROI percentage to 1 decimal place without prefix.
 */
export function formatRoi(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Formats numeric values with commas.
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}
