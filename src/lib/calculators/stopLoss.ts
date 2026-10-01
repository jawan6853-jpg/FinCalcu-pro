/**
 * Stop Loss Calculator Engine
 * Calculates estimated stop-loss price and R:R targets for LONG and SHORT trades
 */

export interface StopLossInput {
  direction: 'long' | 'short'; // Long or Short
  entryPrice: number; // Entry price ($)
  mode: 'percentage' | 'fixed-amount' | 'risk-reward-ratio';
  riskPercent?: number; // Stop loss % distance from entry (e.g. 3.5%)
  riskDollars?: number; // Total dollar amount prepared to lose ($)
  quantity?: number; // Trade position size units (e.g. 1.5 BTC or 100 shares)
  targetRewardRatio?: number; // Desired risk/reward multiplier (e.g. 2.0x)
}

export interface StopLossResult {
  stopLossPrice: number;
  stopDistanceDollars: number;
  stopDistancePercent: number;
  totalLossAtStop: number;
  takeProfitTargets: {
    ratio: string;
    targetPrice: number;
    potentialGain: number;
  }[];
  isValid: boolean;
  statusMessage: string;
}

export function calculateStopLoss(input: StopLossInput): StopLossResult {
  const dir = input.direction || 'long';
  const entry = Math.max(0, Number(input.entryPrice) || 0);
  const mode = input.mode || 'percentage';
  const riskPct = Math.max(0.01, Number(input.riskPercent) || 3.0);
  const riskDollars = Math.max(0, Number(input.riskDollars) || 200);
  const qty = Math.max(0.0001, Number(input.quantity) || 1);

  if (entry <= 0) {
    return {
      stopLossPrice: 0,
      stopDistanceDollars: 0,
      stopDistancePercent: 0,
      totalLossAtStop: 0,
      takeProfitTargets: [],
      isValid: false,
      statusMessage: 'Please specify an entry price above 0.',
    };
  }

  let stopDistanceDollars = 0;
  let stopDistancePercent = 0;

  if (mode === 'percentage') {
    stopDistancePercent = riskPct;
    stopDistanceDollars = entry * (riskPct / 100);
  } else {
    // Fixed amount or based on risk dollars and quantity
    stopDistanceDollars = riskDollars / qty;
    stopDistancePercent = (stopDistanceDollars / entry) * 100;
  }

  let stopLossPrice = 0;
  if (dir === 'long') {
    stopLossPrice = Math.max(0, entry - stopDistanceDollars);
  } else {
    // Short
    stopLossPrice = entry + stopDistanceDollars;
  }

  const totalLossAtStop = stopDistanceDollars * qty;

  // Compute R:R take profit targets (1:1, 1:1.5, 1:2, 1:3)
  const ratios = [1.0, 1.5, 2.0, 2.5, 3.0];
  const takeProfitTargets = ratios.map((r) => {
    const rewardDistance = stopDistanceDollars * r;
    const targetPrice = dir === 'long' ? entry + rewardDistance : Math.max(0, entry - rewardDistance);
    const potentialGain = rewardDistance * qty;

    return {
      ratio: `1:${r}`,
      targetPrice: Math.round(targetPrice * 100) / 100,
      potentialGain: Math.round(potentialGain * 100) / 100,
    };
  });

  return {
    stopLossPrice: Math.round(stopLossPrice * 100) / 100,
    stopDistanceDollars: Math.round(stopDistanceDollars * 100) / 100,
    stopDistancePercent: Math.round(stopDistancePercent * 100) / 100,
    totalLossAtStop: Math.round(totalLossAtStop * 100) / 100,
    takeProfitTargets,
    isValid: stopLossPrice > 0,
    statusMessage:
      dir === 'long'
        ? `Long stop loss set $${stopDistanceDollars.toFixed(2)} (${stopDistancePercent.toFixed(2)}%) below entry.`
        : `Short stop loss set $${stopDistanceDollars.toFixed(2)} (${stopDistancePercent.toFixed(2)}%) above entry.`,
  };
}
