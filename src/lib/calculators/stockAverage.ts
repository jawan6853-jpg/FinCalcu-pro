/**
 * Stock Average / Share Cost Averaging Calculator Engine
 * Calculates: Weighted average purchase price, total shares accumulated, and breakeven across multiple buys
 */

export interface StockPurchaseBatch {
  shares: number;
  pricePerShare: number;
}

export interface StockAverageInput {
  purchases: StockPurchaseBatch[];
  currentMarketPrice?: number; // Optional live or current price to assess P&L ($)
}

export interface StockAverageResult {
  totalShares: number;
  totalCostInvested: number;
  averagePricePerShare: number;
  currentPortfolioValue?: number;
  totalProfitOrLoss?: number;
  roiPercentage?: number;
  isProfit?: boolean;
}

export function calculateStockAverage(input: StockAverageInput): StockAverageResult {
  const purchases = Array.isArray(input.purchases) ? input.purchases : [];

  let totalShares = 0;
  let totalCostInvested = 0;

  purchases.forEach((p) => {
    const s = Math.max(0, Number(p.shares) || 0);
    const pr = Math.max(0, Number(p.pricePerShare) || 0);
    totalShares += s;
    totalCostInvested += s * pr;
  });

  const averagePricePerShare = totalShares > 0 ? totalCostInvested / totalShares : 0;

  let currentPortfolioValue: number | undefined;
  let totalProfitOrLoss: number | undefined;
  let roiPercentage: number | undefined;
  let isProfit: boolean | undefined;

  const currentPrice = Number(input.currentMarketPrice);
  if (!isNaN(currentPrice) && currentPrice > 0 && totalShares > 0) {
    currentPortfolioValue = totalShares * currentPrice;
    totalProfitOrLoss = currentPortfolioValue - totalCostInvested;
    roiPercentage = totalCostInvested > 0 ? (totalProfitOrLoss / totalCostInvested) * 100 : 0;
    isProfit = totalProfitOrLoss >= 0;
  }

  return {
    totalShares: Math.round(totalShares * 10000) / 10000,
    totalCostInvested: Math.round(totalCostInvested * 100) / 100,
    averagePricePerShare: Math.round(averagePricePerShare * 1000) / 1000,
    currentPortfolioValue: currentPortfolioValue !== undefined ? Math.round(currentPortfolioValue * 100) / 100 : undefined,
    totalProfitOrLoss: totalProfitOrLoss !== undefined ? Math.round(totalProfitOrLoss * 100) / 100 : undefined,
    roiPercentage: roiPercentage !== undefined ? Math.round(roiPercentage * 100) / 100 : undefined,
    isProfit,
  };
}
