import React, { useState } from 'react';
import { ToolItem } from '../../types';
import { CalculatorLayout } from '../common/CalculatorLayout';
import { ResultCard, CalculationActions } from '../common/ResultCard';
import { DonutChart } from '../common/SimpleChart';
import { formatCurrency, formatNumber, formatPercentage } from '../../lib/formatters';
import { useUrlParamsState } from '../../lib/useUrlParamsState';
import { useCurrency } from '../../context/CurrencyContext';

import { calculateCarLoan, CarLoanInput } from '../../lib/calculators/carLoan';
import { calculatePersonalLoan, PersonalLoanInput } from '../../lib/calculators/personalLoan';
import { calculateMortgageAffordability, MortgageAffordabilityInput } from '../../lib/calculators/mortgageAffordability';
import { calculateExtraPayment, ExtraPaymentInput } from '../../lib/calculators/extraPayment';
import { calculateLoanComparison, LoanComparisonInput } from '../../lib/calculators/loanComparison';

export interface CalculatorViewProps {
  tool: ToolItem;
  onNavigate: (route: string) => void;
}

// 1. CAR LOAN VIEW
export const CarLoanView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: CarLoanInput = {
    vehiclePrice: 32000,
    downPayment: 5000,
    tradeInValue: 2000,
    salesTaxPercent: 6.5,
    dealerFees: 850,
    interestRate: 5.9,
    loanTermMonths: 60,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<CarLoanInput>(initial, 'car');
  const result = calculateCarLoan(inputs);

  const termOptions = [36, 48, 60, 72, 84];

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Vehicle Price (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.vehiclePrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, vehiclePrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="32000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Cash Down Payment (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.downPayment ?? ''}
            onChange={(e) => setInputs({ ...inputs, downPayment: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="5000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Trade-in Allowance (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.tradeInValue ?? ''}
            onChange={(e) => setInputs({ ...inputs, tradeInValue: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="2000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Interest Rate (APR %)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={inputs.interestRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, interestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="5.9"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Sales Tax (%)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={inputs.salesTaxPercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, salesTaxPercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="6.5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Dealer & Doc Fees (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.dealerFees ?? ''}
            onChange={(e) => setInputs({ ...inputs, dealerFees: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="850"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5">Loan Term</label>
        <div className="flex gap-2">
          {termOptions.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setInputs({ ...inputs, loanTermMonths: m })}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                inputs.loanTermMonths === m
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {m} mo ({m / 12} yr)
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
          title="Monthly Payment (EMI)"
          value={`${formatCurrency(result.monthlyPayment, currency)}/mo`}
          isHighlight={true}
          status="positive"
          subtitle={`Over ${inputs.loanTermMonths} months at ${inputs.interestRate}% APR`}
        />
        <ResultCard
          title="Total Interest Paid"
          value={formatCurrency(result.totalInterestPaid, currency)}
          subtitle="Financing charge over loan life"
        />
        <ResultCard
          title="Total Amount Financed"
          value={formatCurrency(result.totalLoanAmount, currency)}
          subtitle={`Includes $${result.salesTaxAmount.toLocaleString()} tax & fees`}
        />
        <ResultCard
          title="Total Out-of-Pocket Vehicle Cost"
          value={formatCurrency(result.totalOutOfPocketCost, currency)}
          subtitle="Down payment + trade-in + all loan payments"
        />
      </div>
      <CalculationActions title="Auto Loan Calculation" onReset={resetInputs} />
    </div>
  );

  const chart = result.totalLoanAmount > 0 ? (
    <DonutChart
      slices={[
        { label: 'Financed Principal', value: result.totalLoanAmount, color: '#6366f1' },
        { label: 'Total Interest', value: result.totalInterestPaid, color: '#f59e0b' },
        { label: 'Down Payment', value: inputs.downPayment, color: '#10b981' },
      ]}
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

// 2. PERSONAL LOAN VIEW
export const PersonalLoanView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: PersonalLoanInput = {
    loanAmount: 12000,
    interestRate: 8.5,
    loanTermMonths: 36,
    originationFeePercent: 2.5,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<PersonalLoanInput>(initial, 'ploan');
  const result = calculatePersonalLoan(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Loan Amount (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.loanAmount ?? ''}
            onChange={(e) => setInputs({ ...inputs, loanAmount: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="12000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Interest Rate (APR %)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={inputs.interestRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, interestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="8.5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Loan Duration (Months)</label>
          <input
            type="number"
            min="3"
            max="120"
            value={inputs.loanTermMonths ?? ''}
            onChange={(e) => setInputs({ ...inputs, loanTermMonths: parseInt(e.target.value, 10) || 12 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="36"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Origination Fee (%)</label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={inputs.originationFeePercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, originationFeePercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
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
          title="Monthly Payment"
          value={`${formatCurrency(result.monthlyPayment, currency)}/mo`}
          isHighlight={true}
          status="positive"
          subtitle={`Term: ${inputs.loanTermMonths} months (${Math.round(inputs.loanTermMonths / 12)} years)`}
        />
        <ResultCard
          title="Total Interest"
          value={formatCurrency(result.totalInterest, currency)}
          subtitle="Total financing charges"
        />
        <ResultCard
          title="Net Cash Disbursed"
          value={formatCurrency(result.netDisbursedAmount, currency)}
          subtitle={`After $${result.originationFeeAmount.toLocaleString()} origination fee`}
        />
        <ResultCard
          title="Total Repayment"
          value={formatCurrency(result.totalRepayment, currency)}
          subtitle="Sum of all scheduled payments"
        />
      </div>
      <CalculationActions title="Personal Loan Calculation" onReset={resetInputs} />
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

// 3. MORTGAGE AFFORDABILITY VIEW
export const MortgageAffordabilityView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: MortgageAffordabilityInput = {
    annualHouseholdIncome: 95000,
    monthlyDebtPayments: 500,
    downPayment: 60000,
    interestRate: 6.75,
    loanTermYears: 30,
    propertyTaxRatePercent: 1.2,
    annualHomeInsurance: 1200,
    frontEndDtiPercent: 28,
    backEndDtiPercent: 36,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<MortgageAffordabilityInput>(initial, 'mafford');
  const result = calculateMortgageAffordability(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Gross Annual Household Income (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.annualHouseholdIncome ?? ''}
            onChange={(e) => setInputs({ ...inputs, annualHouseholdIncome: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="95000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Monthly Non-Housing Debts (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.monthlyDebtPayments ?? ''}
            onChange={(e) => setInputs({ ...inputs, monthlyDebtPayments: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Available Down Payment (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.downPayment ?? ''}
            onChange={(e) => setInputs({ ...inputs, downPayment: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="60000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Mortgage Rate (APR %)</label>
          <input
            type="number"
            step="0.125"
            min="0.1"
            value={inputs.interestRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, interestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="6.75"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div>
          <label className="block text-xs font-semibold mb-1">Loan Term</label>
          <select
            value={inputs.loanTermYears || 30}
            onChange={(e) => setInputs({ ...inputs, loanTermYears: parseInt(e.target.value, 10) })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
          >
            <option value="30">30-Year Fixed</option>
            <option value="20">20-Year Fixed</option>
            <option value="15">15-Year Fixed</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Property Tax Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={inputs.propertyTaxRatePercent ?? 1.2}
            onChange={(e) => setInputs({ ...inputs, propertyTaxRatePercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="1.2"
          />
        </div>
      </div>
      <p className="text-[11px] text-slate-500 italic">{result.affordabilityDisclaimer}</p>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Max Affordable Home Price"
          value={formatCurrency(result.maxAffordableHomePrice, currency)}
          isHighlight={true}
          status="positive"
          subtitle={`With $${inputs.downPayment.toLocaleString()} (${result.downPaymentPercent}%) down`}
        />
        <ResultCard
          title="Max Affordable Mortgage Loan"
          value={formatCurrency(result.maxLoanAmount, currency)}
          subtitle="Principal borrowing capacity"
        />
        <ResultCard
          title="Estimated Max Monthly (PITI)"
          value={`${formatCurrency(result.maxMonthlyPayment, currency)}/mo`}
          subtitle={`P&I: $${result.breakdown.principalAndInterest} | Tax: $${result.breakdown.propertyTax} | Ins: $${result.breakdown.homeownersInsurance}`}
        />
        <ResultCard
          title="Debt-to-Income (DTI)"
          value={`${result.frontEndDti}% / ${result.backEndDti}%`}
          subtitle={`Front-end / Back-end DTI ratios`}
        />
      </div>
      <CalculationActions title="Mortgage Affordability Calculation" onReset={resetInputs} />
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

// 4. EXTRA PAYMENT VIEW
export const ExtraPaymentView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: ExtraPaymentInput = {
    loanBalance: 280000,
    interestRate: 6.5,
    remainingYears: 25,
    extraMonthlyPayment: 250,
    extraAnnualPayment: 1000,
    oneTimeLumpSum: 0,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<ExtraPaymentInput>(initial, 'extra');
  const result = calculateExtraPayment(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Current Loan Balance (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.loanBalance ?? ''}
            onChange={(e) => setInputs({ ...inputs, loanBalance: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="280000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Interest Rate (APR %)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={inputs.interestRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, interestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="6.5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Remaining Term (Years)</label>
          <input
            type="number"
            min="1"
            max="40"
            value={inputs.remainingYears ?? ''}
            onChange={(e) => setInputs({ ...inputs, remainingYears: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="25"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Extra Monthly Payment (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.extraMonthlyPayment ?? ''}
            onChange={(e) => setInputs({ ...inputs, extraMonthlyPayment: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="250"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Extra Annual Payment (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.extraAnnualPayment ?? ''}
            onChange={(e) => setInputs({ ...inputs, extraAnnualPayment: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="1000"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Total Interest Saved"
          value={formatCurrency(result.totalInterestSaved, currency)}
          isHighlight={true}
          status="positive"
          subtitle={`By paying an extra ${formatCurrency(inputs.extraMonthlyPayment || 0, currency)}/mo`}
        />
        <ResultCard
          title="Time Saved"
          value={result.earlyPayoffDateText}
          status="positive"
          subtitle={`${result.monthsSaved} months sooner than original schedule`}
        />
        <ResultCard
          title="New Monthly Payment"
          value={`${formatCurrency(result.newMonthlyPayment, currency)}/mo`}
          subtitle={`Original base payment: ${formatCurrency(result.originalMonthlyPayment, currency)}`}
        />
        <ResultCard
          title="New Total Interest"
          value={formatCurrency(result.newTotalInterest, currency)}
          subtitle={`Reduced from ${formatCurrency(result.originalTotalInterest, currency)}`}
        />
      </div>
      <CalculationActions title="Extra Loan Payment Calculation" onReset={resetInputs} />
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

// 5. LOAN COMPARISON VIEW
export const LoanComparisonView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: LoanComparisonInput = {
    loanA: {
      principal: 250000,
      interestRate: 6.5,
      termYears: 30,
      originationFeePercent: 1.0,
    },
    loanB: {
      principal: 250000,
      interestRate: 5.75,
      termYears: 15,
      originationFeePercent: 1.5,
    },
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<LoanComparisonInput>(initial, 'lcomp');
  const result = calculateLoanComparison(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loan A */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
            Option A (e.g. 30-Year Loan)
          </span>
          <div>
            <label className="block text-xs font-semibold mb-1">Loan Amount (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={inputs.loanA.principal ?? ''}
              onChange={(e) =>
                setInputs({ ...inputs, loanA: { ...inputs.loanA, principal: parseFloat(e.target.value) || 0 } })
              }
              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={inputs.loanA.interestRate ?? ''}
              onChange={(e) =>
                setInputs({ ...inputs, loanA: { ...inputs.loanA, interestRate: parseFloat(e.target.value) || 0 } })
              }
              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Term (Years)</label>
            <input
              type="number"
              value={inputs.loanA.termYears ?? ''}
              onChange={(e) =>
                setInputs({ ...inputs, loanA: { ...inputs.loanA, termYears: parseFloat(e.target.value) || 0 } })
              }
              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
        </div>

        {/* Loan B */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            Option B (e.g. 15-Year Loan)
          </span>
          <div>
            <label className="block text-xs font-semibold mb-1">Loan Amount (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={inputs.loanB.principal ?? ''}
              onChange={(e) =>
                setInputs({ ...inputs, loanB: { ...inputs.loanB, principal: parseFloat(e.target.value) || 0 } })
              }
              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={inputs.loanB.interestRate ?? ''}
              onChange={(e) =>
                setInputs({ ...inputs, loanB: { ...inputs.loanB, interestRate: parseFloat(e.target.value) || 0 } })
              }
              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Term (Years)</label>
            <input
              type="number"
              value={inputs.loanB.termYears ?? ''}
              onChange={(e) =>
                setInputs({ ...inputs, loanB: { ...inputs.loanB, termYears: parseFloat(e.target.value) || 0 } })
              }
              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60">
        <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-1">Comparison Insight</h4>
        <p className="text-xs text-indigo-700 dark:text-indigo-300">{result.summaryInsight}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Loan A Monthly Payment"
          value={`${formatCurrency(result.loanA.monthlyPayment, currency)}/mo`}
          subtitle={`Total interest: ${formatCurrency(result.loanA.totalInterest, currency)}`}
        />
        <ResultCard
          title="Loan B Monthly Payment"
          value={`${formatCurrency(result.loanB.monthlyPayment, currency)}/mo`}
          subtitle={`Total interest: ${formatCurrency(result.loanB.totalInterest, currency)}`}
        />
        <ResultCard
          title="Total Cost Difference"
          value={formatCurrency(Math.abs(result.totalCostDiff), currency)}
          isHighlight={true}
          status="positive"
          subtitle={`${result.cheaperLoanOverall} is cheaper overall`}
        />
        <ResultCard
          title="Monthly Cash Flow Difference"
          value={formatCurrency(Math.abs(result.monthlyPaymentDiff), currency)}
          subtitle={`${result.lowerMonthlyLoan} has the lower monthly payment`}
        />
      </div>
      <CalculationActions title="Loan Comparison Calculation" onReset={resetInputs} />
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
