/**
 * NavigationTabs Component
 * 
 * Provides reusable tab navigation for profile and other pages.
 * Supports various styling variants and responsive behavior.
 */

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  href?: string;
}

interface NavigationTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const NavigationTabs = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  className,
}: NavigationTabsProps) => {
  const baseStyles = {
    default: 'border-b border-border',
    pills: 'bg-muted p-1 rounded-lg',
    underline: 'border-b-2 border-transparent',
  };

  const tabStyles = {
    default: {
      base: 'inline-flex items-center px-4 py-2 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors',
      active: 'border-primary text-primary',
      disabled: 'opacity-50 cursor-not-allowed',
    },
    pills: {
      base: 'inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background transition-colors',
      active: 'bg-background text-foreground shadow-sm',
      disabled: 'opacity-50 cursor-not-allowed',
    },
    underline: {
      base: 'inline-flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',
      active: 'text-primary border-b-2 border-primary',
      disabled: 'opacity-50 cursor-not-allowed',
    },
  };

  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };

  return (
    <div className={cn(baseStyles[variant], className)}>
      <nav className="flex space-x-1" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && onTabChange(tab.id)}
              disabled={isDisabled}
              className={cn(
                tabStyles[variant].base,
                isActive && tabStyles[variant].active,
                isDisabled && tabStyles[variant].disabled,
                'relative'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.icon && (
                <span className="mr-2 text-current">
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

/**
 * TabContent Component
 * 
 * Wrapper for tab content with consistent styling and animations.
 */

interface TabContentProps {
  children: ReactNode;
  tabId: string;
  activeTab: string;
  className?: string;
}

export const TabContent = ({
  children,
  tabId,
  activeTab,
  className,
}: TabContentProps) => {
  const isActive = activeTab === tabId;

  if (!isActive) return null;

  return (
    <div
      className={cn(
        'animate-in fade-in-0 slide-in-from-bottom-1 duration-200',
        className
      )}
      role="tabpanel"
      aria-labelledby={`tab-${tabId}`}
    >
      {children}
    </div>
  );
};

/**
 * TabsContainer Component
 * 
 * Full tab system with navigation and content areas.
 */

interface TabsContainerProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

export const TabsContainer = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  className,
  contentClassName,
  children,
}: TabsContainerProps) => {
  return (
    <div className={cn('w-full', className)}>
      <NavigationTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        variant={variant}
        size={size}
      />
      <div className={cn('mt-6', contentClassName)}>
        {children}
      </div>
    </div>
  );
};

export default NavigationTabs;