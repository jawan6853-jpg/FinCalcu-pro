/**
 * Annuity Calculator Engine
 * Calculates: Future Value (FV), Present Value (PV), Periodic Payment (PMT)
 * Supports: Ordinary Annuity (payment at end of period) and Annuity Due (payment at beginning of period)
 * Supports: Monthly, Quarterly, Semi-Annual, and Annual payment frequencies
 */

export type AnnuityFrequency = 'monthly' | 'quarterly' | 'semi-annually' | 'annually';
export type AnnuityTiming = 'end' | 'beginning'; // Ordinary annuity vs Annuity Due
export type AnnuityMode = 'futureValue' | 'presentValue' | 'periodicPayment';

export interface AnnuityInput {
  mode: AnnuityMode;
  paymentAmount?: number; // PMT ($)
  interestRate: number; // Annual interest rate % (e.g. 5.0%)
  years: number; // Total duration in years
  frequency: AnnuityFrequency;
  timing: AnnuityTiming;
  targetAmount?: number; // Target FV or PV when solving for PMT ($)
}

export interface AnnuityResult {
  mode: AnnuityMode;
  futureValue: number;
  presentValue: number;
  periodicPayment: number;
  totalPaymentsMade: number;
  totalInterestEarnedOrDiscounted: number;
  numberOfPeriods: number;
  ratePerPeriod: number;
  frequency: AnnuityFrequency;
  timing: AnnuityTiming;
}

export function calculateAnnuity(input: AnnuityInput): AnnuityResult {
  const annualRate = Math.max(0, Number(input.interestRate) || 0) / 100;
  const years = Math.max(0.1, Number(input.years) || 10);
  const timing = input.timing || 'end';
  const frequency = input.frequency || 'monthly';
  const mode = input.mode || 'futureValue';

  let m = 12; // periods per year
  if (frequency === 'annually') m = 1;
  else if (frequency === 'semi-annually') m = 2;
  else if (frequency === 'quarterly') m = 4;
  else m = 12;

  const n = years * m;
  const r = annualRate / m;
  const timingMultiplier = timing === 'beginning' ? 1 + r : 1;

  let pmt = Math.max(0, Number(input.paymentAmount) || 500);
  const target = Math.max(0, Number(input.targetAmount) || 100000);

  let fv = 0;
  let pv = 0;

  if (mode === 'futureValue') {
    // FV = PMT * [((1 + r)^n - 1) / r] * timingMultiplier
    if (r === 0) {
      fv = pmt * n;
    } else {
      fv = pmt * ((Math.pow(1 + r, n) - 1) / r) * timingMultiplier;
    }
    // PV = PMT * [(1 - (1 + r)^(-n)) / r] * timingMultiplier
    if (r === 0) {
      pv = pmt * n;
    } else {
      pv = pmt * ((1 - Math.pow(1 + r, -n)) / r) * timingMultiplier;
    }
  } else if (mode === 'presentValue') {
    if (r === 0) {
      pv = pmt * n;
      fv = pmt * n;
    } else {
      pv = pmt * ((1 - Math.pow(1 + r, -n)) / r) * timingMultiplier;
      fv = pmt * ((Math.pow(1 + r, n) - 1) / r) * timingMultiplier;
    }
  } else {
    // solve for PMT to reach target FV
    if (r === 0) {
      pmt = n > 0 ? target / n : 0;
    } else {
      const factor = ((Math.pow(1 + r, n) - 1) / r) * timingMultiplier;
      pmt = factor > 0 ? target / factor : 0;
    }
    fv = target;
    pv = r === 0 ? pmt * n : pmt * ((1 - Math.pow(1 + r, -n)) / r) * timingMultiplier;
  }

  const totalPaymentsMade = pmt * n;
  const totalInterest = Math.max(0, fv - totalPaymentsMade);

  return {
    mode,
    futureValue: fv,
    presentValue: pv,
    periodicPayment: pmt,
    totalPaymentsMade,
    totalInterestEarnedOrDiscounted: totalInterest,
    numberOfPeriods: n,
    ratePerPeriod: r * 100,
    frequency,
    timing,
  };
}
