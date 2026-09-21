import { sanitizeNumber } from '../formatters';

export interface CryptoTradingFeeInput {
  tradeType: 'buy' | 'sell' | 'roundtrip';
  orderType: 'maker' | 'taker';
  tradeAmount: number; // in USD or currency
  coinPrice?: number;
  feeRatePercentage: number;
}

export interface CryptoTradingFeeResult {
  tradeAmount: number;
  feeRatePercentage: number;
  feeAmount: number;
  netAmountReceived: number;
  effectiveCost: number;
}

export function calculateCryptoTradingFee(input: CryptoTradingFeeInput): CryptoTradingFeeResult {
  const amount = Math.max(0, sanitizeNumber(input.tradeAmount));
  const feeRate = Math.max(0, sanitizeNumber(input.feeRatePercentage));

  let feeMultiplier = 1;
  if (input.tradeType === 'roundtrip') {
    feeMultiplier = 2; // fee on entry and fee on exit
  }

  const feeAmount = amount * (feeRate / 100) * feeMultiplier;
  const netAmountReceived = Math.max(0, amount - feeAmount);
  const effectiveCost = amount + feeAmount;

  return {
    tradeAmount: amount,
    feeRatePercentage: feeRate * feeMultiplier,
    feeAmount,
    netAmountReceived,
    effectiveCost,
  };
}
