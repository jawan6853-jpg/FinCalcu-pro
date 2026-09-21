import { sanitizeNumber } from '../formatters';

export interface CryptoPositionSizeInput {
  accountBalance: number;
  riskPercentage: number;
  entryPrice: number;
  stopLossPrice: number;
}

export interface CryptoPositionSizeResult {
  riskAmount: number;
  priceRiskPerUnit: number;
  positionSizeUnits: number;
  positionSizeValue: number;
  riskReward1to2Target: number;
  riskReward1to3Target: number;
  isValidStopLoss: boolean;
  errorMessage?: string;
}

export function calculateCryptoPositionSize(input: CryptoPositionSizeInput): CryptoPositionSizeResult {
  const accountBalance = Math.max(0, sanitizeNumber(input.accountBalance));
  const riskPercentage = Math.max(0, Math.min(100, sanitizeNumber(input.riskPercentage)));
  const entryPrice = Math.max(0, sanitizeNumber(input.entryPrice));
  const stopLossPrice = Math.max(0, sanitizeNumber(input.stopLossPrice));

  const riskAmount = accountBalance * (riskPercentage / 100);
  const priceRiskPerUnit = Math.abs(entryPrice - stopLossPrice);

  let positionSizeUnits = 0;
  let positionSizeValue = 0;
  let isValidStopLoss = priceRiskPerUnit > 0 && entryPrice > 0;
  let errorMessage: string | undefined;

  if (entryPrice <= 0) {
    isValidStopLoss = false;
    errorMessage = 'Entry price must be greater than 0';
  } else if (stopLossPrice <= 0) {
    isValidStopLoss = false;
    errorMessage = 'Stop-loss price must be greater than 0';
  } else if (priceRiskPerUnit === 0) {
    isValidStopLoss = false;
    errorMessage = 'Stop-loss cannot equal entry price';
  } else {
    positionSizeUnits = riskAmount / priceRiskPerUnit;
    positionSizeValue = positionSizeUnits * entryPrice;
  }

  // Targets based on direction
  const isLong = entryPrice >= stopLossPrice;
  const target1to2 = isLong
    ? entryPrice + priceRiskPerUnit * 2
    : Math.max(0, entryPrice - priceRiskPerUnit * 2);
  const target1to3 = isLong
    ? entryPrice + priceRiskPerUnit * 3
    : Math.max(0, entryPrice - priceRiskPerUnit * 3);

  return {
    riskAmount,
    priceRiskPerUnit,
    positionSizeUnits,
    positionSizeValue,
    riskReward1to2Target: target1to2,
    riskReward1to3Target: target1to3,
    isValidStopLoss,
    errorMessage,
  };
}
