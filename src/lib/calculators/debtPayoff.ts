import { sanitizeNumber } from '../formatters';

export interface DebtPayoffInput {
  balance: number;
  interestRate: number; // annual APR %
  monthlyPayment: number;
}

export interface DebtPayoffMonthPoint {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface DebtPayoffResult {
  monthsToPayoff: number;
  yearsToPayoff: number;
  totalInterestPaid: number;
  totalAmountPaid: number;
  minimumMonthlyPaymentRequired: number;
  isPaymentSufficient: boolean;
  errorMessage?: string;
  schedule: DebtPayoffMonthPoint[];
}

export function calculateDebtPayoff(input: DebtPayoffInput): DebtPayoffResult {
  const balance = Math.max(0, sanitizeNumber(input.balance));
  const apr = Math.max(0, sanitizeNumber(input.interestRate));
  const monthlyPayment = Math.max(0, sanitizeNumber(input.monthlyPayment));

  if (balance <= 0) {
    return {
      monthsToPayoff: 0,
      yearsToPayoff: 0,
      totalInterestPaid: 0,
      totalAmountPaid: 0,
      minimumMonthlyPaymentRequired: 0,
      isPaymentSufficient: true,
      schedule: [],
    };
  }

  const monthlyRate = apr / 100 / 12;
  const initialMonthlyInterest = balance * monthlyRate;

  // If monthly payment doesn't even cover the interest, debt will grow infinitely
  if (apr > 0 && monthlyPayment <= initialMonthlyInterest) {
    return {
      monthsToPayoff: 0,
      yearsToPayoff: 0,
      totalInterestPaid: 0,
      totalAmountPaid: 0,
      minimumMonthlyPaymentRequired: Math.ceil(initialMonthlyInterest + 1),
      isPaymentSufficient: false,
      errorMessage: `Monthly payment must exceed monthly interest charges (${initialMonthlyInterest.toFixed(2)}) to reduce principal.`,
      schedule: [],
    };
  }

  // Handle 0% interest case
  if (apr === 0) {
    if (monthlyPayment <= 0) {
      return {
        monthsToPayoff: 0,
        yearsToPayoff: 0,
        totalInterestPaid: 0,
        totalAmountPaid: balance,
        minimumMonthlyPaymentRequired: 1,
        isPaymentSufficient: false,
        errorMessage: 'Monthly payment must be greater than zero.',
        schedule: [],
      };
    }
    const months = Math.ceil(balance / monthlyPayment);
    const schedule: DebtPayoffMonthPoint[] = [];
    let rem = balance;
    for (let m = 1; m <= months; m++) {
      const pmt = Math.min(rem, monthlyPayment);
      rem -= pmt;
      schedule.push({
        month: m,
        payment: pmt,
        principal: pmt,
        interest: 0,
        balance: Math.max(0, rem),
      });
    }
    return {
      monthsToPayoff: months,
      yearsToPayoff: Math.round((months / 12) * 10) / 10,
      totalInterestPaid: 0,
      totalAmountPaid: balance,
      minimumMonthlyPaymentRequired: 1,
      isPaymentSufficient: true,
      schedule,
    };
  }

  // Standard amortizing debt payoff loop
  let currentBalance = balance;
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;
  const schedule: DebtPayoffMonthPoint[] = [];
  const maxMonths = 1200; // 100 years cutoff

  while (currentBalance > 0.001 && month < maxMonths) {
    month++;
    const interest = currentBalance * monthlyRate;
    let payment = monthlyPayment;

    if (currentBalance + interest < payment) {
      payment = currentBalance + interest;
    }

    const principal = payment - interest;
    currentBalance = Math.max(0, currentBalance - principal);
    totalInterest += interest;
    totalPaid += payment;

    // Record schedule points (downsample for performance if long payoff)
    if (month <= 60 || month % 6 === 0 || currentBalance === 0) {
      schedule.push({
        month,
        payment: Math.round(payment * 100) / 100,
        principal: Math.round(principal * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        balance: Math.round(currentBalance * 100) / 100,
      });
    }
  }

  return {
    monthsToPayoff: month,
    yearsToPayoff: Math.round((month / 12) * 10) / 10,
    totalInterestPaid: Math.round(totalInterest * 100) / 100,
    totalAmountPaid: Math.round(totalPaid * 100) / 100,
    minimumMonthlyPaymentRequired: Math.ceil(initialMonthlyInterest + 1),
    isPaymentSufficient: true,
    schedule,
  };
}
