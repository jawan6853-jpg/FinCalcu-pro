/**
 * FIRE (Financial Independence, Retire Early) Calculator Engine
 * Calculates: FIRE Number, Years to FIRE, Target Age, Lean FIRE, Fat FIRE, Coast FIRE.
 * Clearly labels all results as mathematical assumptions, not guarantees.
 */

export interface FireInput {
  currentAge: number;
  currentSavings: number; // Current portfolio / liquid assets ($)
  annualIncome: number; // Household income ($)
  annualExpenses: number; // Target annual retirement expenses ($)
  annualSavings: number; // Annual contribution ($)
  expectedReturn: number; // Expected real investment return % (e.g. 7%)
  withdrawalRate: number; // SWR % (e.g. 4.0% standard or 3.5% conservative)
}

export interface FireResult {
  fireNumber: number;
  leanFireNumber: number; // 75% of baseline expenses
  fatFireNumber: number; // 140% of baseline expenses
  coastFireNumber: number; // Amount needed right now to grow to FIRE by age 65 with zero additional contributions
  yearsToFIRE: number;
  fireAge: number;
  currentProgressPercentage: number;
  requiredMonthlySavingsFor10YearFire: number;
  annualSavings: number;
  totalContributionsAtFire: number;
  totalGrowthAtFire: number;
  disclaimer: string;
}

export function calculateFIRE(input: FireInput): FireResult {
  const age = Math.max(16, Math.min(100, Number(input.currentAge) || 30));
  const savings = Math.max(0, Number(input.currentSavings) || 0);
  const expenses = Math.max(1000, Number(input.annualExpenses) || 45000);
  const contribution = Math.max(0, Number(input.annualSavings) || 15000);
  const returnRate = Math.max(0.1, Number(input.expectedReturn) || 7.0) / 100;
  const swr = Math.max(1.0, Math.min(10.0, Number(input.withdrawalRate) || 4.0)) / 100;

  // Baseline FIRE Number = Annual Expenses / SWR
  const fireNumber = expenses / swr;
  const leanFireNumber = (expenses * 0.75) / swr;
  const fatFireNumber = (expenses * 1.4) / swr;

  // Coast FIRE: Present value needed today to reach FIRE by age 65 without further contributions
  const yearsTo65 = Math.max(1, 65 - age);
  const coastFireNumber = fireNumber / Math.pow(1 + returnRate, yearsTo65);

  let balance = savings;
  let years = 0;
  let totalContrib = 0;
  const maxYears = 65;

  if (balance >= fireNumber) {
    years = 0;
  } else {
    while (balance < fireNumber && years < maxYears) {
      years++;
      const interest = balance * returnRate;
      balance = balance + interest + contribution;
      totalContrib += contribution;
    }
  }

  const finalYears = balance >= fireNumber ? years : maxYears;
  const fireAge = age + finalYears;
  const currentProgress = Math.min(100, (savings / fireNumber) * 100);

  // Required monthly savings to achieve FIRE in 10 years:
  // FV = PV*(1+r)^10 + PMT * [((1+r)^10 - 1)/r]
  const n = 10;
  const factor = (Math.pow(1 + returnRate, n) - 1) / returnRate;
  const pvFuture = savings * Math.pow(1 + returnRate, n);
  const shortfall = Math.max(0, fireNumber - pvFuture);
  const requiredAnnualSavings = factor > 0 ? shortfall / factor : 0;
  const requiredMonthlySavingsFor10YearFire = requiredAnnualSavings / 12;

  const totalGrowthAtFire = Math.max(0, balance - savings - totalContrib);

  return {
    fireNumber,
    leanFireNumber,
    fatFireNumber,
    coastFireNumber,
    yearsToFIRE: finalYears,
    fireAge,
    currentProgressPercentage: currentProgress,
    requiredMonthlySavingsFor10YearFire,
    annualSavings: contribution,
    totalContributionsAtFire: totalContrib,
    totalGrowthAtFire,
    disclaimer:
      'FIRE calculations are educational models based on historical averages and steady assumptions. Market downturns, inflation spikes, sequence of returns risk, and healthcare expenses can significantly alter outcomes. This is not investment or retirement advice.',
  };
}
