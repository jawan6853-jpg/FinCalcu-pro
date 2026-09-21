import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, TrendingUp, Sparkles } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { SupportedCurrency, CURRENCY_SYMBOLS } from '../../lib/formatters';

const CURRENCY_LIST: { code: SupportedCurrency; name: string; symbol: string; flag: string }[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs', flag: '🇵🇰' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', flag: '🇸🇦' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', flag: '🪙' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', flag: '🔷' },
];

export const CurrencySelector: React.FC = () => {
  const { currency, setCurrency, isAutoCurrency, setAutoCurrency, rates, lastUpdated } = useCurrency();
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

  const activeItem = CURRENCY_LIST.find((c) => c.code === currency);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-2xs cursor-pointer"
        aria-label="Select Currency"
        title="Change Display Currency"
      >
        {isAutoCurrency ? (
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">Auto</span>
          </span>
        ) : null}
        <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
          {activeItem?.symbol || CURRENCY_SYMBOLS[currency] || '$'}
        </span>
        <span className="hidden sm:inline font-mono">{currency}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Select Currency
              </span>
              {isAutoCurrency && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-2.5 h-2.5" /> Auto Detected
                </span>
              )}
            </div>

            {/* Auto Detect Button */}
            <button
              type="button"
              onClick={() => {
                setAutoCurrency();
                setIsOpen(false);
              }}
              className={`mt-2 w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isAutoCurrency
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Auto-Detect Currency</span>
              </div>
              {isAutoCurrency ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="text-[10px] text-slate-400">by Location</span>}
            </button>

            {lastUpdated && (
              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span>Live rates synced: {lastUpdated}</span>
              </div>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto py-1">
            {CURRENCY_LIST.map((item) => {
              const isSelected = !isAutoCurrency && item.code === currency;
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
                    <span className="text-base">{item.flag}</span>
                    <span className="w-7 font-bold font-mono text-xs text-indigo-600 dark:text-indigo-400">
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
