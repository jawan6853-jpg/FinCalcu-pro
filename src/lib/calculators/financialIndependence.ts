/**
 * Financial Independence (FI) Calculator Engine
 * Formula: FI Number = Annual Expenses / (Withdrawal Rate / 100)
 * Evaluates target portfolio, current gap, annual compounding growth, and years to FI.
 * Clearly labels all projections as educational estimates based on assumed returns.
 */

export interface FinancialIndependenceInput {
  annualExpenses: number; // Projected annual lifestyle cost ($)
  withdrawalRate: number; // Safe withdrawal rate % (e.g. 4.0% standard or 3.5%)
  currentInvestments: number; // Currently invested assets ($)
  annualContributions: number; // Yearly additional savings added ($)
  expectedReturn: number; // Expected annual nominal or real investment return % (e.g. 7.0%)
}

export interface FinancialIndependenceResult {
  fiNumber: number; // Target nest egg ($)
  currentInvestments: number;
  remainingCapitalNeeded: number;
  currentProgressPercentage: number;
  yearsToFI: number; // Time horizon in years
  totalContributionsOverTime: number;
  compoundGrowthEarned: number;
  annualSafeIncomeGenerated: number;
  growthSchedule: {
    year: number;
    startingBalance: number;
    contributions: number;
    interestEarned: number;
    endingBalance: number;
  }[];
  isAlreadyFI: boolean;
  disclaimer: string;
}

export function calculateFinancialIndependence(input: FinancialIndependenceInput): FinancialIndependenceResult {
  const expenses = Math.max(1000, Number(input.annualExpenses) || 40000);
  const swr = Math.max(1.0, Math.min(10.0, Number(input.withdrawalRate) || 4.0));
  const currentInv = Math.max(0, Number(input.currentInvestments) || 0);
  const pmt = Math.max(0, Number(input.annualContributions) || 0);
  const ratePct = Math.max(0, Number(input.expectedReturn) || 7.0);
  const r = ratePct / 100;

  // FI Target = Annual Expenses / (SWR / 100)
  const fiNumber = expenses / (swr / 100);
  const remainingCapitalNeeded = Math.max(0, fiNumber - currentInv);
  const currentProgressPercentage = Math.min(100, (currentInv / fiNumber) * 100);
  const isAlreadyFI = currentInv >= fiNumber;

  const growthSchedule: FinancialIndependenceResult['growthSchedule'] = [];
  let balance = currentInv;
  let years = 0;
  let totalContrib = 0;
  const maxYears = 60;

  while (balance < fiNumber && years < maxYears) {
    years++;
    const start = balance;
    const interest = balance * r;
    balance = balance + interest + pmt;
    totalContrib += pmt;

    growthSchedule.push({
      year: years,
      startingBalance: Math.round(start),
      contributions: Math.round(totalContrib),
      interestEarned: Math.round(interest),
      endingBalance: Math.round(balance),
    });
  }

  const finalYearsToFI = isAlreadyFI ? 0 : years >= maxYears ? maxYears : years;
  const compoundGrowthEarned = Math.max(0, balance - currentInv - totalContrib);
  const annualSafeIncomeGenerated = fiNumber * (swr / 100);

  return {
    fiNumber,
    currentInvestments: currentInv,
    remainingCapitalNeeded,
    currentProgressPercentage,
    yearsToFI: finalYearsToFI,
    totalContributionsOverTime: totalContrib,
    compoundGrowthEarned,
    annualSafeIncomeGenerated,
    growthSchedule,
    isAlreadyFI,
    disclaimer:
      'Disclaimer: Financial Independence projections are mathematical simulations based on user assumptions (constant rates of return, regular contributions, and steady withdrawal rates). Actual market performance, inflation, tax rates, and personal living costs fluctuate over time.',
  };
}
