/**
 * Crypto Tax Calculator Engine
 * Calculates: Estimated Capital Gain/Loss, Cost Basis, Gross Proceeds, Deductible Fees, Estimated Tax Liability, Net Kept
 * IMPORTANT: Clearly labels results as estimates. Does not provide legal or tax advice. Tax rules vary by jurisdiction.
 */

export interface Batch4CryptoTaxInput {
  purchasePricePerCoin: number; // Buy price ($)
  salePricePerCoin: number; // Sell price ($)
  quantity: number; // Number of coins/tokens
  fees: number; // Trading, gas, and network fees ($)
  taxRatePercent: number; // User-entered tax bracket (e.g. 15%, 24%)
  holdingPeriod?: 'short-term' | 'long-term';
}

export interface Batch4CryptoTaxResult {
  costBasis: number;
  grossProceeds: number;
  deductibleFees: number;
  netTaxableCapitalGain: number;
  estimatedTaxAmount: number;
  netProceedsAfterTaxes: number;
  effectiveTaxRatePercent: number;
  isTaxableGain: boolean;
  disclaimer: string;
}

export function calculateBatch4CryptoTax(input: Batch4CryptoTaxInput): Batch4CryptoTaxResult {
  const buyPrice = Math.max(0, Number(input.purchasePricePerCoin) || 0);
  const sellPrice = Math.max(0, Number(input.salePricePerCoin) || 0);
  const qty = Math.max(0, Number(input.quantity) || 0);
  const fees = Math.max(0, Number(input.fees) || 0);
  const taxRate = Math.max(0, Number(input.taxRatePercent) || 0) / 100;

  const costBasis = buyPrice * qty;
  const grossProceeds = sellPrice * qty;

  // Capital Gain/Loss = Proceeds - Cost Basis - Fees
  const netGain = grossProceeds - costBasis - fees;
  const isTaxableGain = netGain > 0;

  const estimatedTaxAmount = isTaxableGain ? netGain * taxRate : 0;
  const netProceedsAfterTaxes = grossProceeds - fees - estimatedTaxAmount;

  const effectiveTaxRatePercent = grossProceeds > 0 ? (estimatedTaxAmount / grossProceeds) * 100 : 0;

  return {
    costBasis,
    grossProceeds,
    deductibleFees: fees,
    netTaxableCapitalGain: netGain,
    estimatedTaxAmount,
    netProceedsAfterTaxes,
    effectiveTaxRatePercent,
    isTaxableGain,
    disclaimer:
      'This calculation is an estimate for informational modeling only and does not constitute formal legal, accounting, or tax advice. Cryptocurrency tax laws, wash sale regulations, and bracket rules differ widely across global tax jurisdictions.',
  };
}
