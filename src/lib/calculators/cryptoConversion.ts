/**
 * Crypto Conversion Calculator Engine
 * Calculates: Instant conversion between Cryptocurrency (BTC, ETH, SOL, etc.) and Fiat currencies (USD, EUR, etc.)
 */

export interface CryptoConversionInput {
  direction: 'crypto-to-fiat' | 'fiat-to-crypto';
  amount: number; // Source amount
  coinSymbol: string; // e.g. "BTC", "ETH", "SOL"
  fiatCurrency: string; // e.g. "USD", "EUR", "GBP", "PKR", "INR"
  exchangeRate: number; // Price of 1 coin in chosen fiat
}

export interface CryptoConversionResult {
  sourceAmount: number;
  targetAmount: number;
  sourceSymbol: string;
  targetSymbol: string;
  exchangeRateUsed: number;
  unitValueExplanation: string;
}

export const POPULAR_CRYPTO_PRESETS = [
  { symbol: 'BTC', name: 'Bitcoin', defaultPriceUsd: 64500 },
  { symbol: 'ETH', name: 'Ethereum', defaultPriceUsd: 2650 },
  { symbol: 'SOL', name: 'Solana', defaultPriceUsd: 145 },
  { symbol: 'BNB', name: 'BNB', defaultPriceUsd: 585 },
  { symbol: 'XRP', name: 'XRP', defaultPriceUsd: 0.58 },
  { symbol: 'ADA', name: 'Cardano', defaultPriceUsd: 0.38 },
  { symbol: 'DOGE', name: 'Dogecoin', defaultPriceUsd: 0.12 },
];

export function calculateCryptoConversion(input: CryptoConversionInput): CryptoConversionResult {
  const dir = input.direction || 'crypto-to-fiat';
  const amount = Math.max(0, Number(input.amount) || 0);
  const rate = Math.max(0.00000001, Number(input.exchangeRate) || 64500);
  const coin = input.coinSymbol || 'BTC';
  const fiat = input.fiatCurrency || 'USD';

  let targetAmount = 0;
  let sourceSymbol = coin;
  let targetSymbol = fiat;
  let unitValueExplanation = '';

  if (dir === 'crypto-to-fiat') {
    targetAmount = amount * rate;
    sourceSymbol = coin;
    targetSymbol = fiat;
    unitValueExplanation = `1 ${coin} = ${rate.toLocaleString()} ${fiat}`;
  } else {
    // Fiat to Crypto
    targetAmount = rate > 0 ? amount / rate : 0;
    sourceSymbol = fiat;
    targetSymbol = coin;
    unitValueExplanation = `1 ${fiat} = ${(1 / rate).toFixed(8)} ${coin}`;
  }

  return {
    sourceAmount: amount,
    targetAmount: dir === 'crypto-to-fiat' ? Math.round(targetAmount * 100) / 100 : Math.round(targetAmount * 100000000) / 100000000,
    sourceSymbol,
    targetSymbol,
    exchangeRateUsed: rate,
    unitValueExplanation,
  };
}
