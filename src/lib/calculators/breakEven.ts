import { sanitizeNumber } from '../formatters';

export interface CryptoBreakEvenInput {
  entryPrice: number;
  quantity: number;
  buyFeePercentage: number;
  sellFeePercentage: number;
  additionalFlatFees: number;
}

export interface CryptoBreakEvenResult {
  entryPrice: number;
  quantity: number;
  initialInvestment: number;
  totalFeesPaidAtEntry: number;
  breakEvenPrice: number;
  requiredPriceIncreasePercent: number;
  totalCostToRecover: number;
}

export function calculateCryptoBreakEven(input: CryptoBreakEvenInput): CryptoBreakEvenResult {
  const entryPrice = Math.max(0, sanitizeNumber(input.entryPrice));
  const quantity = Math.max(0, sanitizeNumber(input.quantity));
  const buyFee = Math.max(0, sanitizeNumber(input.buyFeePercentage)) / 100;
  const sellFee = Math.max(0, sanitizeNumber(input.sellFeePercentage)) / 100;
  const flatFees = Math.max(0, sanitizeNumber(input.additionalFlatFees));

  const grossCost = entryPrice * quantity;
  const buyFeeAmount = grossCost * buyFee;
  const initialInvestment = grossCost + buyFeeAmount + flatFees;

  // Break-even occurs when:
  // Net Exit Proceeds = BreakEvenPrice * Quantity * (1 - sellFee) = InitialInvestment
  // BreakEvenPrice = InitialInvestment / (Quantity * (1 - sellFee))
  const netSellMultiplier = Math.max(0.001, 1 - sellFee);
  let breakEvenPrice = 0;
  if (quantity > 0) {
    breakEvenPrice = initialInvestment / (quantity * netSellMultiplier);
  }

  const requiredPriceIncreasePercent =
    entryPrice > 0 ? ((breakEvenPrice - entryPrice) / entryPrice) * 100 : 0;

  return {
    entryPrice,
    quantity,
    initialInvestment,
    totalFeesPaidAtEntry: buyFeeAmount + flatFees,
    breakEvenPrice,
    requiredPriceIncreasePercent,
    totalCostToRecover: initialInvestment,
  };
}
