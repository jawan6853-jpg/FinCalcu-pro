import { sanitizeNumber } from '../formatters';

export interface FuturesPnlInput {
  direction: 'long' | 'short';
  leverage: number;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  entryFeeRate: number; // % (e.g. 0.02% maker or 0.05% taker)
  exitFeeRate: number; // %
}

export interface FuturesPnlResult {
  initialMargin: number;
  entryNotional: number;
  exitNotional: number;
  grossPnl: number;
  entryFee: number;
  exitFee: number;
  totalFees: number;
  netPnl: number;
  roePercent: number; // Return on Equity / Margin
  priceChangePercent: number;
  isProfit: boolean;
}

export function calculateFuturesPnl(input: FuturesPnlInput): FuturesPnlResult {
  const direction = input.direction || 'long';
  const leverage = Math.max(1, Math.min(125, sanitizeNumber(input.leverage, 10)));
  const entryPrice = Math.max(0, sanitizeNumber(input.entryPrice));
  const exitPrice = Math.max(0, sanitizeNumber(input.exitPrice));
  const quantity = Math.max(0, sanitizeNumber(input.quantity));
  const entryFeeRate = Math.max(0, sanitizeNumber(input.entryFeeRate, 0.05)) / 100;
  const exitFeeRate = Math.max(0, sanitizeNumber(input.exitFeeRate, 0.05)) / 100;

  const entryNotional = entryPrice * quantity;
  const exitNotional = exitPrice * quantity;
  const initialMargin = leverage > 0 ? entryNotional / leverage : entryNotional;

  // Gross P&L
  let grossPnl = 0;
  let priceChangePercent = 0;
  if (direction === 'long') {
    grossPnl = (exitPrice - entryPrice) * quantity;
    priceChangePercent = entryPrice > 0 ? ((exitPrice - entryPrice) / entryPrice) * 100 : 0;
  } else {
    grossPnl = (entryPrice - exitPrice) * quantity;
    priceChangePercent = entryPrice > 0 ? ((entryPrice - exitPrice) / entryPrice) * 100 : 0;
  }

  // Fees are calculated on notional trade size
  const entryFee = entryNotional * entryFeeRate;
  const exitFee = exitNotional * exitFeeRate;
  const totalFees = entryFee + exitFee;

  const netPnl = grossPnl - totalFees;
  const roePercent = initialMargin > 0 ? (netPnl / initialMargin) * 100 : 0;

  return {
    initialMargin: Math.round(initialMargin * 100) / 100,
    entryNotional: Math.round(entryNotional * 100) / 100,
    exitNotional: Math.round(exitNotional * 100) / 100,
    grossPnl: Math.round(grossPnl * 100) / 100,
    entryFee: Math.round(entryFee * 100) / 100,
    exitFee: Math.round(exitFee * 100) / 100,
    totalFees: Math.round(totalFees * 100) / 100,
    netPnl: Math.round(netPnl * 100) / 100,
    roePercent: Math.round(roePercent * 100) / 100,
    priceChangePercent: Math.round(priceChangePercent * 100) / 100,
    isProfit: netPnl >= 0,
  };
}
