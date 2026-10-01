/**
 * Compound Interest Calculator Engine (Full Parameters)
 * Supports: Principal, Contributions, Rate, Compounding Frequency, Time
 * Outputs: Principal, Total Contributions, Total Interest Earned, Final Balance, Year Breakdown
 */

export interface Batch4CompoundInterestInput {
  principal: number; // Starting deposit ($)
  regularContribution: number; // Regular addition ($)
  contributionFrequency: 'monthly' | 'annually';
  annualInterestRate: number; // Rate (%)
  compoundingFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually';
  years: number; // Time horizon in years
}

export interface CompoundGrowthYear {
  year: number;
  principalContributed: number;
  interestEarnedTotal: number;
  endBalance: number;
}

export interface Batch4CompoundInterestResult {
  initialPrincipal: number;
  totalContributions: number;
  totalPrincipalInvested: number;
  totalInterestEarned: number;
  finalBalance: number;
  interestSharePercent: number;
  growthMultiplier: number;
  yearlySchedule: CompoundGrowthYear[];
}

export function calculateBatch4CompoundInterest(
  input: Batch4CompoundInterestInput
): Batch4CompoundInterestResult {
  const principal = Math.max(0, Number(input.principal) || 0);
  const contribution = Math.max(0, Number(input.regularContribution) || 0);
  const ratePct = Math.max(0, Number(input.annualInterestRate) || 0);
  const r = ratePct / 100;
  const years = Math.max(1, Math.min(100, Math.floor(Number(input.years) || 1)));

  let n = 12; // Compounding frequency per year
  if (input.compoundingFrequency === 'daily') n = 365;
  else if (input.compoundingFrequency === 'quarterly') n = 4;
  else if (input.compoundingFrequency === 'annually') n = 1;

  // Monthly timeline simulation for accurate deposits & compounding
  const totalMonths = years * 12;
  const monthlyRate = Math.pow(1 + r / n, n / 12) - 1;

  let currentBalance = principal;
  let totalDeposited = principal;
  const yearlySchedule: CompoundGrowthYear[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    // Interest on balance
    const interest = currentBalance * monthlyRate;
    currentBalance += interest;

    // Contribution addition
    if (input.contributionFrequency === 'monthly') {
      currentBalance += contribution;
      totalDeposited += contribution;
    } else if (input.contributionFrequency === 'annually' && m % 12 === 0) {
      currentBalance += contribution;
      totalDeposited += contribution;
    }

    if (m % 12 === 0 || m === totalMonths) {
      const yearNumber = Math.ceil(m / 12);
      const interestSoFar = Math.max(0, currentBalance - totalDeposited);
      yearlySchedule.push({
        year: yearNumber,
        principalContributed: totalDeposited,
        interestEarnedTotal: interestSoFar,
        endBalance: currentBalance,
      });
    }
  }

  const totalContributions = totalDeposited - principal;
  const totalInterestEarned = Math.max(0, currentBalance - totalDeposited);
  const interestSharePercent = currentBalance > 0 ? (totalInterestEarned / currentBalance) * 100 : 0;
  const growthMultiplier = totalDeposited > 0 ? currentBalance / totalDeposited : 1;

  return {
    initialPrincipal: principal,
    totalContributions,
    totalPrincipalInvested: totalDeposited,
    totalInterestEarned,
    finalBalance: currentBalance,
    interestSharePercent,
    growthMultiplier,
    yearlySchedule,
  };
}
