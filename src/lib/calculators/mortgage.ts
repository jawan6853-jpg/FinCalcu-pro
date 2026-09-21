import { sanitizeNumber } from '../formatters';

export interface MortgageInput {
  homePrice: number;
  downPayment: number;
  downPaymentType: 'amount' | 'percentage';
  loanTermYears: number;
  annualInterestRate: number;
  annualPropertyTaxRate: number; // percentage of home price (e.g. 1.2%)
  annualHomeownersInsurance: number; // flat USD/yr (e.g. $1,200)
}

export interface MortgageAmortizationYear {
  year: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  totalPaidToDate: number;
}

export interface MortgageResult {
  homePrice: number;
  downPaymentAmount: number;
  downPaymentPercent: number;
  loanAmount: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  totalMonthlyPayment: number;
  totalInterestPaid: number;
  totalLoanCost: number;
  ltvRatio: number;
  schedule: MortgageAmortizationYear[];
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const homePrice = Math.max(0, sanitizeNumber(input.homePrice));
  const downVal = Math.max(0, sanitizeNumber(input.downPayment));
  const rate = Math.max(0, sanitizeNumber(input.annualInterestRate));
  const termYears = Math.max(1, Math.min(40, sanitizeNumber(input.loanTermYears)));
  const propertyTaxRate = Math.max(0, sanitizeNumber(input.annualPropertyTaxRate)) / 100;
  const annualInsurance = Math.max(0, sanitizeNumber(input.annualHomeownersInsurance));

  let downPaymentAmount = 0;
  let downPaymentPercent = 0;

  if (input.downPaymentType === 'percentage') {
    downPaymentPercent = Math.min(100, downVal);
    downPaymentAmount = homePrice * (downPaymentPercent / 100);
  } else {
    downPaymentAmount = Math.min(homePrice, downVal);
    downPaymentPercent = homePrice > 0 ? (downPaymentAmount / homePrice) * 100 : 0;
  }

  const loanAmount = Math.max(0, homePrice - downPaymentAmount);
  const totalMonths = termYears * 12;
  const monthlyRate = rate / 12 / 100;

  let monthlyPrincipalAndInterest = 0;
  if (monthlyRate === 0) {
    monthlyPrincipalAndInterest = totalMonths > 0 ? loanAmount / totalMonths : 0;
  } else if (loanAmount > 0) {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    monthlyPrincipalAndInterest = (loanAmount * monthlyRate * factor) / (factor - 1);
  }

  const monthlyPropertyTax = (homePrice * propertyTaxRate) / 12;
  const monthlyInsurance = annualInsurance / 12;
  const totalMonthlyPayment =
    monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyInsurance;

  const totalPayments = monthlyPrincipalAndInterest * totalMonths;
  const totalInterestPaid = Math.max(0, totalPayments - loanAmount);
  const totalLoanCost = downPaymentAmount + totalPayments;
  const ltvRatio = homePrice > 0 ? (loanAmount / homePrice) * 100 : 0;

  // Generate Year-by-Year Amortization Schedule
  const schedule: MortgageAmortizationYear[] = [];
  let remaining = loanAmount;
  let totalPaidSoFar = 0;

  for (let y = 1; y <= termYears; y++) {
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;

    for (let m = 1; m <= 12; m++) {
      if (remaining <= 0) break;
      const interestForMonth = remaining * monthlyRate;
      const principalForMonth = Math.min(remaining, monthlyPrincipalAndInterest - interestForMonth);
      remaining = Math.max(0, remaining - principalForMonth);
      yearlyPrincipal += principalForMonth;
      yearlyInterest += interestForMonth;
      totalPaidSoFar += (principalForMonth + interestForMonth);
    }

    schedule.push({
      year: y,
      principalPaid: yearlyPrincipal,
      interestPaid: yearlyInterest,
      remainingBalance: remaining,
      totalPaidToDate: totalPaidSoFar,
    });
  }

  return {
    homePrice,
    downPaymentAmount,
    downPaymentPercent,
    loanAmount,
    monthlyPrincipalAndInterest,
    monthlyPropertyTax,
    monthlyInsurance,
    totalMonthlyPayment,
    totalInterestPaid,
    totalLoanCost,
    ltvRatio,
    schedule,
  };
}
