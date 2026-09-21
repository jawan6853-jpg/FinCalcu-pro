import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  SupportedCurrency,
  CURRENCY_SYMBOLS,
  setActiveGlobalCurrency,
  getActiveGlobalCurrency,
} from '../lib/formatters';

export interface ExchangeRates {
  [currency: string]: number; // rates relative to 1 USD
}

// Fallback rates if user is offline or network fails
export const DEFAULT_EXCHANGE_RATES: ExchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  PKR: 278.5,
  INR: 83.4,
  AED: 3.67,
  SAR: 3.75,
  CAD: 1.36,
  AUD: 1.52,
  JPY: 154.2,
  CHF: 0.91,
  CNY: 7.24,
  SGD: 1.35,
  TRY: 32.5,
  BTC: 0.000015,
  ETH: 0.00038,
};

interface CurrencyContextType {
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
  isAutoCurrency: boolean;
  setAutoCurrency: () => void;
  currencySymbol: string;
  rates: ExchangeRates;
  lastUpdated: string | null;
  formatCurr: (val: number, maxDecimals?: number) => string;
  formatCompactCurr: (val: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  isAutoCurrency: false,
  setAutoCurrency: () => {},
  currencySymbol: '$',
  rates: DEFAULT_EXCHANGE_RATES,
  lastUpdated: null,
  formatCurr: () => '',
  formatCompactCurr: () => '',
});

const STORAGE_KEY = 'calc_preferred_currency';
const AUTO_KEY = 'calc_is_auto_currency';

// Helper to guess currency from user locale & timezone
export function detectLocalCurrency(): SupportedCurrency {
  if (typeof window === 'undefined') return 'USD';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const lang = (navigator.language || '').toLowerCase();

    // Timezone & Locale based instant detection
    if (tz.includes('Karachi') || lang.includes('ur') || lang.includes('pk')) return 'PKR';
    if (tz.includes('Calcutta') || tz.includes('Kolkata') || lang.includes('in') || lang.includes('hi')) return 'INR';
    if (tz.includes('Dubai') || tz.includes('Abu_Dhabi') || lang.includes('ae')) return 'AED';
    if (tz.includes('Riyadh') || lang.includes('sa')) return 'SAR';
    if (tz.includes('London') || lang.includes('en-gb')) return 'GBP';
    if (tz.includes('Tokyo') || lang.includes('ja')) return 'JPY';
    if (tz.includes('Toronto') || tz.includes('Vancouver') || lang.includes('en-ca')) return 'CAD';
    if (tz.includes('Sydney') || tz.includes('Melbourne') || lang.includes('en-au')) return 'AUD';
    if (tz.includes('Zurich') || lang.includes('de-ch')) return 'CHF';
    if (tz.includes('Shanghai') || tz.includes('Chongqing') || lang.includes('zh')) return 'CNY';
    if (tz.includes('Singapore') || lang.includes('en-sg')) return 'SGD';
    if (tz.includes('Istanbul') || lang.includes('tr')) return 'TRY';
    if (
      tz.includes('Paris') ||
      tz.includes('Berlin') ||
      tz.includes('Rome') ||
      tz.includes('Madrid') ||
      tz.includes('Amsterdam') ||
      tz.includes('Brussels') ||
      lang.includes('de') ||
      lang.includes('fr') ||
      lang.includes('es') ||
      lang.includes('it')
    ) {
      return 'EUR';
    }
  } catch {
    // fallback
  }
  return 'USD';
}

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAutoCurrency, setIsAutoCurrencyState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const savedAuto = localStorage.getItem(AUTO_KEY);
      if (savedAuto !== null) return savedAuto === 'true';
      // If user hasn't explicitly set a preference, default to auto-detection
      const savedPref = localStorage.getItem(STORAGE_KEY);
      return !savedPref;
    } catch {
      return true;
    }
  });

  const [currency, setCurrencyState] = useState<SupportedCurrency>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedAuto = localStorage.getItem(AUTO_KEY);
        const isAuto = savedAuto !== null ? savedAuto === 'true' : !localStorage.getItem(STORAGE_KEY);
        if (isAuto) {
          return detectLocalCurrency();
        }
        const saved = localStorage.getItem(STORAGE_KEY) as SupportedCurrency;
        if (saved && CURRENCY_SYMBOLS[saved]) return saved;
      } catch {
        // ignore
      }
    }
    return detectLocalCurrency();
  });

  const [rates, setRates] = useState<ExchangeRates>(DEFAULT_EXCHANGE_RATES);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Sync with global storage & formatters on mount
  useEffect(() => {
    setActiveGlobalCurrency(currency);
  }, [currency]);

  // Fetch live daily forex rates without requiring any API key
  // Using open ECB-backed frankfurter api (public, zero auth required)
  useEffect(() => {
    let isMounted = true;

    async function fetchLiveRates() {
      try {
        const response = await fetch(
          'https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,CAD,AUD,INR,JPY,CHF,SGD,TRY',
          { cache: 'default' }
        );
        if (!response.ok) throw new Error('Failed to fetch open rates');
        const data = await response.json();

        if (isMounted && data && data.rates) {
          setRates((prev) => ({
            ...prev,
            USD: 1,
            EUR: data.rates.EUR ?? prev.EUR,
            GBP: data.rates.GBP ?? prev.GBP,
            CAD: data.rates.CAD ?? prev.CAD,
            AUD: data.rates.AUD ?? prev.AUD,
            INR: data.rates.INR ?? prev.INR,
            JPY: data.rates.JPY ?? prev.JPY,
            CHF: data.rates.CHF ?? prev.CHF,
            SGD: data.rates.SGD ?? prev.SGD,
            TRY: data.rates.TRY ?? prev.TRY,
          }));
          setLastUpdated(data.date || new Date().toISOString().split('T')[0]);
        }
      } catch (e) {
        // Graceful fallback to default rates
      }
    }

    fetchLiveRates();

    return () => {
      isMounted = false;
    };
  }, []);

  const setCurrency = (newCurrency: SupportedCurrency) => {
    setIsAutoCurrencyState(false);
    setCurrencyState(newCurrency);
    setActiveGlobalCurrency(newCurrency);
    try {
      localStorage.setItem(AUTO_KEY, 'false');
      localStorage.setItem(STORAGE_KEY, newCurrency);
    } catch {
      // ignore
    }
  };

  const setAutoCurrency = () => {
    const detected = detectLocalCurrency();
    setIsAutoCurrencyState(true);
    setCurrencyState(detected);
    setActiveGlobalCurrency(detected);
    try {
      localStorage.setItem(AUTO_KEY, 'true');
      localStorage.setItem(STORAGE_KEY, detected);
    } catch {
      // ignore
    }
  };

  const currencySymbol = CURRENCY_SYMBOLS[currency] || '$';

  const formatCurr = (val: number, maxDecimals: number = 2) => {
    if (val === null || val === undefined || isNaN(val) || !isFinite(val)) {
      return `${currencySymbol}0.00`;
    }
    const isNegative = val < 0;
    const absVal = Math.abs(val);

    if (currency === 'BTC' || currency === 'ETH') {
      const formattedCrypto = absVal.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      });
      return `${isNegative ? '-' : ''}${currencySymbol}${formattedCrypto}`;
    }

    const decimals = absVal < 1 && absVal > 0 ? Math.min(4, maxDecimals) : maxDecimals;
    const formatted = absVal.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${isNegative ? '-' : ''}${currencySymbol}${formatted}`;
  };

  const formatCompactCurr = (val: number) => {
    if (val === null || val === undefined || isNaN(val) || !isFinite(val)) {
      return `${currencySymbol}0`;
    }
    const isNegative = val < 0;
    const absVal = Math.abs(val);

    if (absVal >= 1000000000) {
      return `${isNegative ? '-' : ''}${currencySymbol}${(absVal / 1000000000).toFixed(1)}B`;
    }
    if (absVal >= 1000000) {
      return `${isNegative ? '-' : ''}${currencySymbol}${(absVal / 1000000).toFixed(1)}M`;
    }
    if (absVal >= 1000) {
      return `${isNegative ? '-' : ''}${currencySymbol}${(absVal / 1000).toFixed(1)}K`;
    }
    return `${isNegative ? '-' : ''}${currencySymbol}${absVal.toFixed(0)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        isAutoCurrency,
        setAutoCurrency,
        currencySymbol,
        rates,
        lastUpdated,
        formatCurr,
        formatCompactCurr,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrency(): CurrencyContextType {
  return useContext(CurrencyContext);
}
