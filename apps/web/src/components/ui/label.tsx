import { LabelHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/presentation/lib/utils';

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('block text-sm font-medium text-[oklch(0.30_0.05_40)] mb-1.5', className)}
      {...props}
    >
      {children}
      {required && <span className="text-red-600 ml-0.5">*</span>}
    </label>
  ),
);
Label.displayName = 'Label';
