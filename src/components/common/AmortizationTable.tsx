import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Table } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';
import { useCurrency } from '../../context/CurrencyContext';

export interface ScheduleItem {
  period: string | number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  totalPaidToDate?: number;
}

interface AmortizationTableProps {
  title?: string;
  schedule: ScheduleItem[];
  periodLabel?: string;
  initialShowCount?: number;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({
  title = 'Amortization & Repayment Schedule',
  schedule,
  periodLabel = 'Year',
  initialShowCount = 5,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const { currency } = useCurrency();

  if (!schedule || schedule.length === 0) return null;

  const displayList = expanded ? schedule : schedule.slice(0, initialShowCount);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <Table className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {schedule.length} {periodLabel.toLowerCase()}s total
        </span>
      </div>

      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-sans">
              <th className="pb-2.5 font-semibold">{periodLabel}</th>
              <th className="pb-2.5 font-semibold text-right">Principal</th>
              <th className="pb-2.5 font-semibold text-right">Interest</th>
              <th className="pb-2.5 font-semibold text-right">Remaining Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {displayList.map((item, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-2.5 font-semibold text-slate-700 dark:text-slate-300">
                  {typeof item.period === 'number' ? `${periodLabel} ${item.period}` : item.period}
                </td>
                <td className="py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                  {formatCurrency(item.principalPaid, currency)}
                </td>
                <td className="py-2.5 text-right text-amber-600 dark:text-amber-400">
                  {formatCurrency(item.interestPaid, currency)}
                </td>
                <td className="py-2.5 text-right text-slate-800 dark:text-slate-200 font-bold">
                  {formatCurrency(item.remainingBalance, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {schedule.length > initialShowCount && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3.5 w-full py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-colors cursor-pointer"
        >
          {expanded ? (
            <>
              <span>Collapse Schedule</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>View Full Schedule ({schedule.length - initialShowCount} more)</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
};
