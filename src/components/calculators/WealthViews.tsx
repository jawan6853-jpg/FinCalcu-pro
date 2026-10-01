import React from 'react';
import { ToolItem } from '../../types';
import { CalculatorLayout } from '../common/CalculatorLayout';
import { ResultCard, CalculationActions } from '../common/ResultCard';
import { DonutChart, AreaGrowthChart } from '../common/SimpleChart';
import { formatCurrency, formatNumber, formatPercentage } from '../../lib/formatters';
import { useUrlParamsState } from '../../lib/useUrlParamsState';
import { useCurrency } from '../../context/CurrencyContext';
import { Info } from 'lucide-react';

import { calculateNetWorth, NetWorthInput } from '../../lib/calculators/netWorth';
import { calculateDebtToIncome, DebtToIncomeInput } from '../../lib/calculators/debtToIncome';
import { calculateSavingsRate, SavingsRateInput } from '../../lib/calculators/savingsRate';
import { calculateFinancialIndependence, FinancialIndependenceInput } from '../../lib/calculators/financialIndependence';
import { calculateFIRE, FireInput } from '../../lib/calculators/fire';

export interface CalculatorViewProps {
  tool: ToolItem;
  onNavigate: (route: string) => void;
}

// 1. NET WORTH VIEW
export const NetWorthView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: NetWorthInput = {
    cashAndBank: 35000,
    investments: 145000,
    realEstate: 380000,
    cryptoAssets: 25000,
    retirementAccounts: 120000,
    otherAssets: 15000,
    mortgageBalance: 290000,
    autoLoans: 18000,
    studentLoans: 15000,
    creditCardDebt: 3500,
    personalLoans: 0,
    otherLiabilities: 0,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<NetWorthInput>(initial, 'nw');
  const result = calculateNetWorth(inputs);

  const assetSlices = [
    { label: 'Real Estate', value: result.assetBreakdown.realEstate, color: '#3b82f6' },
    { label: 'Investments', value: result.assetBreakdown.investments, color: '#10b981' },
    { label: 'Retirement', value: result.assetBreakdown.retirementAccounts, color: '#8b5cf6' },
    { label: 'Cash & Bank', value: result.assetBreakdown.cashAndBank, color: '#06b6d4' },
    { label: 'Crypto', value: result.assetBreakdown.cryptoAssets, color: '#f59e0b' },
    { label: 'Other', value: result.assetBreakdown.otherAssets, color: '#64748b' },
  ].filter((d) => d.value > 0);

  const liabilitySlices = [
    { label: 'Mortgage', value: result.liabilityBreakdown.mortgageBalance, color: '#ef4444' },
    { label: 'Auto Loans', value: result.liabilityBreakdown.autoLoans, color: '#f97316' },
    { label: 'Student Loans', value: result.liabilityBreakdown.studentLoans, color: '#eab308' },
    { label: 'Credit Cards', value: result.liabilityBreakdown.creditCardDebt, color: '#ec4899' },
    { label: 'Personal & Other', value: result.liabilityBreakdown.personalLoans + result.liabilityBreakdown.otherLiabilities, color: '#a855f7' },
  ].filter((d) => d.value > 0);

  const inputsComponent = (
    <div className="space-y-5">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Assets (What You Own)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cash & Bank Accounts (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={inputs.cashAndBank ?? ''}
              onChange={(e) => setInputs({ ...inputs, cashAndBank: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Taxable Investments (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={inputs.investments ?? ''}
              onChange={(e) => setInputs({ ...inputs, investments: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Real Estate Value (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={inputs.realEstate ?? ''}
              onChange={(e) => setInputs({ ...inputs, realEstate: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Retirement (401k, IRA) (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={inputs.retirementAccounts ?? ''}
              onChange={(e) => setInputs({ ...inputs, retirementAccounts: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cryptocurrency Assets (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={inputs.cryptoAssets ?? ''}
              onChange={(e) => setInputs({ ...inputs, cryptoAssets: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Other Valuables (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={inputs.otherAssets ?? ''}
              onChange={(e) => setInputs({ ...inputs, otherAssets: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span> Liabilities (What You Owe)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mortgage Balance (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={inputs.mortgageBalance ?? ''}
              onChange={(e) => setInputs({ ...inputs, mortgageBalance: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Auto Loans (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={inputs.autoLoans ?? ''}
              onChange={(e) => setInputs({ ...inputs, autoLoans: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Student Loans (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={inputs.studentLoans ?? ''}
              onChange={(e) => setInputs({ ...inputs, studentLoans: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Credit Card Debt (${currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={inputs.creditCardDebt ?? ''}
              onChange={(e) => setInputs({ ...inputs, creditCardDebt: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Total Personal Net Worth"
        value={formatCurrency(result.netWorth, currency)}
        isHighlight={true}
        status={result.netWorth >= 0 ? 'positive' : 'negative'}
        badge={result.financialHealthTier}
      />

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Total Assets"
          value={formatCurrency(result.totalAssets, currency)}
          subtitle="Gross assets owned"
        />
        <ResultCard
          title="Total Liabilities"
          value={formatCurrency(result.totalLiabilities, currency)}
          subtitle="Total outstanding debt"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Liquid Assets"
          value={formatCurrency(result.liquidAssets, currency)}
          subtitle={`${formatPercentage(result.liquidRatioPercentage)} of total assets`}
        />
        <ResultCard
          title="Debt-to-Asset Ratio"
          value={formatPercentage(result.debtToAssetPercentage)}
          subtitle={result.debtToAssetPercentage < 50 ? 'Healthy solvency' : 'Elevated leverage'}
        />
      </div>

      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Asset Composition
        </h4>
        <DonutChart
          slices={assetSlices}
          centerLabel="Assets"
          centerValue={formatCurrency(result.totalAssets, currency)}
        />
      </div>

      {liabilitySlices.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Debt Composition
          </h4>
          <DonutChart
            slices={liabilitySlices}
            centerLabel="Debt"
            centerValue={formatCurrency(result.totalLiabilities, currency)}
          />
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

// 2. DEBT-TO-INCOME VIEW
export const DebtToIncomeView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: DebtToIncomeInput = {
    grossMonthlyIncome: 8500,
    rentOrMortgage: 2100,
    autoLoanPayments: 450,
    studentLoanPayments: 280,
    creditCardMinimums: 120,
    personalAndOtherLoans: 0,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<DebtToIncomeInput>(initial, 'dti');
  const result = calculateDebtToIncome(inputs);

  const chartSlices = [
    { label: 'Remaining Cash Flow', value: result.remainingMonthlyCashFlow, color: '#10b981' },
    { label: 'Housing (Front-End)', value: result.housingDebt, color: '#3b82f6' },
    { label: 'Consumer & Auto Debt', value: result.nonHousingDebt, color: '#f59e0b' },
  ].filter((d) => d.value > 0);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Gross Monthly Pre-Tax Income (${currencySymbol})
        </label>
        <input
          type="number"
          min="1"
          value={inputs.grossMonthlyIncome ?? ''}
          onChange={(e) => setInputs({ ...inputs, grossMonthlyIncome: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Rent or Mortgage Payment (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.rentOrMortgage ?? ''}
            onChange={(e) => setInputs({ ...inputs, rentOrMortgage: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Auto Loan Payment (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.autoLoanPayments ?? ''}
            onChange={(e) => setInputs({ ...inputs, autoLoanPayments: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Student Loan Payment (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.studentLoanPayments ?? ''}
            onChange={(e) => setInputs({ ...inputs, studentLoanPayments: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Credit Card Minimums (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.creditCardMinimums ?? ''}
            onChange={(e) => setInputs({ ...inputs, creditCardMinimums: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Total Debt-to-Income (DTI)"
        value={formatPercentage(result.dtiPercentage)}
        isHighlight={true}
        status={result.dtiPercentage <= 36 ? 'positive' : result.dtiPercentage <= 43 ? 'neutral' : 'negative'}
        badge={result.dtiBenchmarkRange}
      />

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Front-End (Housing) DTI"
          value={formatPercentage(result.frontEndDtiPercentage)}
          subtitle="Preferred benchmark: < 28%"
        />
        <ResultCard
          title="Total Monthly Debt"
          value={formatCurrency(result.totalMonthlyDebt, currency)}
          subtitle="Contractual obligations"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Target Debt for 36% Benchmark"
          value={formatCurrency(result.maxPaymentFor36Dti, currency)}
          subtitle="Prime underwriting range"
        />
        <ResultCard
          title="Max Debt for 43% QM Benchmark"
          value={formatCurrency(result.maxPaymentFor43Dti, currency)}
          subtitle="Conventional loan guideline"
        />
      </div>

      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Educational Benchmark Context
        </h4>
        <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
          {result.educationalNotes.map((note, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-slate-400 italic">
          Note: Lender criteria and allowable DTI limits vary widely across mortgage programs (Conventional, FHA, VA) and financial institutions.
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Monthly Income Allocation
        </h4>
        <DonutChart
          slices={chartSlices}
          centerLabel="Income"
          centerValue={formatCurrency(result.grossMonthlyIncome, currency)}
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

// 3. SAVINGS RATE VIEW
export const SavingsRateView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: SavingsRateInput = {
    monthlyIncome: 6500,
    monthlySavings: 1950,
    monthlyEssentialSpending: 3100,
    monthlyDiscretionarySpending: 1450,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<SavingsRateInput>(initial, 'sr');
  const result = calculateSavingsRate(inputs);

  const chartSlices = [
    { label: 'Savings & Investments', value: result.monthlySavings, color: '#10b981' },
    { label: 'Essential Needs', value: result.rule503020Comparison.needsPercentage > 0 ? (result.monthlyIncome * result.rule503020Comparison.needsPercentage) / 100 : 0, color: '#3b82f6' },
    { label: 'Discretionary Wants', value: result.rule503020Comparison.wantsPercentage > 0 ? (result.monthlyIncome * result.rule503020Comparison.wantsPercentage) / 100 : 0, color: '#f59e0b' },
  ].filter((d) => d.value > 0);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Monthly Take-Home Income (${currencySymbol})
        </label>
        <input
          type="number"
          min="1"
          value={inputs.monthlyIncome ?? ''}
          onChange={(e) => setInputs({ ...inputs, monthlyIncome: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Monthly Savings & Investments (${currencySymbol})
        </label>
        <input
          type="number"
          min="0"
          value={inputs.monthlySavings ?? ''}
          onChange={(e) => setInputs({ ...inputs, monthlySavings: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Essential Needs Spending (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.monthlyEssentialSpending ?? ''}
            onChange={(e) => setInputs({ ...inputs, monthlyEssentialSpending: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Discretionary Wants (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.monthlyDiscretionarySpending ?? ''}
            onChange={(e) => setInputs({ ...inputs, monthlyDiscretionarySpending: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Personal Savings Rate"
        value={formatPercentage(result.savingsRatePercentage)}
        isHighlight={true}
        status={result.savingsRatePercentage >= 20 ? 'positive' : 'neutral'}
        badge={result.tierLabel}
      />

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Annual Savings"
          value={formatCurrency(result.annualSavings, currency)}
          subtitle="Capital deployed yearly"
        />
        <ResultCard
          title="Annual Spending"
          value={formatCurrency(result.annualSpending, currency)}
          subtitle="Annual cost of living"
        />
      </div>

      <ResultCard
        title="Projected Years to FI"
        value={`${result.projectedYearsToFI} Years`}
        subtitle="Assuming 5% real investment return"
        isHighlight={true}
      />

      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Budget Distribution
        </h4>
        <DonutChart
          slices={chartSlices}
          centerLabel="Income"
          centerValue={formatCurrency(result.monthlyIncome, currency)}
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

// 4. FINANCIAL INDEPENDENCE VIEW
export const FinancialIndependenceView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: FinancialIndependenceInput = {
    annualExpenses: 55000,
    withdrawalRate: 4.0,
    currentInvestments: 120000,
    annualContributions: 24000,
    expectedReturn: 7.0,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<FinancialIndependenceInput>(initial, 'fi');
  const result = calculateFinancialIndependence(inputs);

  const areaChartData = result.growthSchedule.map((s) => ({
    label: `Yr ${s.year}`,
    invested: s.contributions + result.currentInvestments,
    total: s.endingBalance,
  }));

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Target Annual Living Expenses (${currencySymbol})
        </label>
        <input
          type="number"
          min="1000"
          value={inputs.annualExpenses ?? ''}
          onChange={(e) => setInputs({ ...inputs, annualExpenses: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Safe Withdrawal Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="10"
            value={inputs.withdrawalRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, withdrawalRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Expected Real Return (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="25"
            value={inputs.expectedReturn ?? ''}
            onChange={(e) => setInputs({ ...inputs, expectedReturn: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Current Invested Assets (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.currentInvestments ?? ''}
            onChange={(e) => setInputs({ ...inputs, currentInvestments: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Annual Savings Added (${currencySymbol})
          </label>
          <input
            type="number"
            min="0"
            value={inputs.annualContributions ?? ''}
            onChange={(e) => setInputs({ ...inputs, annualContributions: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <span>Educational Estimate: Calculations assume constant annual compounding and steady expenses. Real returns fluctuate over time.</span>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Financial Independence Number"
        value={formatCurrency(result.fiNumber, currency)}
        isHighlight={true}
        status={result.isAlreadyFI ? 'positive' : 'neutral'}
        badge={`${formatPercentage(result.currentProgressPercentage)} Reached`}
      />

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Time to FI"
          value={result.isAlreadyFI ? 'Achieved!' : `${result.yearsToFI} Years`}
          subtitle={result.isAlreadyFI ? 'Financially Independent' : 'At current pace'}
        />
        <ResultCard
          title="Remaining Capital Needed"
          value={formatCurrency(result.remainingCapitalNeeded, currency)}
          subtitle="Gap to FI Target"
        />
      </div>

      <ResultCard
        title="Annual Safe Passive Income"
        value={formatCurrency(result.annualSafeIncomeGenerated, currency)}
        subtitle={`At ${inputs.withdrawalRate}% Safe Withdrawal Rate`}
      />

      {areaChartData.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Trajectory to Financial Independence
          </h4>
          <AreaGrowthChart data={areaChartData} />
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

// 5. FIRE CALCULATOR VIEW
export const FireCalculatorView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: FireInput = {
    currentAge: 32,
    currentSavings: 90000,
    annualIncome: 110000,
    annualExpenses: 48000,
    annualSavings: 25000,
    expectedReturn: 7.0,
    withdrawalRate: 4.0,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<FireInput>(initial, 'fire');
  const result = calculateFIRE(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Age</label>
          <input
            type="number"
            min="16"
            max="90"
            value={inputs.currentAge ?? ''}
            onChange={(e) => setInputs({ ...inputs, currentAge: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Savings (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.currentSavings ?? ''}
            onChange={(e) => setInputs({ ...inputs, currentSavings: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Annual Expenses (${currencySymbol})</label>
          <input
            type="number"
            min="1000"
            value={inputs.annualExpenses ?? ''}
            onChange={(e) => setInputs({ ...inputs, annualExpenses: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Annual Savings Contribution (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.annualSavings ?? ''}
            onChange={(e) => setInputs({ ...inputs, annualSavings: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Expected Return (%)</label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="20"
            value={inputs.expectedReturn ?? ''}
            onChange={(e) => setInputs({ ...inputs, expectedReturn: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Withdrawal Rate (%)</label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="10"
            value={inputs.withdrawalRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, withdrawalRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="FIRE Number Target"
        value={formatCurrency(result.fireNumber, currency)}
        isHighlight={true}
        status="positive"
        badge={`Retire at Age ${result.fireAge}`}
      />

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Years to FIRE"
          value={`${result.yearsToFIRE} Years`}
          subtitle={`Age ${result.fireAge}`}
        />
        <ResultCard
          title="Current Progress"
          value={formatPercentage(result.currentProgressPercentage)}
          subtitle="Of FIRE Goal"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          title="Lean FIRE Target"
          value={formatCurrency(result.leanFireNumber, currency)}
          subtitle="75% frugal budget"
        />
        <ResultCard
          title="Fat FIRE Target"
          value={formatCurrency(result.fatFireNumber, currency)}
          subtitle="140% luxury budget"
        />
      </div>

      <ResultCard
        title="Coast FIRE Target (Today)"
        value={formatCurrency(result.coastFireNumber, currency)}
        subtitle="Grows to FIRE by age 65 with $0 further deposits"
      />

      <CalculationActions
        title={tool.name}
        toolId={tool.id}
        onReset={resetInputs}
      />
    </div>
  );

  return <CalculatorLayout tool={tool} inputsComponent={inputsComponent} resultsComponent={resultsComponent} onNavigate={onNavigate} />;
};
