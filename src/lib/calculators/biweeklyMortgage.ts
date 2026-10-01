import { parseInput, safeDivision } from '../formatters';

export interface BiweeklyMortgageInput {
  loanAmount: number;
  interestRate: number; // Annual %
  loanTermYears: number; // e.g. 30
}

export interface BiweeklyMortgageResult {
  monthlyPayment: number;
  biweeklyPayment: number; // monthlyPayment / 2
  monthlyTotalInterest: number;
  biweeklyTotalInterest: number;
  interestSaved: number;
  yearsToPayoffBiweekly: number;
  yearsSaved: number;
  monthsSaved: number;
}

export function calculateBiweeklyMortgage(input: BiweeklyMortgageInput): BiweeklyMortgageResult {
  const principal = Math.max(0, parseInput(input.loanAmount, 300000));
  const annualRate = Math.max(0, parseInput(input.interestRate, 6.5));
  const termYears = Math.max(1, parseInput(input.loanTermYears, 30));

  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = termYears * 12;

  // Standard Monthly Payment
  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = safeDivision(principal, totalMonths, 0);
  } else {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    monthlyPayment = safeDivision(principal * (monthlyRate * factor), factor - 1, 0);
  }

  const standardTotalInterest = monthlyPayment * totalMonths - principal;

  // Bi-weekly payment = half of standard monthly payment paid 26 times a year
  // (Effectively 13 full monthly payments per year)
  const biweeklyPayment = monthlyPayment / 2;
  const biweeklyRate = annualRate / 100 / 26;

  let balance = principal;
  let biweeklyPeriods = 0;
  let biweeklyInterestTotal = 0;
  const maxPeriods = termYears * 26;

  while (balance > 0.01 && biweeklyPeriods < maxPeriods) {
    biweeklyPeriods++;
    const interest = balance * biweeklyRate;
    biweeklyInterestTotal += interest;
    const principalPaid = Math.min(balance, biweeklyPayment - interest);
    balance -= principalPaid;
    if (principalPaid <= 0) break; // Avoid infinite loop if payment doesn't cover interest
  }

  const yearsBiweekly = biweeklyPeriods / 26;
  const yearsSaved = Math.max(0, termYears - yearsBiweekly);
  const monthsSaved = Math.round(yearsSaved * 12);
  const interestSaved = Math.max(0, standardTotalInterest - biweeklyInterestTotal);

  return {
    monthlyPayment: Number(monthlyPayment.toFixed(2)),
    biweeklyPayment: Number(biweeklyPayment.toFixed(2)),
    monthlyTotalInterest: Number(standardTotalInterest.toFixed(2)),
    biweeklyTotalInterest: Number(biweeklyInterestTotal.toFixed(2)),
    interestSaved: Number(interestSaved.toFixed(2)),
    yearsToPayoffBiweekly: Number(yearsBiweekly.toFixed(1)),
    yearsSaved: Number(yearsSaved.toFixed(1)),
    monthsSaved,
  };
}
