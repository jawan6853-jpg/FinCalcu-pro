/**
 * Bond Yield Calculator Engine
 * Calculates: Current Yield, Approximate Yield to Maturity (YTM), Coupon Payment, and Discount/Premium
 */

export interface BondYieldInput {
  currentBondPrice: number; // Current trading price ($)
  faceValue: number; // Par/Face value ($ typically 1000)
  annualCouponRatePercent: number; // Annual coupon interest rate % (e.g. 5.5%)
  yearsToMaturity: number; // Remaining years until maturity
  couponFrequency?: 'annual' | 'semi-annual'; // Payment frequency
}

export interface BondYieldResult {
  currentYieldPercent: number;
  approxYieldToMaturityPercent: number;
  annualCouponPayment: number;
  totalCouponPayments: number;
  priceStatus: 'Par' | 'Discount' | 'Premium';
  discountOrPremiumAmount: number;
  discountOrPremiumPercent: number;
  totalReturnAtMaturity: number;
}

export function calculateBondYield(input: BondYieldInput): BondYieldResult {
  const price = Math.max(0.01, Number(input.currentBondPrice) || 1000);
  const face = Math.max(0.01, Number(input.faceValue) || 1000);
  const couponRate = Math.max(0, Number(input.annualCouponRatePercent) || 0) / 100;
  const n = Math.max(0.1, Number(input.yearsToMaturity) || 5);

  const annualCoupon = face * couponRate;
  const totalCoupons = annualCoupon * n;

  // 1. Current Yield = Annual Coupon / Current Price
  const currentYield = (annualCoupon / price) * 100;

  // 2. Approximate Yield to Maturity (YTM)
  // YTM = [C + (F - P) / n] / [(F + P) / 2]
  const numerator = annualCoupon + (face - price) / n;
  const denominator = (face + price) / 2;
  const approxYTM = denominator > 0 ? (numerator / denominator) * 100 : 0;

  const diff = price - face;
  let priceStatus: BondYieldResult['priceStatus'] = 'Par';
  if (diff > 1) priceStatus = 'Premium';
  else if (diff < -1) priceStatus = 'Discount';

  const discountOrPremiumAmount = Math.abs(diff);
  const discountOrPremiumPercent = (discountOrPremiumAmount / face) * 100;
  const totalReturnAtMaturity = totalCoupons + (face - price);

  return {
    currentYieldPercent: Math.round(currentYield * 100) / 100,
    approxYieldToMaturityPercent: Math.round(approxYTM * 100) / 100,
    annualCouponPayment: Math.round(annualCoupon * 100) / 100,
    totalCouponPayments: Math.round(totalCoupons * 100) / 100,
    priceStatus,
    discountOrPremiumAmount: Math.round(discountOrPremiumAmount * 100) / 100,
    discountOrPremiumPercent: Math.round(discountOrPremiumPercent * 10) / 10,
    totalReturnAtMaturity: Math.round(totalReturnAtMaturity * 100) / 100,
  };
}
