/**
 * Loan Comparison Calculator Engine
 * Compares two loan scenarios (Loan A vs Loan B) side-by-side
 */

export interface SingleLoanParams {
  principal: number; // Loan amount ($)
  interestRate: number; // APR %
  termYears: number; // Loan term in years
  originationFeePercent?: number; // Upfront fee %
}

export interface LoanComparisonInput {
  loanA: SingleLoanParams;
  loanB: SingleLoanParams;
}

export interface SingleLoanResult {
  monthlyPayment: number;
  totalPrincipal: number;
  totalInterest: number;
  totalRepayment: number;
  upfrontFees: number;
  totalCostOfLoan: number; // Principal + Interest + Fees
}

export interface LoanComparisonResult {
  loanA: SingleLoanResult;
  loanB: SingleLoanResult;
  monthlyPaymentDiff: number; // Positive means A is higher, negative means B is higher
  totalInterestDiff: number;
  totalCostDiff: number;
  cheaperLoanOverall: 'Loan A' | 'Loan B' | 'Identical';
  lowerMonthlyLoan: 'Loan A' | 'Loan B' | 'Identical';
  summaryInsight: string;
}

function calculateSingleLoan(params: SingleLoanParams = {} as SingleLoanParams): SingleLoanResult {
  const p = Math.max(0, Number(params?.principal) || 0);
  const apr = Math.max(0, Number(params?.interestRate) || 0);
  const years = Math.max(0.5, Number(params?.termYears) || 5);
  const feePct = Math.max(0, Number(params?.originationFeePercent) || 0);

  const months = Math.round(years * 12);
  const upfrontFees = p * (feePct / 100);

  if (p === 0 || months <= 0) {
    return {
      monthlyPayment: 0,
      totalPrincipal: 0,
      totalInterest: 0,
      totalRepayment: 0,
      upfrontFees: 0,
      totalCostOfLoan: 0,
    };
  }

  if (apr === 0) {
    const monthlyPayment = p / months;
    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPrincipal: p,
      totalInterest: 0,
      totalRepayment: p,
      upfrontFees: Math.round(upfrontFees * 100) / 100,
      totalCostOfLoan: Math.round((p + upfrontFees) * 100) / 100,
    };
  }

  const r = apr / 100 / 12;
  const monthlyPayment = (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalRepayment = monthlyPayment * months;
  const totalInterest = Math.max(0, totalRepayment - p);

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPrincipal: Math.round(p * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
    upfrontFees: Math.round(upfrontFees * 100) / 100,
    totalCostOfLoan: Math.round((totalRepayment + upfrontFees) * 100) / 100,
  };
}

export function calculateLoanComparison(input: LoanComparisonInput = {} as LoanComparisonInput): LoanComparisonResult {
  const resA = calculateSingleLoan(input?.loanA);
  const resB = calculateSingleLoan(input?.loanB);

  const monthlyDiff = resA.monthlyPayment - resB.monthlyPayment;
  const interestDiff = resA.totalInterest - resB.totalInterest;
  const costDiff = resA.totalCostOfLoan - resB.totalCostOfLoan;

  let cheaperLoanOverall: 'Loan A' | 'Loan B' | 'Identical' = 'Identical';
  if (Math.abs(costDiff) > 1) {
    cheaperLoanOverall = costDiff < 0 ? 'Loan A' : 'Loan B';
  }

  let lowerMonthlyLoan: 'Loan A' | 'Loan B' | 'Identical' = 'Identical';
  if (Math.abs(monthlyDiff) > 0.05) {
    lowerMonthlyLoan = monthlyDiff < 0 ? 'Loan A' : 'Loan B';
  }

  let summaryInsight = '';
  if (cheaperLoanOverall === 'Loan A') {
    summaryInsight = `Loan A saves you $${Math.abs(costDiff).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in total financing costs over the life of the loan.`;
  } else if (cheaperLoanOverall === 'Loan B') {
    summaryInsight = `Loan B saves you $${Math.abs(costDiff).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in total financing costs over the life of the loan.`;
  } else {
    summaryInsight = 'Both loan options have identical total financing costs.';
  }

  return {
    loanA: resA,
    loanB: resB,
    monthlyPaymentDiff: Math.round(monthlyDiff * 100) / 100,
    totalInterestDiff: Math.round(interestDiff * 100) / 100,
    totalCostDiff: Math.round(costDiff * 100) / 100,
    cheaperLoanOverall,
    lowerMonthlyLoan,
    summaryInsight,
  };
}
