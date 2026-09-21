import { sanitizeNumber } from '../formatters';

export interface SavingsInput {
  initialDeposit: number;
  monthlyDeposit: number;
  annualInterestRate: number; // percentage (e.g. 4.5% High Yield Savings)
  years: number;
}

export interface SavingsResult {
  initialDeposit: number;
  totalMonthlyDeposits: number;
  totalPrincipal: number;
  totalInterestEarned: number;
  finalSavingsBalance: number;
  schedule: { year: number; balance: number; interest: number; principal: number }[];
}

export function calculateSavings(input: SavingsInput): SavingsResult {
  const initial = Math.max(0, sanitizeNumber(input.initialDeposit));
  const monthly = Math.max(0, sanitizeNumber(input.monthlyDeposit));
  const rate = Math.max(0, sanitizeNumber(input.annualInterestRate)) / 100;
  const years = Math.max(0.25, Math.min(50, sanitizeNumber(input.years)));

  const totalMonths = Math.round(years * 12);
  const monthlyRate = rate / 12;

  let balance = initial;
  let principal = initial;
  const schedule = [];

  for (let m = 1; m <= totalMonths; m++) {
    balance += balance * monthlyRate;
    balance += monthly;
    principal += monthly;

    if (m % 12 === 0) {
      const yr = m / 12;
      schedule.push({
        year: yr,
        balance,
        interest: Math.max(0, balance - principal),
        principal,
      });
    }
  }

  const finalSavingsBalance = balance;
  const totalMonthlyDeposits = principal - initial;
  const totalInterestEarned = Math.max(0, finalSavingsBalance - principal);

  return {
    initialDeposit: initial,
    totalMonthlyDeposits,
    totalPrincipal: principal,
    totalInterestEarned,
    finalSavingsBalance,
    schedule,
  };
}
