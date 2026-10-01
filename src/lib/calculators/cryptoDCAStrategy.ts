/**
 * Crypto DCA Strategy & Profit Calculator Engine
 * Simulates: Dollar Cost Averaging across dynamic market price curves (steady growth, dip & recovery, flat accumulation)
 * Compares: DCA outcomes vs. Lump-Sum execution, staking rewards, and average coin cost basis.
 */

export type DcaFrequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
export type DcaCycleModel = 'steadyGrowth' | 'dipAndRecovery' | 'flatAccumulation';

export interface CryptoDCAStrategyInput {
  recurringAmount: number; // Fiat amount per period ($)
  frequency: DcaFrequency;
  durationMonths: number; // Time horizon in months
  startingCoinPrice: number; // Starting coin price ($)
  endingCoinPrice: number; // Projected final coin price ($)
  cycleModel?: DcaCycleModel;
  stakingApyPercentage?: number; // Optional yield on accumulated tokens %
}

export interface CryptoDCAStrategyResult {
  totalFiatInvested: number;
  totalPeriods: number;
  totalCryptoAcquired: number;
  averagePurchasePrice: number;
  endingCoinPrice: number;
  endingPortfolioValue: number;
  netProfit: number;
  roiPercentage: number;
  stakingRewardsValue: number;
  lumpSumComparison: {
    coinsAcquired: number;
    endingValue: number;
    netProfit: number;
    roiPercentage: number;
    dcaOutperformed: boolean;
  };
  schedulePreview: {
    period: number;
    price: number;
    coinsBought: number;
    cumulativeCoins: number;
    cumulativeInvested: number;
    portfolioValue: number;
  }[];
}

export function calculateCryptoDCAStrategy(input: CryptoDCAStrategyInput): CryptoDCAStrategyResult {
  const pmt = Math.max(1, Number(input.recurringAmount) || 100);
  const freq = input.frequency || 'weekly';
  const months = Math.max(1, Math.min(120, Number(input.durationMonths) || 12));
  const pStart = Math.max(0.00000001, Number(input.startingCoinPrice) || 30000);
  const pEnd = Math.max(0.00000001, Number(input.endingCoinPrice) || 65000);
  const model = input.cycleModel || 'dipAndRecovery';
  const stakingApy = Math.max(0, Number(input.stakingApyPercentage) || 0) / 100;

  let periodsPerMonth = 4;
  if (freq === 'daily') periodsPerMonth = 30;
  else if (freq === 'weekly') periodsPerMonth = 4.33;
  else if (freq === 'bi-weekly') periodsPerMonth = 2.16;
  else periodsPerMonth = 1;

  const totalPeriods = Math.max(1, Math.round(months * periodsPerMonth));
  const totalFiatInvested = pmt * totalPeriods;

  let totalCryptoAcquired = 0;
  const schedule: CryptoDCAStrategyResult['schedulePreview'] = [];

  for (let i = 1; i <= totalPeriods; i++) {
    const progress = (i - 1) / Math.max(1, totalPeriods - 1); // 0 to 1
    let priceAtI = pStart;

    if (model === 'steadyGrowth') {
      priceAtI = pStart + (pEnd - pStart) * progress;
    } else if (model === 'dipAndRecovery') {
      // parabolic drop to 60% of start in middle, then surge to pEnd
      const dipFactor = 4 * (progress - 0.5) * (progress - 0.5); // 1 at start, 0 at mid, 1 at end
      const midPrice = Math.min(pStart, pEnd) * 0.65;
      priceAtI = midPrice + (Math.max(pStart, pEnd) - midPrice) * dipFactor;
    } else {
      // flat accumulation with mild +/- 10% oscillation
      const baseline = (pStart + pEnd) / 2;
      priceAtI = baseline * (1 + 0.1 * Math.sin(progress * Math.PI * 4));
    }

    priceAtI = Math.max(0.00000001, priceAtI);
    const coinsBought = pmt / priceAtI;
    totalCryptoAcquired += coinsBought;

    // Sample ~12 checkpoints for schedule preview
    if (i === 1 || i === totalPeriods || i % Math.max(1, Math.floor(totalPeriods / 10)) === 0) {
      schedule.push({
        period: i,
        price: Number(priceAtI.toFixed(2)),
        coinsBought: Number(coinsBought.toFixed(6)),
        cumulativeCoins: Number(totalCryptoAcquired.toFixed(6)),
        cumulativeInvested: Math.round(pmt * i),
        portfolioValue: Math.round(totalCryptoAcquired * priceAtI),
      });
    }
  }

  const averagePurchasePrice = totalCryptoAcquired > 0 ? totalFiatInvested / totalCryptoAcquired : 0;
  const rawEndingValue = totalCryptoAcquired * pEnd;

  // Staking rewards approximation: average balance staked over duration
  const years = months / 12;
  const stakingRewardsValue = stakingApy > 0 ? (rawEndingValue * (stakingApy * years * 0.5)) : 0;
  const endingPortfolioValue = rawEndingValue + stakingRewardsValue;

  const netProfit = endingPortfolioValue - totalFiatInvested;
  const roiPercentage = totalFiatInvested > 0 ? (netProfit / totalFiatInvested) * 100 : 0;

  // Lump sum on Day 1 comparison
  const lumpSumCoins = totalFiatInvested / pStart;
  const lumpSumEndingValue = lumpSumCoins * pEnd;
  const lumpSumProfit = lumpSumEndingValue - totalFiatInvested;
  const lumpSumRoi = (lumpSumProfit / totalFiatInvested) * 100;

  return {
    totalFiatInvested,
    totalPeriods,
    totalCryptoAcquired,
    averagePurchasePrice,
    endingCoinPrice: pEnd,
    endingPortfolioValue,
    netProfit,
    roiPercentage,
    stakingRewardsValue,
    lumpSumComparison: {
      coinsAcquired: lumpSumCoins,
      endingValue: lumpSumEndingValue,
      netProfit: lumpSumProfit,
      roiPercentage: lumpSumRoi,
      dcaOutperformed: netProfit > lumpSumProfit,
    },
    schedulePreview: schedule,
  };
}
