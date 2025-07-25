// Instant static data for immediate page loading
export const INSTANT_DATA = {
  "/api/properties": [
    {
      id: 17,
      organizationId: "default-org",
      name: "Villa Samui Breeze",
      address: "123 Beach Road, Koh Samui",
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      pricePerNight: 8000,
      status: "active",
      ownerId: "demo-owner",
      portfolioManagerId: "demo-pm"
    },
    {
      id: 18,
      organizationId: "default-org", 
      name: "Villa Tropical Paradise",
      address: "456 Ocean View, Koh Samui",
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      pricePerNight: 12000,
      status: "active",
      ownerId: "demo-owner2",
      portfolioManagerId: "demo-pm"
    },
    {
      id: 19,
      organizationId: "default-org",
      name: "Villa Aruna Demo", 
      address: "789 Sunset Beach, Koh Samui",
      bedrooms: 5,
      bathrooms: 4,
      maxGuests: 10,
      pricePerNight: 20000,
      status: "active",
      ownerId: "demo-owner3",
      portfolioManagerId: "demo-pm2"
    }
  ],
  
  "/api/tasks": [
    {
      id: 163,
      organizationId: "default-org",
      title: "Pool Cleaning",
      description: "Weekly pool maintenance and chemical balance",
      assignedToId: "demo-staff",
      propertyId: 17,
      priority: "high",
      status: "pending",
      dueDate: "2025-01-27",
      createdAt: "2025-01-25T12:00:00Z"
    },
    {
      id: 164,
      organizationId: "default-org", 
      title: "AC Maintenance",
      description: "Check and service air conditioning units",
      assignedToId: "demo-staff2",
      propertyId: 18,
      priority: "medium",
      status: "in-progress",
      dueDate: "2025-01-28",
      createdAt: "2025-01-25T14:00:00Z"
    }
  ],
  
  "/api/bookings": [
    {
      id: 1,
      propertyId: 17,
      guestName: "John Smith",
      guestEmail: "john@example.com", 
      checkIn: "2025-02-01",
      checkOut: "2025-02-05",
      totalAmount: 32000,
      status: "confirmed",
      guests: 4
    },
    {
      id: 2,
      propertyId: 18,
      guestName: "Sarah Johnson",
      guestEmail: "sarah@example.com",
      checkIn: "2025-02-10", 
      checkOut: "2025-02-15",
      totalAmount: 60000,
      status: "confirmed",
      guests: 6
    }
  ],
  
  "/api/dashboard/stats": {
    totalProperties: 17,
    activeBookings: 8,
    pendingTasks: 12,
    monthlyRevenue: 485000,
    occupancyRate: 0.78,
    avgRating: 4.6
  }
};

export function getInstantData(endpoint: string) {
  return INSTANT_DATA[endpoint as keyof typeof INSTANT_DATA] || null;
}