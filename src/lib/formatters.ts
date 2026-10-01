export type SupportedCurrency =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'PKR'
  | 'INR'
  | 'AED'
  | 'SAR'
  | 'CAD'
  | 'AUD'
  | 'JPY'
  | 'CHF'
  | 'CNY'
  | 'SGD'
  | 'TRY'
  | 'BTC'
  | 'ETH';

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  PKR: 'Rs',
  INR: '₹',
  AED: 'AED',
  SAR: 'SAR',
  CAD: 'CA$',
  AUD: 'A$',
  JPY: '¥',
  CHF: 'CHF',
  CNY: '¥',
  SGD: 'S$',
  TRY: '₺',
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

  const absVal = Math.abs(val);

  const decimals = absVal < 1 && absVal > 0 ? Math.min(4, maxDecimals) : maxDecimals;
  const threshold = Math.pow(10, -decimals) / 2;
  const isZeroOrNegZero = absVal < threshold;
  const isNegative = val < 0 && !isZeroOrNegZero;
  const effectiveVal = isZeroOrNegZero ? 0 : absVal;

  if (targetCurrency === 'BTC' || targetCurrency === 'ETH') {
    const formattedCrypto = effectiveVal.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
    return `${isNegative ? '-' : ''}${symbol}${formattedCrypto}`;
  }

  const formatted = effectiveVal.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${isNegative ? '-' : ''}${symbol}${formatted}`;
}

export function formatPercentage(val: number, decimals: number = 2): string {
  if (val === null || val === undefined || isNaN(val) || !isFinite(val)) {
    return '0.00%';
  }
  const threshold = Math.pow(10, -decimals) / 2;
  const cleanVal = Math.abs(val) < threshold ? 0 : val;
  return `${cleanVal.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}

export function formatNumber(val: number, maxDecimals: number = 2): string {
  if (val === null || val === undefined || isNaN(val) || !isFinite(val)) {
    return '0';
  }
  const threshold = Math.pow(10, -maxDecimals) / 2;
  const cleanVal = Math.abs(val) < threshold ? 0 : val;
  return cleanVal.toLocaleString('en-US', {
    maximumFractionDigits: maxDecimals,
  });
}

export function formatCompactCurrency(val: number, currency?: SupportedCurrency): string {
  const targetCurrency = currency || activeGlobalCurrency || 'USD';
  const symbol = CURRENCY_SYMBOLS[targetCurrency] || '$';

  if (val === null || val === undefined || isNaN(val) || !isFinite(val)) {
    return `${symbol}0`;
  }
  const isZero = Math.abs(val) < 0.01;
  const isNegative = val < 0 && !isZero;
  const absVal = isZero ? 0 : Math.abs(val);

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
    return isFinite(value) && !isNaN(value) ? value : fallback;
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isFinite(parsed) && !isNaN(parsed) ? parsed : fallback;
  }
  return fallback;
}

/**
 * Safely parses calculator input values, distinguishing between an intentional 0
 * and missing/undefined/NaN input fields.
 */
export function parseInput(val: unknown, fallback: number): number {
  if (val === undefined || val === null || val === '') return fallback;
  const num = typeof val === 'number' ? val : Number(val);
  return isFinite(num) && !isNaN(num) ? num : fallback;
}

/**
 * Performs safe mathematical division guarding against division by zero and returning a fallback.
 */
export function safeDivision(numerator: number, denominator: number, fallback: number = 0): number {
  if (denominator === 0 || !isFinite(denominator) || isNaN(denominator)) return fallback;
  const res = numerator / denominator;
  return isFinite(res) && !isNaN(res) ? res : fallback;
}

/**
 * Clamps a number within min and max boundaries with finite fallback.
 */
export function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = parseInput(value, fallback);
  return Math.min(Math.max(parsed, min), max);
}
