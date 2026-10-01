import { sanitizeNumber } from '../formatters';

export interface TakeProfitInput {
  direction: 'long' | 'short';
  entryPrice: number;
  stopLossPrice: number;
  desiredRiskRewardRatio: number; // e.g. 2.0
  positionQuantity?: number;
}

export interface TakeProfitTarget {
  label: string;
  ratio: number;
  targetPrice: number;
  profitPerUnit: number;
  profitPercent: number;
}

export interface TakeProfitResult {
  takeProfitPrice: number;
  riskPerUnit: number;
  riskPercent: number;
  rewardPerUnit: number;
  rewardPercent: number;
  totalProjectedProfit: number;
  totalProjectedRisk: number;
  targetLadder: TakeProfitTarget[];
  isValid: boolean;
  errorMessage?: string;
}

export function calculateTakeProfit(input: TakeProfitInput): TakeProfitResult {
  const direction = input.direction || 'long';
  const entry = Math.max(0, sanitizeNumber(input.entryPrice));
  const stopLoss = Math.max(0, sanitizeNumber(input.stopLossPrice));
  const desiredRatio = Math.max(0.1, Math.min(100, sanitizeNumber(input.desiredRiskRewardRatio, 2)));
  const quantity = Math.max(0, sanitizeNumber(input.positionQuantity, 0));

  if (entry === 0 || stopLoss === 0) {
    return {
      takeProfitPrice: 0,
      riskPerUnit: 0,
      riskPercent: 0,
      rewardPerUnit: 0,
      rewardPercent: 0,
      totalProjectedProfit: 0,
      totalProjectedRisk: 0,
      targetLadder: [],
      isValid: false,
      errorMessage: 'Entry price and stop loss price must be greater than zero.',
    };
  }

  const riskPerUnit = Math.abs(entry - stopLoss);
  if (riskPerUnit === 0) {
    return {
      takeProfitPrice: 0,
      riskPerUnit: 0,
      riskPercent: 0,
      rewardPerUnit: 0,
      rewardPercent: 0,
      totalProjectedProfit: 0,
      totalProjectedRisk: 0,
      targetLadder: [],
      isValid: false,
      errorMessage: 'Stop loss price cannot be identical to entry price.',
    };
  }

  // Calculate target price:
  // For Long: TP = Entry + (Risk * Ratio)
  // For Short: TP = Entry - (Risk * Ratio)
  let takeProfitPrice = 0;
  if (direction === 'long') {
    takeProfitPrice = entry + riskPerUnit * desiredRatio;
  } else {
    takeProfitPrice = Math.max(0, entry - riskPerUnit * desiredRatio);
  }

  const rewardPerUnit = Math.abs(takeProfitPrice - entry);
  const riskPercent = (riskPerUnit / entry) * 100;
  const rewardPercent = (rewardPerUnit / entry) * 100;

  const totalProjectedRisk = quantity > 0 ? riskPerUnit * quantity : 0;
  const totalProjectedProfit = quantity > 0 ? rewardPerUnit * quantity : 0;

  // Build standard multi-target ladder (TP1 at 1:1, TP2 at 1:1.5, TP3 at 1:2, TP4 at 1:3)
  const ratios = [1.0, 1.5, 2.0, 2.5, 3.0];
  const targetLadder: TakeProfitTarget[] = ratios.map((r, idx) => {
    const tPrice =
      direction === 'long'
        ? entry + riskPerUnit * r
        : Math.max(0, entry - riskPerUnit * r);
    const pUnit = Math.abs(tPrice - entry);
    return {
      label: `TP ${idx + 1} (1:${r.toFixed(1)})`,
      ratio: r,
      targetPrice: Math.round(tPrice * 100) / 100,
      profitPerUnit: Math.round(pUnit * 100) / 100,
      profitPercent: Math.round((pUnit / entry) * 10000) / 100,
    };
  });

  return {
    takeProfitPrice: Math.round(takeProfitPrice * 100) / 100,
    riskPerUnit: Math.round(riskPerUnit * 100) / 100,
    riskPercent: Math.round(riskPercent * 100) / 100,
    rewardPerUnit: Math.round(rewardPerUnit * 100) / 100,
    rewardPercent: Math.round(rewardPercent * 100) / 100,
    totalProjectedProfit: Math.round(totalProjectedProfit * 100) / 100,
    totalProjectedRisk: Math.round(totalProjectedRisk * 100) / 100,
    targetLadder,
    isValid: true,
  };
}
