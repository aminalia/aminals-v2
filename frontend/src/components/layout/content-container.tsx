/**
 * ContentContainer Component
 * 
 * Provides standardized content areas with responsive behavior and consistent spacing.
 * Supports different layout patterns and grid configurations.
 */

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ContentContainerProps {
  children: ReactNode;
  layout?: 'single' | 'two-column' | 'three-column' | 'sidebar';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ContentContainer = ({
  children,
  layout = 'single',
  gap = 'md',
  className,
}: ContentContainerProps) => {
  const gapStyles = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  };

  const layoutStyles = {
    single: 'flex flex-col',
    'two-column': 'grid grid-cols-1 lg:grid-cols-2',
    'three-column': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    sidebar: 'grid grid-cols-1 lg:grid-cols-3 lg:gap-8',
  };

  return (
    <div className={cn(layoutStyles[layout], gapStyles[gap], className)}>
      {children}
    </div>
  );
};

/**
 * ContentSection Component
 * 
 * A wrapper for individual content sections within a ContentContainer.
 * Provides consistent padding and styling.
 */

interface ContentSectionProps {
  children: ReactNode;
  variant?: 'default' | 'card' | 'bordered' | 'elevated';
  className?: string;
}

export const ContentSection = ({
  children,
  variant = 'default',
  className,
}: ContentSectionProps) => {
  const variantStyles = {
    default: '',
    card: 'bg-card border border-border rounded-lg p-6',
    bordered: 'border border-border rounded-lg p-6',
    elevated: 'bg-card border border-border rounded-lg p-6 shadow-sm',
  };

  return (
    <div className={cn(variantStyles[variant], className)}>
      {children}
    </div>
  );
};

export default ContentContainer;