import { parseInput, safeDivision } from '../formatters';

export interface CryptoMiningInput {
  hashrateTh: number; // Terahashes per sec (TH/s)
  powerConsumptionWatts: number; // Watts
  electricityCostKwh: number; // $ per kWh
  miningPoolFeePercent?: number; // e.g. 2%
  hardwareCostUsd?: number; // Optional ASIC/Rig hardware price
  dailyRevenuePerThUsd?: number; // Current network revenue per TH/s per day ($)
}

export interface CryptoMiningResult {
  dailyRevenueUsd: number;
  dailyPowerCostUsd: number;
  dailyPoolFeeUsd: number;
  dailyNetProfitUsd: number;
  monthlyNetProfitUsd: number;
  annualNetProfitUsd: number;
  breakEvenDays: number | null; // Days to pay off hardware
  profitMarginPercent: number;
  isProfitable: boolean;
}

export function calculateCryptoMining(input: CryptoMiningInput): CryptoMiningResult {
  const hashrate = Math.max(0, parseInput(input.hashrateTh, 100));
  const powerWatts = Math.max(0, parseInput(input.powerConsumptionWatts, 3200));
  const kwhRate = Math.max(0, parseInput(input.electricityCostKwh, 0.06));
  const poolFeePct = Math.max(0, parseInput(input.miningPoolFeePercent, 2));
  const hardwareCost = Math.max(0, parseInput(input.hardwareCostUsd, 2500));
  const revPerTh = Math.max(0, parseInput(input.dailyRevenuePerThUsd, 0.085));

  // Daily gross revenue
  const grossDailyRevenue = hashrate * revPerTh;
  const dailyPoolFee = grossDailyRevenue * (poolFeePct / 100);
  const netDailyRevenue = grossDailyRevenue - dailyPoolFee;

  // Daily electricity consumption: (Watts * 24h) / 1000 = kWh per day
  const dailyKwh = (powerWatts * 24) / 1000;
  const dailyElectricityCost = dailyKwh * kwhRate;

  // Daily Net Profit
  const dailyNet = netDailyRevenue - dailyElectricityCost;
  const monthlyNet = dailyNet * 30.4167;
  const annualNet = dailyNet * 365;

  const margin = grossDailyRevenue > 0 ? (dailyNet / grossDailyRevenue) * 100 : 0;
  const isProfitable = dailyNet > 0;

  let breakEvenDays: number | null = null;
  if (hardwareCost > 0 && dailyNet > 0) {
    breakEvenDays = Math.ceil(hardwareCost / dailyNet);
  }

  return {
    dailyRevenueUsd: Number(grossDailyRevenue.toFixed(2)),
    dailyPowerCostUsd: Number(dailyElectricityCost.toFixed(2)),
    dailyPoolFeeUsd: Number(dailyPoolFee.toFixed(2)),
    dailyNetProfitUsd: Number(dailyNet.toFixed(2)),
    monthlyNetProfitUsd: Number(monthlyNet.toFixed(2)),
    annualNetProfitUsd: Number(annualNet.toFixed(2)),
    breakEvenDays,
    profitMarginPercent: Number(margin.toFixed(2)),
    isProfitable,
  };
}
