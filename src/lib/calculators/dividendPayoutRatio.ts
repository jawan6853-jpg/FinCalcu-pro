import { parseInput, safeDivision } from '../formatters';

export interface DividendPayoutRatioInput {
  dividendPerShare: number; // DPS ($)
  earningsPerShare: number; // EPS ($)
  annualNetIncome?: number; // Total Net Income ($)
  totalDividendsPaid?: number; // Total Dividends ($)
}

export interface DividendPayoutRatioResult {
  payoutRatioPercent: number;
  retentionRatioPercent: number; // 100 - Payout Ratio
  sustainabilityStatus: 'Extremely Safe (<35%)' | 'Healthy & Sustainable (35%-60%)' | 'High / Cautionary (60%-85%)' | 'Unsafe / Unsustainable (>85%)' | 'Deficit Funded (Negative EPS)';
  summary: string;
}

export function calculateDividendPayoutRatio(input: DividendPayoutRatioInput): DividendPayoutRatioResult {
  const dps = Math.max(0, parseInput(input.dividendPerShare, 3.2));
  const eps = parseInput(input.earningsPerShare, 6.4);

  let payoutRatio = 0;
  if (eps <= 0) {
    payoutRatio = 0;
  } else {
    payoutRatio = (dps / eps) * 100;
  }

  const retentionRatio = eps > 0 ? Math.max(0, 100 - payoutRatio) : 0;

  let sustainabilityStatus: DividendPayoutRatioResult['sustainabilityStatus'] = 'Healthy & Sustainable (35%-60%)';
  let summary = '';

  if (eps <= 0) {
    sustainabilityStatus = 'Deficit Funded (Negative EPS)';
    summary = 'Company has net losses (negative EPS); current dividends are financed through cash reserves, asset sales, or borrowed debt.';
  } else if (payoutRatio > 85) {
    sustainabilityStatus = 'Unsafe / Unsustainable (>85%)';
    summary = 'Company returns almost all operating net income to shareholders, leaving minimal retained capital for R&D, balance sheet buffers, or economic downturns.';
  } else if (payoutRatio > 60) {
    sustainabilityStatus = 'High / Cautionary (60%-85%)';
    summary = 'Higher than typical market multiple; common in established mature utilities or REITs, but warrants monitoring against earnings contractions.';
  } else if (payoutRatio >= 35) {
    sustainabilityStatus = 'Healthy & Sustainable (35%-60%)';
    summary = 'Gold standard balance between returning capital to investors and reinvesting for organic operational compounding.';
  } else {
    sustainabilityStatus = 'Extremely Safe (<35%)';
    summary = 'Conservative dividend policy with substantial retained earnings cushion; strong likelihood of future dividend expansion.';
  }

  return {
    payoutRatioPercent: Number(payoutRatio.toFixed(2)),
    retentionRatioPercent: Number(retentionRatio.toFixed(2)),
    sustainabilityStatus,
    summary,
  };
}
