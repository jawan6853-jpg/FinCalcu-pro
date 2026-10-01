import React from 'react';
import { ToolItem } from '../../types';
import { CalculatorLayout } from '../common/CalculatorLayout';
import { ResultCard, CalculationActions } from '../common/ResultCard';
import { DonutChart, AreaGrowthChart } from '../common/SimpleChart';
import { formatCurrency, formatNumber, formatPercentage } from '../../lib/formatters';
import { useUrlParamsState } from '../../lib/useUrlParamsState';
import { useCurrency } from '../../context/CurrencyContext';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

import { calculateCapitalGains, CapitalGainsInput } from '../../lib/calculators/capitalGains';
import { calculateStockProfit, StockProfitInput } from '../../lib/calculators/stockProfit';
import { calculateBatch4CryptoROI, Batch4CryptoROIInput } from '../../lib/calculators/batch4CryptoROI';
import { calculateBatch4CryptoTax, Batch4CryptoTaxInput } from '../../lib/calculators/batch4CryptoTax';
import { calculateBatch4CryptoDCA, Batch4CryptoDCAInput } from '../../lib/calculators/batch4CryptoDCA';

export interface CalculatorViewProps {
  tool: ToolItem;
  onNavigate: (route: string) => void;
}

// 11. CAPITAL GAINS VIEW
export const CapitalGainsView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: CapitalGainsInput = {
    purchasePrice: 30,
    salePrice: 55,
    quantity: 500,
    eligibleCosts: 50,
    holdingPeriod: 'long-term',
    estimatedTaxRate: 15,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<CapitalGainsInput>(initial, 'cap-gains');
  const result = calculateCapitalGains(inputs);

  const chartData = [
    { label: 'Cost Basis', value: result.totalCostBasis, color: '#6366f1' },
    { label: 'Deductible Fees', value: result.totalEligibleCosts, color: '#f59e0b' },
    { label: 'Estimated Tax', value: result.estimatedTaxLiability, color: '#f43f5e' },
    { label: 'Net Profit Kept', value: Math.max(0, result.netAfterTaxProceeds - result.totalCostBasis), color: '#10b981' },
  ].filter((d) => d.value > 0);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Purchase Price / Cost Basis (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.purchasePrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, purchasePrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Sale Price / Gross Proceeds (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.salePrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, salePrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Quantity / Shares
          </label>
          <input
            type="number"
            min="0.0001"
            value={inputs.quantity ?? ''}
            onChange={(e) => setInputs({ ...inputs, quantity: parseFloat(e.target.value) || 1 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Deductible Fees / Costs (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.eligibleCosts ?? ''}
            onChange={(e) => setInputs({ ...inputs, eligibleCosts: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Holding Period
          </label>
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setInputs({ ...inputs, holdingPeriod: 'short-term' })}
              className={`py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                inputs.holdingPeriod === 'short-term'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Short (&lt;1 yr)
            </button>
            <button
              type="button"
              onClick={() => setInputs({ ...inputs, holdingPeriod: 'long-term' })}
              className={`py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                inputs.holdingPeriod === 'long-term'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Long (≥1 yr)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Estimated Tax Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="60"
            value={inputs.estimatedTaxRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, estimatedTaxRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Important Tax Notice:</strong> Capital gains tax brackets, state/provincial add-ons, and allowable deductions differ substantially across jurisdictions. This tool provides numerical estimates only and does not constitute certified tax advice.
        </p>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Net Capital Gain / Loss"
          value={formatCurrency(result.netCapitalGainOrLoss, currency)}
          isHighlight={true}
          status={result.isGain ? 'positive' : 'negative'}
          subtitle={`${result.gainPercentage >= 0 ? '+' : ''}${result.gainPercentage.toFixed(2)}% return on total investment`}
        />
        <ResultCard
          title="Estimated Tax Liability"
          value={formatCurrency(result.estimatedTaxLiability, currency)}
          status={result.estimatedTaxLiability > 0 ? 'negative' : 'neutral'}
          subtitle={`Based on ${inputs.estimatedTaxRate}% tax bracket`}
        />
        <ResultCard
          title="Net After-Tax Kept"
          value={formatCurrency(result.netAfterTaxProceeds, currency)}
          status="positive"
          subtitle="Gross proceeds minus fees and estimated taxes"
        />
        <ResultCard
          title="Total Cost Basis"
          value={formatCurrency(result.totalCostBasis, currency)}
          subtitle={`Initial capital outlay + ${formatCurrency(result.totalEligibleCosts, currency)} deductible fees`}
        />
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Proceeds Allocation</h4>
        <DonutChart slices={chartData} />
      </div>

      <CalculationActions title="Capital Gains Calculation" onReset={resetInputs} />
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

// 12. STOCK PROFIT VIEW
export const StockProfitView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: StockProfitInput = {
    shares: 200,
    buyPricePerShare: 140,
    sellPricePerShare: 165,
    buyCommission: 0,
    sellCommission: 15,
    dividendsReceived: 80,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<StockProfitInput>(initial, 'stock-profit');
  const result = calculateStockProfit(inputs);

  const chartData = [
    { label: 'Purchase Capital', value: result.totalPurchaseCost, color: '#6366f1' },
    { label: 'Trading Fees', value: result.totalTradingFees, color: '#f43f5e' },
    { label: 'Net Profit', value: Math.max(0, result.netProfit), color: '#10b981' },
  ].filter((d) => d.value > 0);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Number of Shares
        </label>
        <input
          type="number"
          min="1"
          value={inputs.shares ?? ''}
          onChange={(e) => setInputs({ ...inputs, shares: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Buy Price / Share (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.buyPricePerShare ?? ''}
            onChange={(e) => setInputs({ ...inputs, buyPricePerShare: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Sell Price / Share (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.sellPricePerShare ?? ''}
            onChange={(e) => setInputs({ ...inputs, sellPricePerShare: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div>
          <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Buy Fees (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.buyCommission ?? ''}
            onChange={(e) => setInputs({ ...inputs, buyCommission: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Sell Fees (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.sellCommission ?? ''}
            onChange={(e) => setInputs({ ...inputs, sellCommission: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Dividends (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.dividendsReceived ?? ''}
            onChange={(e) => setInputs({ ...inputs, dividendsReceived: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Net Stock Profit"
          value={formatCurrency(result.netProfit, currency)}
          isHighlight={true}
          status={result.isProfitable ? 'positive' : 'negative'}
          subtitle={`After ${formatCurrency(result.totalTradingFees, currency)} in fees and ${formatCurrency(result.dividendsEarned, currency)} dividends`}
        />
        <ResultCard
          title="Return on Investment (ROI)"
          value={formatPercentage(result.roiPercent)}
          status={result.isProfitable ? 'positive' : 'negative'}
          subtitle="Net return on purchase cost"
        />
        <ResultCard
          title="Gross Sale Proceeds"
          value={formatCurrency(result.totalGrossProceeds, currency)}
          subtitle={`Cost basis: ${formatCurrency(result.totalPurchaseCost, currency)}`}
        />
        <ResultCard
          title="Break-Even Share Price"
          value={formatCurrency(result.breakEvenPricePerShare, currency)}
          subtitle="Target sell price to cover all trade fees"
        />
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Capital vs Profit Allocation</h4>
        <DonutChart slices={chartData} />
      </div>

      <CalculationActions title="Stock Profit Calculation" onReset={resetInputs} />
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

// 13. CRYPTO ROI VIEW (BATCH 4)
export const Batch4CryptoROIView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: Batch4CryptoROIInput = {
    mode: 'by-amount',
    investmentAmount: 3000,
    finalValue: 11500,
    tokenQuantity: 1.5,
    buyPricePerToken: 2000,
    sellPricePerToken: 7666,
    fees: 25,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<Batch4CryptoROIInput>(initial, 'crypto-roi-v2');
  const result = calculateBatch4CryptoROI(inputs);

  const chartData = [
    { label: 'Initial Outlay', value: result.investmentAmount, color: '#6366f1' },
    { label: 'Trading Fees', value: result.fees, color: '#f59e0b' },
    { label: 'Net Profit', value: Math.max(0, result.netProfit), color: '#10b981' },
  ].filter((d) => d.value > 0);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Input Method
        </label>
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, mode: 'by-amount' })}
            className={`py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              inputs.mode === 'by-amount'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            By Total Amounts (${currencySymbol})
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, mode: 'by-token-price' })}
            className={`py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              inputs.mode === 'by-token-price'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            By Coin Price & Units
          </button>
        </div>
      </div>

      {inputs.mode === 'by-amount' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Initial Investment Amount (${currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              value={inputs.investmentAmount ?? ''}
              onChange={(e) => setInputs({ ...inputs, investmentAmount: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Current / Final Portfolio Value (${currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              value={inputs.finalValue ?? ''}
              onChange={(e) => setInputs({ ...inputs, finalValue: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Buy Price Per Token (${currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                value={inputs.buyPricePerToken ?? ''}
                onChange={(e) => setInputs({ ...inputs, buyPricePerToken: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sell Price Per Token (${currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                value={inputs.sellPricePerToken ?? ''}
                onChange={(e) => setInputs({ ...inputs, sellPricePerToken: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Coin Quantity (Tokens)
            </label>
            <input
              type="number"
              min="0"
              value={inputs.tokenQuantity ?? ''}
              onChange={(e) => setInputs({ ...inputs, tokenQuantity: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Exchange & Gas Fees (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          value={inputs.fees ?? ''}
          onChange={(e) => setInputs({ ...inputs, fees: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Crypto ROI"
          value={formatPercentage(result.roiPercent)}
          isHighlight={true}
          status={result.isProfit ? 'positive' : 'negative'}
          subtitle={`Capital expansion multiple: ${result.capitalMultiplier.toFixed(2)}x`}
        />
        <ResultCard
          title="Net Profit / Loss"
          value={formatCurrency(result.netProfit, currency)}
          status={result.isProfit ? 'positive' : 'negative'}
          subtitle={`Final ${formatCurrency(result.finalValue, currency)} minus initial outlay`}
        />
        <ResultCard
          title="Total Invested"
          value={formatCurrency(result.investmentAmount, currency)}
          subtitle={`Plus ${formatCurrency(result.fees, currency)} network fees`}
        />
        <ResultCard
          title="Final Portfolio Value"
          value={formatCurrency(result.finalValue, currency)}
          status="positive"
          subtitle="Gross cryptocurrency liquidation value"
        />
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Portfolio Capital Growth</h4>
        <DonutChart slices={chartData} />
      </div>

      <CalculationActions title="Crypto ROI Calculation" onReset={resetInputs} />
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

// 14. CRYPTO TAX VIEW (BATCH 4)
export const Batch4CryptoTaxView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: Batch4CryptoTaxInput = {
    purchasePricePerCoin: 1800,
    salePricePerCoin: 3280,
    quantity: 2.5,
    fees: 60,
    taxRatePercent: 24,
    holdingPeriod: 'short-term',
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<Batch4CryptoTaxInput>(initial, 'crypto-tax-v2');
  const result = calculateBatch4CryptoTax(inputs);

  const chartData = [
    { label: 'Cost Basis', value: result.costBasis, color: '#6366f1' },
    { label: 'Deductible Fees', value: result.deductibleFees, color: '#f59e0b' },
    { label: 'Estimated Tax', value: result.estimatedTaxAmount, color: '#f43f5e' },
    { label: 'Net After-Tax Profit', value: Math.max(0, result.netProceedsAfterTaxes - result.costBasis), color: '#10b981' },
  ].filter((d) => d.value > 0);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Purchase Price / Coin (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.purchasePricePerCoin ?? ''}
            onChange={(e) => setInputs({ ...inputs, purchasePricePerCoin: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Sale Price / Coin (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.salePricePerCoin ?? ''}
            onChange={(e) => setInputs({ ...inputs, salePricePerCoin: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Coin Quantity (Tokens)
          </label>
          <input
            type="number"
            min="0.00000001"
            value={inputs.quantity ?? ''}
            onChange={(e) => setInputs({ ...inputs, quantity: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Gas & Trading Fees (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.fees ?? ''}
            onChange={(e) => setInputs({ ...inputs, fees: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Holding Period
          </label>
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setInputs({ ...inputs, holdingPeriod: 'short-term' })}
              className={`py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                inputs.holdingPeriod === 'short-term'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Short (&lt;1 yr)
            </button>
            <button
              type="button"
              onClick={() => setInputs({ ...inputs, holdingPeriod: 'long-term' })}
              className={`py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                inputs.holdingPeriod === 'long-term'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Long (≥1 yr)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Estimated Tax Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="60"
            value={inputs.taxRatePercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, taxRatePercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Disclaimer:</strong> Cryptocurrency tax laws differ globally (e.g. IRS treatment in US, HMRC in UK, ATO in Australia). This calculation is an estimate and does NOT provide formal tax, financial, or legal advice.
        </p>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Estimated Tax Liability"
          value={formatCurrency(result.estimatedTaxAmount, currency)}
          isHighlight={true}
          status={result.estimatedTaxAmount > 0 ? 'negative' : 'neutral'}
          subtitle={`Based on ${inputs.taxRatePercent}% user tax bracket`}
        />
        <ResultCard
          title="Net Taxable Capital Gain"
          value={formatCurrency(result.netTaxableCapitalGain, currency)}
          status={result.isTaxableGain ? 'positive' : 'neutral'}
          subtitle="Gross Proceeds - Cost Basis - Deductible Fees"
        />
        <ResultCard
          title="Net Cash Kept After Taxes"
          value={formatCurrency(result.netProceedsAfterTaxes, currency)}
          status="positive"
          subtitle="Net proceeds received after tax reserves"
        />
        <ResultCard
          title="Total Cost Basis"
          value={formatCurrency(result.costBasis, currency)}
          subtitle={`${inputs.quantity} tokens × ${formatCurrency(inputs.purchasePricePerCoin, currency)}`}
        />
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Proceeds Distribution</h4>
        <DonutChart slices={chartData} />
      </div>

      <CalculationActions title="Crypto Tax Calculation" onReset={resetInputs} />
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

// 15. CRYPTO DCA VIEW (BATCH 4)
export const Batch4CryptoDCAView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: Batch4CryptoDCAInput = {
    recurringAmount: 150,
    frequency: 'weekly',
    totalPeriods: 52,
    startingPrice: 40000,
    endingPrice: 68000,
    priceTrajectory: 'linear',
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<Batch4CryptoDCAInput>(initial, 'crypto-dca-v2');
  const result = calculateBatch4CryptoDCA(inputs);

  const timelineData = result.historyTimeline.map((pt) => ({
    label: `P${pt.period}`,
    total: pt.currentPortfolioValue,
    invested: pt.cumulativeInvested,
  }));

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Recurring Amount (${currencySymbol})
          </label>
          <input
            type="number"
            min="1"
            value={inputs.recurringAmount ?? ''}
            onChange={(e) => setInputs({ ...inputs, recurringAmount: parseFloat(e.target.value) || 1 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Number of Periods
          </label>
          <input
            type="number"
            min="2"
            max="365"
            value={inputs.totalPeriods ?? ''}
            onChange={(e) => setInputs({ ...inputs, totalPeriods: parseInt(e.target.value, 10) || 12 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Purchase Frequency
        </label>
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {(['daily', 'weekly', 'bi-weekly', 'monthly'] as const).map((freq) => (
            <button
              key={freq}
              type="button"
              onClick={() => setInputs({ ...inputs, frequency: freq })}
              className={`py-1.5 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                inputs.frequency === freq
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {freq}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Initial Token Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0.0001"
            value={inputs.startingPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, startingPrice: parseFloat(e.target.value) || 1 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Final / Current Token Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0.0001"
            value={inputs.endingPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, endingPrice: parseFloat(e.target.value) || 1 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Market Simulation Trajectory
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {(['linear', 'volatile', 'dip-and-recovery'] as const).map((traj) => (
            <button
              key={traj}
              type="button"
              onClick={() => setInputs({ ...inputs, priceTrajectory: traj })}
              className={`py-1 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                inputs.priceTrajectory === traj
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {traj.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Ending Portfolio Value"
          value={formatCurrency(result.currentPortfolioValue, currency)}
          isHighlight={true}
          status={result.profitOrLoss >= 0 ? 'positive' : 'negative'}
          subtitle={`Accumulated ${result.totalCryptoAcquired.toFixed(4)} coins`}
        />
        <ResultCard
          title="Total Profit / Loss"
          value={formatCurrency(result.profitOrLoss, currency)}
          status={result.profitOrLoss >= 0 ? 'positive' : 'negative'}
          subtitle={`${result.roiPercent >= 0 ? '+' : ''}${result.roiPercent.toFixed(2)}% net ROI`}
        />
        <ResultCard
          title="Average Buy Price"
          value={formatCurrency(result.averagePurchasePrice, currency)}
          subtitle={`Current market: ${formatCurrency(result.endingTokenPrice, currency)}`}
        />
        <ResultCard
          title="Total Fiat Invested"
          value={formatCurrency(result.totalInvested, currency)}
          subtitle={`${inputs.totalPeriods} × ${formatCurrency(inputs.recurringAmount, currency)} ${inputs.frequency}`}
        />
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">DCA vs Lump Sum Comparison</h4>
        <div className="grid grid-cols-2 gap-3 mt-3 text-center">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">DCA Strategy</span>
            <div className="text-sm font-bold font-mono text-indigo-600 mt-1">{formatCurrency(result.currentPortfolioValue, currency)}</div>
            <span className="text-[10px] text-slate-400">{result.totalCryptoAcquired.toFixed(4)} Coins</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Lump-Sum on Day 1</span>
            <div className="text-sm font-bold font-mono text-slate-700 dark:text-slate-300 mt-1">{formatCurrency(result.lumpSumPortfolioValue, currency)}</div>
            <span className="text-[10px] text-slate-400">{result.lumpSumEquivalentCrypto.toFixed(4)} Coins</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">DCA Wealth Accumulation Timeline</h4>
        <p className="text-[11px] text-slate-500 mb-3">Portfolio Value vs Cumulative Cash Invested</p>
        <AreaGrowthChart data={timelineData} />
      </div>

      <CalculationActions title="Crypto DCA Calculation" onReset={resetInputs} />
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
