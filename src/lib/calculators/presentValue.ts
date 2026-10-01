/**
 * Present Value (PV) Calculator Engine
 * Formula: PV = FV / (1 + r/m)^(m*t) + PMT * [1 - (1 + r/m)^(-m*t)] / (r/m)
 */

export interface PresentValueInput {
  futureValue: number; // Target lump sum in future ($)
  discountRate: number; // Annual discount rate in % (e.g. 6.5%)
  years: number; // Number of years
  periodicCashFlow?: number; // Optional periodic cash flow (annuity PMT)
  frequency?: 'annually' | 'monthly' | 'quarterly';
}

export interface PresentValueResult {
  presentValue: number;
  futureValue: number;
  totalDiscount: number;
  discountFactor: number;
  pvLumpSumOnly: number;
  pvAnnuityOnly: number;
  timeline: {
    year: number;
    nominalValue: number;
    discountedValue: number;
    cumulativeDiscount: number;
  }[];
}

export function calculatePresentValue(input: PresentValueInput): PresentValueResult {
  const fv = Math.max(0, Number(input.futureValue) || 0);
  const ratePercent = Math.max(0, Number(input.discountRate) || 0);
  const years = Math.max(0, Number(input.years) || 0);
  const pmt = Math.max(0, Number(input.periodicCashFlow) || 0);
  const freq = input.frequency || 'annually';

  const m = freq === 'monthly' ? 12 : freq === 'quarterly' ? 4 : 1;
  const r = ratePercent / 100;
  const periodicRate = r / m;
  const totalPeriods = years * m;

  if (years <= 0 || (r === 0 && pmt === 0)) {
    const directPV = fv + pmt * totalPeriods;
    return {
      presentValue: directPV,
      futureValue: fv,
      totalDiscount: 0,
      discountFactor: 1,
      pvLumpSumOnly: fv,
      pvAnnuityOnly: pmt * totalPeriods,
      timeline: [
        {
          year: 0,
          nominalValue: directPV,
          discountedValue: directPV,
          cumulativeDiscount: 0,
        },
      ],
    };
  }

  // Lump sum PV = FV / (1 + periodicRate)^totalPeriods
  const discountFactor = totalPeriods > 0 && periodicRate > 0
    ? Math.pow(1 + periodicRate, -totalPeriods)
    : 1;
  const pvLumpSumOnly = fv * discountFactor;

  // Annuity PV = PMT * [1 - (1 + r/m)^(-n*m)] / (r/m)
  let pvAnnuityOnly = 0;
  if (pmt > 0 && periodicRate > 0) {
    pvAnnuityOnly = pmt * ((1 - Math.pow(1 + periodicRate, -totalPeriods)) / periodicRate);
  } else if (pmt > 0) {
    pvAnnuityOnly = pmt * totalPeriods;
  }

  const presentValue = pvLumpSumOnly + pvAnnuityOnly;
  const totalNominal = fv + pmt * totalPeriods;
  const totalDiscount = Math.max(0, totalNominal - presentValue);

  // Build timeline
  const timeline: PresentValueResult['timeline'] = [];
  const maxYears = Math.min(Math.max(1, Math.ceil(years)), 40);

  for (let yr = 0; yr <= maxYears; yr++) {
    const yrPeriods = yr * m;
    const factorAtYr = yrPeriods > 0 && periodicRate > 0
      ? Math.pow(1 + periodicRate, -yrPeriods)
      : 1;

    const nominalAtYr = fv + pmt * yrPeriods;
    const discAtYr = (fv * factorAtYr) + (periodicRate > 0 && pmt > 0 ? pmt * ((1 - factorAtYr) / periodicRate) : pmt * yrPeriods);

    timeline.push({
      year: yr,
      nominalValue: Math.round(nominalAtYr * 100) / 100,
      discountedValue: Math.round(discAtYr * 100) / 100,
      cumulativeDiscount: Math.round(Math.max(0, nominalAtYr - discAtYr) * 100) / 100,
    });
  }

  return {
    presentValue: Math.round(presentValue * 100) / 100,
    futureValue: fv,
    totalDiscount: Math.round(totalDiscount * 100) / 100,
    discountFactor: Math.round(discountFactor * 10000) / 10000,
    pvLumpSumOnly: Math.round(pvLumpSumOnly * 100) / 100,
    pvAnnuityOnly: Math.round(pvAnnuityOnly * 100) / 100,
    timeline,
  };
}
