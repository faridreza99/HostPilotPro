import { PMSClient, PMSListing, PMSAvailability } from './types';

export class DemoClient implements PMSClient {
  private demoListings: PMSListing[] = [
    {
      id: 'demo-1',
      title: 'Luxury Beachfront Villa',
      address: 'Koh Samui, Thailand',
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      propertyType: 'Villa',
      status: 'active',
      description: 'Stunning beachfront villa with private pool and ocean views'
    },
    {
      id: 'demo-2', 
      title: 'Modern City Apartment',
      address: 'Bangkok, Thailand',
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      propertyType: 'Apartment',
      status: 'active',
      description: 'Contemporary apartment in the heart of the city'
    },
    {
      id: 'demo-3',
      title: 'Mountain Retreat Cabin',
      address: 'Chiang Mai, Thailand',
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      propertyType: 'Cabin',
      status: 'active',
      description: 'Peaceful mountain cabin surrounded by nature'
    }
  ];

  async listListings(params?: { limit?: number; offset?: number }): Promise<PMSListing[]> {
    const { limit = 10, offset = 0 } = params || {};
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.demoListings.slice(offset, offset + limit);
  }

  async getAvailability(params: { 
    listingId: string | number; 
    start: string; 
    end: string 
  }): Promise<PMSAvailability[]> {
    const { listingId, start, end } = params;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Generate demo availability data
    const startDate = new Date(start);
    const endDate = new Date(end);
    const availability: PMSAvailability[] = [];
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      const randomFactor = Math.random();
      
      availability.push({
        date: currentDate.toISOString().split('T')[0],
        available: randomFactor > 0.3, // 70% availability rate
        price: isWeekend ? 150 + Math.floor(randomFactor * 50) : 100 + Math.floor(randomFactor * 30),
        minStay: isWeekend ? 2 : 1,
        currency: 'USD'
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return availability;
  }

  async testConnection(): Promise<boolean> {
    // Demo always works
    return true;
  }
}