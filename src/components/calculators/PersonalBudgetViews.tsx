import React from 'react';
import { ToolItem } from '../../types';
import { CalculatorLayout } from '../common/CalculatorLayout';
import { ResultCard, CalculationActions } from '../common/ResultCard';
import { DonutChart } from '../common/SimpleChart';
import { formatCurrency, formatPercentage } from '../../lib/formatters';
import { useUrlParamsState } from '../../lib/useUrlParamsState';
import { useCurrency } from '../../context/CurrencyContext';

import { calculateBudget, BudgetInput } from '../../lib/calculators/budget';
import { calculateSalary, SalaryInput, PayFrequency } from '../../lib/calculators/salary';
import { calculateTakeHomePay, TakeHomePayInput } from '../../lib/calculators/takeHomePay';
import { calculateSavingsGoal, SavingsGoalInput } from '../../lib/calculators/savingsGoal';
import { calculateEmergencyFund, EmergencyFundInput } from '../../lib/calculators/emergencyFund';

export interface CalculatorViewProps {
  tool: ToolItem;
  onNavigate: (route: string) => void;
}

// 1. BUDGET VIEW
export const BudgetView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: BudgetInput = {
    monthlyIncome: 5500,
    additionalIncome: 600,
    housing: 1600,
    utilities: 350,
    groceries: 600,
    transportation: 450,
    healthcare: 250,
    debtPayments: 300,
    entertainment: 400,
    savingsAndInvestments: 1000,
    miscExpenses: 150,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<BudgetInput>(initial, 'budget');
  const result = calculateBudget(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 block mb-2">Monthly Income (${currencySymbol})</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Primary Take-Home Pay</label>
            <input
              type="number"
              min="0"
              value={inputs.monthlyIncome ?? ''}
              onChange={(e) => setInputs({ ...inputs, monthlyIncome: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Side Hustle / Other</label>
            <input
              type="number"
              min="0"
              value={inputs.additionalIncome ?? ''}
              onChange={(e) => setInputs({ ...inputs, additionalIncome: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
        </div>
      </div>

      <div>
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">Monthly Expenses (${currencySymbol})</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[11px] text-slate-500 mb-0.5">Housing (Rent/Mortgage)</label>
            <input
              type="number"
              min="0"
              value={inputs.housing ?? ''}
              onChange={(e) => setInputs({ ...inputs, housing: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-0.5">Utilities & Internet</label>
            <input
              type="number"
              min="0"
              value={inputs.utilities ?? ''}
              onChange={(e) => setInputs({ ...inputs, utilities: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-0.5">Groceries & Food</label>
            <input
              type="number"
              min="0"
              value={inputs.groceries ?? ''}
              onChange={(e) => setInputs({ ...inputs, groceries: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-0.5">Transportation</label>
            <input
              type="number"
              min="0"
              value={inputs.transportation ?? ''}
              onChange={(e) => setInputs({ ...inputs, transportation: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-0.5">Debt Payments</label>
            <input
              type="number"
              min="0"
              value={inputs.debtPayments ?? ''}
              onChange={(e) => setInputs({ ...inputs, debtPayments: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-0.5">Entertainment & Dining</label>
            <input
              type="number"
              min="0"
              value={inputs.entertainment ?? ''}
              onChange={(e) => setInputs({ ...inputs, entertainment: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="block text-xs font-semibold mb-1">Monthly Savings & Investments (${currencySymbol})</label>
        <input
          type="number"
          min="0"
          value={inputs.savingsAndInvestments ?? ''}
          onChange={(e) => setInputs({ ...inputs, savingsAndInvestments: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
        />
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Remaining Cash Flow"
          value={formatCurrency(result.remainingCashFlow, currency)}
          isHighlight={true}
          status={result.remainingCashFlow >= 0 ? 'positive' : 'negative'}
          subtitle={result.statusMessage}
        />
        <ResultCard
          title="Savings Rate"
          value={formatPercentage(result.savingsRatePercent)}
          status={result.savingsRatePercent >= 20 ? 'positive' : 'neutral'}
          subtitle={`Total savings: ${formatCurrency(result.totalSavings, currency)}/mo`}
        />
        <ResultCard
          title="Total Income"
          value={formatCurrency(result.totalIncome, currency)}
          subtitle="Net monthly household cash inflow"
        />
        <ResultCard
          title="Total Outflow"
          value={formatCurrency(result.totalExpenses, currency)}
          subtitle={`${result.expenseRatioPercent}% of monthly income`}
        />
      </div>

      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h4 className="text-xs font-bold mb-2">50/30/20 Budget Benchmark</h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Needs ({result.rule50_30_20.needsPercent}%)</span>
            <div className="text-xs font-bold font-mono">{formatCurrency(result.needsTotal, currency)}</div>
            <span className="text-[9px] text-slate-400">Target 50%: {formatCurrency(result.rule50_30_20.needsTargetAmount, currency)}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Wants ({result.rule50_30_20.wantsPercent}%)</span>
            <div className="text-xs font-bold font-mono">{formatCurrency(result.wantsTotal, currency)}</div>
            <span className="text-[9px] text-slate-400">Target 30%: {formatCurrency(result.rule50_30_20.wantsTargetAmount, currency)}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Savings ({result.rule50_30_20.savingsPercent}%)</span>
            <div className="text-xs font-bold font-mono text-emerald-600">{formatCurrency(result.totalSavings, currency)}</div>
            <span className="text-[9px] text-slate-400">Target 20%: {formatCurrency(result.rule50_30_20.savingsTargetAmount, currency)}</span>
          </div>
        </div>
      </div>

      <CalculationActions title="Budget Calculation" onReset={resetInputs} />
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

// 2. SALARY VIEW
export const SalaryView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: SalaryInput = {
    baseAmount: 75000,
    payFrequency: 'annually',
    hoursPerWeek: 40,
    filingStatus: 'single',
    stateTaxRatePercent: 4.5,
    preTaxDeductions401kPercent: 5,
    healthInsuranceMonthly: 150,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<SalaryInput>(initial, 'salary');
  const result = calculateSalary(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Salary / Wage Amount (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.baseAmount ?? ''}
            onChange={(e) => setInputs({ ...inputs, baseAmount: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="75000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Pay Frequency</label>
          <select
            value={inputs.payFrequency}
            onChange={(e) => setInputs({ ...inputs, payFrequency: e.target.value as PayFrequency })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
          >
            <option value="annually">Per Year (Annual)</option>
            <option value="monthly">Per Month</option>
            <option value="bi-weekly">Bi-Weekly (Every 2 wks)</option>
            <option value="weekly">Weekly</option>
            <option value="hourly">Hourly Wage</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">401(k) Contribution (%)</label>
          <input
            type="number"
            step="1"
            min="0"
            max="50"
            value={inputs.preTaxDeductions401kPercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, preTaxDeductions401kPercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Est. State Tax Rate (%)</label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={inputs.stateTaxRatePercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, stateTaxRatePercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="4.5"
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
          title="Estimated Net Take-Home (Annual)"
          value={formatCurrency(result.netAnnual, currency)}
          isHighlight={true}
          status="positive"
          subtitle={`${result.netTakeHomeRatioPercent}% of gross pay`}
        />
        <ResultCard
          title="Estimated Net Pay Per Month"
          value={`${formatCurrency(result.netMonthly, currency)}/mo`}
          status="positive"
          subtitle={`Bi-Weekly: ${formatCurrency(result.netBiWeekly, currency)}`}
        />
        <ResultCard
          title="Gross Annual Salary"
          value={formatCurrency(result.grossAnnual, currency)}
          subtitle={`Gross hourly: ${formatCurrency(result.grossHourly, currency)}/hr`}
        />
        <ResultCard
          title="Total Annual Deductions"
          value={formatCurrency(result.deductionsBreakdown.totalDeductionsAnnual, currency)}
          subtitle={`Effective tax rate: ${result.effectiveTaxRatePercent}%`}
        />
      </div>
      <CalculationActions title="Salary Calculation" onReset={resetInputs} />
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

// 3. TAKE-HOME PAY VIEW
export const TakeHomePayView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: TakeHomePayInput = {
    grossPaycheckAmount: 3200,
    payPeriod: 'bi-weekly',
    federalWithholdingPercent: 12,
    stateWithholdingPercent: 4.5,
    preTaxDeductions: 160,
    postTaxDeductions: 25,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<TakeHomePayInput>(initial, 'netpay');
  const result = calculateTakeHomePay(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Gross Paycheck Amount (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.grossPaycheckAmount ?? ''}
            onChange={(e) => setInputs({ ...inputs, grossPaycheckAmount: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="3200"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Pay Period Frequency</label>
          <select
            value={inputs.payPeriod}
            onChange={(e) => setInputs({ ...inputs, payPeriod: e.target.value as any })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
          >
            <option value="weekly">Weekly (52 checks/yr)</option>
            <option value="bi-weekly">Bi-Weekly (26 checks/yr)</option>
            <option value="semi-monthly">Semi-Monthly (24 checks/yr)</option>
            <option value="monthly">Monthly (12 checks/yr)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Pre-Tax Deductions (401k/HSA) (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.preTaxDeductions ?? ''}
            onChange={(e) => setInputs({ ...inputs, preTaxDeductions: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="160"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Est. Federal Tax Withholding (%)</label>
          <input
            type="number"
            step="0.5"
            value={inputs.federalWithholdingPercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, federalWithholdingPercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="12"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Take-Home Pay Per Paycheck"
          value={formatCurrency(result.takeHomePay, currency)}
          isHighlight={true}
          status="positive"
          subtitle={`${result.takeHomePercent}% of gross paycheck`}
        />
        <ResultCard
          title="Annualized Take-Home"
          value={formatCurrency(result.annualizedTakeHome, currency)}
          subtitle={`Annual gross: ${formatCurrency(result.annualizedGross, currency)}`}
        />
        <ResultCard
          title="Total Taxes Withheld"
          value={formatCurrency(result.totalTaxesWithheld, currency)}
          status="negative"
          subtitle={`FICA: $${(result.socialSecurityTax + result.medicareTax).toFixed(2)} | Fed: $${result.federalIncomeTax.toFixed(2)}`}
        />
        <ResultCard
          title="Total Pre-Tax Deductions"
          value={formatCurrency(result.totalPreTaxDeductions, currency)}
          subtitle="401(k), HSA, & health insurance"
        />
      </div>
      <CalculationActions title="Take-Home Pay Calculation" onReset={resetInputs} />
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

// 4. SAVINGS GOAL VIEW
export const SavingsGoalView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: SavingsGoalInput = {
    targetAmount: 25000,
    currentSavings: 5000,
    targetTimeYears: 3,
    monthlyContribution: 500,
    annualInterestRate: 4.5,
    calculationMode: 'solve-contribution',
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<SavingsGoalInput>(initial, 'sgoal');
  const result = calculateSavingsGoal(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-2">
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, calculationMode: 'solve-contribution' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            inputs.calculationMode === 'solve-contribution'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Find Required Monthly Deposit
        </button>
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, calculationMode: 'solve-time' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            inputs.calculationMode === 'solve-time'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Find Time to Reach Goal
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Target Savings Goal (${currencySymbol})</label>
          <input
            type="number"
            min="1"
            value={inputs.targetAmount ?? ''}
            onChange={(e) => setInputs({ ...inputs, targetAmount: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="25000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Current Starting Balance (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.currentSavings ?? ''}
            onChange={(e) => setInputs({ ...inputs, currentSavings: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="5000"
          />
        </div>
        {inputs.calculationMode === 'solve-contribution' ? (
          <div>
            <label className="block text-xs font-semibold mb-1">Time Horizon (Years)</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="40"
              value={inputs.targetTimeYears ?? ''}
              onChange={(e) => setInputs({ ...inputs, targetTimeYears: parseFloat(e.target.value) || 1 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
              placeholder="3"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold mb-1">Monthly Deposit Available (${currencySymbol})</label>
            <input
              type="number"
              min="1"
              value={inputs.monthlyContribution ?? ''}
              onChange={(e) => setInputs({ ...inputs, monthlyContribution: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
              placeholder="500"
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-semibold mb-1">Annual Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={inputs.annualInterestRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, annualInterestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="4.5"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {inputs.calculationMode === 'solve-contribution' ? (
          <ResultCard
            title="Required Monthly Savings"
            value={`${formatCurrency(result.monthlyContributionRequired, currency)}/mo`}
            isHighlight={true}
            status="positive"
            subtitle={`To reach ${formatCurrency(result.targetAmount, currency)} in ${inputs.targetTimeYears} years`}
          />
        ) : (
          <ResultCard
            title="Time to Reach Goal"
            value={`${result.totalTimeYears} Years`}
            isHighlight={true}
            status="positive"
            subtitle={`${result.totalTimeMonths} monthly payments`}
          />
        )}
        <ResultCard
          title="Interest Earned"
          value={formatCurrency(result.totalInterestEarned, currency)}
          status="positive"
          subtitle="Compound interest helping you reach your target"
        />
        <ResultCard
          title="Total Principal Contributed"
          value={formatCurrency(result.totalPrincipalContributed, currency)}
          subtitle="Your direct contributions"
        />
        <ResultCard
          title="Initial Progress"
          value={`${result.progressPercent}%`}
          subtitle={`Already funded: ${formatCurrency(result.currentSavings, currency)}`}
        />
      </div>
      <CalculationActions title="Savings Goal Calculation" onReset={resetInputs} />
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

// 5. EMERGENCY FUND VIEW
export const EmergencyFundView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: EmergencyFundInput = {
    housingRentOrMortgage: 1500,
    utilitiesAndBills: 350,
    groceriesAndFood: 550,
    transportationAndGas: 400,
    insuranceAndMedical: 250,
    minimumDebtPayments: 200,
    coverageMonths: 6,
    currentEmergencySavings: 8000,
    monthlySavingsContribution: 400,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<EmergencyFundInput>(initial, 'efund');
  const result = calculateEmergencyFund(inputs);

  const monthsOptions = [3, 6, 9, 12];

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1.5">Target Coverage Months</label>
        <div className="flex gap-2">
          {monthsOptions.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setInputs({ ...inputs, coverageMonths: m })}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                inputs.coverageMonths === m
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {m} Months {m === 6 ? '(Standard)' : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div>
          <label className="block text-[11px] text-slate-500 mb-0.5">Housing (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.housingRentOrMortgage ?? ''}
            onChange={(e) => setInputs({ ...inputs, housingRentOrMortgage: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-500 mb-0.5">Utilities & Bills (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.utilitiesAndBills ?? ''}
            onChange={(e) => setInputs({ ...inputs, utilitiesAndBills: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-500 mb-0.5">Groceries (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.groceriesAndFood ?? ''}
            onChange={(e) => setInputs({ ...inputs, groceriesAndFood: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-500 mb-0.5">Transportation (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.transportationAndGas ?? ''}
            onChange={(e) => setInputs({ ...inputs, transportationAndGas: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-500 mb-0.5">Medical / Insurance (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.insuranceAndMedical ?? ''}
            onChange={(e) => setInputs({ ...inputs, insuranceAndMedical: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-500 mb-0.5">Debt Minimums (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.minimumDebtPayments ?? ''}
            onChange={(e) => setInputs({ ...inputs, minimumDebtPayments: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div>
          <label className="block text-xs font-semibold mb-1">Current Emergency Savings (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.currentEmergencySavings ?? ''}
            onChange={(e) => setInputs({ ...inputs, currentEmergencySavings: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Monthly Contribution Ability (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.monthlySavingsContribution ?? ''}
            onChange={(e) => setInputs({ ...inputs, monthlySavingsContribution: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Recommended Emergency Fund"
          value={formatCurrency(result.targetFundAmount, currency)}
          isHighlight={true}
          status="positive"
          subtitle={`${inputs.coverageMonths} months of essential expenses ($${result.monthlyEssentialExpenses.toLocaleString()}/mo)`}
        />
        <ResultCard
          title={result.shortfallOrSurplus <= 0 ? 'Surplus Safety Buffer' : 'Savings Shortfall'}
          value={formatCurrency(Math.abs(result.shortfallOrSurplus), currency)}
          status={result.shortfallOrSurplus <= 0 ? 'positive' : 'negative'}
          subtitle={result.shortfallOrSurplus <= 0 ? 'Goal fully reached!' : `${result.monthsToGoal} months away at current savings pace`}
        />
        <ResultCard
          title="Monthly Living Minimums"
          value={`${formatCurrency(result.monthlyEssentialExpenses, currency)}/mo`}
          subtitle="Non-discretionary survival baseline"
        />
        <ResultCard
          title="Fund Status"
          value={result.fundHealthStatus.toUpperCase().replace('-', ' ')}
          status={result.fundHealthStatus === 'fully-funded' ? 'positive' : 'neutral'}
          subtitle={`Current savings: ${formatCurrency(result.currentSavings, currency)}`}
        />
      </div>
      <CalculationActions title="Emergency Fund Calculation" onReset={resetInputs} />
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
