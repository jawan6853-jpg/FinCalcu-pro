/**
 * Rule of 72 Calculator Engine
 * Formula: Years ≈ 72 / Interest Rate, or Rate ≈ 72 / Years
 * Compares approximation against exact logarithmic compounding: ln(2) / ln(1 + r)
 */

export interface RuleOf72Input {
  mode: 'solve-years' | 'solve-rate';
  interestRate?: number; // Annual rate (%) when solve-years
  targetYears?: number; // Target doubling years when solve-rate
  startingAmount?: number; // Optional initial capital ($)
}

export interface RuleOf72Result {
  mode: 'solve-years' | 'solve-rate';
  interestRate: number;
  doublingYearsRule72: number;
  doublingYearsExact: number;
  doublingMonthsRule72: number;
  exactRateRequired?: number;
  variancePercentage: number;
  startingAmount: number;
  doubledAmount: number;
  tripledYearsRule114: number; // Rule of 114 for tripling
  quadrupledYearsRule144: number; // Rule of 144 for 4x
}

import { parseInput } from '../formatters';

export function calculateRuleOf72(input: RuleOf72Input): RuleOf72Result {
  const mode = input.mode || 'solve-years';
  const startAmount = Math.max(0, parseInput(input.startingAmount, 10000));
  const doubledAmount = startAmount * 2;

  if (mode === 'solve-rate') {
    const years = Math.max(0.01, parseInput(input.targetYears, 7.2));
    // Rate ≈ 72 / Years
    const rule72Rate = 72 / years;
    // Exact: (2^(1/years) - 1) * 100
    const exactRate = (Math.pow(2, 1 / years) - 1) * 100;
    const variance = Math.abs(rule72Rate - exactRate);

    return {
      mode,
      interestRate: rule72Rate,
      doublingYearsRule72: years,
      doublingYearsExact: years,
      doublingMonthsRule72: Math.round(years * 12),
      exactRateRequired: exactRate,
      variancePercentage: variance,
      startingAmount: startAmount,
      doubledAmount,
      tripledYearsRule114: rule72Rate > 0 ? 114 / rule72Rate : 0,
      quadrupledYearsRule144: rule72Rate > 0 ? 144 / rule72Rate : 0,
    };
  } else {
    const rawRate = parseInput(input.interestRate, 8);
    const rate = Math.max(0, rawRate);

    if (rate <= 0) {
      return {
        mode,
        interestRate: 0,
        doublingYearsRule72: 0,
        doublingYearsExact: 0,
        doublingMonthsRule72: 0,
        variancePercentage: 0,
        startingAmount: startAmount,
        doubledAmount,
        tripledYearsRule114: 0,
        quadrupledYearsRule144: 0,
      };
    }

    // Years ≈ 72 / Rate
    const rule72Years = 72 / rate;
    const rule72Months = Math.round(rule72Years * 12);

    // Exact logarithmic formula: ln(2) / ln(1 + rate/100)
    const exactYears = Math.log(2) / Math.log(1 + rate / 100);
    const variance = Math.abs(rule72Years - exactYears);

    return {
      mode,
      interestRate: rate,
      doublingYearsRule72: rule72Years,
      doublingYearsExact: exactYears,
      doublingMonthsRule72: rule72Months,
      variancePercentage: variance,
      startingAmount: startAmount,
      doubledAmount,
      tripledYearsRule114: 114 / rate,
      quadrupledYearsRule144: 144 / rate,
    };
  }
}
