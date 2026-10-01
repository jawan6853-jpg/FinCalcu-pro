/**
 * Crypto Gas Fee Calculator Engine
 * Calculates: Transaction fees in native tokens (ETH/SOL/BNB) and USD fiat across transaction types and network congestion levels
 */

export interface CryptoGasFeeInput {
  gasPriceGwei: number; // Gas price in Gwei (1 Gwei = 10^-9 ETH)
  gasLimitUnits: number; // e.g. 21,000 for transfer, 150,000 for Uniswap DEX swap
  nativeTokenPriceUsd: number; // Price of native token (e.g. ETH at $2,600)
  priorityTipGwei?: number; // Optional priority tip
  transactionType?: 'transfer' | 'erc20' | 'swap' | 'nft' | 'custom';
}

export interface CryptoGasFeeResult {
  totalFeeInNativeToken: number; // in ETH/BNB
  totalFeeInUsd: number; // in USD
  gasLimit: number;
  effectiveGasPriceGwei: number;
  presetsComparison: {
    type: string;
    gasUsed: number;
    feeNative: number;
    feeUsd: number;
  }[];
  explanation: string;
}

export const GAS_LIMIT_PRESETS = [
  { type: 'Standard Transfer (ETH)', gas: 21000 },
  { type: 'ERC-20 Token Transfer (USDT/USDC)', gas: 65000 },
  { type: 'DEX Token Swap (Uniswap)', gas: 160000 },
  { type: 'NFT Mint / Smart Contract Call', gas: 220000 },
];

export function calculateCryptoGasFee(input: CryptoGasFeeInput): CryptoGasFeeResult {
  const baseGwei = Math.max(0.1, Number(input.gasPriceGwei) || 25);
  const tipGwei = Math.max(0, Number(input.priorityTipGwei) || 0);
  const totalGwei = baseGwei + tipGwei;
  const gasLimit = Math.max(21000, Number(input.gasLimitUnits) || 21000);
  const tokenPrice = Math.max(0, Number(input.nativeTokenPriceUsd) || 2600);

  // Total Fee = Gas Limit * Gas Price in Gwei * 10^-9
  const totalFeeInNativeToken = gasLimit * totalGwei * 1e-9;
  const totalFeeInUsd = totalFeeInNativeToken * tokenPrice;

  // Comparison across standard transactions
  const presetsComparison = GAS_LIMIT_PRESETS.map((p) => {
    const feeNative = p.gas * totalGwei * 1e-9;
    const feeUsd = feeNative * tokenPrice;
    return {
      type: p.type,
      gasUsed: p.gas,
      feeNative: Math.round(feeNative * 1000000) / 1000000,
      feeUsd: Math.round(feeUsd * 100) / 100,
    };
  });

  return {
    totalFeeInNativeToken: Math.round(totalFeeInNativeToken * 1000000) / 1000000,
    totalFeeInUsd: Math.round(totalFeeInUsd * 100) / 100,
    gasLimit,
    effectiveGasPriceGwei: Math.round(totalGwei * 10) / 10,
    presetsComparison,
    explanation: 'Gas fees vary in real time based on block congestion and Ethereum/EVM network utilization. Actual transaction inclusion requires sufficient maxFeePerGas.',
  };
}
