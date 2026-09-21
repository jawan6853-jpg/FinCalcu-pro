import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, TrendingUp } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { SupportedCurrency, CURRENCY_SYMBOLS } from '../../lib/formatters';

const CURRENCY_LIST: { code: SupportedCurrency; name: string; symbol: string }[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ' },
];

export const CurrencySelector: React.FC = () => {
  const { currency, setCurrency, rates, lastUpdated } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-2xs cursor-pointer"
        aria-label="Select Currency"
        title="Change Display Currency"
      >
        <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
          {CURRENCY_SYMBOLS[currency] || '$'}
        </span>
        <span className="hidden sm:inline font-mono">{currency}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Select Currency
            </div>
            {lastUpdated && (
              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span>Rates synced: {lastUpdated}</span>
              </div>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto py-1">
            {CURRENCY_LIST.map((item) => {
              const isSelected = item.code === currency;
              const rate = rates[item.code];

              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setCurrency(item.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                    isSelected ? 'bg-indigo-50/60 dark:bg-indigo-950/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 text-center font-bold font-mono text-indigo-600 dark:text-indigo-400">
                      {item.symbol}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.code} {item.code !== 'USD' && rate ? `≈ ${(rate).toFixed(2)} / USD` : ''}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
