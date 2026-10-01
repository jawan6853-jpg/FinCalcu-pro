import React from 'react';
import { ToolItem } from '../../types';
import { CalculatorLayout } from '../common/CalculatorLayout';
import { ResultCard, CalculationActions } from '../common/ResultCard';
import { DonutChart, AreaGrowthChart } from '../common/SimpleChart';
import { formatCurrency, formatNumber, formatPercentage } from '../../lib/formatters';
import { useUrlParamsState } from '../../lib/useUrlParamsState';
import { useCurrency } from '../../context/CurrencyContext';

import { calculateAssetAllocation, AssetAllocationInput } from '../../lib/calculators/assetAllocation';
import { calculateStockAverage, StockAverageInput, StockPurchaseBatch } from '../../lib/calculators/stockAverage';
import { calculateDividendReinvestment, DividendReinvestmentInput } from '../../lib/calculators/dividendReinvestment';
import { calculateInvestmentFee, InvestmentFeeInput } from '../../lib/calculators/investmentFee';
import { calculateBondYield, BondYieldInput } from '../../lib/calculators/bondYield';

export interface CalculatorViewProps {
  tool: ToolItem;
  onNavigate: (route: string) => void;
}

// 1. ASSET ALLOCATION VIEW
export const AssetAllocationView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: AssetAllocationInput = {
    stocks: 65000,
    bonds: 20000,
    cash: 8000,
    crypto: 5000,
    otherAssets: 2000,
    targetModel: 'growth',
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<AssetAllocationInput>(initial, 'alloc');
  const result = calculateAssetAllocation(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Target Strategy Model</label>
        <select
          value={inputs.targetModel || 'balanced'}
          onChange={(e) => setInputs({ ...inputs, targetModel: e.target.value as any })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
        >
          <option value="conservative">Conservative (30% Stocks / 50% Bonds / 15% Cash)</option>
          <option value="balanced">Balanced (60% Stocks / 30% Bonds / 5% Cash / 2% Crypto)</option>
          <option value="growth">Growth (75% Stocks / 15% Bonds / 5% Cash / 3% Crypto)</option>
          <option value="aggressive">Aggressive (80% Stocks / 5% Bonds / 5% Cash / 7% Crypto)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Stocks & Equities (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.stocks ?? ''}
            onChange={(e) => setInputs({ ...inputs, stocks: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Bonds & Fixed Income (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.bonds ?? ''}
            onChange={(e) => setInputs({ ...inputs, bonds: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Cash & High-Yield Savings (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.cash ?? ''}
            onChange={(e) => setInputs({ ...inputs, cash: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Cryptocurrency Assets (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.crypto ?? ''}
            onChange={(e) => setInputs({ ...inputs, crypto: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Total Portfolio Value"
          value={formatCurrency(result.totalPortfolioValue, currency)}
          isHighlight={true}
          status="positive"
          subtitle={result.riskProfile}
        />
        <ResultCard
          title="Rebalance Status"
          value={result.rebalanceNeeded ? 'Rebalance Advised' : 'In Balance'}
          status={result.rebalanceNeeded ? 'neutral' : 'positive'}
          subtitle={result.rebalanceNeeded ? 'Allocations drift >1% from target' : 'Allocations align with target model'}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="px-3 py-2.5">Asset Class</th>
              <th className="px-3 py-2.5">Current (${currencySymbol})</th>
              <th className="px-3 py-2.5">Current (%)</th>
              <th className="px-3 py-2.5">Target (%)</th>
              <th className="px-3 py-2.5">Target (${currencySymbol})</th>
              <th className="px-3 py-2.5 text-right">Rebalance Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
            {result.allocations.map((a) => (
              <tr key={a.name}>
                <td className="px-3 py-2 font-sans font-semibold text-slate-900 dark:text-slate-100">{a.name}</td>
                <td className="px-3 py-2">{formatCurrency(a.currentAmount, currency)}</td>
                <td className="px-3 py-2">{a.currentPercent}%</td>
                <td className="px-3 py-2">{a.targetPercent}%</td>
                <td className="px-3 py-2">{formatCurrency(a.targetAmount, currency)}</td>
                <td className="px-3 py-2 text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                      a.action === 'BUY'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : a.action === 'SELL'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {a.action === 'HOLD' ? 'HOLD' : `${a.action} ${formatCurrency(Math.abs(a.rebalanceDifference), currency)}`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CalculationActions title="Asset Allocation Calculation" onReset={resetInputs} />
    </div>
  );

  const chart = (
    <DonutChart
      slices={result.allocations.map((a, i) => ({
        label: a.name,
        value: a.currentAmount,
        color: ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'][i % 5],
      }))}
    />
  );

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

// 2. STOCK AVERAGE VIEW
export const StockAverageView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: StockAverageInput = {
    purchases: [
      { shares: 50, pricePerShare: 140 },
      { shares: 30, pricePerShare: 125 },
      { shares: 20, pricePerShare: 110 },
    ],
    currentMarketPrice: 135,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<StockAverageInput>(initial, 'stkavg');
  const result = calculateStockAverage(inputs);

  const updatePurchase = (idx: number, field: keyof StockPurchaseBatch, val: number) => {
    const updated = [...inputs.purchases];
    updated[idx] = { ...updated[idx], [field]: val };
    setInputs({ ...inputs, purchases: updated });
  };

  const addPurchase = () => {
    if (inputs.purchases.length < 8) {
      setInputs({ ...inputs, purchases: [...inputs.purchases, { shares: 10, pricePerShare: 100 }] });
    }
  };

  const removePurchase = () => {
    if (inputs.purchases.length > 1) {
      setInputs({ ...inputs, purchases: inputs.purchases.slice(0, -1) });
    }
  };

  const inputsComponent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Stock Purchase Tranches</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addPurchase}
            disabled={inputs.purchases.length >= 8}
            className="text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-semibold"
          >
            + Add Buy
          </button>
          <button
            type="button"
            onClick={removePurchase}
            disabled={inputs.purchases.length <= 1}
            className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 font-semibold"
          >
            - Remove
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {inputs.purchases.map((p, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <span className="text-[11px] font-bold text-slate-400 w-12">Buy #{i + 1}</span>
            <div className="flex-1">
              <label className="block text-[10px] text-slate-500 mb-0.5">Shares</label>
              <input
                type="number"
                min="0"
                step="any"
                value={p.shares ?? ''}
                onChange={(e) => updatePurchase(i, 'shares', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded font-mono"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] text-slate-500 mb-0.5">Price Per Share (${currencySymbol})</label>
              <input
                type="number"
                min="0"
                step="any"
                value={p.pricePerShare ?? ''}
                onChange={(e) => updatePurchase(i, 'pricePerShare', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded font-mono"
              />
            </div>
            <div className="w-24 text-right pr-2">
              <span className="block text-[10px] text-slate-500 mb-0.5">Total Cost</span>
              <span className="text-xs font-mono font-bold">{formatCurrency((p.shares || 0) * (p.pricePerShare || 0), currency)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="block text-xs font-semibold mb-1">Current Stock Market Price (${currencySymbol}) (Optional for P&L)</label>
        <input
          type="number"
          step="any"
          value={inputs.currentMarketPrice ?? ''}
          onChange={(e) => setInputs({ ...inputs, currentMarketPrice: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
          placeholder="135"
        />
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Average Cost Per Share"
          value={formatCurrency(result.averagePricePerShare, currency)}
          isHighlight={true}
          status="positive"
          subtitle={`Break-even threshold for ${result.totalShares} shares`}
        />
        <ResultCard
          title="Total Capital Invested"
          value={formatCurrency(result.totalCostInvested, currency)}
          subtitle="Total outlay across all purchases"
        />
        {result.currentPortfolioValue !== undefined && (
          <ResultCard
            title="Current Position Value"
            value={formatCurrency(result.currentPortfolioValue, currency)}
            subtitle={`At current price: ${formatCurrency(inputs.currentMarketPrice || 0, currency)}`}
          />
        )}
        {result.totalProfitOrLoss !== undefined && (
          <ResultCard
            title="Unrealized Profit / Loss"
            value={formatCurrency(result.totalProfitOrLoss, currency)}
            status={result.isProfit ? 'positive' : 'negative'}
            subtitle={`Net Return: ${formatPercentage(result.roiPercentage || 0)}`}
          />
        )}
      </div>
      <CalculationActions title="Stock Average Calculation" onReset={resetInputs} />
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

// 3. DIVIDEND REINVESTMENT (DRIP) VIEW
export const DividendReinvestmentView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: DividendReinvestmentInput = {
    initialInvestment: 25000,
    annualContribution: 2400,
    dividendYieldPercent: 3.8,
    annualDividendGrowthRatePercent: 5.0,
    expectedSharePriceAppreciationPercent: 5.5,
    years: 15,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<DividendReinvestmentInput>(initial, 'drip');
  const result = calculateDividendReinvestment(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Starting Portfolio Value (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.initialInvestment ?? ''}
            onChange={(e) => setInputs({ ...inputs, initialInvestment: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="25000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Annual Cash Contribution (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.annualContribution ?? ''}
            onChange={(e) => setInputs({ ...inputs, annualContribution: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="2400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Dividend Yield (%)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={inputs.dividendYieldPercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, dividendYieldPercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="3.8"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Annual Dividend Growth (%)</label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={inputs.annualDividendGrowthRatePercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, annualDividendGrowthRatePercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="5.0"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Share Price Growth (%)</label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={inputs.expectedSharePriceAppreciationPercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, expectedSharePriceAppreciationPercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="5.5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Holding Period (Years)</label>
          <input
            type="number"
            min="1"
            max="40"
            value={inputs.years ?? ''}
            onChange={(e) => setInputs({ ...inputs, years: parseInt(e.target.value, 10) || 10 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="15"
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
          title="Portfolio Value (With DRIP)"
          value={formatCurrency(result.endingBalanceWithDrip, currency)}
          isHighlight={true}
          status="positive"
          subtitle={`After ${inputs.years} years with dividend reinvestment`}
        />
        <ResultCard
          title="DRIP Compounding Boost"
          value={`+${formatCurrency(result.dripWealthBoost, currency)}`}
          status="positive"
          subtitle={`Versus taking dividends in cash (${formatCurrency(result.endingBalanceWithoutDrip, currency)})`}
        />
        <ResultCard
          title="Annual Dividend Income (Yr 15)"
          value={`${formatCurrency(result.finalAnnualDividendPayout, currency)}/yr`}
          status="positive"
          subtitle={`Yield on original cost: ${result.finalYieldOnCostPercent}%`}
        />
        <ResultCard
          title="Total Dividends Received"
          value={formatCurrency(result.totalDividendsEarned, currency)}
          subtitle="Cumulative dividend payouts over horizon"
        />
      </div>
      <CalculationActions title="DRIP Calculation" onReset={resetInputs} />
    </div>
  );

  const chart = result.yearlySchedule.length > 1 ? (
    <AreaGrowthChart
      data={result.yearlySchedule.map((s) => ({
        label: `Yr ${s.year}`,
        invested: s.portfolioValueNoDrip,
        total: s.portfolioValueDrip,
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

// 4. INVESTMENT FEE VIEW
export const InvestmentFeeView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: InvestmentFeeInput = {
    initialInvestment: 50000,
    monthlyContribution: 500,
    annualReturnRatePercent: 8.0,
    annualFeePercent: 1.0,
    investmentPeriodYears: 25,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<InvestmentFeeInput>(initial, 'infee');
  const result = calculateInvestmentFee(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Starting Portfolio Value (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.initialInvestment ?? ''}
            onChange={(e) => setInputs({ ...inputs, initialInvestment: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="50000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Monthly Deposit (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.monthlyContribution ?? ''}
            onChange={(e) => setInputs({ ...inputs, monthlyContribution: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Gross Annual Return (%)</label>
          <input
            type="number"
            step="0.5"
            value={inputs.annualReturnRatePercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, annualReturnRatePercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="8.0"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Annual Fee / Expense Ratio (%)</label>
          <input
            type="number"
            step="0.05"
            min="0"
            value={inputs.annualFeePercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, annualFeePercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="1.0"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1">Investment Horizon (Years)</label>
          <input
            type="number"
            min="1"
            max="50"
            value={inputs.investmentPeriodYears ?? ''}
            onChange={(e) => setInputs({ ...inputs, investmentPeriodYears: parseInt(e.target.value, 10) || 20 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="25"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Total Wealth Lost to Fees"
          value={formatCurrency(result.totalFeesCost, currency)}
          isHighlight={true}
          status="negative"
          subtitle={`${result.percentageLostToFees}% of your potential wealth eaten by fees`}
        />
        <ResultCard
          title="Ending Balance (With Fees)"
          value={formatCurrency(result.endingBalanceWithFee, currency)}
          subtitle={`Net effective return: ${(inputs.annualReturnRatePercent - inputs.annualFeePercent).toFixed(2)}%`}
        />
        <ResultCard
          title="Potential Balance (No Fees)"
          value={formatCurrency(result.endingBalanceWithoutFee, currency)}
          status="positive"
          subtitle="If invested in a zero-fee index"
        />
        <ResultCard
          title="Direct Fees Deducted"
          value={formatCurrency(result.totalDirectFeesPaid, currency)}
          status="negative"
          subtitle="Raw dollar fee deductions before lost compounding"
        />
      </div>
      <CalculationActions title="Investment Fee Calculation" onReset={resetInputs} />
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

// 5. BOND YIELD VIEW
export const BondYieldView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: BondYieldInput = {
    currentBondPrice: 960,
    faceValue: 1000,
    annualCouponRatePercent: 5.0,
    yearsToMaturity: 7,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<BondYieldInput>(initial, 'byield');
  const result = calculateBondYield(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Current Bond Trading Price (${currencySymbol})</label>
          <input
            type="number"
            min="1"
            value={inputs.currentBondPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, currentBondPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="960"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Face / Par Value (${currencySymbol})</label>
          <input
            type="number"
            min="1"
            value={inputs.faceValue ?? ''}
            onChange={(e) => setInputs({ ...inputs, faceValue: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="1000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Annual Coupon Interest (%)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={inputs.annualCouponRatePercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, annualCouponRatePercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="5.0"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Years to Maturity</label>
          <input
            type="number"
            step="0.5"
            min="0.5"
            value={inputs.yearsToMaturity ?? ''}
            onChange={(e) => setInputs({ ...inputs, yearsToMaturity: parseFloat(e.target.value) || 1 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="7"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Yield to Maturity (Approx YTM)"
          value={formatPercentage(result.approxYieldToMaturityPercent)}
          isHighlight={true}
          status="positive"
          subtitle={`Annualized total return until maturity`}
        />
        <ResultCard
          title="Current Yield"
          value={formatPercentage(result.currentYieldPercent)}
          subtitle={`Annual coupon / purchase price`}
        />
        <ResultCard
          title="Annual Coupon Payment"
          value={`${formatCurrency(result.annualCouponPayment, currency)}/yr`}
          subtitle={`Total over ${inputs.yearsToMaturity} yrs: ${formatCurrency(result.totalCouponPayments, currency)}`}
        />
        <ResultCard
          title="Trading Price Status"
          value={result.priceStatus.toUpperCase()}
          status={result.priceStatus === 'Discount' ? 'positive' : 'neutral'}
          subtitle={`$${result.discountOrPremiumAmount.toFixed(2)} (${result.discountOrPremiumPercent}%) ${result.priceStatus.toLowerCase()}`}
        />
      </div>
      <CalculationActions title="Bond Yield Calculation" onReset={resetInputs} />
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
