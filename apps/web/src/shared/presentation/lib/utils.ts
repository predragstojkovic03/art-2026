import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  return new Intl.DateTimeFormat('sr-RS', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatTime(time: string): string {
  return time.substring(0, 5);
}

export function dayName(day: 1 | 2): string {
  return day === 1 ? 'Slikarstvo' : 'Fotografija';
}
