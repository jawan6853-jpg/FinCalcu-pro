/**
 * Retirement Withdrawal Calculator Engine
 * Calculates: Annual Withdrawal, Monthly Withdrawal, Remaining Portfolio Value, Longevity Timeline
 * Accounts for portfolio growth vs. recurring dynamic or fixed inflation-adjusted withdrawals.
 */

export interface RetirementWithdrawalInput {
  portfolioBalance: number; // Starting nest egg ($)
  withdrawalRate: number; // Initial annual withdrawal % (e.g. 4.0%)
  investmentReturn: number; // Expected annual nominal portfolio return % (e.g. 6.0%)
  retirementPeriodYears: number; // Years in retirement (e.g. 30)
  inflationRate?: number; // Annual inflation adjustment % (e.g. 2.5%)
}

export interface RetirementWithdrawalResult {
  startingPortfolio: number;
  initialAnnualWithdrawal: number;
  initialMonthlyWithdrawal: number;
  endingPortfolioBalance: number;
  totalWithdrawn: number;
  portfolioDepleted: boolean;
  depletionYear: number | null;
  yearlySchedule: {
    year: number;
    startBalance: number;
    withdrawal: number;
    growth: number;
    endBalance: number;
  }[];
  summaryMessage: string;
}

export function calculateRetirementWithdrawal(input: RetirementWithdrawalInput): RetirementWithdrawalResult {
  const principal = Math.max(1000, Number(input.portfolioBalance) || 1000000);
  const wRate = Math.max(0.1, Number(input.withdrawalRate) || 4.0) / 100;
  const growthRate = Math.max(0, Number(input.investmentReturn) || 6.0) / 100;
  const years = Math.max(1, Math.min(60, Number(input.retirementPeriodYears) || 30));
  const inflation = Math.max(0, Number(input.inflationRate) || 2.5) / 100;

  const initialAnnualWithdrawal = principal * wRate;
  const initialMonthlyWithdrawal = initialAnnualWithdrawal / 12;

  let balance = principal;
  let currentWithdrawal = initialAnnualWithdrawal;
  let totalWithdrawn = 0;
  let depleted = false;
  let depletionYear: number | null = null;
  const schedule: RetirementWithdrawalResult['yearlySchedule'] = [];

  for (let year = 1; year <= years; year++) {
    const startBal = balance;
    if (balance <= 0) {
      if (!depleted) {
        depleted = true;
        depletionYear = year - 1;
      }
      schedule.push({
        year,
        startBalance: 0,
        withdrawal: 0,
        growth: 0,
        endBalance: 0,
      });
      continue;
    }

    // Withdrawal taken at start of period
    const actualWithdrawal = Math.min(balance, currentWithdrawal);
    balance -= actualWithdrawal;
    totalWithdrawn += actualWithdrawal;

    // Remaining funds grow throughout the year
    const growth = balance * growthRate;
    balance += growth;

    if (balance <= 0 && !depleted) {
      depleted = true;
      depletionYear = year;
      balance = 0;
    }

    schedule.push({
      year,
      startBalance: Math.round(startBal),
      withdrawal: Math.round(actualWithdrawal),
      growth: Math.round(growth),
      endBalance: Math.round(balance),
    });

    // Inflation adjustment for next year's withdrawal
    currentWithdrawal *= (1 + inflation);
  }

  const endingPortfolioBalance = Math.max(0, Math.round(balance));
  let summaryMessage = '';
  if (depleted && depletionYear) {
    summaryMessage = `Warning: Under these parameters, the portfolio is depleted by Year ${depletionYear}. Consider reducing initial withdrawal rate or increasing growth assets.`;
  } else {
    summaryMessage = `Success: The portfolio sustains the full ${years}-year retirement horizon with an estimated ending balance of $${endingPortfolioBalance.toLocaleString()}.`;
  }

  return {
    startingPortfolio: principal,
    initialAnnualWithdrawal,
    initialMonthlyWithdrawal,
    endingPortfolioBalance,
    totalWithdrawn: Math.round(totalWithdrawn),
    portfolioDepleted: depleted,
    depletionYear,
    yearlySchedule: schedule,
    summaryMessage,
  };
}
