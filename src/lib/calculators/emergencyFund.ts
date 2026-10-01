/**
 * Emergency Fund Calculator Engine
 * Calculates: Target emergency safety cushion based on essential monthly expenses and coverage duration
 */

export interface EmergencyFundInput {
  housingRentOrMortgage: number; // Rent or mortgage ($)
  utilitiesAndBills: number; // Electric, water, internet, phone ($)
  groceriesAndFood: number; // Essential food and household ($)
  transportationAndGas: number; // Transit, auto payment, gas, insurance ($)
  insuranceAndMedical: number; // Health, dental, prescription costs ($)
  minimumDebtPayments: number; // Credit card, student loan minimums ($)
  coverageMonths: number; // 3, 6, 9, or 12 months of living expenses
  currentEmergencySavings?: number; // Existing safety fund ($)
  monthlySavingsContribution?: number; // How much user can save per month ($)
}

export interface EmergencyFundResult {
  monthlyEssentialExpenses: number;
  targetFundAmount: number;
  currentSavings: number;
  shortfallOrSurplus: number;
  coverageMonths: number;
  monthsToGoal: number;
  fundHealthStatus: 'fully-funded' | 'good-progress' | 'building' | 'vulnerable';
  expenseBreakdown: {
    category: string;
    amount: number;
    percent: number;
  }[];
}

export function calculateEmergencyFund(input: EmergencyFundInput): EmergencyFundResult {
  const housing = Math.max(0, Number(input.housingRentOrMortgage) || 0);
  const utilities = Math.max(0, Number(input.utilitiesAndBills) || 0);
  const groceries = Math.max(0, Number(input.groceriesAndFood) || 0);
  const transport = Math.max(0, Number(input.transportationAndGas) || 0);
  const health = Math.max(0, Number(input.insuranceAndMedical) || 0);
  const debt = Math.max(0, Number(input.minimumDebtPayments) || 0);

  const monthlyEssential = housing + utilities + groceries + transport + health + debt;
  const months = Math.max(1, Math.min(24, Number(input.coverageMonths) || 6));
  const current = Math.max(0, Number(input.currentEmergencySavings) || 0);
  const monthlyCont = Math.max(0, Number(input.monthlySavingsContribution) || 0);

  const targetFundAmount = monthlyEssential * months;
  const shortfallOrSurplus = targetFundAmount - current;

  let monthsToGoal = 0;
  if (shortfallOrSurplus > 0 && monthlyCont > 0) {
    monthsToGoal = Math.ceil(shortfallOrSurplus / monthlyCont);
  }

  let fundHealthStatus: EmergencyFundResult['fundHealthStatus'] = 'vulnerable';
  const fundedPercent = targetFundAmount > 0 ? (current / targetFundAmount) * 100 : 100;
  if (fundedPercent >= 100) fundHealthStatus = 'fully-funded';
  else if (fundedPercent >= 60) fundHealthStatus = 'good-progress';
  else if (fundedPercent >= 25) fundHealthStatus = 'building';
  else fundHealthStatus = 'vulnerable';

  const rawCategories = [
    { category: 'Housing', amount: housing },
    { category: 'Utilities & Bills', amount: utilities },
    { category: 'Groceries', amount: groceries },
    { category: 'Transportation', amount: transport },
    { category: 'Health & Medical', amount: health },
    { category: 'Minimum Debt Payments', amount: debt },
  ];

  const expenseBreakdown = rawCategories.map((c) => ({
    category: c.category,
    amount: Math.round(c.amount * 100) / 100,
    percent: monthlyEssential > 0 ? Math.round((c.amount / monthlyEssential) * 1000) / 10 : 0,
  }));

  return {
    monthlyEssentialExpenses: Math.round(monthlyEssential * 100) / 100,
    targetFundAmount: Math.round(targetFundAmount * 100) / 100,
    currentSavings: Math.round(current * 100) / 100,
    shortfallOrSurplus: Math.round(shortfallOrSurplus * 100) / 100,
    coverageMonths: months,
    monthsToGoal,
    fundHealthStatus,
    expenseBreakdown,
  };
}
