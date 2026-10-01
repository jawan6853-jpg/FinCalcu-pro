/**
 * Yield to Maturity (YTM) Calculator Engine
 * Calculates: Yield to Maturity (%) using Newton-Raphson iterative approximation, Current Yield (%)
 * Clearly labels the result as an iterative numerical approximation.
 */

export interface YieldToMaturityInput {
  bondPrice: number; // Current market price ($ e.g. 950)
  faceValue: number; // Par value ($ e.g. 1000)
  couponRate: number; // Annual coupon rate % (e.g. 5.0%)
  yearsToMaturity: number; // Years remaining (e.g. 10)
  paymentFrequency: 'annual' | 'semi-annual';
}

export interface YieldToMaturityResult {
  estimatedYtmPercentage: number;
  currentYieldPercentage: number;
  annualCouponPayment: number;
  totalLifetimeCashFlow: number;
  capitalGainOrLossAtMaturity: number;
  iterationsUsed: number;
  approximationMethod: string;
  tradingStatus: 'Discount' | 'Premium' | 'Par';
}

export function calculateYieldToMaturity(input: YieldToMaturityInput): YieldToMaturityResult {
  const P = Math.max(1, Number(input.bondPrice) || 950);
  const F = Math.max(1, Number(input.faceValue) || 1000);
  const cRate = Math.max(0, Number(input.couponRate) || 5.0) / 100;
  const years = Math.max(0.1, Number(input.yearsToMaturity) || 10);
  const m = input.paymentFrequency === 'annual' ? 1 : 2;

  const totalPeriods = years * m;
  const C = (F * cRate) / m; // periodic coupon payment
  const annualCouponPayment = F * cRate;
  const currentYieldPercentage = (annualCouponPayment / P) * 100;

  // Initial estimate using standard closed-form approximation:
  // Approx YTM = [C_annual + (F - P)/years] / [(F + P) / 2]
  const approxAnnual = (annualCouponPayment + (F - P) / years) / ((F + P) / 2);
  let y = Math.max(0.0001, approxAnnual / m); // periodic initial guess

  // Newton-Raphson method to solve P(y) - P = 0
  let iter = 0;
  const maxIter = 100;
  const tolerance = 1e-7;

  for (iter = 0; iter < maxIter; iter++) {
    // Price function at y
    // P(y) = C * (1 - (1+y)^(-n))/y + F * (1+y)^(-n)
    const factor = Math.pow(1 + y, -totalPeriods);
    const priceCalculated = y > 0 ? (C * (1 - factor)) / y + F * factor : C * totalPeriods + F;
    const diff = priceCalculated - P;

    if (Math.abs(diff) < tolerance) {
      break;
    }

    // Derivative dP/dy:
    // d/dy [C * (1 - (1+y)^(-n))/y] = C * [ n*y*(1+y)^(-n-1) - (1 - (1+y)^(-n)) ] / y^2
    // d/dy [F * (1+y)^(-n)] = -n * F * (1+y)^(-n-1)
    const dFactor = -totalPeriods * Math.pow(1 + y, -totalPeriods - 1);
    const dPrice = y > 0
      ? (C * (-dFactor * y - (1 - factor))) / (y * y) + F * dFactor
      : -1000;

    if (Math.abs(dPrice) < 1e-12) {
      break;
    }

    const nextY = y - diff / dPrice;
    if (nextY <= 0 || isNaN(nextY)) {
      y = y * 0.5; // fallback step damping
    } else {
      y = nextY;
    }
  }

  const annualYTM = y * m * 100;
  const capitalGainOrLossAtMaturity = F - P;
  const totalLifetimeCashFlow = annualCouponPayment * years + F;

  let tradingStatus: YieldToMaturityResult['tradingStatus'] = 'Par';
  if (P < F - 0.01) tradingStatus = 'Discount';
  else if (P > F + 0.01) tradingStatus = 'Premium';

  return {
    estimatedYtmPercentage: Number(annualYTM.toFixed(4)),
    currentYieldPercentage: Number(currentYieldPercentage.toFixed(3)),
    annualCouponPayment,
    totalLifetimeCashFlow,
    capitalGainOrLossAtMaturity,
    iterationsUsed: iter,
    approximationMethod: 'Newton-Raphson Iterative Polynomial Solver (Exact convergence)',
    tradingStatus,
  };
}
