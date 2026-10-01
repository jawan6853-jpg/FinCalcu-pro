import React, { useState } from 'react';
import { ToolItem } from '../../types';
import { CalculatorLayout } from '../common/CalculatorLayout';
import { ResultCard, CalculationActions } from '../common/ResultCard';
import { AreaGrowthChart, DonutChart } from '../common/SimpleChart';
import { formatCurrency, formatNumber, formatPercentage } from '../../lib/formatters';
import { useUrlParamsState } from '../../lib/useUrlParamsState';
import { useCurrency } from '../../context/CurrencyContext';

import { calculateFutureValue, FutureValueInput, CompoundingFrequency } from '../../lib/calculators/futureValue';
import { calculatePresentValue, PresentValueInput } from '../../lib/calculators/presentValue';
import { calculateRoi, RoiCalculatorInput } from '../../lib/calculators/roiCalculator';
import { calculateNpv, NpvInput } from '../../lib/calculators/npv';
import { calculateIrr, IrrInput } from '../../lib/calculators/irr';
import { calculateMarginOfSafety, MarginOfSafetyInput, MarginOfSafetyMode } from '../../lib/calculators/marginOfSafety';

export interface CalculatorViewProps {
  tool: ToolItem;
  onNavigate: (route: string) => void;
}

// 1. FUTURE VALUE VIEW
export const FutureValueView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: FutureValueInput = {
    presentValue: 10000,
    annualInterestRate: 8,
    years: 10,
    periodicDeposit: 250,
    depositFrequency: 'monthly',
    compoundingFrequency: 'monthly',
    depositTiming: 'end',
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<FutureValueInput>(initial, 'fv');
  const result = calculateFutureValue(inputs);

  const presets = [
    { label: 'Retirement $500/mo @ 8%', pv: 5000, r: 8, yr: 20, pmt: 500 },
    { label: 'College Fund $200/mo @ 7%', pv: 2000, r: 7, yr: 15, pmt: 200 },
    { label: 'High-Yield Savings 4.5%', pv: 25000, r: 4.5, yr: 5, pmt: 0 },
  ];

  const inputsComponent = (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
        <span className="text-[11px] font-semibold text-slate-500 self-center">Presets:</span>
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setInputs({ ...inputs, presentValue: p.pv, annualInterestRate: p.r, years: p.yr, periodicDeposit: p.pmt })}
            className="px-2 py-0.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-indigo-400"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Initial Principal (PV)</label>
          <input
            type="number"
            min="0"
            value={inputs.presentValue ?? ''}
            onChange={(e) => setInputs({ ...inputs, presentValue: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="10000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Annual Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={inputs.annualInterestRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, annualInterestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="8"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Time Horizon (Years)</label>
          <input
            type="number"
            min="1"
            max="60"
            value={inputs.years ?? ''}
            onChange={(e) => setInputs({ ...inputs, years: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="10"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Monthly Deposit (PMT)</label>
          <input
            type="number"
            min="0"
            value={inputs.periodicDeposit ?? ''}
            onChange={(e) => setInputs({ ...inputs, periodicDeposit: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="250"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Compounding Frequency</label>
        <select
          value={inputs.compoundingFrequency || 'monthly'}
          onChange={(e) => setInputs({ ...inputs, compoundingFrequency: e.target.value as CompoundingFrequency })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
        >
          <option value="annually">Annually (1x/yr)</option>
          <option value="semi-annually">Semi-Annually (2x/yr)</option>
          <option value="quarterly">Quarterly (4x/yr)</option>
          <option value="monthly">Monthly (12x/yr)</option>
          <option value="daily">Daily (365x/yr)</option>
        </select>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Estimated Future Value (FV)"
          value={formatCurrency(result.futureValue, currency)}
          isHighlight={true}
          status="positive"
          subtitle={`After ${inputs.years} years of compounding`}
        />
        <ResultCard
          title="Total Interest Earned"
          value={formatCurrency(result.totalInterestEarned, currency)}
          status="positive"
          subtitle={`Compounding earnings on capital`}
        />
        <ResultCard
          title="Total Principal Contributed"
          value={formatCurrency(result.totalPrincipalInvested, currency)}
          subtitle="Initial sum + all scheduled deposits"
        />
        <ResultCard
          title="Wealth Multiplier"
          value={`${result.growthMultiple}x`}
          subtitle={`Effective Annual Rate: ${result.effectiveAnnualRate}%`}
        />
      </div>
      <CalculationActions title="Future Value Calculation" onReset={resetInputs} />
    </div>
  );

  const chart = result.yearlyBreakdown.length > 1 ? (
    <AreaGrowthChart
      data={result.yearlyBreakdown.map((b) => ({
        label: `Yr ${b.year}`,
        invested: b.deposits + (b.year === 1 ? inputs.presentValue : 0),
        total: b.endingBalance,
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

// 2. PRESENT VALUE VIEW
export const PresentValueView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: PresentValueInput = {
    futureValue: 100000,
    discountRate: 6.5,
    years: 10,
    periodicCashFlow: 0,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<PresentValueInput>(initial, 'pv');
  const result = calculatePresentValue(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Target Future Value (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.futureValue ?? ''}
            onChange={(e) => setInputs({ ...inputs, futureValue: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="100000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Discount Rate / Return (%)</label>
          <input
            type="number"
            step="0.1"
            value={inputs.discountRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, discountRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="6.5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Years Until Payout</label>
          <input
            type="number"
            min="1"
            value={inputs.years ?? ''}
            onChange={(e) => setInputs({ ...inputs, years: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="10"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Annual Cash Flow / Annuity (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.periodicCashFlow ?? ''}
            onChange={(e) => setInputs({ ...inputs, periodicCashFlow: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Required Present Value (PV)"
          value={formatCurrency(result.presentValue, currency)}
          isHighlight={true}
          status="positive"
          subtitle="Lump sum needed today at discount rate"
        />
        <ResultCard
          title="Total Discount / Imputed Interest"
          value={formatCurrency(result.totalDiscount, currency)}
          subtitle="Value saved through time-value of money"
        />
        <ResultCard
          title="Discount Factor"
          value={`${(result.discountFactor * 100).toFixed(2)}%`}
          subtitle="Present purchasing power per future dollar"
        />
        <ResultCard
          title="Future Target Sum"
          value={formatCurrency(result.futureValue, currency)}
          subtitle={`In ${inputs.years} years at ${inputs.discountRate}% discount`}
        />
      </div>
      <CalculationActions title="Present Value Calculation" onReset={resetInputs} />
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

// 3. ROI CALCULATOR VIEW
export const RoiCalculatorView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: RoiCalculatorInput = {
    initialInvestment: 15000,
    finalValue: 24500,
    investmentPeriodYears: 3,
    additionalCosts: 250,
    additionalDividendsOrIncome: 600,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<RoiCalculatorInput>(initial, 'roi');
  const result = calculateRoi(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Initial Capital Invested (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.initialInvestment ?? ''}
            onChange={(e) => setInputs({ ...inputs, initialInvestment: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="15000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Final Portfolio Value (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.finalValue ?? ''}
            onChange={(e) => setInputs({ ...inputs, finalValue: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="24500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Holding Period (Years)</label>
          <input
            type="number"
            step="0.5"
            min="0.1"
            value={inputs.investmentPeriodYears ?? ''}
            onChange={(e) => setInputs({ ...inputs, investmentPeriodYears: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="3"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Dividends / Income Received (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.additionalDividendsOrIncome ?? ''}
            onChange={(e) => setInputs({ ...inputs, additionalDividendsOrIncome: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="600"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Return on Investment (ROI)"
          value={formatPercentage(result.roiPercentage)}
          isHighlight={true}
          status={result.isProfitable ? 'positive' : 'negative'}
          subtitle={`Total net percentage gain`}
        />
        <ResultCard
          title="Net Profit / Gain"
          value={formatCurrency(result.netProfit, currency)}
          status={result.isProfitable ? 'positive' : 'negative'}
          subtitle={`After costs & including income`}
        />
        <ResultCard
          title="Capital Multiplier"
          value={`${result.capitalMultiplier}x`}
          subtitle="Ratio of final proceeds to capital outlay"
        />
        <ResultCard
          title="Annualized ROI (CAGR)"
          value={result.annualizedRoiPercentage !== undefined ? formatPercentage(result.annualizedRoiPercentage) : 'N/A'}
          status={result.isProfitable ? 'positive' : 'negative'}
          subtitle={inputs.investmentPeriodYears ? `Compounded per year over ${inputs.investmentPeriodYears} yrs` : 'Enter years to annualize'}
        />
      </div>
      <CalculationActions title="ROI Calculation" onReset={resetInputs} />
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

// 4. NPV CALCULATOR VIEW
export const NpvView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: NpvInput = {
    initialInvestment: 50000,
    discountRate: 10,
    cashFlows: [15000, 18000, 20000, 22000, 25000],
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<NpvInput>(initial, 'npv');
  const result = calculateNpv(inputs);

  const updateCashFlow = (idx: number, val: number) => {
    const updated = [...inputs.cashFlows];
    updated[idx] = val;
    setInputs({ ...inputs, cashFlows: updated });
  };

  const addYear = () => {
    if (inputs.cashFlows.length < 10) {
      setInputs({ ...inputs, cashFlows: [...inputs.cashFlows, 10000] });
    }
  };

  const removeYear = () => {
    if (inputs.cashFlows.length > 1) {
      setInputs({ ...inputs, cashFlows: inputs.cashFlows.slice(0, -1) });
    }
  };

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Initial Investment / Outlay (${currencySymbol})</label>
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
          <label className="block text-xs font-semibold mb-1">Discount Rate / Cost of Capital (%)</label>
          <input
            type="number"
            step="0.5"
            value={inputs.discountRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, discountRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="10"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold">Annual Projected Inflows (${currencySymbol})</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addYear}
              disabled={inputs.cashFlows.length >= 10}
              className="text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold"
            >
              + Add Year
            </button>
            <button
              type="button"
              onClick={removeYear}
              disabled={inputs.cashFlows.length <= 1}
              className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold"
            >
              - Remove
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {inputs.cashFlows.map((flow, i) => (
            <div key={i}>
              <span className="text-[11px] text-slate-500 block mb-0.5">Yr {i + 1}</span>
              <input
                type="number"
                value={flow ?? ''}
                onChange={(e) => updateCashFlow(i, parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Net Present Value (NPV)"
          value={formatCurrency(result.npv, currency)}
          isHighlight={true}
          status={result.isAcceptable ? 'positive' : 'negative'}
          subtitle={result.isAcceptable ? 'Project creates value (Accept)' : 'Project destroys value (Reject)'}
        />
        <ResultCard
          title="Present Value of Inflows"
          value={formatCurrency(result.presentValueInflows, currency)}
          subtitle={`Discounted at ${inputs.discountRate}%`}
        />
        <ResultCard
          title="Profitability Index (PI)"
          value={`${result.profitabilityIndex.toFixed(2)}x`}
          subtitle={result.profitabilityIndex >= 1 ? 'PI ≥ 1.0 (Value Accretive)' : 'PI < 1.0 (Sub-hurdle)'}
        />
        <ResultCard
          title="Net Nominal Cash Return"
          value={formatCurrency(result.netProfit, currency)}
          subtitle="Undiscounted total inflow minus initial outlay"
        />
      </div>
      <CalculationActions title="NPV Calculation" onReset={resetInputs} />
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

// 5. IRR CALCULATOR VIEW
export const IrrView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: IrrInput = {
    initialInvestment: 100000,
    cashFlows: [28000, 34000, 38000, 42000, 45000],
    hurdleRate: 10,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<IrrInput>(initial, 'irr');
  const result = calculateIrr(inputs);

  const updateFlow = (idx: number, val: number) => {
    const updated = [...inputs.cashFlows];
    updated[idx] = val;
    setInputs({ ...inputs, cashFlows: updated });
  };

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Initial Cash Outlay (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.initialInvestment ?? ''}
            onChange={(e) => setInputs({ ...inputs, initialInvestment: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="100000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Hurdle / Benchmark Rate (%)</label>
          <input
            type="number"
            step="0.5"
            value={inputs.hurdleRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, hurdleRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="10"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-2">Annual Cash Inflows (${currencySymbol})</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {inputs.cashFlows.map((flow, idx) => (
            <div key={idx}>
              <span className="text-[11px] text-slate-500 block mb-0.5">Year {idx + 1}</span>
              <input
                type="number"
                value={flow ?? ''}
                onChange={(e) => updateFlow(idx, parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Internal Rate of Return (IRR)"
          value={result.irrPercentage !== null ? formatPercentage(result.irrPercentage) : 'N/A'}
          isHighlight={true}
          status={result.beatsHurdleRate ? 'positive' : 'neutral'}
          subtitle={result.statusMessage}
        />
        <ResultCard
          title="Undiscounted Net Profit"
          value={formatCurrency(result.netProfit, currency)}
          status={result.netProfit >= 0 ? 'positive' : 'negative'}
          subtitle={`Total inflows: ${formatCurrency(result.totalInflows, currency)}`}
        />
        <ResultCard
          title="Capital Multiplier"
          value={`${result.capitalMultiplier.toFixed(2)}x`}
          subtitle="Total cash inflows divided by initial outlay"
        />
        <ResultCard
          title="Target Hurdle Status"
          value={result.beatsHurdleRate ? 'Approved' : 'Sub-Hurdle'}
          status={result.beatsHurdleRate ? 'positive' : 'negative'}
          subtitle={`Hurdle rate target: ${inputs.hurdleRate}%`}
        />
      </div>
      <CalculationActions title="IRR Calculation" onReset={resetInputs} />
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

// 6. MARGIN OF SAFETY VIEW
export const MarginOfSafetyView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: MarginOfSafetyInput = {
    mode: 'investing',
    intrinsicValue: 120,
    marketPrice: 85,
    targetSafetyMarginPercent: 25,
    actualSales: 500000,
    breakEvenSales: 350000,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<MarginOfSafetyInput>(initial, 'mos');
  const result = calculateMarginOfSafety(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-3">
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, mode: 'investing' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            inputs.mode === 'investing'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Value Investing (Stock Price)
        </button>
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, mode: 'accounting' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            inputs.mode === 'accounting'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Corporate Sales (Break-Even)
        </button>
      </div>

      {inputs.mode === 'investing' ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Estimated Intrinsic Value (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              step="any"
              value={inputs.intrinsicValue ?? ''}
              onChange={(e) => setInputs({ ...inputs, intrinsicValue: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
              placeholder="120"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Current Market Price (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              step="any"
              value={inputs.marketPrice ?? ''}
              onChange={(e) => setInputs({ ...inputs, marketPrice: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
              placeholder="85"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Target Desired Margin (%)</label>
            <input
              type="number"
              min="0"
              max="90"
              value={inputs.targetSafetyMarginPercent ?? ''}
              onChange={(e) => setInputs({ ...inputs, targetSafetyMarginPercent: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
              placeholder="25"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Actual / Projected Sales (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={inputs.actualSales ?? ''}
              onChange={(e) => setInputs({ ...inputs, actualSales: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
              placeholder="500000"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Break-Even Sales Revenue (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={inputs.breakEvenSales ?? ''}
              onChange={(e) => setInputs({ ...inputs, breakEvenSales: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
              placeholder="350000"
            />
          </div>
        </div>
      )}
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Margin of Safety (%)"
          value={formatPercentage(result.marginOfSafetyPercent)}
          isHighlight={true}
          status={result.isSafe ? 'positive' : 'negative'}
          subtitle={result.summaryExplanation}
        />
        <ResultCard
          title="Margin of Safety (${currencySymbol})"
          value={formatCurrency(result.marginOfSafetyDollars, currency)}
          status={result.isSafe ? 'positive' : 'negative'}
          subtitle="Dollar cushion before zero profit"
        />
        {result.targetBuyPrice !== undefined && (
          <ResultCard
            title="Max Recommended Buy Price"
            value={formatCurrency(result.targetBuyPrice, currency)}
            subtitle={`At desired ${inputs.targetSafetyMarginPercent}% safety margin`}
          />
        )}
        <ResultCard
          title="Safety Evaluation"
          value={result.statusLevel.toUpperCase()}
          status={result.isSafe ? 'positive' : 'negative'}
          subtitle={result.formulaUsed}
        />
      </div>
      <CalculationActions title="Margin of Safety Calculation" onReset={resetInputs} />
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
