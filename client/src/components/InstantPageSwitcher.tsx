import { useEffect } from 'react';
import { queryClient } from '../lib/queryClient';

// Pre-cache critical endpoints on app start for instant navigation
export function InstantPageSwitcher() {
  useEffect(() => {
    const preCacheEndpoints = [
      '/api/properties',
      '/api/tasks', 
      '/api/bookings',
      '/api/dashboard/stats'
    ];

    // Pre-cache in background without triggering UI updates
    preCacheEndpoints.forEach(endpoint => {
      queryClient.prefetchQuery({
        queryKey: [endpoint],
        staleTime: 60 * 60 * 1000, // 1 hour
      });
    });
  }, []);

  return null; // This component has no UI
}