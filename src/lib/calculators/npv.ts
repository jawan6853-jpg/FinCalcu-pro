/**
 * Net Present Value (NPV) Calculator Engine
 * Formula: NPV = -Initial_Investment + Σ [CF_t / (1 + r)^t]
 */

export interface NpvCashFlow {
  period: number;
  cashFlow: number;
}

export interface NpvInput {
  initialInvestment: number; // Initial capital expenditure ($)
  discountRate: number; // Discount rate in % (e.g. 10%)
  cashFlows: number[]; // Yearly or periodic cash inflows ($)
}

export interface NpvResult {
  npv: number;
  totalNominalInflows: number;
  presentValueInflows: number;
  netProfit: number;
  profitabilityIndex: number; // PV of Inflows / Initial Outlay
  isAcceptable: boolean; // NPV > 0
  schedule: {
    period: number;
    cashFlow: number;
    discountFactor: number;
    discountedCashFlow: number;
    cumulativeNpv: number;
  }[];
}

export function calculateNpv(input: NpvInput): NpvResult {
  const initial = Math.max(0, Number(input.initialInvestment) || 0);
  const discountRatePercent = Number(input.discountRate) || 0;
  const rawFlows = Array.isArray(input.cashFlows) ? input.cashFlows : [];
  const r = discountRatePercent / 100;

  let totalNominalInflows = 0;
  let presentValueInflows = 0;
  let runningNpv = -initial;

  const schedule: NpvResult['schedule'] = [];

  // Period 0 (Initial outlay)
  schedule.push({
    period: 0,
    cashFlow: -initial,
    discountFactor: 1,
    discountedCashFlow: -initial,
    cumulativeNpv: -initial,
  });

  rawFlows.forEach((flow, idx) => {
    const period = idx + 1;
    const cf = Number(flow) || 0;
    totalNominalInflows += cf;

    const discountFactor = r >= -0.999 ? Math.pow(1 + r, -period) : 0;
    const dcf = cf * discountFactor;
    presentValueInflows += dcf;
    runningNpv += dcf;

    schedule.push({
      period,
      cashFlow: cf,
      discountFactor: Math.round(discountFactor * 10000) / 10000,
      discountedCashFlow: Math.round(dcf * 100) / 100,
      cumulativeNpv: Math.round(runningNpv * 100) / 100,
    });
  });

  const npv = presentValueInflows - initial;
  const netProfit = totalNominalInflows - initial;
  const profitabilityIndex = initial > 0 ? presentValueInflows / initial : presentValueInflows > 0 ? 1 : 0;

  return {
    npv: Math.round(npv * 100) / 100,
    totalNominalInflows: Math.round(totalNominalInflows * 100) / 100,
    presentValueInflows: Math.round(presentValueInflows * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    profitabilityIndex: Math.round(profitabilityIndex * 100) / 100,
    isAcceptable: npv >= 0,
    schedule,
  };
}
