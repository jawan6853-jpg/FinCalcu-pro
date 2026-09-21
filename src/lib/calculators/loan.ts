import { sanitizeNumber } from '../formatters';

export interface LoanInput {
  principal: number;
  annualInterestRate: number; // percentage
  loanTenureYears: number;
}

export interface AmortizationMonth {
  month: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export interface LoanResult {
  principal: number;
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  interestRatio: number; // percentage of payment that is interest
  schedule: AmortizationMonth[];
}

export function calculateLoanEMI(input: LoanInput): LoanResult {
  const principal = Math.max(0, sanitizeNumber(input.principal));
  const annualRate = Math.max(0, sanitizeNumber(input.annualInterestRate));
  const tenureYears = Math.max(0.1, Math.min(50, sanitizeNumber(input.loanTenureYears)));

  const totalMonths = Math.max(1, Math.round(tenureYears * 12));
  const monthlyRate = annualRate / 12 / 100;

  let monthlyEmi = 0;

  if (monthlyRate === 0) {
    monthlyEmi = principal > 0 ? principal / totalMonths : 0;
  } else {
    // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    monthlyEmi = (principal * monthlyRate * factor) / (factor - 1);
  }

  const totalPayment = monthlyEmi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - principal);
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  // Build first 12 months amortization schedule
  const schedule: AmortizationMonth[] = [];
  let remaining = principal;

  for (let m = 1; m <= Math.min(totalMonths, 36); m++) {
    const interestForMonth = remaining * monthlyRate;
    const principalForMonth = Math.min(remaining, monthlyEmi - interestForMonth);
    remaining = Math.max(0, remaining - principalForMonth);

    schedule.push({
      month: m,
      payment: monthlyEmi,
      principalPaid: principalForMonth,
      interestPaid: interestForMonth,
      remainingBalance: remaining,
    });
  }

  return {
    principal,
    monthlyEmi,
    totalInterest,
    totalPayment,
    interestRatio,
    schedule,
  };
}
