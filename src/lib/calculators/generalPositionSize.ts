/**
 * Universal Position Size Calculator Engine
 * Calculates: Exact units/shares/contracts, notional position exposure, dollar risk, and portfolio allocation %
 */

export interface PositionSizeCalculatorInput {
  accountBalance: number; // Total trading account capital ($)
  riskPercentage: number; // Percent of account to risk (e.g. 1% to 3%)
  entryPrice: number; // Planned trade entry price ($)
  stopLossPrice: number; // Protective stop-loss exit price ($)
  tradeDirection?: 'long' | 'short'; // Long or short position
}

export interface PositionSizeCalculatorResult {
  riskAmountDollars: number; // Maximum dollars risked on trade ($)
  riskPerUnit: number; // Price distance to stop loss per coin/share ($)
  riskPercentDistance: number; // % stop-loss distance
  positionUnits: number; // Number of units/shares to buy/short
  positionNotionalValue: number; // Total position size in dollars ($)
  accountAllocationPercent: number; // Position size as % of portfolio
  isTradeValid: boolean;
  statusMessage: string;
}

export function calculatePositionSize(
  input: PositionSizeCalculatorInput
): PositionSizeCalculatorResult {
  const balance = Math.max(0, Number(input.accountBalance) || 0);
  const riskPct = Math.max(0, Number(input.riskPercentage) || 0);
  const entry = Math.max(0, Number(input.entryPrice) || 0);
  const stop = Math.max(0, Number(input.stopLossPrice) || 0);
  const direction = input.tradeDirection || (stop < entry ? 'long' : 'short');

  const riskAmountDollars = balance * (riskPct / 100);

  // Validate entry vs stop
  let riskPerUnit = 0;
  let isTradeValid = true;
  let statusMessage = 'Valid trade setup.';

  if (entry <= 0) {
    return {
      riskAmountDollars: 0,
      riskPerUnit: 0,
      riskPercentDistance: 0,
      positionUnits: 0,
      positionNotionalValue: 0,
      accountAllocationPercent: 0,
      isTradeValid: false,
      statusMessage: 'Please specify a positive entry price.',
    };
  }

  if (direction === 'long') {
    if (stop >= entry) {
      isTradeValid = false;
      statusMessage = 'For a LONG trade, Stop Loss must be below Entry price.';
      riskPerUnit = Math.max(0.0001, entry - stop);
    } else {
      riskPerUnit = entry - stop;
    }
  } else {
    // Short
    if (stop <= entry) {
      isTradeValid = false;
      statusMessage = 'For a SHORT trade, Stop Loss must be above Entry price.';
      riskPerUnit = Math.max(0.0001, stop - entry);
    } else {
      riskPerUnit = stop - entry;
    }
  }

  riskPerUnit = Math.max(0.00000001, riskPerUnit);
  const riskPercentDistance = (riskPerUnit / entry) * 100;

  const positionUnits = riskPerUnit > 0 ? riskAmountDollars / riskPerUnit : 0;
  const positionNotionalValue = positionUnits * entry;
  const accountAllocationPercent = balance > 0 ? (positionNotionalValue / balance) * 100 : 0;

  return {
    riskAmountDollars: Math.round(riskAmountDollars * 100) / 100,
    riskPerUnit: Math.round(riskPerUnit * 10000) / 10000,
    riskPercentDistance: Math.round(riskPercentDistance * 100) / 100,
    positionUnits: Math.round(positionUnits * 10000) / 10000,
    positionNotionalValue: Math.round(positionNotionalValue * 100) / 100,
    accountAllocationPercent: Math.round(accountAllocationPercent * 100) / 100,
    isTradeValid,
    statusMessage,
  };
}
