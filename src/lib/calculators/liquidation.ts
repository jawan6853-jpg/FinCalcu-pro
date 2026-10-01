import { sanitizeNumber } from '../formatters';

export interface LiquidationInput {
  direction: 'long' | 'short';
  entryPrice: number;
  leverage: number;
  maintenanceMarginPercent?: number; // default 0.5%
  accountBalance?: number; // optional
}

export interface LiquidationResult {
  direction: 'long' | 'short';
  entryPrice: number;
  leverage: number;
  estimatedLiquidationPrice: number;
  distanceToLiquidationAmount: number;
  distanceToLiquidationPercent: number;
  bankruptcyPrice: number;
  maintenanceMarginRate: number;
  warningNotice: string;
  isValid: boolean;
}

export function calculateLiquidation(input: LiquidationInput): LiquidationResult {
  const isLong = input.direction === 'long';
  const entry = Math.max(0, sanitizeNumber(input.entryPrice, 0));
  const lev = Math.max(1, Math.min(125, sanitizeNumber(input.leverage, 10)));
  const mmRate = Math.max(0.001, Math.min(0.2, sanitizeNumber(input.maintenanceMarginPercent, 0.5) / 100));

  if (entry <= 0 || lev <= 0) {
    return {
      direction: input.direction,
      entryPrice: 0,
      leverage: lev,
      estimatedLiquidationPrice: 0,
      distanceToLiquidationAmount: 0,
      distanceToLiquidationPercent: 0,
      bankruptcyPrice: 0,
      maintenanceMarginRate: mmRate,
      warningNotice: 'Please enter a valid positive entry price.',
      isValid: false,
    };
  }

  // Standard Isolated Margin Liquidation Formulas:
  // For Long: LiqPrice = EntryPrice * (1 - (1 / Leverage) + MaintenanceMarginRate)
  // For Short: LiqPrice = EntryPrice * (1 + (1 / Leverage) - MaintenanceMarginRate)
  let estLiqPrice = 0;
  let bankruptcyPrice = 0;

  if (isLong) {
    estLiqPrice = entry * (1 - (1 / lev) + mmRate);
    bankruptcyPrice = entry * (1 - (1 / lev));
    // Guard: liquidation price cannot be negative
    estLiqPrice = Math.max(0, estLiqPrice);
    bankruptcyPrice = Math.max(0, bankruptcyPrice);
  } else {
    estLiqPrice = entry * (1 + (1 / lev) - mmRate);
    bankruptcyPrice = entry * (1 + (1 / lev));
  }

  const distanceAmount = Math.abs(entry - estLiqPrice);
  const distancePercent = entry > 0 ? (distanceAmount / entry) * 100 : 0;

  return {
    direction: input.direction,
    entryPrice: entry,
    leverage: lev,
    estimatedLiquidationPrice: isFinite(estLiqPrice) ? estLiqPrice : 0,
    distanceToLiquidationAmount: isFinite(distanceAmount) ? distanceAmount : 0,
    distanceToLiquidationPercent: isFinite(distancePercent) ? distancePercent : 0,
    bankruptcyPrice: isFinite(bankruptcyPrice) ? bankruptcyPrice : 0,
    maintenanceMarginRate: mmRate * 100,
    warningNotice:
      'Actual liquidation price depends on exchange tiering, mark-price index, maintenance margin schedules, and accrued funding fees. Always use a stop loss.',
    isValid: true,
  };
}
