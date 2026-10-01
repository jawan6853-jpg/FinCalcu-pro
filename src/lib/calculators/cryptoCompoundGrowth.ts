/**
 * Crypto Compound Interest & Growth Calculator Engine
 * Calculates: Long-term compounding growth for cryptocurrency portfolios, staking rewards, and regular crypto accumulation
 */

export type CryptoCompoundingInterval = 'daily' | 'weekly' | 'monthly' | 'annually';

export interface CryptoCompoundGrowthInput {
  initialCryptoAmount: number; // Starting crypto tokens or fiat equivalent
  regularContribution: number; // Recurring contribution per period
  contributionFrequency?: 'monthly' | 'weekly'; // Cadence
  annualYieldPercent: number; // Staking APY or expected growth rate %
  compoundingFrequency: CryptoCompoundingInterval; // Compounding interval
  investmentPeriodYears: number; // Duration in years
}

export interface CryptoCompoundGrowthResult {
  futurePortfolioValue: number;
  totalPrincipalContributed: number;
  totalCompoundedEarnings: number;
  growthMultiplier: number;
  effectiveApyPercent: number;
  yearlySchedule: {
    year: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
  disclaimer: string;
}

const FREQ_MAP: Record<CryptoCompoundingInterval, number> = {
  daily: 365,
  weekly: 52,
  monthly: 12,
  annually: 1,
};

export function calculateCryptoCompoundGrowth(
  input: CryptoCompoundGrowthInput
): CryptoCompoundGrowthResult {
  const initial = Math.max(0, Number(input.initialCryptoAmount) || 0);
  const contribution = Math.max(0, Number(input.regularContribution) || 0);
  const annualRate = Math.max(0, Number(input.annualYieldPercent) || 0) / 100;
  const years = Math.max(0.1, Math.min(50, Number(input.investmentPeriodYears) || 5));
  const compInterval = input.compoundingFrequency || 'daily';
  const contFreq = input.contributionFrequency || 'monthly';

  const m = FREQ_MAP[compInterval] || 365;
  const contribPerYear = contFreq === 'weekly' ? 52 : 12;

  // Effective APY: (1 + r/m)^m - 1
  const effectiveApy = Math.pow(1 + annualRate / m, m) - 1;

  let currentBalance = initial;
  let totalContributed = initial;
  const yearlySchedule: CryptoCompoundGrowthResult['yearlySchedule'] = [];

  const periodsPerYear = contribPerYear;
  const periodicReturn = Math.pow(1 + effectiveApy, 1 / periodsPerYear) - 1;

  for (let yr = 1; yr <= Math.ceil(years); yr++) {
    let yrInterest = 0;
    for (let p = 1; p <= periodsPerYear; p++) {
      const interest = currentBalance * periodicReturn;
      currentBalance += interest + contribution;
      yrInterest += interest;
      totalContributed += contribution;
    }

    yearlySchedule.push({
      year: yr,
      principal: Math.round(totalContributed * 100) / 100,
      interest: Math.round(yrInterest * 100) / 100,
      balance: Math.round(currentBalance * 100) / 100,
    });
  }

  const futurePortfolioValue = currentBalance;
  const totalCompoundedEarnings = Math.max(0, futurePortfolioValue - totalContributed);
  const growthMultiplier = totalContributed > 0 ? futurePortfolioValue / totalContributed : 1;

  return {
    futurePortfolioValue: Math.round(futurePortfolioValue * 100) / 100,
    totalPrincipalContributed: Math.round(totalContributed * 100) / 100,
    totalCompoundedEarnings: Math.round(totalCompoundedEarnings * 100) / 100,
    growthMultiplier: Math.round(growthMultiplier * 100) / 100,
    effectiveApyPercent: Math.round(effectiveApy * 10000) / 100,
    yearlySchedule,
    disclaimer: 'Estimated calculation based on constant staking APY and fixed contribution schedules. Crypto token yields, token prices, and validator slashing risks vary continuously.',
  };
}
