import { sanitizeNumber } from '../formatters';

export interface InflationInput {
  currentAmount: number;
  inflationRate: number; // annual %
  years: number;
}

export interface InflationYearPoint {
  year: number;
  futureCost: number;
  purchasingPower: number;
  lossPercent: number;
}

export interface InflationResult {
  futureCost: number;
  purchasingPower: number;
  purchasingPowerLossPercent: number;
  totalCostIncrease: number;
  cumulativeInflationFactor: number;
  schedule: InflationYearPoint[];
}

export function calculateInflation(input: InflationInput): InflationResult {
  const currentAmount = Math.max(0, sanitizeNumber(input.currentAmount));
  const inflationRate = sanitizeNumber(input.inflationRate) / 100;
  const years = Math.max(0, Math.min(100, Math.floor(sanitizeNumber(input.years))));

  const inflationMultiplier = Math.pow(1 + inflationRate, years);
  const futureCost = currentAmount * inflationMultiplier;
  const purchasingPower = inflationMultiplier > 0 ? currentAmount / inflationMultiplier : 0;
  const totalCostIncrease = futureCost - currentAmount;
  const purchasingPowerLossPercent =
    currentAmount > 0 ? ((currentAmount - purchasingPower) / currentAmount) * 100 : 0;

  const schedule: InflationYearPoint[] = [];
  for (let y = 0; y <= years; y++) {
    const mult = Math.pow(1 + inflationRate, y);
    const fCost = currentAmount * mult;
    const pPower = mult > 0 ? currentAmount / mult : 0;
    const lPercent = currentAmount > 0 ? ((currentAmount - pPower) / currentAmount) * 100 : 0;
    schedule.push({
      year: y,
      futureCost: Math.round(fCost * 100) / 100,
      purchasingPower: Math.round(pPower * 100) / 100,
      lossPercent: Math.round(lPercent * 100) / 100,
    });
  }

  return {
    futureCost: Math.round(futureCost * 100) / 100,
    purchasingPower: Math.round(purchasingPower * 100) / 100,
    purchasingPowerLossPercent: Math.round(purchasingPowerLossPercent * 100) / 100,
    totalCostIncrease: Math.round(totalCostIncrease * 100) / 100,
    cumulativeInflationFactor: Math.round(inflationMultiplier * 1000) / 1000,
    schedule,
  };
}
