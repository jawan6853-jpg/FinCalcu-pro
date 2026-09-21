import { sanitizeNumber } from '../formatters';

export type CompoundingFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface CryptoStakingInput {
  principal: number;
  rate: number; // percentage (e.g. 8.5)
  durationDays: number;
  compoundingFrequency: CompoundingFrequency;
}

export interface CryptoStakingResult {
  principal: number;
  totalReward: number;
  finalBalance: number;
  dailyReward: number;
  monthlyReward: number;
  effectiveApy: number;
}

export function calculateCryptoStaking(input: CryptoStakingInput): CryptoStakingResult {
  const principal = Math.max(0, sanitizeNumber(input.principal));
  const rate = Math.max(0, sanitizeNumber(input.rate)) / 100;
  const days = Math.max(1, sanitizeNumber(input.durationDays));
  const years = days / 365;

  let finalBalance = principal;
  let totalReward = 0;

  if (input.compoundingFrequency === 'none') {
    totalReward = principal * rate * years;
    finalBalance = principal + totalReward;
  } else {
    let n = 365; // daily
    if (input.compoundingFrequency === 'weekly') n = 52;
    if (input.compoundingFrequency === 'monthly') n = 12;
    if (input.compoundingFrequency === 'yearly') n = 1;

    // A = P(1 + r/n)^(n*t)
    finalBalance = principal * Math.pow(1 + rate / n, n * years);
    totalReward = finalBalance - principal;
  }

  const dailyReward = days > 0 ? totalReward / days : 0;
  const monthlyReward = dailyReward * 30.416;
  const effectiveApy =
    principal > 0 && years > 0 ? (Math.pow(finalBalance / principal, 1 / years) - 1) * 100 : rate * 100;

  return {
    principal,
    totalReward,
    finalBalance,
    dailyReward,
    monthlyReward,
    effectiveApy,
  };
}
