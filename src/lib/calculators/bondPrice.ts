/**
 * Bond Price Calculator Engine
 * Formula: Bond Price = Σ [C / (1 + y/m)^t] + [F / (1 + y/m)^(n*m)]
 * Calculates: Estimated Bond Price, % of Par, Premium/Discount Status, Component PVs
 */

export type BondFrequency = 'annual' | 'semi-annual' | 'quarterly';

export interface BondPriceInput {
  faceValue: number; // Par value ($ e.g. 1000)
  couponRate: number; // Annual coupon rate % (e.g. 5.0%)
  marketYield: number; // Required yield / market interest rate % (e.g. 4.5%)
  yearsToMaturity: number; // Years until maturity (e.g. 10)
  paymentFrequency: BondFrequency;
}

export interface BondPriceResult {
  faceValue: number;
  couponRate: number;
  marketYield: number;
  yearsToMaturity: number;
  paymentFrequency: BondFrequency;
  estimatedPrice: number;
  percentageOfPar: number;
  tradingStatus: 'Trading at Premium' | 'Trading at Discount' | 'Trading at Par';
  periodicCouponPayment: number;
  totalCouponPaymentsOverLife: number;
  presentValueOfCoupons: number;
  presentValueOfFaceValue: number;
  annualCouponIncome: number;
}

export function calculateBondPrice(input: BondPriceInput): BondPriceResult {
  const F = Math.max(1, Number(input.faceValue) || 1000);
  const cRate = Math.max(0, Number(input.couponRate) || 0) / 100;
  const ytm = Math.max(0.00001, Number(input.marketYield) || 0.00001) / 100;
  const years = Math.max(0.1, Number(input.yearsToMaturity) || 10);
  const freq = input.paymentFrequency || 'semi-annual';

  let m = 2;
  if (freq === 'annual') m = 1;
  else if (freq === 'semi-annual') m = 2;
  else if (freq === 'quarterly') m = 4;

  const totalPeriods = years * m;
  const periodicYield = ytm / m;
  const periodicCoupon = (F * cRate) / m;
  const annualCouponIncome = F * cRate;

  // PV of coupon annuity: C * [(1 - (1 + y)^(-n)) / y]
  const pvCoupons = periodicCoupon * ((1 - Math.pow(1 + periodicYield, -totalPeriods)) / periodicYield);

  // PV of par: F / (1 + y)^n
  const pvFace = F / Math.pow(1 + periodicYield, totalPeriods);

  const estimatedPrice = pvCoupons + pvFace;
  const percentageOfPar = (estimatedPrice / F) * 100;

  let tradingStatus: BondPriceResult['tradingStatus'] = 'Trading at Par';
  if (estimatedPrice > F + 0.01) {
    tradingStatus = 'Trading at Premium';
  } else if (estimatedPrice < F - 0.01) {
    tradingStatus = 'Trading at Discount';
  }

  return {
    faceValue: F,
    couponRate: cRate * 100,
    marketYield: ytm * 100,
    yearsToMaturity: years,
    paymentFrequency: freq,
    estimatedPrice,
    percentageOfPar,
    tradingStatus,
    periodicCouponPayment: periodicCoupon,
    totalCouponPaymentsOverLife: periodicCoupon * totalPeriods,
    presentValueOfCoupons: pvCoupons,
    presentValueOfFaceValue: pvFace,
    annualCouponIncome,
  };
}
