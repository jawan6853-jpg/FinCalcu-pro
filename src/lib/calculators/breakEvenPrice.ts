import { sanitizeNumber } from '../formatters';

export interface BreakEvenPriceInput {
  direction: 'long' | 'short';
  entryPrice: number;
  quantity: number;
  entryFeeRate: number; // percentage, e.g. 0.1%
  exitFeeRate: number; // percentage, e.g. 0.1%
}

export interface BreakEvenPriceResult {
  breakEvenPrice: number;
  priceDifference: number; // in $
  percentageMoveNeeded: number; // in %
  totalCostAtEntry: number;
  entryFeeAmount: number;
  estimatedExitFeeAmount: number;
  totalRoundtripFees: number;
  isValid: boolean;
}

export function calculateBreakEvenPrice(input: BreakEvenPriceInput): BreakEvenPriceResult {
  const direction = input.direction || 'long';
  const entryPrice = Math.max(0, sanitizeNumber(input.entryPrice));
  const quantity = Math.max(0, sanitizeNumber(input.quantity, 1));
  const entryFeeRate = Math.max(0, Math.min(50, sanitizeNumber(input.entryFeeRate, 0.1))) / 100;
  const exitFeeRate = Math.max(0, Math.min(50, sanitizeNumber(input.exitFeeRate, 0.1))) / 100;

  if (entryPrice === 0 || quantity === 0) {
    return {
      breakEvenPrice: 0,
      priceDifference: 0,
      percentageMoveNeeded: 0,
      totalCostAtEntry: 0,
      entryFeeAmount: 0,
      estimatedExitFeeAmount: 0,
      totalRoundtripFees: 0,
      isValid: false,
    };
  }

  const grossCost = entryPrice * quantity;
  const entryFeeAmount = grossCost * entryFeeRate;
  const totalCostAtEntry = grossCost + entryFeeAmount;

  // Formula for Break-Even:
  // For Long:
  // Net Exit Proceeds = BreakEvenPrice * Quantity * (1 - ExitFeeRate)
  // At Break-Even: Net Exit Proceeds = Total Cost At Entry
  // BreakEvenPrice = (EntryPrice * (1 + EntryFeeRate)) / (1 - ExitFeeRate)
  //
  // For Short:
  // BreakEvenPrice = (EntryPrice * (1 - EntryFeeRate)) / (1 + ExitFeeRate)
  let breakEvenPrice = entryPrice;
  if (direction === 'long') {
    const denom = 1 - exitFeeRate;
    breakEvenPrice = denom > 0 ? (entryPrice * (1 + entryFeeRate)) / denom : entryPrice;
  } else {
    const denom = 1 + exitFeeRate;
    breakEvenPrice = denom > 0 ? (entryPrice * (1 - entryFeeRate)) / denom : entryPrice;
  }

  const estimatedExitFeeAmount = breakEvenPrice * quantity * exitFeeRate;
  const totalRoundtripFees = entryFeeAmount + estimatedExitFeeAmount;
  const priceDifference = Math.abs(breakEvenPrice - entryPrice);
  const percentageMoveNeeded =
    entryPrice > 0 ? (priceDifference / entryPrice) * 100 : 0;

  return {
    breakEvenPrice: Math.round(breakEvenPrice * 100) / 100,
    priceDifference: Math.round(priceDifference * 100) / 100,
    percentageMoveNeeded: Math.round(percentageMoveNeeded * 1000) / 1000,
    totalCostAtEntry: Math.round(totalCostAtEntry * 100) / 100,
    entryFeeAmount: Math.round(entryFeeAmount * 100) / 100,
    estimatedExitFeeAmount: Math.round(estimatedExitFeeAmount * 100) / 100,
    totalRoundtripFees: Math.round(totalRoundtripFees * 100) / 100,
    isValid: true,
  };
}
