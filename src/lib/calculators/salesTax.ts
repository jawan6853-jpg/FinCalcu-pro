import { parseInput, safeDivision } from '../formatters';

export interface SalesTaxInput {
  mode: 'add-tax' | 'reverse-tax';
  amount: number; // Pre-tax price (if add-tax) or Total gross price (if reverse-tax)
  salesTaxPercent: number; // e.g. 8.25%
}

export interface SalesTaxResult {
  mode: 'add-tax' | 'reverse-tax';
  preTaxAmount: number;
  taxAmount: number;
  totalWithTax: number;
  effectiveTaxRatePercent: number;
}

export function calculateSalesTax(input: SalesTaxInput): SalesTaxResult {
  const mode = input.mode || 'add-tax';
  const amount = Math.max(0, parseInput(input.amount, 100));
  const taxRate = Math.max(0, parseInput(input.salesTaxPercent, 8.25));

  let preTax = 0;
  let tax = 0;
  let total = 0;

  if (mode === 'add-tax') {
    preTax = amount;
    tax = amount * (taxRate / 100);
    total = preTax + tax;
  } else {
    // Reverse Tax: Total is known, extract pre-tax base and tax
    // Total = Base * (1 + r) => Base = Total / (1 + r)
    total = amount;
    preTax = safeDivision(total, 1 + taxRate / 100, total);
    tax = total - preTax;
  }

  return {
    mode,
    preTaxAmount: Number(preTax.toFixed(2)),
    taxAmount: Number(tax.toFixed(2)),
    totalWithTax: Number(total.toFixed(2)),
    effectiveTaxRatePercent: taxRate,
  };
}
