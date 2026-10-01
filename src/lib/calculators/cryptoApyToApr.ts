import { parseInput, safeDivision } from '../formatters';

export type CompoundingFrequency = 'daily' | 'weekly' | 'monthly' | 'continuous';

export interface CryptoApyToAprInput {
  conversionType: 'apyToApr' | 'aprToApy';
  ratePercent: number;
  compoundingFrequency?: CompoundingFrequency;
  stakedAmountUsd?: number;
}

export interface CryptoApyToAprResult {
  convertedRatePercent: number;
  annualRewardUsd: number;
  monthlyRewardUsd: number;
  dailyRewardUsd: number;
  compoundingFrequency: CompoundingFrequency;
  effectiveCompoundingBoostPercent: number;
}

export function calculateCryptoApyToApr(input: CryptoApyToAprInput): CryptoApyToAprResult {
  const type = input.conversionType || 'apyToApr';
  const rawRate = Math.max(0, parseInput(input.ratePercent, 12));
  const freq = input.compoundingFrequency || 'daily';
  const principal = Math.max(0, parseInput(input.stakedAmountUsd, 10000));

  let n = 365;
  if (freq === 'weekly') n = 52;
  else if (freq === 'monthly') n = 12;

  let convertedRate = 0;
  const rateDecimal = rawRate / 100;

  if (type === 'apyToApr') {
    // APR = n * ((1 + APY)^(1/n) - 1)
    if (freq === 'continuous') {
      convertedRate = Math.log(1 + rateDecimal) * 100;
    } else {
      convertedRate = n * (Math.pow(1 + rateDecimal, 1 / n) - 1) * 100;
    }
  } else {
    // APY = (1 + APR / n)^n - 1
    if (freq === 'continuous') {
      convertedRate = (Math.exp(rateDecimal) - 1) * 100;
    } else {
      convertedRate = (Math.pow(1 + rateDecimal / n, n) - 1) * 100;
    }
  }

  const effectiveApy = type === 'apyToApr' ? rawRate : convertedRate;
  const annualReward = principal * (effectiveApy / 100);
  const monthlyReward = annualReward / 12;
  const dailyReward = annualReward / 365;

  const boost = Math.abs(convertedRate - rawRate);

  return {
    convertedRatePercent: Number(convertedRate.toFixed(4)),
    annualRewardUsd: Number(annualReward.toFixed(2)),
    monthlyRewardUsd: Number(monthlyReward.toFixed(2)),
    dailyRewardUsd: Number(dailyReward.toFixed(2)),
    compoundingFrequency: freq,
    effectiveCompoundingBoostPercent: Number(boost.toFixed(4)),
  };
}
