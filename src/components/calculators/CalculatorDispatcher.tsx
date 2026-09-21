import React, { useState } from 'react';
import { ToolItem } from '../../types';
import { CalculatorLayout } from '../common/CalculatorLayout';
import { ResultCard, CalculationActions } from '../common/ResultCard';
import { DonutChart, AreaGrowthChart } from '../common/SimpleChart';
import { AmortizationTable } from '../common/AmortizationTable';
import { formatCurrency, formatNumber, formatPercentage } from '../../lib/formatters';
import { useUrlParamsState } from '../../lib/useUrlParamsState';
import { useCurrency } from '../../context/CurrencyContext';

// Calculators Logic
import { calculateCryptoProfit, CryptoProfitInput } from '../../lib/calculators/cryptoProfit';
import { calculateCryptoROI, CryptoROIInput } from '../../lib/calculators/cryptoROI';
import { calculateCryptoDCA, CryptoDCAInput } from '../../lib/calculators/cryptoDCA';
import { calculateCryptoStaking, CryptoStakingInput, CompoundingFrequency } from '../../lib/calculators/staking';
import { calculateCryptoTradingFee, CryptoTradingFeeInput } from '../../lib/calculators/tradingFee';
import { calculateCryptoBreakEven, CryptoBreakEvenInput } from '../../lib/calculators/breakEven';
import { calculateCryptoPositionSize, CryptoPositionSizeInput } from '../../lib/calculators/positionSize';
import { calculateCryptoCompound, CryptoCompoundInput } from '../../lib/calculators/cryptoCompound';
import { calculateCryptoTax, CryptoTaxInput } from '../../lib/calculators/cryptoTax';
import { calculateLoanEMI, LoanInput } from '../../lib/calculators/loan';
import { calculateSIP, SIPInput } from '../../lib/calculators/sip';
import { calculateCompoundInterest, CompoundInterestInput } from '../../lib/calculators/compoundInterest';
import { calculateInvestmentReturn, InvestmentReturnInput } from '../../lib/calculators/investmentReturn';
import { calculateSavings, SavingsInput } from '../../lib/calculators/savings';
import { calculateMortgage, MortgageInput } from '../../lib/calculators/mortgage';

interface CalculatorViewProps {
  tool: ToolItem;
  onNavigate: (route: string) => void;
}

// 1. CRYPTO PROFIT
export const CryptoProfitView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, setCurrency, currencySymbol } = useCurrency();

  const initialValues: CryptoProfitInput = {
    buyPrice: 50000,
    sellPrice: 65000,
    quantity: 0.75,
    buyFee: 0.1,
    sellFee: 0.1,
    feeType: 'percentage',
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<CryptoProfitInput>(initialValues, 'profit');
  const result = calculateCryptoProfit(inputs);

  // Quick single trading fee shortcut state (when user enters unified fee %)
  const [tradingFeePercent, setTradingFeePercent] = useState<number>(inputs.buyFee || 0.1);

  const handleUnifiedTradingFeeChange = (val: number) => {
    setTradingFeePercent(val);
    setInputs({
      ...inputs,
      buyFee: val,
      sellFee: val,
      feeType: 'percentage',
    });
  };

  // Popular coin quick presets for professional UX
  const popularPresets = [
    { name: 'BTC', buy: 62000, sell: 68500, qty: 0.25 },
    { name: 'ETH', buy: 2450, sell: 2900, qty: 1.5 },
    { name: 'SOL', buy: 135, sell: 165, qty: 15 },
  ];

  const currencyOptions: { code: 'USD' | 'PKR' | 'INR' | 'EUR'; symbol: string; flag: string }[] = [
    { code: 'USD', symbol: '$', flag: '🇺🇸' },
    { code: 'PKR', symbol: 'Rs', flag: '🇵🇰' },
    { code: 'INR', symbol: '₹', flag: '🇮🇳' },
    { code: 'EUR', symbol: '€', flag: '🇪🇺' },
  ];

  const inputsComponent = (
    <div className="space-y-4">
      {/* Quick Coin Presets & Currency Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Quick Coin Scenarios:
          </span>
          <div className="flex flex-wrap gap-2">
            {popularPresets.map((coin) => (
              <button
                key={coin.name}
                type="button"
                onClick={() =>
                  setInputs({
                    ...inputs,
                    buyPrice: coin.buy,
                    sellPrice: coin.sell,
                    quantity: coin.qty,
                  })
                }
                className="px-2.5 py-1 text-xs rounded-lg font-mono font-medium border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors cursor-pointer"
              >
                {coin.name} Demo
              </button>
            ))}
          </div>
        </div>

        {/* Currency Selector Dropdown (USD, PKR, INR, EUR) */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Currency:
          </label>
          <select
            value={['USD', 'PKR', 'INR', 'EUR'].includes(currency) ? currency : 'USD'}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500 font-mono cursor-pointer"
            aria-label="Select calculator currency (USD, PKR, INR, EUR)"
          >
            {currencyOptions.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.flag} {opt.code} ({opt.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Buy / Entry Price ({currencySymbol})
            </label>
            <span className="text-[11px] font-mono text-slate-400">Per Coin</span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
              {currencySymbol}
            </span>
            <input
              type="number"
              min="0"
              step="any"
              value={inputs.buyPrice || ''}
              onChange={(e) => setInputs({ ...inputs, buyPrice: parseFloat(e.target.value) || 0 })}
              className="w-full pl-8 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
              placeholder="50000"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Sell / Exit Price ({currencySymbol})
            </label>
            <span className="text-[11px] font-mono text-slate-400">Target Exit</span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
              {currencySymbol}
            </span>
            <input
              type="number"
              min="0"
              step="any"
              value={inputs.sellPrice || ''}
              onChange={(e) => setInputs({ ...inputs, sellPrice: parseFloat(e.target.value) || 0 })}
              className="w-full pl-8 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
              placeholder="65000"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Quantity of Crypto Coins
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.quantity || ''}
          onChange={(e) => setInputs({ ...inputs, quantity: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="0.75"
        />
      </div>

      {/* Trading Fees (%) Input Field */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span>Trading Fees (%)</span>
            <span className="text-[10px] font-normal text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded font-mono">
              100% accurate PnL
            </span>
          </label>
          <span className="text-[11px] font-mono text-slate-500">
            Maker / Taker Avg
          </span>
        </div>
        <div className="relative mb-2">
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={tradingFeePercent}
            onChange={(e) => handleUnifiedTradingFeeChange(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="0.1"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
            %
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Popular exchange presets:</span>
          <div className="flex items-center gap-1.5 font-mono">
            {[0.075, 0.1, 0.2, 0.5].map((fee) => (
              <button
                key={fee}
                type="button"
                onClick={() => handleUnifiedTradingFeeChange(fee)}
                className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-[10px] cursor-pointer"
              >
                {fee}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Detailed Fee Customization
          </span>
          <div className="flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 text-[11px]">
            <button
              type="button"
              onClick={() => setInputs({ ...inputs, feeType: 'percentage' })}
              className={`px-2.5 py-0.5 rounded font-medium ${
                inputs.feeType === 'percentage'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 font-bold shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              % Rate
            </button>
            <button
              type="button"
              onClick={() => setInputs({ ...inputs, feeType: 'flat' })}
              className={`px-2.5 py-0.5 rounded font-medium ${
                inputs.feeType === 'flat'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 font-bold shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Flat ({currencySymbol})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">
              Buy Fee ({inputs.feeType === 'percentage' ? '%' : currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={inputs.buyFee || ''}
              onChange={(e) => setInputs({ ...inputs, buyFee: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">
              Sell Fee ({inputs.feeType === 'percentage' ? '%' : currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={inputs.sellFee || ''}
              onChange={(e) => setInputs({ ...inputs, sellFee: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ResultCard
          title="Net Profit / Loss"
          value={formatCurrency(result.netProfit)}
          badge={result.isProfit ? 'PROFIT' : 'LOSS'}
          status={result.isProfit ? 'positive' : 'negative'}
          subtitle={`After deducting ${formatCurrency(result.totalFees)} exchange fees`}
          isHighlight
        />
        <ResultCard
          title="Return on Investment (ROI)"
          value={formatPercentage(result.roi)}
          status={result.isProfit ? 'positive' : 'negative'}
          subtitle="Net return on invested capital"
        />
        <ResultCard
          title="Total Cost of Purchase"
          value={formatCurrency(result.totalInvestment)}
          subtitle="Purchase price + buy fee"
        />
        <ResultCard
          title="Net Sale Proceeds"
          value={formatCurrency(result.netRevenue)}
          subtitle="Gross payout minus sell fee"
        />
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
        <span className="text-slate-500">Break-Even Exit Target:</span>
        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
          {formatCurrency(result.breakEvenSellPrice)} / coin
        </span>
      </div>

      <CalculationActions
        title="Crypto Profit Calculation"
        onReset={resetInputs}
      />
    </div>
  );

  const chart = (
    <DonutChart
      slices={[
        { label: 'Initial Outlay', value: result.grossCost, color: '#6366f1' },
        { label: 'Exchange Fees', value: result.totalFees, color: '#f59e0b' },
        {
          label: result.isProfit ? 'Net Profit' : 'Loss',
          value: Math.abs(result.netProfit),
          color: result.isProfit ? '#10b981' : '#f43f5e',
        },
      ]}
      centerLabel={result.isProfit ? 'ROI' : 'Loss'}
      centerValue={formatPercentage(result.roi)}
    />
  );

  return (
    <CalculatorLayout
      tool={tool}
      inputsComponent={inputsComponent}
      resultsComponent={resultsComponent}
      chartComponent={chart}
      mobileQuickSummary={{
        label: result.isProfit ? 'Net Profit' : 'Net Loss',
        value: formatCurrency(result.netProfit),
        subValue: `ROI: ${formatPercentage(result.roi)}`,
        status: result.isProfit ? 'positive' : 'negative',
      }}
      onNavigate={onNavigate}
    />
  );
};

// 2. CRYPTO ROI
export const CryptoROIView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const initialValues: CryptoROIInput = {
    initialInvestment: 3000,
    currentValue: 8400,
  };
  const [inputs, setInputs] = useState<CryptoROIInput>(initialValues);
  const result = calculateCryptoROI(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Initial Capital Invested ($)
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.initialInvestment || ''}
          onChange={(e) => setInputs({ ...inputs, initialInvestment: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="3000"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Current or Projected Value ($)
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.currentValue || ''}
          onChange={(e) => setInputs({ ...inputs, currentValue: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="8400"
        />
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ResultCard
          title="Return on Investment"
          value={formatPercentage(result.roi)}
          status={result.isProfit ? 'positive' : 'negative'}
          badge={result.isProfit ? 'GAIN' : 'LOSS'}
          isHighlight
        />
        <ResultCard
          title="Capital Multiplier"
          value={`${result.multiplier.toFixed(2)}x`}
          subtitle="Relative to initial capital"
        />
        <ResultCard
          title="Net Capital Gain / Loss"
          value={formatCurrency(result.netProfit)}
          status={result.isProfit ? 'positive' : 'negative'}
          subtitle={result.isProfit ? 'Net profit generated' : 'Capital lost'}
        />
        <ResultCard
          title="Total Position Value"
          value={formatCurrency(result.currentValue)}
          subtitle="Current total valuation"
        />
      </div>

      <CalculationActions
        title="Crypto ROI Calculation"
        onReset={() => setInputs(initialValues)}
      />
    </div>
  );

  const chart = (
    <DonutChart
      slices={[
        { label: 'Initial Capital', value: result.initialInvestment, color: '#6366f1' },
        {
          label: result.isProfit ? 'Net Growth' : 'Loss',
          value: Math.abs(result.netProfit),
          color: result.isProfit ? '#10b981' : '#f43f5e',
        },
      ]}
      centerLabel="ROI"
      centerValue={formatPercentage(result.roi)}
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

// 3. CRYPTO DCA
export const CryptoDCAView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const initialValues: CryptoDCAInput = {
    initialInvestment: 500,
    recurringInvestment: 100,
    periods: 24,
    frequency: 'weekly',
    averagePurchasePrice: 58000,
    currentPrice: 72000,
  };
  const [inputs, setInputs] = useState<CryptoDCAInput>(initialValues);
  const result = calculateCryptoDCA(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Initial Starting Amount ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.initialInvestment || ''}
            onChange={(e) => setInputs({ ...inputs, initialInvestment: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Recurring Investment ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.recurringInvestment || ''}
            onChange={(e) => setInputs({ ...inputs, recurringInvestment: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Cadence
          </label>
          <select
            value={inputs.frequency}
            onChange={(e) => setInputs({ ...inputs, frequency: e.target.value as any })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Every 2 Weeks</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Installment Periods
          </label>
          <input
            type="number"
            min="1"
            max="360"
            value={inputs.periods || ''}
            onChange={(e) => setInputs({ ...inputs, periods: parseInt(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="24"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Average Buy Price ($)
          </label>
          <input
            type="number"
            min="0.0001"
            step="any"
            value={inputs.averagePurchasePrice || ''}
            onChange={(e) => setInputs({ ...inputs, averagePurchasePrice: parseFloat(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="58000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Current Market Price ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.currentPrice || ''}
            onChange={(e) => setInputs({ ...inputs, currentPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="72000"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ResultCard
          title="Portfolio Valuation"
          value={formatCurrency(result.currentValue)}
          badge={result.isProfit ? 'PROFIT' : 'LOSS'}
          status={result.isProfit ? 'positive' : 'negative'}
          subtitle={`Accumulated ${result.cryptoAcquired.toFixed(6)} tokens`}
          isHighlight
        />
        <ResultCard
          title="Total Capital Invested"
          value={formatCurrency(result.totalInvested)}
          subtitle={`${inputs.periods} recurring buys + initial`}
        />
        <ResultCard
          title="Net Profit / Loss"
          value={formatCurrency(result.netProfit)}
          status={result.isProfit ? 'positive' : 'negative'}
          subtitle="Unrealized gain/loss"
        />
        <ResultCard
          title="DCA Return (ROI)"
          value={formatPercentage(result.roi)}
          status={result.isProfit ? 'positive' : 'negative'}
          subtitle="Total ROI on capital"
        />
      </div>

      <CalculationActions
        title="Crypto DCA Simulation"
        onReset={() => setInputs(initialValues)}
      />
    </div>
  );

  const chart = (
    <AreaGrowthChart
      data={result.schedule.map((pt) => ({
        label: `P${pt.period}`,
        invested: pt.totalInvested,
        total: pt.currentValue,
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

// 4. CRYPTO STAKING
export const CryptoStakingView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const initialValues: CryptoStakingInput = {
    principal: 25,
    rate: 6.8,
    durationDays: 365,
    compoundingFrequency: 'daily',
  };
  const [inputs, setInputs] = useState<CryptoStakingInput>(initialValues);
  const result = calculateCryptoStaking(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Staked Amount (Tokens or Value)
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.principal || ''}
          onChange={(e) => setInputs({ ...inputs, principal: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="25"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Staking Rate (% APY / APR)
          </label>
          <input
            type="number"
            min="0"
            step="0.05"
            value={inputs.rate || ''}
            onChange={(e) => setInputs({ ...inputs, rate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="6.8"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Duration (Days)
          </label>
          <input
            type="number"
            min="1"
            max="1825"
            value={inputs.durationDays || ''}
            onChange={(e) => setInputs({ ...inputs, durationDays: parseInt(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="365"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Compounding Frequency
        </label>
        <select
          value={inputs.compoundingFrequency}
          onChange={(e) => setInputs({ ...inputs, compoundingFrequency: e.target.value as CompoundingFrequency })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
        >
          <option value="none">No Compounding (Simple APR)</option>
          <option value="daily">Daily Auto-Compounding</option>
          <option value="weekly">Weekly Auto-Compounding</option>
          <option value="monthly">Monthly Auto-Compounding</option>
          <option value="yearly">Yearly Compounding</option>
        </select>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ResultCard
          title="Total Staking Rewards"
          value={`+${formatNumber(result.totalReward, 4)}`}
          badge="YIELD"
          status="positive"
          subtitle={`Across ${inputs.durationDays} days`}
          isHighlight
        />
        <ResultCard
          title="Ending Token Balance"
          value={formatNumber(result.finalBalance, 4)}
          subtitle="Principal + total accumulated rewards"
        />
        <ResultCard
          title="Effective APY"
          value={formatPercentage(result.effectiveApy)}
          status="positive"
          subtitle="Annualized compound yield"
        />
        <ResultCard
          title="Monthly Estimate"
          value={`~${formatNumber(result.monthlyReward, 4)}`}
          subtitle="Estimated 30-day reward rate"
        />
      </div>

      <CalculationActions
        title="Crypto Staking Simulation"
        onReset={() => setInputs(initialValues)}
      />
    </div>
  );

  const chart = (
    <DonutChart
      slices={[
        { label: 'Staked Principal', value: result.principal, color: '#6366f1' },
        { label: 'Staking Yield', value: result.totalReward, color: '#10b981' },
      ]}
      centerLabel="Effective APY"
      centerValue={formatPercentage(result.effectiveApy)}
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

// 5. TRADING FEES
export const CryptoTradingFeeView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const initialValues: CryptoTradingFeeInput = {
    tradeType: 'roundtrip',
    orderType: 'taker',
    tradeAmount: 15000,
    feeRatePercentage: 0.15,
  };
  const [inputs, setInputs] = useState<CryptoTradingFeeInput>(initialValues);
  const result = calculateCryptoTradingFee(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Trade Transaction Volume ($)
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.tradeAmount || ''}
          onChange={(e) => setInputs({ ...inputs, tradeAmount: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="15000"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Exchange Fee Rate (%)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={inputs.feeRatePercentage || ''}
            onChange={(e) => setInputs({ ...inputs, feeRatePercentage: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="0.15"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Trade Scope
          </label>
          <select
            value={inputs.tradeType}
            onChange={(e) => setInputs({ ...inputs, tradeType: e.target.value as any })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
          >
            <option value="roundtrip">Roundtrip (Buy + Sell)</option>
            <option value="buy">Single Buy Order</option>
            <option value="sell">Single Sell Order</option>
          </select>
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ResultCard
          title="Exchange Commission"
          value={formatCurrency(result.feeAmount)}
          badge="FEE"
          status="negative"
          subtitle={`Effective fee: ${formatPercentage(result.feeRatePercentage)}`}
          isHighlight
        />
        <ResultCard
          title="Net Proceeds"
          value={formatCurrency(result.netAmountReceived)}
          subtitle="Total capital received"
        />
        <ResultCard
          title="Gross Trade Volume"
          value={formatCurrency(result.tradeAmount)}
          subtitle="Notional order size"
        />
        <ResultCard
          title="Effective Total Outlay"
          value={formatCurrency(result.effectiveCost)}
          subtitle="Volume plus exchange fee"
        />
      </div>

      <CalculationActions
        title="Crypto Trading Fee Calculation"
        onReset={() => setInputs(initialValues)}
      />
    </div>
  );

  const chart = (
    <DonutChart
      slices={[
        { label: 'Net Capital', value: result.netAmountReceived, color: '#6366f1' },
        { label: 'Exchange Fee', value: result.feeAmount, color: '#f43f5e' },
      ]}
      centerLabel="Fee Share"
      centerValue={formatPercentage((result.feeAmount / (result.tradeAmount || 1)) * 100)}
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

// 6. BREAK-EVEN
export const CryptoBreakEvenView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const initialValues: CryptoBreakEvenInput = {
    entryPrice: 3200,
    quantity: 2.5,
    buyFeePercentage: 0.2,
    sellFeePercentage: 0.2,
    additionalFlatFees: 15,
  };
  const [inputs, setInputs] = useState<CryptoBreakEvenInput>(initialValues);
  const result = calculateCryptoBreakEven(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Entry / Buy Price ($)
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
            Quantity
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.quantity || ''}
            onChange={(e) => setInputs({ ...inputs, quantity: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="2.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Buy Fee Rate (%)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={inputs.buyFeePercentage || ''}
            onChange={(e) => setInputs({ ...inputs, buyFeePercentage: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="0.2"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Sell Fee Rate (%)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={inputs.sellFeePercentage || ''}
            onChange={(e) => setInputs({ ...inputs, sellFeePercentage: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="0.2"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Gas / Network / Flat Fees ($)
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.additionalFlatFees || ''}
          onChange={(e) => setInputs({ ...inputs, additionalFlatFees: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="15"
        />
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ResultCard
          title="Break-Even Exit Target"
          value={formatCurrency(result.breakEvenPrice)}
          badge="TARGET"
          status="neutral"
          subtitle="Required exit price to avoid loss"
          isHighlight
        />
        <ResultCard
          title="Required Price Surge"
          value={`+${formatPercentage(result.requiredPriceIncreasePercent)}`}
          status="positive"
          subtitle="Gain needed to cover all fees"
        />
        <ResultCard
          title="Total Cost to Recover"
          value={formatCurrency(result.totalCostToRecover)}
          subtitle="Asset cost + initial fees"
        />
        <ResultCard
          title="Entry Fees Incurred"
          value={formatCurrency(result.totalFeesPaidAtEntry)}
          subtitle="Buy fee + gas/network charges"
        />
      </div>

      <CalculationActions
        title="Crypto Break-Even Calculation"
        onReset={() => setInputs(initialValues)}
      />
    </div>
  );

  const chart = (
    <DonutChart
      slices={[
        { label: 'Coin Cost', value: inputs.entryPrice * inputs.quantity, color: '#6366f1' },
        { label: 'Fees Incurred', value: result.totalFeesPaidAtEntry, color: '#f59e0b' },
      ]}
      centerLabel="Target"
      centerValue={formatCurrency(result.breakEvenPrice)}
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

// 7. POSITION SIZE
export const CryptoPositionSizeView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const initialValues: CryptoPositionSizeInput = {
    accountBalance: 25000,
    riskPercentage: 1.5,
    entryPrice: 62000,
    stopLossPrice: 59500,
  };
  const [inputs, setInputs] = useState<CryptoPositionSizeInput>(initialValues);
  const result = calculateCryptoPositionSize(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Total Account Balance ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.accountBalance || ''}
            onChange={(e) => setInputs({ ...inputs, accountBalance: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="25000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Risk Tolerance (% of Capital)
          </label>
          <input
            type="number"
            min="0.1"
            max="100"
            step="0.1"
            value={inputs.riskPercentage || ''}
            onChange={(e) => setInputs({ ...inputs, riskPercentage: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="1.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Entry Price ($)
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
            Stop-Loss Price ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.stopLossPrice || ''}
            onChange={(e) => setInputs({ ...inputs, stopLossPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="59500"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      {result.errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-medium border border-rose-200 dark:border-rose-900">
          {result.errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ResultCard
          title="Recommended Position Units"
          value={`${formatNumber(result.positionSizeUnits, 4)} Units`}
          badge="SAFE SIZE"
          status="neutral"
          subtitle={`Position Notional: ${formatCurrency(result.positionSizeValue)}`}
          isHighlight
        />
        <ResultCard
          title="Maximum Dollar Risk"
          value={formatCurrency(result.riskAmount)}
          badge="MAX LOSS"
          status="negative"
          subtitle={`${inputs.riskPercentage}% of ${formatCurrency(inputs.accountBalance)}`}
        />
        <ResultCard
          title="Stop-Loss Distance"
          value={formatCurrency(result.priceRiskPerUnit)}
          subtitle="Risk amount per unit"
        />
        <ResultCard
          title="1:2 Profit Target"
          value={formatCurrency(result.riskReward1to2Target)}
          status="positive"
          subtitle="Target for 2x risk-reward"
        />
      </div>

      <CalculationActions
        title="Position Size Calculation"
        onReset={() => setInputs(initialValues)}
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

// 8. CRYPTO COMPOUND
export const CryptoCompoundView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const initialValues: CryptoCompoundInput = {
    initialPrincipal: 5000,
    monthlyContribution: 250,
    annualInterestRate: 9,
    years: 5,
    compoundingFrequency: 'monthly',
  };
  const [inputs, setInputs] = useState<CryptoCompoundInput>(initialValues);
  const result = calculateCryptoCompound(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Initial Principal ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.initialPrincipal || ''}
            onChange={(e) => setInputs({ ...inputs, initialPrincipal: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="5000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Monthly Addition ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.monthlyContribution || ''}
            onChange={(e) => setInputs({ ...inputs, monthlyContribution: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="250"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Annual Return Rate (%)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={inputs.annualInterestRate || ''}
            onChange={(e) => setInputs({ ...inputs, annualInterestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="9"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Years Horizon
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={inputs.years || ''}
            onChange={(e) => setInputs({ ...inputs, years: parseInt(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="5"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ResultCard
          title="Projected Future Balance"
          value={formatCurrency(result.futureValue)}
          badge="TOTAL ACCUMULATION"
          status="positive"
          subtitle={`Over ${inputs.years} compounding years`}
          isHighlight
        />
        <ResultCard
          title="Total Compound Growth"
          value={`+${formatCurrency(result.totalInterestEarned)}`}
          status="positive"
          subtitle="Interest & yield compounding"
        />
        <ResultCard
          title="Principal Contributed"
          value={formatCurrency(result.totalPrincipalContributed)}
          subtitle="Total out-of-pocket investment"
        />
        <ResultCard
          title="Gain-to-Deposit Ratio"
          value={formatPercentage(
            result.totalPrincipalContributed > 0
              ? (result.totalInterestEarned / result.totalPrincipalContributed) * 100
              : 0
          )}
          status="positive"
          subtitle="Relative growth generated"
        />
      </div>

      <CalculationActions
        title="Crypto Compounding Calculation"
        onReset={() => setInputs(initialValues)}
      />
    </div>
  );

  const chart = (
    <AreaGrowthChart
      data={result.breakdown.map((b) => ({
        label: `Yr ${b.year}`,
        invested: b.principalContributed,
        total: b.totalBalance,
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

// 9. CRYPTO TAX
export const CryptoTaxView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const initialValues: CryptoTaxInput = {
    costBasis: 12000,
    saleProceeds: 28000,
    holdingPeriod: 'long_term',
    incomeTaxBracketPercentage: 24,
    longTermTaxRatePercentage: 15,
  };
  const [inputs, setInputs] = useState<CryptoTaxInput>(initialValues);
  const result = calculateCryptoTax(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Total Cost Basis ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.costBasis || ''}
            onChange={(e) => setInputs({ ...inputs, costBasis: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="12000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Sale Proceeds ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.saleProceeds || ''}
            onChange={(e) => setInputs({ ...inputs, saleProceeds: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="28000"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Holding Duration
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, holdingPeriod: 'short_term' })}
            className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
              inputs.holdingPeriod === 'short_term'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
            }`}
          >
            Under 1 Year (Short-Term)
          </button>
          <button
            type="button"
            onClick={() => setInputs({ ...inputs, holdingPeriod: 'long_term' })}
            className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
              inputs.holdingPeriod === 'long_term'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
            }`}
          >
            1 Year or More (Long-Term)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Short-Term Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="60"
            step="0.5"
            value={inputs.incomeTaxBracketPercentage || ''}
            onChange={(e) => setInputs({ ...inputs, incomeTaxBracketPercentage: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="24"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Long-Term Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="40"
            step="0.5"
            value={inputs.longTermTaxRatePercentage || ''}
            onChange={(e) => setInputs({ ...inputs, longTermTaxRatePercentage: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="15"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ResultCard
          title="Estimated Tax Liability"
          value={formatCurrency(result.estimatedTaxOwed)}
          badge="EST. TAX"
          status={result.estimatedTaxOwed > 0 ? 'negative' : 'neutral'}
          subtitle={`Effective rate applied: ${formatPercentage(result.applicableTaxRate)}`}
          isHighlight
        />
        <ResultCard
          title="Taxable Capital Gain"
          value={formatCurrency(result.capitalGainOrLoss)}
          status={result.isGain ? 'positive' : 'negative'}
          subtitle={result.isGain ? 'Taxable capital gain' : 'Deductible capital loss'}
        />
        <ResultCard
          title="Net After-Tax Proceeds"
          value={formatCurrency(result.netProceedsAfterTax)}
          subtitle="Proceeds minus estimated tax"
        />
        <ResultCard
          title="Long-Term Tax Savings"
          value={formatCurrency(result.taxSavingsWithLongTerm)}
          status="positive"
          subtitle="Saved with long-term rate"
        />
      </div>

      <CalculationActions
        title="Crypto Tax Calculation"
        onReset={() => setInputs(initialValues)}
      />
    </div>
  );

  const chart = (
    <DonutChart
      slices={[
        { label: 'Net After-Tax', value: result.netProceedsAfterTax, color: '#10b981' },
        { label: 'Estimated Tax', value: result.estimatedTaxOwed, color: '#f43f5e' },
      ]}
      centerLabel="Tax Share"
      centerValue={formatPercentage(
        result.saleProceeds > 0 ? (result.estimatedTaxOwed / result.saleProceeds) * 100 : 0
      )}
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

// 10. LOAN / EMI
export const LoanView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const initialValues: LoanInput = {
    principal: 35000,
    annualInterestRate: 7.2,
    loanTenureYears: 5,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<LoanInput>(initialValues, 'loan');
  const result = calculateLoanEMI(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Loan Principal Amount ($)
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.principal || ''}
          onChange={(e) => setInputs({ ...inputs, principal: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="35000"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Interest Rate (% APR)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.05"
            value={inputs.annualInterestRate || ''}
            onChange={(e) => setInputs({ ...inputs, annualInterestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="7.2"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Loan Tenure (Years)
          </label>
          <input
            type="number"
            min="0.5"
            max="40"
            step="0.5"
            value={inputs.loanTenureYears || ''}
            onChange={(e) => setInputs({ ...inputs, loanTenureYears: parseFloat(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="5"
          />
          {/* Quick Tenure Preset Chips */}
          <div className="flex gap-1.5 mt-2">
            {[1, 3, 5, 10, 15, 20].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setInputs({ ...inputs, loanTenureYears: yr })}
                className={`px-2 py-0.5 text-[11px] rounded-md font-mono font-medium border transition-colors cursor-pointer ${
                  inputs.loanTenureYears === yr
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                }`}
              >
                {yr}Y
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ResultCard
          title="Monthly Installment (EMI)"
          value={formatCurrency(result.monthlyEmi)}
          badge="MONTHLY EMI"
          status="neutral"
          subtitle={`${Math.round(inputs.loanTenureYears * 12)} monthly payments`}
          isHighlight
        />
        <ResultCard
          title="Total Interest Payable"
          value={formatCurrency(result.totalInterest)}
          status="negative"
          subtitle={`${formatPercentage(result.interestRatio)} of total repayment`}
        />
        <ResultCard
          title="Principal Borrowed"
          value={formatCurrency(result.principal)}
          subtitle="Original loan amount"
        />
        <ResultCard
          title="Total Overall Repayment"
          value={formatCurrency(result.totalPayment)}
          subtitle="Principal + total interest"
        />
      </div>

      <CalculationActions
        title="Loan EMI Calculation"
        onReset={resetInputs}
      />
    </div>
  );

  const chart = (
    <DonutChart
      slices={[
        { label: 'Principal', value: result.principal, color: '#6366f1' },
        { label: 'Interest Paid', value: result.totalInterest, color: '#f59e0b' },
      ]}
      centerLabel="Interest Ratio"
      centerValue={formatPercentage(result.interestRatio)}
    />
  );

  return (
    <CalculatorLayout
      tool={tool}
      inputsComponent={inputsComponent}
      resultsComponent={resultsComponent}
      chartComponent={chart}
      scheduleComponent={
        <AmortizationTable
          title="Monthly EMI Repayment Schedule"
          periodLabel="Month"
          initialShowCount={6}
          schedule={result.schedule.map((s) => ({
            period: s.month,
            principalPaid: s.principalPaid,
            interestPaid: s.interestPaid,
            remainingBalance: s.remainingBalance,
          }))}
        />
      }
      mobileQuickSummary={{
        label: 'Monthly EMI',
        value: formatCurrency(result.monthlyEmi),
        subValue: `Total: ${formatCurrency(result.totalPayment)}`,
        status: 'neutral',
      }}
      onNavigate={onNavigate}
    />
  );
};

// 11. SIP
export const SIPView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const initialValues: SIPInput = {
    monthlyInvestment: 500,
    expectedAnnualReturn: 12,
    tenureYears: 10,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<SIPInput>(initialValues, 'sip');
  const result = calculateSIP(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Monthly Investment Amount ($)
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.monthlyInvestment || ''}
          onChange={(e) => setInputs({ ...inputs, monthlyInvestment: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Expected Return Rate (%/yr)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={inputs.expectedAnnualReturn || ''}
            onChange={(e) => setInputs({ ...inputs, expectedAnnualReturn: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="12"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Duration (Years)
          </label>
          <input
            type="number"
            min="1"
            max="40"
            value={inputs.tenureYears || ''}
            onChange={(e) => setInputs({ ...inputs, tenureYears: parseInt(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="10"
          />
          {/* Quick Year Chips */}
          <div className="flex gap-1.5 mt-2">
            {[3, 5, 10, 15, 20, 25].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setInputs({ ...inputs, tenureYears: yr })}
                className={`px-2 py-0.5 text-[11px] rounded-md font-mono font-medium border transition-colors cursor-pointer ${
                  inputs.tenureYears === yr
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                }`}
              >
                {yr}Y
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ResultCard
          title="Total Expected Maturity"
          value={formatCurrency(result.totalMaturityValue)}
          badge="EST. WEALTH"
          status="positive"
          subtitle={`Over ${inputs.tenureYears} investment years`}
          isHighlight
        />
        <ResultCard
          title="Estimated Wealth Gained"
          value={`+${formatCurrency(result.estimatedReturns)}`}
          status="positive"
          subtitle={`+${formatPercentage(result.wealthGainRatio)} on capital`}
        />
        <ResultCard
          title="Total Invested Capital"
          value={formatCurrency(result.totalInvested)}
          subtitle={`${inputs.tenureYears * 12} monthly installments`}
        />
        <ResultCard
          title="Growth Multiplier"
          value={`${(result.totalMaturityValue / (result.totalInvested || 1)).toFixed(2)}x`}
          subtitle="Portfolio growth multiple"
        />
      </div>

      <CalculationActions
        title="SIP Wealth Calculation"
        onReset={resetInputs}
      />
    </div>
  );

  const chart = (
    <AreaGrowthChart
      data={result.schedule.map((s) => ({
        label: `Yr ${s.year}`,
        invested: s.investedAmount,
        total: s.totalMaturityValue,
      }))}
    />
  );

  return (
    <CalculatorLayout
      tool={tool}
      inputsComponent={inputsComponent}
      resultsComponent={resultsComponent}
      chartComponent={chart}
      mobileQuickSummary={{
        label: 'Est. Maturity Value',
        value: formatCurrency(result.totalMaturityValue),
        subValue: `Gain: +${formatCurrency(result.estimatedReturns)}`,
        status: 'positive',
      }}
      onNavigate={onNavigate}
    />
  );
};

// 12. COMPOUND INTEREST
export const CompoundInterestView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const initialValues: CompoundInterestInput = {
    initialPrincipal: 10000,
    monthlyContribution: 300,
    annualInterestRate: 8,
    years: 15,
    compoundingFrequency: 'monthly',
  };
  const [inputs, setInputs] = useState<CompoundInterestInput>(initialValues);
  const result = calculateCompoundInterest(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Initial Starting Balance ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.initialPrincipal || ''}
            onChange={(e) => setInputs({ ...inputs, initialPrincipal: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="10000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Monthly Contribution ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.monthlyContribution || ''}
            onChange={(e) => setInputs({ ...inputs, monthlyContribution: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="300"
          />
        </div>
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
            value={inputs.annualInterestRate || ''}
            onChange={(e) => setInputs({ ...inputs, annualInterestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="8"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Duration (Years)
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={inputs.years || ''}
            onChange={(e) => setInputs({ ...inputs, years: parseInt(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="15"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Compounding Frequency
        </label>
        <select
          value={inputs.compoundingFrequency}
          onChange={(e) => setInputs({ ...inputs, compoundingFrequency: e.target.value as any })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="semiannually">Semi-Annually</option>
          <option value="annually">Annually</option>
        </select>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ResultCard
          title="Ending Future Balance"
          value={formatCurrency(result.finalBalance)}
          badge="TOTAL ACCUMULATION"
          status="positive"
          subtitle={`After ${inputs.years} compounding years`}
          isHighlight
        />
        <ResultCard
          title="Total Compound Interest"
          value={`+${formatCurrency(result.totalInterestEarned)}`}
          status="positive"
          subtitle="Interest earned on interest"
        />
        <ResultCard
          title="Total Principal Contributed"
          value={formatCurrency(result.totalPrincipalInvested)}
          subtitle="Initial deposit + monthly additions"
        />
        <ResultCard
          title="Interest-to-Principal Ratio"
          value={formatPercentage(
            result.totalPrincipalInvested > 0
              ? (result.totalInterestEarned / result.totalPrincipalInvested) * 100
              : 0
          )}
          status="positive"
          subtitle="Cumulative growth relative to deposit"
        />
      </div>

      <CalculationActions
        title="Compound Interest Calculation"
        onReset={() => setInputs(initialValues)}
      />
    </div>
  );

  const chart = (
    <AreaGrowthChart
      data={result.schedule.map((s) => ({
        label: `Yr ${s.year}`,
        invested: s.principal,
        total: s.balance,
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

// 13. INVESTMENT RETURN
export const InvestmentReturnView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const initialValues: InvestmentReturnInput = {
    initialInvestment: 15000,
    monthlyContribution: 200,
    expectedAnnualReturn: 9.5,
    years: 10,
  };
  const [inputs, setInputs] = useState<InvestmentReturnInput>(initialValues);
  const result = calculateInvestmentReturn(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Initial Outlay ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.initialInvestment || ''}
            onChange={(e) => setInputs({ ...inputs, initialInvestment: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="15000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Monthly Contribution ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.monthlyContribution || ''}
            onChange={(e) => setInputs({ ...inputs, monthlyContribution: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Annual Return Rate (%)
          </label>
          <input
            type="number"
            min="-90"
            max="100"
            step="0.1"
            value={inputs.expectedAnnualReturn || ''}
            onChange={(e) => setInputs({ ...inputs, expectedAnnualReturn: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="9.5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Holding Years
          </label>
          <input
            type="number"
            min="0.5"
            max="40"
            step="0.5"
            value={inputs.years || ''}
            onChange={(e) => setInputs({ ...inputs, years: parseFloat(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="10"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ResultCard
          title="Projected Ending Value"
          value={formatCurrency(result.futureValue)}
          badge="TOTAL PORTFOLIO"
          status="positive"
          subtitle={`Across ${inputs.years} holding years`}
          isHighlight
        />
        <ResultCard
          title="Total Capital Gain"
          value={`+${formatCurrency(result.totalGain)}`}
          status="positive"
          subtitle={`Total ROI: +${formatPercentage(result.totalRoiPercentage)}`}
        />
        <ResultCard
          title="Total Capital Deployed"
          value={formatCurrency(result.totalInvested)}
          subtitle="Initial outlay + monthly contributions"
        />
        <ResultCard
          title="Annualized CAGR"
          value={formatPercentage(result.annualizedCagr)}
          status="positive"
          subtitle="Geometric annual mean growth"
        />
      </div>

      <CalculationActions
        title="Investment Return Calculation"
        onReset={() => setInputs(initialValues)}
      />
    </div>
  );

  const chart = (
    <AreaGrowthChart
      data={result.schedule.map((s) => ({
        label: `Yr ${s.year}`,
        invested: s.invested,
        total: s.totalValue,
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

// 14. SAVINGS
export const SavingsView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const initialValues: SavingsInput = {
    initialDeposit: 4000,
    monthlyDeposit: 350,
    annualInterestRate: 4.8,
    years: 3,
  };
  const [inputs, setInputs] = useState<SavingsInput>(initialValues);
  const result = calculateSavings(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Initial Deposit ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.initialDeposit || ''}
            onChange={(e) => setInputs({ ...inputs, initialDeposit: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="4000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Monthly Savings ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.monthlyDeposit || ''}
            onChange={(e) => setInputs({ ...inputs, monthlyDeposit: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="350"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Annual Yield (% APY)
          </label>
          <input
            type="number"
            min="0"
            max="30"
            step="0.05"
            value={inputs.annualInterestRate || ''}
            onChange={(e) => setInputs({ ...inputs, annualInterestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="4.8"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Saving Horizon (Years)
          </label>
          <input
            type="number"
            min="0.25"
            max="30"
            step="0.25"
            value={inputs.years || ''}
            onChange={(e) => setInputs({ ...inputs, years: parseFloat(e.target.value) || 1 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="3"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ResultCard
          title="Final Savings Balance"
          value={formatCurrency(result.finalSavingsBalance)}
          badge="TARGET MET"
          status="positive"
          subtitle={`After ${inputs.years} years of saving`}
          isHighlight
        />
        <ResultCard
          title="Total Interest Earned"
          value={`+${formatCurrency(result.totalInterestEarned)}`}
          status="positive"
          subtitle="Compounded high-yield return"
        />
        <ResultCard
          title="Total Principal Deposited"
          value={formatCurrency(result.totalPrincipal)}
          subtitle="Initial deposit + monthly additions"
        />
        <ResultCard
          title="Monthly Additions Total"
          value={formatCurrency(result.totalMonthlyDeposits)}
          subtitle={`${Math.round(inputs.years * 12)} monthly contributions`}
        />
      </div>

      <CalculationActions
        title="Savings Calculation"
        onReset={() => setInputs(initialValues)}
      />
    </div>
  );

  const chart = (
    <DonutChart
      slices={[
        { label: 'Principal Deposits', value: result.totalPrincipal, color: '#6366f1' },
        { label: 'Interest Earned', value: result.totalInterestEarned, color: '#10b981' },
      ]}
      centerLabel="Total Saved"
      centerValue={formatCurrency(result.finalSavingsBalance)}
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

// 15. MORTGAGE
export const MortgageView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const initialValues: MortgageInput = {
    homePrice: 450000,
    downPayment: 20,
    downPaymentType: 'percentage',
    loanTermYears: 30,
    annualInterestRate: 6.75,
    annualPropertyTaxRate: 1.2,
    annualHomeownersInsurance: 1400,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<MortgageInput>(initialValues, 'mortgage');
  const result = calculateMortgage(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Home Purchase Price ($)
        </label>
        <input
          type="number"
          min="0"
          step="any"
          value={inputs.homePrice || ''}
          onChange={(e) => setInputs({ ...inputs, homePrice: parseFloat(e.target.value) || 0 })}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
          placeholder="450000"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Down Payment
            </label>
            <div className="flex rounded-md bg-slate-100 dark:bg-slate-800 p-0.5 text-[10px]">
              <button
                type="button"
                onClick={() => setInputs({ ...inputs, downPaymentType: 'percentage' })}
                className={`px-1.5 py-0.5 rounded ${
                  inputs.downPaymentType === 'percentage'
                    ? 'bg-white dark:bg-slate-900 font-bold text-indigo-600 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                %
              </button>
              <button
                type="button"
                onClick={() => setInputs({ ...inputs, downPaymentType: 'amount' })}
                className={`px-1.5 py-0.5 rounded ${
                  inputs.downPaymentType === 'amount'
                    ? 'bg-white dark:bg-slate-900 font-bold text-indigo-600 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                $
              </button>
            </div>
          </div>
          <input
            type="number"
            min="0"
            step="any"
            value={inputs.downPayment || ''}
            onChange={(e) => setInputs({ ...inputs, downPayment: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder={inputs.downPaymentType === 'percentage' ? '20' : '90000'}
          />
          {/* Quick Down Payment Chips */}
          <div className="flex gap-1.5 mt-2">
            {[5, 10, 15, 20, 25].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() =>
                  setInputs({
                    ...inputs,
                    downPaymentType: 'percentage',
                    downPayment: pct,
                  })
                }
                className="px-2 py-0.5 text-[11px] rounded-md font-mono font-medium border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-indigo-400 cursor-pointer"
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Mortgage Term
          </label>
          <select
            value={inputs.loanTermYears}
            onChange={(e) => setInputs({ ...inputs, loanTermYears: parseInt(e.target.value) || 30 })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
          >
            <option value={30}>30 Years Fixed</option>
            <option value={20}>20 Years Fixed</option>
            <option value={15}>15 Years Fixed</option>
            <option value={10}>10 Years Fixed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Interest Rate (%)
          </label>
          <input
            type="number"
            min="0"
            step="0.05"
            value={inputs.annualInterestRate || ''}
            onChange={(e) => setInputs({ ...inputs, annualInterestRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            placeholder="6.75"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Tax (%/yr)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={inputs.annualPropertyTaxRate || ''}
            onChange={(e) => setInputs({ ...inputs, annualPropertyTaxRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            placeholder="1.2"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Insurance ($/yr)
          </label>
          <input
            type="number"
            min="0"
            step="50"
            value={inputs.annualHomeownersInsurance || ''}
            onChange={(e) => setInputs({ ...inputs, annualHomeownersInsurance: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
            placeholder="1400"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <ResultCard
          title="Total Monthly Payment (PITI)"
          value={formatCurrency(result.totalMonthlyPayment)}
          badge="MONTHLY TOTAL"
          status="neutral"
          subtitle="Principal, Interest, Taxes & Insurance"
          isHighlight
        />
        <ResultCard
          title="Monthly Principal & Interest"
          value={formatCurrency(result.monthlyPrincipalAndInterest)}
          subtitle="Base mortgage loan repayment"
        />
        <ResultCard
          title="Total Loan Balance Financed"
          value={formatCurrency(result.loanAmount)}
          subtitle={`Down Payment: ${formatCurrency(result.downPaymentAmount)} (${result.downPaymentPercent.toFixed(1)}%)`}
        />
        <ResultCard
          title="Total Interest Payable"
          value={formatCurrency(result.totalInterestPaid)}
          status="negative"
          subtitle={`Over ${inputs.loanTermYears} years`}
        />
      </div>

      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
        <span className="text-slate-500">Loan-to-Value (LTV):</span>
        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
          {formatPercentage(result.ltvRatio)} {result.ltvRatio <= 80 ? '✓ No PMI Required' : '⚠ PMI May Apply'}
        </span>
      </div>

      <CalculationActions
        title="Mortgage Payment Calculation"
        onReset={resetInputs}
      />
    </div>
  );

  const chart = (
    <DonutChart
      slices={[
        { label: 'Principal & Interest', value: result.monthlyPrincipalAndInterest, color: '#6366f1' },
        { label: 'Property Tax', value: result.monthlyPropertyTax, color: '#f59e0b' },
        { label: 'Homeowners Insurance', value: result.monthlyInsurance, color: '#10b981' },
      ]}
      centerLabel="Monthly Total"
      centerValue={formatCurrency(result.totalMonthlyPayment)}
    />
  );

  return (
    <CalculatorLayout
      tool={tool}
      inputsComponent={inputsComponent}
      resultsComponent={resultsComponent}
      chartComponent={chart}
      scheduleComponent={
        <AmortizationTable
          title="Year-by-Year Mortgage Amortization Schedule"
          periodLabel="Year"
          initialShowCount={5}
          schedule={result.schedule.map((s) => ({
            period: s.year,
            principalPaid: s.principalPaid,
            interestPaid: s.interestPaid,
            remainingBalance: s.remainingBalance,
            totalPaidToDate: s.totalPaidToDate,
          }))}
        />
      }
      mobileQuickSummary={{
        label: 'Monthly Total (PITI)',
        value: formatCurrency(result.totalMonthlyPayment),
        subValue: `Loan: ${formatCurrency(result.loanAmount)}`,
        status: 'neutral',
      }}
      onNavigate={onNavigate}
    />
  );
};

// Central Master Dispatcher
export const CalculatorDispatcher: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const matchId = tool.id || tool.slug;
  switch (matchId) {
    case 'crypto-profit':
    case 'crypto-profit-calculator':
      return <CryptoProfitView tool={tool} onNavigate={onNavigate} />;
    case 'crypto-roi':
    case 'crypto-roi-calculator':
      return <CryptoROIView tool={tool} onNavigate={onNavigate} />;
    case 'crypto-dca':
    case 'crypto-dca-calculator':
      return <CryptoDCAView tool={tool} onNavigate={onNavigate} />;
    case 'crypto-staking':
    case 'crypto-staking-calculator':
      return <CryptoStakingView tool={tool} onNavigate={onNavigate} />;
    case 'crypto-trading-fee':
    case 'crypto-trading-fee-calculator':
      return <CryptoTradingFeeView tool={tool} onNavigate={onNavigate} />;
    case 'crypto-break-even':
    case 'crypto-break-even-calculator':
      return <CryptoBreakEvenView tool={tool} onNavigate={onNavigate} />;
    case 'crypto-position-size':
    case 'crypto-position-size-calculator':
      return <CryptoPositionSizeView tool={tool} onNavigate={onNavigate} />;
    case 'crypto-compound':
    case 'crypto-compound-interest-calculator':
      return <CryptoCompoundView tool={tool} onNavigate={onNavigate} />;
    case 'crypto-tax':
    case 'crypto-tax-calculator':
      return <CryptoTaxView tool={tool} onNavigate={onNavigate} />;
    case 'loan':
    case 'loan-emi':
    case 'loan-calculator':
      return <LoanView tool={tool} onNavigate={onNavigate} />;
    case 'sip':
    case 'sip-investment':
    case 'sip-calculator':
      return <SIPView tool={tool} onNavigate={onNavigate} />;
    case 'compound-interest':
    case 'compound-interest-calculator':
      return <CompoundInterestView tool={tool} onNavigate={onNavigate} />;
    case 'investment-return':
    case 'investment-return-calculator':
      return <InvestmentReturnView tool={tool} onNavigate={onNavigate} />;
    case 'savings':
    case 'savings-goal':
    case 'savings-calculator':
      return <SavingsView tool={tool} onNavigate={onNavigate} />;
    case 'mortgage':
    case 'mortgage-payment':
    case 'mortgage-calculator':
      return <MortgageView tool={tool} onNavigate={onNavigate} />;
    default:
      return <CryptoProfitView tool={tool} onNavigate={onNavigate} />;
  }
};
