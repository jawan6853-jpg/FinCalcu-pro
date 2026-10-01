/**
 * Discount Calculator Engine
 * Calculates: Discount amount, final sale price, discount percentage, optional sales tax, and stacked coupon discounts
 */

export interface DiscountInput {
  mode?: 'from-percentage' | 'from-sale-price';
  originalPrice: number;
  discountPercent?: number; // e.g. 20%
  salePriceEntered?: number; // when calculating discount %
  additionalDiscountPercent?: number; // Extra coupon e.g. 10%
  salesTaxPercent?: number; // Optional sales tax %
}

export interface DiscountResult {
  originalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  additionalDiscountAmount: number;
  totalSavings: number;
  priceAfterDiscounts: number;
  salesTaxAmount: number;
  finalPriceWithTax: number;
  effectiveDiscountPercentage: number;
}

export function calculateDiscount(input: DiscountInput): DiscountResult {
  const orig = Math.max(0, Number(input.originalPrice) || 0);
  const mode = input.mode || 'from-percentage';
  const taxRate = Math.max(0, Number(input.salesTaxPercent) || 0) / 100;
  const extraPct = Math.max(0, Number(input.additionalDiscountPercent) || 0) / 100;

  let primaryDiscountPct = 0;
  let primarySavings = 0;
  let priceAfterPrimary = orig;

  if (mode === 'from-sale-price') {
    const saleEntered = Math.max(0, Number(input.salePriceEntered) || 0);
    priceAfterPrimary = Math.min(orig, saleEntered);
    primarySavings = Math.max(0, orig - priceAfterPrimary);
    primaryDiscountPct = orig > 0 ? (primarySavings / orig) * 100 : 0;
  } else {
    primaryDiscountPct = Math.max(0, Math.min(100, Number(input.discountPercent) || 0));
    primarySavings = orig * (primaryDiscountPct / 100);
    priceAfterPrimary = Math.max(0, orig - primarySavings);
  }

  // Stacked additional discount (applies to already-discounted price)
  const extraSavings = priceAfterPrimary * extraPct;
  const priceAfterDiscounts = Math.max(0, priceAfterPrimary - extraSavings);
  const totalSavings = primarySavings + extraSavings;

  // Sales Tax
  const salesTaxAmount = priceAfterDiscounts * taxRate;
  const finalPriceWithTax = priceAfterDiscounts + salesTaxAmount;

  const effectiveDiscountPercentage = orig > 0 ? (totalSavings / orig) * 100 : 0;

  return {
    originalPrice: orig,
    discountPercentage: primaryDiscountPct,
    discountAmount: primarySavings,
    additionalDiscountAmount: extraSavings,
    totalSavings,
    priceAfterDiscounts,
    salesTaxAmount,
    finalPriceWithTax,
    effectiveDiscountPercentage,
  };
}
