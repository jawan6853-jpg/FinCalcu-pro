import { sanitizeNumber } from '../formatters';

export interface InvestmentReturnInput {
  initialInvestment: number;
  monthlyContribution: number;
  expectedAnnualReturn: number; // percentage
  years: number;
}

export interface InvestmentReturnResult {
  initialInvestment: number;
  totalContributions: number;
  totalInvested: number;
  futureValue: number;
  totalGain: number;
  totalRoiPercentage: number;
  annualizedCagr: number;
  schedule: { year: number; invested: number; totalValue: number; gain: number }[];
}

export function calculateInvestmentReturn(input: InvestmentReturnInput): InvestmentReturnResult {
  const initial = Math.max(0, sanitizeNumber(input.initialInvestment));
  const monthly = Math.max(0, sanitizeNumber(input.monthlyContribution));
  const annualRate = Math.max(-99, sanitizeNumber(input.expectedAnnualReturn)) / 100;
  const years = Math.max(0.5, Math.min(50, sanitizeNumber(input.years)));

  const totalMonths = Math.round(years * 12);
  const monthlyRate = annualRate / 12;

  let balance = initial;
  let totalInvested = initial;
  const schedule = [];

  const wholeYears = Math.floor(years);
  for (let m = 1; m <= totalMonths; m++) {
    balance += balance * monthlyRate;
    balance += monthly;
    totalInvested += monthly;

    if (m % 12 === 0) {
      const yr = m / 12;
      schedule.push({
        year: yr,
        invested: totalInvested,
        totalValue: balance,
        gain: Math.max(0, balance - totalInvested),
      });
    }
  }

  const futureValue = balance;
  const totalContributions = totalInvested - initial;
  const totalGain = futureValue - totalInvested;
  const totalRoiPercentage = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  // CAGR = (EV / BV)^(1/n) - 1 (based on initial if no contributions, or approximated)
  const annualizedCagr =
    years > 0 && totalInvested > 0 && futureValue > 0
      ? (Math.pow(futureValue / totalInvested, 1 / years) - 1) * 100
      : annualRate * 100;

  return {
    initialInvestment: initial,
    totalContributions,
    totalInvested,
    futureValue,
    totalGain,
    totalRoiPercentage,
    annualizedCagr,
    schedule,
  };
}
