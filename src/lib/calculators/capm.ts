import { parseInput, safeDivision } from '../formatters';

export interface CapmInput {
  riskFreeRatePercent: number; // Rf (e.g. 4.2% 10-yr Treasury)
  beta: number; // Beta (e.g. 1.25)
  expectedMarketReturnPercent: number; // Rm (e.g. 10.0% S&P 500)
}

export interface CapmResult {
  expectedReturnPercent: number; // E(R)
  equityRiskPremiumPercent: number; // Rm - Rf
  assetRiskPremiumPercent: number; // Beta * (Rm - Rf)
  riskProfile: 'Aggressive / High Beta' | 'Market Neutral' | 'Defensive / Low Beta' | 'Negative Beta / Inverse';
  interpretation: string;
}

export function calculateCapm(input: CapmInput): CapmResult {
  const rf = parseInput(input.riskFreeRatePercent, 4.2);
  const beta = parseInput(input.beta, 1.2);
  const rm = parseInput(input.expectedMarketReturnPercent, 10.0);

  // Equity Risk Premium = Rm - Rf
  const marketRiskPremium = rm - rf;
  // Asset Risk Premium = Beta * (Rm - Rf)
  const assetRiskPremium = beta * marketRiskPremium;
  // CAPM Expected Return = Rf + Beta * (Rm - Rf)
  const expectedReturn = rf + assetRiskPremium;

  let riskProfile: CapmResult['riskProfile'] = 'Aggressive / High Beta';
  let interpretation = '';

  if (beta < 0) {
    riskProfile = 'Negative Beta / Inverse';
    interpretation = 'The asset moves inversely to broader equity markets, acting as a hedging instrument or short vehicle.';
  } else if (beta < 0.8) {
    riskProfile = 'Defensive / Low Beta';
    interpretation = 'Exhibits significantly lower volatility than the broad market, common in utility, consumer staple, and dividend-yielding equities.';
  } else if (beta <= 1.15) {
    riskProfile = 'Market Neutral';
    interpretation = 'Closely mirrors general equity index swings with benchmark-equivalent systematic risk.';
  } else {
    riskProfile = 'Aggressive / High Beta';
    interpretation = 'Amplifies broader market movements with above-average systematic volatility, typical of growth tech and cyclical assets.';
  }

  return {
    expectedReturnPercent: Number(expectedReturn.toFixed(2)),
    equityRiskPremiumPercent: Number(marketRiskPremium.toFixed(2)),
    assetRiskPremiumPercent: Number(assetRiskPremium.toFixed(2)),
    riskProfile,
    interpretation,
  };
}
