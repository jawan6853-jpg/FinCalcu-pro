/**
 * Savings Goal Calculator Engine
 * Calculates: Required monthly savings or time required to reach a specific target savings goal
 */

export interface SavingsGoalInput {
  targetAmount: number; // Target nest egg / purchase amount ($)
  currentSavings?: number; // Initial starting balance ($)
  targetTimeYears?: number; // Desired target deadline in years (if calculating required monthly contribution)
  monthlyContribution?: number; // Optional: if user enters fixed monthly contribution to solve for time
  annualInterestRate?: number; // Annual yield / interest rate % (default: 4.5% for HYSA)
  calculationMode: 'solve-contribution' | 'solve-time'; // Solve for monthly deposit OR solve for months needed
}

export interface SavingsGoalResult {
  targetAmount: number;
  currentSavings: number;
  monthlyContributionRequired: number;
  totalTimeMonths: number;
  totalTimeYears: number;
  totalPrincipalContributed: number;
  totalInterestEarned: number;
  progressPercent: number;
  monthlySchedule: {
    month: number;
    contribution: number;
    interest: number;
    balance: number;
  }[];
}

export function calculateSavingsGoal(input: SavingsGoalInput): SavingsGoalResult {
  const target = Math.max(0, Number(input.targetAmount) || 0);
  const current = Math.max(0, Number(input.currentSavings) || 0);
  const annualRate = Math.max(0, Number(input.annualInterestRate) || 0);
  const r = annualRate / 100 / 12;
  const mode = input.calculationMode || 'solve-contribution';

  const progressPercent = target > 0 ? Math.min(100, (current / target) * 100) : 100;

  if (current >= target || target === 0) {
    return {
      targetAmount: target,
      currentSavings: current,
      monthlyContributionRequired: 0,
      totalTimeMonths: 0,
      totalTimeYears: 0,
      totalPrincipalContributed: current,
      totalInterestEarned: 0,
      progressPercent: 100,
      monthlySchedule: [],
    };
  }

  let monthlyContributionRequired = 0;
  let totalMonths = 0;

  if (mode === 'solve-contribution') {
    const years = Math.max(0.1, Number(input.targetTimeYears) || 3);
    totalMonths = Math.round(years * 12);

    // FV = PV*(1+r)^n + PMT * [((1+r)^n - 1) / r]
    // PMT = (FV - PV*(1+r)^n) * r / ((1+r)^n - 1)
    if (r === 0) {
      monthlyContributionRequired = Math.max(0, (target - current) / totalMonths);
    } else {
      const growthOfCurrent = current * Math.pow(1 + r, totalMonths);
      const remainingTarget = target - growthOfCurrent;
      if (remainingTarget <= 0) {
        monthlyContributionRequired = 0;
      } else {
        const annuityFactor = (Math.pow(1 + r, totalMonths) - 1) / r;
        monthlyContributionRequired = remainingTarget / annuityFactor;
      }
    }
  } else {
    // Solve for time
    monthlyContributionRequired = Math.max(1, Number(input.monthlyContribution) || 250);

    // Simulate months until target reached
    let balance = current;
    while (balance < target && totalMonths < 600) {
      totalMonths++;
      const interest = balance * r;
      balance += interest + monthlyContributionRequired;
    }
  }

  // Generate schedule
  const monthlySchedule: SavingsGoalResult['monthlySchedule'] = [];
  let balance = current;
  let totalPrincipal = current;
  let totalInterest = 0;

  for (let m = 1; m <= totalMonths; m++) {
    const interest = balance * r;
    totalInterest += interest;
    balance += interest + monthlyContributionRequired;
    totalPrincipal += monthlyContributionRequired;

    if (m <= 60 || m % 12 === 0 || m === totalMonths) {
      monthlySchedule.push({
        month: m,
        contribution: Math.round(monthlyContributionRequired * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        balance: Math.round(balance * 100) / 100,
      });
    }
  }

  return {
    targetAmount: Math.round(target * 100) / 100,
    currentSavings: Math.round(current * 100) / 100,
    monthlyContributionRequired: Math.round(monthlyContributionRequired * 100) / 100,
    totalTimeMonths: totalMonths,
    totalTimeYears: Math.round((totalMonths / 12) * 10) / 10,
    totalPrincipalContributed: Math.round(totalPrincipal * 100) / 100,
    totalInterestEarned: Math.round(totalInterest * 100) / 100,
    progressPercent: Math.round(progressPercent * 10) / 10,
    monthlySchedule,
  };
}
