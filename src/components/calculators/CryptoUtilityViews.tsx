import React from 'react';
import { ToolItem } from '../../types';
import { CalculatorLayout } from '../common/CalculatorLayout';
import { ResultCard, CalculationActions } from '../common/ResultCard';
import { AreaGrowthChart } from '../common/SimpleChart';
import { formatCurrency, formatNumber, formatPercentage } from '../../lib/formatters';
import { useUrlParamsState } from '../../lib/useUrlParamsState';
import { useCurrency } from '../../context/CurrencyContext';

import { calculateCryptoAveragePrice, CryptoAveragePriceInput, CryptoBuyOrder } from '../../lib/calculators/cryptoAveragePrice';
import { calculateCryptoMarketCap, CryptoMarketCapInput } from '../../lib/calculators/cryptoMarketCap';
import { calculateCryptoGasFee, CryptoGasFeeInput } from '../../lib/calculators/cryptoGasFee';
import { calculateCryptoConversion, CryptoConversionInput, POPULAR_CRYPTO_PRESETS } from '../../lib/calculators/cryptoConversion';
import { calculateCryptoCompoundGrowth, CryptoCompoundGrowthInput, CryptoCompoundingInterval } from '../../lib/calculators/cryptoCompoundGrowth';

export interface CalculatorViewProps {
  tool: ToolItem;
  onNavigate: (route: string) => void;
}

// 1. CRYPTO AVERAGE PRICE VIEW
export const CryptoAveragePriceView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: CryptoAveragePriceInput = {
    orders: [
      { coins: 0.15, pricePerCoin: 58000 },
      { coins: 0.25, pricePerCoin: 52000 },
      { coins: 0.10, pricePerCoin: 61000 },
    ],
    currentMarketPrice: 63500,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<CryptoAveragePriceInput>(initial, 'cavg');
  const result = calculateCryptoAveragePrice(inputs);

  const updateOrder = (idx: number, field: keyof CryptoBuyOrder, val: number) => {
    const updated = [...inputs.orders];
    updated[idx] = { ...updated[idx], [field]: val };
    setInputs({ ...inputs, orders: updated });
  };

  const addOrder = () => {
    if (inputs.orders.length < 8) {
      setInputs({ ...inputs, orders: [...inputs.orders, { coins: 0.1, pricePerCoin: 60000 }] });
    }
  };

  const removeOrder = () => {
    if (inputs.orders.length > 1) {
      setInputs({ ...inputs, orders: inputs.orders.slice(0, -1) });
    }
  };

  const inputsComponent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Crypto Purchases (DCA Orders)</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addOrder}
            disabled={inputs.orders.length >= 8}
            className="text-xs px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold"
          >
            + Add Buy
          </button>
          <button
            type="button"
            onClick={removeOrder}
            disabled={inputs.orders.length <= 1}
            className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 font-semibold"
          >
            - Remove
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {inputs.orders.map((ord, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 w-12">Buy #{i + 1}</span>
            <div className="flex-1">
              <label className="block text-[10px] text-slate-500 mb-0.5">Coins / Tokens</label>
              <input
                type="number"
                min="0"
                step="any"
                value={ord.coins ?? ''}
                onChange={(e) => updateOrder(i, 'coins', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded font-mono"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] text-slate-500 mb-0.5">Buy Price (${currencySymbol})</label>
              <input
                type="number"
                min="0"
                step="any"
                value={ord.pricePerCoin ?? ''}
                onChange={(e) => updateOrder(i, 'pricePerCoin', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded font-mono"
              />
            </div>
            <div className="w-24 text-right pr-2">
              <span className="block text-[10px] text-slate-500 mb-0.5">Subtotal</span>
              <span className="text-xs font-mono font-bold">{formatCurrency((ord.coins || 0) * (ord.pricePerCoin || 0), currency)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="block text-xs font-semibold mb-1">Current Crypto Market Price (${currencySymbol})</label>
        <input
          type="number"
          step="any"
          value={inputs.currentMarketPrice ?? ''}
          onChange={(e) => setInputs({ ...inputs, currentMarketPrice: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
          placeholder="63500"
        />
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Average Crypto Cost Basis"
          value={formatCurrency(result.averagePricePerCoin, currency)}
          isHighlight={true}
          status="positive"
          subtitle={`Break-even across ${result.totalCoins} coins accumulated`}
        />
        <ResultCard
          title="Total Capital Invested"
          value={formatCurrency(result.totalCostBasis, currency)}
          subtitle="Cumulative fiat outlay"
        />
        {result.currentValue !== undefined && (
          <ResultCard
            title="Current Portfolio Value"
            value={formatCurrency(result.currentValue, currency)}
            subtitle={`At current price of ${formatCurrency(inputs.currentMarketPrice || 0, currency)}`}
          />
        )}
        {result.unrealizedProfitOrLoss !== undefined && (
          <ResultCard
            title="Unrealized Profit / Loss"
            value={formatCurrency(result.unrealizedProfitOrLoss, currency)}
            status={result.isProfitable ? 'positive' : 'negative'}
            subtitle={`Net Return: ${formatPercentage(result.unrealizedRoiPercent || 0)}`}
          />
        )}
      </div>
      <CalculationActions title="Crypto Average Price Calculation" onReset={resetInputs} />
    </div>
  );

  return (
    <CalculatorLayout
      tool={tool}
      inputsComponent={inputsComponent}
      resultsComponent={resultsComponent}
      onNavigate={onNavigate}
    />
  );
};

// 2. CRYPTO MARKET CAP VIEW
export const CryptoMarketCapView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: CryptoMarketCapInput = {
    tokenPrice: 145,
    circulatingSupply: 468000000,
    targetMarketCap: 150000000000,
    mode: 'solve-market-cap',
    benchmarkMarketCap: 320000000000,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<CryptoMarketCapInput>(initial, 'mcap');
  const result = calculateCryptoMarketCap(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-2">
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, mode: 'solve-market-cap' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            inputs.mode === 'solve-market-cap'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Solve Market Cap
        </button>
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, mode: 'solve-price' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            inputs.mode === 'solve-price'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Target Price from Cap
        </button>
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, mode: 'compare-benchmark' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            inputs.mode === 'compare-benchmark'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Compare Benchmarks
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {inputs.mode !== 'solve-price' && (
          <div>
            <label className="block text-xs font-semibold mb-1">Current Token Price (${currencySymbol})</label>
            <input
              type="number"
              step="any"
              min="0"
              value={inputs.tokenPrice ?? ''}
              onChange={(e) => setInputs({ ...inputs, tokenPrice: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
              placeholder="145"
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-semibold mb-1">Circulating Token Supply</label>
          <input
            type="number"
            step="any"
            min="1"
            value={inputs.circulatingSupply ?? ''}
            onChange={(e) => setInputs({ ...inputs, circulatingSupply: parseFloat(e.target.value) || 1 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="468000000"
          />
        </div>
        {inputs.mode === 'solve-price' && (
          <div>
            <label className="block text-xs font-semibold mb-1">Target Market Cap (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={inputs.targetMarketCap ?? ''}
              onChange={(e) => setInputs({ ...inputs, targetMarketCap: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
              placeholder="150000000000"
            />
          </div>
        )}
        {inputs.mode === 'compare-benchmark' && (
          <div>
            <label className="block text-xs font-semibold mb-1">Benchmark Market Cap (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={inputs.benchmarkMarketCap ?? ''}
              onChange={(e) => setInputs({ ...inputs, benchmarkMarketCap: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
              placeholder="320000000000"
            />
          </div>
        )}
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {inputs.mode === 'solve-price' ? (
          <ResultCard
            title="Estimated Target Token Price"
            value={formatCurrency(result.tokenPrice, currency)}
            isHighlight={true}
            status="positive"
            subtitle={`At ${result.formattedMarketCap} valuation`}
          />
        ) : (
          <ResultCard
            title="Total Market Cap"
            value={result.formattedMarketCap}
            isHighlight={true}
            status="positive"
            subtitle={`Exact: $${result.marketCap.toLocaleString()}`}
          />
        )}
        <ResultCard
          title="Circulating Supply"
          value={result.circulatingSupply.toLocaleString()}
          subtitle="Tokens currently in public circulation"
        />
        {result.comparativePrice !== undefined && (
          <ResultCard
            title="Target Price at Benchmark"
            value={formatCurrency(result.comparativePrice, currency)}
            status="positive"
            subtitle={`${result.growthMultiplierNeeded}x from current valuation`}
          />
        )}
        <ResultCard
          title="Per Token Price"
          value={formatCurrency(result.tokenPrice, currency)}
          subtitle="Price per individual coin"
        />
      </div>
      <CalculationActions title="Crypto Market Cap Calculation" onReset={resetInputs} />
    </div>
  );

  return (
    <CalculatorLayout
      tool={tool}
      inputsComponent={inputsComponent}
      resultsComponent={resultsComponent}
      onNavigate={onNavigate}
    />
  );
};

// 3. CRYPTO GAS FEE VIEW
export const CryptoGasFeeView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: CryptoGasFeeInput = {
    gasPriceGwei: 28,
    gasLimitUnits: 21000,
    nativeTokenPriceUsd: 2650,
    priorityTipGwei: 2,
    transactionType: 'transfer',
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<CryptoGasFeeInput>(initial, 'gasfee');
  const result = calculateCryptoGasFee(inputs);

  const handlePresetSelect = (gasLimit: number) => {
    setInputs({ ...inputs, gasLimitUnits: gasLimit });
  };

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1.5">Common Transaction Types</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {result.presetsComparison.map((p) => (
            <button
              key={p.type}
              type="button"
              onClick={() => handlePresetSelect(p.gasUsed)}
              className={`p-2 rounded-xl border text-left text-xs transition-all ${
                inputs.gasLimitUnits === p.gasUsed
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="block truncate">{p.type}</span>
              <span className="text-[10px] text-slate-400 font-mono">{p.gasUsed.toLocaleString()} gas</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Base Fee (Gwei)</label>
          <input
            type="number"
            step="1"
            min="0.1"
            value={inputs.gasPriceGwei ?? ''}
            onChange={(e) => setInputs({ ...inputs, gasPriceGwei: parseFloat(e.target.value) || 1 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="28"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Priority Tip (Gwei)</label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={inputs.priorityTipGwei ?? ''}
            onChange={(e) => setInputs({ ...inputs, priorityTipGwei: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="2"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">ETH / Native Price (${currencySymbol})</label>
          <input
            type="number"
            step="any"
            min="0"
            value={inputs.nativeTokenPriceUsd ?? ''}
            onChange={(e) => setInputs({ ...inputs, nativeTokenPriceUsd: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="2650"
          />
        </div>
      </div>
      <p className="text-[11px] text-slate-500 italic">{result.explanation}</p>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Estimated Transaction Fee"
          value={formatCurrency(result.totalFeeInUsd, currency)}
          isHighlight={true}
          status="neutral"
          subtitle={`${result.totalFeeInNativeToken} ETH at ${result.effectiveGasPriceGwei} Gwei`}
        />
        <ResultCard
          title="Fee in Native Tokens"
          value={`${result.totalFeeInNativeToken} ETH`}
          subtitle={`Gas Units: ${result.gasLimit.toLocaleString()}`}
        />
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
          Estimated Fees by Transaction Action
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
          {result.presetsComparison.map((p) => (
            <div key={p.type} className="flex items-center justify-between p-3">
              <span className="font-sans font-medium text-slate-700 dark:text-slate-300">{p.type}</span>
              <div className="text-right">
                <div className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(p.feeUsd, currency)}</div>
                <div className="text-[10px] text-slate-400">{p.feeNative} ETH</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CalculationActions title="Gas Fee Calculation" onReset={resetInputs} />
    </div>
  );

  return (
    <CalculatorLayout
      tool={tool}
      inputsComponent={inputsComponent}
      resultsComponent={resultsComponent}
      onNavigate={onNavigate}
    />
  );
};

// 4. CRYPTO CONVERSION VIEW
export const CryptoConversionView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: CryptoConversionInput = {
    direction: 'crypto-to-fiat',
    amount: 1.5,
    coinSymbol: 'BTC',
    fiatCurrency: 'USD',
    exchangeRate: 64500,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<CryptoConversionInput>(initial, 'conv');
  const result = calculateCryptoConversion(inputs);

  const handleCoinSelect = (sym: string) => {
    const found = POPULAR_CRYPTO_PRESETS.find((p) => p.symbol === sym);
    setInputs({
      ...inputs,
      coinSymbol: sym,
      exchangeRate: found ? found.defaultPriceUsd : inputs.exchangeRate,
    });
  };

  const inputsComponent = (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-2">
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, direction: 'crypto-to-fiat' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            inputs.direction === 'crypto-to-fiat'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Crypto → Fiat ({inputs.coinSymbol} to {inputs.fiatCurrency})
        </button>
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, direction: 'fiat-to-crypto' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            inputs.direction === 'fiat-to-crypto'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Fiat → Crypto ({inputs.fiatCurrency} to {inputs.coinSymbol})
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
        <span className="text-[11px] font-semibold text-slate-500 self-center">Popular Coins:</span>
        {POPULAR_CRYPTO_PRESETS.map((p) => (
          <button
            key={p.symbol}
            type="button"
            onClick={() => handleCoinSelect(p.symbol)}
            className={`px-2 py-0.5 text-xs rounded-lg border transition-colors ${
              inputs.coinSymbol === p.symbol
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
            }`}
          >
            {p.symbol}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">
            Amount to Convert ({result.sourceSymbol})
          </label>
          <input
            type="number"
            step="any"
            min="0"
            value={inputs.amount ?? ''}
            onChange={(e) => setInputs({ ...inputs, amount: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="1.5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">
            Exchange Rate (1 {inputs.coinSymbol} in {inputs.fiatCurrency})
          </label>
          <input
            type="number"
            step="any"
            min="0.00000001"
            value={inputs.exchangeRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, exchangeRate: parseFloat(e.target.value) || 1 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="64500"
          />
        </div>
      </div>
      <p className="text-[11px] text-slate-500 italic">
        Exchange rates are user-configurable estimates. Live blockchain exchange rates fluctuate continuously.
      </p>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title={`Converted Value (${result.targetSymbol})`}
          value={`${formatNumber(result.targetAmount, inputs.direction === 'crypto-to-fiat' ? 2 : 6)} ${result.targetSymbol}`}
          isHighlight={true}
          status="positive"
          subtitle={result.unitValueExplanation}
        />
        <ResultCard
          title="Input Amount"
          value={`${formatNumber(result.sourceAmount, 4)} ${result.sourceSymbol}`}
          subtitle={`At rate: 1 ${inputs.coinSymbol} = $${inputs.exchangeRate.toLocaleString()}`}
        />
      </div>
      <CalculationActions title="Crypto Conversion" onReset={resetInputs} />
    </div>
  );

  return (
    <CalculatorLayout
      tool={tool}
      inputsComponent={inputsComponent}
      resultsComponent={resultsComponent}
      onNavigate={onNavigate}
    />
  );
};

// 5. CRYPTO COMPOUND GROWTH VIEW
export const CryptoCompoundGrowthView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: CryptoCompoundGrowthInput = {
    initialCryptoAmount: 10000,
    regularContribution: 250,
    contributionFrequency: 'monthly',
    annualYieldPercent: 12.0,
    compoundingFrequency: 'daily',
    investmentPeriodYears: 5,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<CryptoCompoundGrowthInput>(initial, 'ccomp');
  const result = calculateCryptoCompoundGrowth(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Initial Crypto / Capital (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.initialCryptoAmount ?? ''}
            onChange={(e) => setInputs({ ...inputs, initialCryptoAmount: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="10000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Monthly Staking Contribution (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.regularContribution ?? ''}
            onChange={(e) => setInputs({ ...inputs, regularContribution: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="250"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Annual Staking APY / Yield (%)</label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={inputs.annualYieldPercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, annualYieldPercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="12"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Compounding Cadence</label>
          <select
            value={inputs.compoundingFrequency}
            onChange={(e) => setInputs({ ...inputs, compoundingFrequency: e.target.value as CryptoCompoundingInterval })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
          >
            <option value="daily">Daily Auto-Compounding (DeFi Vaults)</option>
            <option value="weekly">Weekly Epochs</option>
            <option value="monthly">Monthly Compounding</option>
            <option value="annually">Annually</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1">Investment Horizon (Years)</label>
          <input
            type="number"
            min="1"
            max="30"
            value={inputs.investmentPeriodYears ?? ''}
            onChange={(e) => setInputs({ ...inputs, investmentPeriodYears: parseInt(e.target.value, 10) || 5 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="5"
          />
        </div>
      </div>
      <p className="text-[11px] text-slate-500 italic">{result.disclaimer}</p>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Estimated Future Crypto Portfolio"
          value={formatCurrency(result.futurePortfolioValue, currency)}
          isHighlight={true}
          status="positive"
          subtitle={`Effective Staking APY: ${result.effectiveApyPercent}%`}
        />
        <ResultCard
          title="Total Compounded Rewards"
          value={formatCurrency(result.totalCompoundedEarnings, currency)}
          status="positive"
          subtitle="Earned purely through auto-compounding"
        />
        <ResultCard
          title="Total Capital Invested"
          value={formatCurrency(result.totalPrincipalContributed, currency)}
          subtitle="Initial outlay + recurring monthly contributions"
        />
        <ResultCard
          title="Wealth Multiplier"
          value={`${result.growthMultiplier}x`}
          subtitle="Final portfolio divided by principal contributed"
        />
      </div>
      <CalculationActions title="Crypto Compound Growth Calculation" onReset={resetInputs} />
    </div>
  );

  const chart = result.yearlySchedule.length > 1 ? (
    <AreaGrowthChart
      data={result.yearlySchedule.map((s) => ({
        label: `Yr ${s.year}`,
        invested: s.principal,
        total: s.balance,
      }))}
    />
  ) : undefined;

  return (
    <CalculatorLayout
      tool={tool}
      inputsComponent={inputsComponent}
      resultsComponent={resultsComponent}
      chartComponent={chart}
      onNavigate={onNavigate}
    />
  );
};
