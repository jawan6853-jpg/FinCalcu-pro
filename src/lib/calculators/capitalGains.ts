/**
 * Capital Gains Calculator Engine
 * Formula: Capital Gain/Loss = Selling Price - Purchase Price - Eligible Costs
 * Calculates: Gain/Loss, Return %, Estimated Tax Liability, Net After-Tax Proceeds
 * IMPORTANT: Clearly states that tax treatment varies by country and jurisdiction. Not legal or tax advice.
 */

export interface CapitalGainsInput {
  purchasePrice: number; // Cost basis per unit or total ($)
  salePrice: number; // Sale price per unit or total ($)
  quantity?: number; // Number of units/shares (default 1)
  eligibleCosts?: number; // Commissions, legal/broker fees, improvements ($)
  holdingPeriod: 'short-term' | 'long-term'; // < 1 year vs >= 1 year
  estimatedTaxRate: number; // User-entered tax bracket %
}

export interface CapitalGainsResult {
  totalCostBasis: number;
  totalProceeds: number;
  totalEligibleCosts: number;
  netCapitalGainOrLoss: number;
  gainPercentage: number;
  estimatedTaxLiability: number;
  netAfterTaxProceeds: number;
  isGain: boolean;
  holdingPeriod: 'short-term' | 'long-term';
  disclaimer: string;
}

export function calculateCapitalGains(input: CapitalGainsInput): CapitalGainsResult {
  const qty = Math.max(0.00000001, Number(input.quantity) || 1);
  const buy = Math.max(0, Number(input.purchasePrice) || 0);
  const sell = Math.max(0, Number(input.salePrice) || 0);
  const fees = Math.max(0, Number(input.eligibleCosts) || 0);
  const taxRate = Math.max(0, Number(input.estimatedTaxRate) || 0) / 100;

  const totalCostBasis = buy * qty;
  const totalProceeds = sell * qty;

  // Capital Gain/Loss = Proceeds - Cost Basis - Eligible Costs
  const netGainLoss = totalProceeds - totalCostBasis - fees;
  const isGain = netGainLoss > 0;

  const totalInvestmentCost = totalCostBasis + fees;
  const gainPercentage = totalInvestmentCost > 0 ? (netGainLoss / totalInvestmentCost) * 100 : 0;

  // Estimated tax applies only if positive gain
  const estimatedTaxLiability = isGain ? netGainLoss * taxRate : 0;
  const netAfterTaxProceeds = totalProceeds - fees - estimatedTaxLiability;

  return {
    totalCostBasis,
    totalProceeds,
    totalEligibleCosts: fees,
    netCapitalGainOrLoss: netGainLoss,
    gainPercentage,
    estimatedTaxLiability,
    netAfterTaxProceeds,
    isGain,
    holdingPeriod: input.holdingPeriod || 'long-term',
    disclaimer:
      'Tax rules and exemptions vary substantially across state, provincial, and national jurisdictions. This tool provides numerical estimates only and does not constitute certified legal or tax advice.',
  };
}
