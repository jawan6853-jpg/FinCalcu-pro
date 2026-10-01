/**
 * Stock Profit Calculator Engine
 * Calculates: Gross profit/loss, Trading commissions & SEC/regulatory fees, Net profit/loss, ROI, Break-even price
 * Supports: Buy price, Sell price, Shares, Fees, and optional Dividends
 */

export interface StockProfitInput {
  shares: number;
  buyPricePerShare: number;
  sellPricePerShare: number;
  buyCommission?: number;
  sellCommission?: number;
  dividendsReceived?: number;
}

export interface StockProfitResult {
  shares: number;
  buyPricePerShare: number;
  sellPricePerShare: number;
  totalPurchaseCost: number;
  totalGrossProceeds: number;
  totalTradingFees: number;
  dividendsEarned: number;
  grossProfit: number;
  netProfit: number;
  roiPercent: number;
  breakEvenPricePerShare: number;
  isProfitable: boolean;
}

export function calculateStockProfit(input: StockProfitInput): StockProfitResult {
  const shares = Math.max(0.0001, Number(input.shares) || 0);
  const buyPrice = Math.max(0, Number(input.buyPricePerShare) || 0);
  const sellPrice = Math.max(0, Number(input.sellPricePerShare) || 0);
  const buyComm = Math.max(0, Number(input.buyCommission) || 0);
  const sellComm = Math.max(0, Number(input.sellCommission) || 0);
  const dividends = Math.max(0, Number(input.dividendsReceived) || 0);

  const purchaseCost = buyPrice * shares;
  const grossProceeds = sellPrice * shares;
  const totalFees = buyComm + sellComm;

  const grossProfit = grossProceeds - purchaseCost;
  const netProfit = grossProfit - totalFees + dividends;

  const totalCashInvested = purchaseCost + buyComm;
  const roi = totalCashInvested > 0 ? (netProfit / totalCashInvested) * 100 : 0;

  // Break-even price = (Purchase Cost + Total Fees - Dividends) / shares
  const netCostToCover = purchaseCost + totalFees - dividends;
  const breakEvenPrice = shares > 0 ? Math.max(0, netCostToCover / shares) : 0;

  return {
    shares,
    buyPricePerShare: buyPrice,
    sellPricePerShare: sellPrice,
    totalPurchaseCost: purchaseCost,
    totalGrossProceeds: grossProceeds,
    totalTradingFees: totalFees,
    dividendsEarned: dividends,
    grossProfit,
    netProfit,
    roiPercent: roi,
    breakEvenPricePerShare: breakEvenPrice,
    isProfitable: netProfit >= 0,
  };
}
