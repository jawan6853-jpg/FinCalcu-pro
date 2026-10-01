/**
 * Personal Loan Calculator Engine
 * Calculates: Monthly EMI, Total Interest, Total Repayment, Origination Fee
 */

export interface PersonalLoanInput {
  loanAmount: number; // Requested loan sum ($)
  interestRate: number; // Annual Percentage Rate (APR %)
  loanTermMonths: number; // Term in months (e.g. 12, 24, 36, 48, 60)
  originationFeePercent?: number; // Upfront origination fee % (e.g. 1% to 6%)
}

export interface PersonalLoanResult {
  monthlyPayment: number;
  totalPrincipal: number;
  totalInterest: number;
  totalRepayment: number;
  originationFeeAmount: number;
  netDisbursedAmount: number;
  effectiveApr: number;
  amortization: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }[];
}

export function calculatePersonalLoan(input: PersonalLoanInput): PersonalLoanResult {
  const principal = Math.max(0, Number(input.loanAmount) || 0);
  const apr = Math.max(0, Number(input.interestRate) || 0);
  const months = Math.max(1, Math.round(Number(input.loanTermMonths) || 36));
  const origFeePercent = Math.max(0, Number(input.originationFeePercent) || 0);

  const originationFeeAmount = principal * (origFeePercent / 100);
  const netDisbursedAmount = Math.max(0, principal - originationFeeAmount);

  if (principal === 0) {
    return {
      monthlyPayment: 0,
      totalPrincipal: 0,
      totalInterest: 0,
      totalRepayment: 0,
      originationFeeAmount: 0,
      netDisbursedAmount: 0,
      effectiveApr: 0,
      amortization: [],
    };
  }

  // 0% interest case
  if (apr === 0) {
    const monthlyPayment = principal / months;
    const amortization = [];
    let rem = principal;

    for (let m = 1; m <= Math.min(months, 60); m++) {
      rem = Math.max(0, rem - monthlyPayment);
      amortization.push({
        month: m,
        payment: Math.round(monthlyPayment * 100) / 100,
        principal: Math.round(monthlyPayment * 100) / 100,
        interest: 0,
        remainingBalance: Math.round(rem * 100) / 100,
      });
    }

    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPrincipal: principal,
      totalInterest: 0,
      totalRepayment: principal,
      originationFeeAmount: Math.round(originationFeeAmount * 100) / 100,
      netDisbursedAmount: Math.round(netDisbursedAmount * 100) / 100,
      effectiveApr: origFeePercent > 0 ? (origFeePercent / (months / 12)) : 0,
      amortization,
    };
  }

  const r = apr / 100 / 12;
  const monthlyPayment =
    (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalRepayment = monthlyPayment * months;
  const totalInterest = Math.max(0, totalRepayment - principal);

  // Amortization schedule
  const amortization: PersonalLoanResult['amortization'] = [];
  let balance = principal;

  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    const prin = monthlyPayment - interest;
    balance = Math.max(0, balance - prin);

    amortization.push({
      month: m,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(prin * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      remainingBalance: Math.round(balance * 100) / 100,
    });
  }

  // Effective APR accounting for upfront origination deduction
  // APR estimate = nominal APR + (fee% / years)
  const years = months / 12;
  const effectiveApr = years > 0 ? apr + (origFeePercent / years) : apr;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPrincipal: Math.round(principal * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
    originationFeeAmount: Math.round(originationFeeAmount * 100) / 100,
    netDisbursedAmount: Math.round(netDisbursedAmount * 100) / 100,
    effectiveApr: Math.round(effectiveApr * 100) / 100,
    amortization,
  };
}
