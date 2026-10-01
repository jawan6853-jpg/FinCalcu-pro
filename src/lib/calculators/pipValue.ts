/**
 * Forex Pip Value Calculator Engine
 * Calculates: Exact pip value in account currency across Standard, Mini, Micro lots
 */

export type LotType = 'standard' | 'mini' | 'micro' | 'custom';

export interface PipValueInput {
  currencyPair: string; // e.g. "EUR/USD", "USD/JPY", "GBP/USD", "USD/CAD", "EUR/GBP", "BTC/USD"
  lotType: LotType; // Standard (100k), Mini (10k), Micro (1k), Custom
  numberOfLots: number; // e.g. 1.0, 2.5, 0.1
  customLotUnits?: number; // Only if lotType === 'custom'
  exchangeRate: number; // Current market price of the pair
  accountCurrency?: string; // Default 'USD'
}

export interface PipValueResult {
  pipValuePerLot: number; // Dollar value of 1 pip for single lot
  totalPipValue: number; // Total dollar value of 1 pip for entered lot size
  pipSize: number; // 0.0001 or 0.01
  totalUnitsTraded: number; // Total contracts/units
  pipMovementsTable: {
    pips: number;
    profitOrLoss: number;
  }[];
  formulaExplanation: string;
}

export const POPULAR_PAIRS = [
  { pair: 'EUR/USD', defaultRate: 1.085, pipSize: 0.0001, quoteCurrency: 'USD' },
  { pair: 'GBP/USD', defaultRate: 1.295, pipSize: 0.0001, quoteCurrency: 'USD' },
  { pair: 'USD/JPY', defaultRate: 154.5, pipSize: 0.01, quoteCurrency: 'JPY' },
  { pair: 'USD/CHF', defaultRate: 0.885, pipSize: 0.0001, quoteCurrency: 'CHF' },
  { pair: 'USD/CAD', defaultRate: 1.385, pipSize: 0.0001, quoteCurrency: 'CAD' },
  { pair: 'AUD/USD', defaultRate: 0.655, pipSize: 0.0001, quoteCurrency: 'USD' },
  { pair: 'NZD/USD', defaultRate: 0.595, pipSize: 0.0001, quoteCurrency: 'USD' },
  { pair: 'EUR/GBP', defaultRate: 0.838, pipSize: 0.0001, quoteCurrency: 'GBP' },
  { pair: 'EUR/JPY', defaultRate: 167.6, pipSize: 0.01, quoteCurrency: 'JPY' },
  { pair: 'GBP/JPY', defaultRate: 200.1, pipSize: 0.01, quoteCurrency: 'JPY' },
  { pair: 'BTC/USD', defaultRate: 64500, pipSize: 1.0, quoteCurrency: 'USD' },
];

export function calculatePipValue(input: PipValueInput): PipValueResult {
  const pair = input.currencyPair || 'EUR/USD';
  const rate = Math.max(0.00001, Number(input.exchangeRate) || 1.085);
  const lots = Math.max(0.01, Number(input.numberOfLots) || 1);
  const lotType = input.lotType || 'standard';

  // Determine units per 1.0 lot
  let unitsPerLot = 100000;
  if (lotType === 'mini') unitsPerLot = 10000;
  else if (lotType === 'micro') unitsPerLot = 1000;
  else if (lotType === 'custom') unitsPerLot = Math.max(1, Number(input.customLotUnits) || 100000);

  const totalUnitsTraded = unitsPerLot * lots;

  // Determine pip size based on pair
  const isJpy = pair.toUpperCase().includes('JPY');
  const isBtc = pair.toUpperCase().includes('BTC');
  const pipSize = isBtc ? 1.0 : isJpy ? 0.01 : 0.0001;

  // Base calculation: Pip Value in Quote Currency = Units * PipSize
  const pipValueInQuoteCurrencyPerUnit = pipSize;
  const singleLotQuotePipValue = unitsPerLot * pipValueInQuoteCurrencyPerUnit;

  // Convert to USD (account currency assumed USD)
  let singleLotUsd = singleLotQuotePipValue;
  if (pair.endsWith('USD')) {
    // Quote is USD (EUR/USD, GBP/USD, AUD/USD, BTC/USD)
    singleLotUsd = singleLotQuotePipValue;
  } else if (pair.startsWith('USD/')) {
    // Base is USD, quote is other (USD/JPY, USD/CHF, USD/CAD) -> Divide by rate
    singleLotUsd = singleLotQuotePipValue / rate;
  } else {
    // Cross pair (e.g. EUR/GBP) -> approximate or standard
    singleLotUsd = singleLotQuotePipValue * (pair.includes('GBP') ? 1.29 : 1.0);
  }

  const pipValuePerLot = Math.max(0.0001, singleLotUsd);
  const totalPipValue = pipValuePerLot * lots;

  const movementPips = [5, 10, 20, 50, 100, 200];
  const pipMovementsTable = movementPips.map((pips) => ({
    pips,
    profitOrLoss: Math.round(pips * totalPipValue * 100) / 100,
  }));

  const formulaExplanation = pair.endsWith('USD')
    ? `Pip Value = Lot Size (${unitsPerLot.toLocaleString()}) × Pip Size (${pipSize}) × Number of Lots (${lots}) = $${totalPipValue.toFixed(2)}`
    : `Pip Value = [Lot Size (${unitsPerLot.toLocaleString()}) × Pip Size (${pipSize}) / Exchange Rate (${rate})] × Lots (${lots}) = $${totalPipValue.toFixed(2)}`;

  return {
    pipValuePerLot: Math.round(pipValuePerLot * 100) / 100,
    totalPipValue: Math.round(totalPipValue * 100) / 100,
    pipSize,
    totalUnitsTraded,
    pipMovementsTable,
    formulaExplanation,
  };
}
