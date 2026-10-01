import { parseInput, safeDivision } from '../formatters';

export interface WaccInput {
  equityMarketValue: number; // E ($)
  debtMarketValue: number; // D ($)
  costOfEquityPercent: number; // Re (%)
  costOfDebtPercent: number; // Rd (%)
  corporateTaxRatePercent: number; // Tc (%)
}

export interface WaccResult {
  waccPercent: number;
  totalFirmValue: number; // V = E + D
  equityWeightPercent: number; // E / V
  debtWeightPercent: number; // D / V
  afterTaxCostOfDebtPercent: number; // Rd * (1 - Tc)
  summary: string;
}

export function calculateWacc(input: WaccInput): WaccResult {
  const E = Math.max(0, parseInput(input.equityMarketValue, 8000000));
  const D = Math.max(0, parseInput(input.debtMarketValue, 2000000));
  const Re = Math.max(0, parseInput(input.costOfEquityPercent, 10.5));
  const Rd = Math.max(0, parseInput(input.costOfDebtPercent, 5.5));
  const Tc = Math.min(100, Math.max(0, parseInput(input.corporateTaxRatePercent, 21.0)));

  const V = E + D;
  const we = safeDivision(E, V, 1);
  const wd = safeDivision(D, V, 0);

  const afterTaxRd = Rd * (1 - Tc / 100);
  const wacc = we * Re + wd * afterTaxRd;

  return {
    waccPercent: Number(wacc.toFixed(2)),
    totalFirmValue: Number(V.toFixed(2)),
    equityWeightPercent: Number((we * 100).toFixed(2)),
    debtWeightPercent: Number((wd * 100).toFixed(2)),
    afterTaxCostOfDebtPercent: Number(afterTaxRd.toFixed(2)),
    summary: `The firm's composite hurdle rate is ${wacc.toFixed(2)}%. Capital investment projects must yield above this threshold to generate economic value add (EVA).`,
  };
}
