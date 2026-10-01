import { sanitizeNumber } from '../formatters';

export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturnRate: number; // expected % return
  inflationRate: number; // expected % inflation
  annualWithdrawal?: number; // optional desired annual spending in retirement
}

export interface RetirementYearPoint {
  age: number;
  year: number;
  nominalSavings: number;
  realSavings: number; // inflation-adjusted
  totalContributions: number;
  totalInterestEarned: number;
}

export interface RetirementResult {
  yearsToRetire: number;
  totalSavingsNominal: number;
  totalSavingsReal: number; // in today's purchasing power
  totalPrincipalContributed: number;
  totalInterestEarned: number;
  monthlyRetirementIncome4Percent: number; // safe 4% rule
  monthlyRetirementIncomeReal: number;
  schedule: RetirementYearPoint[];
}

export function calculateRetirement(input: RetirementInput): RetirementResult {
  const currentAge = Math.max(16, Math.min(100, Math.floor(sanitizeNumber(input.currentAge, 30))));
  const retirementAge = Math.max(currentAge + 1, Math.min(100, Math.floor(sanitizeNumber(input.retirementAge, 65))));
  const currentSavings = Math.max(0, sanitizeNumber(input.currentSavings, 25000));
  const monthlyContribution = Math.max(0, sanitizeNumber(input.monthlyContribution, 500));
  const annualReturnRate = Math.max(0, Math.min(100, sanitizeNumber(input.annualReturnRate, 8))) / 100;
  const inflationRate = Math.max(0, Math.min(100, sanitizeNumber(input.inflationRate, 2.5))) / 100;

  const yearsToRetire = retirementAge - currentAge;
  const monthlyReturn = annualReturnRate / 12;

  let balance = currentSavings;
  let totalContributed = currentSavings;
  const schedule: RetirementYearPoint[] = [];

  schedule.push({
    age: currentAge,
    year: 0,
    nominalSavings: Math.round(balance),
    realSavings: Math.round(balance),
    totalContributions: Math.round(totalContributed),
    totalInterestEarned: 0,
  });

  for (let y = 1; y <= yearsToRetire; y++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyReturn) + monthlyContribution;
      totalContributed += monthlyContribution;
    }

    const inflationFactor = Math.pow(1 + inflationRate, y);
    const realBalance = inflationFactor > 0 ? balance / inflationFactor : balance;
    const interestEarned = Math.max(0, balance - totalContributed);

    schedule.push({
      age: currentAge + y,
      year: y,
      nominalSavings: Math.round(balance * 100) / 100,
      realSavings: Math.round(realBalance * 100) / 100,
      totalContributions: Math.round(totalContributed * 100) / 100,
      totalInterestEarned: Math.round(interestEarned * 100) / 100,
    });
  }

  const finalNominal = schedule[schedule.length - 1].nominalSavings;
  const finalReal = schedule[schedule.length - 1].realSavings;
  const totalPrincipal = schedule[schedule.length - 1].totalContributions;
  const totalInterest = schedule[schedule.length - 1].totalInterestEarned;

  // Safe Withdrawal Rate: 4% annual rule
  const monthlyIncomeNominal = (finalNominal * 0.04) / 12;
  const monthlyIncomeReal = (finalReal * 0.04) / 12;

  return {
    yearsToRetire,
    totalSavingsNominal: Math.round(finalNominal * 100) / 100,
    totalSavingsReal: Math.round(finalReal * 100) / 100,
    totalPrincipalContributed: Math.round(totalPrincipal * 100) / 100,
    totalInterestEarned: Math.round(totalInterest * 100) / 100,
    monthlyRetirementIncome4Percent: Math.round(monthlyIncomeNominal * 100) / 100,
    monthlyRetirementIncomeReal: Math.round(monthlyIncomeReal * 100) / 100,
    schedule,
  };
}
