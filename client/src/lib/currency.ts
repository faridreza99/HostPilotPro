// Centralized currency formatting utility
// This ensures all pages use the same currency format based on settings

export const DEFAULT_CURRENCY = 'THB';

export const CURRENCY_SYMBOLS = {
  THB: '฿',
  USD: '$',
  EUR: '€',
  GBP: '£'
} as const;

export type Currency = keyof typeof CURRENCY_SYMBOLS;

// Get the current currency from settings (defaulting to THB)
export function getCurrentCurrency(): Currency {
  // For now, we'll default to THB as requested
  // In the future, this could read from user settings or global config
  return DEFAULT_CURRENCY;
}

// Format currency with proper locale and symbol
export function formatCurrency(amount: number, currency: Currency = getCurrentCurrency()): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  
  // For THB, use Thai locale formatting
  if (currency === 'THB') {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  
  // For other currencies, use standard formatting
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format currency with custom symbol (for legacy compatibility)
export function formatCurrencyWithSymbol(amount: number, currency: Currency = getCurrentCurrency()): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'THB' ? 0 : 2,
  }).format(amount);
  
  return `${symbol}${formattedNumber}`;
}

// Simple number formatting for currency amounts
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}