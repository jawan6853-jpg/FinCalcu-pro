/**
 * Internal Rate of Return (IRR) Calculator Engine
 * Solves for r such that: NPV(r) = -Initial + Σ [CF_t / (1 + r)^t] = 0
 */

export interface IrrInput {
  initialInvestment: number; // Initial cash outflow ($)
  cashFlows: number[]; // Yearly or periodic cash inflows ($)
  hurdleRate?: number; // Target benchmark/hurdle rate in % (e.g. 10%)
}

export interface IrrResult {
  irrPercentage: number | null; // e.g. 14.28%
  totalInflows: number;
  netProfit: number;
  capitalMultiplier: number;
  beatsHurdleRate: boolean | null;
  npvProfile: {
    rate: number;
    npv: number;
  }[];
  hasValidSolution: boolean;
  statusMessage: string;
}

export function calculateIrr(input: IrrInput): IrrResult {
  const initial = Math.max(0, Number(input.initialInvestment) || 0);
  const flows = (Array.isArray(input.cashFlows) ? input.cashFlows : []).map((f) => Number(f) || 0);
  const hurdleRate = input.hurdleRate !== undefined ? Number(input.hurdleRate) : 10;

  const totalInflows = flows.reduce((acc, curr) => acc + curr, 0);
  const netProfit = totalInflows - initial;
  const capitalMultiplier = initial > 0 ? totalInflows / initial : 1;

  // NPV function
  const npvAt = (rate: number): number => {
    let val = -initial;
    for (let t = 0; t < flows.length; t++) {
      val += flows[t] / Math.pow(1 + rate, t + 1);
    }
    return val;
  };

  // Derivative of NPV with respect to r
  const dNpvAt = (rate: number): number => {
    let dVal = 0;
    for (let t = 0; t < flows.length; t++) {
      dVal -= ((t + 1) * flows[t]) / Math.pow(1 + rate, t + 2);
    }
    return dVal;
  };

  // Check trivial or impossible states
  if (initial === 0 || flows.length === 0 || totalInflows === 0) {
    return {
      irrPercentage: null,
      totalInflows,
      netProfit,
      capitalMultiplier,
      beatsHurdleRate: null,
      npvProfile: [],
      hasValidSolution: false,
      statusMessage: 'Please enter an initial investment and at least one positive cash inflow.',
    };
  }

  // If total inflows are less than initial investment, IRR is negative or no positive return
  // Try Newton-Raphson from multiple starting guesses
  let solution: number | null = null;
  const guesses = [0.1, 0.05, 0.2, -0.05, 0.5, 1.0, -0.2];

  for (const guess of guesses) {
    let r = guess;
    let iterations = 0;
    const maxIterations = 100;
    const tolerance = 1e-7;

    while (iterations < maxIterations) {
      if (r <= -0.9999) {
        r = -0.99;
      }
      const npv = npvAt(r);
      const dNpv = dNpvAt(r);

      if (Math.abs(npv) < tolerance) {
        solution = r;
        break;
      }

      if (Math.abs(dNpv) < 1e-12) {
        break; // derivative too flat
      }

      const nextR = r - npv / dNpv;
      if (Math.abs(nextR - r) < tolerance) {
        solution = nextR;
        break;
      }

      r = nextR;
      iterations++;
    }

    if (solution !== null && !isNaN(solution) && isFinite(solution) && solution > -0.99) {
      break;
    }
    solution = null;
  }

  // Fallback to Bisection if Newton-Raphson failed
  if (solution === null) {
    let low = -0.90;
    let high = 5.0; // up to 500% return
    const npvLow = npvAt(low);
    const npvHigh = npvAt(high);

    if (npvLow * npvHigh <= 0) {
      for (let i = 0; i < 100; i++) {
        const mid = (low + high) / 2;
        const npvMid = npvAt(mid);
        if (Math.abs(npvMid) < 1e-5) {
          solution = mid;
          break;
        }
        if (npvLow * npvMid < 0) {
          high = mid;
        } else {
          low = mid;
        }
        solution = mid;
      }
    }
  }

  // NPV profile across standard discount rates
  const testRates = [0, 0.05, 0.08, 0.1, 0.12, 0.15, 0.2, 0.25];
  const npvProfile = testRates.map((tr) => ({
    rate: tr * 100,
    npv: Math.round(npvAt(tr) * 100) / 100,
  }));

  const irrPercentage = solution !== null && isFinite(solution)
    ? Math.round(solution * 10000) / 100
    : null;

  const beatsHurdleRate = irrPercentage !== null ? irrPercentage >= hurdleRate : null;

  return {
    irrPercentage,
    totalInflows: Math.round(totalInflows * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    capitalMultiplier: Math.round(capitalMultiplier * 100) / 100,
    beatsHurdleRate,
    npvProfile,
    hasValidSolution: irrPercentage !== null,
    statusMessage: irrPercentage !== null
      ? `Project IRR is ${irrPercentage}%. ${
          beatsHurdleRate
            ? `Exceeds your ${hurdleRate}% hurdle rate.`
            : `Below your ${hurdleRate}% target rate.`
        }`
      : 'No standard real IRR rate found for these cash flows.',
  };
}
