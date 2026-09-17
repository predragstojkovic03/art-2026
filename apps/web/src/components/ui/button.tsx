import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/presentation/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[oklch(0.45_0.20_40)] text-white hover:bg-[oklch(0.55_0.20_40)] shadow-sm hover:shadow',
  secondary:
    'bg-white text-[oklch(0.25_0.10_40)] border border-[oklch(0.85_0.02_60)] hover:bg-[oklch(0.98_0.02_60)]',
  ghost:
    'bg-transparent text-[oklch(0.30_0.05_40)] hover:bg-[oklch(0.95_0.02_60)]',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  outline:
    'bg-transparent text-[oklch(0.25_0.10_40)] border border-[oklch(0.45_0.20_40)] hover:bg-[oklch(0.98_0.02_60)]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.65_0.18_40)] focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
