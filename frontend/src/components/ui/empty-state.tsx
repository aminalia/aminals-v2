import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from './button';

const emptyStateVariants = cva(
  'flex flex-col items-center justify-center text-center',
  {
    variants: {
      size: {
        sm: 'py-8 px-4',
        default: 'py-12 px-6',
        lg: 'py-16 px-8',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
}

function EmptyState({
  className,
  size,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div className={cn(emptyStateVariants({ size }), className)} {...props}>
      {icon && (
        <div className="mb-4 text-6xl opacity-50" role="img" aria-hidden="true">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          {description}
        </p>
      )}
      
      {action && (
        <Button
          variant={action.variant || 'default'}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * Aminals-specific empty states
 */
export function NoAminalsFound({ className, ...props }: Omit<EmptyStateProps, 'icon' | 'title'>) {
  return (
    <EmptyState
      icon="🐾"
      title="No Aminals Found"
      description="No Aminals match your current filters. Try adjusting your search criteria."
      className={cn('bg-neutral-50 rounded-lg border border-neutral-200', className)}
      {...props}
    />
  );
}

export function NoGenesFound({ className, ...props }: Omit<EmptyStateProps, 'icon' | 'title'>) {
  return (
    <EmptyState
      icon="🧬"
      title="No Genes Found"
      description="No genes match your current filters. Try exploring different categories."
      className={cn('bg-neutral-50 rounded-lg border border-neutral-200', className)}
      {...props}
    />
  );
}

export function NoAuctionsFound({ className, ...props }: Omit<EmptyStateProps, 'icon' | 'title'>) {
  return (
    <EmptyState
      icon="💕"
      title="No Auctions Found"
      description="There are no active breeding auctions at the moment. Check back later!"
      className={cn('bg-neutral-50 rounded-lg border border-neutral-200', className)}
      {...props}
    />
  );
}

export function WalletNotConnected({ className, ...props }: Omit<EmptyStateProps, 'icon' | 'title'>) {
  return (
    <EmptyState
      icon="👛"
      title="Wallet Not Connected"
      description="Connect your wallet to interact with Aminals and view your collection."
      className={cn('bg-blue-50 rounded-lg border border-blue-200', className)}
      {...props}
    />
  );
}

export function ErrorState({ 
  className, 
  error,
  onRetry,
  ...props 
}: Omit<EmptyStateProps, 'icon' | 'title'> & { 
  error?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon="⚠️"
      title="Something went wrong"
      description={error || "We're having trouble loading this content. Please try again."}
      action={onRetry ? { label: 'Try Again', onClick: onRetry, variant: 'outline' } : undefined}
      className={cn('bg-error-50 rounded-lg border border-error-200', className)}
      {...props}
    />
  );
}

export { EmptyState, emptyStateVariants };