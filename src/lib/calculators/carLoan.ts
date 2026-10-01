/**
 * Car Loan / Auto Loan Calculator Engine
 * Calculates: Monthly EMI, Total Interest, Total Vehicle Cost, Financed Amount
 */

export interface CarLoanInput {
  vehiclePrice: number; // Purchase price ($)
  downPayment: number; // Cash down payment ($)
  tradeInValue?: number; // Trade-in allowance ($)
  salesTaxPercent?: number; // State/local sales tax in % (e.g. 6.25%)
  dealerFees?: number; // Title, registration, doc fees ($)
  interestRate: number; // Annual percentage rate APR (%)
  loanTermMonths: number; // Loan duration in months (e.g. 48, 60, 72)
}

export interface CarLoanResult {
  monthlyPayment: number;
  totalLoanAmount: number;
  totalInterestPaid: number;
  totalLoanPayments: number;
  totalOutOfPocketCost: number;
  salesTaxAmount: number;
  monthlyBreakdown: {
    month: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export function calculateCarLoan(input: CarLoanInput): CarLoanResult {
  const price = Math.max(0, Number(input.vehiclePrice) || 0);
  const downPayment = Math.max(0, Number(input.downPayment) || 0);
  const tradeIn = Math.max(0, Number(input.tradeInValue) || 0);
  const taxRate = Math.max(0, Number(input.salesTaxPercent) || 0) / 100;
  const fees = Math.max(0, Number(input.dealerFees) || 0);
  const apr = Math.max(0, Number(input.interestRate) || 0);
  const months = Math.max(1, Math.round(Number(input.loanTermMonths) || 60));

  // In many jurisdictions sales tax applies to price minus trade-in
  const taxableAmount = Math.max(0, price - tradeIn);
  const salesTaxAmount = taxableAmount * taxRate;

  // Financed Principal = Price - DownPayment - TradeIn + SalesTax + Fees
  const totalLoanAmount = Math.max(0, price - downPayment - tradeIn + salesTaxAmount + fees);

  if (totalLoanAmount === 0 || months <= 0) {
    const totalOut = downPayment + tradeIn + salesTaxAmount + fees;
    return {
      monthlyPayment: 0,
      totalLoanAmount: 0,
      totalInterestPaid: 0,
      totalLoanPayments: 0,
      totalOutOfPocketCost: totalOut,
      salesTaxAmount: Math.round(salesTaxAmount * 100) / 100,
      monthlyBreakdown: [],
    };
  }

  // 0% interest case
  if (apr === 0) {
    const monthlyPayment = totalLoanAmount / months;
    const totalLoanPayments = totalLoanAmount;
    const totalOutOfPocketCost = downPayment + tradeIn + totalLoanPayments;

    const breakdown = [];
    let remBalance = totalLoanAmount;
    for (let m = 1; m <= Math.min(months, 84); m++) {
      remBalance = Math.max(0, remBalance - monthlyPayment);
      breakdown.push({
        month: m,
        principal: Math.round(monthlyPayment * 100) / 100,
        interest: 0,
        balance: Math.round(remBalance * 100) / 100,
      });
    }

    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalLoanAmount: Math.round(totalLoanAmount * 100) / 100,
      totalInterestPaid: 0,
      totalLoanPayments: Math.round(totalLoanPayments * 100) / 100,
      totalOutOfPocketCost: Math.round(totalOutOfPocketCost * 100) / 100,
      salesTaxAmount: Math.round(salesTaxAmount * 100) / 100,
      monthlyBreakdown: breakdown,
    };
  }

  const monthlyRate = apr / 100 / 12;
  // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyPayment =
    (totalLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalLoanPayments = monthlyPayment * months;
  const totalInterestPaid = Math.max(0, totalLoanPayments - totalLoanAmount);
  const totalOutOfPocketCost = downPayment + tradeIn + totalLoanPayments;

  // Monthly breakdown schedule
  const monthlyBreakdown: CarLoanResult['monthlyBreakdown'] = [];
  let balance = totalLoanAmount;

  for (let m = 1; m <= months; m++) {
    const interestForMonth = balance * monthlyRate;
    const principalForMonth = monthlyPayment - interestForMonth;
    balance = Math.max(0, balance - principalForMonth);

    monthlyBreakdown.push({
      month: m,
      principal: Math.round(principalForMonth * 100) / 100,
      interest: Math.round(interestForMonth * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });
  }

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalLoanAmount: Math.round(totalLoanAmount * 100) / 100,
    totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    totalLoanPayments: Math.round(totalLoanPayments * 100) / 100,
    totalOutOfPocketCost: Math.round(totalOutOfPocketCost * 100) / 100,
    salesTaxAmount: Math.round(salesTaxAmount * 100) / 100,
    monthlyBreakdown,
  };
}
