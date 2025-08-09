import { PMSClient, PMSProviderName, PMSCredentials } from './types';
import { HostawayClient } from './hostaway';
import { DemoClient } from './demo';

export class PMSClientFactory {
  static create(provider: PMSProviderName, credentials: PMSCredentials): PMSClient {
    switch (provider) {
      case 'demo':
        return new DemoClient();
      
      case 'hostaway':
        if (!credentials.apiKey || !credentials.accountId) {
          throw new Error('Hostaway requires apiKey and accountId credentials');
        }
        return new HostawayClient({
          apiKey: credentials.apiKey,
          accountId: credentials.accountId
        });
      
      case 'lodgify':
        // Future implementation
        throw new Error('Lodgify integration not yet implemented');
      
      default:
        throw new Error(`Unsupported PMS provider: ${provider}`);
    }
  }
  
  static getSupportedProviders(): PMSProviderName[] {
    return ['demo', 'hostaway'];
  }
  
  static getProviderRequiredCredentials(provider: PMSProviderName): string[] {
    switch (provider) {
      case 'demo':
        return [];
      case 'hostaway':
        return ['apiKey', 'accountId'];
      case 'lodgify':
        return ['apiKey'];
      default:
        return [];
    }
  }
}