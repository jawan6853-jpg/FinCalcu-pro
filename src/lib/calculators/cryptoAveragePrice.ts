/**
 * Crypto Average Price / DCA Cost Basis Calculator Engine
 * Calculates: Weighted average price across multiple cryptocurrency buys, total coins, and current P&L
 */

export interface CryptoBuyOrder {
  coins: number; // Token quantity (e.g. 0.25 BTC)
  pricePerCoin: number; // Purchase price ($)
}

export interface CryptoAveragePriceInput {
  orders: CryptoBuyOrder[];
  currentMarketPrice?: number; // Optional live or current token price ($)
}

export interface CryptoAveragePriceResult {
  totalCoins: number;
  totalCostBasis: number;
  averagePricePerCoin: number;
  currentValue?: number;
  unrealizedProfitOrLoss?: number;
  unrealizedRoiPercent?: number;
  isProfitable?: boolean;
}

export function calculateCryptoAveragePrice(input: CryptoAveragePriceInput): CryptoAveragePriceResult {
  const orders = Array.isArray(input.orders) ? input.orders : [];

  let totalCoins = 0;
  let totalCostBasis = 0;

  orders.forEach((ord) => {
    const c = Math.max(0, Number(ord.coins) || 0);
    const p = Math.max(0, Number(ord.pricePerCoin) || 0);
    totalCoins += c;
    totalCostBasis += c * p;
  });

  const avgPrice = totalCoins > 0 ? totalCostBasis / totalCoins : 0;

  let currentValue: number | undefined;
  let unrealizedProfitOrLoss: number | undefined;
  let unrealizedRoiPercent: number | undefined;
  let isProfitable: boolean | undefined;

  const currentPrice = Number(input.currentMarketPrice);
  if (!isNaN(currentPrice) && currentPrice > 0 && totalCoins > 0) {
    currentValue = totalCoins * currentPrice;
    unrealizedProfitOrLoss = currentValue - totalCostBasis;
    unrealizedRoiPercent = totalCostBasis > 0 ? (unrealizedProfitOrLoss / totalCostBasis) * 100 : 0;
    isProfitable = unrealizedProfitOrLoss >= 0;
  }

  return {
    totalCoins: Math.round(totalCoins * 100000000) / 100000000,
    totalCostBasis: Math.round(totalCostBasis * 100) / 100,
    averagePricePerCoin: Math.round(avgPrice * 100) / 100,
    currentValue: currentValue !== undefined ? Math.round(currentValue * 100) / 100 : undefined,
    unrealizedProfitOrLoss: unrealizedProfitOrLoss !== undefined ? Math.round(unrealizedProfitOrLoss * 100) / 100 : undefined,
    unrealizedRoiPercent: unrealizedRoiPercent !== undefined ? Math.round(unrealizedRoiPercent * 100) / 100 : undefined,
    isProfitable,
  };
}
