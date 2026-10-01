import React from 'react';
import { ToolItem } from '../../types';
import { CalculatorLayout } from '../common/CalculatorLayout';
import { ResultCard, CalculationActions } from '../common/ResultCard';
import { DonutChart, AreaGrowthChart } from '../common/SimpleChart';
import { formatCurrency, formatNumber, formatPercentage } from '../../lib/formatters';
import { useUrlParamsState } from '../../lib/useUrlParamsState';
import { useCurrency } from '../../context/CurrencyContext';
import { Info } from 'lucide-react';

import { calculateStockValuation, StockValuationInput } from '../../lib/calculators/stockValuation';
import { calculatePeRatio, PeRatioInput } from '../../lib/calculators/peRatio';
import { calculatePositionRisk, PositionRiskInput } from '../../lib/calculators/positionRisk';
import { calculateCryptoBreakEvenROI, CryptoBreakEvenROIInput } from '../../lib/calculators/cryptoBreakEvenROI';
import { calculateCryptoDCAStrategy, CryptoDCAStrategyInput, DcaFrequency, DcaCycleModel } from '../../lib/calculators/cryptoDCAStrategy';

export interface CalculatorViewProps {
  tool: ToolItem;
  onNavigate: (route: string) => void;
}

// 11. STOCK VALUATION VIEW
export const StockValuationView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: StockValuationInput = {
    model: 'peMultiple',
    currentStockPrice: 95,
    eps: 4.8,
    targetPeMultiple: 24,
    expectedGrowthRate: 8.5,
    corporateBondYield: 4.4,
    annualDividend: 3.2,
    dividendGrowthRate: 5.0,
    requiredReturnRate: 9.0,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<StockValuationInput>(initial, 'stk-val');
  const result = calculateStockValuation(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Valuation Methodology
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, model: 'peMultiple' })}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              inputs.model === 'peMultiple'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            P/E Multiple
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, model: 'graham' })}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              inputs.model === 'graham'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Graham Intrinsic
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, model: 'dividendDiscount' })}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              inputs.model === 'dividendDiscount'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Gordon DDM
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Current Stock Market Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0.01"
            value={inputs.currentStockPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, currentStockPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Earnings Per Share (EPS) (${currencySymbol})
          </label>
          <input
            type="number"
            step="0.05"
            value={inputs.eps ?? ''}
            onChange={(e) => setInputs({ ...inputs, eps: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {inputs.model === 'peMultiple' && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Target Benchmark P/E Multiple (x)
          </label>
          <input
            type="number"
            step="0.5"
            min="1"
            value={inputs.targetPeMultiple ?? ''}
            onChange={(e) => setInputs({ ...inputs, targetPeMultiple: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {inputs.model === 'graham' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Expected 5-10 Yr Growth Rate (%)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={inputs.expectedGrowthRate ?? ''}
              onChange={(e) => setInputs({ ...inputs, expectedGrowthRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              AAA Bond Yield (Y) (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              value={inputs.corporateBondYield ?? ''}
              onChange={(e) => setInputs({ ...inputs, corporateBondYield: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      {inputs.model === 'dividendDiscount' && (
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Dividend (D0) (${currencySymbol})
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={inputs.annualDividend ?? ''}
              onChange={(e) => setInputs({ ...inputs, annualDividend: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Growth (g) (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={inputs.dividendGrowthRate ?? ''}
              onChange={(e) => setInputs({ ...inputs, dividendGrowthRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Return (r) (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              value={inputs.requiredReturnRate ?? ''}
              onChange={(e) => setInputs({ ...inputs, requiredReturnRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400">
        <Info className="w-4 h-4 inline mr-1 text-slate-400" />
        {result.modelSummary}
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Estimated Value Per Share"
        value={formatCurrency(result.estimatedValuePerShare, currency)}
        isHighlight={true}
        status="neutral"
        badge={result.comparisonLabel}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard
          title="Current Market Price"
          value={formatCurrency(result.currentStockPrice, currency)}
          subtitle="Reference price"
        />
        <ResultCard
          title="Dollar Difference"
          value={`${result.dollarDifference >= 0 ? '+' : ''}${formatCurrency(result.dollarDifference, currency)}`}
          subtitle="Est. Value minus Price"
        />
        <ResultCard
          title="Percentage Difference"
          value={`${result.percentageDifference >= 0 ? '+' : ''}${formatPercentage(result.percentageDifference)}`}
          subtitle="Relative variance"
        />
      </div>

      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-300">
        <span className="font-semibold">Educational Notice: </span>
        {result.disclaimer}
      </div>

      <CalculationActions
        title={tool.name}
        toolId={tool.id}
        onReset={resetInputs}
      />
    </div>
  );

  return <CalculatorLayout tool={tool} inputsComponent={inputsComponent} resultsComponent={resultsComponent} onNavigate={onNavigate} />;
};

// 12. P/E RATIO VIEW
export const PeRatioView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: PeRatioInput = {
    mode: 'peFromPriceAndEps',
    stockPrice: 145,
    eps: 6.2,
    peRatio: 23.4,
    earningsGrowthRate: 14,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<PeRatioInput>(initial, 'pe');
  const result = calculatePeRatio(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Calculation Mode
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, mode: 'peFromPriceAndEps' })}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              inputs.mode === 'peFromPriceAndEps'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Find P/E Ratio
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, mode: 'priceFromEpsAndPe' })}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              inputs.mode === 'priceFromEpsAndPe'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Implied Price
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, mode: 'epsFromPriceAndPe' })}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              inputs.mode === 'epsFromPriceAndPe'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Required EPS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Stock Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0.01"
            disabled={inputs.mode === 'priceFromEpsAndPe'}
            value={inputs.stockPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, stockPrice: parseFloat(e.target.value) || 0 })}
            className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 ${
              inputs.mode === 'priceFromEpsAndPe' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Earnings Per Share (EPS) (${currencySymbol})
          </label>
          <input
            type="number"
            step="0.1"
            disabled={inputs.mode === 'epsFromPriceAndPe'}
            value={inputs.eps ?? ''}
            onChange={(e) => setInputs({ ...inputs, eps: parseFloat(e.target.value) || 0 })}
            className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 ${
              inputs.mode === 'epsFromPriceAndPe' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Target P/E Multiple (x)
          </label>
          <input
            type="number"
            step="0.5"
            disabled={inputs.mode === 'peFromPriceAndEps'}
            value={inputs.peRatio ?? ''}
            onChange={(e) => setInputs({ ...inputs, peRatio: parseFloat(e.target.value) || 0 })}
            className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 ${
              inputs.mode === 'peFromPriceAndEps' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Annual EPS Growth Rate (%)
          </label>
          <input
            type="number"
            step="0.5"
            value={inputs.earningsGrowthRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, earningsGrowthRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      {inputs.mode === 'peFromPriceAndEps' ? (
        <ResultCard
          title="Price-to-Earnings (P/E) Multiple"
          value={`${result.peRatio}x`}
          isHighlight={true}
          status="positive"
          badge={result.valuationTier}
        />
      ) : inputs.mode === 'priceFromEpsAndPe' ? (
        <ResultCard
          title="Implied Share Price"
          value={formatCurrency(result.stockPrice, currency)}
          isHighlight={true}
          status="positive"
          badge={`At ${inputs.peRatio}x P/E`}
        />
      ) : (
        <ResultCard
          title="Required EPS"
          value={formatCurrency(result.eps, currency)}
          isHighlight={true}
          status="positive"
          badge={`For ${inputs.peRatio}x multiple`}
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Earnings Yield"
          value={formatPercentage(result.earningsYieldPercentage)}
          subtitle="EPS / Stock Price (Inverse PE)"
        />
        <ResultCard
          title="PEG Ratio"
          value={result.pegRatio !== null ? `${result.pegRatio}x` : 'N/A'}
          subtitle={result.pegRatio && result.pegRatio < 1.0 ? 'Attractive growth value (<1.0)' : 'P/E divided by growth'}
        />
      </div>

      <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400">
        <span className="font-semibold text-slate-800 dark:text-slate-200">Analysis: </span>
        {result.interpretation}
      </div>

      <CalculationActions
        title={tool.name}
        toolId={tool.id}
        onReset={resetInputs}
      />
    </div>
  );

  return <CalculatorLayout tool={tool} inputsComponent={inputsComponent} resultsComponent={resultsComponent} onNavigate={onNavigate} />;
};

// 13. POSITION RISK VIEW
export const PositionRiskView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: PositionRiskInput = {
    accountBalance: 30000,
    riskPercentage: 1.5,
    entryPrice: 125,
    stopLossPrice: 118,
    takeProfitPrice: 142.5,
    leverage: 1,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<PositionRiskInput>(initial, 'pos-rsk');
  const result = calculatePositionRisk(inputs);

  const chartSlices = [
    { label: 'Max Dollar Risk', value: result.totalDollarRisk, color: '#ef4444' },
    { label: 'Unallocated Equity', value: Math.max(0, result.accountBalance - result.totalDollarRisk), color: '#10b981' },
  ];

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Account Balance (${currencySymbol})
          </label>
          <input
            type="number"
            min="1"
            value={inputs.accountBalance ?? ''}
            onChange={(e) => setInputs({ ...inputs, accountBalance: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Account Risk Limit (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="10"
            value={inputs.riskPercentage ?? ''}
            onChange={(e) => setInputs({ ...inputs, riskPercentage: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Entry Price (${currencySymbol})
          </label>
          <input
            type="number"
            step="0.1"
            min="0.0001"
            value={inputs.entryPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, entryPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Stop Loss (${currencySymbol})
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={inputs.stopLossPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, stopLossPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Take Profit (${currencySymbol})
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={inputs.takeProfitPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, takeProfitPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Recommended Position Size"
        value={`${formatNumber(result.recommendedPositionSizeUnits, 2)} Units`}
        isHighlight={true}
        status="positive"
        badge={result.tradeDirection}
      />

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Max Dollar Risk"
          value={formatCurrency(result.totalDollarRisk, currency)}
          subtitle={`${inputs.riskPercentage}% of account equity`}
          status="negative"
        />
        <ResultCard
          title="Total Position Value"
          value={formatCurrency(result.totalPositionValue, currency)}
          subtitle={`${formatPercentage(result.portfolioAllocationPercentage)} exposure`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Risk Per Unit"
          value={formatCurrency(result.riskPerShareOrUnit, currency)}
          subtitle={`${formatPercentage(result.riskPercentagePerUnit)} stop distance`}
        />
        <ResultCard
          title="Risk-to-Reward (R:R)"
          value={result.riskRewardRatio !== null ? `1 : ${result.riskRewardRatio}` : 'N/A'}
          subtitle={result.potentialProfitDollars ? `+${formatCurrency(result.potentialProfitDollars, currency)} gain` : 'Target required'}
          status={result.riskRewardRatio && result.riskRewardRatio >= 2.0 ? 'positive' : 'neutral'}
        />
      </div>

      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Account Risk Allocation
        </h4>
        <DonutChart
          slices={chartSlices}
          centerLabel="Equity"
          centerValue={formatCurrency(result.accountBalance, currency)}
        />
      </div>

      <CalculationActions
        title={tool.name}
        toolId={tool.id}
        onReset={resetInputs}
      />
    </div>
  );

  return <CalculatorLayout tool={tool} inputsComponent={inputsComponent} resultsComponent={resultsComponent} onNavigate={onNavigate} />;
};

// 14. CRYPTO BREAK-EVEN ROI VIEW
export const CryptoBreakEvenRoiView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: CryptoBreakEvenROIInput = {
    entryPrice: 62000,
    quantity: 0.5,
    buyFeePercentage: 0.2,
    sellFeePercentage: 0.2,
    targetRoiPercentage: 15.0,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<CryptoBreakEvenROIInput>(initial, 'c-be-roi');
  const result = calculateCryptoBreakEvenROI(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Purchase / Entry Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0.00000001"
            value={inputs.entryPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, entryPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Coin Quantity
          </label>
          <input
            type="number"
            step="0.01"
            min="0.000001"
            value={inputs.quantity ?? ''}
            onChange={(e) => setInputs({ ...inputs, quantity: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Exchange Buy Fee (%)
          </label>
          <input
            type="number"
            step="0.05"
            min="0"
            value={inputs.buyFeePercentage ?? ''}
            onChange={(e) => setInputs({ ...inputs, buyFeePercentage: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Exchange Sell Fee (%)
          </label>
          <input
            type="number"
            step="0.05"
            min="0"
            value={inputs.sellFeePercentage ?? ''}
            onChange={(e) => setInputs({ ...inputs, sellFeePercentage: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Target Net ROI Goal (%)
        </label>
        <input
          type="number"
          step="0.5"
          min="0"
          value={inputs.targetRoiPercentage ?? ''}
          onChange={(e) => setInputs({ ...inputs, targetRoiPercentage: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Exact Break-Even Exit Price"
        value={formatCurrency(result.breakEvenExitPrice, currency)}
        isHighlight={true}
        status="positive"
        badge={`+${formatPercentage(result.priceIncreaseToBreakEvenPercentage)} needed`}
      />

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title={`Target Price (${inputs.targetRoiPercentage}% ROI)`}
          value={formatCurrency(result.targetExitPriceForRoi, currency)}
          subtitle="After round-trip fees"
          isHighlight={true}
        />
        <ResultCard
          title="Net Profit at Target"
          value={`+${formatCurrency(result.netProfitAtTargetRoi, currency)}`}
          subtitle="Net fiat kept"
          status="positive"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Total Outlay (Cost + Buy Fee)"
          value={formatCurrency(result.totalCostOutlay, currency)}
          subtitle={`Includes ${formatCurrency(result.entryFeePaid, currency)} buy fee`}
        />
        <ResultCard
          title="Round-Trip Fees at Break-Even"
          value={formatCurrency(result.totalRoundTripFeesAtBreakEven, currency)}
          subtitle="Maker + Taker fee overhead"
        />
      </div>

      <CalculationActions
        title={tool.name}
        toolId={tool.id}
        onReset={resetInputs}
      />
    </div>
  );

  return <CalculatorLayout tool={tool} inputsComponent={inputsComponent} resultsComponent={resultsComponent} onNavigate={onNavigate} />;
};

// 15. CRYPTO DCA STRATEGY VIEW
export const CryptoDcaStrategyView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: CryptoDCAStrategyInput = {
    recurringAmount: 150,
    frequency: 'weekly',
    durationMonths: 12,
    startingCoinPrice: 32000,
    endingCoinPrice: 68000,
    cycleModel: 'dipAndRecovery',
    stakingApyPercentage: 4.5,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<CryptoDCAStrategyInput>(initial, 'c-dca-strat');
  const result = calculateCryptoDCAStrategy(inputs);

  const chartData = result.schedulePreview.map((s) => ({
    label: `P${s.period}`,
    invested: s.cumulativeInvested,
    total: s.portfolioValue,
  }));

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Deposit Amount (${currencySymbol})
          </label>
          <input
            type="number"
            min="1"
            value={inputs.recurringAmount ?? ''}
            onChange={(e) => setInputs({ ...inputs, recurringAmount: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            DCA Frequency
          </label>
          <select
            value={inputs.frequency}
            onChange={(e) => setInputs({ ...inputs, frequency: e.target.value as DcaFrequency })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Duration (Months)
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={inputs.durationMonths ?? ''}
            onChange={(e) => setInputs({ ...inputs, durationMonths: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Staking APY (%)
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={inputs.stakingApyPercentage ?? ''}
            onChange={(e) => setInputs({ ...inputs, stakingApyPercentage: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Starting Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0.00000001"
            value={inputs.startingCoinPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, startingCoinPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Projected Ending Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0.00000001"
            value={inputs.endingCoinPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, endingCoinPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Price Path Model (Illustrative Scenario)
        </label>
        <select
          value={inputs.cycleModel}
          onChange={(e) => setInputs({ ...inputs, cycleModel: e.target.value as DcaCycleModel })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
        >
          <option value="dipAndRecovery">Illustrative Scenario: Dip and Recovery (Simulated curve)</option>
          <option value="steadyGrowth">Illustrative Scenario: Steady Growth (Simulated linear curve)</option>
          <option value="flatAccumulation">Illustrative Scenario: Flat Accumulation (Simulated range-bound curve)</option>
        </select>
      </div>

      <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400">
        <Info className="w-4 h-4 inline mr-1 text-slate-400" />
        <strong>Illustrative Scenario Notice:</strong> Simulated price paths are theoretical models for educational strategy comparison only. They do not predict real market movements or asset prices.
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Ending Portfolio Value"
        value={formatCurrency(result.endingPortfolioValue, currency)}
        isHighlight={true}
        status="positive"
        badge={`ROI: +${formatPercentage(result.roiPercentage)}`}
      />

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Total Cash Deposited"
          value={formatCurrency(result.totalFiatInvested, currency)}
          subtitle={`${result.totalPeriods} periodic buys`}
        />
        <ResultCard
          title="Net Profit"
          value={`+${formatCurrency(result.netProfit, currency)}`}
          subtitle="Portfolio gain"
          status="positive"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Crypto Acquired"
          value={`${formatNumber(result.totalCryptoAcquired, 4)} Coins`}
          subtitle={`Average price: ${formatCurrency(result.averagePurchasePrice, currency)}`}
        />
        <ResultCard
          title="Staking Yield Rewards"
          value={formatCurrency(result.stakingRewardsValue, currency)}
          subtitle="Passive token rewards"
        />
      </div>

      <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Lump-Sum Comparison (Day 1 Deploy):</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">
            {formatCurrency(result.lumpSumComparison.endingValue, currency)}
          </span>
        </div>
        <div className="text-slate-500 dark:text-slate-400">
          Lump-sum ROI: +{formatPercentage(result.lumpSumComparison.roiPercentage)} |
          <span className={result.lumpSumComparison.dcaOutperformed ? ' text-emerald-600 font-semibold' : ' text-amber-600 font-semibold'}>
            {result.lumpSumComparison.dcaOutperformed ? ' DCA Outperformed Day-1 Lump-Sum' : ' Lump-sum slightly led in this scenario'}
          </span>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            DCA Portfolio Growth vs Capital Deposited
          </h4>
          <AreaGrowthChart data={chartData} />
        </div>
      )}

      <CalculationActions
        title={tool.name}
        toolId={tool.id}
        onReset={resetInputs}
      />
    </div>
  );

  return <CalculatorLayout tool={tool} inputsComponent={inputsComponent} resultsComponent={resultsComponent} onNavigate={onNavigate} />;
};
