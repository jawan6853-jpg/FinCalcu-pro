/**
 * Percentage Change Calculator Engine
 * Formula: ((New Value - Original Value) / Original Value) × 100
 * Calculates: Percent change, absolute difference, increase/decrease direction, multiplier factor
 */

export interface PercentageChangeInput {
  originalValue: number;
  newValue: number;
}

export interface PercentageChangeResult {
  originalValue: number;
  newValue: number;
  percentageChange: number;
  absoluteDifference: number;
  direction: 'increase' | 'decrease' | 'no-change';
  multiplierFactor: number;
  percentOfOriginal: number;
  reversePercentageNeeded: number; // What % change is required to go back from new to original
}

export function calculatePercentageChange(input: PercentageChangeInput): PercentageChangeResult {
  const original = Number(input.originalValue) || 0;
  const current = Number(input.newValue) || 0;

  const difference = current - original;
  const percentageChange = original !== 0 ? (difference / Math.abs(original)) * 100 : 0;

  let direction: 'increase' | 'decrease' | 'no-change' = 'no-change';
  if (difference > 0) direction = 'increase';
  else if (difference < 0) direction = 'decrease';

  const multiplierFactor = original !== 0 ? current / original : 0;
  const percentOfOriginal = original !== 0 ? (current / original) * 100 : 0;

  // Reverse percentage to return to original: ((original - current) / current) * 100
  const reversePercentageNeeded = current !== 0 ? ((original - current) / Math.abs(current)) * 100 : 0;

  return {
    originalValue: original,
    newValue: current,
    percentageChange,
    absoluteDifference: difference,
    direction,
    multiplierFactor,
    percentOfOriginal,
    reversePercentageNeeded,
  };
}
