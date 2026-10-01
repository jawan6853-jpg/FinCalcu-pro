/**
 * Crypto ROI Calculator Engine
 * Formula: ROI = ((Final Value - Investment) / Investment) × 100
 * Calculates: Investment Amount, Final Portfolio Value, Net Profit/Loss, ROI %, and Capital Multiple
 */

export interface Batch4CryptoROIInput {
  mode?: 'by-amount' | 'by-token-price';
  investmentAmount?: number; // Total fiat capital ($)
  finalValue?: number; // Current/final fiat portfolio value ($)
  tokenQuantity?: number; // Number of coins/tokens
  buyPricePerToken?: number; // Initial buy price ($)
  sellPricePerToken?: number; // Current/exit price ($)
  fees?: number; // Exchange and network gas fees ($)
}

export interface Batch4CryptoROIResult {
  investmentAmount: number;
  finalValue: number;
  fees: number;
  netProfit: number;
  roiPercent: number;
  capitalMultiplier: number;
  isProfit: boolean;
}

export function calculateBatch4CryptoROI(input: Batch4CryptoROIInput): Batch4CryptoROIResult {
  const mode = input.mode || 'by-amount';
  const fees = Math.max(0, Number(input.fees) || 0);

  let invested = 0;
  let finalVal = 0;

  if (mode === 'by-token-price') {
    const qty = Math.max(0, Number(input.tokenQuantity) || 0);
    const buyP = Math.max(0, Number(input.buyPricePerToken) || 0);
    const sellP = Math.max(0, Number(input.sellPricePerToken) || 0);
    invested = qty * buyP;
    finalVal = qty * sellP;
  } else {
    invested = Math.max(0, Number(input.investmentAmount) || 0);
    finalVal = Math.max(0, Number(input.finalValue) || 0);
  }

  const netProfit = finalVal - invested - fees;
  const totalOutlay = invested + fees;
  const roi = totalOutlay > 0 ? (netProfit / totalOutlay) * 100 : 0;
  const multiplier = invested > 0 ? finalVal / invested : 0;

  return {
    investmentAmount: invested,
    finalValue: finalVal,
    fees,
    netProfit,
    roiPercent: roi,
    capitalMultiplier: multiplier,
    isProfit: netProfit >= 0,
  };
}
