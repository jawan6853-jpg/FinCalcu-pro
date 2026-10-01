import { parseInput, safeDivision } from '../formatters';

export interface WorkingCapitalInput {
  cashAndEquivalents: number;
  accountsReceivable: number;
  inventory: number;
  otherCurrentAssets?: number;
  accountsPayable: number;
  shortTermDebt: number;
  otherCurrentLiabilities?: number;
}

export interface WorkingCapitalResult {
  totalCurrentAssets: number;
  totalCurrentLiabilities: number;
  workingCapital: number;
  currentRatio: number;
  quickRatio: number; // (Cash + AR) / Liabilities
  liquidityHealth: 'Strong Liquidity' | 'Adequate Liquidity' | 'Tight / Borderline' | 'Deficit / High Risk';
  summary: string;
}

export function calculateWorkingCapital(input: WorkingCapitalInput): WorkingCapitalResult {
  const cash = Math.max(0, parseInput(input.cashAndEquivalents, 85000));
  const ar = Math.max(0, parseInput(input.accountsReceivable, 45000));
  const inv = Math.max(0, parseInput(input.inventory, 30000));
  const otherAssets = Math.max(0, parseInput(input.otherCurrentAssets, 0));

  const ap = Math.max(0, parseInput(input.accountsPayable, 40000));
  const stDebt = Math.max(0, parseInput(input.shortTermDebt, 20000));
  const otherLiab = Math.max(0, parseInput(input.otherCurrentLiabilities, 0));

  const totalAssets = cash + ar + inv + otherAssets;
  const totalLiab = ap + stDebt + otherLiab;

  const netWorkingCapital = totalAssets - totalLiab;
  const currentRatio = safeDivision(totalAssets, totalLiab, totalAssets > 0 ? 99 : 0);
  const quickRatio = safeDivision(cash + ar, totalLiab, cash + ar > 0 ? 99 : 0);

  let liquidityHealth: WorkingCapitalResult['liquidityHealth'] = 'Adequate Liquidity';
  let summary = '';

  if (currentRatio < 1.0) {
    liquidityHealth = 'Deficit / High Risk';
    summary = 'Current obligations exceed short-term liquid resources. The business faces potential near-term working capital shortfall.';
  } else if (currentRatio < 1.3) {
    liquidityHealth = 'Tight / Borderline';
    summary = 'Working capital meets minimum operational obligations, but offers little buffer for unexpected receivables delays.';
  } else if (currentRatio <= 2.5) {
    liquidityHealth = 'Adequate Liquidity';
    summary = 'Healthy corporate liquidity profile with strong ability to clear short-term liabilities without external refinancing.';
  } else {
    liquidityHealth = 'Strong Liquidity';
    summary = 'Very strong liquidity buffer; management may assess whether excess cash can be deployed for higher return initiatives.';
  }

  return {
    totalCurrentAssets: Number(totalAssets.toFixed(2)),
    totalCurrentLiabilities: Number(totalLiab.toFixed(2)),
    workingCapital: Number(netWorkingCapital.toFixed(2)),
    currentRatio: Number(currentRatio.toFixed(2)),
    quickRatio: Number(quickRatio.toFixed(2)),
    liquidityHealth,
    summary,
  };
}
