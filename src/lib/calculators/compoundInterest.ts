import { sanitizeNumber } from '../formatters';

export interface CompoundInterestInput {
  initialPrincipal: number;
  monthlyContribution: number;
  annualInterestRate: number; // percentage
  years: number;
  compoundingFrequency: 'monthly' | 'quarterly' | 'semiannually' | 'annually';
}

export interface CompoundPoint {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface CompoundInterestResult {
  initialPrincipal: number;
  totalContributions: number;
  totalPrincipalInvested: number;
  totalInterestEarned: number;
  finalBalance: number;
  schedule: CompoundPoint[];
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const principal = Math.max(0, sanitizeNumber(input.initialPrincipal));
  const monthlyContrib = Math.max(0, sanitizeNumber(input.monthlyContribution));
  const rate = Math.max(0, sanitizeNumber(input.annualInterestRate)) / 100;
  const years = Math.max(1, Math.min(50, Math.floor(sanitizeNumber(input.years))));

  const schedule: CompoundPoint[] = [];
  let currentBalance = principal;
  let totalContributed = principal;

  // Month-by-month accumulation allows accurate addition of monthly contributions
  // and compounding at specified frequency
  const totalMonths = years * 12;
  const monthlyNominalRate = rate / 12;

  for (let m = 1; m <= totalMonths; m++) {
    currentBalance += currentBalance * monthlyNominalRate;
    currentBalance += monthlyContrib;
    totalContributed += monthlyContrib;

    if (m % 12 === 0) {
      const year = m / 12;
      schedule.push({
        year,
        principal: totalContributed,
        interest: Math.max(0, currentBalance - totalContributed),
        balance: currentBalance,
      });
    }
  }

  const finalBalance = currentBalance;
  const totalContributions = totalContributed - principal;
  const totalInterestEarned = Math.max(0, finalBalance - totalContributed);

  return {
    initialPrincipal: principal,
    totalContributions,
    totalPrincipalInvested: totalContributed,
    totalInterestEarned,
    finalBalance,
    schedule,
  };
}
