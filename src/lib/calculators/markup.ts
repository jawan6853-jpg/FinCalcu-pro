/**
 * Markup Calculator Engine
 * Calculates: Markup amount, Markup %, Selling price, Cost price, and equivalent Gross Margin %
 */

export interface MarkupInput {
  mode?: 'cost-and-markup' | 'cost-and-revenue' | 'revenue-and-markup';
  costPrice?: number;
  markupPercent?: number;
  sellingPrice?: number;
}

export interface MarkupResult {
  costPrice: number;
  sellingPrice: number;
  markupAmount: number;
  markupPercent: number;
  grossMarginPercent: number;
}

export function calculateMarkup(input: MarkupInput): MarkupResult {
  const mode = input.mode || 'cost-and-markup';

  let cost = Math.max(0, Number(input.costPrice) || 0);
  let markupPct = Math.max(0, Number(input.markupPercent) || 0);
  let sellPrice = Math.max(0, Number(input.sellingPrice) || 0);

  if (mode === 'cost-and-markup') {
    cost = Math.max(0, Number(input.costPrice) || 0);
    markupPct = Math.max(0, Number(input.markupPercent) || 0);
    const markupAmt = cost * (markupPct / 100);
    sellPrice = cost + markupAmt;
  } else if (mode === 'cost-and-revenue') {
    cost = Math.max(0, Number(input.costPrice) || 0);
    sellPrice = Math.max(0, Number(input.sellingPrice) || 0);
    const markupAmt = sellPrice - cost;
    markupPct = cost > 0 ? (markupAmt / cost) * 100 : 0;
  } else if (mode === 'revenue-and-markup') {
    sellPrice = Math.max(0, Number(input.sellingPrice) || 0);
    markupPct = Math.max(0, Number(input.markupPercent) || 0);
    cost = markupPct >= 0 ? sellPrice / (1 + markupPct / 100) : 0;
  }

  const markupAmount = sellPrice - cost;
  const grossMargin = sellPrice > 0 ? (markupAmount / sellPrice) * 100 : 0;

  return {
    costPrice: cost,
    sellingPrice: sellPrice,
    markupAmount,
    markupPercent: markupPct,
    grossMarginPercent: grossMargin,
  };
}
