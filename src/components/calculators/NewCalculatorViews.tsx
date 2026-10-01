import React, { useState } from 'react';
import { ToolItem } from '../../types';
import { CalculatorLayout } from '../common/CalculatorLayout';
import { ResultCard, CalculationActions } from '../common/ResultCard';
import { AreaGrowthChart, DonutChart } from '../common/SimpleChart';
import { formatCurrency, formatNumber, formatPercentage } from '../../lib/formatters';
import { useUrlParamsState } from '../../lib/useUrlParamsState';
import { useCurrency } from '../../context/CurrencyContext';
import {
  TrendingUp,
  Percent,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Scale,
  Target,
  Zap,
  Info,
} from 'lucide-react';

// Calculation engines
import { calculateCAGR, CAGRInput } from '../../lib/calculators/cagr';
import { calculateDividend, DividendInput } from '../../lib/calculators/dividend';
import { calculateInflation, InflationInput } from '../../lib/calculators/inflation';
import { calculateRetirement, RetirementInput } from '../../lib/calculators/retirement';
import { calculateDebtPayoff, DebtPayoffInput } from '../../lib/calculators/debtPayoff';
import { calculateAmortization, AmortizationInput } from '../../lib/calculators/amortization';
import { calculateLoanInterest, LoanInterestInput } from '../../lib/calculators/loanInterest';
import { calculateLeverage, LeverageInput } from '../../lib/calculators/leverage';
import { calculateMargin, MarginInput } from '../../lib/calculators/margin';
import { calculateLiquidationPrice, LiquidationPriceInput } from '../../lib/calculators/liquidationPrice';
import { calculateFuturesPnl, FuturesPnlInput } from '../../lib/calculators/futuresPnl';
import { calculateRiskReward, RiskRewardInput } from '../../lib/calculators/riskReward';
import { calculateTakeProfit, TakeProfitInput } from '../../lib/calculators/takeProfit';
import { calculateBreakEvenPrice, BreakEvenPriceInput } from '../../lib/calculators/breakEvenPrice';
import { calculateApyApr, ApyAprInput, CompoundingInterval } from '../../lib/calculators/apyApr';

export interface CalculatorViewProps {
  tool: ToolItem;
  onNavigate: (route: string) => void;
}

// ==========================================
// 1. CAGR CALCULATOR VIEW
// ==========================================
export const CAGRView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initialValues: CAGRInput = {
    initialValue: 10000,
    finalValue: 28500,
    years: 5,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<CAGRInput>(initialValues, 'cagr');
  const result = calculateCAGR(inputs);

  const presets = [
    { label: '5-Year Tech Stock', init: 10000, final: 24500, yrs: 5 },
    { label: '10-Year Index Fund', init: 25000, final: 65000, yrs: 10 },
    { label: '4-Year Bitcoin Cycle', init: 5000, final: 32000, yrs: 4 },
  ];

  const inputsComponent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Quick Scenarios:</span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setInputs({ initialValue: p.init, finalValue: p.final, years: p.yrs })}
              className="px-2 py-0.5 text-xs rounded-lg font-medium border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Initial Investment Value (${currencySymbol})
        </label>
        <input
          type="number"
          min="0.01"
          step="any"
          value={inputs.initialValue || ''}
          onChange={(e) => setInputs({ ...inputs, initialValue: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="10000"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Final / Current Value (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.finalValue || ''}
          onChange={(e) => setInputs({ ...inputs, finalValue: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="28500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Time Period (Years)
        </label>
        <input
          type="number"
          min="0.1"
          max="100"
          step="0.5"
          value={inputs.years || ''}
          onChange={(e) => setInputs({ ...inputs, years: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="5"
        />
      </div>

      {result.errorMessage && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          {result.errorMessage}
        </div>
      )}
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Compound Annual Growth (CAGR)"
          value={formatPercentage(result.cagr)}
          status={result.cagr >= 0 ? 'positive' : 'negative'}
          subtitle={`Annualized rate over ${inputs.years} years`}
        />
        <ResultCard
          title="Total Net Gain / Loss"
          value={formatCurrency(result.absoluteGain, currency)}
          status={result.absoluteGain >= 0 ? 'positive' : 'negative'}
          subtitle={`Total return: ${formatPercentage(result.totalReturnPercent)}`}
        />
        <ResultCard
          title="Growth Multiple"
          value={`${result.growthMultiple}x`}
          subtitle="Final value vs initial principal"
        />
        <ResultCard
          title="Total Return (%)"
          value={formatPercentage(result.totalReturnPercent)}
          status={result.totalReturnPercent >= 0 ? 'positive' : 'negative'}
          subtitle="Cumulative non-annualized return"
        />
      </div>

      <CalculationActions
        title="CAGR Calculation Results"
        onReset={resetInputs}
      />
    </div>
  );

  const chart = result.yearlySchedule.length > 1 ? (
    <AreaGrowthChart
      data={result.yearlySchedule.map((pt) => ({
        label: `Yr ${pt.year}`,
        invested: inputs.initialValue,
        total: pt.value,
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

// ==========================================
// 2. DIVIDEND CALCULATOR VIEW
// ==========================================
export const DividendView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initialValues: DividendInput = {
    stockPrice: 150,
    sharesOwned: 100,
    annualDividendPerShare: 4.5,
    dividendGrowthRate: 5,
    yearsInvested: 10,
    reinvestDividends: true,
    payoutFrequency: 'quarterly',
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<DividendInput>(initialValues, 'dividend');
  const result = calculateDividend(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Stock / ETF Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0.01"
            step="any"
            value={inputs.stockPrice || ''}
            onChange={(e) => setInputs({ ...inputs, stockPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="150"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Shares Owned
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.sharesOwned || ''}
            onChange={(e) => setInputs({ ...inputs, sharesOwned: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Annual Dividend per Share (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.annualDividendPerShare || ''}
            onChange={(e) => setInputs({ ...inputs, annualDividendPerShare: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="4.50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Expected Dividend Growth (%/yr)
          </label>
          <input
            type="number"
            min="0"
            max="50"
            step="0.5"
            value={inputs.dividendGrowthRate ?? 5}
            onChange={(e) => setInputs({ ...inputs, dividendGrowthRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Payout Frequency
          </label>
          <select
            value={inputs.payoutFrequency}
            onChange={(e) => setInputs({ ...inputs, payoutFrequency: e.target.value as any })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
          >
            <option value="quarterly">Quarterly (4x/year)</option>
            <option value="monthly">Monthly (12x/year)</option>
            <option value="semi-annual">Semi-Annual (2x/year)</option>
            <option value="annual">Annual (1x/year)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Investment Horizon (Years)
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={inputs.yearsInvested || ''}
            onChange={(e) => setInputs({ ...inputs, yearsInvested: parseInt(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="10"
          />
        </div>
      </div>

      {/* DRIP Reinvestment Switch */}
      <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
            Reinvest Dividends (DRIP)
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Automatically buy more shares with payouts to accelerate compounding
          </span>
        </div>
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, reinvestDividends: !inputs.reinvestDividends })}
          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
            inputs.reinvestDividends ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              inputs.reinvestDividends ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Current Dividend Yield"
          value={formatPercentage(result.currentYieldPercent)}
          status="positive"
          subtitle={`Annual payout per share: ${formatCurrency(inputs.annualDividendPerShare, currency)}`}
        />
        <ResultCard
          title="Annual Dividend Income"
          value={formatCurrency(result.annualDividendIncome, currency)}
          subtitle={`Per payout: ${formatCurrency(result.payoutPerPeriod, currency)} (${inputs.payoutFrequency})`}
        />
        <ResultCard
          title="Monthly Passive Income"
          value={formatCurrency(result.monthlyDividendIncome, currency)}
          subtitle="Normalized monthly cash flow"
        />
        <ResultCard
          title={`Future Portfolio (Yr ${inputs.yearsInvested})`}
          value={formatCurrency(result.futurePortfolioValue, currency)}
          isHighlight={true}
          subtitle={`Cumulative dividends: ${formatCurrency(result.totalDividendsReceived, currency)}`}
        />
      </div>

      <CalculationActions
        title="Dividend Income Results"
        onReset={resetInputs}
      />
    </div>
  );

  const chart = result.schedule.length > 1 ? (
    <AreaGrowthChart
      data={result.schedule.map((pt) => ({
        label: `Yr ${pt.year}`,
        invested: inputs.stockPrice * inputs.sharesOwned,
        total: pt.portfolioValue,
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

// ==========================================
// 3. INFLATION CALCULATOR VIEW
// ==========================================
export const InflationView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initialValues: InflationInput = {
    currentAmount: 10000,
    inflationRate: 3.5,
    years: 15,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<InflationInput>(initialValues, 'inflation');
  const result = calculateInflation(inputs);

  const presets = [
    { label: 'Moderate 3%', rate: 3.0, yrs: 10 },
    { label: 'Historic US ~3.8%', rate: 3.8, yrs: 20 },
    { label: 'High Inflation 7%', rate: 7.0, yrs: 5 },
  ];

  const inputsComponent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Presets:</span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setInputs({ ...inputs, inflationRate: p.rate, years: p.yrs })}
              className="px-2 py-0.5 text-xs rounded-lg font-medium border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-indigo-400 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Current Amount / Cost (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.currentAmount || ''}
          onChange={(e) => setInputs({ ...inputs, currentAmount: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="10000"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Average Annual Inflation Rate (%)
          </label>
          <input
            type="number"
            min="-10"
            max="100"
            step="0.1"
            value={inputs.inflationRate ?? 3.5}
            onChange={(e) => setInputs({ ...inputs, inflationRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="3.5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Time Horizon (Years)
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={inputs.years || ''}
            onChange={(e) => setInputs({ ...inputs, years: parseInt(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="15"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title={`Future Cost in ${inputs.years} Years`}
          value={formatCurrency(result.futureCost, currency)}
          status="negative"
          subtitle={`+${formatCurrency(result.totalCostIncrease, currency)} increase for the same goods`}
        />
        <ResultCard
          title="Real Purchasing Power Remaining"
          value={formatCurrency(result.purchasingPower, currency)}
          status="neutral"
          subtitle={`Lost ${formatPercentage(result.purchasingPowerLossPercent)} of purchasing power`}
        />
        <ResultCard
          title="Purchasing Power Loss"
          value={`-${formatPercentage(result.purchasingPowerLossPercent)}`}
          status="negative"
          subtitle="Real devaluation of uninvested cash"
        />
        <ResultCard
          title="Inflation Multiplier"
          value={`${result.cumulativeInflationFactor}x`}
          subtitle="Factor of cost expansion"
        />
      </div>

      <CalculationActions
        title="Inflation Projection"
        onReset={resetInputs}
      />
    </div>
  );

  const chart = result.schedule.length > 1 ? (
    <AreaGrowthChart
      data={result.schedule.map((pt) => ({
        label: `Yr ${pt.year}`,
        invested: pt.purchasingPower,
        total: pt.futureCost,
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

// ==========================================
// 4. RETIREMENT CALCULATOR VIEW
// ==========================================
export const RetirementView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initialValues: RetirementInput = {
    currentAge: 32,
    retirementAge: 65,
    currentSavings: 35000,
    monthlyContribution: 750,
    annualReturnRate: 8,
    inflationRate: 2.5,
    annualWithdrawal: 60000,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<RetirementInput>(initialValues, 'retirement');
  const result = calculateRetirement(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Current Age
          </label>
          <input
            type="number"
            min="18"
            max="95"
            value={inputs.currentAge || ''}
            onChange={(e) => setInputs({ ...inputs, currentAge: parseInt(e.target.value) || 18 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="32"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Target Retirement Age
          </label>
          <input
            type="number"
            min={inputs.currentAge + 1}
            max="100"
            value={inputs.retirementAge || ''}
            onChange={(e) => setInputs({ ...inputs, retirementAge: parseInt(e.target.value) || 65 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="65"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Current Retirement Savings (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.currentSavings || ''}
            onChange={(e) => setInputs({ ...inputs, currentSavings: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="35000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Monthly Contribution (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.monthlyContribution || ''}
            onChange={(e) => setInputs({ ...inputs, monthlyContribution: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="750"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Expected Annual Return (%)
          </label>
          <input
            type="number"
            min="0"
            max="30"
            step="0.5"
            value={inputs.annualReturnRate ?? 8}
            onChange={(e) => setInputs({ ...inputs, annualReturnRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="8.0"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Expected Inflation (%)
          </label>
          <input
            type="number"
            min="0"
            max="15"
            step="0.1"
            value={inputs.inflationRate ?? 2.5}
            onChange={(e) => setInputs({ ...inputs, inflationRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="2.5"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Nest Egg at Retirement (Nominal)"
          value={formatCurrency(result.totalSavingsNominal, currency)}
          isHighlight={true}
          subtitle={`In ${result.yearsToRetire} years at age ${inputs.retirementAge}`}
        />
        <ResultCard
          title="Inflation-Adjusted Nest Egg (Real)"
          value={formatCurrency(result.totalSavingsReal, currency)}
          status="positive"
          subtitle="Value in today's purchasing power"
        />
        <ResultCard
          title="Safe Monthly Income (4% Rule)"
          value={formatCurrency(result.monthlyRetirementIncome4Percent, currency)}
          status="positive"
          subtitle={`Real equivalent: ${formatCurrency(result.monthlyRetirementIncomeReal, currency)}/mo`}
        />
        <ResultCard
          title="Compound Growth vs Deposits"
          value={formatCurrency(result.totalInterestEarned, currency)}
          subtitle={`From ${formatCurrency(result.totalPrincipalContributed, currency)} total deposits`}
        />
      </div>

      <CalculationActions
        title="Retirement Plan Summary"
        onReset={resetInputs}
      />
    </div>
  );

  const chart = result.schedule.length > 1 ? (
    <AreaGrowthChart
      data={result.schedule.map((pt) => ({
        label: `Age ${pt.age}`,
        invested: pt.totalContributions,
        total: pt.nominalSavings,
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

// ==========================================
// 5. DEBT PAYOFF CALCULATOR VIEW
// ==========================================
export const DebtPayoffView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initialValues: DebtPayoffInput = {
    balance: 15000,
    interestRate: 18.5,
    monthlyPayment: 500,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<DebtPayoffInput>(initialValues, 'debt');
  const result = calculateDebtPayoff(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Total Debt Balance (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.balance || ''}
          onChange={(e) => setInputs({ ...inputs, balance: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="15000"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Interest Rate (APR %)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={inputs.interestRate ?? 18.5}
            onChange={(e) => setInputs({ ...inputs, interestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="18.5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Monthly Payment Amount (${currencySymbol})
          </label>
          <input
            type="number"
            min="1"
            step="any"
            value={inputs.monthlyPayment || ''}
            onChange={(e) => setInputs({ ...inputs, monthlyPayment: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="500"
          />
        </div>
      </div>

      {!result.isPaymentSufficient && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{result.errorMessage} Minimum required: {formatCurrency(result.minimumMonthlyPaymentRequired, currency)}/mo.</span>
        </div>
      )}
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Time to Debt Freedom"
          value={`${result.monthsToPayoff} Months`}
          status={result.isPaymentSufficient ? 'positive' : 'negative'}
          subtitle={`${result.yearsToPayoff} years until 100% paid off`}
        />
        <ResultCard
          title="Total Interest Cost"
          value={formatCurrency(result.totalInterestPaid, currency)}
          status={result.totalInterestPaid > 0 ? 'negative' : 'positive'}
          subtitle="Cumulative interest paid to lenders"
        />
        <ResultCard
          title="Total Payoff Outlay"
          value={formatCurrency(result.totalAmountPaid, currency)}
          subtitle="Principal balance + total interest"
        />
        <ResultCard
          title="Monthly Payment"
          value={formatCurrency(inputs.monthlyPayment, currency)}
          subtitle="Fixed monthly contribution"
        />
      </div>

      <CalculationActions
        title="Debt Repayment Schedule"
        onReset={resetInputs}
      />
    </div>
  );

  const chart = result.schedule.length > 1 ? (
    <AreaGrowthChart
      data={result.schedule.map((pt) => ({
        label: `M${pt.month}`,
        invested: pt.principal,
        total: pt.balance,
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

// ==========================================
// 6. AMORTIZATION CALCULATOR VIEW
// ==========================================
export const AmortizationView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initialValues: AmortizationInput = {
    loanAmount: 250000,
    interestRate: 6.5,
    loanTermYears: 30,
    extraMonthlyPayment: 150,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<AmortizationInput>(initialValues, 'amortization');
  const result = calculateAmortization(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Loan Amount (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.loanAmount || ''}
          onChange={(e) => setInputs({ ...inputs, loanAmount: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="250000"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="30"
            step="0.05"
            value={inputs.interestRate ?? 6.5}
            onChange={(e) => setInputs({ ...inputs, interestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="6.5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Loan Term (Years)
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={inputs.loanTermYears || ''}
            onChange={(e) => setInputs({ ...inputs, loanTermYears: parseInt(e.target.value) || 30 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="30"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Extra Monthly Payment (Optional $)
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.extraMonthlyPayment || ''}
          onChange={(e) => setInputs({ ...inputs, extraMonthlyPayment: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="150"
        />
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Regular Monthly Payment"
          value={formatCurrency(result.monthlyPayment, currency)}
          subtitle={inputs.extraMonthlyPayment ? `+${formatCurrency(inputs.extraMonthlyPayment, currency)} extra monthly` : 'Base Principal & Interest (P&I)'}
        />
        <ResultCard
          title="Total Interest Paid"
          value={formatCurrency(result.totalInterest, currency)}
          status="negative"
          subtitle={`Total loan cost: ${formatCurrency(result.totalPayment, currency)}`}
        />
        <ResultCard
          title="Payoff Time Saved"
          value={`${Math.floor(result.monthsSaved / 12)} Yrs ${result.monthsSaved % 12} Mos`}
          status="positive"
          subtitle={`Paid off in ${Math.floor(result.payoffMonths / 12)} years instead of ${inputs.loanTermYears}`}
        />
        <ResultCard
          title="Interest Saved with Extra Payments"
          value={formatCurrency(result.interestSaved, currency)}
          status="positive"
          subtitle="Direct savings by paying down principal early"
        />
      </div>

      {/* Annual Summary Table */}
      {result.annualSchedule.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 font-semibold text-xs text-slate-800 dark:text-slate-200">
            Year-by-Year Amortization Schedule (First 5 Years)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-2 px-3">Year</th>
                  <th className="py-2 px-3">Principal Paid</th>
                  <th className="py-2 px-3">Interest Paid</th>
                  <th className="py-2 px-3">Ending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {result.annualSchedule.slice(0, 5).map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2 px-3 font-medium text-slate-900 dark:text-slate-100">Year {row.year}</td>
                    <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">+{formatCurrency(row.principalPaid, currency)}</td>
                    <td className="py-2 px-3 text-rose-500">{formatCurrency(row.interestPaid, currency)}</td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{formatCurrency(row.endingBalance, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CalculationActions
        title="Amortization Schedule"
        onReset={resetInputs}
      />
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

// ==========================================
// 7. LOAN INTEREST CALCULATOR VIEW
// ==========================================
export const LoanInterestView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initialValues: LoanInterestInput = {
    loanAmount: 20000,
    interestRate: 7.5,
    loanTermYears: 4,
    calculationType: 'amortized',
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<LoanInterestInput>(initialValues, 'loan-interest');
  const result = calculateLoanInterest(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Principal Loan Amount (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.loanAmount || ''}
          onChange={(e) => setInputs({ ...inputs, loanAmount: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="20000"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={inputs.interestRate ?? 7.5}
            onChange={(e) => setInputs({ ...inputs, interestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="7.5"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">Supports 0% promotional rates</span>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Loan Term (Years)
          </label>
          <input
            type="number"
            min="0.1"
            max="50"
            step="0.5"
            value={inputs.loanTermYears || ''}
            onChange={(e) => setInputs({ ...inputs, loanTermYears: parseFloat(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="4"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Interest Method
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, calculationType: 'amortized' })}
            className={`py-2 px-3 text-xs rounded-xl font-medium border transition-colors ${
              inputs.calculationType === 'amortized'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            Amortized (Reducing Balance)
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, calculationType: 'simple' })}
            className={`py-2 px-3 text-xs rounded-xl font-medium border transition-colors ${
              inputs.calculationType === 'simple'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            Simple Flat Interest
          </button>
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Total Interest Cost"
          value={formatCurrency(result.totalInterest, currency)}
          status={inputs.interestRate === 0 ? 'positive' : 'negative'}
          subtitle={inputs.interestRate === 0 ? 'Zero interest promotion' : `${formatPercentage(result.interestToPrincipalRatio)} of principal amount`}
        />
        <ResultCard
          title="Total Payment (P + I)"
          value={formatCurrency(result.totalPayment, currency)}
          subtitle="Complete debt obligation"
        />
        <ResultCard
          title="Monthly Payment"
          value={formatCurrency(result.monthlyPayment, currency)}
          subtitle={`Across ${Math.round(inputs.loanTermYears * 12)} monthly installments`}
        />
        <ResultCard
          title="Effective Rate"
          value={formatPercentage(result.effectiveApr)}
          subtitle="Nominal Annual Rate (APR)"
        />
      </div>

      <CalculationActions
        title="Loan Interest Breakdown"
        onReset={resetInputs}
      />
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

// ==========================================
// 8. LEVERAGE CALCULATOR VIEW
// ==========================================
export const LeverageView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initialValues: LeverageInput = {
    marginAvailable: 2500,
    leverageMultiple: 10,
    assetPrice: 65000,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<LeverageInput>(initialValues, 'leverage');
  const result = calculateLeverage(inputs);

  const leveragePresets = [2, 5, 10, 20, 50, 100];

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Account Margin / Capital (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.marginAvailable || ''}
          onChange={(e) => setInputs({ ...inputs, marginAvailable: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="2500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Leverage Multiple: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{inputs.leverageMultiple}x</span>
          </label>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={inputs.leverageMultiple}
          onChange={(e) => setInputs({ ...inputs, leverageMultiple: parseInt(e.target.value) || 1 })}
          className="w-full accent-indigo-600 cursor-pointer"
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {leveragePresets.map((lev) => (
            <button
              key={lev}
              type="button"
              onClick={() => setInputs({ ...inputs, leverageMultiple: lev })}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono font-medium border transition-colors ${
                inputs.leverageMultiple === lev
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
              }`}
            >
              {lev}x
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Asset Price (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.assetPrice || ''}
          onChange={(e) => setInputs({ ...inputs, assetPrice: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="65000"
        />
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Total Position Exposure"
          value={formatCurrency(result.totalPositionExposure, currency)}
          isHighlight={true}
          subtitle={`Notional purchasing power at ${inputs.leverageMultiple}x`}
        />
        <ResultCard
          title="Max Drawdown Before 100% Loss"
          value={`-${formatPercentage(result.maxDrawdownBeforeDepletion)}`}
          status="negative"
          subtitle="Adverse price move that depletes margin"
        />
        <ResultCard
          title="Units Controlled"
          value={`${result.assetQuantityControlled}`}
          subtitle={`At entry price of ${formatCurrency(inputs.assetPrice, currency)}`}
        />
        <ResultCard
          title="Borrowed Capital"
          value={formatCurrency(result.borrowedFunds, currency)}
          subtitle="Leveraged debt provided by exchange"
        />
      </div>

      <CalculationActions
        title="Leverage Exposure Summary"
        onReset={resetInputs}
      />
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

// ==========================================
// 9. MARGIN CALCULATOR VIEW
// ==========================================
export const MarginView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initialValues: MarginInput = {
    entryPrice: 3200,
    positionQuantity: 5,
    leverage: 20,
    maintenanceMarginRate: 0.5,
    accountBalance: 5000,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<MarginInput>(initialValues, 'margin');
  const result = calculateMargin(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Asset Entry Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.entryPrice || ''}
            onChange={(e) => setInputs({ ...inputs, entryPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="3200"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Position Size / Quantity
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.positionQuantity || ''}
            onChange={(e) => setInputs({ ...inputs, positionQuantity: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Leverage (x)
          </label>
          <input
            type="number"
            min="1"
            max="125"
            value={inputs.leverage || ''}
            onChange={(e) => setInputs({ ...inputs, leverage: parseInt(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="20"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Account Balance ($ Optional)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.accountBalance || ''}
            onChange={(e) => setInputs({ ...inputs, accountBalance: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="5000"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Required Initial Margin"
          value={formatCurrency(result.requiredInitialMargin, currency)}
          isHighlight={true}
          subtitle={`${formatPercentage(result.marginRequirementPercent)} initial margin rate`}
        />
        <ResultCard
          title="Total Position Value"
          value={formatCurrency(result.positionValue, currency)}
          subtitle="Notional market exposure"
        />
        <ResultCard
          title="Maintenance Margin"
          value={formatCurrency(result.maintenanceMargin, currency)}
          subtitle="Minimum buffer to avoid liquidation"
        />
        <ResultCard
          title="Free Margin Remaining"
          value={formatCurrency(result.freeMarginRemaining, currency)}
          status={result.freeMarginRemaining > 0 ? 'positive' : 'neutral'}
          subtitle="Usable capital after opening trade"
        />
      </div>

      <CalculationActions
        title="Margin Calculation Results"
        onReset={resetInputs}
      />
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

// ==========================================
// 10. LIQUIDATION PRICE CALCULATOR VIEW
// ==========================================
export const LiquidationPriceView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initialValues: LiquidationPriceInput = {
    direction: 'long',
    entryPrice: 62000,
    leverage: 10,
    maintenanceMarginRate: 0.5,
    extraMarginAdded: 0,
    positionQuantity: 1,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<LiquidationPriceInput>(initialValues, 'liq');
  const result = calculateLiquidationPrice(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      {/* Direction Toggle */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Trade Direction
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, direction: 'long' })}
            className={`py-2 px-3 text-xs rounded-xl font-bold border transition-colors ${
              inputs.direction === 'long'
                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            LONG (Buy)
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, direction: 'short' })}
            className={`py-2 px-3 text-xs rounded-xl font-bold border transition-colors ${
              inputs.direction === 'short'
                ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            SHORT (Sell)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Entry Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.entryPrice || ''}
            onChange={(e) => setInputs({ ...inputs, entryPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="62000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Leverage (1x - 100x)
          </label>
          <input
            type="number"
            min="1"
            max="125"
            value={inputs.leverage || ''}
            onChange={(e) => setInputs({ ...inputs, leverage: parseInt(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Position Quantity (Contracts)
          </label>
          <input
            type="number"
            min="0.001"
            step="any"
            value={inputs.positionQuantity || ''}
            onChange={(e) => setInputs({ ...inputs, positionQuantity: parseFloat(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="1.0"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Additional Margin Buffer ($ Optional)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.extraMarginAdded || ''}
            onChange={(e) => setInputs({ ...inputs, extraMarginAdded: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="0"
          />
        </div>
      </div>

      {/* Prominent Exchange Variance Advisory */}
      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <span className="leading-relaxed">{result.exchangeVarianceNotice}</span>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Estimated Liquidation Price"
          value={formatCurrency(result.liquidationPrice, currency)}
          status="negative"
          subtitle={`Distance: ${formatPercentage(result.priceDistancePercent)} (${formatCurrency(result.priceDistance, currency)})`}
        />
        <ResultCard
          title="Required Initial Margin"
          value={formatCurrency(result.initialMargin, currency)}
          subtitle={`At ${inputs.leverage}x leverage`}
        />
        <ResultCard
          title="Bankruptcy Price (0 Margin)"
          value={formatCurrency(result.bankruptcyPrice, currency)}
          subtitle="Point where total margin reaches exact zero"
        />
        <ResultCard
          title="Distance to Liquidation"
          value={`-${formatPercentage(result.priceDistancePercent)}`}
          status={result.priceDistancePercent > 20 ? 'positive' : 'negative'}
          subtitle={inputs.direction === 'long' ? 'Allowed downward move' : 'Allowed upward move'}
        />
      </div>

      <CalculationActions
        title="Liquidation Price Assessment"
        onReset={resetInputs}
      />
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

// ==========================================
// 11. FUTURES P&L CALCULATOR VIEW
// ==========================================
export const FuturesPnlView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initialValues: FuturesPnlInput = {
    direction: 'long',
    leverage: 10,
    entryPrice: 60000,
    exitPrice: 64500,
    quantity: 0.5,
    entryFeeRate: 0.05,
    exitFeeRate: 0.05,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<FuturesPnlInput>(initialValues, 'futures');
  const result = calculateFuturesPnl(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      {/* Direction */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Position Direction
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, direction: 'long' })}
            className={`py-2 px-3 text-xs rounded-xl font-bold border transition-colors ${
              inputs.direction === 'long'
                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            LONG (Buy)
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, direction: 'short' })}
            className={`py-2 px-3 text-xs rounded-xl font-bold border transition-colors ${
              inputs.direction === 'short'
                ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            SHORT (Sell)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Entry Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.entryPrice || ''}
            onChange={(e) => setInputs({ ...inputs, entryPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="60000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Exit Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.exitPrice || ''}
            onChange={(e) => setInputs({ ...inputs, exitPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="64500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Quantity (Contracts / Coins)
          </label>
          <input
            type="number"
            min="0.001"
            step="any"
            value={inputs.quantity || ''}
            onChange={(e) => setInputs({ ...inputs, quantity: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="0.5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Leverage (x)
          </label>
          <input
            type="number"
            min="1"
            max="125"
            value={inputs.leverage || ''}
            onChange={(e) => setInputs({ ...inputs, leverage: parseInt(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Entry Fee (% e.g. Taker 0.05%)
          </label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.01"
            value={inputs.entryFeeRate ?? 0.05}
            onChange={(e) => setInputs({ ...inputs, entryFeeRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="0.05"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Exit Fee (%)
          </label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.01"
            value={inputs.exitFeeRate ?? 0.05}
            onChange={(e) => setInputs({ ...inputs, exitFeeRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="0.05"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Net Futures P&L"
          value={formatCurrency(result.netPnl, currency)}
          status={result.isProfit ? 'positive' : 'negative'}
          subtitle={`ROE: ${formatPercentage(result.roePercent)} on initial margin`}
        />
        <ResultCard
          title="Return on Equity (ROE / ROI)"
          value={formatPercentage(result.roePercent)}
          status={result.roePercent >= 0 ? 'positive' : 'negative'}
          subtitle={`Price move: ${formatPercentage(result.priceChangePercent)}`}
        />
        <ResultCard
          title="Gross Profit / Loss"
          value={formatCurrency(result.grossPnl, currency)}
          subtitle="Before deducting trading commissions"
        />
        <ResultCard
          title="Roundtrip Exchange Fees"
          value={formatCurrency(result.totalFees, currency)}
          status="neutral"
          subtitle={`Entry: ${formatCurrency(result.entryFee, currency)} | Exit: ${formatCurrency(result.exitFee, currency)}`}
        />
      </div>

      <CalculationActions
        title="Futures P&L Calculation"
        onReset={resetInputs}
      />
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

// ==========================================
// 12. RISK / REWARD CALCULATOR VIEW
// ==========================================
export const RiskRewardView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initialValues: RiskRewardInput = {
    direction: 'long',
    entryPrice: 100,
    stopLossPrice: 95,
    takeProfitPrice: 115,
    positionQuantity: 50,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<RiskRewardInput>(initialValues, 'rr');
  const result = calculateRiskReward(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Trade Direction
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, direction: 'long' })}
            className={`py-2 px-3 text-xs rounded-xl font-bold border transition-colors ${
              inputs.direction === 'long'
                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            LONG (Buy)
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, direction: 'short' })}
            className={`py-2 px-3 text-xs rounded-xl font-bold border transition-colors ${
              inputs.direction === 'short'
                ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            SHORT (Sell)
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Entry Price (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.entryPrice || ''}
          onChange={(e) => setInputs({ ...inputs, entryPrice: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="100"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1.5">
            Stop Loss Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.stopLossPrice || ''}
            onChange={(e) => setInputs({ ...inputs, stopLossPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-rose-200 dark:border-rose-900/60 rounded-xl focus:ring-2 focus:ring-rose-500 font-mono"
            placeholder="95"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5">
            Take Profit Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.takeProfitPrice || ''}
            onChange={(e) => setInputs({ ...inputs, takeProfitPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-emerald-200 dark:border-emerald-900/60 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
            placeholder="115"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Position Size (Quantity Optional)
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.positionQuantity || ''}
          onChange={(e) => setInputs({ ...inputs, positionQuantity: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="50"
        />
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Risk / Reward Ratio"
          value={result.formattedRatio}
          status={result.riskRewardRatio >= 2 ? 'positive' : result.riskRewardRatio >= 1 ? 'neutral' : 'negative'}
          subtitle={`Ratio = ${result.riskRewardRatio}x reward per unit of risk`}
        />
        <ResultCard
          title="Required Break-Even Win Rate"
          value={formatPercentage(result.breakEvenWinRatePercent)}
          isHighlight={true}
          subtitle="Minimum win rate needed for long-term profitability"
        />
        <ResultCard
          title="Risk Per Unit"
          value={formatCurrency(result.riskPerUnit, currency)}
          status="negative"
          subtitle={`-${formatPercentage(result.riskPercent)} distance to Stop Loss`}
        />
        <ResultCard
          title="Reward Per Unit"
          value={formatCurrency(result.rewardPerUnit, currency)}
          status="positive"
          subtitle={`+${formatPercentage(result.rewardPercent)} distance to Take Profit`}
        />
      </div>

      {result.totalMonetaryRisk > 0 && (
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Total Capital at Risk:</span>
            <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">
              -{formatCurrency(result.totalMonetaryRisk, currency)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 dark:text-slate-400 block">Total Projected Profit:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              +{formatCurrency(result.totalMonetaryReward, currency)}
            </span>
          </div>
        </div>
      )}

      <CalculationActions
        title="Risk/Reward Assessment"
        onReset={resetInputs}
      />
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

// ==========================================
// 13. TAKE PROFIT CALCULATOR VIEW
// ==========================================
export const TakeProfitView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initialValues: TakeProfitInput = {
    direction: 'long',
    entryPrice: 2500,
    stopLossPrice: 2400,
    desiredRiskRewardRatio: 2.5,
    positionQuantity: 2,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<TakeProfitInput>(initialValues, 'tp');
  const result = calculateTakeProfit(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Trade Direction
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, direction: 'long' })}
            className={`py-2 px-3 text-xs rounded-xl font-bold border transition-colors ${
              inputs.direction === 'long'
                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            LONG (Buy)
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, direction: 'short' })}
            className={`py-2 px-3 text-xs rounded-xl font-bold border transition-colors ${
              inputs.direction === 'short'
                ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            SHORT (Sell)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Entry Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.entryPrice || ''}
            onChange={(e) => setInputs({ ...inputs, entryPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="2500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Stop Loss Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.stopLossPrice || ''}
            onChange={(e) => setInputs({ ...inputs, stopLossPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="2400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Desired Risk/Reward Ratio (e.g. 2.0 or 3.0)
          </label>
          <input
            type="number"
            min="0.1"
            max="50"
            step="0.1"
            value={inputs.desiredRiskRewardRatio || ''}
            onChange={(e) => setInputs({ ...inputs, desiredRiskRewardRatio: parseFloat(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="2.5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Position Quantity (Optional)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.positionQuantity || ''}
            onChange={(e) => setInputs({ ...inputs, positionQuantity: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="2"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Target Take Profit Price"
          value={formatCurrency(result.takeProfitPrice, currency)}
          status="positive"
          subtitle={`+${formatPercentage(result.rewardPercent)} gain from entry`}
        />
        <ResultCard
          title="Unit Risk vs Reward"
          value={`${formatCurrency(result.rewardPerUnit, currency)}`}
          status="positive"
          subtitle={`Risking ${formatCurrency(result.riskPerUnit, currency)} per coin (${formatPercentage(result.riskPercent)})`}
        />
        <ResultCard
          title="Total Expected Gain"
          value={formatCurrency(result.totalProjectedProfit, currency)}
          isHighlight={true}
          subtitle={`On ${inputs.positionQuantity} units at TP target`}
        />
        <ResultCard
          title="Risk/Reward Multiple"
          value={`1 : ${inputs.desiredRiskRewardRatio}`}
          subtitle="Target payoff coefficient"
        />
      </div>

      {/* Multi-Target Scale Ladder */}
      {result.targetLadder.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 font-semibold text-xs text-slate-800 dark:text-slate-200">
            Multi-Target Partial Profit Ladder
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-2 px-3">Target</th>
                  <th className="py-2 px-3">Price Level</th>
                  <th className="py-2 px-3">Profit / Unit</th>
                  <th className="py-2 px-3">% Move</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {result.targetLadder.map((target) => (
                  <tr key={target.label} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100">{target.label}</td>
                    <td className="py-2 px-3 text-indigo-600 dark:text-indigo-400 font-bold">{formatCurrency(target.targetPrice, currency)}</td>
                    <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">+{formatCurrency(target.profitPerUnit, currency)}</td>
                    <td className="py-2 px-3 text-emerald-600">+{formatPercentage(target.profitPercent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CalculationActions
        title="Take-Profit Plan"
        onReset={resetInputs}
      />
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

// ==========================================
// 14. BREAK-EVEN PRICE CALCULATOR VIEW
// ==========================================
export const BreakEvenPriceView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initialValues: BreakEvenPriceInput = {
    direction: 'long',
    entryPrice: 65000,
    quantity: 1,
    entryFeeRate: 0.1,
    exitFeeRate: 0.1,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<BreakEvenPriceInput>(initialValues, 'be-price');
  const result = calculateBreakEvenPrice(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Trade Direction
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, direction: 'long' })}
            className={`py-2 px-3 text-xs rounded-xl font-bold border transition-colors ${
              inputs.direction === 'long'
                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            LONG (Buy)
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, direction: 'short' })}
            className={`py-2 px-3 text-xs rounded-xl font-bold border transition-colors ${
              inputs.direction === 'short'
                ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            SHORT (Sell)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Entry / Buy Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.entryPrice || ''}
            onChange={(e) => setInputs({ ...inputs, entryPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="65000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Quantity (Units)
          </label>
          <input
            type="number"
            min="0.001"
            step="any"
            value={inputs.quantity || ''}
            onChange={(e) => setInputs({ ...inputs, quantity: parseFloat(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Entry Fee (% e.g. 0.1%)
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.01"
            value={inputs.entryFeeRate ?? 0.1}
            onChange={(e) => setInputs({ ...inputs, entryFeeRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="0.1"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Exit Fee (%)
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.01"
            value={inputs.exitFeeRate ?? 0.1}
            onChange={(e) => setInputs({ ...inputs, exitFeeRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="0.1"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Break-Even Exit Price"
          value={formatCurrency(result.breakEvenPrice, currency)}
          isHighlight={true}
          subtitle={`Requires ${inputs.direction === 'long' ? '+' : '-'}${formatCurrency(result.priceDifference, currency)} (${result.percentageMoveNeeded}%)`}
        />
        <ResultCard
          title="Total Roundtrip Fees"
          value={formatCurrency(result.totalRoundtripFees, currency)}
          status="neutral"
          subtitle={`Entry fee: ${formatCurrency(result.entryFeeAmount, currency)} | Exit: ${formatCurrency(result.estimatedExitFeeAmount, currency)}`}
        />
        <ResultCard
          title="Total Cost Basis at Entry"
          value={formatCurrency(result.totalCostAtEntry, currency)}
          subtitle="Gross purchase cost + entry commission"
        />
        <ResultCard
          title="Spread Required to Clear Fees"
          value={formatPercentage(result.percentageMoveNeeded, 3)}
          subtitle="Minimum price movement before net profitability"
        />
      </div>

      <CalculationActions
        title="Break-Even Price Evaluation"
        onReset={resetInputs}
      />
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

// ==========================================
// 15. APY / APR CALCULATOR VIEW
// ==========================================
export const ApyAprView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initialValues: ApyAprInput = {
    conversionMode: 'apr-to-apy',
    ratePercent: 12.0,
    compoundingFrequency: 'daily',
    investmentAmount: 10000,
    investmentPeriodYears: 1,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<ApyAprInput>(initialValues, 'apy-apr');
  const result = calculateApyApr(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      {/* Mode Switch */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Conversion Direction
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, conversionMode: 'apr-to-apy' })}
            className={`py-2 px-3 text-xs rounded-xl font-bold border transition-colors ${
              inputs.conversionMode === 'apr-to-apy'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            APR → APY (Nominal to Effective)
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, conversionMode: 'apy-to-apr' })}
            className={`py-2 px-3 text-xs rounded-xl font-bold border transition-colors ${
              inputs.conversionMode === 'apy-to-apr'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            APY → APR (Effective to Nominal)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {inputs.conversionMode === 'apr-to-apy' ? 'APR Rate (%)' : 'APY Rate (%)'}
          </label>
          <input
            type="number"
            min="0"
            max="1000"
            step="0.1"
            value={inputs.ratePercent ?? 12.0}
            onChange={(e) => setInputs({ ...inputs, ratePercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="12.0"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Compounding Frequency (n)
          </label>
          <select
            value={inputs.compoundingFrequency}
            onChange={(e) => setInputs({ ...inputs, compoundingFrequency: e.target.value as CompoundingInterval })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
          >
            <option value="daily">Daily (365x / DeFi / Crypto)</option>
            <option value="weekly">Weekly (52x)</option>
            <option value="monthly">Monthly (12x)</option>
            <option value="quarterly">Quarterly (4x)</option>
            <option value="semi-annually">Semi-Annually (2x)</option>
            <option value="annually">Annually (1x)</option>
            <option value="continuously">Continuously (e^r)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Investment Amount ($ Optional)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.investmentAmount || ''}
            onChange={(e) => setInputs({ ...inputs, investmentAmount: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="10000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Period (Years)
          </label>
          <input
            type="number"
            min="0.1"
            max="50"
            step="0.5"
            value={inputs.investmentPeriodYears || ''}
            onChange={(e) => setInputs({ ...inputs, investmentPeriodYears: parseFloat(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="1"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title={inputs.conversionMode === 'apr-to-apy' ? 'Effective Yield (APY)' : 'Nominal Rate (APR)'}
          value={formatPercentage(result.convertedRatePercent, 3)}
          isHighlight={true}
          subtitle={`Converted with ${inputs.compoundingFrequency} compounding`}
        />
        <ResultCard
          title="Compounding Boost (Spread)"
          value={`+${formatPercentage(result.effectiveYieldBoost, 3)}`}
          status="positive"
          subtitle="Additional annual yield earned through compounding"
        />
        <ResultCard
          title="Ending Balance"
          value={formatCurrency(result.endingBalance, currency)}
          subtitle={`From ${formatCurrency(inputs.investmentAmount || 0, currency)} principal`}
        />
        <ResultCard
          title="Total Interest Earned"
          value={formatCurrency(result.totalInterestEarned, currency)}
          status="positive"
          subtitle={`Over ${inputs.investmentPeriodYears} year(s)`}
        />
      </div>

      {/* Comparison Frequency Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 font-semibold text-xs text-slate-800 dark:text-slate-200">
          Compounding Frequency Yield Comparison
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-2 px-3">Frequency</th>
                <th className="py-2 px-3">Compounding Periods</th>
                <th className="py-2 px-3">Resulting APY</th>
                <th className="py-2 px-3">Annual Interest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {result.comparisonTable.map((row) => (
                <tr key={row.frequencyName} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100">{row.frequencyName}</td>
                  <td className="py-2 px-3 text-slate-500">{row.periodsPerYear}</td>
                  <td className="py-2 px-3 text-indigo-600 dark:text-indigo-400 font-bold">{formatPercentage(row.apy, 3)}</td>
                  <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">+{formatCurrency(row.annualInterestEarned, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CalculationActions
        title="APY/APR Conversion Summary"
        onReset={resetInputs}
      />
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
