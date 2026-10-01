import { parseInput, safeDivision } from '../formatters';

export interface HelocPaymentInput {
  creditLineAmount: number;
  drawAmount: number;
  interestRate: number; // Annual %
  drawPeriodYears?: number; // e.g. 10 years (interest-only)
  repaymentPeriodYears?: number; // e.g. 20 years (principal + interest)
}

export interface HelocPaymentResult {
  drawPeriodMonthlyPayment: number; // Interest only
  repaymentPeriodMonthlyPayment: number; // Amortized
  totalInterestDrawPeriod: number;
  totalInterestRepaymentPeriod: number;
  totalCostOfCredit: number;
  drawPeriodYears: number;
  repaymentPeriodYears: number;
}

export function calculateHelocPayment(input: HelocPaymentInput): HelocPaymentResult {
  const lineLimit = Math.max(0, parseInput(input.creditLineAmount, 100000));
  const rawDraw = Math.max(0, parseInput(input.drawAmount, 50000));
  const drawAmount = Math.min(lineLimit > 0 ? lineLimit : rawDraw, rawDraw);
  const annualRate = Math.max(0, parseInput(input.interestRate, 8.5));
  const drawYears = Math.max(1, parseInput(input.drawPeriodYears, 10));
  const repayYears = Math.max(1, parseInput(input.repaymentPeriodYears, 20));

  const monthlyRate = annualRate / 100 / 12;
  const drawMonths = drawYears * 12;
  const repayMonths = repayYears * 12;

  // Draw Period: Interest only
  const drawMonthly = drawAmount * monthlyRate;
  const totalInterestDraw = drawMonthly * drawMonths;

  // Repayment Period: Fully amortized
  let repayMonthly = 0;
  if (monthlyRate === 0) {
    repayMonthly = safeDivision(drawAmount, repayMonths, 0);
  } else {
    const factor = Math.pow(1 + monthlyRate, repayMonths);
    repayMonthly = safeDivision(drawAmount * (monthlyRate * factor), factor - 1, 0);
  }

  const totalRepayPayments = repayMonthly * repayMonths;
  const totalInterestRepay = Math.max(0, totalRepayPayments - drawAmount);
  const totalCost = drawAmount + totalInterestDraw + totalInterestRepay;

  return {
    drawPeriodMonthlyPayment: Number(drawMonthly.toFixed(2)),
    repaymentPeriodMonthlyPayment: Number(repayMonthly.toFixed(2)),
    totalInterestDrawPeriod: Number(totalInterestDraw.toFixed(2)),
    totalInterestRepaymentPeriod: Number(totalInterestRepay.toFixed(2)),
    totalCostOfCredit: Number(totalCost.toFixed(2)),
    drawPeriodYears: drawYears,
    repaymentPeriodYears: repayYears,
  };
}
