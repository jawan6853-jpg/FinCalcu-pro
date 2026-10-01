/**
 * Budget Calculator Engine
 * Calculates: Total income, category expenses, net balance, 50/30/20 guideline breakdown, savings rate %
 */

export interface BudgetInput {
  monthlyIncome: number; // Primary take-home income ($)
  additionalIncome?: number; // Side hustle / freelance / partner ($)
  housing: number; // Rent or mortgage ($)
  utilities: number; // Electric, water, gas, internet, phone ($)
  groceries: number; // Food and household items ($)
  transportation: number; // Car payment, gas, insurance, transit ($)
  healthcare: number; // Insurance premiums, medications, health ($)
  debtPayments: number; // Credit cards, student loans, personal loans ($)
  entertainment: number; // Dining out, subscriptions, shopping ($)
  savingsAndInvestments: number; // Emergency fund, retirement, stocks ($)
  miscExpenses?: number; // Miscellaneous buffer ($)
}

export interface BudgetResult {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  remainingCashFlow: number;
  savingsRatePercent: number;
  expenseRatioPercent: number;
  needsTotal: number;
  wantsTotal: number;
  rule50_30_20: {
    needsPercent: number; // Target 50%
    wantsPercent: number; // Target 30%
    savingsPercent: number; // Target 20%
    needsTargetAmount: number;
    wantsTargetAmount: number;
    savingsTargetAmount: number;
  };
  statusMessage: string;
}

export function calculateBudget(input: BudgetInput): BudgetResult {
  const primaryIncome = Math.max(0, Number(input.monthlyIncome) || 0);
  const addIncome = Math.max(0, Number(input.additionalIncome) || 0);
  const totalIncome = primaryIncome + addIncome;

  const housing = Math.max(0, Number(input.housing) || 0);
  const utilities = Math.max(0, Number(input.utilities) || 0);
  const groceries = Math.max(0, Number(input.groceries) || 0);
  const transportation = Math.max(0, Number(input.transportation) || 0);
  const healthcare = Math.max(0, Number(input.healthcare) || 0);
  const debt = Math.max(0, Number(input.debtPayments) || 0);
  const entertainment = Math.max(0, Number(input.entertainment) || 0);
  const savings = Math.max(0, Number(input.savingsAndInvestments) || 0);
  const misc = Math.max(0, Number(input.miscExpenses) || 0);

  // Needs: Housing, Utilities, Groceries, Transportation, Healthcare, Debt minimums
  const needsTotal = housing + utilities + groceries + transportation + healthcare + debt;
  // Wants: Entertainment, Dining, Misc
  const wantsTotal = entertainment + misc;
  const totalSavings = savings;

  const totalExpenses = needsTotal + wantsTotal;
  const remainingCashFlow = totalIncome - totalExpenses - totalSavings;

  const savingsRatePercent = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
  const expenseRatioPercent = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

  const needsPercent = totalIncome > 0 ? (needsTotal / totalIncome) * 100 : 0;
  const wantsPercent = totalIncome > 0 ? (wantsTotal / totalIncome) * 100 : 0;
  const effectiveSavingsPercent = totalIncome > 0 ? ((totalSavings + Math.max(0, remainingCashFlow)) / totalIncome) * 100 : 0;

  let statusMessage = 'Balanced budget.';
  if (remainingCashFlow < 0) {
    statusMessage = `Deficit of $${Math.abs(remainingCashFlow).toFixed(2)}. Expenses exceed income.`;
  } else if (remainingCashFlow > 0) {
    statusMessage = `Surplus of $${remainingCashFlow.toFixed(2)} available for additional savings or debt reduction.`;
  }

  return {
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    totalSavings: Math.round(totalSavings * 100) / 100,
    remainingCashFlow: Math.round(remainingCashFlow * 100) / 100,
    savingsRatePercent: Math.round(savingsRatePercent * 10) / 10,
    expenseRatioPercent: Math.round(expenseRatioPercent * 10) / 10,
    needsTotal: Math.round(needsTotal * 100) / 100,
    wantsTotal: Math.round(wantsTotal * 100) / 100,
    rule50_30_20: {
      needsPercent: Math.round(needsPercent * 10) / 10,
      wantsPercent: Math.round(wantsPercent * 10) / 10,
      savingsPercent: Math.round(effectiveSavingsPercent * 10) / 10,
      needsTargetAmount: Math.round(totalIncome * 0.5 * 100) / 100,
      wantsTargetAmount: Math.round(totalIncome * 0.3 * 100) / 100,
      savingsTargetAmount: Math.round(totalIncome * 0.2 * 100) / 100,
    },
    statusMessage,
  };
}
