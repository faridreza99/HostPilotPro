export const queryKeys = {
  // Authentication
  auth: {
    user: () => ['/api/auth/user'] as const,
  },
  
  // Properties
  properties: {
    all: () => ['/api/properties'] as const,
    detail: (id: number | string) => ['/api/properties', id] as const,
  },
  
  // Finances
  finance: {
    all: () => ['/api/finance'] as const,
    analytics: (propertyId?: string | number) => 
      propertyId 
        ? ['/api/finance/analytics', { propertyId }] as const
        : ['/api/finance/analytics'] as const,
  },
  
  // Bookings
  bookings: {
    all: () => ['/api/bookings'] as const,
    withSource: (propertyId?: string | number) => 
      propertyId 
        ? ['/api/bookings/with-source', { propertyId }] as const
        : ['/api/bookings/with-source'] as const,
  },
  
  // Tasks
  tasks: {
    all: () => ['/api/tasks'] as const,
    byProperty: (propertyId: number | string) => ['/api/tasks', { propertyId }] as const,
  },
  
  // Utilities
  utilities: {
    all: () => ['/api/utilities'] as const,
    byProperty: (propertyId: number | string) => ['/api/utilities', { propertyId }] as const,
  },
  
  // Dashboard
  dashboard: {
    summary: () => ['/api/dashboard'] as const,
  },
  
  // Property Documents
  documents: {
    all: () => ['/api/property-documents'] as const,
    expiring: () => ['/api/property-documents/expiring'] as const,
    byProperty: (propertyId: number | string) => ['/api/property-documents', { propertyId }] as const,
  },
  
  // Users
  users: {
    all: () => ['/api/users'] as const,
  },
};

// Helper function to invalidate related queries
export const invalidateFinanceQueries = (queryClient: any) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.finance.all() });
  queryClient.invalidateQueries({ queryKey: ['/api/finance/analytics'] }); // All analytics
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary() });
};

export const invalidatePropertyQueries = (queryClient: any) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.properties.all() });
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary() });
};

export const invalidateBookingQueries = (queryClient: any) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all() });
  queryClient.invalidateQueries({ queryKey: ['/api/bookings/with-source'] }); // All booking sources
  queryClient.invalidateQueries({ queryKey: queryKeys.finance.all() }); // Bookings affect finances
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary() });
};

export const invalidateTaskQueries = (queryClient: any) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all() });
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary() });
};

export const invalidateUtilityQueries = (queryClient: any) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.utilities.all() });
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary() });
};

export const invalidateDocumentQueries = (queryClient: any) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.documents.all() });
  queryClient.invalidateQueries({ queryKey: queryKeys.documents.expiring() });
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary() });
};
