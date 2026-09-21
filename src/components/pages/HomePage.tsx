import React, { useState } from 'react';
import { Calculator, ShieldCheck, Sparkles, TrendingUp, Coins, Landmark, CheckCircle2 } from 'lucide-react';
import { TOOLS } from '../../lib/tools';
import { CalculatorCard } from '../common/CalculatorCard';
import { FAQAccordion } from '../common/FAQAccordion';
import { AdPlaceholder } from '../common/AdPlaceholder';
import { AdsterraBanner } from '../common/AdsterraBanner';
import { SearchBar } from '../common/SearchBar';

interface HomePageProps {
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'crypto' | 'finance'>('all');

  const filteredTools = TOOLS.filter((tool) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'crypto') return tool.category === 'crypto';
    return tool.category !== 'crypto';
  });

  const generalFAQs = [
    {
      question: 'Are all calculators on FinCalc Pro completely free to use?',
      answer:
        'Yes, 100% of our calculators, formulas, and visual breakdowns are free to use without registration, subscriptions, or paywalls.',
    },
    {
      question: 'Is my personal financial information or wallet data stored?',
      answer:
        'Never. Every single calculation runs locally and deterministically in your browser. We never transmit, store, or log your numbers, income, debt, or crypto portfolios on any server.',
    },
    {
      question: 'How accurate are the financial and cryptocurrency formulas?',
      answer:
        'Our formulas implement standard financial industry mathematics (such as standard amortization for loans, geometric CAGR, discrete compounding for APY, and IRS guidelines for short-term vs long-term capital gains).',
    },
    {
      question: 'Can I export or print my calculation results?',
      answer:
        'Yes, each calculator features a quick "Copy Results" button to paste into spreadsheets or notes, as well as a "Print / Save PDF" feature styled specifically for clean document printing.',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-linear-to-b from-indigo-50/50 via-white to-white dark:from-slate-900/40 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>15 Free Professional Calculators • Instant & Deterministic</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Financial & Crypto Precision.{' '}
            <span className="text-indigo-600 dark:text-indigo-400">Zero Guesswork.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Calculate crypto profits, staking yields, DCA schedules, loan EMIs, compound interest, and mortgages with instant live mathematical models.
          </p>

          {/* Quick Search & Explore */}
          <div className="mt-8 max-w-md mx-auto">
            <SearchBar onNavigate={onNavigate} />
          </div>

          {/* Trust Highlights */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Private & Client-Side</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
              <span>Standard Financial Math</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span>Real-Time Interactive Charts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Calculators Directory Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Category Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Explore Calculators
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select a category to filter or browse all 15 financial tools below
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Tools ({TOOLS.length})
            </button>
            <button
              onClick={() => setSelectedCategory('crypto')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'crypto'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Crypto ({TOOLS.filter((t) => t.category === 'crypto').length})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('finance')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'finance'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Finance ({TOOLS.filter((t) => t.category !== 'crypto').length})</span>
            </button>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <CalculatorCard key={tool.id} tool={tool} onNavigate={onNavigate} />
          ))}
        </div>

        {/* Adsterra Native Banner Placement */}
        <AdsterraBanner />

        {/* Why FinCalc Pro Section */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Engineered for Speed, Privacy & Precision
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Why thousands of investors, homeowners, and crypto traders rely on our calculation suite every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
                100% Client-Side Privacy
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Your financial numbers never leave your browser. Zero tracking of income, trade sizes, net worth, or private calculations.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
                Deterministic Accuracy
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Rigorous financial algorithms with fee inclusion, compounding schedules, and step-by-step mathematical breakdowns.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
                Visual Schedules & Charts
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Understand compounding, interest-to-principal proportions, and portfolio appreciation through dynamic charts and tables.
              </p>
            </div>
          </div>
        </div>

        {/* Global FAQ Section */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800 max-w-4xl mx-auto">
          <FAQAccordion items={generalFAQs} title="Frequently Asked Questions" />
        </div>
      </section>
    </div>
  );
};
