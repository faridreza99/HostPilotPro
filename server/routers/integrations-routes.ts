import { Express, Request, Response } from 'express';
import { integrationStore } from '../services/integrationStore';
import { extractOrganizationId, IntegrationRequest } from '../middlewares/integration-auth';
import { PMSClientFactory } from '../integrations/factory';
import { PMSProviderName } from '../integrations/types';

export default function mountIntegrationRoutes(app: Express) {
  
  // Get current integration status
  app.get('/api/integrations/me', extractOrganizationId, async (req: IntegrationRequest, res: Response) => {
    try {
      const integration = await integrationStore.getIntegration(req.organizationId!);
      
      if (!integration) {
        return res.json({ provider: null });
      }

      // Return integration info without sensitive credentials
      res.json({
        provider: integration.provider,
        authType: integration.authType,
        isActive: integration.isActive,
        connectedAt: integration.connectedAt,
        lastSyncAt: integration.lastSyncAt
      });
    } catch (error) {
      console.error('Error getting integration:', error);
      res.status(500).json({ error: 'Failed to get integration status' });
    }
  });

  // Connect a new integration
  app.post('/api/integrations/connect', extractOrganizationId, async (req: IntegrationRequest, res: Response) => {
    try {
      const { provider, authType, ...credentials } = req.body;

      if (!provider || !authType) {
        return res.status(400).json({ 
          error: 'Missing required fields', 
          message: 'Provider and authType are required' 
        });
      }

      // Validate provider is supported
      if (!PMSClientFactory.getSupportedProviders().includes(provider as PMSProviderName)) {
        return res.status(400).json({
          error: 'Unsupported provider',
          message: `Provider ${provider} is not supported`
        });
      }

      // Validate required credentials for provider
      const requiredCreds = PMSClientFactory.getProviderRequiredCredentials(provider as PMSProviderName);
      for (const cred of requiredCreds) {
        if (!credentials[cred]) {
          return res.status(400).json({
            error: 'Missing credentials',
            message: `${provider} requires: ${requiredCreds.join(', ')}`
          });
        }
      }

      // Test the connection (skip for demo)
      if (provider !== 'demo') {
        try {
          const client = PMSClientFactory.create(provider as PMSProviderName, credentials);
          const isValid = await (client as any).testConnection?.();
          
          if (isValid === false) {
            return res.status(400).json({
              error: 'Invalid credentials',
              message: `Could not connect to ${provider} with provided credentials`
            });
          }
        } catch (testError) {
          return res.status(400).json({
            error: 'Connection test failed',
            message: testError instanceof Error ? testError.message : 'Unknown error'
          });
        }
      }

      // Save the integration
      const integration = {
        provider,
        authType,
        credentials,
        isActive: true,
        connectedAt: new Date()
      };

      await integrationStore.saveIntegration(req.organizationId!, integration);

      res.json({
        success: true,
        message: `Successfully connected to ${provider}`,
        provider: integration.provider,
        connectedAt: integration.connectedAt
      });
    } catch (error) {
      console.error('Error connecting integration:', error);
      res.status(500).json({ 
        error: 'Connection failed',
        message: 'Failed to connect integration'
      });
    }
  });

  // Disconnect integration
  app.delete('/api/integrations/disconnect', extractOrganizationId, async (req: IntegrationRequest, res: Response) => {
    try {
      await integrationStore.deleteIntegration(req.organizationId!);
      res.json({ 
        success: true, 
        message: 'Integration disconnected successfully' 
      });
    } catch (error) {
      console.error('Error disconnecting integration:', error);
      res.status(500).json({ error: 'Failed to disconnect integration' });
    }
  });

  // Test current integration
  app.post('/api/integrations/test', extractOrganizationId, async (req: IntegrationRequest, res: Response) => {
    try {
      const integration = await integrationStore.getIntegration(req.organizationId!);
      
      if (!integration) {
        return res.status(400).json({ 
          error: 'No integration configured',
          message: 'Please connect an integration first'
        });
      }

      let testResult = false;
      
      try {
        if (integration.provider === 'demo') {
          testResult = true; // Demo always works
        } else {
          const client = PMSClientFactory.create(integration.provider as PMSProviderName, integration.credentials);
          testResult = await (client as any).testConnection?.() || false;
        }
      } catch (error) {
        console.error('Connection test error:', error);
        testResult = false;
      }

      if (testResult) {
        await integrationStore.updateLastSync(req.organizationId!);
      }

      res.json({
        success: testResult,
        provider: integration.provider,
        message: testResult ? 'Connection successful' : 'Connection failed'
      });
    } catch (error) {
      console.error('Error testing integration:', error);
      res.status(500).json({ error: 'Failed to test integration' });
    }
  });

  // Debug endpoint - list all integrations (remove in production)
  app.get('/api/integrations/debug', async (req: Request, res: Response) => {
    try {
      const integrations = await integrationStore.getAllIntegrations();
      res.json({ integrations });
    } catch (error) {
      console.error('Error in debug endpoint:', error);
      res.status(500).json({ error: 'Debug failed' });
    }
  });
}