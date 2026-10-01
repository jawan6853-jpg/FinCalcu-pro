import { sanitizeNumber } from '../formatters';

export interface MarginInput {
  entryPrice: number;
  positionQuantity: number;
  leverage: number; // e.g. 10x
  maintenanceMarginRate: number; // e.g. 0.5% or 1%
  accountBalance?: number; // optional available balance
}

export interface MarginResult {
  positionValue: number;
  requiredInitialMargin: number;
  maintenanceMargin: number;
  freeMarginRemaining: number;
  marginRequirementPercent: number;
  borrowedAmount: number;
  isValid: boolean;
}

export function calculateMargin(input: MarginInput): MarginResult {
  const entryPrice = Math.max(0, sanitizeNumber(input.entryPrice));
  const quantity = Math.max(0, sanitizeNumber(input.positionQuantity));
  const leverage = Math.max(1, Math.min(125, sanitizeNumber(input.leverage, 10)));
  const mmRate = Math.max(0, Math.min(50, sanitizeNumber(input.maintenanceMarginRate, 0.5))) / 100;
  const balance = Math.max(0, sanitizeNumber(input.accountBalance, 0));

  const positionValue = entryPrice * quantity;
  const requiredInitialMargin = leverage > 0 ? positionValue / leverage : positionValue;
  const maintenanceMargin = positionValue * mmRate;
  const borrowedAmount = Math.max(0, positionValue - requiredInitialMargin);
  const marginRequirementPercent = leverage > 0 ? (1 / leverage) * 100 : 100;

  const freeMarginRemaining = balance > 0 ? Math.max(0, balance - requiredInitialMargin) : 0;

  return {
    positionValue: Math.round(positionValue * 100) / 100,
    requiredInitialMargin: Math.round(requiredInitialMargin * 100) / 100,
    maintenanceMargin: Math.round(maintenanceMargin * 100) / 100,
    freeMarginRemaining: Math.round(freeMarginRemaining * 100) / 100,
    marginRequirementPercent: Math.round(marginRequirementPercent * 100) / 100,
    borrowedAmount: Math.round(borrowedAmount * 100) / 100,
    isValid: entryPrice > 0 && quantity > 0,
  };
}
