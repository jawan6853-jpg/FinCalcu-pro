/**
 * Comprehensive Trading Fee Calculator Engine
 * Calculates: Entry & exit transaction fees, net trading P&L, effective fee drag %, and break-even exit price
 */

export interface TradingFeeInput {
  buyPrice: number; // Purchase price per unit ($)
  sellPrice: number; // Expected sell price per unit ($)
  quantity: number; // Total units traded (e.g. 2.5 BTC or 150 shares)
  buyFeePercent: number; // Maker or taker fee on buy (e.g. 0.1%)
  sellFeePercent: number; // Maker or taker fee on sell (e.g. 0.1%)
  flatFeePerOrder?: number; // Optional flat transaction fee ($)
}

export interface TradingFeeResult {
  grossPurchaseCost: number;
  grossSaleRevenue: number;
  buyFeeAmount: number;
  sellFeeAmount: number;
  totalFeesPaid: number;
  grossProfitLoss: number;
  netProfitLoss: number;
  netRoiPercent: number;
  feeDragPercent: number; // Fees paid / Gross Profit or Total Cost
  breakEvenExitPrice: number; // Price required to make exactly $0.00 net P&L
  isProfitable: boolean;
}

export function calculateTradingFee(input: TradingFeeInput): TradingFeeResult {
  const buyPrice = Math.max(0, Number(input.buyPrice) || 0);
  const sellPrice = Math.max(0, Number(input.sellPrice) || 0);
  const qty = Math.max(0, Number(input.quantity) || 0);
  const buyFeeRate = Math.max(0, Number(input.buyFeePercent) || 0) / 100;
  const sellFeeRate = Math.max(0, Number(input.sellFeePercent) || 0) / 100;
  const flatFee = Math.max(0, Number(input.flatFeePerOrder) || 0);

  const grossPurchaseCost = buyPrice * qty;
  const grossSaleRevenue = sellPrice * qty;

  const buyFeeAmount = grossPurchaseCost * buyFeeRate + (grossPurchaseCost > 0 ? flatFee : 0);
  const sellFeeAmount = grossSaleRevenue * sellFeeRate + (grossSaleRevenue > 0 ? flatFee : 0);
  const totalFeesPaid = buyFeeAmount + sellFeeAmount;

  const grossProfitLoss = grossSaleRevenue - grossPurchaseCost;
  const netProfitLoss = grossSaleRevenue - grossPurchaseCost - totalFeesPaid;

  const totalCostBasis = grossPurchaseCost + buyFeeAmount;
  const netRoiPercent = totalCostBasis > 0 ? (netProfitLoss / totalCostBasis) * 100 : 0;

  const feeDragPercent = grossPurchaseCost > 0 ? (totalFeesPaid / grossPurchaseCost) * 100 : 0;

  // Break-even exit price:
  // Revenue - SellFee - FlatFee = BuyCost + BuyFee + FlatFee
  // Price_BE * Qty * (1 - sellFeeRate) - flatFee = BuyCost + buyFeeAmount
  // Price_BE = (grossPurchaseCost + buyFeeAmount + flatFee) / (qty * (1 - sellFeeRate))
  let breakEvenExitPrice = buyPrice;
  const effectiveDenominator = qty * (1 - sellFeeRate);
  if (effectiveDenominator > 0) {
    breakEvenExitPrice = (grossPurchaseCost + buyFeeAmount + flatFee) / effectiveDenominator;
  }

  return {
    grossPurchaseCost: Math.round(grossPurchaseCost * 100) / 100,
    grossSaleRevenue: Math.round(grossSaleRevenue * 100) / 100,
    buyFeeAmount: Math.round(buyFeeAmount * 100) / 100,
    sellFeeAmount: Math.round(sellFeeAmount * 100) / 100,
    totalFeesPaid: Math.round(totalFeesPaid * 100) / 100,
    grossProfitLoss: Math.round(grossProfitLoss * 100) / 100,
    netProfitLoss: Math.round(netProfitLoss * 100) / 100,
    netRoiPercent: Math.round(netRoiPercent * 100) / 100,
    feeDragPercent: Math.round(feeDragPercent * 100) / 100,
    breakEvenExitPrice: Math.round(breakEvenExitPrice * 100) / 100,
    isProfitable: netProfitLoss >= 0,
  };
}
