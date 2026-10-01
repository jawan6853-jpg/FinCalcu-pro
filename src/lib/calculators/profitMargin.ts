/**
 * Profit Margin Calculator Engine
 * Formula: Profit = Revenue - Cost
 * Profit Margin = (Profit / Revenue) × 100
 * Markup = (Profit / Cost) × 100
 */

export interface ProfitMarginInput {
  cost: number; // Cost of Goods Sold (COGS) ($)
  revenue: number; // Selling Price or Total Sales Revenue ($)
}

export interface ProfitMarginResult {
  cost: number;
  revenue: number;
  grossProfit: number;
  profitMarginPercent: number;
  markupPercent: number;
  costRatioPercent: number;
  isProfitable: boolean;
}

export function calculateProfitMargin(input: ProfitMarginInput): ProfitMarginResult {
  const cost = Math.max(0, Number(input.cost) || 0);
  const revenue = Math.max(0, Number(input.revenue) || 0);

  const profit = revenue - cost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const markup = cost > 0 ? (profit / cost) * 100 : 0;
  const costRatio = revenue > 0 ? (cost / revenue) * 100 : 0;

  return {
    cost,
    revenue,
    grossProfit: profit,
    profitMarginPercent: margin,
    markupPercent: markup,
    costRatioPercent: costRatio,
    isProfitable: profit >= 0,
  };
}
