import { parseInput, safeDivision } from '../formatters';

export interface CollegeSavingsInput {
  childCurrentAge: number; // e.g. 5
  collegeStartAge?: number; // e.g. 18
  collegeDurationYears?: number; // e.g. 4
  currentAnnualCollegeCost?: number; // e.g. $30,000 in today's dollars
  tuitionInflationRatePercent?: number; // e.g. 5.0%
  currentSavings?: number; // e.g. $10,000
  expectedAnnualReturnPercent?: number; // e.g. 7.0%
}

export interface CollegeSavingsResult {
  projectedTotalCollegeCost: number;
  monthlyContributionRequired: number;
  futureValueOfCurrentSavings: number;
  projectedShortfallOrSurplus: number;
  yearsUntilCollege: number;
  inflationMultiplier: number;
}

export function calculateCollegeSavings(input: CollegeSavingsInput): CollegeSavingsResult {
  const currentAge = Math.max(0, parseInput(input.childCurrentAge, 4));
  const startAge = Math.max(currentAge + 1, parseInput(input.collegeStartAge, 18));
  const duration = Math.max(1, parseInput(input.collegeDurationYears, 4));
  const annualCostToday = Math.max(0, parseInput(input.currentAnnualCollegeCost, 30000));
  const inflationRate = Math.max(0, parseInput(input.tuitionInflationRatePercent, 4.5));
  const currentSavings = Math.max(0, parseInput(input.currentSavings, 10000));
  const expectedReturn = Math.max(0, parseInput(input.expectedAnnualReturnPercent, 7.0));

  const yearsUntilCollege = startAge - currentAge;
  const totalMonths = yearsUntilCollege * 12;

  // Project future 4-year tuition with inflation
  let projectedTotalCost = 0;
  for (let yr = 0; yr < duration; yr++) {
    const inflatedAnnual = annualCostToday * Math.pow(1 + inflationRate / 100, yearsUntilCollege + yr);
    projectedTotalCost += inflatedAnnual;
  }

  // Future value of current savings: FV = PV * (1 + r)^t
  const fvCurrentSavings = currentSavings * Math.pow(1 + expectedReturn / 100, yearsUntilCollege);

  // Remaining funding target needed from monthly contributions
  const netTargetNeeded = Math.max(0, projectedTotalCost - fvCurrentSavings);

  const monthlyRate = expectedReturn / 100 / 12;
  let monthlyContribution = 0;

  if (totalMonths > 0) {
    if (monthlyRate === 0) {
      monthlyContribution = safeDivision(netTargetNeeded, totalMonths, 0);
    } else {
      // Sinking fund formula: PMT = FV * r / ((1 + r)^n - 1)
      const factor = Math.pow(1 + monthlyRate, totalMonths) - 1;
      monthlyContribution = safeDivision(netTargetNeeded * monthlyRate, factor, 0);
    }
  }

  const inflationMultiplier = Math.pow(1 + inflationRate / 100, yearsUntilCollege);

  return {
    projectedTotalCollegeCost: Number(projectedTotalCost.toFixed(2)),
    monthlyContributionRequired: Number(monthlyContribution.toFixed(2)),
    futureValueOfCurrentSavings: Number(fvCurrentSavings.toFixed(2)),
    projectedShortfallOrSurplus: Number(netTargetNeeded.toFixed(2)),
    yearsUntilCollege,
    inflationMultiplier: Number(inflationMultiplier.toFixed(2)),
  };
}
