import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Badge } from './badge';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterBarProps {
  className?: string;
  // Filter options
  filters?: FilterOption[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  // Sort options
  sortOptions?: SortOption[];
  activeSort?: string;
  onSortChange?: (sort: string) => void;
  // Results count
  resultsCount?: number;
  resultsLabel?: string;
  // Search
  searchValue?: string;
  onSearchChange?: (search: string) => void;
  searchPlaceholder?: string;
  // Additional actions
  actions?: React.ReactNode;
}

export function FilterBar({
  className,
  filters,
  activeFilter,
  onFilterChange,
  sortOptions,
  activeSort,
  onSortChange,
  resultsCount,
  resultsLabel = 'results',
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  actions,
}: FilterBarProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-wrap">
        {/* Results count */}
        {resultsCount !== undefined && (
          <Badge variant="neutral" size="lg">
            {resultsCount.toLocaleString()} {resultsLabel}
          </Badge>
        )}

        <div className="flex flex-wrap gap-3">
          {/* Filter buttons */}
          {filters && filters.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter:</span>
              <div className="flex gap-2">
                {filters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={activeFilter === filter.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onFilterChange?.(filter.value)}
                    className="h-8"
                  >
                    {filter.label}
                    {filter.count !== undefined && (
                      <Badge 
                        variant="neutral" 
                        size="sm" 
                        className="ml-2"
                      >
                        {filter.count}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Sort dropdown */}
          {sortOptions && sortOptions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={activeSort || ''}
                onChange={(e) => onSortChange?.(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-md border border-input bg-background text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Additional actions */}
          {actions}
        </div>
      </div>

      {/* Search bar */}
      {onSearchChange && (
        <div className="relative">
          <input
            type="text"
            value={searchValue || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full px-4 py-2 pl-10 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Aminals-specific filter bars
 */
export function AminalsFilterBar({
  className,
  activeFilter,
  onFilterChange,
  activeSort,
  onSortChange,
  resultsCount,
  ...props
}: Omit<FilterBarProps, 'filters' | 'sortOptions'>) {
  const filters: FilterOption[] = [
    { value: 'all', label: 'All' },
    { value: 'loved', label: 'Loved' },
  ];

  const sortOptions: SortOption[] = [
    { value: 'most-loved', label: 'Most Loved' },
    { value: 'least-loved', label: 'Least Loved' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'youngest', label: 'Youngest' },
  ];

  return (
    <FilterBar
      className={className}
      filters={filters}
      activeFilter={activeFilter}
      onFilterChange={onFilterChange}
      sortOptions={sortOptions}
      activeSort={activeSort}
      onSortChange={onSortChange}
      resultsCount={resultsCount}
      resultsLabel="Aminals"
      {...props}
    />
  );
}

export function GenesFilterBar({
  className,
  activeFilter,
  onFilterChange,
  activeSort,
  onSortChange,
  resultsCount,
  ...props
}: Omit<FilterBarProps, 'filters' | 'sortOptions'>) {
  const filters: FilterOption[] = [
    { value: 'all', label: 'All' },
    { value: 'my-genes', label: 'My Genes' },
    { value: 'auction', label: 'In Auction' },
  ];

  const sortOptions: SortOption[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'most-used', label: 'Most Used' },
    { value: 'least-used', label: 'Least Used' },
  ];

  return (
    <FilterBar
      className={className}
      filters={filters}
      activeFilter={activeFilter}
      onFilterChange={onFilterChange}
      sortOptions={sortOptions}
      activeSort={activeSort}
      onSortChange={onSortChange}
      resultsCount={resultsCount}
      resultsLabel="Genes"
      {...props}
    />
  );
}