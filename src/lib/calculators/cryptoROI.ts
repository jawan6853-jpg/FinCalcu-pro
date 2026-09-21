import { sanitizeNumber } from '../formatters';

export interface CryptoROIInput {
  initialInvestment: number;
  currentValue: number;
}

export interface CryptoROIResult {
  initialInvestment: number;
  currentValue: number;
  netProfit: number;
  roi: number;
  multiplier: number;
  isProfit: boolean;
}

export function calculateCryptoROI(input: CryptoROIInput): CryptoROIResult {
  const initial = Math.max(0, sanitizeNumber(input.initialInvestment));
  const current = Math.max(0, sanitizeNumber(input.currentValue));

  const netProfit = current - initial;
  const roi = initial > 0 ? (netProfit / initial) * 100 : 0;
  const multiplier = initial > 0 ? current / initial : 0;

  return {
    initialInvestment: initial,
    currentValue: current,
    netProfit,
    roi,
    multiplier,
    isProfit: netProfit >= 0,
  };
}
