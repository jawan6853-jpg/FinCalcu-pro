/**
 * Extra Loan Payment Calculator Engine
 * Calculates: Interest saved, payoff time reduced, new amortization schedule with extra payments
 */

export interface ExtraPaymentInput {
  loanBalance: number; // Remaining loan principal ($)
  interestRate: number; // APR % (e.g. 6.5%)
  remainingYears: number; // Remaining term in years
  extraMonthlyPayment?: number; // Optional recurring extra monthly payment ($)
  extraAnnualPayment?: number; // Optional extra yearly payment made every 12 months ($)
  oneTimeLumpSum?: number; // Optional one-time prepayment ($)
  lumpSumMonth?: number; // Month in which lump sum is applied (default: 1)
}

export interface ExtraPaymentResult {
  originalMonthlyPayment: number;
  originalTotalInterest: number;
  originalPayoffMonths: number;
  newMonthlyPayment: number;
  newTotalInterest: number;
  newPayoffMonths: number;
  totalInterestSaved: number;
  monthsSaved: number;
  yearsSaved: number;
  earlyPayoffDateText: string;
  comparisonSchedule: {
    year: number;
    originalBalance: number;
    acceleratedBalance: number;
    cumulativeSavings: number;
  }[];
}

export function calculateExtraPayment(input: ExtraPaymentInput): ExtraPaymentResult {
  const balance = Math.max(0, Number(input.loanBalance) || 0);
  const apr = Math.max(0, Number(input.interestRate) || 0);
  const years = Math.max(0.5, Number(input.remainingYears) || 25);
  const extraMonthly = Math.max(0, Number(input.extraMonthlyPayment) || 0);
  const extraAnnual = Math.max(0, Number(input.extraAnnualPayment) || 0);
  const lumpSum = Math.max(0, Number(input.oneTimeLumpSum) || 0);
  const lumpMonth = Math.max(1, Math.round(Number(input.lumpSumMonth) || 1));

  const totalOriginalMonths = Math.round(years * 12);
  const monthlyRate = apr / 100 / 12;

  // Base monthly payment calculation
  let baseMonthlyPayment = 0;
  if (monthlyRate === 0) {
    baseMonthlyPayment = balance / totalOriginalMonths;
  } else {
    baseMonthlyPayment =
      (balance * monthlyRate * Math.pow(1 + monthlyRate, totalOriginalMonths)) /
      (Math.pow(1 + monthlyRate, totalOriginalMonths) - 1);
  }

  // 1. Simulate standard loan
  let origBalance = balance;
  let originalTotalInterest = 0;
  let originalMonthsCount = 0;

  while (origBalance > 0.01 && originalMonthsCount < totalOriginalMonths + 24) {
    originalMonthsCount++;
    const interest = origBalance * monthlyRate;
    originalTotalInterest += interest;
    const principalPaid = Math.min(origBalance, baseMonthlyPayment - interest);
    origBalance = Math.max(0, origBalance - principalPaid);
  }

  // 2. Simulate accelerated loan with extra payments
  let accBalance = balance;
  let newTotalInterest = 0;
  let newMonthsCount = 0;
  const yearlySnapshots: {
    year: number;
    originalBalance: number;
    acceleratedBalance: number;
    cumulativeSavings: number;
  }[] = [];

  // Track parallel standard for comparison graph
  let runningOrigBal = balance;
  let runningOrigInterest = 0;

  while (accBalance > 0.01 && newMonthsCount < totalOriginalMonths + 24) {
    newMonthsCount++;

    // Track standard loan for this month too
    if (runningOrigBal > 0.01) {
      const origInterest = runningOrigBal * monthlyRate;
      runningOrigInterest += origInterest;
      const origPrin = Math.min(runningOrigBal, baseMonthlyPayment - origInterest);
      runningOrigBal = Math.max(0, runningOrigBal - origPrin);
    }

    // Accelerated loan payment
    const interest = accBalance * monthlyRate;
    newTotalInterest += interest;

    let extraThisMonth = extraMonthly;
    if (newMonthsCount % 12 === 0) {
      extraThisMonth += extraAnnual;
    }
    if (newMonthsCount === lumpMonth) {
      extraThisMonth += lumpSum;
    }

    const scheduledPayment = baseMonthlyPayment + extraThisMonth;
    const principalPaid = Math.min(accBalance, scheduledPayment - interest);
    accBalance = Math.max(0, accBalance - principalPaid);

    // Save annual snapshot
    if (newMonthsCount % 12 === 0 || accBalance === 0) {
      const yr = Math.ceil(newMonthsCount / 12);
      const exists = yearlySnapshots.some((s) => s.year === yr);
      if (!exists && yr <= Math.ceil(totalOriginalMonths / 12)) {
        yearlySnapshots.push({
          year: yr,
          originalBalance: Math.round(runningOrigBal),
          acceleratedBalance: Math.round(accBalance),
          cumulativeSavings: Math.round(Math.max(0, runningOrigInterest - newTotalInterest)),
        });
      }
    }
  }

  const totalInterestSaved = Math.max(0, originalTotalInterest - newTotalInterest);
  const monthsSaved = Math.max(0, originalMonthsCount - newMonthsCount);
  const yearsSaved = Math.round((monthsSaved / 12) * 10) / 10;

  const ySavedInt = Math.floor(monthsSaved / 12);
  const mSavedRem = monthsSaved % 12;
  let earlyPayoffText = '';
  if (ySavedInt > 0 && mSavedRem > 0) {
    earlyPayoffText = `${ySavedInt} years and ${mSavedRem} months earlier`;
  } else if (ySavedInt > 0) {
    earlyPayoffText = `${ySavedInt} years earlier`;
  } else if (mSavedRem > 0) {
    earlyPayoffText = `${mSavedRem} months earlier`;
  } else {
    earlyPayoffText = 'Same schedule';
  }

  return {
    originalMonthlyPayment: Math.round(baseMonthlyPayment * 100) / 100,
    originalTotalInterest: Math.round(originalTotalInterest * 100) / 100,
    originalPayoffMonths: originalMonthsCount,
    newMonthlyPayment: Math.round((baseMonthlyPayment + extraMonthly) * 100) / 100,
    newTotalInterest: Math.round(newTotalInterest * 100) / 100,
    newPayoffMonths: newMonthsCount,
    totalInterestSaved: Math.round(totalInterestSaved * 100) / 100,
    monthsSaved,
    yearsSaved,
    earlyPayoffDateText: earlyPayoffText,
    comparisonSchedule: yearlySnapshots,
  };
}
