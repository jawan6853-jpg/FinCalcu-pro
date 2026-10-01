/**
 * Dividend Reinvestment (DRIP) Calculator Engine
 * Calculates: Wealth growth with dividend reinvestment vs cash payout, annual dividend income, yield on cost
 */

export interface DividendReinvestmentInput {
  initialInvestment: number; // Starting principal ($)
  annualContribution?: number; // Annual new cash invested ($)
  dividendYieldPercent: number; // Initial annual dividend yield % (e.g. 3.5%)
  annualDividendGrowthRatePercent?: number; // Expected annual dividend hike % (e.g. 5%)
  expectedSharePriceAppreciationPercent?: number; // Annual capital growth % (e.g. 6%)
  years: number; // Investment horizon (years)
  taxRateOnDividendsPercent?: number; // Qualified dividend tax rate % (default: 15%)
}

export interface DripYearlySnapshot {
  year: number;
  portfolioValueDrip: number;
  portfolioValueNoDrip: number;
  annualDividendIncome: number;
  yieldOnCostPercent: number;
}

export interface DividendReinvestmentResult {
  endingBalanceWithDrip: number;
  endingBalanceWithoutDrip: number;
  totalDividendsEarned: number;
  dripWealthBoost: number; // Difference made by reinvesting
  finalAnnualDividendPayout: number;
  finalYieldOnCostPercent: number;
  yearlySchedule: DripYearlySnapshot[];
  disclaimer: string;
}

export function calculateDividendReinvestment(
  input: DividendReinvestmentInput
): DividendReinvestmentResult {
  const initial = Math.max(0, Number(input.initialInvestment) || 0);
  const contribution = Math.max(0, Number(input.annualContribution) || 0);
  const initialYield = Math.max(0, Number(input.dividendYieldPercent) || 0) / 100;
  const divGrowth = Math.max(0, Number(input.annualDividendGrowthRatePercent) || 0) / 100;
  const priceGrowth = Math.max(0, Number(input.expectedSharePriceAppreciationPercent) || 0) / 100;
  const years = Math.max(1, Math.min(50, Number(input.years) || 10));
  const taxRate = Math.max(0, Math.min(40, Number(input.taxRateOnDividendsPercent ?? 15))) / 100;

  let balanceDrip = initial;
  let balanceNoDrip = initial;
  let totalDividends = 0;
  let currentYield = initialYield;
  let totalCashInvested = initial;

  const schedule: DripYearlySnapshot[] = [];

  for (let yr = 1; yr <= years; yr++) {
    // Annual capital growth
    balanceDrip *= (1 + priceGrowth);
    balanceNoDrip *= (1 + priceGrowth);

    // New cash contribution added
    balanceDrip += contribution;
    balanceNoDrip += contribution;
    totalCashInvested += contribution;

    // Gross dividends generated
    const annualDividend = balanceDrip * currentYield;
    const netDividend = annualDividend * (1 - taxRate);
    totalDividends += annualDividend;

    // DRIP: Reinvest net dividends into portfolio
    balanceDrip += netDividend;

    // Grow dividend per share
    currentYield *= (1 + divGrowth);

    const yieldOnCost = totalCashInvested > 0 ? (annualDividend / totalCashInvested) * 100 : 0;

    schedule.push({
      year: yr,
      portfolioValueDrip: Math.round(balanceDrip),
      portfolioValueNoDrip: Math.round(balanceNoDrip),
      annualDividendIncome: Math.round(annualDividend),
      yieldOnCostPercent: Math.round(yieldOnCost * 10) / 10,
    });
  }

  const dripBoost = Math.max(0, balanceDrip - balanceNoDrip);
  const finalAnnualDividend = balanceDrip * currentYield;
  const finalYieldOnCost = totalCashInvested > 0 ? (finalAnnualDividend / totalCashInvested) * 100 : 0;

  return {
    endingBalanceWithDrip: Math.round(balanceDrip * 100) / 100,
    endingBalanceWithoutDrip: Math.round(balanceNoDrip * 100) / 100,
    totalDividendsEarned: Math.round(totalDividends * 100) / 100,
    dripWealthBoost: Math.round(dripBoost * 100) / 100,
    finalAnnualDividendPayout: Math.round(finalAnnualDividend * 100) / 100,
    finalYieldOnCostPercent: Math.round(finalYieldOnCost * 10) / 10,
    yearlySchedule: schedule,
    disclaimer: 'Projections are hypothetical mathematical models based on constant reinvestment, expected dividend increases, and asset appreciation. Dividends and share prices fluctuate in real markets.',
  };
}
