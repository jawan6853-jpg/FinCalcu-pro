import React from 'react';
import { ToolItem } from '../../types';
import { CalculatorLayout } from '../common/CalculatorLayout';
import { ResultCard, CalculationActions } from '../common/ResultCard';
import { DonutChart, AreaGrowthChart } from '../common/SimpleChart';
import { formatCurrency, formatPercentage } from '../../lib/formatters';
import { useUrlParamsState } from '../../lib/useUrlParamsState';
import { useCurrency } from '../../context/CurrencyContext';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

import { calculateRetirementWithdrawal, RetirementWithdrawalInput } from '../../lib/calculators/retirementWithdrawal';
import { calculateSafeWithdrawalRate, SafeWithdrawalRateInput } from '../../lib/calculators/safeWithdrawalRate';
import { calculateAnnuity, AnnuityInput, AnnuityFrequency, AnnuityTiming } from '../../lib/calculators/annuity';
import { calculateBondPrice, BondPriceInput, BondFrequency } from '../../lib/calculators/bondPrice';
import { calculateYieldToMaturity, YieldToMaturityInput } from '../../lib/calculators/yieldToMaturity';

export interface CalculatorViewProps {
  tool: ToolItem;
  onNavigate: (route: string) => void;
}

// 6. RETIREMENT WITHDRAWAL VIEW
export const RetirementWithdrawalView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: RetirementWithdrawalInput = {
    portfolioBalance: 1200000,
    withdrawalRate: 4.0,
    investmentReturn: 6.0,
    retirementPeriodYears: 30,
    inflationRate: 2.5,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<RetirementWithdrawalInput>(initial, 'ret-draw');
  const result = calculateRetirementWithdrawal(inputs);

  const chartData = result.yearlySchedule.map((s) => ({
    label: `Yr ${s.year}`,
    invested: s.withdrawal,
    total: s.endBalance,
  }));

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Starting Retirement Portfolio (${currencySymbol})
        </label>
        <input
          type="number"
          min="1000"
          value={inputs.portfolioBalance ?? ''}
          onChange={(e) => setInputs({ ...inputs, portfolioBalance: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Initial Withdrawal Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0.5"
            max="15"
            value={inputs.withdrawalRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, withdrawalRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Investment Return (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="20"
            value={inputs.investmentReturn ?? ''}
            onChange={(e) => setInputs({ ...inputs, investmentReturn: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Retirement Horizon (Years)
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={inputs.retirementPeriodYears ?? ''}
            onChange={(e) => setInputs({ ...inputs, retirementPeriodYears: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Annual Inflation Adjustment (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={inputs.inflationRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, inflationRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Initial Annual Withdrawal"
        value={formatCurrency(result.initialAnnualWithdrawal, currency)}
        isHighlight={true}
        status="positive"
        badge={`Monthly: ${formatCurrency(result.initialMonthlyWithdrawal, currency)}`}
      />

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Ending Portfolio Value"
          value={formatCurrency(result.endingPortfolioBalance, currency)}
          subtitle={`After ${inputs.retirementPeriodYears} years`}
          status={result.portfolioDepleted ? 'negative' : 'neutral'}
        />
        <ResultCard
          title="Total Lifetime Withdrawn"
          value={formatCurrency(result.totalWithdrawn, currency)}
          subtitle="Cumulative cash received"
        />
      </div>

      <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
        result.portfolioDepleted
          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
          : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
      }`}>
        {result.portfolioDepleted ? <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
        <span>{result.summaryMessage}</span>
      </div>

      {chartData.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Portfolio Longevity Curve
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

// 7. SAFE WITHDRAWAL RATE VIEW
export const SafeWithdrawalRateView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: SafeWithdrawalRateInput = {
    portfolioValue: 1500000,
    withdrawalRate: 4.0,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<SafeWithdrawalRateInput>(initial, 'swr');
  const result = calculateSafeWithdrawalRate(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Investable Nest Egg (${currencySymbol})
        </label>
        <input
          type="number"
          min="1000"
          value={inputs.portfolioValue ?? ''}
          onChange={(e) => setInputs({ ...inputs, portfolioValue: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Withdrawal Rate (% of Initial Portfolio)
        </label>
        <input
          type="number"
          step="0.1"
          min="1.0"
          max="12.0"
          value={inputs.withdrawalRate ?? ''}
          onChange={(e) => setInputs({ ...inputs, withdrawalRate: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
          <span>3.0% (Ultra Safe)</span>
          <span>4.0% (Standard Bengen Rule)</span>
          <span>5.0% (Aggressive)</span>
        </div>
      </div>

      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <span>Notice: "Safe" is an empirical estimate based on historical 30-year sequences. Volatile market environments require dynamic spending flexibility.</span>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Annual Safe Withdrawal"
        value={formatCurrency(result.annualWithdrawal, currency)}
        isHighlight={true}
        status="positive"
        badge={`${inputs.withdrawalRate}% SWR`}
      />

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Monthly Income"
          value={formatCurrency(result.monthlyWithdrawal, currency)}
          subtitle="Monthly cash draw"
        />
        <ResultCard
          title="Weekly Income"
          value={formatCurrency(result.weeklyWithdrawal, currency)}
          subtitle="Weekly budget"
        />
      </div>

      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Trinity Study Benchmark Comparison
        </h4>
        <div className="space-y-2.5">
          {result.tierComparisons.map((t) => (
            <div
              key={t.tierName}
              className={`p-2.5 rounded-lg border text-xs transition-colors ${
                Math.abs(t.ratePercentage - inputs.withdrawalRate) < 0.05
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {t.ratePercentage}% - {t.tierName}
                </span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(t.annualWithdrawal, currency)}/yr
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:justify-between gap-1 mt-1">
                <span className="font-medium">Est. Monthly: {formatCurrency(t.monthlyWithdrawal, currency)}</span>
                <span className="text-slate-500 dark:text-slate-400">{t.planningContext}</span>
              </div>
            </div>
          ))}
        </div>
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

// 8. ANNUITY VIEW
export const AnnuityView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: AnnuityInput = {
    mode: 'futureValue',
    paymentAmount: 600,
    interestRate: 6.5,
    years: 20,
    frequency: 'monthly',
    timing: 'end',
    targetAmount: 250000,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<AnnuityInput>(initial, 'ann');
  const result = calculateAnnuity(inputs);

  const chartSlices = [
    { label: 'Total Contributions', value: result.totalPaymentsMade, color: '#6366f1' },
    { label: 'Compounded Interest', value: result.totalInterestEarnedOrDiscounted, color: '#10b981' },
  ].filter((d) => d.value > 0);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Calculation Target
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, mode: 'futureValue' })}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              inputs.mode === 'futureValue'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Future Value
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, mode: 'presentValue' })}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              inputs.mode === 'presentValue'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Present Value
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, mode: 'periodicPayment' })}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              inputs.mode === 'periodicPayment'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Solve PMT
          </button>
        </div>
      </div>

      {inputs.mode === 'periodicPayment' ? (
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Target Future Goal (${currencySymbol})
          </label>
          <input
            type="number"
            min="100"
            value={inputs.targetAmount ?? ''}
            onChange={(e) => setInputs({ ...inputs, targetAmount: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      ) : (
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Regular Periodic Payment (${currencySymbol})
          </label>
          <input
            type="number"
            min="1"
            value={inputs.paymentAmount ?? ''}
            onChange={(e) => setInputs({ ...inputs, paymentAmount: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={inputs.interestRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, interestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Term (Years)
          </label>
          <input
            type="number"
            step="0.5"
            min="0.5"
            value={inputs.years ?? ''}
            onChange={(e) => setInputs({ ...inputs, years: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Payment Frequency
          </label>
          <select
            value={inputs.frequency}
            onChange={(e) => setInputs({ ...inputs, frequency: e.target.value as AnnuityFrequency })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
          >
            <option value="monthly">Monthly (12/yr)</option>
            <option value="quarterly">Quarterly (4/yr)</option>
            <option value="semi-annually">Semi-Annually (2/yr)</option>
            <option value="annually">Annually (1/yr)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Annuity Timing
          </label>
          <select
            value={inputs.timing}
            onChange={(e) => setInputs({ ...inputs, timing: e.target.value as AnnuityTiming })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
          >
            <option value="end">Ordinary Annuity (End of Period)</option>
            <option value="beginning">Annuity Due (Start of Period)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      {inputs.mode === 'futureValue' ? (
        <ResultCard
          title="Future Value (FV)"
          value={formatCurrency(result.futureValue, currency)}
          isHighlight={true}
          status="positive"
          badge={`${result.numberOfPeriods} Periods`}
        />
      ) : inputs.mode === 'presentValue' ? (
        <ResultCard
          title="Present Value (PV)"
          value={formatCurrency(result.presentValue, currency)}
          isHighlight={true}
          status="neutral"
          badge="Lump-sum Equivalent"
        />
      ) : (
        <ResultCard
          title="Required Periodic Payment"
          value={formatCurrency(result.periodicPayment, currency)}
          isHighlight={true}
          status="positive"
          badge={`Per ${inputs.frequency}`}
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Total Cash Deposited"
          value={formatCurrency(result.totalPaymentsMade, currency)}
          subtitle={`${result.numberOfPeriods} payments`}
        />
        <ResultCard
          title="Total Interest Earned"
          value={formatCurrency(result.totalInterestEarnedOrDiscounted, currency)}
          subtitle="Compounded growth"
        />
      </div>

      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Principal vs Growth
        </h4>
        <DonutChart
          slices={chartSlices}
          centerLabel="Total"
          centerValue={formatCurrency(result.futureValue, currency)}
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

// 9. BOND PRICE VIEW
export const BondPriceView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: BondPriceInput = {
    faceValue: 1000,
    couponRate: 5.5,
    marketYield: 4.8,
    yearsToMaturity: 10,
    paymentFrequency: 'semi-annual',
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<BondPriceInput>(initial, 'bond-pr');
  const result = calculateBondPrice(inputs);

  const chartSlices = [
    { label: 'PV of Coupons', value: result.presentValueOfCoupons, color: '#3b82f6' },
    { label: 'PV of Par Face Value', value: result.presentValueOfFaceValue, color: '#10b981' },
  ];

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Par / Face Value (${currencySymbol})
          </label>
          <input
            type="number"
            min="100"
            value={inputs.faceValue ?? ''}
            onChange={(e) => setInputs({ ...inputs, faceValue: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Annual Coupon Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={inputs.couponRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, couponRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Market Yield / YTM (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={inputs.marketYield ?? ''}
            onChange={(e) => setInputs({ ...inputs, marketYield: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Years to Maturity
          </label>
          <input
            type="number"
            step="0.5"
            min="0.5"
            value={inputs.yearsToMaturity ?? ''}
            onChange={(e) => setInputs({ ...inputs, yearsToMaturity: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Coupon Payment Frequency
        </label>
        <select
          value={inputs.paymentFrequency}
          onChange={(e) => setInputs({ ...inputs, paymentFrequency: e.target.value as BondFrequency })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
        >
          <option value="annual">Annual (1 payment/yr)</option>
          <option value="semi-annual">Semi-Annual (2 payments/yr - Standard US Treasury)</option>
          <option value="quarterly">Quarterly (4 payments/yr)</option>
        </select>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Estimated Clean Bond Price"
        value={formatCurrency(result.estimatedPrice, currency)}
        isHighlight={true}
        status={result.estimatedPrice >= result.faceValue ? 'positive' : 'neutral'}
        badge={result.tradingStatus}
      />

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Price as % of Par"
          value={formatPercentage(result.percentageOfPar)}
          subtitle={result.percentageOfPar > 100 ? 'Above Face Value' : 'Discount to Face Value'}
        />
        <ResultCard
          title="Annual Coupon Cash Flow"
          value={formatCurrency(result.annualCouponIncome, currency)}
          subtitle={`${formatCurrency(result.periodicCouponPayment, currency)} / period`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="PV of Coupons"
          value={formatCurrency(result.presentValueOfCoupons, currency)}
          subtitle="Discounted cash flows"
        />
        <ResultCard
          title="PV of Principal Par"
          value={formatCurrency(result.presentValueOfFaceValue, currency)}
          subtitle="Lump-sum redemption PV"
        />
      </div>

      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Present Value Components
        </h4>
        <DonutChart
          slices={chartSlices}
          centerLabel="Price"
          centerValue={formatCurrency(result.estimatedPrice, currency)}
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

// 10. YIELD TO MATURITY VIEW
export const YieldToMaturityView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: YieldToMaturityInput = {
    bondPrice: 960,
    faceValue: 1000,
    couponRate: 5.0,
    yearsToMaturity: 8,
    paymentFrequency: 'semi-annual',
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<YieldToMaturityInput>(initial, 'ytm');
  const result = calculateYieldToMaturity(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Current Bond Price (${currencySymbol})
          </label>
          <input
            type="number"
            min="1"
            value={inputs.bondPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, bondPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Par / Face Value (${currencySymbol})
          </label>
          <input
            type="number"
            min="1"
            value={inputs.faceValue ?? ''}
            onChange={(e) => setInputs({ ...inputs, faceValue: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Coupon Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={inputs.couponRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, couponRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Years to Maturity
          </label>
          <input
            type="number"
            step="0.5"
            min="0.1"
            value={inputs.yearsToMaturity ?? ''}
            onChange={(e) => setInputs({ ...inputs, yearsToMaturity: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Coupon Payment Schedule
        </label>
        <select
          value={inputs.paymentFrequency}
          onChange={(e) => setInputs({ ...inputs, paymentFrequency: e.target.value as 'annual' | 'semi-annual' })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
        >
          <option value="semi-annual">Semi-Annual (2 coupons per year)</option>
          <option value="annual">Annual (1 coupon per year)</option>
        </select>
      </div>

      <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400">
        <span className="font-semibold text-slate-800 dark:text-slate-200">Methodology: </span>
        {result.approximationMethod} ({result.iterationsUsed} iterations converged).
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Yield to Maturity (YTM)"
        value={formatPercentage(result.estimatedYtmPercentage)}
        isHighlight={true}
        status="positive"
        badge={`Trading at ${result.tradingStatus}`}
      />

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Current Yield"
          value={formatPercentage(result.currentYieldPercentage)}
          subtitle="Annual Coupon / Price"
        />
        <ResultCard
          title="Capital Gain at Par"
          value={formatCurrency(result.capitalGainOrLossAtMaturity, currency)}
          subtitle={`Par $${inputs.faceValue} redemption`}
          status={result.capitalGainOrLossAtMaturity >= 0 ? 'positive' : 'negative'}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Annual Coupon Income"
          value={formatCurrency(result.annualCouponPayment, currency)}
          subtitle="Fixed periodic cash flow"
        />
        <ResultCard
          title="Lifetime Total Cash Flow"
          value={formatCurrency(result.totalLifetimeCashFlow, currency)}
          subtitle="Coupons + Par redemption"
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
