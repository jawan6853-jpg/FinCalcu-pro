import { sanitizeNumber } from '../formatters';

export interface DividendInput {
  stockPrice: number;
  sharesOwned: number;
  annualDividendPerShare: number; // in $ (or derived from yield)
  dividendGrowthRate: number; // annual % growth
  yearsInvested: number;
  reinvestDividends: boolean; // DRIP toggle
  payoutFrequency: 'annual' | 'semi-annual' | 'quarterly' | 'monthly';
}

export interface DividendYearPoint {
  year: number;
  portfolioValue: number;
  annualIncome: number;
  totalDividendsPaid: number;
}

export interface DividendResult {
  currentYieldPercent: number;
  annualDividendIncome: number;
  monthlyDividendIncome: number;
  payoutPerPeriod: number;
  periodsPerYear: number;
  futurePortfolioValue: number;
  totalDividendsReceived: number;
  endingAnnualIncome: number;
  endingYieldOnCost: number;
  schedule: DividendYearPoint[];
}

export function calculateDividend(input: DividendInput): DividendResult {
  const stockPrice = Math.max(0, sanitizeNumber(input.stockPrice));
  const sharesOwned = Math.max(0, sanitizeNumber(input.sharesOwned));
  const annualDividendPerShare = Math.max(0, sanitizeNumber(input.annualDividendPerShare));
  const dividendGrowthRate = Math.max(-50, Math.min(100, sanitizeNumber(input.dividendGrowthRate))) / 100;
  const yearsInvested = Math.max(1, Math.min(50, Math.floor(sanitizeNumber(input.yearsInvested) || 1)));
  const reinvest = Boolean(input.reinvestDividends);

  const initialPortfolioValue = stockPrice * sharesOwned;
  const currentYieldPercent = stockPrice > 0 ? (annualDividendPerShare / stockPrice) * 100 : 0;
  const initialAnnualIncome = annualDividendPerShare * sharesOwned;
  const monthlyDividendIncome = initialAnnualIncome / 12;

  let periodsPerYear = 4;
  if (input.payoutFrequency === 'annual') periodsPerYear = 1;
  else if (input.payoutFrequency === 'semi-annual') periodsPerYear = 2;
  else if (input.payoutFrequency === 'monthly') periodsPerYear = 12;

  const payoutPerPeriod = initialAnnualIncome / periodsPerYear;

  // Multi-year compounding simulation
  let currentShares = sharesOwned;
  let currentDivPerShare = annualDividendPerShare;
  let totalDividendsReceived = 0;
  const schedule: DividendYearPoint[] = [];

  schedule.push({
    year: 0,
    portfolioValue: initialPortfolioValue,
    annualIncome: initialAnnualIncome,
    totalDividendsPaid: 0,
  });

  for (let y = 1; y <= yearsInvested; y++) {
    // Each year dividend grows
    currentDivPerShare = currentDivPerShare * (1 + dividendGrowthRate);

    // If reinvesting dividends during the year across periods
    if (reinvest && stockPrice > 0) {
      for (let p = 0; p < periodsPerYear; p++) {
        const periodDiv = (currentDivPerShare / periodsPerYear) * currentShares;
        totalDividendsReceived += periodDiv;
        // Reinvest at current stock price
        currentShares += periodDiv / stockPrice;
      }
    } else {
      const yearDividends = currentDivPerShare * currentShares;
      totalDividendsReceived += yearDividends;
    }

    const yearEndPortfolioValue = currentShares * stockPrice;
    const yearEndAnnualIncome = currentShares * currentDivPerShare;

    schedule.push({
      year: y,
      portfolioValue: Math.round(yearEndPortfolioValue * 100) / 100,
      annualIncome: Math.round(yearEndAnnualIncome * 100) / 100,
      totalDividendsPaid: Math.round(totalDividendsReceived * 100) / 100,
    });
  }

  const futurePortfolioValue = schedule[schedule.length - 1].portfolioValue;
  const endingAnnualIncome = schedule[schedule.length - 1].annualIncome;
  const endingYieldOnCost =
    initialPortfolioValue > 0 ? (endingAnnualIncome / initialPortfolioValue) * 100 : 0;

  return {
    currentYieldPercent: Math.round(currentYieldPercent * 100) / 100,
    annualDividendIncome: Math.round(initialAnnualIncome * 100) / 100,
    monthlyDividendIncome: Math.round(monthlyDividendIncome * 100) / 100,
    payoutPerPeriod: Math.round(payoutPerPeriod * 100) / 100,
    periodsPerYear,
    futurePortfolioValue: Math.round(futurePortfolioValue * 100) / 100,
    totalDividendsReceived: Math.round(totalDividendsReceived * 100) / 100,
    endingAnnualIncome: Math.round(endingAnnualIncome * 100) / 100,
    endingYieldOnCost: Math.round(endingYieldOnCost * 100) / 100,
    schedule,
  };
}
