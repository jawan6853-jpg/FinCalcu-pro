/**
 * Net Worth Calculator Engine
 * Formula: Net Worth = Total Assets - Total Liabilities
 * Calculates: Total Assets, Total Liabilities, Net Worth, Debt Ratio, Liquid Assets Ratio
 */

export interface NetWorthInput {
  // Assets
  cashAndBank: number;
  investments: number;
  realEstate: number;
  cryptoAssets: number;
  retirementAccounts: number;
  otherAssets: number;

  // Liabilities
  mortgageBalance: number;
  autoLoans: number;
  studentLoans: number;
  creditCardDebt: number;
  personalLoans: number;
  otherLiabilities: number;
}

export interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  liquidAssets: number;
  liquidRatioPercentage: number;
  debtToAssetPercentage: number;
  assetToDebtRatio: number;
  assetBreakdown: {
    cashAndBank: number;
    investments: number;
    realEstate: number;
    cryptoAssets: number;
    retirementAccounts: number;
    otherAssets: number;
  };
  liabilityBreakdown: {
    mortgageBalance: number;
    autoLoans: number;
    studentLoans: number;
    creditCardDebt: number;
    personalLoans: number;
    otherLiabilities: number;
  };
  financialHealthTier: 'Emerging' | 'Stable' | 'Solid' | 'High Net Worth' | 'Ultra High Net Worth';
}

export function calculateNetWorth(input: NetWorthInput): NetWorthResult {
  const cash = Math.max(0, Number(input.cashAndBank) || 0);
  const investments = Math.max(0, Number(input.investments) || 0);
  const realEstate = Math.max(0, Number(input.realEstate) || 0);
  const crypto = Math.max(0, Number(input.cryptoAssets) || 0);
  const retirement = Math.max(0, Number(input.retirementAccounts) || 0);
  const otherA = Math.max(0, Number(input.otherAssets) || 0);

  const totalAssets = cash + investments + realEstate + crypto + retirement + otherA;
  const liquidAssets = cash + investments + crypto;

  const mortgage = Math.max(0, Number(input.mortgageBalance) || 0);
  const auto = Math.max(0, Number(input.autoLoans) || 0);
  const student = Math.max(0, Number(input.studentLoans) || 0);
  const cards = Math.max(0, Number(input.creditCardDebt) || 0);
  const personal = Math.max(0, Number(input.personalLoans) || 0);
  const otherL = Math.max(0, Number(input.otherLiabilities) || 0);

  const totalLiabilities = mortgage + auto + student + cards + personal + otherL;
  const netWorth = totalAssets - totalLiabilities;

  const debtToAssetPercentage = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
  const liquidRatioPercentage = totalAssets > 0 ? (liquidAssets / totalAssets) * 100 : 0;
  const assetToDebtRatio = totalLiabilities > 0 ? totalAssets / totalLiabilities : totalAssets > 0 ? 999 : 0;

  let financialHealthTier: NetWorthResult['financialHealthTier'] = 'Emerging';
  if (netWorth >= 5000000) {
    financialHealthTier = 'Ultra High Net Worth';
  } else if (netWorth >= 1000000) {
    financialHealthTier = 'High Net Worth';
  } else if (netWorth >= 250000) {
    financialHealthTier = 'Solid';
  } else if (netWorth >= 50000) {
    financialHealthTier = 'Stable';
  }

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    liquidAssets,
    liquidRatioPercentage,
    debtToAssetPercentage,
    assetToDebtRatio,
    assetBreakdown: {
      cashAndBank: cash,
      investments,
      realEstate,
      cryptoAssets: crypto,
      retirementAccounts: retirement,
      otherAssets: otherA,
    },
    liabilityBreakdown: {
      mortgageBalance: mortgage,
      autoLoans: auto,
      studentLoans: student,
      creditCardDebt: cards,
      personalLoans: personal,
      otherLiabilities: otherL,
    },
    financialHealthTier,
  };
}
