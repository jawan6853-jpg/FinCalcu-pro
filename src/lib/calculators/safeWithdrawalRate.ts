/**
 * Safe Withdrawal Rate (SWR) Calculator Engine
 * Calculates estimated:
 * - Portfolio Value
 * - Withdrawal Rate
 * - Annual Withdrawal
 * - Monthly Withdrawal
 * - Weekly & Daily breakdowns
 * Explains that "safe" is an illustrative benchmark based on historical assumptions, not a guarantee.
 */

export interface SafeWithdrawalRateInput {
  portfolioValue: number; // Total investable portfolio ($)
  withdrawalRate: number; // Percentage chosen (e.g. 4.0%)
}

export interface SWRTierComparison {
  ratePercentage: number;
  tierName: string;
  annualWithdrawal: number;
  monthlyWithdrawal: number;
  planningContext: string;
}

export interface SafeWithdrawalRateResult {
  portfolioValue: number;
  withdrawalRate: number;
  annualWithdrawal: number;
  monthlyWithdrawal: number;
  weeklyWithdrawal: number;
  dailyWithdrawal: number;
  tierComparisons: SWRTierComparison[];
  disclaimer: string;
}

export function calculateSafeWithdrawalRate(input: SafeWithdrawalRateInput): SafeWithdrawalRateResult {
  const portfolio = Math.max(1000, Number(input.portfolioValue) || 1000000);
  const rate = Math.max(0.5, Math.min(15, Number(input.withdrawalRate) || 4.0));

  const annualWithdrawal = portfolio * (rate / 100);
  const monthlyWithdrawal = annualWithdrawal / 12;
  const weeklyWithdrawal = annualWithdrawal / 52;
  const dailyWithdrawal = annualWithdrawal / 365;

  const tiers: SWRTierComparison[] = [
    {
      ratePercentage: 3.0,
      tierName: 'Conservative / Extended Horizon (35+ years)',
      annualWithdrawal: portfolio * 0.03,
      monthlyWithdrawal: (portfolio * 0.03) / 12,
      planningContext: 'Provides conservative buffer for early retirees facing potential multi-decade inflation and sequence-of-returns volatility.',
    },
    {
      ratePercentage: 3.5,
      tierName: 'Moderate Conservative (30–35 years)',
      annualWithdrawal: portfolio * 0.035,
      monthlyWithdrawal: (portfolio * 0.035) / 12,
      planningContext: 'Popular benchmark among modern financial planners seeking enhanced capital preservation across market cycles.',
    },
    {
      ratePercentage: 4.0,
      tierName: 'Traditional 4% Rule Baseline (30 years)',
      annualWithdrawal: portfolio * 0.04,
      monthlyWithdrawal: (portfolio * 0.04) / 12,
      planningContext: 'Classic historical research benchmark modeled on a diversified stock/bond allocation over typical 30-year retirements.',
    },
    {
      ratePercentage: 4.5,
      tierName: 'Flexible / Shorter Horizon (20–25 years)',
      annualWithdrawal: portfolio * 0.045,
      monthlyWithdrawal: (portfolio * 0.045) / 12,
      planningContext: 'May be suitable for retirees with alternative income sources (pensions, Social Security) or flexible spending plans.',
    },
    {
      ratePercentage: 5.0,
      tierName: 'Higher Drawdown / Shorter Horizon (15–20 years)',
      annualWithdrawal: portfolio * 0.05,
      monthlyWithdrawal: (portfolio * 0.05) / 12,
      planningContext: 'Draws down nest egg more rapidly. Highly sensitive to market downturns during the initial retirement years.',
    },
  ];

  return {
    portfolioValue: portfolio,
    withdrawalRate: Number(rate.toFixed(2)),
    annualWithdrawal: Number(annualWithdrawal.toFixed(2)),
    monthlyWithdrawal: Number(monthlyWithdrawal.toFixed(2)),
    weeklyWithdrawal: Number(weeklyWithdrawal.toFixed(2)),
    dailyWithdrawal: Number(dailyWithdrawal.toFixed(2)),
    tierComparisons: tiers,
    disclaimer:
      'Estimation Notice: "Safe" withdrawal rates are illustrative mathematical estimates based on historical market models. They are not guarantees. Real-world sustainability depends on actual sequence of investment returns, future inflation rates, investment fees, and dynamic lifestyle spending adjustments.',
  };
}
