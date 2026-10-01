import { parseInput, safeDivision } from '../formatters';

export interface HighYieldSavingsInput {
  initialDeposit: number; // e.g. $15,000
  monthlyDeposit?: number; // e.g. $500
  highYieldApyPercent: number; // e.g. 5.0%
  traditionalBankApyPercent?: number; // e.g. 0.01%
  years: number; // e.g. 5
}

export interface HighYieldSavingsResult {
  highYieldEndingBalance: number;
  highYieldTotalInterest: number;
  traditionalEndingBalance: number;
  traditionalTotalInterest: number;
  additionalInterestEarned: number; // Opportunity gain
  totalDeposited: number;
  multiplierGain: number; // How many times more interest earned
}

export function calculateHighYieldSavings(input: HighYieldSavingsInput): HighYieldSavingsResult {
  const initial = Math.max(0, parseInput(input.initialDeposit, 20000));
  const monthly = Math.max(0, parseInput(input.monthlyDeposit, 300));
  const hysaApy = Math.max(0, parseInput(input.highYieldApyPercent, 4.85));
  const tradApy = Math.max(0, parseInput(input.traditionalBankApyPercent, 0.01));
  const years = Math.max(0.1, parseInput(input.years, 3));

  const totalMonths = Math.round(years * 12);
  const totalDeposited = initial + monthly * totalMonths;

  // Monthly compounding simulation for HYSA
  const rHysa = hysaApy / 100 / 12;
  let balHysa = initial;
  for (let m = 1; m <= totalMonths; m++) {
    balHysa = (balHysa + monthly) * (1 + rHysa);
  }
  const interestHysa = Math.max(0, balHysa - totalDeposited);

  // Monthly compounding for traditional account
  const rTrad = tradApy / 100 / 12;
  let balTrad = initial;
  for (let m = 1; m <= totalMonths; m++) {
    balTrad = (balTrad + monthly) * (1 + rTrad);
  }
  const interestTrad = Math.max(0, balTrad - totalDeposited);

  const extraInterest = Math.max(0, interestHysa - interestTrad);
  const multiplier = interestTrad > 0 ? interestHysa / interestTrad : interestHysa > 0 ? 100 : 1;

  return {
    highYieldEndingBalance: Number(balHysa.toFixed(2)),
    highYieldTotalInterest: Number(interestHysa.toFixed(2)),
    traditionalEndingBalance: Number(balTrad.toFixed(2)),
    traditionalTotalInterest: Number(interestTrad.toFixed(2)),
    additionalInterestEarned: Number(extraInterest.toFixed(2)),
    totalDeposited: Number(totalDeposited.toFixed(2)),
    multiplierGain: Number(multiplier.toFixed(1)),
  };
}
