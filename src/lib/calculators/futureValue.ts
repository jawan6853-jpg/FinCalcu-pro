/**
 * Future Value (FV) Calculator Engine
 * Formula: FV = PV * (1 + r/m)^(m*t) + PMT * [((1 + r/m)^(m*t) - 1) / (r/m)] * (1 + (r/m) * timing)
 */

export type CompoundingFrequency = 'annually' | 'semi-annually' | 'quarterly' | 'monthly' | 'daily';

export interface FutureValueInput {
  presentValue: number; // Initial principal PV
  annualInterestRate: number; // Annual rate in % (e.g. 7.5)
  years: number; // Time horizon in years
  periodicDeposit?: number; // Optional recurring deposit PMT
  depositFrequency?: 'monthly' | 'annually'; // Deposit cadence
  compoundingFrequency?: CompoundingFrequency; // Compounding intervals per year
  depositTiming?: 'end' | 'beginning'; // End of period vs Beginning (annuity due)
}

export interface FutureValueResult {
  futureValue: number;
  totalPrincipalInvested: number;
  totalInterestEarned: number;
  effectiveAnnualRate: number;
  growthMultiple: number;
  yearlyBreakdown: {
    year: number;
    startingBalance: number;
    deposits: number;
    interestEarned: number;
    endingBalance: number;
  }[];
}

const FREQUENCY_MAP: Record<CompoundingFrequency, number> = {
  annually: 1,
  'semi-annually': 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

export function calculateFutureValue(input: FutureValueInput): FutureValueResult {
  const pv = Math.max(0, Number(input.presentValue) || 0);
  const annualRatePercent = Number(input.annualInterestRate) || 0;
  const years = Math.max(0, Number(input.years) || 0);
  const pmt = Math.max(0, Number(input.periodicDeposit) || 0);
  const depFreq = input.depositFrequency || 'monthly';
  const compFreq = input.compoundingFrequency || 'monthly';
  const timing = input.depositTiming === 'beginning' ? 1 : 0;

  const m = FREQUENCY_MAP[compFreq] || 12;
  const pmtPerYear = depFreq === 'monthly' ? 12 : 1;
  const r = annualRatePercent / 100;

  // Handle 0 years
  if (years <= 0) {
    return {
      futureValue: pv,
      totalPrincipalInvested: pv,
      totalInterestEarned: 0,
      effectiveAnnualRate: 0,
      growthMultiple: 1,
      yearlyBreakdown: [
        {
          year: 0,
          startingBalance: pv,
          deposits: 0,
          interestEarned: 0,
          endingBalance: pv,
        },
      ],
    };
  }

  // Handle 0% interest
  if (r === 0) {
    const totalDeposits = pmt * pmtPerYear * years;
    const totalPrincipal = pv + totalDeposits;
    const breakdown = [];
    let runningBalance = pv;

    for (let yr = 1; yr <= Math.min(years, 50); yr++) {
      const yrDeposits = pmt * pmtPerYear;
      const start = runningBalance;
      runningBalance += yrDeposits;
      breakdown.push({
        year: yr,
        startingBalance: Math.round(start * 100) / 100,
        deposits: Math.round(yrDeposits * 100) / 100,
        interestEarned: 0,
        endingBalance: Math.round(runningBalance * 100) / 100,
      });
    }

    return {
      futureValue: totalPrincipal,
      totalPrincipalInvested: totalPrincipal,
      totalInterestEarned: 0,
      effectiveAnnualRate: 0,
      growthMultiple: pv > 0 ? totalPrincipal / pv : 1,
      yearlyBreakdown: breakdown,
    };
  }

  // Effective Annual Rate: EAR = (1 + r/m)^m - 1
  const ear = Math.pow(1 + r / m, m) - 1;

  // Yearly simulation
  const yearlyBreakdown: FutureValueResult['yearlyBreakdown'] = [];
  let currentBalance = pv;
  let totalDepositsMade = 0;

  for (let yr = 1; yr <= Math.min(years, 60); yr++) {
    const startBal = currentBalance;
    let yrInterest = 0;
    let yrDeposits = 0;

    // Simulate each deposit period within the year
    const periodsInYear = pmtPerYear;
    const periodicRate = Math.pow(1 + ear, 1 / periodsInYear) - 1;

    for (let p = 1; p <= periodsInYear; p++) {
      if (timing === 1) {
        // Beginning of period
        currentBalance += pmt;
        yrDeposits += pmt;
        const interest = currentBalance * periodicRate;
        currentBalance += interest;
        yrInterest += interest;
      } else {
        // End of period
        const interest = currentBalance * periodicRate;
        currentBalance += interest + pmt;
        yrInterest += interest;
        yrDeposits += pmt;
      }
    }

    totalDepositsMade += yrDeposits;
    yearlyBreakdown.push({
      year: yr,
      startingBalance: Math.round(startBal * 100) / 100,
      deposits: Math.round(yrDeposits * 100) / 100,
      interestEarned: Math.round(yrInterest * 100) / 100,
      endingBalance: Math.round(currentBalance * 100) / 100,
    });
  }

  const totalPrincipalInvested = pv + totalDepositsMade;
  const futureValue = currentBalance;
  const totalInterestEarned = Math.max(0, futureValue - totalPrincipalInvested);
  const growthMultiple = totalPrincipalInvested > 0 ? futureValue / totalPrincipalInvested : 1;

  return {
    futureValue: Math.round(futureValue * 100) / 100,
    totalPrincipalInvested: Math.round(totalPrincipalInvested * 100) / 100,
    totalInterestEarned: Math.round(totalInterestEarned * 100) / 100,
    effectiveAnnualRate: Math.round(ear * 10000) / 100,
    growthMultiple: Math.round(growthMultiple * 100) / 100,
    yearlyBreakdown,
  };
}
