/**
 * Crypto Break-Even ROI Calculator Engine
 * Calculates: Break-Even Exit Price accounting for round-trip exchange fees (maker/taker)
 * Also calculates target exit price required to reach user-specified net ROI % or net profit $
 * Formula: P_breakEven = P_buy * [(1 + fee_buy) / (1 - fee_sell)]
 */

export interface CryptoBreakEvenROIInput {
  entryPrice: number; // Purchase price per coin ($ e.g. 50,000)
  quantity?: number; // Number of coins/tokens (default 1)
  totalInvestmentCapital?: number; // If quantity not specified, capital in fiat ($)
  buyFeePercentage: number; // Maker or taker entry fee % (e.g. 0.1% or 0.5%)
  sellFeePercentage: number; // Maker or taker exit fee % (e.g. 0.1% or 0.5%)
  targetRoiPercentage?: number; // Desired net return % (e.g. 15%)
  targetProfitDollars?: number; // Desired net cash profit ($ optional)
}

export interface CryptoBreakEvenROIResult {
  entryPrice: number;
  quantity: number;
  totalFiatInvested: number;
  entryFeePaid: number;
  totalCostOutlay: number; // Invested + Buy Fee
  breakEvenExitPrice: number;
  priceIncreaseToBreakEvenPercentage: number;
  breakEvenSellFeePaid: number;
  totalRoundTripFeesAtBreakEven: number;
  targetExitPriceForRoi: number;
  targetExitPriceForProfit: number | null;
  netProfitAtTargetRoi: number;
  totalFeesAtTargetRoi: number;
}

export function calculateCryptoBreakEvenROI(input: CryptoBreakEvenROIInput): CryptoBreakEvenROIResult {
  const pBuy = Math.max(0.00000001, Number(input.entryPrice) || 60000);
  const buyFee = Math.max(0, Number(input.buyFeePercentage) || 0.1) / 100;
  const sellFee = Math.max(0, Math.min(0.5, Number(input.sellFeePercentage) || 0.1)) / 100;
  const targetRoi = Math.max(0, Number(input.targetRoiPercentage) || 10) / 100;

  let qty = Number(input.quantity) || 0;
  if (qty <= 0 && input.totalInvestmentCapital && input.totalInvestmentCapital > 0) {
    qty = input.totalInvestmentCapital / pBuy;
  }
  if (qty <= 0) qty = 1.0;

  const totalFiatInvested = qty * pBuy;
  const entryFeePaid = totalFiatInvested * buyFee;
  const totalCostOutlay = totalFiatInvested + entryFeePaid;

  // Exact break-even formula:
  // Net Exit Proceeds = P_exit * Q * (1 - sellFee) = TotalCostOutlay
  // P_breakEven = TotalCostOutlay / (Q * (1 - sellFee)) = P_buy * (1 + buyFee) / (1 - sellFee)
  const breakEvenExitPrice = (pBuy * (1 + buyFee)) / (1 - sellFee);
  const priceIncreaseToBreakEvenPercentage = ((breakEvenExitPrice - pBuy) / pBuy) * 100;

  const breakEvenSellFeePaid = qty * breakEvenExitPrice * sellFee;
  const totalRoundTripFeesAtBreakEven = entryFeePaid + breakEvenSellFeePaid;

  // Target Exit Price for Net ROI:
  // Net Proceeds = TotalCostOutlay * (1 + targetRoi)
  // P_target * Q * (1 - sellFee) = TotalCostOutlay * (1 + targetRoi)
  // P_target = [TotalCostOutlay * (1 + targetRoi)] / [Q * (1 - sellFee)]
  const targetExitPriceForRoi = (totalCostOutlay * (1 + targetRoi)) / (qty * (1 - sellFee));
  const targetSellFee = qty * targetExitPriceForRoi * sellFee;
  const totalFeesAtTargetRoi = entryFeePaid + targetSellFee;
  const netProfitAtTargetRoi = (qty * targetExitPriceForRoi - totalFeesAtTargetRoi) - totalFiatInvested;

  // Target Exit Price for specific Dollar Profit:
  let targetExitPriceForProfit: number | null = null;
  if (input.targetProfitDollars && Number(input.targetProfitDollars) > 0) {
    const targetProfit = Number(input.targetProfitDollars);
    targetExitPriceForProfit = (totalCostOutlay + targetProfit) / (qty * (1 - sellFee));
  }

  return {
    entryPrice: pBuy,
    quantity: qty,
    totalFiatInvested,
    entryFeePaid,
    totalCostOutlay,
    breakEvenExitPrice,
    priceIncreaseToBreakEvenPercentage,
    breakEvenSellFeePaid,
    totalRoundTripFeesAtBreakEven,
    targetExitPriceForRoi,
    targetExitPriceForProfit,
    netProfitAtTargetRoi,
    totalFeesAtTargetRoi,
  };
}
