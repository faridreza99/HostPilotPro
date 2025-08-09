import axios, { AxiosInstance } from 'axios';
import { PMSClient, PMSListing, PMSAvailability } from './types';

export interface HostawayCredentials {
  apiKey: string;
  accountId: string;
}

export class HostawayClient implements PMSClient {
  private client: AxiosInstance;
  private credentials: HostawayCredentials;

  constructor(credentials: HostawayCredentials) {
    this.credentials = credentials;
    this.client = axios.create({
      baseURL: process.env.HOSTAWAY_BASE_URL || 'https://api.hostaway.com/v1',
      headers: {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async listListings(params?: { limit?: number; offset?: number }): Promise<PMSListing[]> {
    try {
      const { limit = 10, offset = 0 } = params || {};
      const response = await this.client.get('/listings', {
        params: {
          accountId: this.credentials.accountId,
          limit,
          offset
        }
      });
      
      return response.data.result?.map((listing: any) => ({
        id: listing.id.toString(),
        title: listing.name || listing.title,
        address: listing.address,
        bedrooms: listing.bedrooms || 0,
        bathrooms: listing.bathrooms || 0,
        maxGuests: listing.maxGuests || 1,
        propertyType: listing.propertyTypeName || 'Unknown',
        status: listing.isActive ? 'active' : 'inactive',
        description: listing.description || undefined
      })) || [];
    } catch (error) {
      console.error('Error fetching Hostaway listings:', error);
      throw new Error('Failed to fetch listings from Hostaway');
    }
  }

  async getAvailability(params: { listingId: string | number; start: string; end: string }): Promise<PMSAvailability[]> {
    try {
      const { listingId, start, end } = params;
      const response = await this.client.get(`/listings/${listingId}/calendar`, {
        params: {
          startDate: start,
          endDate: end,
          accountId: this.credentials.accountId
        }
      });

      return response.data.result?.map((day: any) => ({
        date: day.date,
        available: day.isAvailable,
        price: day.price || undefined,
        minStay: day.minStay || undefined,
        currency: day.currency || 'USD'
      })) || [];
    } catch (error) {
      console.error('Error fetching Hostaway availability:', error);
      throw new Error('Failed to fetch availability from Hostaway');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/me', {
        params: { accountId: this.credentials.accountId }
      });
      return true;
    } catch (error) {
      console.error('Hostaway connection test failed:', error);
      return false;
    }
  }
}