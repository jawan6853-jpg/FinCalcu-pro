import { sanitizeNumber } from '../formatters';

export type CompoundingInterval =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'semi-annually'
  | 'annually'
  | 'continuously';

export interface ApyAprInput {
  conversionMode: 'apr-to-apy' | 'apy-to-apr';
  ratePercent: number;
  compoundingFrequency: CompoundingInterval;
  investmentAmount?: number;
  investmentPeriodYears?: number;
}

export interface FrequencyComparisonRow {
  frequencyName: string;
  periodsPerYear: number | string;
  apy: number;
  annualInterestEarned: number;
}

export interface ApyAprResult {
  convertedRatePercent: number; // Converted APY or APR
  nominalRatePercent: number;
  effectiveYieldBoost: number; // APY - APR difference
  endingBalance: number;
  totalInterestEarned: number;
  comparisonTable: FrequencyComparisonRow[];
  isValid: boolean;
}

export function getPeriodsPerYear(freq: CompoundingInterval): number {
  switch (freq) {
    case 'daily':
      return 365;
    case 'weekly':
      return 52;
    case 'monthly':
      return 12;
    case 'quarterly':
      return 4;
    case 'semi-annually':
      return 2;
    case 'annually':
      return 1;
    case 'continuously':
      return 100000; // approximation for e^r
    default:
      return 12;
  }
}

export function calculateApyApr(input: ApyAprInput): ApyAprResult {
  const mode = input.conversionMode || 'apr-to-apy';
  const rate = Math.max(0, sanitizeNumber(input.ratePercent));
  const freq = input.compoundingFrequency || 'daily';
  const principal = Math.max(0, sanitizeNumber(input.investmentAmount, 10000));
  const years = Math.max(0.1, Math.min(50, sanitizeNumber(input.investmentPeriodYears, 1)));

  const n = getPeriodsPerYear(freq);
  const rDecimal = rate / 100;

  let convertedRate = 0;
  let apr = 0;
  let apy = 0;

  if (mode === 'apr-to-apy') {
    apr = rate;
    // APY = (1 + APR/n)^n - 1
    if (freq === 'continuously') {
      const apyDecimal = Math.exp(rDecimal) - 1;
      apy = apyDecimal * 100;
    } else {
      const apyDecimal = Math.pow(1 + rDecimal / n, n) - 1;
      apy = apyDecimal * 100;
    }
    convertedRate = apy;
  } else {
    // APY to APR: APR = n * ((1 + APY)^(1/n) - 1)
    apy = rate;
    if (freq === 'continuously') {
      const aprDecimal = Math.log(1 + rDecimal);
      apr = aprDecimal * 100;
    } else {
      const aprDecimal = n * (Math.pow(1 + rDecimal, 1 / n) - 1);
      apr = aprDecimal * 100;
    }
    convertedRate = apr;
  }

  const effectiveYieldBoost = Math.max(0, apy - apr);

  // Future balance based on the effective APY: Balance = P * (1 + APY)^t
  const apyDec = apy / 100;
  const endingBalance = principal * Math.pow(1 + apyDec, years);
  const totalInterestEarned = Math.max(0, endingBalance - principal);

  // Generate comparison across all standard compounding frequencies
  const frequencies: { name: string; key: CompoundingInterval }[] = [
    { name: 'Annually', key: 'annually' },
    { name: 'Semi-Annually', key: 'semi-annually' },
    { name: 'Quarterly', key: 'quarterly' },
    { name: 'Monthly', key: 'monthly' },
    { name: 'Weekly', key: 'weekly' },
    { name: 'Daily (Crypto DeFi / Staking)', key: 'daily' },
    { name: 'Continuously', key: 'continuously' },
  ];

  const baseAprDec = apr / 100;
  const comparisonTable: FrequencyComparisonRow[] = frequencies.map((f) => {
    const pCount = getPeriodsPerYear(f.key);
    let compApy = 0;
    if (f.key === 'continuously') {
      compApy = (Math.exp(baseAprDec) - 1) * 100;
    } else {
      compApy = (Math.pow(1 + baseAprDec / pCount, pCount) - 1) * 100;
    }
    const interest = principal * (compApy / 100);
    return {
      frequencyName: f.name,
      periodsPerYear: f.key === 'continuously' ? '∞' : pCount,
      apy: Math.round(compApy * 1000) / 1000,
      annualInterestEarned: Math.round(interest * 100) / 100,
    };
  });

  return {
    convertedRatePercent: Math.round(convertedRate * 1000) / 1000,
    nominalRatePercent: Math.round(rate * 1000) / 1000,
    effectiveYieldBoost: Math.round(effectiveYieldBoost * 1000) / 1000,
    endingBalance: Math.round(endingBalance * 100) / 100,
    totalInterestEarned: Math.round(totalInterestEarned * 100) / 100,
    comparisonTable,
    isValid: true,
  };
}
