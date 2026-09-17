import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/presentation/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-lg border border-[oklch(0.85_0.02_60)] bg-white px-3 py-2 text-sm',
        'placeholder:text-[oklch(0.60_0.02_60)]',
        'focus:outline-none focus:ring-2 focus:ring-[oklch(0.65_0.18_40)] focus:border-transparent',
        'disabled:bg-[oklch(0.96_0.01_60)] disabled:cursor-not-allowed',
        'transition-all',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
