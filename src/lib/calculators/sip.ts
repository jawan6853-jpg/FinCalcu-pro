import { sanitizeNumber } from '../formatters';

export interface SIPInput {
  monthlyInvestment: number;
  expectedAnnualReturn: number; // percentage
  tenureYears: number;
}

export interface SIPYearPoint {
  year: number;
  investedAmount: number;
  estimatedReturns: number;
  totalMaturityValue: number;
}

export interface SIPResult {
  monthlyInvestment: number;
  totalInvested: number;
  estimatedReturns: number;
  totalMaturityValue: number;
  wealthGainRatio: number;
  schedule: SIPYearPoint[];
}

export function calculateSIP(input: SIPInput): SIPResult {
  const p = Math.max(0, sanitizeNumber(input.monthlyInvestment));
  const rate = Math.max(0, sanitizeNumber(input.expectedAnnualReturn)) / 100;
  const years = Math.max(1, Math.min(50, Math.floor(sanitizeNumber(input.tenureYears))));

  const totalMonths = years * 12;
  const i = rate / 12; // monthly rate

  let totalMaturityValue = 0;
  if (i === 0) {
    totalMaturityValue = p * totalMonths;
  } else {
    // M = P * [ ((1 + i)^n - 1) / i ] * (1 + i)
    totalMaturityValue = p * ((Math.pow(1 + i, totalMonths) - 1) / i) * (1 + i);
  }

  const totalInvested = p * totalMonths;
  const estimatedReturns = Math.max(0, totalMaturityValue - totalInvested);
  const wealthGainRatio = totalInvested > 0 ? (estimatedReturns / totalInvested) * 100 : 0;

  // Yearly progress schedule
  const schedule: SIPYearPoint[] = [];
  for (let yr = 1; yr <= years; yr++) {
    const n = yr * 12;
    let val = 0;
    if (i === 0) {
      val = p * n;
    } else {
      val = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    }
    const inv = p * n;
    schedule.push({
      year: yr,
      investedAmount: inv,
      estimatedReturns: Math.max(0, val - inv),
      totalMaturityValue: val,
    });
  }

  return {
    monthlyInvestment: p,
    totalInvested,
    estimatedReturns,
    totalMaturityValue,
    wealthGainRatio,
    schedule,
  };
}
