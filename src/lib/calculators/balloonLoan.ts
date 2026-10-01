import { parseInput, safeDivision } from '../formatters';

export interface BalloonLoanInput {
  loanAmount: number;
  annualInterestRate: number; // e.g. 6.5%
  amortizationYears: number; // e.g. 30 years
  balloonMaturityYears: number; // e.g. 5 or 7 years
}

export interface BalloonLoanResult {
  monthlyPayment: number;
  balloonPaymentDue: number;
  totalInterestPaidBeforeBalloon: number;
  totalPaidOverMaturity: number;
  remainingPrincipalRatioPercent: number;
  summary: string;
}

export function calculateBalloonLoan(input: BalloonLoanInput): BalloonLoanResult {
  const principal = Math.max(0, parseInput(input.loanAmount, 250000));
  const rateAnnual = Math.max(0, parseInput(input.annualInterestRate, 6.5));
  const amortYears = Math.max(1, parseInput(input.amortizationYears, 30));
  const balloonYears = Math.min(amortYears, Math.max(1, parseInput(input.balloonMaturityYears, 7)));

  const monthlyRate = rateAnnual / 100 / 12;
  const totalMonths = amortYears * 12;
  const balloonMonths = balloonYears * 12;

  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = safeDivision(principal, totalMonths, 0);
  } else {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    monthlyPayment = safeDivision(principal * (monthlyRate * factor), factor - 1, 0);
  }

  // Simulate amortization up to balloon maturity
  let balance = principal;
  let totalInterest = 0;

  for (let m = 1; m <= balloonMonths; m++) {
    const interest = balance * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    totalInterest += interest;
    balance = Math.max(0, balance - principalPaid);
  }

  const balloonPaymentDue = Number(balance.toFixed(2));
  const totalPaidOverMaturity = Number((monthlyPayment * balloonMonths + balloonPaymentDue).toFixed(2));
  const remRatio = safeDivision(balloonPaymentDue, principal, 0) * 100;

  return {
    monthlyPayment: Number(monthlyPayment.toFixed(2)),
    balloonPaymentDue,
    totalInterestPaidBeforeBalloon: Number(totalInterest.toFixed(2)),
    totalPaidOverMaturity,
    remainingPrincipalRatioPercent: Number(remRatio.toFixed(2)),
    summary: `At year ${balloonYears}, a lump-sum balloon payment of $${balloonPaymentDue.toLocaleString()} will be due to extinguish the loan.`,
  };
}
