import { sanitizeNumber } from '../formatters';

export interface CryptoProfitInput {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  buyFee: number; // percentage or flat
  sellFee: number; // percentage or flat
  feeType: 'percentage' | 'flat';
}

export interface CryptoProfitResult {
  grossCost: number;
  grossRevenue: number;
  buyFeeAmount: number;
  sellFeeAmount: number;
  totalFees: number;
  totalInvestment: number;
  netRevenue: number;
  netProfit: number;
  roi: number;
  breakEvenSellPrice: number;
  isProfit: boolean;
}

export function calculateCryptoProfit(input: CryptoProfitInput): CryptoProfitResult {
  const buyPrice = Math.max(0, sanitizeNumber(input.buyPrice));
  const sellPrice = Math.max(0, sanitizeNumber(input.sellPrice));
  const quantity = Math.max(0, sanitizeNumber(input.quantity));
  const buyFee = Math.max(0, sanitizeNumber(input.buyFee));
  const sellFee = Math.max(0, sanitizeNumber(input.sellFee));
  const feeType = input.feeType || 'percentage';

  const grossCost = buyPrice * quantity;
  const grossRevenue = sellPrice * quantity;

  let buyFeeAmount = 0;
  let sellFeeAmount = 0;

  if (feeType === 'percentage') {
    buyFeeAmount = grossCost * (buyFee / 100);
    sellFeeAmount = grossRevenue * (sellFee / 100);
  } else {
    buyFeeAmount = buyFee;
    sellFeeAmount = sellFee;
  }

  const totalFees = buyFeeAmount + sellFeeAmount;
  const totalInvestment = grossCost + buyFeeAmount;
  const netRevenue = Math.max(0, grossRevenue - sellFeeAmount);
  const netProfit = netRevenue - totalInvestment;

  const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
  const isProfit = netProfit >= 0;

  // Break-even sell price accounting for sell fee rate
  let breakEvenSellPrice = 0;
  if (quantity > 0) {
    if (feeType === 'percentage') {
      const sellFeeRate = Math.min(0.99, sellFee / 100);
      breakEvenSellPrice = totalInvestment / (quantity * (1 - sellFeeRate));
    } else {
      breakEvenSellPrice = (totalInvestment + sellFeeAmount) / quantity;
    }
  }

  return {
    grossCost,
    grossRevenue,
    buyFeeAmount,
    sellFeeAmount,
    totalFees,
    totalInvestment,
    netRevenue,
    netProfit,
    roi,
    breakEvenSellPrice,
    isProfit,
  };
}
