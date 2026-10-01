/**
 * Asset Allocation Calculator Engine
 * Calculates: Portfolio asset weights across Stocks, Bonds, Cash, Crypto, and Other, comparing with target models
 */

export interface AssetAllocationInput {
  stocks: number; // Equities ($)
  bonds: number; // Fixed income ($)
  cash: number; // High-yield savings, CDs, money market ($)
  crypto: number; // Bitcoin, Ethereum, digital assets ($)
  otherAssets?: number; // Real estate, commodities, gold ($)
  targetModel?: 'conservative' | 'balanced' | 'growth' | 'aggressive' | 'custom';
  customTargetStocks?: number; // %
  customTargetBonds?: number; // %
  customTargetCash?: number; // %
  customTargetCrypto?: number; // %
  customTargetOther?: number; // %
}

export interface AssetClassDetail {
  name: string;
  currentAmount: number;
  currentPercent: number;
  targetPercent: number;
  targetAmount: number;
  rebalanceDifference: number; // positive = buy, negative = sell
  action: 'BUY' | 'SELL' | 'HOLD';
}

export interface AssetAllocationResult {
  totalPortfolioValue: number;
  allocations: AssetClassDetail[];
  riskProfile: string;
  rebalanceNeeded: boolean;
}

const MODEL_PRESETS: Record<string, { stocks: number; bonds: number; cash: number; crypto: number; other: number }> = {
  conservative: { stocks: 30, bonds: 50, cash: 15, crypto: 0, other: 5 },
  balanced: { stocks: 60, bonds: 30, cash: 5, crypto: 2, other: 3 },
  growth: { stocks: 75, bonds: 15, cash: 5, crypto: 3, other: 2 },
  aggressive: { stocks: 80, bonds: 5, cash: 5, crypto: 7, other: 3 },
};

export function calculateAssetAllocation(input: AssetAllocationInput): AssetAllocationResult {
  const stocks = Math.max(0, Number(input.stocks) || 0);
  const bonds = Math.max(0, Number(input.bonds) || 0);
  const cash = Math.max(0, Number(input.cash) || 0);
  const crypto = Math.max(0, Number(input.crypto) || 0);
  const other = Math.max(0, Number(input.otherAssets) || 0);

  const totalPortfolioValue = stocks + bonds + cash + crypto + other;
  const model = input.targetModel || 'balanced';

  let targets = MODEL_PRESETS[model] || MODEL_PRESETS.balanced;
  if (model === 'custom') {
    targets = {
      stocks: Number(input.customTargetStocks) || 60,
      bonds: Number(input.customTargetBonds) || 25,
      cash: Number(input.customTargetCash) || 5,
      crypto: Number(input.customTargetCrypto) || 5,
      other: Number(input.customTargetOther) || 5,
    };
  }

  const rawClasses = [
    { name: 'Stocks & Equities', val: stocks, targetPct: targets.stocks },
    { name: 'Bonds & Fixed Income', val: bonds, targetPct: targets.bonds },
    { name: 'Cash & Equivalents', val: cash, targetPct: targets.cash },
    { name: 'Cryptocurrency', val: crypto, targetPct: targets.crypto },
    { name: 'Other (Gold / RE)', val: other, targetPct: targets.other },
  ];

  let rebalanceNeeded = false;
  const allocations: AssetClassDetail[] = rawClasses.map((item) => {
    const currentPercent = totalPortfolioValue > 0 ? (item.val / totalPortfolioValue) * 100 : 0;
    const targetAmount = (totalPortfolioValue * item.targetPct) / 100;
    const diff = targetAmount - item.val;

    let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    if (Math.abs(diff) > 25 && Math.abs(currentPercent - item.targetPct) > 1) {
      action = diff > 0 ? 'BUY' : 'SELL';
      rebalanceNeeded = true;
    }

    return {
      name: item.name,
      currentAmount: Math.round(item.val * 100) / 100,
      currentPercent: Math.round(currentPercent * 10) / 10,
      targetPercent: item.targetPct,
      targetAmount: Math.round(targetAmount * 100) / 100,
      rebalanceDifference: Math.round(diff * 100) / 100,
      action,
    };
  });

  return {
    totalPortfolioValue: Math.round(totalPortfolioValue * 100) / 100,
    allocations,
    riskProfile: `${model.charAt(0).toUpperCase() + model.slice(1)} Portfolio`,
    rebalanceNeeded,
  };
}
