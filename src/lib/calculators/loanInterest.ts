import { sanitizeNumber } from '../formatters';

export interface LoanInterestInput {
  loanAmount: number;
  interestRate: number; // annual %
  loanTermYears: number;
  calculationType: 'amortized' | 'simple'; // Reducing balance vs Simple interest
}

export interface LoanInterestResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  interestToPrincipalRatio: number; // percentage
  effectiveApr: number;
  isValid: boolean;
}

export function calculateLoanInterest(input: LoanInterestInput): LoanInterestResult {
  const principal = Math.max(0, sanitizeNumber(input.loanAmount));
  const rate = Math.max(0, sanitizeNumber(input.interestRate));
  const years = Math.max(0.1, Math.min(50, sanitizeNumber(input.loanTermYears, 5)));
  const type = input.calculationType || 'amortized';

  const totalMonths = Math.round(years * 12);

  if (principal === 0 || totalMonths === 0) {
    return {
      monthlyPayment: 0,
      totalInterest: 0,
      totalPayment: 0,
      interestToPrincipalRatio: 0,
      effectiveApr: 0,
      isValid: true,
    };
  }

  // Explicitly handle 0% interest
  if (rate === 0) {
    const monthlyPayment = principal / totalMonths;
    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: 0,
      totalPayment: principal,
      interestToPrincipalRatio: 0,
      effectiveApr: 0,
      isValid: true,
    };
  }

  if (type === 'simple') {
    // Simple / flat rate: Interest = P * r * t
    const totalInterest = principal * (rate / 100) * years;
    const totalPayment = principal + totalInterest;
    const monthlyPayment = totalPayment / totalMonths;
    const ratio = (totalInterest / principal) * 100;

    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      interestToPrincipalRatio: Math.round(ratio * 100) / 100,
      effectiveApr: rate,
      isValid: true,
    };
  }

  // Standard reducing balance amortization
  const monthlyRate = rate / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const monthlyPayment = (principal * (monthlyRate * factor)) / (factor - 1);
  const totalPayment = monthlyPayment * totalMonths;
  const totalInterest = Math.max(0, totalPayment - principal);
  const ratio = principal > 0 ? (totalInterest / principal) * 100 : 0;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    interestToPrincipalRatio: Math.round(ratio * 100) / 100,
    effectiveApr: rate,
    isValid: true,
  };
}
