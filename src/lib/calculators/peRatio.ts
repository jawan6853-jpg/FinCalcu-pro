/**
 * P/E (Price-to-Earnings) Ratio Calculator Engine
 * Formula: P/E = Stock Price / EPS
 * Calculates: P/E Ratio, Implied Stock Price, Required EPS, Earnings Yield %, PEG Ratio
 */

export type PeCalculationMode = 'peFromPriceAndEps' | 'priceFromEpsAndPe' | 'epsFromPriceAndPe';

export interface PeRatioInput {
  mode: PeCalculationMode;
  stockPrice?: number; // Share price ($)
  eps?: number; // Earnings Per Share ($)
  peRatio?: number; // Target or market multiple (e.g. 22)
  earningsGrowthRate?: number; // Annual EPS growth % (for PEG calculation)
}

export interface PeRatioResult {
  mode: PeCalculationMode;
  stockPrice: number;
  eps: number;
  peRatio: number;
  earningsYieldPercentage: number; // EPS / Price * 100
  pegRatio: number | null; // PE / Growth Rate
  valuationTier: 'Deep Value (<12x)' | 'Moderate / Fair (12x-25x)' | 'Growth (25x-50x)' | 'High Growth / Premium (>50x)' | 'Negative Earnings';
  interpretation: string;
}

import { parseInput } from '../formatters';

export function calculatePeRatio(input: PeRatioInput): PeRatioResult {
  const mode = input.mode || 'peFromPriceAndEps';
  let price = parseInput(input.stockPrice, 120);
  let eps = parseInput(input.eps, 6);
  let pe = parseInput(input.peRatio, 20);
  const growth = parseInput(input.earningsGrowthRate, 0);

  if (mode === 'peFromPriceAndEps') {
    price = Math.max(0, price);
    pe = eps > 0 ? price / eps : eps < 0 ? -Math.abs(price / eps) : 0;
  } else if (mode === 'priceFromEpsAndPe') {
    price = eps * pe;
  } else {
    // epsFromPriceAndPe
    price = Math.max(0, price);
    eps = pe !== 0 ? price / pe : 0;
  }

  const earningsYield = price > 0 ? (eps / price) * 100 : 0;
  const pegRatio = growth > 0 && pe > 0 ? Number((pe / growth).toFixed(2)) : null;

  let valuationTier: PeRatioResult['valuationTier'] = 'Moderate / Fair (12x-25x)';
  let interpretation = '';

  if (eps <= 0) {
    valuationTier = 'Negative Earnings';
    interpretation = 'The company is currently operating at a net loss (negative EPS), rendering the standard P/E multiple non-applicable or negative.';
  } else if (pe > 50) {
    valuationTier = 'High Growth / Premium (>50x)';
    interpretation = 'Investors are paying a rich multiple anticipating exponential forward earnings expansion, common in early-stage tech or AI companies.';
  } else if (pe >= 25) {
    valuationTier = 'Growth (25x-50x)';
    interpretation = 'Priced as a quality growth stock above historical S&P 500 averages (~16-20x), demanding reliable double-digit revenue execution.';
  } else if (pe >= 12) {
    valuationTier = 'Moderate / Fair (12x-25x)';
    interpretation = 'Trading within healthy historical valuation norms for established, profitable enterprises with steady cash flows.';
  } else {
    valuationTier = 'Deep Value (<12x)';
    interpretation = 'Trading at a discounted valuation multiple, characteristic of mature cyclical, financial, or potential value-recovery opportunities.';
  }

  return {
    mode,
    stockPrice: Number(price.toFixed(2)),
    eps: Number(eps.toFixed(2)),
    peRatio: Number(pe.toFixed(2)),
    earningsYieldPercentage: Number(earningsYield.toFixed(2)),
    pegRatio,
    valuationTier,
    interpretation,
  };
}
