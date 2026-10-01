import { parseInput, safeDivision } from '../formatters';

export interface ImpermanentLossInput {
  tokenAInitialPrice: number;
  tokenAFinalPrice: number;
  tokenBInitialPrice?: number;
  tokenBFinalPrice?: number;
  initialDepositUsd?: number;
}

export interface ImpermanentLossResult {
  impermanentLossPercent: number; // e.g. -2.05%
  impermanentLossUsd: number;
  hodlValueUsd: number;
  poolValueUsd: number;
  priceRatio: number;
  summary: string;
}

export function calculateImpermanentLoss(input: ImpermanentLossInput): ImpermanentLossResult {
  const pA0 = Math.max(0.000001, parseInput(input.tokenAInitialPrice, 100));
  const pA1 = Math.max(0.000001, parseInput(input.tokenAFinalPrice, 200));
  const pB0 = Math.max(0.000001, parseInput(input.tokenBInitialPrice, 1));
  const pB1 = Math.max(0.000001, parseInput(input.tokenBFinalPrice, 1));
  const deposit = Math.max(0, parseInput(input.initialDepositUsd, 1000));

  // Relative price change k = (pA1 / pA0) / (pB1 / pB0)
  const ratioA = pA1 / pA0;
  const ratioB = pB1 / pB0;
  const k = safeDivision(ratioA, ratioB, 1);

  // Impermanent Loss standard AMM formula: IL = (2 * sqrt(k) / (1 + k)) - 1
  let ilDecimal = 0;
  if (k > 0) {
    ilDecimal = (2 * Math.sqrt(k)) / (1 + k) - 1;
  }
  const ilPercent = Number((ilDecimal * 100).toFixed(4));

  // HODL value: 50% in token A, 50% in token B
  const hodlA = (deposit * 0.5) * ratioA;
  const hodlB = (deposit * 0.5) * ratioB;
  const hodlValueUsd = Number((hodlA + hodlB).toFixed(2));

  // Pool Value = HODL Value * (1 + IL)
  const poolValueUsd = Number((hodlValueUsd * (1 + ilDecimal)).toFixed(2));
  const ilUsd = Number((hodlValueUsd - poolValueUsd).toFixed(2));

  let summary = 'No divergence occurred between paired assets.';
  if (Math.abs(ilPercent) > 0.0001) {
    summary = `Asset divergence reduced pool value by ${Math.abs(ilPercent).toFixed(2)}% compared to holding the assets outside the AMM liquidity pool.`;
  }

  return {
    impermanentLossPercent: ilPercent,
    impermanentLossUsd: ilUsd,
    hodlValueUsd,
    poolValueUsd,
    priceRatio: Number(k.toFixed(4)),
    summary,
  };
}
