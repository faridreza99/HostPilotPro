import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { sessionCache } from "@/lib/sessionCache";

interface UseCachedQueryOptions extends Omit<UseQueryOptions, 'queryFn' | 'queryKey'> {
  forceRefresh?: boolean;
}

// Enhanced useQuery hook with session caching
export function useCachedQuery<T = any>(
  queryKey: string | [string],
  options: UseCachedQueryOptions = {}
) {
  const { forceRefresh = false, ...queryOptions } = options;
  const url = typeof queryKey === 'string' ? queryKey : queryKey[0];

  return useQuery({
    queryKey: typeof queryKey === 'string' ? [queryKey] : queryKey,
    staleTime: 120 * 1000, // 120 seconds
    gcTime: 300 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...queryOptions,
    // Return cached data immediately if available
    initialData: () => {
      const cached = sessionCache.get(url);
      return cached || undefined;
    },
    initialDataUpdatedAt: () => {
      const cached = sessionCache.get(url);
      return cached ? Date.now() : undefined;
    }
  });
}

// Hook for dashboard stats with caching
export function useCachedDashboardStats() {
  return useCachedQuery('/api/dashboard/stats', {
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    retry: 2
  });
}

// Hook for properties with caching
export function useCachedProperties() {
  return useCachedQuery('/api/properties', {
    refetchInterval: 3 * 60 * 1000, // Refresh every 3 minutes
    retry: 2
  });
}

// Hook for tasks with caching
export function useCachedTasks() {
  return useCachedQuery('/api/tasks', {
    refetchInterval: 2 * 60 * 1000, // Refresh every 2 minutes
    retry: 2
  });
}

// Hook for bookings with caching
export function useCachedBookings() {
  return useCachedQuery('/api/bookings', {
    refetchInterval: 2 * 60 * 1000, // Refresh every 2 minutes
    retry: 2
  });
}

// Hook for finance analytics with caching
export function useCachedFinanceAnalytics() {
  return useCachedQuery('/api/finance/analytics', {
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    retry: 2
  });
}

// Hook for finance data with caching
export function useCachedFinance() {
  return useCachedQuery('/api/finance', {
    refetchInterval: 3 * 60 * 1000, // Refresh every 3 minutes
    retry: 2
  });
}