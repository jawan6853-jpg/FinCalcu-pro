/**
 * Simple Interest Calculator Engine
 * Formula: Interest = Principal × Rate × Time
 * Calculates: Total Interest, Final Amount, Daily/Monthly Accrual, and Total Return %
 */

export interface SimpleInterestInput {
  principal: number; // Initial capital amount ($)
  annualRate: number; // Annual interest rate (%)
  time: number; // Duration value
  timeUnit: 'years' | 'months' | 'days'; // Duration unit
}

export interface SimpleInterestResult {
  principal: number;
  annualRate: number;
  timeInYears: number;
  totalInterest: number;
  finalAmount: number;
  totalReturnPercent: number;
  monthlyInterest: number;
  dailyInterest: number;
}

export function calculateSimpleInterest(input: SimpleInterestInput): SimpleInterestResult {
  const principal = Math.max(0, Number(input.principal) || 0);
  const rate = Math.max(0, Number(input.annualRate) || 0);
  const timeRaw = Math.max(0, Number(input.time) || 0);

  let timeInYears = timeRaw;
  if (input.timeUnit === 'months') {
    timeInYears = timeRaw / 12;
  } else if (input.timeUnit === 'days') {
    timeInYears = timeRaw / 365;
  }

  // Formula: I = P * r * t
  const totalInterest = principal * (rate / 100) * timeInYears;
  const finalAmount = principal + totalInterest;
  const totalReturnPercent = principal > 0 ? (totalInterest / principal) * 100 : 0;

  // Annualized rate accruals
  const annualInterest = principal * (rate / 100);
  const monthlyInterest = annualInterest / 12;
  const dailyInterest = annualInterest / 365;

  return {
    principal,
    annualRate: rate,
    timeInYears,
    totalInterest,
    finalAmount,
    totalReturnPercent,
    monthlyInterest,
    dailyInterest,
  };
}
