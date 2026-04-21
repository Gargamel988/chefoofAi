import { QueryClient } from "@tanstack/react-query";

/**
 * Standard configuration for the QueryClient to ensure consistent caching across the app.
 * staleTime: 5 minutes - Data is considered fresh for 5 minutes.
 * gcTime: 10 minutes - Data is kept in memory for 10 minutes after being unused.
 * refetchOnWindowFocus: false - Prevents annoying refetches when switching browser tabs.
 */
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, 
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
};

/**
 * Helper to create a new QueryClient with our standard configuration.
 * Useful for Server Components (RSC) prefetching.
 */
export function createQueryClient() {
  return new QueryClient(queryClientConfig);
}
