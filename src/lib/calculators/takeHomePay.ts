/**
 * Take-Home Pay Calculator Engine
 * Calculates: Exact take-home pay per paycheck cycle from gross salary, tax withholdings, and voluntary payroll deductions
 */

export interface TakeHomePayInput {
  grossPaycheckAmount: number; // Gross pay per period ($)
  payPeriod: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';
  federalWithholdingPercent?: number; // Federal tax withholding rate % (default: 12%)
  stateWithholdingPercent?: number; // State tax rate % (default: 4.5%)
  preTaxDeductions?: number; // 401k, HSA, FSA, dental ($ per paycheck)
  postTaxDeductions?: number; // Roth 401k, union dues, life insurance ($ per paycheck)
}

export interface TakeHomePayResult {
  takeHomePay: number; // Net cash deposit per paycheck
  grossPay: number;
  totalTaxesWithheld: number;
  totalPreTaxDeductions: number;
  totalPostTaxDeductions: number;
  socialSecurityTax: number; // 6.2%
  medicareTax: number; // 1.45%
  federalIncomeTax: number;
  stateIncomeTax: number;
  takeHomePercent: number; // Net / Gross %
  annualizedTakeHome: number;
  annualizedGross: number;
}

export function calculateTakeHomePay(input: TakeHomePayInput): TakeHomePayResult {
  const gross = Math.max(0, Number(input.grossPaycheckAmount) || 0);
  const period = input.payPeriod || 'bi-weekly';
  const fedRate = Math.max(0, Number(input.federalWithholdingPercent ?? 12)) / 100;
  const stateRate = Math.max(0, Number(input.stateWithholdingPercent ?? 4.5)) / 100;
  const preTax = Math.max(0, Number(input.preTaxDeductions) || 0);
  const postTax = Math.max(0, Number(input.postTaxDeductions) || 0);

  const periodsPerYear = period === 'weekly' ? 52 : period === 'bi-weekly' ? 26 : period === 'semi-monthly' ? 24 : 12;

  // Pre-tax deductions reduce federal and state taxable wage
  const taxableForIncomeTax = Math.max(0, gross - preTax);

  const federalIncomeTax = taxableForIncomeTax * fedRate;
  const stateIncomeTax = taxableForIncomeTax * stateRate;
  const socialSecurityTax = gross * 0.062;
  const medicareTax = gross * 0.0145;

  const totalTaxesWithheld = federalIncomeTax + stateIncomeTax + socialSecurityTax + medicareTax;
  const takeHomePay = Math.max(0, gross - totalTaxesWithheld - preTax - postTax);

  const takeHomePercent = gross > 0 ? (takeHomePay / gross) * 100 : 0;
  const annualizedTakeHome = takeHomePay * periodsPerYear;
  const annualizedGross = gross * periodsPerYear;

  return {
    takeHomePay: Math.round(takeHomePay * 100) / 100,
    grossPay: Math.round(gross * 100) / 100,
    totalTaxesWithheld: Math.round(totalTaxesWithheld * 100) / 100,
    totalPreTaxDeductions: Math.round(preTax * 100) / 100,
    totalPostTaxDeductions: Math.round(postTax * 100) / 100,
    socialSecurityTax: Math.round(socialSecurityTax * 100) / 100,
    medicareTax: Math.round(medicareTax * 100) / 100,
    federalIncomeTax: Math.round(federalIncomeTax * 100) / 100,
    stateIncomeTax: Math.round(stateIncomeTax * 100) / 100,
    takeHomePercent: Math.round(takeHomePercent * 10) / 10,
    annualizedTakeHome: Math.round(annualizedTakeHome * 100) / 100,
    annualizedGross: Math.round(annualizedGross * 100) / 100,
  };
}
