import React from 'react';
import { ToolItem } from '../../types';
import { CalculatorLayout } from '../common/CalculatorLayout';
import { ResultCard, CalculationActions } from '../common/ResultCard';
import { DonutChart, AreaGrowthChart } from '../common/SimpleChart';
import { formatCurrency, formatNumber, formatPercentage } from '../../lib/formatters';
import { useUrlParamsState } from '../../lib/useUrlParamsState';
import { useCurrency } from '../../context/CurrencyContext';

import { calculateSavingsInterest, SavingsInterestInput } from '../../lib/calculators/savingsInterest';
import { calculateSimpleInterest, SimpleInterestInput } from '../../lib/calculators/simpleInterest';
import { calculateBatch4CompoundInterest, Batch4CompoundInterestInput } from '../../lib/calculators/batch4CompoundInterest';
import { calculateRuleOf72, RuleOf72Input } from '../../lib/calculators/ruleOf72';

export interface CalculatorViewProps {
  tool: ToolItem;
  onNavigate: (route: string) => void;
}

// 1. SAVINGS INTEREST VIEW
export const SavingsInterestView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: SavingsInterestInput = {
    initialDeposit: 10000,
    monthlyDeposit: 300,
    annualInterestRate: 4.75,
    compoundingFrequency: 'monthly',
    periodYears: 5,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<SavingsInterestInput>(initial, 'savings-int');
  const result = calculateSavingsInterest(inputs);

  const chartData = [
    { label: 'Initial Deposit', value: result.initialDeposit, color: '#6366f1' },
    { label: 'Regular Deposits', value: result.totalRegularDeposits, color: '#06b6d4' },
    { label: 'Total Interest', value: result.totalInterestEarned, color: '#10b981' },
  ];

  const growthTimeline = result.yearlyBreakdown.map((y) => ({
    label: `Yr ${y.year}`,
    total: y.endingBalance,
    invested: y.startingBalance + y.depositsThisYear,
  }));

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Initial Deposit / Starting Balance (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          value={inputs.initialDeposit ?? ''}
          onChange={(e) => setInputs({ ...inputs, initialDeposit: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Monthly Regular Contribution (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          value={inputs.monthlyDeposit ?? ''}
          onChange={(e) => setInputs({ ...inputs, monthlyDeposit: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Annual Interest Rate / APY (%)
          </label>
          <input
            type="number"
            step="0.05"
            min="0"
            max="100"
            value={inputs.annualInterestRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, annualInterestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Savings Period (Years)
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={inputs.periodYears ?? ''}
            onChange={(e) => setInputs({ ...inputs, periodYears: parseInt(e.target.value, 10) || 1 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Compounding Frequency
        </label>
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {(['daily', 'monthly', 'quarterly', 'annually'] as const).map((freq) => (
            <button
              key={freq}
              type="button"
              onClick={() => setInputs({ ...inputs, compoundingFrequency: freq })}
              className={`py-1.5 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                inputs.compoundingFrequency === freq
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {freq}
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
          title="Final Savings Balance"
          value={formatCurrency(result.finalBalance, currency)}
          isHighlight={true}
          status="positive"
          subtitle={`After ${inputs.periodYears} years of compounding growth`}
        />
        <ResultCard
          title="Total Interest Earned"
          value={formatCurrency(result.totalInterestEarned, currency)}
          status="positive"
          subtitle={`${formatPercentage(result.interestToDepositRatioPercent)} return on principal`}
        />
        <ResultCard
          title="Total Deposited"
          value={formatCurrency(result.totalDeposited, currency)}
          subtitle={`Initial ${formatCurrency(result.initialDeposit, currency)} + Contributions`}
        />
        <ResultCard
          title="Effective APY"
          value={formatPercentage(result.effectiveApyPercent)}
          subtitle={`Compounded ${inputs.compoundingFrequency}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Balance Composition</h4>
          <DonutChart slices={chartData} />
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Growth Trajectory</h4>
          <p className="text-[11px] text-slate-500 mb-3">Balance accumulation over {inputs.periodYears} years</p>
          <AreaGrowthChart data={growthTimeline} />
        </div>
      </div>

      {result.yearlyBreakdown.length > 0 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Yearly Savings Schedule</h4>
          <div className="max-h-56 overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[10px] text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-1.5">Year</th>
                  <th className="py-1.5">Deposits</th>
                  <th className="py-1.5">Interest</th>
                  <th className="py-1.5 text-right">Ending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 font-mono text-[11px]">
                {result.yearlyBreakdown.map((row) => (
                  <tr key={row.year}>
                    <td className="py-1 text-slate-500 font-sans">Year {row.year}</td>
                    <td className="py-1">{formatCurrency(row.depositsThisYear, currency)}</td>
                    <td className="py-1 text-emerald-600 font-medium">+{formatCurrency(row.interestThisYear, currency)}</td>
                    <td className="py-1 text-right font-bold">{formatCurrency(row.endingBalance, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CalculationActions title="Savings Interest Calculation" onReset={resetInputs} />
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

// 2. SIMPLE INTEREST VIEW
export const SimpleInterestView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: SimpleInterestInput = {
    principal: 15000,
    annualRate: 6.5,
    time: 3,
    timeUnit: 'years',
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<SimpleInterestInput>(initial, 'simple-int');
  const result = calculateSimpleInterest(inputs);

  const chartData = [
    { label: 'Principal', value: result.principal, color: '#4f46e5' },
    { label: 'Simple Interest', value: result.totalInterest, color: '#10b981' },
  ];

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Principal Amount (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          value={inputs.principal ?? ''}
          onChange={(e) => setInputs({ ...inputs, principal: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Annual Interest Rate (%)
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          value={inputs.annualRate ?? ''}
          onChange={(e) => setInputs({ ...inputs, annualRate: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Time Duration
          </label>
          <input
            type="number"
            min="0.1"
            step="0.5"
            value={inputs.time ?? ''}
            onChange={(e) => setInputs({ ...inputs, time: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Duration Unit
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {(['years', 'months', 'days'] as const).map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => setInputs({ ...inputs, timeUnit: unit })}
                className={`py-1.5 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                  inputs.timeUnit === unit
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Simple Interest Formula:</span>
        <div className="font-mono mt-1 text-indigo-600 dark:text-indigo-400">
          Interest = {formatCurrency(inputs.principal, currency)} × {inputs.annualRate}% × {result.timeInYears.toFixed(2)} yrs
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Total Interest Earned"
          value={formatCurrency(result.totalInterest, currency)}
          isHighlight={true}
          status="positive"
          subtitle={`Interest accrued across ${inputs.time} ${inputs.timeUnit}`}
        />
        <ResultCard
          title="Final Amount (Maturity)"
          value={formatCurrency(result.finalAmount, currency)}
          status="positive"
          subtitle="Principal + Simple Interest"
        />
        <ResultCard
          title="Total Return %"
          value={formatPercentage(result.totalReturnPercent)}
          subtitle="Uncompounded growth yield"
        />
        <ResultCard
          title="Monthly Accrual"
          value={formatCurrency(result.monthlyInterest, currency)}
          subtitle={`${formatCurrency(result.dailyInterest, currency)} daily interest`}
        />
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Capital vs Interest Ratio</h4>
        <DonutChart slices={chartData} />
      </div>

      <CalculationActions title="Simple Interest Calculation" onReset={resetInputs} />
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

// 3. COMPOUND INTEREST VIEW (BATCH 4)
export const Batch4CompoundInterestView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: Batch4CompoundInterestInput = {
    principal: 20000,
    regularContribution: 500,
    contributionFrequency: 'monthly',
    annualInterestRate: 8,
    compoundingFrequency: 'monthly',
    years: 15,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<Batch4CompoundInterestInput>(initial, 'comp-int');
  const result = calculateBatch4CompoundInterest(inputs);

  const chartData = [
    { label: 'Initial Deposit', value: result.initialPrincipal, color: '#6366f1' },
    { label: 'Contributions', value: result.totalContributions, color: '#0ea5e9' },
    { label: 'Compound Interest', value: result.totalInterestEarned, color: '#10b981' },
  ];

  const growthTimeline = result.yearlySchedule.map((s) => ({
    label: `Yr ${s.year}`,
    total: s.endBalance,
    invested: s.principalContributed,
  }));

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Initial Principal (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.principal ?? ''}
            onChange={(e) => setInputs({ ...inputs, principal: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Regular Contribution (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.regularContribution ?? ''}
            onChange={(e) => setInputs({ ...inputs, regularContribution: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Contribution Frequency
          </label>
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {(['monthly', 'annually'] as const).map((freq) => (
              <button
                key={freq}
                type="button"
                onClick={() => setInputs({ ...inputs, contributionFrequency: freq })}
                className={`py-1.5 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                  inputs.contributionFrequency === freq
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Annual Return Rate (%)
          </label>
          <input
            type="number"
            step="0.25"
            min="0"
            value={inputs.annualInterestRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, annualInterestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Investment Horizon (Years)
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={inputs.years ?? ''}
            onChange={(e) => setInputs({ ...inputs, years: parseInt(e.target.value, 10) || 1 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Compounding
          </label>
          <select
            value={inputs.compoundingFrequency}
            onChange={(e) => setInputs({ ...inputs, compoundingFrequency: e.target.value as any })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-sans focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="daily">Daily (365 times/yr)</option>
            <option value="monthly">Monthly (12 times/yr)</option>
            <option value="quarterly">Quarterly (4 times/yr)</option>
            <option value="annually">Annually (1 time/yr)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Final Balance"
          value={formatCurrency(result.finalBalance, currency)}
          isHighlight={true}
          status="positive"
          subtitle={`Multiplied by ${result.growthMultiplier.toFixed(2)}x total capital`}
        />
        <ResultCard
          title="Total Interest Earned"
          value={formatCurrency(result.totalInterestEarned, currency)}
          status="positive"
          subtitle={`${result.interestSharePercent.toFixed(1)}% of ending portfolio is interest`}
        />
        <ResultCard
          title="Total Contributions"
          value={formatCurrency(result.totalContributions, currency)}
          subtitle={`${inputs.contributionFrequency} deposits added`}
        />
        <ResultCard
          title="Initial Principal"
          value={formatCurrency(result.initialPrincipal, currency)}
          subtitle={`Starting deposit base`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Portfolio Breakdown</h4>
          <DonutChart slices={chartData} />
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Compounding Projection</h4>
          <p className="text-[11px] text-slate-500 mb-3">Total Balance vs Principal Invested</p>
          <AreaGrowthChart data={growthTimeline} />
        </div>
      </div>

      <CalculationActions title="Compound Interest Calculation" onReset={resetInputs} />
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

// 4. RULE OF 72 VIEW
export const RuleOf72View: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: RuleOf72Input = {
    mode: 'solve-years',
    interestRate: 8,
    targetYears: 9,
    startingAmount: 25000,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<RuleOf72Input>(initial, 'rule72');
  const result = calculateRuleOf72(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Calculation Mode
        </label>
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, mode: 'solve-years' })}
            className={`py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              inputs.mode === 'solve-years'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Find Doubling Time
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, mode: 'solve-rate' })}
            className={`py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              inputs.mode === 'solve-rate'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Find Required Rate
          </button>
        </div>
      </div>

      {inputs.mode === 'solve-years' ? (
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Expected Annual Return Rate (%)
          </label>
          <input
            type="number"
            step="0.25"
            min="0.1"
            max="100"
            value={inputs.interestRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, interestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      ) : (
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Target Doubling Horizon (Years)
          </label>
          <input
            type="number"
            step="0.5"
            min="0.5"
            max="50"
            value={inputs.targetYears ?? ''}
            onChange={(e) => setInputs({ ...inputs, targetYears: parseFloat(e.target.value) || 1 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Starting Investment Capital (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          value={inputs.startingAmount ?? ''}
          onChange={(e) => setInputs({ ...inputs, startingAmount: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-700 dark:text-indigo-300">
        <span className="font-bold">Mental Shortcut Formula:</span>
        <div className="font-mono mt-0.5">
          {inputs.mode === 'solve-years'
            ? `Years ≈ 72 / ${inputs.interestRate}% = ${result.doublingYearsRule72.toFixed(1)} Years`
            : `Rate ≈ 72 / ${inputs.targetYears} yrs = ${result.interestRate.toFixed(2)}%`}
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {inputs.mode === 'solve-years' ? (
          <ResultCard
            title="Estimated Doubling Time"
            value={`${result.doublingYearsRule72.toFixed(1)} Years`}
            isHighlight={true}
            status="positive"
            subtitle={`${result.doublingMonthsRule72} months (Exact logarithmic: ${result.doublingYearsExact.toFixed(2)} yrs)`}
          />
        ) : (
          <ResultCard
            title="Required Annual Rate"
            value={formatPercentage(result.interestRate)}
            isHighlight={true}
            status="positive"
            subtitle={`Exact rate: ${result.exactRateRequired ? formatPercentage(result.exactRateRequired) : ''}`}
          />
        )}
        <ResultCard
          title="Projected Doubled Capital"
          value={formatCurrency(result.doubledAmount, currency)}
          status="positive"
          subtitle={`Grows from ${formatCurrency(result.startingAmount, currency)}`}
        />
        <ResultCard
          title="Time to Triple (3x)"
          value={`${result.tripledYearsRule114.toFixed(1)} Years`}
          subtitle="Rule of 114 approximation"
        />
        <ResultCard
          title="Time to Quadruple (4x)"
          value={`${result.quadrupledYearsRule144.toFixed(1)} Years`}
          subtitle="Rule of 144 (two full doublings)"
        />
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Compound Doubling Milestones</h4>
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Doubled (2x)</span>
            <div className="text-sm font-bold font-mono text-indigo-600 mt-1">{formatCurrency(result.doubledAmount, currency)}</div>
            <span className="text-[10px] text-slate-400">~{result.doublingYearsRule72.toFixed(1)} yrs</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Tripled (3x)</span>
            <div className="text-sm font-bold font-mono text-cyan-600 mt-1">{formatCurrency(result.startingAmount * 3, currency)}</div>
            <span className="text-[10px] text-slate-400">~{result.tripledYearsRule114.toFixed(1)} yrs</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Quadrupled (4x)</span>
            <div className="text-sm font-bold font-mono text-emerald-600 mt-1">{formatCurrency(result.startingAmount * 4, currency)}</div>
            <span className="text-[10px] text-slate-400">~{result.quadrupledYearsRule144.toFixed(1)} yrs</span>
          </div>
        </div>
      </div>

      <CalculationActions title="Rule of 72 Calculation" onReset={resetInputs} />
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
