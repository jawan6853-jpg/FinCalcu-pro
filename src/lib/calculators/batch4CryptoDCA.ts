/**
 * Crypto DCA Calculator Engine
 * Calculates: Dollar Cost Averaging for recurring crypto purchases
 * Outputs: Total invested, Total crypto acquired, Average purchase price, Portfolio value, Profit/Loss
 */

export interface Batch4CryptoDCAInput {
  recurringAmount: number; // e.g. $100
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  totalPeriods: number; // Number of recurring intervals
  startingPrice: number; // Price at first purchase ($)
  endingPrice: number; // Price at end of strategy ($)
  priceTrajectory?: 'linear' | 'volatile' | 'dip-and-recovery';
}

export interface DCAIntervalPoint {
  period: number;
  price: number;
  cryptoBought: number;
  cumulativeCrypto: number;
  cumulativeInvested: number;
  currentPortfolioValue: number;
}

export interface Batch4CryptoDCAResult {
  recurringAmount: number;
  totalPeriods: number;
  totalInvested: number;
  totalCryptoAcquired: number;
  averagePurchasePrice: number;
  endingTokenPrice: number;
  currentPortfolioValue: number;
  profitOrLoss: number;
  roiPercent: number;
  lumpSumEquivalentCrypto: number;
  lumpSumPortfolioValue: number;
  dcaOutperformedLumpSum: boolean;
  historyTimeline: DCAIntervalPoint[];
}

export function calculateBatch4CryptoDCA(input: Batch4CryptoDCAInput): Batch4CryptoDCAResult {
  const recurring = Math.max(1, Number(input.recurringAmount) || 100);
  const periods = Math.max(1, Math.min(365, Math.floor(Number(input.totalPeriods) || 12)));
  const pStart = Math.max(0.000001, Number(input.startingPrice) || 30000);
  const pEnd = Math.max(0.000001, Number(input.endingPrice) || 60000);
  const trajectory = input.priceTrajectory || 'linear';

  let totalCrypto = 0;
  let totalInvested = 0;
  const historyTimeline: DCAIntervalPoint[] = [];

  for (let i = 1; i <= periods; i++) {
    const progress = (i - 1) / Math.max(1, periods - 1);
    let currentPrice = pStart + (pEnd - pStart) * progress;

    if (trajectory === 'volatile') {
      // Simulate realistic crypto market cycles with sine waves
      const wave = Math.sin(progress * Math.PI * 3) * 0.25;
      currentPrice = Math.max(0.000001, currentPrice * (1 + wave));
    } else if (trajectory === 'dip-and-recovery') {
      // Dip in middle then recover
      const dipFactor = 1 - 0.4 * Math.sin(progress * Math.PI);
      currentPrice = Math.max(0.000001, currentPrice * dipFactor);
    }

    const cryptoBought = recurring / currentPrice;
    totalCrypto += cryptoBought;
    totalInvested += recurring;

    if (i === 1 || i % Math.ceil(periods / 12) === 0 || i === periods) {
      historyTimeline.push({
        period: i,
        price: currentPrice,
        cryptoBought,
        cumulativeCrypto: totalCrypto,
        cumulativeInvested: totalInvested,
        currentPortfolioValue: totalCrypto * currentPrice,
      });
    }
  }

  const averagePrice = totalCrypto > 0 ? totalInvested / totalCrypto : 0;
  const currentPortfolioValue = totalCrypto * pEnd;
  const pnl = currentPortfolioValue - totalInvested;
  const roi = totalInvested > 0 ? (pnl / totalInvested) * 100 : 0;

  // Lump sum comparison: all money invested on Day 1 at pStart
  const lumpSumCrypto = totalInvested / pStart;
  const lumpSumPortfolioValue = lumpSumCrypto * pEnd;
  const dcaOutperformed = currentPortfolioValue >= lumpSumPortfolioValue;

  return {
    recurringAmount: recurring,
    totalPeriods: periods,
    totalInvested,
    totalCryptoAcquired: totalCrypto,
    averagePurchasePrice: averagePrice,
    endingTokenPrice: pEnd,
    currentPortfolioValue,
    profitOrLoss: pnl,
    roiPercent: roi,
    lumpSumEquivalentCrypto: lumpSumCrypto,
    lumpSumPortfolioValue,
    dcaOutperformedLumpSum: dcaOutperformed,
    historyTimeline,
  };
}
