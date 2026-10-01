import { sanitizeNumber } from '../formatters';

export interface AmortizationInput {
  loanAmount: number;
  interestRate: number; // annual %
  loanTermYears: number;
  extraMonthlyPayment?: number;
}

export interface AmortizationRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  totalInterestPaid: number;
  balance: number;
}

export interface AmortizationAnnualRow {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  endingBalance: number;
}

export interface AmortizationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  payoffMonths: number;
  originalMonths: number;
  monthsSaved: number;
  interestSaved: number;
  schedule: AmortizationRow[];
  annualSchedule: AmortizationAnnualRow[];
}

export function calculateAmortization(input: AmortizationInput): AmortizationResult {
  const principal = Math.max(0, sanitizeNumber(input.loanAmount));
  const rate = Math.max(0, sanitizeNumber(input.interestRate));
  const years = Math.max(0.1, Math.min(50, sanitizeNumber(input.loanTermYears, 30)));
  const extraPayment = Math.max(0, sanitizeNumber(input.extraMonthlyPayment, 0));

  const totalMonths = Math.round(years * 12);
  const monthlyRate = rate / 100 / 12;

  // Monthly base payment calculation
  let baseMonthlyPayment = 0;
  if (totalMonths > 0) {
    if (rate === 0) {
      baseMonthlyPayment = principal / totalMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      baseMonthlyPayment = (principal * (monthlyRate * factor)) / (factor - 1);
    }
  }

  // Without extra payments benchmark for savings calculation
  let originalTotalInterest = 0;
  if (rate === 0) {
    originalTotalInterest = 0;
  } else {
    originalTotalInterest = Math.max(0, baseMonthlyPayment * totalMonths - principal);
  }

  // Generate complete schedule with extra payment support
  const schedule: AmortizationRow[] = [];
  const annualSchedule: AmortizationAnnualRow[] = [];

  let currentBalance = principal;
  let runningTotalInterest = 0;
  let runningTotalPaid = 0;
  let month = 0;

  let yearlyPrincipal = 0;
  let yearlyInterest = 0;
  let yearlyPaid = 0;

  while (currentBalance > 0.001 && month < totalMonths * 2) {
    month++;
    const interest = currentBalance * monthlyRate;
    let actualPayment = baseMonthlyPayment + extraPayment;

    if (currentBalance + interest < actualPayment) {
      actualPayment = currentBalance + interest;
    }

    const principalPaid = actualPayment - interest;
    currentBalance = Math.max(0, currentBalance - principalPaid);
    runningTotalInterest += interest;
    runningTotalPaid += actualPayment;

    yearlyPrincipal += principalPaid;
    yearlyInterest += interest;
    yearlyPaid += actualPayment;

    schedule.push({
      period: month,
      payment: Math.round(actualPayment * 100) / 100,
      principal: Math.round(principalPaid * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      totalInterestPaid: Math.round(runningTotalInterest * 100) / 100,
      balance: Math.round(currentBalance * 100) / 100,
    });

    if (month % 12 === 0 || currentBalance === 0) {
      const currentYear = Math.ceil(month / 12);
      annualSchedule.push({
        year: currentYear,
        principalPaid: Math.round(yearlyPrincipal * 100) / 100,
        interestPaid: Math.round(yearlyInterest * 100) / 100,
        totalPaid: Math.round(yearlyPaid * 100) / 100,
        endingBalance: Math.round(currentBalance * 100) / 100,
      });
      yearlyPrincipal = 0;
      yearlyInterest = 0;
      yearlyPaid = 0;
    }
  }

  const monthsSaved = Math.max(0, totalMonths - month);
  const interestSaved = Math.max(0, originalTotalInterest - runningTotalInterest);

  return {
    monthlyPayment: Math.round(baseMonthlyPayment * 100) / 100,
    totalPayment: Math.round(runningTotalPaid * 100) / 100,
    totalInterest: Math.round(runningTotalInterest * 100) / 100,
    payoffMonths: month,
    originalMonths: totalMonths,
    monthsSaved,
    interestSaved: Math.round(interestSaved * 100) / 100,
    schedule,
    annualSchedule,
  };
}
