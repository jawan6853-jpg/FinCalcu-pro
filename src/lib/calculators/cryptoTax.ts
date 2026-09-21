import { sanitizeNumber } from '../formatters';

export interface CryptoTaxInput {
  costBasis: number;
  saleProceeds: number;
  holdingPeriod: 'short_term' | 'long_term'; // <1 year vs >=1 year
  incomeTaxBracketPercentage: number; // e.g., 24% for short-term
  longTermTaxRatePercentage: number; // e.g., 15% for long-term
}

export interface CryptoTaxResult {
  costBasis: number;
  saleProceeds: number;
  capitalGainOrLoss: number;
  isGain: boolean;
  applicableTaxRate: number;
  estimatedTaxOwed: number;
  netProceedsAfterTax: number;
  taxSavingsWithLongTerm: number;
}

export function calculateCryptoTax(input: CryptoTaxInput): CryptoTaxResult {
  const costBasis = Math.max(0, sanitizeNumber(input.costBasis));
  const saleProceeds = Math.max(0, sanitizeNumber(input.saleProceeds));
  const shortTermRate = Math.max(0, Math.min(100, sanitizeNumber(input.incomeTaxBracketPercentage)));
  const longTermRate = Math.max(0, Math.min(100, sanitizeNumber(input.longTermTaxRatePercentage)));

  const capitalGainOrLoss = saleProceeds - costBasis;
  const isGain = capitalGainOrLoss > 0;

  const applicableTaxRate = input.holdingPeriod === 'long_term' ? longTermRate : shortTermRate;

  let estimatedTaxOwed = 0;
  if (isGain) {
    estimatedTaxOwed = capitalGainOrLoss * (applicableTaxRate / 100);
  }

  const netProceedsAfterTax = saleProceeds - estimatedTaxOwed;

  // Potential tax savings if held long term instead of short term
  let taxSavingsWithLongTerm = 0;
  if (isGain && shortTermRate > longTermRate) {
    const shortTermTax = capitalGainOrLoss * (shortTermRate / 100);
    const longTermTax = capitalGainOrLoss * (longTermRate / 100);
    taxSavingsWithLongTerm = Math.max(0, shortTermTax - longTermTax);
  }

  return {
    costBasis,
    saleProceeds,
    capitalGainOrLoss,
    isGain,
    applicableTaxRate,
    estimatedTaxOwed,
    netProceedsAfterTax,
    taxSavingsWithLongTerm,
  };
}
