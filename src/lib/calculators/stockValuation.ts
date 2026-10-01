/**
 * Stock Valuation Calculator Engine (Educational)
 * Supports fundamental educational valuation models:
 * 1. P/E Multiple Method: Value = EPS * Benchmark P/E
 * 2. Benjamin Graham Intrinsic Formula: Value = EPS * (8.5 + 2g) * (4.4 / Y)
 * 3. Dividend Discount Model (Gordon Growth): Value = D1 / (r - g)
 *
 * Clearly states:
 * "This is an educational, assumption-based calculation and is not investment advice."
 * Does NOT present results as authoritative buy/sell recommendations.
 */

export type ValuationModel = 'peMultiple' | 'graham' | 'dividendDiscount';

export interface StockValuationInput {
  model: ValuationModel;
  currentStockPrice: number; // Current market price ($)
  eps: number; // Earnings Per Share ($)
  targetPeMultiple?: number; // Benchmark P/E (e.g. 20)
  expectedGrowthRate?: number; // Expected annual growth % (e.g. 8%)
  corporateBondYield?: number; // AAA Corporate bond yield % (e.g. 4.4%)
  annualDividend?: number; // Current annual dividend per share ($)
  dividendGrowthRate?: number; // Projected annual dividend growth % (e.g. 5%)
  requiredReturnRate?: number; // Investor hurdle rate % (e.g. 9%)
}

export interface StockValuationResult {
  model: ValuationModel;
  currentStockPrice: number;
  estimatedValuePerShare: number;
  dollarDifference: number; // Estimated Value - Current Price
  percentageDifference: number; // % difference vs current market price
  comparisonLabel: string;
  modelSummary: string;
  disclaimer: string;
}

export function calculateStockValuation(input: StockValuationInput): StockValuationResult {
  const price = Math.max(0.01, Number(input.currentStockPrice) || 100);
  const eps = Number(input.eps) || 5;
  const model = input.model || 'peMultiple';

  let estimatedValue = 0;
  let summary = '';

  if (model === 'peMultiple') {
    const pe = Math.max(1, Number(input.targetPeMultiple) || 20);
    estimatedValue = eps * pe;
    summary = `P/E Multiple Model: EPS ($${eps.toFixed(2)}) × Assumed Multiple (${pe}x) = $${estimatedValue.toFixed(2)}`;
  } else if (model === 'graham') {
    const g = Math.max(0, Number(input.expectedGrowthRate) || 8);
    const y = Math.max(1.0, Number(input.corporateBondYield) || 4.4);
    // Benjamin Graham Revised Formula: V = [EPS * (8.5 + 2g) * 4.4] / Y
    estimatedValue = (eps * (8.5 + 2 * g) * 4.4) / y;
    summary = `Benjamin Graham Formula: [EPS ($${eps}) × (8.5 + 2×${g}%) × 4.4] / ${y}% = $${estimatedValue.toFixed(2)}`;
  } else {
    // Dividend Discount Model (Gordon Growth): V0 = D0 * (1 + g) / (r - g)
    const d0 = Math.max(0.1, Number(input.annualDividend) || 3.0);
    const g = Math.max(0, Number(input.dividendGrowthRate) || 5) / 100;
    const r = Math.max(g + 0.01, Number(input.requiredReturnRate) || 9) / 100;

    const d1 = d0 * (1 + g);
    estimatedValue = d1 / (r - g);
    summary = `Gordon Growth Model: Next Dividend ($${d1.toFixed(2)}) / (${(r * 100).toFixed(1)}% - ${(g * 100).toFixed(1)}%) = $${estimatedValue.toFixed(2)}`;
  }

  estimatedValue = Math.max(0, Number(estimatedValue.toFixed(2)));
  const dollarDifference = Number((estimatedValue - price).toFixed(2));
  const percentageDifference = Number((((estimatedValue - price) / price) * 100).toFixed(2));

  let comparisonLabel = 'In-Line With Market Price (Within ±5%)';
  if (percentageDifference > 5) {
    comparisonLabel = `Model Estimate is +${percentageDifference}% Above Market Price`;
  } else if (percentageDifference < -5) {
    comparisonLabel = `Model Estimate is ${percentageDifference}% Below Market Price`;
  }

  return {
    model,
    currentStockPrice: price,
    estimatedValuePerShare: estimatedValue,
    dollarDifference,
    percentageDifference,
    comparisonLabel,
    modelSummary: summary,
    disclaimer:
      'This is an educational, assumption-based calculation and is not investment advice. Equity valuations depend upon forward-looking assumptions (future growth rates, discount rates, and earnings stability) that may not materialize. Do not treat calculated values as predictions or financial recommendations.',
  };
}
