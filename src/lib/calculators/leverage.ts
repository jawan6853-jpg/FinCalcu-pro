import { sanitizeNumber } from '../formatters';

export interface LeverageInput {
  marginAvailable: number; // your capital/collateral in $
  leverageMultiple: number; // e.g. 5x, 10x, 20x, 50x, 100x
  assetPrice: number; // current price of asset in $
}

export interface LeverageResult {
  totalPositionExposure: number; // Notional position value in $
  requiredCapital: number;
  effectiveLeverage: number;
  assetQuantityControlled: number;
  maxDrawdownBeforeDepletion: number; // % move against position before 100% margin loss
  borrowedFunds: number;
  isValid: boolean;
}

export function calculateLeverage(input: LeverageInput): LeverageResult {
  const marginAvailable = Math.max(0, sanitizeNumber(input.marginAvailable));
  const leverageMultiple = Math.max(1, Math.min(125, sanitizeNumber(input.leverageMultiple, 10)));
  const assetPrice = Math.max(0, sanitizeNumber(input.assetPrice, 50000));

  const totalPositionExposure = marginAvailable * leverageMultiple;
  const borrowedFunds = Math.max(0, totalPositionExposure - marginAvailable);
  const assetQuantityControlled = assetPrice > 0 ? totalPositionExposure / assetPrice : 0;
  // Maximum loss percentage is 100% / leverage
  const maxDrawdownBeforeDepletion = leverageMultiple > 0 ? 100 / leverageMultiple : 100;

  return {
    totalPositionExposure: Math.round(totalPositionExposure * 100) / 100,
    requiredCapital: Math.round(marginAvailable * 100) / 100,
    effectiveLeverage: leverageMultiple,
    assetQuantityControlled: Math.round(assetQuantityControlled * 100000) / 100000,
    maxDrawdownBeforeDepletion: Math.round(maxDrawdownBeforeDepletion * 100) / 100,
    borrowedFunds: Math.round(borrowedFunds * 100) / 100,
    isValid: marginAvailable > 0 && assetPrice > 0,
  };
}
