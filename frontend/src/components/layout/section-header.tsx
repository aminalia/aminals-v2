/**
 * SectionHeader Component
 * 
 * Provides consistent section headers with typography, spacing, and optional actions.
 * Supports various heading levels and styling variants.
 */

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4';
  variant?: 'default' | 'large' | 'small';
  actions?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const SectionHeader = ({
  title,
  subtitle,
  description,
  level = 'h2',
  variant = 'default',
  actions,
  icon,
  className,
}: SectionHeaderProps) => {
  const HeadingComponent = level;

  const headingStyles = {
    h1: {
      default: 'text-3xl font-bold',
      large: 'text-4xl font-bold',
      small: 'text-2xl font-bold',
    },
    h2: {
      default: 'text-2xl font-bold',
      large: 'text-3xl font-bold',
      small: 'text-xl font-bold',
    },
    h3: {
      default: 'text-xl font-semibold',
      large: 'text-2xl font-semibold',
      small: 'text-lg font-semibold',
    },
    h4: {
      default: 'text-lg font-medium',
      large: 'text-xl font-medium',
      small: 'text-base font-medium',
    },
  };

  const spacingStyles = {
    default: 'mb-6',
    large: 'mb-8',
    small: 'mb-4',
  };

  return (
    <div className={cn('flex flex-col gap-2', spacingStyles[variant], className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-primary-600 text-xl">
              {icon}
            </div>
          )}
          <div>
            <HeadingComponent
              className={cn(
                headingStyles[level][variant],
                'text-foreground'
              )}
            >
              {title}
            </HeadingComponent>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      {description && (
        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;