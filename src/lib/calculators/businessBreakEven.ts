/**
 * Break-Even Business Calculator Engine
 * Formula: Break-even Units = Fixed Costs / (Selling Price - Variable Cost)
 * Break-even Revenue = Break-even Units × Selling Price
 */

export interface BusinessBreakEvenInput {
  fixedCosts: number; // Rent, insurance, administrative salaries ($)
  variableCostPerUnit: number; // Materials, direct labor, packaging ($)
  sellingPricePerUnit: number; // Price charged per item/service ($)
  targetUnitsSold?: number; // Optional projected sales volume
}

export interface BusinessBreakEvenResult {
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
  unitContributionMargin: number;
  contributionMarginRatio: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  targetUnitsSold: number;
  projectedRevenue: number;
  projectedTotalCosts: number;
  projectedProfitOrLoss: number;
  isViable: boolean;
}

export function calculateBusinessBreakEven(
  input: BusinessBreakEvenInput
): BusinessBreakEvenResult {
  const fixed = Math.max(0, Number(input.fixedCosts) || 0);
  const variable = Math.max(0, Number(input.variableCostPerUnit) || 0);
  const price = Math.max(0, Number(input.sellingPricePerUnit) || 0);
  const targetUnits = Math.max(0, Number(input.targetUnitsSold) || 0);

  const unitContribution = price - variable;
  const isViable = unitContribution > 0;

  const contributionMarginRatio = price > 0 && isViable ? (unitContribution / price) * 100 : 0;

  const breakEvenUnits = isViable ? Math.ceil(fixed / unitContribution) : 0;
  const breakEvenRevenue = breakEvenUnits * price;

  // Projections at target units
  const unitsToEvaluate = targetUnits > 0 ? targetUnits : breakEvenUnits;
  const projectedRevenue = unitsToEvaluate * price;
  const projectedTotalCosts = fixed + unitsToEvaluate * variable;
  const projectedProfitOrLoss = projectedRevenue - projectedTotalCosts;

  return {
    fixedCosts: fixed,
    variableCostPerUnit: variable,
    sellingPricePerUnit: price,
    unitContributionMargin: unitContribution,
    contributionMarginRatio,
    breakEvenUnits,
    breakEvenRevenue,
    targetUnitsSold: targetUnits,
    projectedRevenue,
    projectedTotalCosts,
    projectedProfitOrLoss,
    isViable,
  };
}
