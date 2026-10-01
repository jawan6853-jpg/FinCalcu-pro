import React from 'react';
import { ToolItem } from '../../types';
import { CalculatorLayout } from '../common/CalculatorLayout';
import { ResultCard, CalculationActions } from '../common/ResultCard';
import { formatCurrency, formatPercentage } from '../../lib/formatters';
import { useUrlParamsState } from '../../lib/useUrlParamsState';
import { useCurrency } from '../../context/CurrencyContext';

// Calculations
import { calculateImpermanentLoss, ImpermanentLossInput } from '../../lib/calculators/impermanentLoss';
import { calculateCryptoApyToApr, CryptoApyToAprInput } from '../../lib/calculators/cryptoApyToApr';
import { calculateCryptoMining, CryptoMiningInput } from '../../lib/calculators/cryptoMining';
import { calculateBalloonLoan, BalloonLoanInput } from '../../lib/calculators/balloonLoan';
import { calculateHelocPayment, HelocPaymentInput } from '../../lib/calculators/helocPayment';
import { calculateBiweeklyMortgage, BiweeklyMortgageInput } from '../../lib/calculators/biweeklyMortgage';
import { calculateCapm, CapmInput } from '../../lib/calculators/capm';
import { calculateDividendPayoutRatio, DividendPayoutRatioInput } from '../../lib/calculators/dividendPayoutRatio';
import { calculatePortfolioRebalancing, PortfolioRebalancingInput } from '../../lib/calculators/portfolioRebalancing';
import { calculateWacc, WaccInput } from '../../lib/calculators/wacc';
import { calculateCdLadder, CdLadderInput } from '../../lib/calculators/cdLadder';
import { calculateCollegeSavings, CollegeSavingsInput } from '../../lib/calculators/collegeSavings';
import { calculateHighYieldSavings, HighYieldSavingsInput } from '../../lib/calculators/highYieldSavings';
import { calculateWorkingCapital, WorkingCapitalInput } from '../../lib/calculators/workingCapital';
import { calculateSalesTax, SalesTaxInput } from '../../lib/calculators/salesTax';

export interface CalculatorViewProps {
  tool: ToolItem;
  onNavigate: (route: string) => void;
}

// 1. IMPERMANENT LOSS VIEW
export const ImpermanentLossView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency } = useCurrency();
  const initial: ImpermanentLossInput = {
    tokenAInitialPrice: 2000,
    tokenAFinalPrice: 3500,
    tokenBInitialPrice: 1,
    tokenBFinalPrice: 1,
    initialDepositUsd: 1000,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<ImpermanentLossInput>(initial, 'il');
  const result = calculateImpermanentLoss(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Initial Deposit Value ({currency})
        </label>
        <input
          type="number"
          min="0"
          value={inputs.initialDepositUsd ?? ''}
          onChange={(e) => setInputs({ ...inputs, initialDepositUsd: Number(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Token A Initial Price ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.tokenAInitialPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, tokenAInitialPrice: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Token A Final Price ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.tokenAFinalPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, tokenAFinalPrice: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Impermanent Loss"
        value={formatPercentage(result.impermanentLossPercent, 2)}
        subtitle={result.summary}
        isHighlight={true}
        status={result.impermanentLossPercent < 0 ? 'negative' : 'neutral'}
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">HODL Value</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatCurrency(result.hodlValueUsd, currency)}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">LP Pool Value</p>
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(result.poolValueUsd, currency)}</p>
        </div>
      </div>
      <CalculationActions title={tool.name} onReset={resetInputs} />
    </div>
  );

  return <CalculatorLayout tool={tool} onNavigate={onNavigate} inputsComponent={inputsComponent} resultsComponent={resultsComponent} />;
};

// 2. CRYPTO APY TO APR VIEW
export const CryptoApyToAprView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency } = useCurrency();
  const initial: CryptoApyToAprInput = {
    conversionType: 'apyToApr',
    ratePercent: 14.5,
    compoundingFrequency: 'daily',
    stakedAmountUsd: 10000,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<CryptoApyToAprInput>(initial, 'apyapr');
  const result = calculateCryptoApyToApr(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, conversionType: 'apyToApr' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${inputs.conversionType === 'apyToApr' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Convert APY to APR
        </button>
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, conversionType: 'aprToApy' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${inputs.conversionType === 'aprToApy' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Convert APR to APY
        </button>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          {inputs.conversionType === 'apyToApr' ? 'Advertised APY (%)' : 'Advertised APR (%)'}
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={inputs.ratePercent ?? ''}
          onChange={(e) => setInputs({ ...inputs, ratePercent: Number(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Staked Capital ({currency})</label>
        <input
          type="number"
          min="0"
          value={inputs.stakedAmountUsd ?? ''}
          onChange={(e) => setInputs({ ...inputs, stakedAmountUsd: Number(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title={inputs.conversionType === 'apyToApr' ? 'Equivalent Base APR' : 'Effective Compounded APY'}
        value={formatPercentage(result.convertedRatePercent, 2)}
        subtitle={`Compounding advantage: +${result.effectiveCompoundingBoostPercent}%`}
        isHighlight={true}
        status="positive"
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Annual Staking Reward</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatCurrency(result.annualRewardUsd, currency)}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Daily Reward Yield</p>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(result.dailyRewardUsd, currency)}</p>
        </div>
      </div>
      <CalculationActions title={tool.name} onReset={resetInputs} />
    </div>
  );

  return <CalculatorLayout tool={tool} onNavigate={onNavigate} inputsComponent={inputsComponent} resultsComponent={resultsComponent} />;
};

// 3. CRYPTO MINING VIEW
export const CryptoMiningView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency } = useCurrency();
  const initial: CryptoMiningInput = {
    hashrateTh: 120,
    powerConsumptionWatts: 3300,
    electricityCostKwh: 0.06,
    miningPoolFeePercent: 2,
    hardwareCostUsd: 2800,
    dailyRevenuePerThUsd: 0.085,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<CryptoMiningInput>(initial, 'mining');
  const result = calculateCryptoMining(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Hashrate (TH/s)</label>
          <input
            type="number"
            min="0"
            value={inputs.hashrateTh ?? ''}
            onChange={(e) => setInputs({ ...inputs, hashrateTh: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Power Consumption (Watts)</label>
          <input
            type="number"
            min="0"
            value={inputs.powerConsumptionWatts ?? ''}
            onChange={(e) => setInputs({ ...inputs, powerConsumptionWatts: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Power Cost ($/kWh)</label>
          <input
            type="number"
            min="0"
            step="0.005"
            value={inputs.electricityCostKwh ?? ''}
            onChange={(e) => setInputs({ ...inputs, electricityCostKwh: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Hardware Price ({currency})</label>
          <input
            type="number"
            min="0"
            value={inputs.hardwareCostUsd ?? ''}
            onChange={(e) => setInputs({ ...inputs, hardwareCostUsd: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Daily Net Profit"
        value={formatCurrency(result.dailyNetProfitUsd, currency)}
        subtitle={`Monthly Net: ${formatCurrency(result.monthlyNetProfitUsd, currency)} • Margin: ${result.profitMarginPercent}%`}
        isHighlight={true}
        status={result.isProfitable ? 'positive' : 'negative'}
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Daily Power Cost</p>
          <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{formatCurrency(result.dailyPowerCostUsd, currency)}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Hardware Breakeven</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{result.breakEvenDays ? `${result.breakEvenDays} Days` : 'N/A'}</p>
        </div>
      </div>
      <CalculationActions title={tool.name} onReset={resetInputs} />
    </div>
  );

  return <CalculatorLayout tool={tool} onNavigate={onNavigate} inputsComponent={inputsComponent} resultsComponent={resultsComponent} />;
};

// 4. BALLOON LOAN VIEW
export const BalloonLoanView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency } = useCurrency();
  const initial: BalloonLoanInput = {
    loanAmount: 250000,
    annualInterestRate: 6.5,
    amortizationYears: 30,
    balloonMaturityYears: 7,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<BalloonLoanInput>(initial, 'balloon');
  const result = calculateBalloonLoan(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Loan Principal ({currency})</label>
        <input
          type="number"
          min="0"
          value={inputs.loanAmount ?? ''}
          onChange={(e) => setInputs({ ...inputs, loanAmount: Number(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Interest Rate (%)</label>
          <input
            type="number"
            min="0"
            step="0.05"
            value={inputs.annualInterestRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, annualInterestRate: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Amortization (Yrs)</label>
          <input
            type="number"
            min="1"
            value={inputs.amortizationYears ?? ''}
            onChange={(e) => setInputs({ ...inputs, amortizationYears: Number(e.target.value) || 1 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Balloon Term (Yrs)</label>
          <input
            type="number"
            min="1"
            value={inputs.balloonMaturityYears ?? ''}
            onChange={(e) => setInputs({ ...inputs, balloonMaturityYears: Number(e.target.value) || 1 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Lump-Sum Balloon Due"
        value={formatCurrency(result.balloonPaymentDue, currency)}
        subtitle={result.summary}
        isHighlight={true}
        status="neutral"
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Monthly Payment</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatCurrency(result.monthlyPayment, currency)}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Interest Paid</p>
          <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{formatCurrency(result.totalInterestPaidBeforeBalloon, currency)}</p>
        </div>
      </div>
      <CalculationActions title={tool.name} onReset={resetInputs} />
    </div>
  );

  return <CalculatorLayout tool={tool} onNavigate={onNavigate} inputsComponent={inputsComponent} resultsComponent={resultsComponent} />;
};

// 5. HELOC PAYMENT VIEW
export const HelocPaymentView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency } = useCurrency();
  const initial: HelocPaymentInput = {
    creditLineAmount: 100000,
    drawAmount: 60000,
    interestRate: 8.5,
    drawPeriodYears: 10,
    repaymentPeriodYears: 20,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<HelocPaymentInput>(initial, 'heloc');
  const result = calculateHelocPayment(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Credit Line ({currency})</label>
          <input
            type="number"
            min="0"
            value={inputs.creditLineAmount ?? ''}
            onChange={(e) => setInputs({ ...inputs, creditLineAmount: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Draw Amount ({currency})</label>
          <input
            type="number"
            min="0"
            value={inputs.drawAmount ?? ''}
            onChange={(e) => setInputs({ ...inputs, drawAmount: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Interest Rate (%)</label>
        <input
          type="number"
          min="0"
          step="0.1"
          value={inputs.interestRate ?? ''}
          onChange={(e) => setInputs({ ...inputs, interestRate: Number(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Draw Phase Payment (Interest-Only)"
        value={`${formatCurrency(result.drawPeriodMonthlyPayment, currency)} / mo`}
        subtitle={`Repayment Phase (P&I): ${formatCurrency(result.repaymentPeriodMonthlyPayment, currency)} / mo`}
        isHighlight={true}
        status="neutral"
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Interest (Draw)</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatCurrency(result.totalInterestDrawPeriod, currency)}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Interest (Repay)</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatCurrency(result.totalInterestRepaymentPeriod, currency)}</p>
        </div>
      </div>
      <CalculationActions title={tool.name} onReset={resetInputs} />
    </div>
  );

  return <CalculatorLayout tool={tool} onNavigate={onNavigate} inputsComponent={inputsComponent} resultsComponent={resultsComponent} />;
};

// 6. BI-WEEKLY MORTGAGE VIEW
export const BiweeklyMortgageView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency } = useCurrency();
  const initial: BiweeklyMortgageInput = {
    loanAmount: 350000,
    interestRate: 6.75,
    loanTermYears: 30,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<BiweeklyMortgageInput>(initial, 'biweekly');
  const result = calculateBiweeklyMortgage(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mortgage Amount ({currency})</label>
        <input
          type="number"
          min="0"
          value={inputs.loanAmount ?? ''}
          onChange={(e) => setInputs({ ...inputs, loanAmount: Number(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Interest Rate (%)</label>
          <input
            type="number"
            min="0"
            step="0.05"
            value={inputs.interestRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, interestRate: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Term (Years)</label>
          <input
            type="number"
            min="1"
            value={inputs.loanTermYears ?? ''}
            onChange={(e) => setInputs({ ...inputs, loanTermYears: Number(e.target.value) || 1 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Total Interest Saved"
        value={formatCurrency(result.interestSaved, currency)}
        subtitle={`Payoff accelerated by ${result.yearsSaved} years (${result.monthsSaved} months saved)`}
        isHighlight={true}
        status="positive"
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Bi-Weekly Payment</p>
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(result.biweeklyPayment, currency)}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">New Payoff Term</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{result.yearsToPayoffBiweekly} Years</p>
        </div>
      </div>
      <CalculationActions title={tool.name} onReset={resetInputs} />
    </div>
  );

  return <CalculatorLayout tool={tool} onNavigate={onNavigate} inputsComponent={inputsComponent} resultsComponent={resultsComponent} />;
};

// 7. CAPM VIEW
export const CapmView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const initial: CapmInput = {
    riskFreeRatePercent: 4.25,
    beta: 1.25,
    expectedMarketReturnPercent: 10.0,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<CapmInput>(initial, 'capm');
  const result = calculateCapm(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Risk-Free Rate (Rf %)</label>
        <input
          type="number"
          min="0"
          step="0.05"
          value={inputs.riskFreeRatePercent ?? ''}
          onChange={(e) => setInputs({ ...inputs, riskFreeRatePercent: Number(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Asset Beta (β)</label>
          <input
            type="number"
            step="0.05"
            value={inputs.beta ?? ''}
            onChange={(e) => setInputs({ ...inputs, beta: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Market Return E(Rm %)</label>
          <input
            type="number"
            step="0.1"
            value={inputs.expectedMarketReturnPercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, expectedMarketReturnPercent: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="CAPM Expected Return E(R)"
        value={formatPercentage(result.expectedReturnPercent, 2)}
        subtitle={result.interpretation}
        isHighlight={true}
        status="positive"
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Equity Risk Premium</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{result.equityRiskPremiumPercent}%</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Risk Profile</p>
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">{result.riskProfile}</p>
        </div>
      </div>
      <CalculationActions title={tool.name} onReset={resetInputs} />
    </div>
  );

  return <CalculatorLayout tool={tool} onNavigate={onNavigate} inputsComponent={inputsComponent} resultsComponent={resultsComponent} />;
};

// 8. DIVIDEND PAYOUT RATIO VIEW
export const DividendPayoutRatioView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency } = useCurrency();
  const initial: DividendPayoutRatioInput = {
    dividendPerShare: 3.5,
    earningsPerShare: 7.0,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<DividendPayoutRatioInput>(initial, 'payout');
  const result = calculateDividendPayoutRatio(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Dividend Per Share ({currency})</label>
          <input
            type="number"
            min="0"
            step="0.05"
            value={inputs.dividendPerShare ?? ''}
            onChange={(e) => setInputs({ ...inputs, dividendPerShare: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Earnings Per Share (EPS)</label>
          <input
            type="number"
            step="0.05"
            value={inputs.earningsPerShare ?? ''}
            onChange={(e) => setInputs({ ...inputs, earningsPerShare: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Dividend Payout Ratio"
        value={formatPercentage(result.payoutRatioPercent, 2)}
        subtitle={result.summary}
        isHighlight={true}
        status={result.payoutRatioPercent > 80 ? 'negative' : 'positive'}
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Retention Ratio</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{result.retentionRatioPercent}%</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Sustainability Tier</p>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">{result.sustainabilityStatus}</p>
        </div>
      </div>
      <CalculationActions title={tool.name} onReset={resetInputs} />
    </div>
  );

  return <CalculatorLayout tool={tool} onNavigate={onNavigate} inputsComponent={inputsComponent} resultsComponent={resultsComponent} />;
};

// 9. PORTFOLIO REBALANCING VIEW
export const PortfolioRebalancingView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency } = useCurrency();
  const initial: PortfolioRebalancingInput = {
    additionalCashInjection: 0,
    holdings: [
      { name: 'US Equities', currentValue: 70000, targetPercent: 60 },
      { name: 'International', currentValue: 15000, targetPercent: 20 },
      { name: 'Bonds & Notes', currentValue: 10000, targetPercent: 15 },
      { name: 'Crypto & Alts', currentValue: 5000, targetPercent: 5 },
    ],
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<PortfolioRebalancingInput>(initial, 'rebalance');
  const result = calculatePortfolioRebalancing(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">New Cash to Add ({currency})</label>
        <input
          type="number"
          min="0"
          value={inputs.additionalCashInjection ?? ''}
          onChange={(e) => setInputs({ ...inputs, additionalCashInjection: Number(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Holdings & Target Weights</p>
        {inputs.holdings.map((h, i) => (
          <div key={i} className="flex gap-2 items-center text-xs">
            <span className="w-28 font-medium truncate">{h.name}:</span>
            <input
              type="number"
              min="0"
              value={h.currentValue}
              onChange={(e) => {
                const updated = [...inputs.holdings];
                updated[i].currentValue = Number(e.target.value) || 0;
                setInputs({ ...inputs, holdings: updated });
              }}
              className="flex-1 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
            <span className="text-slate-400">Target %:</span>
            <input
              type="number"
              min="0"
              max="100"
              value={h.targetPercent}
              onChange={(e) => {
                const updated = [...inputs.holdings];
                updated[i].targetPercent = Number(e.target.value) || 0;
                setInputs({ ...inputs, holdings: updated });
              }}
              className="w-16 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Total Portfolio"
        value={formatCurrency(result.totalNewValue, currency)}
        subtitle={`Max Allocation Drift: ${result.maxDriftPercent}%`}
        isHighlight={true}
        status="neutral"
      />
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Recommended Orders</p>
        {result.actions.map((act, i) => (
          <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200">{act.name}</span>
              <p className="text-slate-500">Current: {act.currentWeightPercent}% → Target: {act.targetPercent}%</p>
            </div>
            <span className={`px-2 py-1 rounded font-bold ${act.action === 'BUY' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : act.action === 'SELL' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-200 text-slate-700'}`}>
              {act.action} {formatCurrency(act.adjustmentAmount, currency)}
            </span>
          </div>
        ))}
      </div>
      <CalculationActions title={tool.name} onReset={resetInputs} />
    </div>
  );

  return <CalculatorLayout tool={tool} onNavigate={onNavigate} inputsComponent={inputsComponent} resultsComponent={resultsComponent} />;
};

// 10. WACC VIEW
export const WaccView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const initial: WaccInput = {
    equityMarketValue: 8000000,
    debtMarketValue: 2000000,
    costOfEquityPercent: 11.0,
    costOfDebtPercent: 6.0,
    corporateTaxRatePercent: 21.0,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<WaccInput>(initial, 'wacc');
  const result = calculateWacc(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Equity Market Value (E)</label>
          <input
            type="number"
            min="0"
            value={inputs.equityMarketValue ?? ''}
            onChange={(e) => setInputs({ ...inputs, equityMarketValue: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Debt Market Value (D)</label>
          <input
            type="number"
            min="0"
            value={inputs.debtMarketValue ?? ''}
            onChange={(e) => setInputs({ ...inputs, debtMarketValue: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cost of Equity (Re %)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={inputs.costOfEquityPercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, costOfEquityPercent: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cost of Debt (Rd %)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={inputs.costOfDebtPercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, costOfDebtPercent: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tax Rate (Tc %)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={inputs.corporateTaxRatePercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, corporateTaxRatePercent: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Weighted Average Cost of Capital (WACC)"
        value={formatPercentage(result.waccPercent, 2)}
        subtitle={result.summary}
        isHighlight={true}
        status="neutral"
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Equity Weight</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{result.equityWeightPercent}%</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">After-Tax Debt Cost</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{result.afterTaxCostOfDebtPercent}%</p>
        </div>
      </div>
      <CalculationActions title={tool.name} onReset={resetInputs} />
    </div>
  );

  return <CalculatorLayout tool={tool} onNavigate={onNavigate} inputsComponent={inputsComponent} resultsComponent={resultsComponent} />;
};

// 11. CD LADDER VIEW
export const CdLadderView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency } = useCurrency();
  const initial: CdLadderInput = {
    totalInvestment: 50000,
    baseApyPercent: 4.75,
    rungCount: 5,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<CdLadderInput>(initial, 'cdladder');
  const result = calculateCdLadder(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Capital to Deposit ({currency})</label>
        <input
          type="number"
          min="0"
          value={inputs.totalInvestment ?? ''}
          onChange={(e) => setInputs({ ...inputs, totalInvestment: Number(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Baseline 1-Year APY (%)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={inputs.baseApyPercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, baseApyPercent: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Number of Rungs (Years)</label>
          <input
            type="number"
            min="3"
            max="5"
            value={inputs.rungCount ?? ''}
            onChange={(e) => setInputs({ ...inputs, rungCount: Number(e.target.value) || 5 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Weighted Average APY"
        value={formatPercentage(result.averageWeightedApyPercent, 2)}
        subtitle={result.liquiditySchedule}
        isHighlight={true}
        status="positive"
      />
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Ladder Maturity Schedule</p>
        {result.rungs.map((r, i) => (
          <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200">{r.label} ({r.apyPercent}% APY)</span>
              <p className="text-slate-500">Deposit: {formatCurrency(r.depositAmount, currency)}</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">+{formatCurrency(r.interestEarned, currency)}</span>
              <p className="text-slate-500">Matures: {formatCurrency(r.maturityValue, currency)}</p>
            </div>
          </div>
        ))}
      </div>
      <CalculationActions title={tool.name} onReset={resetInputs} />
    </div>
  );

  return <CalculatorLayout tool={tool} onNavigate={onNavigate} inputsComponent={inputsComponent} resultsComponent={resultsComponent} />;
};

// 12. COLLEGE SAVINGS VIEW
export const CollegeSavingsView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency } = useCurrency();
  const initial: CollegeSavingsInput = {
    childCurrentAge: 3,
    collegeStartAge: 18,
    collegeDurationYears: 4,
    currentAnnualCollegeCost: 32000,
    tuitionInflationRatePercent: 4.5,
    currentSavings: 10000,
    expectedAnnualReturnPercent: 7.0,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<CollegeSavingsInput>(initial, 'college');
  const result = calculateCollegeSavings(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Child's Current Age</label>
          <input
            type="number"
            min="0"
            max="17"
            value={inputs.childCurrentAge ?? ''}
            onChange={(e) => setInputs({ ...inputs, childCurrentAge: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Today's Annual Cost ({currency})</label>
          <input
            type="number"
            min="0"
            value={inputs.currentAnnualCollegeCost ?? ''}
            onChange={(e) => setInputs({ ...inputs, currentAnnualCollegeCost: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current 529 Balance ({currency})</label>
          <input
            type="number"
            min="0"
            value={inputs.currentSavings ?? ''}
            onChange={(e) => setInputs({ ...inputs, currentSavings: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Expected Return (%)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={inputs.expectedAnnualReturnPercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, expectedAnnualReturnPercent: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Required Monthly Savings"
        value={`${formatCurrency(result.monthlyContributionRequired, currency)} / mo`}
        subtitle={`To fund ${formatCurrency(result.projectedTotalCollegeCost, currency)} across 4 college years`}
        isHighlight={true}
        status="neutral"
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Projected 4-Yr Tuition</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatCurrency(result.projectedTotalCollegeCost, currency)}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Current Balance at 18</p>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(result.futureValueOfCurrentSavings, currency)}</p>
        </div>
      </div>
      <CalculationActions title={tool.name} onReset={resetInputs} />
    </div>
  );

  return <CalculatorLayout tool={tool} onNavigate={onNavigate} inputsComponent={inputsComponent} resultsComponent={resultsComponent} />;
};

// 13. HIGH YIELD SAVINGS VIEW
export const HighYieldSavingsView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency } = useCurrency();
  const initial: HighYieldSavingsInput = {
    initialDeposit: 25000,
    monthlyDeposit: 300,
    highYieldApyPercent: 4.85,
    traditionalBankApyPercent: 0.01,
    years: 3,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<HighYieldSavingsInput>(initial, 'hysa');
  const result = calculateHighYieldSavings(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Deposit ({currency})</label>
          <input
            type="number"
            min="0"
            value={inputs.initialDeposit ?? ''}
            onChange={(e) => setInputs({ ...inputs, initialDeposit: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Monthly Deposit ({currency})</label>
          <input
            type="number"
            min="0"
            value={inputs.monthlyDeposit ?? ''}
            onChange={(e) => setInputs({ ...inputs, monthlyDeposit: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">HYSA APY (%)</label>
          <input
            type="number"
            min="0"
            step="0.05"
            value={inputs.highYieldApyPercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, highYieldApyPercent: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Time Horizon (Years)</label>
          <input
            type="number"
            min="1"
            value={inputs.years ?? ''}
            onChange={(e) => setInputs({ ...inputs, years: Number(e.target.value) || 1 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="HYSA Ending Balance"
        value={formatCurrency(result.highYieldEndingBalance, currency)}
        subtitle={`Earned ${formatCurrency(result.highYieldTotalInterest, currency)} interest vs only ${formatCurrency(result.traditionalTotalInterest, currency)} at a big bank`}
        isHighlight={true}
        status="positive"
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Extra Earnings</p>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">+{formatCurrency(result.additionalInterestEarned, currency)}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Multiplier Advantage</p>
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{result.multiplierGain}x More</p>
        </div>
      </div>
      <CalculationActions title={tool.name} onReset={resetInputs} />
    </div>
  );

  return <CalculatorLayout tool={tool} onNavigate={onNavigate} inputsComponent={inputsComponent} resultsComponent={resultsComponent} />;
};

// 14. WORKING CAPITAL VIEW
export const WorkingCapitalView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency } = useCurrency();
  const initial: WorkingCapitalInput = {
    cashAndEquivalents: 85000,
    accountsReceivable: 45000,
    inventory: 30000,
    otherCurrentAssets: 10000,
    accountsPayable: 40000,
    shortTermDebt: 20000,
    otherCurrentLiabilities: 15000,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<WorkingCapitalInput>(initial, 'wkcap');
  const result = calculateWorkingCapital(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cash & Equivalents ({currency})</label>
          <input
            type="number"
            min="0"
            value={inputs.cashAndEquivalents ?? ''}
            onChange={(e) => setInputs({ ...inputs, cashAndEquivalents: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Accounts Receivable ({currency})</label>
          <input
            type="number"
            min="0"
            value={inputs.accountsReceivable ?? ''}
            onChange={(e) => setInputs({ ...inputs, accountsReceivable: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Accounts Payable ({currency})</label>
          <input
            type="number"
            min="0"
            value={inputs.accountsPayable ?? ''}
            onChange={(e) => setInputs({ ...inputs, accountsPayable: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Short-Term Debt ({currency})</label>
          <input
            type="number"
            min="0"
            value={inputs.shortTermDebt ?? ''}
            onChange={(e) => setInputs({ ...inputs, shortTermDebt: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title="Net Working Capital"
        value={formatCurrency(result.workingCapital, currency)}
        subtitle={result.summary}
        isHighlight={true}
        status={result.workingCapital > 0 ? 'positive' : 'negative'}
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Current Ratio</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{result.currentRatio}x</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Quick Ratio (Acid-Test)</p>
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{result.quickRatio}x</p>
        </div>
      </div>
      <CalculationActions title={tool.name} onReset={resetInputs} />
    </div>
  );

  return <CalculatorLayout tool={tool} onNavigate={onNavigate} inputsComponent={inputsComponent} resultsComponent={resultsComponent} />;
};

// 15. SALES TAX VIEW
export const SalesTaxView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency } = useCurrency();
  const initial: SalesTaxInput = {
    mode: 'add-tax',
    amount: 150,
    salesTaxPercent: 8.25,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<SalesTaxInput>(initial, 'salestax');
  const result = calculateSalesTax(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, mode: 'add-tax' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${inputs.mode === 'add-tax' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Add Sales Tax (Forward)
        </button>
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, mode: 'reverse-tax' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${inputs.mode === 'reverse-tax' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Extract Pre-Tax (Reverse)
        </button>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          {inputs.mode === 'add-tax' ? `Pre-Tax Net Price (${currency})` : `Total Receipt / Gross Price (${currency})`}
        </label>
        <input
          type="number"
          min="0"
          value={inputs.amount ?? ''}
          onChange={(e) => setInputs({ ...inputs, amount: Number(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Sales Tax Rate (%)</label>
        <input
          type="number"
          min="0"
          step="0.05"
          value={inputs.salesTaxPercent ?? ''}
          onChange={(e) => setInputs({ ...inputs, salesTaxPercent: Number(e.target.value) || 0 })}
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <ResultCard
        title={inputs.mode === 'add-tax' ? 'Total with Sales Tax' : 'Pre-Tax Base Amount'}
        value={formatCurrency(inputs.mode === 'add-tax' ? result.totalWithTax : result.preTaxAmount, currency)}
        subtitle={`Sales Tax Portion: ${formatCurrency(result.taxAmount, currency)} (${result.effectiveTaxRatePercent}%)`}
        isHighlight={true}
        status="neutral"
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Pre-Tax Base</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatCurrency(result.preTaxAmount, currency)}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Tax Collected</p>
          <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{formatCurrency(result.taxAmount, currency)}</p>
        </div>
      </div>
      <CalculationActions title={tool.name} onReset={resetInputs} />
    </div>
  );

  return <CalculatorLayout tool={tool} onNavigate={onNavigate} inputsComponent={inputsComponent} resultsComponent={resultsComponent} />;
};
