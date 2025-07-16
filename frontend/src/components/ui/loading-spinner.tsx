import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const spinnerVariants = cva(
  'animate-spin rounded-full border-2 border-current border-t-transparent',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        default: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
      color: {
        primary: 'text-primary',
        secondary: 'text-secondary',
        success: 'text-success-600',
        error: 'text-error-600',
        warning: 'text-warning-600',
        love: 'text-love-600',
        energy: 'text-energy-600',
        neutral: 'text-neutral-400',
      },
    },
    defaultVariants: {
      size: 'default',
      color: 'primary',
    },
  }
);

export interface LoadingSpinnerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

function LoadingSpinner({ className, size, color, label, ...props }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label || 'Loading'}
      className={cn('inline-flex items-center justify-center', className)}
      {...props}
    >
      <div className={cn(spinnerVariants({ size, color }))} />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}

/**
 * Full-page loading spinner component
 */
export function PageLoadingSpinner({ className, ...props }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center h-64', className)}>
      <LoadingSpinner size="xl" label="Loading page..." {...props} />
    </div>
  );
}

/**
 * Inline loading spinner for buttons
 */
export function ButtonLoadingSpinner({ className, ...props }: LoadingSpinnerProps) {
  return (
    <LoadingSpinner 
      size="sm" 
      className={cn('mr-2', className)} 
      {...props} 
    />
  );
}

/**
 * Card loading spinner
 */
export function CardLoadingSpinner({ className, ...props }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center py-8', className)}>
      <LoadingSpinner size="lg" {...props} />
    </div>
  );
}

export { LoadingSpinner, spinnerVariants };