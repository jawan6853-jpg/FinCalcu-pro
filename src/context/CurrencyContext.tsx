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
  CAD: 1.36,
  AUD: 1.52,
  INR: 83.4,
  BTC: 0.000015,
  ETH: 0.00038,
};

interface CurrencyContextType {
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
  currencySymbol: string;
  rates: ExchangeRates;
  lastUpdated: string | null;
  formatCurr: (val: number, maxDecimals?: number) => string;
  formatCompactCurr: (val: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  currencySymbol: '$',
  rates: DEFAULT_EXCHANGE_RATES,
  lastUpdated: null,
  formatCurr: () => '',
  formatCompactCurr: () => '',
});

const STORAGE_KEY = 'calc_preferred_currency';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<SupportedCurrency>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as SupportedCurrency;
        if (saved && CURRENCY_SYMBOLS[saved]) return saved;
      } catch {
        // ignore
      }
    }
    return 'USD';
  });

  const [rates, setRates] = useState<ExchangeRates>(DEFAULT_EXCHANGE_RATES);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Fetch live daily forex rates without requiring any API key
  // Using open ECB-backed frankfurter api (public, zero auth required)
  useEffect(() => {
    let isMounted = true;

    async function fetchLiveRates() {
      try {
        const response = await fetch(
          'https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,CAD,AUD,INR',
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
    setCurrencyState(newCurrency);
    setActiveGlobalCurrency(newCurrency);
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
