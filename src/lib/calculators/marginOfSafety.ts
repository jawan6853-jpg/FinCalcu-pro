/**
 * Margin of Safety Calculator Engine
 * Supports:
 * 1. Value Investing (Benjamin Graham): Margin of Safety = (Intrinsic Value - Market Price) / Intrinsic Value
 * 2. Corporate Finance / Accounting: Margin of Safety = Actual Sales - Break-Even Sales
 */

export type MarginOfSafetyMode = 'investing' | 'accounting';

export interface MarginOfSafetyInput {
  mode: MarginOfSafetyMode;
  // Value Investing params
  intrinsicValue?: number; // Estimated fair/intrinsic value per share ($)
  marketPrice?: number; // Current trading market price per share ($)
  targetSafetyMarginPercent?: number; // Desired margin of safety % (e.g. 25% or 33%)

  // Accounting / Break-Even params
  actualSales?: number; // Actual or projected sales revenue ($)
  breakEvenSales?: number; // Break-even sales revenue ($)
}

export interface MarginOfSafetyResult {
  marginOfSafetyDollars: number;
  marginOfSafetyPercent: number;
  targetBuyPrice?: number; // If investing mode
  isSafe: boolean;
  statusLevel: 'excellent' | 'adequate' | 'risky' | 'dangerous';
  formulaUsed: string;
  summaryExplanation: string;
}

export function calculateMarginOfSafety(input: MarginOfSafetyInput): MarginOfSafetyResult {
  const mode = input.mode || 'investing';

  if (mode === 'accounting') {
    const actual = Math.max(0, Number(input.actualSales) || 0);
    const breakEven = Math.max(0, Number(input.breakEvenSales) || 0);

    const mosDollars = actual - breakEven;
    const mosPercent = actual > 0 ? (mosDollars / actual) * 100 : 0;

    let statusLevel: MarginOfSafetyResult['statusLevel'] = 'adequate';
    if (mosPercent >= 30) statusLevel = 'excellent';
    else if (mosPercent >= 15) statusLevel = 'adequate';
    else if (mosPercent >= 0) statusLevel = 'risky';
    else statusLevel = 'dangerous';

    return {
      marginOfSafetyDollars: Math.round(mosDollars * 100) / 100,
      marginOfSafetyPercent: Math.round(mosPercent * 100) / 100,
      isSafe: mosDollars >= 0,
      statusLevel,
      formulaUsed: 'Margin of Safety = Actual/Projected Sales - Break-Even Sales',
      summaryExplanation:
        mosDollars >= 0
          ? `Sales can fall by $${mosDollars.toLocaleString()} (${mosPercent.toFixed(1)}%) before the company incurs an operating loss.`
          : `Current sales are $${Math.abs(mosDollars).toLocaleString()} below the break-even threshold.`,
    };
  }

  // Value Investing mode
  const intrinsic = Math.max(0, Number(input.intrinsicValue) || 0);
  const market = Math.max(0, Number(input.marketPrice) || 0);
  const targetPct = Math.max(0, Math.min(90, Number(input.targetSafetyMarginPercent) || 25));

  const mosDollars = intrinsic - market;
  const mosPercent = intrinsic > 0 ? (mosDollars / intrinsic) * 100 : 0;

  // Target Buy Price = Intrinsic * (1 - targetMargin / 100)
  const targetBuyPrice = intrinsic * (1 - targetPct / 100);

  let statusLevel: MarginOfSafetyResult['statusLevel'] = 'adequate';
  if (mosPercent >= 30) statusLevel = 'excellent';
  else if (mosPercent >= 15) statusLevel = 'adequate';
  else if (mosPercent >= 0) statusLevel = 'risky';
  else statusLevel = 'dangerous';

  return {
    marginOfSafetyDollars: Math.round(mosDollars * 100) / 100,
    marginOfSafetyPercent: Math.round(mosPercent * 100) / 100,
    targetBuyPrice: Math.round(targetBuyPrice * 100) / 100,
    isSafe: mosDollars > 0,
    statusLevel,
    formulaUsed: 'Margin of Safety (%) = ((Intrinsic Value - Market Price) / Intrinsic Value) × 100',
    summaryExplanation:
      mosDollars > 0
        ? `The asset trades at a ${mosPercent.toFixed(1)}% discount to its estimated intrinsic value of $${intrinsic.toFixed(2)}, providing a buffer against forecast errors.`
        : `The asset trades at a ${Math.abs(mosPercent).toFixed(1)}% premium over intrinsic value (negative margin of safety).`,
  };
}
