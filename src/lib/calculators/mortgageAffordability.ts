/**
 * Mortgage Affordability Calculator Engine
 * Calculates estimated affordable home price based on income, debt-to-income (DTI) thresholds,
 * down payment, interest rates, property taxes, and insurance.
 */

export interface MortgageAffordabilityInput {
  annualHouseholdIncome: number; // Gross annual income ($)
  monthlyDebtPayments: number; // Total monthly recurring debts (auto, credit cards, student loans) ($)
  downPayment: number; // Total cash available for down payment ($)
  interestRate: number; // Mortgage interest rate APR (%)
  loanTermYears: number; // 15 or 30 years
  propertyTaxRatePercent?: number; // Annual property tax rate % (default: 1.2%)
  annualHomeInsurance?: number; // Annual homeowners insurance ($) (default: 1200)
  frontEndDtiPercent?: number; // Target housing DTI limit % (default: 28%)
  backEndDtiPercent?: number; // Target total debt DTI limit % (default: 36%)
}

export interface MortgageAffordabilityResult {
  maxAffordableHomePrice: number;
  maxLoanAmount: number;
  downPaymentAmount: number;
  downPaymentPercent: number;
  maxMonthlyPayment: number;
  breakdown: {
    principalAndInterest: number;
    propertyTax: number;
    homeownersInsurance: number;
  };
  monthlyGrossIncome: number;
  frontEndDti: number;
  backEndDti: number;
  limitingFactor: 'front-end' | 'back-end' | 'down-payment';
  affordabilityDisclaimer: string;
}

export function calculateMortgageAffordability(
  input: MortgageAffordabilityInput
): MortgageAffordabilityResult {
  const annualIncome = Math.max(0, Number(input.annualHouseholdIncome) || 0);
  const monthlyDebts = Math.max(0, Number(input.monthlyDebtPayments) || 0);
  const downPayment = Math.max(0, Number(input.downPayment) || 0);
  const apr = Math.max(0.1, Number(input.interestRate) || 6.5);
  const years = Math.max(5, Math.min(40, Number(input.loanTermYears) || 30));
  const propTaxRate = Math.max(0, Number(input.propertyTaxRatePercent ?? 1.2)) / 100;
  const annualIns = Math.max(0, Number(input.annualHomeInsurance ?? 1200));
  const frontDtiLimit = Math.max(10, Math.min(50, Number(input.frontEndDtiPercent ?? 28))) / 100;
  const backDtiLimit = Math.max(15, Math.min(60, Number(input.backEndDtiPercent ?? 36))) / 100;

  const monthlyIncome = annualIncome / 12;

  // Maximum allowed total monthly housing payment (PITI)
  // Front-End condition: Housing <= Income * frontDtiLimit
  const maxHousingByFrontEnd = monthlyIncome * frontDtiLimit;

  // Back-End condition: Housing + Debts <= Income * backDtiLimit => Housing <= Income * backDtiLimit - Debts
  const maxHousingByBackEnd = Math.max(0, monthlyIncome * backDtiLimit - monthlyDebts);

  const maxMonthlyPaymentAllowed = Math.min(maxHousingByFrontEnd, maxHousingByBackEnd);
  const limitingFactor: 'front-end' | 'back-end' | 'down-payment' =
    maxHousingByBackEnd <= maxHousingByFrontEnd ? 'back-end' : 'front-end';

  // Home price P consists of:
  // Monthly payment = P&I(Loan) + PropertyTax(P) + Insurance
  // Loan = P - DownPayment
  // Monthly P&I per dollar of loan:
  const monthlyRate = apr / 100 / 12;
  const totalMonths = years * 12;
  const loanFactor =
    (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  // monthlyPayment = (Price - DownPayment) * loanFactor + Price * (propTaxRate / 12) + (annualIns / 12)
  // monthlyPayment - (annualIns / 12) + DownPayment * loanFactor = Price * [loanFactor + (propTaxRate / 12)]
  const monthlyIns = annualIns / 12;
  const netMonthlyForHouse = Math.max(0, maxMonthlyPaymentAllowed - monthlyIns);

  const denominator = loanFactor + propTaxRate / 12;
  let estimatedPrice = (netMonthlyForHouse + downPayment * loanFactor) / denominator;

  if (estimatedPrice < downPayment) {
    estimatedPrice = downPayment;
  }

  const maxLoanAmount = Math.max(0, estimatedPrice - downPayment);
  const monthlyPI = maxLoanAmount * loanFactor;
  const monthlyTax = (estimatedPrice * propTaxRate) / 12;
  const actualTotalMonthly = monthlyPI + monthlyTax + monthlyIns;

  const downPaymentPercent = estimatedPrice > 0 ? (downPayment / estimatedPrice) * 100 : 0;
  const actualFrontEndDti = monthlyIncome > 0 ? (actualTotalMonthly / monthlyIncome) * 100 : 0;
  const actualBackEndDti = monthlyIncome > 0 ? ((actualTotalMonthly + monthlyDebts) / monthlyIncome) * 100 : 0;

  return {
    maxAffordableHomePrice: Math.round(estimatedPrice),
    maxLoanAmount: Math.round(maxLoanAmount),
    downPaymentAmount: Math.round(downPayment),
    downPaymentPercent: Math.round(downPaymentPercent * 10) / 10,
    maxMonthlyPayment: Math.round(actualTotalMonthly),
    breakdown: {
      principalAndInterest: Math.round(monthlyPI),
      propertyTax: Math.round(monthlyTax),
      homeownersInsurance: Math.round(monthlyIns),
    },
    monthlyGrossIncome: Math.round(monthlyIncome),
    frontEndDti: Math.round(actualFrontEndDti * 10) / 10,
    backEndDti: Math.round(actualBackEndDti * 10) / 10,
    limitingFactor,
    affordabilityDisclaimer:
      'This calculation is an estimate based on standard debt-to-income benchmarks. Individual mortgage lenders consider credit scores, employment history, down payment requirements, loan programs (FHA, VA, Conventional), and local property tax variances.',
  };
}
