/**
 * Investment Fee & Expense Ratio Impact Calculator Engine
 * Calculates: Wealth drag caused by management fees, fund expense ratios, and advisory fees over long horizons
 */

export interface InvestmentFeeInput {
  initialInvestment: number; // Starting portfolio ($)
  monthlyContribution?: number; // Regular savings ($)
  annualReturnRatePercent: number; // Gross expected return % (e.g. 8%)
  annualFeePercent: number; // Expense ratio or advisory fee % (e.g. 0.75%)
  investmentPeriodYears: number; // Horizon in years (e.g. 25)
}

export interface InvestmentFeeResult {
  endingBalanceWithoutFee: number;
  endingBalanceWithFee: number;
  totalFeesCost: number; // Wealth lost to fees + forgone compounding
  totalDirectFeesPaid: number;
  percentageLostToFees: number;
  yearlyComparison: {
    year: number;
    balanceNoFee: number;
    balanceWithFee: number;
    cumulativeLost: number;
  }[];
}

export function calculateInvestmentFee(input: InvestmentFeeInput): InvestmentFeeResult {
  const initial = Math.max(0, Number(input.initialInvestment) || 0);
  const monthly = Math.max(0, Number(input.monthlyContribution) || 0);
  const grossReturn = Math.max(0, Number(input.annualReturnRatePercent) || 0) / 100;
  const feeRate = Math.max(0, Math.min(10, Number(input.annualFeePercent) || 0)) / 100;
  const years = Math.max(1, Math.min(50, Number(input.investmentPeriodYears) || 20));

  const netReturn = Math.max(0, grossReturn - feeRate);

  const monthlyGrossRate = grossReturn / 12;
  const monthlyNetRate = netReturn / 12;

  let balNoFee = initial;
  let balWithFee = initial;
  let directFeesPaid = 0;

  const yearlyComparison: InvestmentFeeResult['yearlyComparison'] = [];

  for (let yr = 1; yr <= years; yr++) {
    for (let m = 1; m <= 12; m++) {
      // No fee balance
      balNoFee = balNoFee * (1 + monthlyGrossRate) + monthly;

      // With fee balance
      const feeDeduction = (balWithFee * feeRate) / 12;
      directFeesPaid += feeDeduction;
      balWithFee = balWithFee * (1 + monthlyNetRate) + monthly;
    }

    yearlyComparison.push({
      year: yr,
      balanceNoFee: Math.round(balNoFee),
      balanceWithFee: Math.round(balWithFee),
      cumulativeLost: Math.round(Math.max(0, balNoFee - balWithFee)),
    });
  }

  const totalFeesCost = Math.max(0, balNoFee - balWithFee);
  const percentageLost = balNoFee > 0 ? (totalFeesCost / balNoFee) * 100 : 0;

  return {
    endingBalanceWithoutFee: Math.round(balNoFee * 100) / 100,
    endingBalanceWithFee: Math.round(balWithFee * 100) / 100,
    totalFeesCost: Math.round(totalFeesCost * 100) / 100,
    totalDirectFeesPaid: Math.round(directFeesPaid * 100) / 100,
    percentageLostToFees: Math.round(percentageLost * 10) / 10,
    yearlyComparison,
  };
}
