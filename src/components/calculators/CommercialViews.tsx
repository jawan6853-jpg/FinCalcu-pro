import React from 'react';
import { ToolItem } from '../../types';
import { CalculatorLayout } from '../common/CalculatorLayout';
import { ResultCard, CalculationActions } from '../common/ResultCard';
import { DonutChart } from '../common/SimpleChart';
import { formatCurrency, formatPercentage } from '../../lib/formatters';
import { useUrlParamsState } from '../../lib/useUrlParamsState';
import { useCurrency } from '../../context/CurrencyContext';

import { calculateDiscount, DiscountInput } from '../../lib/calculators/discount';
import { calculatePercentageChange, PercentageChangeInput } from '../../lib/calculators/percentageChange';
import { calculateProfitMargin, ProfitMarginInput } from '../../lib/calculators/profitMargin';
import { calculateMarkup, MarkupInput } from '../../lib/calculators/markup';
import { calculateBusinessBreakEven, BusinessBreakEvenInput } from '../../lib/calculators/businessBreakEven';
import { calculateCashFlow, CashFlowInput } from '../../lib/calculators/cashFlow';

export interface CalculatorViewProps {
  tool: ToolItem;
  onNavigate: (route: string) => void;
}

// 5. DISCOUNT VIEW
export const DiscountView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: DiscountInput = {
    mode: 'from-percentage',
    originalPrice: 120,
    discountPercent: 25,
    salePriceEntered: 90,
    additionalDiscountPercent: 10,
    salesTaxPercent: 8,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<DiscountInput>(initial, 'discount');
  const result = calculateDiscount(inputs);

  const chartData = [
    { label: 'Discounted Subtotal', value: result.priceAfterDiscounts, color: '#6366f1' },
    { label: 'Discount Saved', value: result.totalSavings, color: '#10b981' },
    { label: 'Sales Tax', value: result.salesTaxAmount, color: '#f59e0b' },
  ].filter((d) => d.value > 0);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Calculation Method
        </label>
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, mode: 'from-percentage' })}
            className={`py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              inputs.mode === 'from-percentage'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            By Discount %
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, mode: 'from-sale-price' })}
            className={`py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              inputs.mode === 'from-sale-price'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            By Sale Price
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Original Price (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          value={inputs.originalPrice ?? ''}
          onChange={(e) => setInputs({ ...inputs, originalPrice: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {inputs.mode === 'from-percentage' ? (
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Primary Discount (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={inputs.discountPercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, discountPercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      ) : (
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Known Sale Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.salePriceEntered ?? ''}
            onChange={(e) => setInputs({ ...inputs, salePriceEntered: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Stacked Extra Coupon (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="0%"
            value={inputs.additionalDiscountPercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, additionalDiscountPercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Sales Tax (%)
          </label>
          <input
            type="number"
            min="0"
            max="30"
            placeholder="0%"
            value={inputs.salesTaxPercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, salesTaxPercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Final Sale Price"
          value={formatCurrency(result.finalPriceWithTax, currency)}
          isHighlight={true}
          status="positive"
          subtitle={result.salesTaxAmount > 0 ? `Includes ${formatCurrency(result.salesTaxAmount, currency)} sales tax` : 'Pre-tax final subtotal'}
        />
        <ResultCard
          title="Total Money Saved"
          value={formatCurrency(result.totalSavings, currency)}
          status="positive"
          subtitle={`${result.effectiveDiscountPercentage.toFixed(1)}% effective discount`}
        />
        <ResultCard
          title="Pre-Tax Subtotal"
          value={formatCurrency(result.priceAfterDiscounts, currency)}
          subtitle={`Original ${formatCurrency(result.originalPrice, currency)}`}
        />
        <ResultCard
          title="Discount Percentage"
          value={formatPercentage(result.discountPercentage)}
          subtitle={result.additionalDiscountAmount > 0 ? `+ ${inputs.additionalDiscountPercent}% extra coupon applied` : 'Single discount applied'}
        />
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Price Breakdown</h4>
        <DonutChart slices={chartData} />
      </div>

      <CalculationActions title="Discount Calculation" onReset={resetInputs} />
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

// 6. PERCENTAGE CHANGE VIEW
export const PercentageChangeView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const initial: PercentageChangeInput = {
    originalValue: 45,
    newValue: 72,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<PercentageChangeInput>(initial, 'pct-change');
  const result = calculatePercentageChange(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Original Value (Starting Number or Price)
        </label>
        <input
          type="number"
          value={inputs.originalValue ?? ''}
          onChange={(e) => setInputs({ ...inputs, originalValue: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          New Value (Final Number or Price)
        </label>
        <input
          type="number"
          value={inputs.newValue ?? ''}
          onChange={(e) => setInputs({ ...inputs, newValue: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Percentage Change Formula:</span>
        <div className="font-mono mt-1 text-indigo-600 dark:text-indigo-400">
          (({inputs.newValue} - {inputs.originalValue}) / |{inputs.originalValue}|) × 100 = {result.percentageChange > 0 ? '+' : ''}{result.percentageChange.toFixed(2)}%
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Percentage Change"
          value={`${result.percentageChange > 0 ? '+' : ''}${result.percentageChange.toFixed(2)}%`}
          isHighlight={true}
          status={result.direction === 'increase' ? 'positive' : result.direction === 'decrease' ? 'negative' : 'neutral'}
          subtitle={`${result.direction.toUpperCase()} from ${inputs.originalValue} to ${inputs.newValue}`}
        />
        <ResultCard
          title="Absolute Difference"
          value={`${result.absoluteDifference > 0 ? '+' : ''}${result.absoluteDifference.toFixed(2)}`}
          status={result.direction === 'increase' ? 'positive' : result.direction === 'decrease' ? 'negative' : 'neutral'}
          subtitle={`Difference = New (${inputs.newValue}) - Original (${inputs.originalValue})`}
        />
        <ResultCard
          title="Growth Multiplier"
          value={`${result.multiplierFactor.toFixed(2)}x`}
          subtitle={`New value is ${result.percentOfOriginal.toFixed(1)}% of original`}
        />
        <ResultCard
          title="Reversal Required"
          value={`${result.reversePercentageNeeded > 0 ? '+' : ''}${result.reversePercentageNeeded.toFixed(2)}%`}
          subtitle={`Change needed to return from ${inputs.newValue} to ${inputs.originalValue}`}
        />
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Visual Movement Analysis</h4>
        <div className="w-full bg-slate-100 dark:bg-slate-950 h-6 rounded-full overflow-hidden flex items-center p-1 border border-slate-200 dark:border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              result.direction === 'increase' ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(10, Math.abs(result.percentageChange)))}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2">
          <span>Start: {inputs.originalValue}</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {result.direction === 'increase' ? 'Grew by' : 'Fell by'} {Math.abs(result.percentageChange).toFixed(2)}%
          </span>
          <span>End: {inputs.newValue}</span>
        </div>
      </div>

      <CalculationActions title="Percentage Change Calculation" onReset={resetInputs} />
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

// 7. PROFIT MARGIN VIEW
export const ProfitMarginView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: ProfitMarginInput = {
    cost: 40,
    revenue: 100,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<ProfitMarginInput>(initial, 'profit-margin');
  const result = calculateProfitMargin(inputs);

  const chartData = [
    { label: 'Cost of Goods (COGS)', value: result.cost, color: '#f43f5e' },
    { label: 'Gross Profit', value: Math.max(0, result.grossProfit), color: '#10b981' },
  ];

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Cost of Goods Sold (COGS) (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          value={inputs.cost ?? ''}
          onChange={(e) => setInputs({ ...inputs, cost: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Selling Price / Total Revenue (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          value={inputs.revenue ?? ''}
          onChange={(e) => setInputs({ ...inputs, revenue: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Profit Margin Formula:</span>
        <div className="font-mono mt-1 text-indigo-600 dark:text-indigo-400">
          Profit Margin = (({inputs.revenue} - {inputs.cost}) / {inputs.revenue}) × 100
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Profit Margin"
          value={formatPercentage(result.profitMarginPercent)}
          isHighlight={true}
          status={result.isProfitable ? 'positive' : 'negative'}
          subtitle={`Percent of selling revenue retained as profit`}
        />
        <ResultCard
          title="Gross Profit"
          value={formatCurrency(result.grossProfit, currency)}
          status={result.isProfitable ? 'positive' : 'negative'}
          subtitle={`Revenue (${formatCurrency(result.revenue, currency)}) - Cost (${formatCurrency(result.cost, currency)})`}
        />
        <ResultCard
          title="Equivalent Markup"
          value={formatPercentage(result.markupPercent)}
          subtitle="Profit as percentage of wholesale cost"
        />
        <ResultCard
          title="Cost Ratio"
          value={formatPercentage(result.costRatioPercent)}
          subtitle="Cost consumed per dollar of sales"
        />
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Revenue Distribution (Cost vs Profit)</h4>
        <DonutChart slices={chartData} />
      </div>

      <CalculationActions title="Profit Margin Calculation" onReset={resetInputs} />
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

// 8. MARKUP VIEW
export const MarkupView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: MarkupInput = {
    mode: 'cost-and-markup',
    costPrice: 60,
    markupPercent: 75,
    sellingPrice: 105,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<MarkupInput>(initial, 'markup');
  const result = calculateMarkup(inputs);

  const chartData = [
    { label: 'Cost Price', value: result.costPrice, color: '#f43f5e' },
    { label: 'Markup Amount', value: Math.max(0, result.markupAmount), color: '#10b981' },
  ];

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Calculation Mode
        </label>
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, mode: 'cost-and-markup' })}
            className={`py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              inputs.mode === 'cost-and-markup'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Cost + Markup %
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, mode: 'cost-and-revenue' })}
            className={`py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              inputs.mode === 'cost-and-revenue'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Cost + Selling Price
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Cost Price (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          value={inputs.costPrice ?? ''}
          onChange={(e) => setInputs({ ...inputs, costPrice: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {inputs.mode === 'cost-and-markup' ? (
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Markup Percentage (%)
          </label>
          <input
            type="number"
            min="0"
            value={inputs.markupPercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, markupPercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      ) : (
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Desired Selling Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.sellingPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, sellingPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Selling Price"
          value={formatCurrency(result.sellingPrice, currency)}
          isHighlight={true}
          status="positive"
          subtitle={`Recommended retail price tag`}
        />
        <ResultCard
          title="Markup Amount"
          value={formatCurrency(result.markupAmount, currency)}
          status="positive"
          subtitle={`Dollar amount added onto cost`}
        />
        <ResultCard
          title="Markup Percentage"
          value={formatPercentage(result.markupPercent)}
          subtitle="Percentage markup applied on cost"
        />
        <ResultCard
          title="Resulting Gross Margin"
          value={formatPercentage(result.grossMarginPercent)}
          subtitle="Profit margin as % of selling price"
        />
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Price Composition (Cost + Markup)</h4>
        <DonutChart slices={chartData} />
      </div>

      <CalculationActions title="Markup Calculation" onReset={resetInputs} />
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

// 9. BUSINESS BREAK-EVEN VIEW
export const BusinessBreakEvenView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: BusinessBreakEvenInput = {
    fixedCosts: 24000,
    variableCostPerUnit: 30,
    sellingPricePerUnit: 80,
    targetUnitsSold: 600,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<BusinessBreakEvenInput>(initial, 'biz-breakeven');
  const result = calculateBusinessBreakEven(inputs);

  const chartData = [
    { label: 'Fixed Costs', value: result.fixedCosts, color: '#6366f1' },
    { label: 'Variable Cost (At Break-even)', value: result.breakEvenUnits * result.variableCostPerUnit, color: '#f59e0b' },
  ];

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Total Fixed Overhead Costs (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          value={inputs.fixedCosts ?? ''}
          onChange={(e) => setInputs({ ...inputs, fixedCosts: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
        <span className="text-[10px] text-slate-500">Rent, administrative wages, insurance, software</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Variable Cost / Unit (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.variableCostPerUnit ?? ''}
            onChange={(e) => setInputs({ ...inputs, variableCostPerUnit: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-[10px] text-slate-500">Materials, labor, shipping</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Selling Price / Unit (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.sellingPricePerUnit ?? ''}
            onChange={(e) => setInputs({ ...inputs, sellingPricePerUnit: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-[10px] text-slate-500">Unit retail price</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Target Sales Volume (Optional Units)
        </label>
        <input
          type="number"
          min="0"
          value={inputs.targetUnitsSold ?? ''}
          onChange={(e) => setInputs({ ...inputs, targetUnitsSold: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Break-Even Units"
          value={`${result.breakEvenUnits.toLocaleString()} Units`}
          isHighlight={true}
          status="positive"
          subtitle={`Units needed to cover all fixed costs`}
        />
        <ResultCard
          title="Break-Even Sales Revenue"
          value={formatCurrency(result.breakEvenRevenue, currency)}
          status="positive"
          subtitle={`Gross revenue at break-even volume`}
        />
        <ResultCard
          title="Unit Contribution Margin"
          value={formatCurrency(result.unitContributionMargin, currency)}
          subtitle={`${formatPercentage(result.contributionMarginRatio)} contribution ratio`}
        />
        <ResultCard
          title={inputs.targetUnitsSold ? `Profit at ${inputs.targetUnitsSold} Units` : 'Profit at Target Units'}
          value={formatCurrency(result.projectedProfitOrLoss, currency)}
          status={result.projectedProfitOrLoss >= 0 ? 'positive' : 'negative'}
          subtitle={`Projected revenue: ${formatCurrency(result.projectedRevenue, currency)}`}
        />
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Cost Composition at Break-Even</h4>
        <DonutChart slices={chartData} />
      </div>

      <CalculationActions title="Break-Even Business Calculation" onReset={resetInputs} />
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

// 10. CASH FLOW VIEW
export const CashFlowView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: CashFlowInput = {
    startingBalance: 15000,
    operatingRevenue: 45000,
    accountsReceivableCollected: 4000,
    financingOrInvestmentInflows: 0,
    otherInflows: 0,
    payrollAndWages: 18500,
    rentAndFacilities: 4200,
    inventoryAndSupplies: 6500,
    loanPaymentsAndInterest: 1500,
    taxesAndLicenses: 2000,
    otherOperatingExpenses: 1500,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<CashFlowInput>(initial, 'cash-flow');
  const result = calculateCashFlow(inputs);

  const chartData = [
    { label: 'Total Inflows', value: result.totalInflows, color: '#10b981' },
    { label: 'Total Outflows', value: result.totalOutflows, color: '#f43f5e' },
  ];

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Starting Cash Balance (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          value={inputs.startingBalance ?? ''}
          onChange={(e) => setInputs({ ...inputs, startingBalance: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block mb-2">Cash Inflows (${currencySymbol})</span>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Sales / Revenue</label>
            <input
              type="number"
              min="0"
              value={inputs.operatingRevenue ?? ''}
              onChange={(e) => setInputs({ ...inputs, operatingRevenue: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">AR Collected</label>
            <input
              type="number"
              min="0"
              value={inputs.accountsReceivableCollected ?? ''}
              onChange={(e) => setInputs({ ...inputs, accountsReceivableCollected: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
        <span className="text-xs font-bold text-rose-700 dark:text-rose-300 block mb-2">Cash Outflows (${currencySymbol})</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div>
            <label className="block text-[10px] text-slate-600 dark:text-slate-400 mb-0.5">Payroll & Wages</label>
            <input
              type="number"
              min="0"
              value={inputs.payrollAndWages ?? ''}
              onChange={(e) => setInputs({ ...inputs, payrollAndWages: parseFloat(e.target.value) || 0 })}
              className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-600 dark:text-slate-400 mb-0.5">Rent & Facility</label>
            <input
              type="number"
              min="0"
              value={inputs.rentAndFacilities ?? ''}
              onChange={(e) => setInputs({ ...inputs, rentAndFacilities: parseFloat(e.target.value) || 0 })}
              className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-600 dark:text-slate-400 mb-0.5">Inventory</label>
            <input
              type="number"
              min="0"
              value={inputs.inventoryAndSupplies ?? ''}
              onChange={(e) => setInputs({ ...inputs, inventoryAndSupplies: parseFloat(e.target.value) || 0 })}
              className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-600 dark:text-slate-400 mb-0.5">Debt & Loans</label>
            <input
              type="number"
              min="0"
              value={inputs.loanPaymentsAndInterest ?? ''}
              onChange={(e) => setInputs({ ...inputs, loanPaymentsAndInterest: parseFloat(e.target.value) || 0 })}
              className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-600 dark:text-slate-400 mb-0.5">Taxes</label>
            <input
              type="number"
              min="0"
              value={inputs.taxesAndLicenses ?? ''}
              onChange={(e) => setInputs({ ...inputs, taxesAndLicenses: parseFloat(e.target.value) || 0 })}
              className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-600 dark:text-slate-400 mb-0.5">Operating Buffer</label>
            <input
              type="number"
              min="0"
              value={inputs.otherOperatingExpenses ?? ''}
              onChange={(e) => setInputs({ ...inputs, otherOperatingExpenses: parseFloat(e.target.value) || 0 })}
              className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Net Cash Flow"
          value={formatCurrency(result.netCashFlow, currency)}
          isHighlight={true}
          status={result.status === 'positive' ? 'positive' : result.status === 'negative' ? 'negative' : 'neutral'}
          subtitle={result.netCashFlow >= 0 ? 'Operating cash surplus' : 'Operating cash deficit'}
        />
        <ResultCard
          title="Ending Cash Balance"
          value={formatCurrency(result.endingBalance, currency)}
          status={result.endingBalance >= 0 ? 'positive' : 'negative'}
          subtitle={`Starting ${formatCurrency(result.startingBalance, currency)} + Net Cash Flow`}
        />
        <ResultCard
          title="Total Cash Inflows"
          value={formatCurrency(result.totalInflows, currency)}
          status="positive"
          subtitle="Operating receipts and income"
        />
        <ResultCard
          title="Total Cash Outflows"
          value={formatCurrency(result.totalOutflows, currency)}
          subtitle={`${formatPercentage(result.cashFlowMarginPercent)} net cash flow margin`}
        />
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Inflows vs Outflows Balance</h4>
        <DonutChart slices={chartData} />
      </div>

      <CalculationActions title="Cash Flow Calculation" onReset={resetInputs} />
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
