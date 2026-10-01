/**
 * Crypto Market Cap Calculator Engine
 * Calculates: Market Cap, Target Token Price, and Comparative Market Cap Valuations
 */

export interface CryptoMarketCapInput {
  tokenPrice?: number; // Current token price ($)
  circulatingSupply: number; // Circulating tokens
  targetMarketCap?: number; // Target market cap to solve for price ($)
  mode: 'solve-market-cap' | 'solve-price' | 'compare-benchmark';
  benchmarkMarketCap?: number; // e.g. Ethereum ($350B) or Solana ($80B)
}

export interface CryptoMarketCapResult {
  marketCap: number;
  tokenPrice: number;
  circulatingSupply: number;
  fullyDilutedValuation?: number;
  comparativePrice?: number;
  growthMultiplierNeeded?: number;
  formattedMarketCap: string;
}

export function calculateCryptoMarketCap(input: CryptoMarketCapInput): CryptoMarketCapResult {
  const supply = Math.max(0.000001, Number(input.circulatingSupply) || 1000000);
  const mode = input.mode || 'solve-market-cap';

  let tokenPrice = Math.max(0, Number(input.tokenPrice) || 0);
  let marketCap = 0;
  let comparativePrice: number | undefined;
  let growthMultiplierNeeded: number | undefined;

  if (mode === 'solve-price') {
    const targetCap = Math.max(0, Number(input.targetMarketCap) || 0);
    tokenPrice = supply > 0 ? targetCap / supply : 0;
    marketCap = targetCap;
  } else if (mode === 'compare-benchmark') {
    marketCap = tokenPrice * supply;
    const benchCap = Math.max(0, Number(input.benchmarkMarketCap) || 0);
    if (benchCap > 0 && supply > 0) {
      comparativePrice = benchCap / supply;
      growthMultiplierNeeded = marketCap > 0 ? benchCap / marketCap : 1;
    }
  } else {
    // Solve market cap
    marketCap = tokenPrice * supply;
  }

  // Format market cap compactly
  let formattedMarketCap = `$${marketCap.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  if (marketCap >= 1e12) formattedMarketCap = `$${(marketCap / 1e12).toFixed(2)} Trillion`;
  else if (marketCap >= 1e9) formattedMarketCap = `$${(marketCap / 1e9).toFixed(2)} Billion`;
  else if (marketCap >= 1e6) formattedMarketCap = `$${(marketCap / 1e6).toFixed(2)} Million`;

  return {
    marketCap: Math.round(marketCap * 100) / 100,
    tokenPrice: Math.round(tokenPrice * 1000000) / 1000000,
    circulatingSupply: supply,
    comparativePrice: comparativePrice !== undefined ? Math.round(comparativePrice * 10000) / 10000 : undefined,
    growthMultiplierNeeded: growthMultiplierNeeded !== undefined ? Math.round(growthMultiplierNeeded * 100) / 100 : undefined,
    formattedMarketCap,
  };
}
