import { Express, Request, Response } from 'express';
import { requireIntegration, IntegrationRequest } from '../middlewares/integration-auth';
import { PMSClientFactory } from '../integrations/factory';
import { PMSProviderName } from '../integrations/types';

export default function mountPmsRoutes(app: Express) {

  // Get all listings from connected PMS
  app.get('/api/pms/listings', requireIntegration(), async (req: IntegrationRequest, res: Response) => {
    try {
      const { integration } = req;
      const { limit, offset } = req.query;
      
      const client = PMSClientFactory.create(integration.provider as PMSProviderName, integration.credentials);
      const listings = await client.listListings({
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined
      });
      
      res.json({
        success: true,
        provider: integration.provider,
        listings
      });
    } catch (error) {
      console.error('Error fetching PMS listings:', error);
      res.status(500).json({
        error: 'Failed to fetch listings',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get availability for a specific listing
  app.get('/api/pms/availability', requireIntegration(), async (req: IntegrationRequest, res: Response) => {
    try {
      const { listingId, start, end } = req.query;
      const { integration } = req;

      if (!listingId || !start || !end) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'listingId, start, and end parameters are required'
        });
      }

      const client = PMSClientFactory.create(integration.provider as PMSProviderName, integration.credentials);
      const availability = await client.getAvailability({
        listingId: listingId as string,
        start: start as string,
        end: end as string
      });
      
      res.json({
        success: true,
        provider: integration.provider,
        listingId: listingId as string,
        period: { start, end },
        availability
      });
    } catch (error) {
      console.error('Error fetching PMS availability:', error);
      res.status(500).json({
        error: 'Failed to fetch availability',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get supported PMS providers
  app.get('/api/pms/providers', async (req: Request, res: Response) => {
    try {
      const providers = PMSClientFactory.getSupportedProviders().map(provider => ({
        name: provider,
        displayName: provider.charAt(0).toUpperCase() + provider.slice(1),
        requiredCredentials: PMSClientFactory.getProviderRequiredCredentials(provider),
        isDemo: provider === 'demo'
      }));
      
      res.json({ providers });
    } catch (error) {
      console.error('Error getting providers:', error);
      res.status(500).json({ error: 'Failed to get providers' });
    }
  });

  // Sync all data from PMS (future feature)
  app.post('/api/pms/sync', requireIntegration(), async (req: IntegrationRequest, res: Response) => {
    try {
      const { integration, organizationId } = req;
      
      // This would sync all listings, bookings, availability etc.
      // For now, just update the last sync time
      
      res.json({
        success: true,
        message: `Sync initiated for ${integration.provider}`,
        provider: integration.provider,
        syncedAt: new Date()
      });
    } catch (error) {
      console.error('Error syncing PMS data:', error);
      res.status(500).json({
        error: 'Sync failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get sync status
  app.get('/api/pms/sync-status', requireIntegration(), async (req: IntegrationRequest, res: Response) => {
    try {
      const { integration } = req;
      
      res.json({
        provider: integration.provider,
        lastSyncAt: integration.lastSyncAt || null,
        isActive: integration.isActive,
        connectedAt: integration.connectedAt
      });
    } catch (error) {
      console.error('Error getting sync status:', error);
      res.status(500).json({
        error: 'Failed to get sync status',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}