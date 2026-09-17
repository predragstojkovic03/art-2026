import { HTMLAttributes } from 'react';
import { cn } from '@/shared/presentation/lib/utils';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'brand';

export function Badge({
  className,
  variant = 'default',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  const variants: Record<Variant, string> = {
    default: 'bg-[oklch(0.95_0.02_60)] text-[oklch(0.30_0.05_40)]',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    brand: 'bg-[oklch(0.95_0.05_40)] text-[oklch(0.35_0.15_40)] border border-[oklch(0.85_0.10_40)]',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
