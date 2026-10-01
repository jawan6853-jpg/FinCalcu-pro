import { sanitizeNumber } from '../formatters';

export interface RiskRewardInput {
  direction: 'long' | 'short';
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  positionQuantity?: number; // Optional units/coins
  capitalRisked?: number; // Optional account dollar risk
}

export interface RiskRewardResult {
  riskPerUnit: number;
  rewardPerUnit: number;
  riskRewardRatio: number; // Reward / Risk
  formattedRatio: string; // e.g. "1 : 2.50"
  riskPercent: number; // % move from entry
  rewardPercent: number; // % move from entry
  breakEvenWinRatePercent: number; // minimum win rate % needed
  totalMonetaryRisk: number;
  totalMonetaryReward: number;
  isValid: boolean;
  errorMessage?: string;
}

export function calculateRiskReward(input: RiskRewardInput): RiskRewardResult {
  const entry = Math.max(0, sanitizeNumber(input.entryPrice));
  const stopLoss = Math.max(0, sanitizeNumber(input.stopLossPrice));
  const takeProfit = Math.max(0, sanitizeNumber(input.takeProfitPrice));
  const quantity = Math.max(0, sanitizeNumber(input.positionQuantity, 0));
  const capitalRisked = Math.max(0, sanitizeNumber(input.capitalRisked, 0));

  if (entry === 0 || stopLoss === 0 || takeProfit === 0) {
    return {
      riskPerUnit: 0,
      rewardPerUnit: 0,
      riskRewardRatio: 0,
      formattedRatio: '1 : 0.00',
      riskPercent: 0,
      rewardPercent: 0,
      breakEvenWinRatePercent: 0,
      totalMonetaryRisk: 0,
      totalMonetaryReward: 0,
      isValid: false,
      errorMessage: 'Entry, Stop Loss, and Take Profit prices must be greater than zero.',
    };
  }

  // Formula as specified by user:
  // Risk = |Entry - Stop Loss|
  // Reward = |Take Profit - Entry|
  // Ratio = Reward / Risk
  const riskPerUnit = Math.abs(entry - stopLoss);
  const rewardPerUnit = Math.abs(takeProfit - entry);

  if (riskPerUnit === 0) {
    return {
      riskPerUnit: 0,
      rewardPerUnit: 0,
      riskRewardRatio: 0,
      formattedRatio: 'Invalid',
      riskPercent: 0,
      rewardPercent: 0,
      breakEvenWinRatePercent: 0,
      totalMonetaryRisk: 0,
      totalMonetaryReward: 0,
      isValid: false,
      errorMessage: 'Stop loss price cannot be identical to entry price (division by zero risk).',
    };
  }

  const riskRewardRatio = rewardPerUnit / riskPerUnit;
  const formattedRatio = `1 : ${riskRewardRatio.toFixed(2)}`;

  const riskPercent = (riskPerUnit / entry) * 100;
  const rewardPercent = (rewardPerUnit / entry) * 100;

  // Minimum required win rate: 1 / (1 + Ratio)
  const breakEvenWinRatePercent = (1 / (1 + riskRewardRatio)) * 100;

  // Total monetary calculations
  let totalMonetaryRisk = 0;
  let totalMonetaryReward = 0;

  if (quantity > 0) {
    totalMonetaryRisk = riskPerUnit * quantity;
    totalMonetaryReward = rewardPerUnit * quantity;
  } else if (capitalRisked > 0) {
    totalMonetaryRisk = capitalRisked;
    totalMonetaryReward = capitalRisked * riskRewardRatio;
  }

  return {
    riskPerUnit: Math.round(riskPerUnit * 100) / 100,
    rewardPerUnit: Math.round(rewardPerUnit * 100) / 100,
    riskRewardRatio: Math.round(riskRewardRatio * 100) / 100,
    formattedRatio,
    riskPercent: Math.round(riskPercent * 100) / 100,
    rewardPercent: Math.round(rewardPercent * 100) / 100,
    breakEvenWinRatePercent: Math.round(breakEvenWinRatePercent * 100) / 100,
    totalMonetaryRisk: Math.round(totalMonetaryRisk * 100) / 100,
    totalMonetaryReward: Math.round(totalMonetaryReward * 100) / 100,
    isValid: true,
  };
}
