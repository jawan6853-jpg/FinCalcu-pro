export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'INR' | 'BTC' | 'ETH';

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'A$',
  INR: '₹',
  BTC: '₿',
  ETH: 'Ξ',
};

// Global active currency cache that stays automatically in sync
let activeGlobalCurrency: SupportedCurrency = 'USD';
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('calc_preferred_currency') as SupportedCurrency;
    if (saved && CURRENCY_SYMBOLS[saved]) {
      activeGlobalCurrency = saved;
    }
    window.addEventListener('currency-changed', ((e: CustomEvent<SupportedCurrency>) => {
      if (e.detail && CURRENCY_SYMBOLS[e.detail]) {
        activeGlobalCurrency = e.detail;
      }
    }) as EventListener);
  } catch {
    // ignore
  }
}

export function setActiveGlobalCurrency(currency: SupportedCurrency) {
  activeGlobalCurrency = currency;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('calc_preferred_currency', currency);
      window.dispatchEvent(new CustomEvent('currency-changed', { detail: currency }));
    } catch {
      // ignore
    }
  }
}

export function getActiveGlobalCurrency(): SupportedCurrency {
  return activeGlobalCurrency;
}

export function formatCurrency(
  val: number,
  currency?: SupportedCurrency,
  maxDecimals: number = 2
): string {
  const targetCurrency = currency || activeGlobalCurrency || 'USD';
  const symbol = CURRENCY_SYMBOLS[targetCurrency] || '$';

  if (val === null || val === undefined || isNaN(val) || !isFinite(val)) {
    return `${symbol}0.00`;
  }

  const isNegative = val < 0;
  const absVal = Math.abs(val);

  if (targetCurrency === 'BTC' || targetCurrency === 'ETH') {
    const formattedCrypto = absVal.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
    return `${isNegative ? '-' : ''}${symbol}${formattedCrypto}`;
  }

  const decimals = absVal < 1 && absVal > 0 ? Math.min(4, maxDecimals) : maxDecimals;

  const formatted = absVal.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${isNegative ? '-' : ''}${symbol}${formatted}`;
}

export function formatPercentage(val: number, decimals: number = 2): string {
  if (val === null || val === undefined || isNaN(val) || !isFinite(val)) {
    return '0.00%';
  }
  return `${val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}

export function formatNumber(val: number, maxDecimals: number = 2): string {
  if (val === null || val === undefined || isNaN(val) || !isFinite(val)) {
    return '0';
  }
  return val.toLocaleString('en-US', {
    maximumFractionDigits: maxDecimals,
  });
}

export function formatCompactCurrency(val: number, currency?: SupportedCurrency): string {
  const targetCurrency = currency || activeGlobalCurrency || 'USD';
  const symbol = CURRENCY_SYMBOLS[targetCurrency] || '$';

  if (val === null || val === undefined || isNaN(val) || !isFinite(val)) {
    return `${symbol}0`;
  }
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  if (absVal >= 1000000000) {
    return `${isNegative ? '-' : ''}${symbol}${(absVal / 1000000000).toFixed(1)}B`;
  }
  if (absVal >= 1000000) {
    return `${isNegative ? '-' : ''}${symbol}${(absVal / 1000000).toFixed(1)}M`;
  }
  if (absVal >= 1000) {
    return `${isNegative ? '-' : ''}${symbol}${(absVal / 1000).toFixed(1)}K`;
  }
  return `${isNegative ? '-' : ''}${symbol}${absVal.toFixed(0)}`;
}

export function sanitizeNumber(value: any, fallback: number = 0): number {
  if (typeof value === 'number') {
    return isFinite(value) ? value : fallback;
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}
