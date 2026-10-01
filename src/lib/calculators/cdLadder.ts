import { parseInput, safeDivision } from '../formatters';

export interface CdRung {
  maturityMonths: number;
  label: string;
  depositAmount: number;
  apyPercent: number;
  interestEarned: number;
  maturityValue: number;
}

export interface CdLadderInput {
  totalInvestment: number; // e.g. $50,000
  baseApyPercent?: number; // e.g. 4.8%
  rungCount?: number; // 4 or 5 rungs
}

export interface CdLadderResult {
  totalInvestment: number;
  totalInterestEarnedFirstCycle: number;
  averageWeightedApyPercent: number;
  rungs: CdRung[];
  liquiditySchedule: string;
}

export function calculateCdLadder(input: CdLadderInput): CdLadderResult {
  const total = Math.max(0, parseInput(input.totalInvestment, 25000));
  const baseApy = Math.max(0, parseInput(input.baseApyPercent, 4.75));
  const count = Math.min(5, Math.max(3, parseInput(input.rungCount, 5)));

  const perRung = safeDivision(total, count, 0);

  // Standard 5-rung ladder: 12-mo, 24-mo, 36-mo, 48-mo, 60-mo
  const durations = [12, 24, 36, 48, 60].slice(0, count);

  let totalInterest = 0;
  let weightedApySum = 0;

  const rungs: CdRung[] = durations.map((months, idx) => {
    // Term yield curve: slight premium for longer terms
    const apy = baseApy + (idx * 0.15);
    const years = months / 12;
    // Compounded interest: A = P * (1 + r)^t
    const maturityVal = perRung * Math.pow(1 + apy / 100, years);
    const interest = maturityVal - perRung;

    totalInterest += interest;
    weightedApySum += (perRung * apy);

    return {
      maturityMonths: months,
      label: `${months / 12}-Year CD`,
      depositAmount: Number(perRung.toFixed(2)),
      apyPercent: Number(apy.toFixed(2)),
      interestEarned: Number(interest.toFixed(2)),
      maturityValue: Number(maturityVal.toFixed(2)),
    };
  });

  const weightedApy = total > 0 ? weightedApySum / total : 0;

  return {
    totalInvestment: Number(total.toFixed(2)),
    totalInterestEarnedFirstCycle: Number(totalInterest.toFixed(2)),
    averageWeightedApyPercent: Number(weightedApy.toFixed(2)),
    rungs,
    liquiditySchedule: `A CD matures every 12 months, providing continuous access to $${Math.round(perRung).toLocaleString()} plus interest for either reinvestment or immediate liquidity.`,
  };
}
