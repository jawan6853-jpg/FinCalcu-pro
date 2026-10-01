/**
 * Debt-to-Income (DTI) Ratio Calculator Engine
 * Formula: DTI (%) = (Total Monthly Debt Payments / Gross Monthly Income) * 100
 * Evaluates front-end (housing) and back-end (total) debt percentages against standard educational benchmarks.
 * Clearly states that lender underwriting guidelines and approval criteria vary.
 */

export interface DebtToIncomeInput {
  grossMonthlyIncome: number; // Pre-tax monthly earnings ($)
  rentOrMortgage: number; // Monthly housing expense ($)
  autoLoanPayments: number; // Car notes ($)
  studentLoanPayments: number; // Student debt minimums ($)
  creditCardMinimums: number; // Credit card monthly payments ($)
  personalAndOtherLoans: number; // Other revolving or fixed loans ($)
}

export interface DebtToIncomeResult {
  grossMonthlyIncome: number;
  totalMonthlyDebt: number;
  housingDebt: number;
  nonHousingDebt: number;
  dtiPercentage: number;
  frontEndDtiPercentage: number; // Housing ratio
  backEndDtiPercentage: number; // Total debt ratio
  remainingMonthlyCashFlow: number;
  maxPaymentFor36Dti: number;
  maxPaymentFor43Dti: number;
  dtiBenchmarkRange: 'Standard Benchmark (<= 36%)' | 'Moderate Range (37% - 43%)' | 'Elevated Range (44% - 50%)' | 'High Debt Load (> 50%)';
  educationalNotes: string[];
  disclaimer: string;
}

export function calculateDebtToIncome(input: DebtToIncomeInput): DebtToIncomeResult {
  const income = Math.max(1, Number(input.grossMonthlyIncome) || 1);
  const housing = Math.max(0, Number(input.rentOrMortgage) || 0);
  const auto = Math.max(0, Number(input.autoLoanPayments) || 0);
  const student = Math.max(0, Number(input.studentLoanPayments) || 0);
  const cards = Math.max(0, Number(input.creditCardMinimums) || 0);
  const other = Math.max(0, Number(input.personalAndOtherLoans) || 0);

  const nonHousingDebt = auto + student + cards + other;
  const totalMonthlyDebt = housing + nonHousingDebt;

  const dtiPercentage = (totalMonthlyDebt / income) * 100;
  const frontEndDtiPercentage = (housing / income) * 100;
  const backEndDtiPercentage = dtiPercentage;

  const remainingMonthlyCashFlow = Math.max(0, income - totalMonthlyDebt);
  const maxPaymentFor36Dti = income * 0.36;
  const maxPaymentFor43Dti = income * 0.43;

  let dtiBenchmarkRange: DebtToIncomeResult['dtiBenchmarkRange'] = 'Standard Benchmark (<= 36%)';
  const educationalNotes: string[] = [];

  if (dtiPercentage > 50) {
    dtiBenchmarkRange = 'High Debt Load (> 50%)';
    educationalNotes.push('More than half of gross monthly income is committed to contractual debt service.');
    educationalNotes.push('Standard mortgage guidelines often restrict new borrowing when total DTI exceeds 45–50%, though specific programs and compensating factors vary.');
  } else if (dtiPercentage > 43) {
    dtiBenchmarkRange = 'Elevated Range (44% - 50%)';
    educationalNotes.push('Debt obligations exceed the standard 43% Qualified Mortgage (QM) benchmark.');
    educationalNotes.push('Borrowers in this range may face higher interest rates or need strong compensating factors (such as significant cash reserves or high credit scores).');
  } else if (dtiPercentage >= 37) {
    dtiBenchmarkRange = 'Moderate Range (37% - 43%)';
    educationalNotes.push('Falls within common underwriting allowances for many conventional and government-backed home loans.');
    educationalNotes.push('Maintaining total debt below 36% provides additional budgetary buffer for unexpected life expenses.');
  } else {
    dtiBenchmarkRange = 'Standard Benchmark (<= 36%)';
    educationalNotes.push('Falls within the standard benchmark preferred by most major mortgage and personal lenders.');
    educationalNotes.push('Indicates substantial remaining discretionary cash flow for savings, investments, and emergency reserves.');
  }

  return {
    grossMonthlyIncome: income,
    totalMonthlyDebt,
    housingDebt: housing,
    nonHousingDebt,
    dtiPercentage: Number(dtiPercentage.toFixed(2)),
    frontEndDtiPercentage: Number(frontEndDtiPercentage.toFixed(2)),
    backEndDtiPercentage: Number(backEndDtiPercentage.toFixed(2)),
    remainingMonthlyCashFlow: Number(remainingMonthlyCashFlow.toFixed(2)),
    maxPaymentFor36Dti: Number(maxPaymentFor36Dti.toFixed(2)),
    maxPaymentFor43Dti: Number(maxPaymentFor43Dti.toFixed(2)),
    dtiBenchmarkRange,
    educationalNotes,
    disclaimer:
      'Educational Notice: Lender debt limits, allowable ratios, and credit approval guidelines vary significantly across banks, mortgage programs (FHA, Conventional, VA), and jurisdictions. This ratio is an educational estimate and does not represent a loan pre-approval or credit guarantee.',
  };
}
