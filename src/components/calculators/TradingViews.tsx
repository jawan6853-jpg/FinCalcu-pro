import React, { useState } from 'react';
import { ToolItem } from '../../types';
import { CalculatorLayout } from '../common/CalculatorLayout';
import { ResultCard, CalculationActions } from '../common/ResultCard';
import { formatCurrency, formatNumber, formatPercentage } from '../../lib/formatters';
import { useUrlParamsState } from '../../lib/useUrlParamsState';
import { useCurrency } from '../../context/CurrencyContext';

import { calculatePositionSize, PositionSizeCalculatorInput } from '../../lib/calculators/generalPositionSize';
import { calculateStopLoss, StopLossInput } from '../../lib/calculators/stopLoss';
import { calculatePipValue, PipValueInput, POPULAR_PAIRS, LotType } from '../../lib/calculators/pipValue';
import { calculateTradingFee, TradingFeeInput } from '../../lib/calculators/generalTradingFee';

export interface CalculatorViewProps {
  tool: ToolItem;
  onNavigate: (route: string) => void;
}

// 1. POSITION SIZE VIEW
export const PositionSizeView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: PositionSizeCalculatorInput = {
    accountBalance: 25000,
    riskPercentage: 1.5,
    entryPrice: 62500,
    stopLossPrice: 60500,
    tradeDirection: 'long',
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<PositionSizeCalculatorInput>(initial, 'possize');
  const result = calculatePositionSize(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-2">
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, tradeDirection: 'long' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            inputs.tradeDirection === 'long'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          LONG Position (Buy)
        </button>
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, tradeDirection: 'short' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            inputs.tradeDirection === 'short'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          SHORT Position (Sell)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Account Balance (${currencySymbol})</label>
          <input
            type="number"
            min="0"
            value={inputs.accountBalance ?? ''}
            onChange={(e) => setInputs({ ...inputs, accountBalance: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="25000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Account Risk (%)</label>
          <input
            type="number"
            step="0.25"
            min="0.1"
            max="100"
            value={inputs.riskPercentage ?? ''}
            onChange={(e) => setInputs({ ...inputs, riskPercentage: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="1.5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Entry Price (${currencySymbol})</label>
          <input
            type="number"
            step="any"
            value={inputs.entryPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, entryPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="62500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Stop Loss Price (${currencySymbol})</label>
          <input
            type="number"
            step="any"
            value={inputs.stopLossPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, stopLossPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="60500"
          />
        </div>
      </div>
      {!result.isTradeValid && (
        <p className="text-xs text-rose-500 font-semibold">{result.statusMessage}</p>
      )}
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Recommended Position Size"
          value={`${formatNumber(result.positionUnits, 4)} units`}
          isHighlight={true}
          status="positive"
          subtitle={`Total notional: ${formatCurrency(result.positionNotionalValue, currency)}`}
        />
        <ResultCard
          title="Maximum Dollar Risk"
          value={formatCurrency(result.riskAmountDollars, currency)}
          status="negative"
          subtitle={`${inputs.riskPercentage}% of your account equity`}
        />
        <ResultCard
          title="Risk Per Unit / Distance"
          value={formatCurrency(result.riskPerUnit, currency)}
          subtitle={`${result.riskPercentDistance.toFixed(2)}% distance to stop loss`}
        />
        <ResultCard
          title="Portfolio Allocation"
          value={`${result.accountAllocationPercent.toFixed(1)}%`}
          subtitle="Notional position size relative to balance"
        />
      </div>
      <CalculationActions title="Position Size Calculation" onReset={resetInputs} />
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

// 2. STOP LOSS VIEW
export const StopLossView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: StopLossInput = {
    direction: 'long',
    entryPrice: 3200,
    mode: 'percentage',
    riskPercent: 3.5,
    riskDollars: 250,
    quantity: 2.0,
    targetRewardRatio: 2.0,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<StopLossInput>(initial, 'stoploss');
  const result = calculateStopLoss(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-2">
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, direction: 'long' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            inputs.direction === 'long'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          LONG Trade
        </button>
        <button
          type="button"
          onClick={() => setInputs({ ...inputs, direction: 'short' })}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            inputs.direction === 'short'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          SHORT Trade
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Entry Price (${currencySymbol})</label>
          <input
            type="number"
            step="any"
            value={inputs.entryPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, entryPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="3200"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Stop Loss Risk (%)</label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={inputs.riskPercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, riskPercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="3.5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Position Quantity (Units)</label>
          <input
            type="number"
            step="any"
            min="0.0001"
            value={inputs.quantity ?? ''}
            onChange={(e) => setInputs({ ...inputs, quantity: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
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
          title="Recommended Stop Loss Price"
          value={formatCurrency(result.stopLossPrice, currency)}
          isHighlight={true}
          status="negative"
          subtitle={result.statusMessage}
        />
        <ResultCard
          title="Stop Loss Distance"
          value={`${formatCurrency(result.stopDistanceDollars, currency)} (${result.stopDistancePercent}%)`}
          subtitle="Price points risked away from entry"
        />
        <ResultCard
          title="Total Max Loss"
          value={formatCurrency(result.totalLossAtStop, currency)}
          status="negative"
          subtitle={`Loss if stop hits on ${inputs.quantity} units`}
        />
        <ResultCard
          title="1:2 Target Take Profit"
          value={result.takeProfitTargets[2] ? formatCurrency(result.takeProfitTargets[2].targetPrice, currency) : 'N/A'}
          status="positive"
          subtitle={result.takeProfitTargets[2] ? `Gain: +${formatCurrency(result.takeProfitTargets[2].potentialGain, currency)}` : ''}
        />
      </div>

      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h4 className="text-xs font-bold mb-2">R:R Take Profit Scale</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {result.takeProfitTargets.slice(0, 4).map((tp) => (
            <div key={tp.ratio} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">{tp.ratio} Target</span>
              <div className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">{formatCurrency(tp.targetPrice, currency)}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+{formatCurrency(tp.potentialGain, currency)}</div>
            </div>
          ))}
        </div>
      </div>

      <CalculationActions title="Stop Loss Calculation" onReset={resetInputs} />
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

// 3. PIP VALUE VIEW
export const PipValueView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: PipValueInput = {
    currencyPair: 'EUR/USD',
    lotType: 'standard',
    numberOfLots: 1.0,
    exchangeRate: 1.085,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<PipValueInput>(initial, 'pip');
  const result = calculatePipValue(inputs);

  const handlePairChange = (p: string) => {
    const found = POPULAR_PAIRS.find((item) => item.pair === p);
    setInputs({
      ...inputs,
      currencyPair: p,
      exchangeRate: found ? found.defaultRate : inputs.exchangeRate,
    });
  };

  const inputsComponent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Currency Pair</label>
        <select
          value={inputs.currencyPair}
          onChange={(e) => handlePairChange(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
        >
          {POPULAR_PAIRS.map((p) => (
            <option key={p.pair} value={p.pair}>
              {p.pair}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Lot Type</label>
          <select
            value={inputs.lotType}
            onChange={(e) => setInputs({ ...inputs, lotType: e.target.value as LotType })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
          >
            <option value="standard">Standard (100,000)</option>
            <option value="mini">Mini (10,000)</option>
            <option value="micro">Micro (1,000)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Number of Lots</label>
          <input
            type="number"
            step="0.1"
            min="0.01"
            value={inputs.numberOfLots ?? ''}
            onChange={(e) => setInputs({ ...inputs, numberOfLots: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="1.0"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Exchange Rate</label>
          <input
            type="number"
            step="any"
            value={inputs.exchangeRate ?? ''}
            onChange={(e) => setInputs({ ...inputs, exchangeRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="1.085"
          />
        </div>
      </div>
    </div>
  );

  const resultsComponent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="Total Pip Value"
          value={`${formatCurrency(result.totalPipValue, currency)}/pip`}
          isHighlight={true}
          status="positive"
          subtitle={`For ${inputs.numberOfLots} ${inputs.lotType} lots`}
        />
        <ResultCard
          title="Pip Value Per Single Lot"
          value={`${formatCurrency(result.pipValuePerLot, currency)}/pip`}
          subtitle={`Units traded: ${result.totalUnitsTraded.toLocaleString()}`}
        />
        <ResultCard
          title="Pip Point Size"
          value={`${result.pipSize}`}
          subtitle="Smallest standard price increment"
        />
        <ResultCard
          title="50-Pip Swing Value"
          value={formatCurrency(result.totalPipValue * 50, currency)}
          subtitle="Gain or loss on a 50-pip price movement"
        />
      </div>

      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h4 className="text-xs font-bold mb-2">Pip Movement Sensitivity Table</h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {result.pipMovementsTable.map((row) => (
            <div key={row.pips} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-semibold">{row.pips} Pips</span>
              <div className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">±{formatCurrency(row.profitOrLoss, currency)}</div>
            </div>
          ))}
        </div>
      </div>

      <CalculationActions title="Pip Value Calculation" onReset={resetInputs} />
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

// 4. TRADING FEE VIEW
export const TradingFeeView: React.FC<CalculatorViewProps> = ({ tool, onNavigate }) => {
  const { currency, currencySymbol } = useCurrency();
  const initial: TradingFeeInput = {
    buyPrice: 60000,
    sellPrice: 65000,
    quantity: 1.25,
    buyFeePercent: 0.1,
    sellFeePercent: 0.1,
    flatFeePerOrder: 0,
  };
  const [inputs, setInputs, resetInputs] = useUrlParamsState<TradingFeeInput>(initial, 'tfee');
  const result = calculateTradingFee(inputs);

  const inputsComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Buy Price (${currencySymbol})</label>
          <input
            type="number"
            step="any"
            value={inputs.buyPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, buyPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="60000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Sell Price (${currencySymbol})</label>
          <input
            type="number"
            step="any"
            value={inputs.sellPrice ?? ''}
            onChange={(e) => setInputs({ ...inputs, sellPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="65000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Trade Quantity</label>
          <input
            type="number"
            step="any"
            value={inputs.quantity ?? ''}
            onChange={(e) => setInputs({ ...inputs, quantity: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="1.25"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Buy Fee Rate (%)</label>
          <input
            type="number"
            step="0.01"
            value={inputs.buyFeePercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, buyFeePercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
            placeholder="0.1"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Sell Fee Rate (%)</label>
          <input
            type="number"
            step="0.01"
            value={inputs.sellFeePercent ?? ''}
            onChange={(e) => setInputs({ ...inputs, sellFeePercent: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
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
          title="Net Profit After Fees"
          value={formatCurrency(result.netProfitLoss, currency)}
          isHighlight={true}
          status={result.isProfitable ? 'positive' : 'negative'}
          subtitle={`Net ROI: ${formatPercentage(result.netRoiPercent)}`}
        />
        <ResultCard
          title="Total Trading Fees Paid"
          value={formatCurrency(result.totalFeesPaid, currency)}
          status="negative"
          subtitle={`Buy: ${formatCurrency(result.buyFeeAmount, currency)} | Sell: ${formatCurrency(result.sellFeeAmount, currency)}`}
        />
        <ResultCard
          title="Break-Even Exit Price"
          value={formatCurrency(result.breakEvenExitPrice, currency)}
          subtitle="Required exit price to pay 100% of fees"
        />
        <ResultCard
          title="Gross Trading P&L"
          value={formatCurrency(result.grossProfitLoss, currency)}
          subtitle="Profit before broker/exchange fees"
        />
      </div>
      <CalculationActions title="Trading Fee Calculation" onReset={resetInputs} />
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
