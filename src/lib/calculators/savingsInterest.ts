/**
 * Savings Interest Calculator Engine
 * Calculates: Interest earned, total deposits, final balance, and year-by-year compounding trajectory
 */

export interface SavingsInterestInput {
  initialDeposit: number;
  monthlyDeposit?: number;
  annualInterestRate: number; // APY / Interest rate %
  compoundingFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually';
  periodYears: number;
}

export interface SavingsYearBreakdown {
  year: number;
  startingBalance: number;
  depositsThisYear: number;
  interestThisYear: number;
  endingBalance: number;
}

export interface SavingsInterestResult {
  initialDeposit: number;
  totalRegularDeposits: number;
  totalDeposited: number;
  totalInterestEarned: number;
  finalBalance: number;
  effectiveApyPercent: number;
  interestToDepositRatioPercent: number;
  yearlyBreakdown: SavingsYearBreakdown[];
}

export function calculateSavingsInterest(input: SavingsInterestInput): SavingsInterestResult {
  const principal = Math.max(0, Number(input.initialDeposit) || 0);
  const monthlyAdd = Math.max(0, Number(input.monthlyDeposit) || 0);
  const nominalRate = Math.max(0, Number(input.annualInterestRate) || 0) / 100;
  const years = Math.max(1, Math.min(100, Math.floor(Number(input.periodYears) || 1)));

  // Periods per year for compounding
  let compPeriodsPerYear = 12;
  if (input.compoundingFrequency === 'daily') compPeriodsPerYear = 365;
  else if (input.compoundingFrequency === 'quarterly') compPeriodsPerYear = 4;
  else if (input.compoundingFrequency === 'annually') compPeriodsPerYear = 1;

  // Effective annual yield
  const effectiveApy = compPeriodsPerYear > 0 
    ? Math.pow(1 + nominalRate / compPeriodsPerYear, compPeriodsPerYear) - 1
    : nominalRate;

  let currentBalance = principal;
  let totalDeposited = principal;
  let totalInterest = 0;
  const yearlyBreakdown: SavingsYearBreakdown[] = [];

  // Monthly simulation loop for consistency with monthly deposits
  const totalMonths = years * 12;
  const monthlyRate = nominalRate / 12;

  let yearStartBal = principal;
  let yearDeposits = 0;
  let yearInterest = 0;

  for (let m = 1; m <= totalMonths; m++) {
    // Interest earned this month
    const interestMonth = currentBalance * monthlyRate;
    yearInterest += interestMonth;
    totalInterest += interestMonth;

    currentBalance += interestMonth;

    // Monthly deposit added
    currentBalance += monthlyAdd;
    yearDeposits += monthlyAdd;
    totalDeposited += monthlyAdd;

    // End of year mark
    if (m % 12 === 0 || m === totalMonths) {
      const yearIndex = Math.ceil(m / 12);
      yearlyBreakdown.push({
        year: yearIndex,
        startingBalance: yearStartBal,
        depositsThisYear: yearDeposits,
        interestThisYear: yearInterest,
        endingBalance: currentBalance,
      });

      yearStartBal = currentBalance;
      yearDeposits = 0;
      yearInterest = 0;
    }
  }

  const totalRegular = totalDeposited - principal;
  const ratio = totalDeposited > 0 ? (totalInterest / totalDeposited) * 100 : 0;

  return {
    initialDeposit: principal,
    totalRegularDeposits: totalRegular,
    totalDeposited,
    totalInterestEarned: totalInterest,
    finalBalance: currentBalance,
    effectiveApyPercent: effectiveApy * 100,
    interestToDepositRatioPercent: ratio,
    yearlyBreakdown,
  };
}
