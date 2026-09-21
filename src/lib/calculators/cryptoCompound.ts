import { sanitizeNumber } from '../formatters';

export interface CryptoCompoundInput {
  initialPrincipal: number;
  monthlyContribution: number;
  annualInterestRate: number; // percentage
  years: number;
  compoundingFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually';
}

export interface CompoundYearBreakdown {
  year: number;
  principalContributed: number;
  interestEarned: number;
  totalBalance: number;
}

export interface CryptoCompoundResult {
  futureValue: number;
  totalPrincipalContributed: number;
  totalInterestEarned: number;
  breakdown: CompoundYearBreakdown[];
}

export function calculateCryptoCompound(input: CryptoCompoundInput): CryptoCompoundResult {
  const principal = Math.max(0, sanitizeNumber(input.initialPrincipal));
  const monthlyContrib = Math.max(0, sanitizeNumber(input.monthlyContribution));
  const rate = Math.max(0, sanitizeNumber(input.annualInterestRate)) / 100;
  const years = Math.max(1, Math.min(50, Math.floor(sanitizeNumber(input.years))));

  let n = 12; // periods per year
  if (input.compoundingFrequency === 'daily') n = 365;
  if (input.compoundingFrequency === 'quarterly') n = 4;
  if (input.compoundingFrequency === 'annually') n = 1;

  const breakdown: CompoundYearBreakdown[] = [];
  let currentBalance = principal;
  let totalContributed = principal;

  // Month-by-month simulation for exact contribution & compounding handling
  const totalMonths = years * 12;
  const monthlyRate = rate / 12;

  for (let month = 1; month <= totalMonths; month++) {
    // apply interest
    currentBalance += currentBalance * monthlyRate;
    // add monthly contribution
    currentBalance += monthlyContrib;
    totalContributed += monthlyContrib;

    if (month % 12 === 0) {
      const yearNum = month / 12;
      breakdown.push({
        year: yearNum,
        principalContributed: totalContributed,
        interestEarned: Math.max(0, currentBalance - totalContributed),
        totalBalance: currentBalance,
      });
    }
  }

  const futureValue = currentBalance;
  const totalInterestEarned = Math.max(0, futureValue - totalContributed);

  return {
    futureValue,
    totalPrincipalContributed: totalContributed,
    totalInterestEarned,
    breakdown,
  };
}
