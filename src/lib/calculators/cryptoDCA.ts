import { sanitizeNumber } from '../formatters';

export interface CryptoDCAInput {
  initialInvestment: number;
  recurringInvestment: number;
  periods: number;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  averagePurchasePrice: number;
  currentPrice: number;
}

export interface DCASchedulePoint {
  period: number;
  totalInvested: number;
  totalCrypto: number;
  currentValue: number;
  profit: number;
}

export interface CryptoDCAResult {
  totalInvested: number;
  cryptoAcquired: number;
  currentValue: number;
  netProfit: number;
  roi: number;
  isProfit: boolean;
  schedule: DCASchedulePoint[];
}

export function calculateCryptoDCA(input: CryptoDCAInput): CryptoDCAResult {
  const initial = Math.max(0, sanitizeNumber(input.initialInvestment));
  const recurring = Math.max(0, sanitizeNumber(input.recurringInvestment));
  const periods = Math.max(1, Math.min(360, Math.floor(sanitizeNumber(input.periods))));
  const avgPrice = Math.max(0.000001, sanitizeNumber(input.averagePurchasePrice));
  const currentPrice = Math.max(0, sanitizeNumber(input.currentPrice));

  const recurringTotal = recurring * periods;
  const totalInvested = initial + recurringTotal;
  const cryptoAcquired = totalInvested / avgPrice;
  const currentValue = cryptoAcquired * currentPrice;
  const netProfit = currentValue - totalInvested;
  const roi = totalInvested > 0 ? (netProfit / totalInvested) * 100 : 0;

  // Build schedule
  const schedule: DCASchedulePoint[] = [];
  const stepCount = Math.min(periods, 12);
  const stepSize = Math.max(1, Math.floor(periods / stepCount));

  for (let i = 1; i <= periods; i += stepSize) {
    const invSoFar = initial + recurring * i;
    const cryptoSoFar = invSoFar / avgPrice;
    const valSoFar = cryptoSoFar * currentPrice;
    schedule.push({
      period: i,
      totalInvested: invSoFar,
      totalCrypto: cryptoSoFar,
      currentValue: valSoFar,
      profit: valSoFar - invSoFar,
    });
  }

  if (schedule.length === 0 || schedule[schedule.length - 1].period !== periods) {
    schedule.push({
      period: periods,
      totalInvested,
      totalCrypto: cryptoAcquired,
      currentValue,
      profit: netProfit,
    });
  }

  return {
    totalInvested,
    cryptoAcquired,
    currentValue,
    netProfit,
    roi,
    isProfit: netProfit >= 0,
    schedule,
  };
}
