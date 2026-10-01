/**
 * Savings Rate Calculator Engine
 * Formula: Savings Rate (%) = (Savings / Income) * 100
 * Calculates: Savings Rate %, Total Savings, Total Spending, Projected Years to Financial Freedom
 */

export interface SavingsRateInput {
  monthlyIncome: number; // Net take-home earnings ($)
  monthlySavings: number; // Allocated to savings, 401k, IRA, brokerage, crypto ($)
  monthlyEssentialSpending?: number; // Rent, groceries, utilities, debt ($)
  monthlyDiscretionarySpending?: number; // Dining, hobbies, travel ($)
}

export interface SavingsRateResult {
  monthlyIncome: number;
  monthlySavings: number;
  monthlySpending: number;
  annualIncome: number;
  annualSavings: number;
  annualSpending: number;
  savingsRatePercentage: number;
  spendingRatePercentage: number;
  projectedYearsToFI: number; // Approximate years to reach 25x annual spending assuming 5% real return
  rule503020Comparison: {
    needsPercentage: number;
    wantsPercentage: number;
    savingsPercentage: number;
    needsCompliant: boolean;
    savingsCompliant: boolean;
  };
  tierLabel: 'Struggling (<10%)' | 'Standard (10%-20%)' | 'Aggressive (20%-50%)' | 'Extreme FIRE (>50%)';
}

export function calculateSavingsRate(input: SavingsRateInput): SavingsRateResult {
  const income = Math.max(1, Number(input.monthlyIncome) || 1);
  const savings = Math.max(0, Number(input.monthlySavings) || 0);

  let essential = Math.max(0, Number(input.monthlyEssentialSpending) || 0);
  let discretionary = Math.max(0, Number(input.monthlyDiscretionarySpending) || 0);

  // If spending components not specified, derive spending from income - savings
  if (essential === 0 && discretionary === 0) {
    const totalSpend = Math.max(0, income - savings);
    essential = totalSpend * 0.7;
    discretionary = totalSpend * 0.3;
  }

  const monthlySpending = essential + discretionary;
  const savingsRatePercentage = (savings / income) * 100;
  const spendingRatePercentage = (monthlySpending / income) * 100;

  const annualIncome = income * 12;
  const annualSavings = savings * 12;
  const annualSpending = monthlySpending * 12;

  // Estimate Years to Financial Independence (assuming 5% real annual investment return & 4% withdrawal rate)
  // Formula: Years to accumulate 25 * annualSpending with annualSavings at 5% r:
  // FV = PMT * [((1 + r)^n - 1) / r] = 25 * annualSpending
  // ((1 + r)^n - 1) = (25 * annualSpending * r) / annualSavings
  // n = ln(1 + (25 * annualSpending * r / annualSavings)) / ln(1 + r)
  let projectedYearsToFI = 50;
  const targetFI = annualSpending * 25;
  const r = 0.05; // 5% real net return

  if (annualSavings > 0 && targetFI > 0) {
    const ratio = (targetFI * r) / annualSavings;
    if (ratio > 0) {
      projectedYearsToFI = Math.log(1 + ratio) / Math.log(1 + r);
      projectedYearsToFI = Math.max(0, Math.min(60, Number(projectedYearsToFI.toFixed(1))));
    }
  } else if (annualSavings === 0) {
    projectedYearsToFI = 99;
  }

  const needsPct = (essential / income) * 100;
  const wantsPct = (discretionary / income) * 100;

  let tierLabel: SavingsRateResult['tierLabel'] = 'Standard (10%-20%)';
  if (savingsRatePercentage >= 50) {
    tierLabel = 'Extreme FIRE (>50%)';
  } else if (savingsRatePercentage >= 20) {
    tierLabel = 'Aggressive (20%-50%)';
  } else if (savingsRatePercentage < 10) {
    tierLabel = 'Struggling (<10%)';
  }

  return {
    monthlyIncome: income,
    monthlySavings: savings,
    monthlySpending,
    annualIncome,
    annualSavings,
    annualSpending,
    savingsRatePercentage,
    spendingRatePercentage,
    projectedYearsToFI,
    rule503020Comparison: {
      needsPercentage: needsPct,
      wantsPercentage: wantsPct,
      savingsPercentage: savingsRatePercentage,
      needsCompliant: needsPct <= 50,
      savingsCompliant: savingsRatePercentage >= 20,
    },
    tierLabel,
  };
}
