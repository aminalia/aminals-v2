/**
 * Breadcrumb Component
 * 
 * Provides navigation breadcrumbs for better user orientation.
 * Supports various styles and interactive elements.
 */

import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  separator?: 'chevron' | 'slash' | 'arrow';
  className?: string;
}

export const Breadcrumb = ({
  items,
  showHome = true,
  separator = 'chevron',
  className,
}: BreadcrumbProps) => {
  const separatorIcons = {
    chevron: <ChevronRight className="w-4 h-4" />,
    slash: <span className="text-muted-foreground">/</span>,
    arrow: <span className="text-muted-foreground">→</span>,
  };

  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: 'Home', href: '/', icon: <Home className="w-4 h-4" /> }, ...items]
    : items;

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1', className)}>
      <ol className="flex items-center space-x-1">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isCurrent = item.current || isLast;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-muted-foreground">
                  {separatorIcons[separator]}
                </span>
              )}
              
              {item.href && !isCurrent ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    isCurrent
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {item.icon}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

/**
 * BreadcrumbWrapper Component
 * 
 * A wrapper that provides consistent spacing and styling for breadcrumbs within page layouts.
 */

interface BreadcrumbWrapperProps {
  children: ReactNode;
  className?: string;
}

export const BreadcrumbWrapper = ({
  children,
  className,
}: BreadcrumbWrapperProps) => {
  return (
    <div className={cn('mb-4 pb-4 border-b border-border', className)}>
      {children}
    </div>
  );
};

export default Breadcrumb;