import { parseInput, safeDivision } from '../formatters';

export interface AssetHolding {
  name: string;
  currentValue: number;
  targetPercent: number; // e.g. 60%
}

export interface PortfolioRebalancingInput {
  holdings: AssetHolding[];
  additionalCashInjection?: number; // Optional new cash to deposit and rebalance with
}

export interface RebalanceAction {
  name: string;
  currentValue: number;
  currentWeightPercent: number;
  targetPercent: number;
  targetValue: number;
  action: 'BUY' | 'SELL' | 'HOLD';
  adjustmentAmount: number; // Positive dollar amount to trade
}

export interface PortfolioRebalancingResult {
  totalCurrentValue: number;
  totalNewValue: number;
  cashInjection: number;
  actions: RebalanceAction[];
  maxDriftPercent: number;
}

export function calculatePortfolioRebalancing(input: PortfolioRebalancingInput): PortfolioRebalancingResult {
  const holdings = input.holdings && input.holdings.length > 0 ? input.holdings : [
    { name: 'US Equities', currentValue: 70000, targetPercent: 60 },
    { name: 'International Equities', currentValue: 15000, targetPercent: 20 },
    { name: 'Fixed Income / Bonds', currentValue: 10000, targetPercent: 15 },
    { name: 'Crypto & Alternatives', currentValue: 5000, targetPercent: 5 },
  ];

  const cashInjection = Math.max(0, parseInput(input.additionalCashInjection, 0));
  const currentTotal = holdings.reduce((sum, h) => sum + Math.max(0, parseInput(h.currentValue, 0)), 0);
  const newTotal = currentTotal + cashInjection;

  let maxDrift = 0;

  const actions: RebalanceAction[] = holdings.map((h) => {
    const val = Math.max(0, parseInput(h.currentValue, 0));
    const targetPct = Math.max(0, parseInput(h.targetPercent, 0));
    const curWeight = currentTotal > 0 ? (val / currentTotal) * 100 : 0;
    const targetVal = (targetPct / 100) * newTotal;
    const diff = targetVal - val;

    const drift = Math.abs(curWeight - targetPct);
    if (drift > maxDrift) maxDrift = drift;

    let action: RebalanceAction['action'] = 'HOLD';
    if (diff > 5) action = 'BUY';
    else if (diff < -5) action = 'SELL';

    return {
      name: h.name,
      currentValue: Number(val.toFixed(2)),
      currentWeightPercent: Number(curWeight.toFixed(2)),
      targetPercent: Number(targetPct.toFixed(2)),
      targetValue: Number(targetVal.toFixed(2)),
      action,
      adjustmentAmount: Number(Math.abs(diff).toFixed(2)),
    };
  });

  return {
    totalCurrentValue: Number(currentTotal.toFixed(2)),
    totalNewValue: Number(newTotal.toFixed(2)),
    cashInjection: Number(cashInjection.toFixed(2)),
    actions,
    maxDriftPercent: Number(maxDrift.toFixed(2)),
  };
}
