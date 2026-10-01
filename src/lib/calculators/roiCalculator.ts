/**
 * General Return on Investment (ROI) Calculator Engine
 * Calculates: ROI %, Net Profit, Total Return, Annualized ROI, Capital Multiplier
 */

export interface RoiCalculatorInput {
  initialInvestment: number; // Initial capital outlay ($)
  finalValue: number; // Value returned or current balance ($)
  investmentPeriodYears?: number; // Holding period in years (optional, for annualized return)
  additionalCosts?: number; // Optional ongoing expenses/fees ($)
  additionalDividendsOrIncome?: number; // Optional dividends/rent received ($)
}

export interface RoiCalculatorResult {
  roiPercentage: number; // Net ROI %
  netProfit: number; // Dollar gain or loss ($)
  totalReturn: number; // Gross final value + income
  totalCostBasis: number; // Initial investment + additional costs
  capitalMultiplier: number; // Final capital multiple (e.g. 2.5x)
  annualizedRoiPercentage?: number; // Annualized CAGR %
  isProfitable: boolean;
}

export function calculateRoi(input: RoiCalculatorInput): RoiCalculatorResult {
  const initial = Math.max(0, Number(input.initialInvestment) || 0);
  const finalVal = Math.max(0, Number(input.finalValue) || 0);
  const years = Math.max(0, Number(input.investmentPeriodYears) || 0);
  const costs = Math.max(0, Number(input.additionalCosts) || 0);
  const income = Math.max(0, Number(input.additionalDividendsOrIncome) || 0);

  const totalCostBasis = initial + costs;
  const grossProceeds = finalVal + income;
  const netProfit = grossProceeds - totalCostBasis;

  if (totalCostBasis <= 0) {
    return {
      roiPercentage: 0,
      netProfit: 0,
      totalReturn: grossProceeds,
      totalCostBasis: 0,
      capitalMultiplier: 1,
      annualizedRoiPercentage: 0,
      isProfitable: false,
    };
  }

  const roiPercentage = (netProfit / totalCostBasis) * 100;
  const capitalMultiplier = totalCostBasis > 0 ? grossProceeds / totalCostBasis : 1;

  let annualizedRoiPercentage: number | undefined;
  if (years > 0 && totalCostBasis > 0 && grossProceeds > 0) {
    // Annualized ROI = (Ending / Beginning)^(1/years) - 1
    const ratio = grossProceeds / totalCostBasis;
    annualizedRoiPercentage = (Math.pow(ratio, 1 / years) - 1) * 100;
  }

  return {
    roiPercentage: Math.round(roiPercentage * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    totalReturn: Math.round(grossProceeds * 100) / 100,
    totalCostBasis: Math.round(totalCostBasis * 100) / 100,
    capitalMultiplier: Math.round(capitalMultiplier * 100) / 100,
    annualizedRoiPercentage: annualizedRoiPercentage !== undefined
      ? Math.round(annualizedRoiPercentage * 100) / 100
      : undefined,
    isProfitable: netProfit >= 0,
  };
}
