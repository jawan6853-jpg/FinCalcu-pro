/**
 * Salary & Paycheck Calculator Engine
 * Calculates: Gross earnings, tax deductions, retirement/insurance deductions, net paycheck across frequencies
 */

export type PayFrequency = 'hourly' | 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly' | 'annually';

export interface SalaryInput {
  baseAmount: number; // Gross salary or hourly wage ($)
  payFrequency: PayFrequency; // How the base amount is entered
  hoursPerWeek?: number; // For hourly (default 40)
  filingStatus?: 'single' | 'married'; // Tax filing status
  stateTaxRatePercent?: number; // Estimated state tax % (default 4.5%)
  preTaxDeductions401kPercent?: number; // 401k / Retirement % (default 5%)
  healthInsuranceMonthly?: number; // Pre-tax health insurance ($/mo)
  otherPostTaxDeductionsMonthly?: number; // Miscellaneous post-tax ($/mo)
}

export interface SalaryResult {
  grossAnnual: number;
  grossMonthly: number;
  grossBiWeekly: number;
  grossWeekly: number;
  grossHourly: number;
  netAnnual: number;
  netMonthly: number;
  netBiWeekly: number;
  netWeekly: number;
  netHourly: number;
  deductionsBreakdown: {
    federalTaxAnnual: number;
    stateTaxAnnual: number;
    socialSecurityAnnual: number; // 6.2% up to wage base
    medicareAnnual: number; // 1.45%
    retirement401kAnnual: number;
    healthInsuranceAnnual: number;
    totalDeductionsAnnual: number;
  };
  effectiveTaxRatePercent: number;
  netTakeHomeRatioPercent: number;
  disclaimer: string;
}

export function calculateSalary(input: SalaryInput): SalaryResult {
  const base = Math.max(0, Number(input.baseAmount) || 0);
  const freq = input.payFrequency || 'annually';
  const hours = Math.max(1, Math.min(100, Number(input.hoursPerWeek) || 40));
  const annualHours = hours * 52;

  // Convert to Gross Annual
  let grossAnnual = base;
  if (freq === 'hourly') grossAnnual = base * annualHours;
  else if (freq === 'weekly') grossAnnual = base * 52;
  else if (freq === 'bi-weekly') grossAnnual = base * 26;
  else if (freq === 'semi-monthly') grossAnnual = base * 24;
  else if (freq === 'monthly') grossAnnual = base * 12;

  const grossMonthly = grossAnnual / 12;
  const grossBiWeekly = grossAnnual / 26;
  const grossWeekly = grossAnnual / 52;
  const grossHourly = annualHours > 0 ? grossAnnual / annualHours : 0;

  // Pre-tax deductions
  const kPercent = Math.max(0, Math.min(50, Number(input.preTaxDeductions401kPercent) || 0)) / 100;
  const retirement401kAnnual = grossAnnual * kPercent;
  const healthMonthly = Math.max(0, Number(input.healthInsuranceMonthly) || 0);
  const healthInsuranceAnnual = healthMonthly * 12;
  const totalPreTax = retirement401kAnnual + healthInsuranceAnnual;

  const taxableIncome = Math.max(0, grossAnnual - totalPreTax);

  // Standard progressive federal tax bracket estimate (2026 typical single standard deduction ~$14,600)
  const isMarried = input.filingStatus === 'married';
  const standardDeduction = isMarried ? 29200 : 14600;
  const federalTaxable = Math.max(0, taxableIncome - standardDeduction);

  let federalTaxAnnual = 0;
  if (federalTaxable > 0) {
    // 10% on first $11,600 (single) or $23,200 (married)
    const b1 = isMarried ? 23200 : 11600;
    const b2 = isMarried ? 94300 : 47150;
    const b3 = isMarried ? 201050 : 100525;
    const b4 = isMarried ? 383900 : 191950;

    if (federalTaxable <= b1) {
      federalTaxAnnual = federalTaxable * 0.10;
    } else if (federalTaxable <= b2) {
      federalTaxAnnual = b1 * 0.10 + (federalTaxable - b1) * 0.12;
    } else if (federalTaxable <= b3) {
      federalTaxAnnual = b1 * 0.10 + (b2 - b1) * 0.12 + (federalTaxable - b2) * 0.22;
    } else if (federalTaxable <= b4) {
      federalTaxAnnual = b1 * 0.10 + (b2 - b1) * 0.12 + (b3 - b2) * 0.22 + (federalTaxable - b3) * 0.24;
    } else {
      federalTaxAnnual = b1 * 0.10 + (b2 - b1) * 0.12 + (b3 - b2) * 0.22 + (b4 - b3) * 0.24 + (federalTaxable - b4) * 0.32;
    }
  }

  // FICA: Social Security 6.2% (capped at ~$168,600) + Medicare 1.45%
  const socialSecurityCap = 168600;
  const socialSecurityAnnual = Math.min(grossAnnual, socialSecurityCap) * 0.062;
  const medicareAnnual = grossAnnual * 0.0145;

  // State Tax
  const stateRate = Math.max(0, Math.min(15, Number(input.stateTaxRatePercent ?? 4.5))) / 100;
  const stateTaxAnnual = taxableIncome * stateRate;

  // Post tax deductions
  const postTaxOtherAnnual = Math.max(0, Number(input.otherPostTaxDeductionsMonthly) || 0) * 12;

  const totalDeductionsAnnual =
    federalTaxAnnual + stateTaxAnnual + socialSecurityAnnual + medicareAnnual + totalPreTax + postTaxOtherAnnual;
  const netAnnual = Math.max(0, grossAnnual - totalDeductionsAnnual);

  const netMonthly = netAnnual / 12;
  const netBiWeekly = netAnnual / 26;
  const netWeekly = netAnnual / 52;
  const netHourly = annualHours > 0 ? netAnnual / annualHours : 0;

  const effectiveTaxRatePercent = grossAnnual > 0
    ? ((federalTaxAnnual + stateTaxAnnual + socialSecurityAnnual + medicareAnnual) / grossAnnual) * 100
    : 0;
  const netTakeHomeRatioPercent = grossAnnual > 0 ? (netAnnual / grossAnnual) * 100 : 0;

  return {
    grossAnnual: Math.round(grossAnnual * 100) / 100,
    grossMonthly: Math.round(grossMonthly * 100) / 100,
    grossBiWeekly: Math.round(grossBiWeekly * 100) / 100,
    grossWeekly: Math.round(grossWeekly * 100) / 100,
    grossHourly: Math.round(grossHourly * 100) / 100,
    netAnnual: Math.round(netAnnual * 100) / 100,
    netMonthly: Math.round(netMonthly * 100) / 100,
    netBiWeekly: Math.round(netBiWeekly * 100) / 100,
    netWeekly: Math.round(netWeekly * 100) / 100,
    netHourly: Math.round(netHourly * 100) / 100,
    deductionsBreakdown: {
      federalTaxAnnual: Math.round(federalTaxAnnual * 100) / 100,
      stateTaxAnnual: Math.round(stateTaxAnnual * 100) / 100,
      socialSecurityAnnual: Math.round(socialSecurityAnnual * 100) / 100,
      medicareAnnual: Math.round(medicareAnnual * 100) / 100,
      retirement401kAnnual: Math.round(retirement401kAnnual * 100) / 100,
      healthInsuranceAnnual: Math.round(healthInsuranceAnnual * 100) / 100,
      totalDeductionsAnnual: Math.round(totalDeductionsAnnual * 100) / 100,
    },
    effectiveTaxRatePercent: Math.round(effectiveTaxRatePercent * 10) / 10,
    netTakeHomeRatioPercent: Math.round(netTakeHomeRatioPercent * 10) / 10,
    disclaimer: 'Estimated calculation based on federal standard deductions and typical FICA schedules. Actual paycheck withholding depends on employer benefits, W-4 elections, and municipal taxes.',
  };
}
