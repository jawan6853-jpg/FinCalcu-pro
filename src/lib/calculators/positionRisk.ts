/**
 * Position Risk Calculator Engine
 * Calculates: Dollar Risk Amount, Position Size, Max Loss, Risk-to-Reward Ratio (R:R)
 * Essential for professional risk management across stocks, forex, and cryptocurrency.
 */

export interface PositionRiskInput {
  accountBalance: number; // Total portfolio / account equity ($)
  riskPercentage: number; // Max allowable risk per trade % (e.g. 1.0% or 2.0%)
  entryPrice: number; // Trade entry price ($)
  stopLossPrice: number; // Invalidation price ($)
  takeProfitPrice?: number; // Target exit price ($ optional)
  leverage?: number; // Leverage multiplier (default 1)
}

export interface PositionRiskResult {
  accountBalance: number;
  riskPercentage: number;
  totalDollarRisk: number; // Account Balance * (Risk% / 100)
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number | null;
  tradeDirection: 'Long' | 'Short';
  riskPerShareOrUnit: number; // |Entry - StopLoss|
  riskPercentagePerUnit: number; // RiskPerUnit / Entry * 100
  recommendedPositionSizeUnits: number; // TotalDollarRisk / RiskPerUnit
  totalPositionValue: number; // Units * Entry
  capitalRequiredWithLeverage: number; // TotalPositionValue / Leverage
  portfolioAllocationPercentage: number; // PositionValue / AccountBalance * 100
  riskRewardRatio: number | null; // PotentialReward / DollarRisk
  potentialProfitDollars: number | null;
  rewardPercentagePerUnit: number | null;
}

export function calculatePositionRisk(input: PositionRiskInput): PositionRiskResult {
  const equity = Math.max(1, Number(input.accountBalance) || 10000);
  const riskPct = Math.max(0.01, Math.min(100, Number(input.riskPercentage) || 1.5));
  const entry = Math.max(0.000001, Number(input.entryPrice) || 100);
  let stop = Math.max(0, Number(input.stopLossPrice) || 95);
  const target = input.takeProfitPrice && Number(input.takeProfitPrice) > 0 ? Number(input.takeProfitPrice) : null;
  const lev = Math.max(1, Number(input.leverage) || 1);

  if (stop === entry) {
    stop = entry * 0.98; // prevent division by zero
  }

  const tradeDirection: 'Long' | 'Short' = stop < entry ? 'Long' : 'Short';
  const totalDollarRisk = equity * (riskPct / 100);
  const riskPerShareOrUnit = Math.abs(entry - stop);
  const riskPercentagePerUnit = (riskPerShareOrUnit / entry) * 100;

  // Position Size = Total Risk / Risk per unit
  const recommendedUnits = riskPerShareOrUnit > 0 ? totalDollarRisk / riskPerShareOrUnit : 0;
  const totalPositionValue = recommendedUnits * entry;
  const capitalRequiredWithLeverage = totalPositionValue / lev;
  const portfolioAllocationPercentage = (totalPositionValue / equity) * 100;

  let riskRewardRatio: number | null = null;
  let potentialProfitDollars: number | null = null;
  let rewardPercentagePerUnit: number | null = null;

  if (target !== null && target > 0) {
    const rewardPerUnit = tradeDirection === 'Long' ? target - entry : entry - target;
    if (rewardPerUnit > 0) {
      potentialProfitDollars = recommendedUnits * rewardPerUnit;
      riskRewardRatio = Number((rewardPerUnit / riskPerShareOrUnit).toFixed(2));
      rewardPercentagePerUnit = (rewardPerUnit / entry) * 100;
    }
  }

  return {
    accountBalance: equity,
    riskPercentage: riskPct,
    totalDollarRisk,
    entryPrice: entry,
    stopLossPrice: stop,
    takeProfitPrice: target,
    tradeDirection,
    riskPerShareOrUnit,
    riskPercentagePerUnit,
    recommendedPositionSizeUnits: Number(recommendedUnits.toFixed(4)),
    totalPositionValue: Number(totalPositionValue.toFixed(2)),
    capitalRequiredWithLeverage: Number(capitalRequiredWithLeverage.toFixed(2)),
    portfolioAllocationPercentage: Number(portfolioAllocationPercentage.toFixed(2)),
    riskRewardRatio,
    potentialProfitDollars: potentialProfitDollars !== null ? Number(potentialProfitDollars.toFixed(2)) : null,
    rewardPercentagePerUnit: rewardPercentagePerUnit !== null ? Number(rewardPercentagePerUnit.toFixed(2)) : null,
  };
}
