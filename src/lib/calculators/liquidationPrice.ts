import { sanitizeNumber } from '../formatters';

export interface LiquidationPriceInput {
  direction: 'long' | 'short';
  entryPrice: number;
  leverage: number;
  maintenanceMarginRate: number; // typically 0.4% - 1.0%
  extraMarginAdded?: number; // optional additional collateral in $
  positionQuantity?: number; // coins or contracts
}

export interface LiquidationPriceResult {
  liquidationPrice: number;
  priceDistance: number; // absolute $ difference
  priceDistancePercent: number; // % drop (for long) or % rise (for short)
  initialMargin: number;
  bankruptcyPrice: number;
  isSafe: boolean; // false if already past liquidation
  exchangeVarianceNotice: string;
}

export function calculateLiquidationPrice(input: LiquidationPriceInput): LiquidationPriceResult {
  const direction = input.direction || 'long';
  const entryPrice = Math.max(0, sanitizeNumber(input.entryPrice));
  const leverage = Math.max(1, Math.min(125, sanitizeNumber(input.leverage, 10)));
  const mmr = Math.max(0, Math.min(0.5, sanitizeNumber(input.maintenanceMarginRate, 0.5) / 100));
  const extraMargin = Math.max(0, sanitizeNumber(input.extraMarginAdded, 0));
  const quantity = Math.max(0, sanitizeNumber(input.positionQuantity, 1));

  const positionNotional = entryPrice * quantity;
  const initialMargin = leverage > 0 ? positionNotional / leverage : positionNotional;

  // Standard Perpetual Futures Liquidation Formula:
  // For Long:
  // Bankruptcy Price = Entry × (1 - 1/Leverage)
  // Liquidation Price = Entry × (1 - 1/Leverage + MMR) - (ExtraMargin / Quantity)
  //
  // For Short:
  // Bankruptcy Price = Entry × (1 + 1/Leverage)
  // Liquidation Price = Entry × (1 + 1/Leverage - MMR) + (ExtraMargin / Quantity)

  let liquidationPrice = 0;
  let bankruptcyPrice = 0;
  const extraBufferPerUnit = quantity > 0 ? extraMargin / quantity : 0;

  if (direction === 'long') {
    bankruptcyPrice = entryPrice * (1 - 1 / leverage);
    liquidationPrice = Math.max(0, entryPrice * (1 - 1 / leverage + mmr) - extraBufferPerUnit);
  } else {
    bankruptcyPrice = entryPrice * (1 + 1 / leverage);
    liquidationPrice = entryPrice * (1 + 1 / leverage - mmr) + extraBufferPerUnit;
  }

  const priceDistance = Math.abs(entryPrice - liquidationPrice);
  const priceDistancePercent = entryPrice > 0 ? (priceDistance / entryPrice) * 100 : 0;

  const isSafe =
    direction === 'long' ? liquidationPrice < entryPrice : liquidationPrice > entryPrice;

  return {
    liquidationPrice: Math.round(liquidationPrice * 100) / 100,
    priceDistance: Math.round(priceDistance * 100) / 100,
    priceDistancePercent: Math.round(priceDistancePercent * 100) / 100,
    initialMargin: Math.round(initialMargin * 100) / 100,
    bankruptcyPrice: Math.round(bankruptcyPrice * 100) / 100,
    isSafe,
    exchangeVarianceNotice:
      'Actual liquidation price varies slightly by exchange (e.g., Binance, Bybit, OKX) based on dynamic tiered maintenance margin brackets, real-time funding fee deductions, and exchange insurance fund fees.',
  };
}
