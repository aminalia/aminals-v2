import { QueryClient } from '@tanstack/react-query';

/**
 * Configure React Query client with optimal settings for GraphQL data fetching
 */
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: Data is considered fresh for 30 seconds
        staleTime: 30 * 1000,
        // Cache time: Data stays in cache for 5 minutes after component unmount
        gcTime: 5 * 60 * 1000,
        // Retry failed requests 3 times with exponential backoff
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors (client errors)
          if (error instanceof Error && error.message.includes('400')) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        // Exponential backoff for retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on window focus for real-time data
        refetchOnWindowFocus: true,
        // Refetch on reconnect
        refetchOnReconnect: true,
        // Don't refetch on mount if data is fresh
        refetchOnMount: 'always',
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
        // Retry delay for mutations
        retryDelay: 1000,
      },
    },
  });
};

/**
 * Query key factory for consistent query key generation
 */
export const queryKeys = {
  aminals: {
    all: ['aminals'] as const,
    lists: () => [...queryKeys.aminals.all, 'list'] as const,
    list: (filter: string, sort: string, userAddress: string) => 
      [...queryKeys.aminals.lists(), filter, sort, userAddress] as const,
    details: () => [...queryKeys.aminals.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.aminals.details(), id] as const,
  },
  genes: {
    all: ['genes'] as const,
    lists: () => [...queryKeys.genes.all, 'list'] as const,
    list: (params: any) => [...queryKeys.genes.lists(), params] as const,
    details: () => [...queryKeys.genes.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.genes.details(), id] as const,
  },
  auctions: {
    all: ['auctions'] as const,
    lists: () => [...queryKeys.auctions.all, 'list'] as const,
    list: (params: any) => [...queryKeys.auctions.lists(), params] as const,
    details: () => [...queryKeys.auctions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.auctions.details(), id] as const,
  },
  skills: {
    all: ['skills'] as const,
    lists: () => [...queryKeys.skills.all, 'list'] as const,
    list: (params: any) => [...queryKeys.skills.lists(), params] as const,
  },
  userProfile: {
    all: ['userProfile'] as const,
    detail: (address: string) => [...queryKeys.userProfile.all, address] as const,
  },
} as const;

/**
 * Error handling utilities
 */
export const handleQueryError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }
  return new Error('An unexpected error occurred');
};

/**
 * GraphQL error handler
 */
export const handleGraphQLError = (errors: readonly any[]): Error => {
  if (errors && errors.length > 0) {
    const firstError = errors[0];
    return new Error(firstError.message || 'GraphQL query failed');
  }
  return new Error('Unknown GraphQL error');
};