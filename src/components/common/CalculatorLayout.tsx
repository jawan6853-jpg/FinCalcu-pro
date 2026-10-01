import React from 'react';
import { ToolItem } from '../../types';
import { Breadcrumbs } from './Breadcrumbs';
import { DynamicIcon } from './DynamicIcon';
import { FAQAccordion } from './FAQAccordion';
import { AdPlaceholder } from './AdPlaceholder';
import { useCurrency } from '../../context/CurrencyContext';
import {
  Calculator,
  BookOpen,
  Sparkles,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { TOOLS } from '../../lib/tools';

interface CalculatorLayoutProps {
  tool: ToolItem;
  inputsComponent: React.ReactNode;
  resultsComponent: React.ReactNode;
  chartComponent?: React.ReactNode;
  scheduleComponent?: React.ReactNode;
  mobileQuickSummary?: {
    label: string;
    value: string;
    subValue?: string;
    status?: 'positive' | 'negative' | 'neutral';
  };
  onNavigate: (route: string) => void;
}

export const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({
  tool,
  inputsComponent,
  resultsComponent,
  chartComponent,
  scheduleComponent,
  mobileQuickSummary,
  onNavigate,
}) => {
  const { currency, currencySymbol, rates } = useCurrency();
  const currentRate = rates?.[currency];

  const relatedToolItems = (tool.relatedTools || [])
    .map((rId) => TOOLS.find((t) => t.id === rId || t.slug === rId))
    .filter((t): t is ToolItem => !!t)
    .slice(0, 5);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: tool.categoryLabel, href: tool.category === 'crypto' ? '/crypto' : '/finance' },
    { label: tool.name },
  ];

  const inputKeyList = tool.exampleCalculation?.inputs
    ? Object.keys(tool.exampleCalculation.inputs)
    : [];

  const outputEntries = tool.exampleCalculation?.outputs
    ? Object.entries(tool.exampleCalculation.outputs)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-xs">
              <DynamicIcon name={tool.icon} className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {tool.categoryLabel}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Formula-Based Calculator
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {tool.name}
              </h1>
            </div>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          {tool.description}
        </p>

        {/* Quick Instructions Banner */}
        <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
            Quick User Guide:
          </span>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <li className="flex items-start gap-1.5">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-indigo-600 text-white font-mono font-bold text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <span>
                <strong>Enter Values:</strong> Fill in your financial parameters into the input fields below.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-indigo-600 text-white font-mono font-bold text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <span>
                <strong>Instant Calculation:</strong> Real-time results, charts, and breakdowns update automatically.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-indigo-600 text-white font-mono font-bold text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <span>
                <strong>Save or Export:</strong> Save your session or copy details for records and analysis.
              </span>
            </li>
          </ol>
        </div>
      </div>

      {/* Core Calculator Two-Column Work Area (Immediate interaction) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Calculator Inputs */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-500" />
              <span>Input Parameters</span>
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 font-bold">
                {currency} ({currencySymbol})
              </span>
              {currency !== 'USD' && currentRate && (
                <span className="hidden sm:inline text-[11px] text-slate-400">
                  1 USD ≈ {currentRate.toFixed(2)} {currency}
                </span>
              )}
            </div>
          </div>

          {inputsComponent}
        </div>

        {/* Right Column: Instant Results & Breakdown (Sticky on Desktop) */}
        <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-20">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Calculation Results
              </h2>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Updated
              </span>
            </div>

            {resultsComponent}
          </div>

          {/* Ad Container: Positioned Below Results */}
          <div id="ad-container-below-results" className="w-full">
            <AdPlaceholder slotId="ad-slot-sidebar" />
          </div>

          {/* Optional Visual Chart */}
          {chartComponent}
        </div>
      </div>

      {/* Optional Full Schedule / Amortization Breakdown Table */}
      {scheduleComponent && (
        <div className="mt-8">
          {scheduleComponent}
        </div>
      )}

      {/* Mid-Content Ad Container */}
      <div id="ad-container-mid-content" className="w-full my-8">
        <AdPlaceholder slotId="ad-slot-content" />
      </div>

      {/* In-Depth Educational Content, Formula, & Example */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formula & Explanation */}
        <div className="lg:col-span-7 space-y-8">
          {/* Calculator-Specific Educational Guide */}
          <article className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span>Understanding the {tool.name}</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {tool.description} This financial calculation engine evaluates your parameters through deterministic mathematical modeling, allowing you to quantify costs, project outcomes, and compare alternative financial strategies with precision.
            </p>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2.5">
              How to Use This {tool.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Calculating your estimated figures takes three simple steps:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
              <li>
                <strong>Configure Base Values:</strong> Enter your financial inputs{' '}
                {inputKeyList.length > 0
                  ? `(such as ${inputKeyList.slice(0, 3).join(', ')}${inputKeyList.length > 3 ? ', and related variables' : ''})`
                  : ''}{' '}
                into the input form.
              </li>
              <li>
                <strong>Review Calculated Metrics:</strong> Examine the real-time breakdown of estimated values, percentage rates, and visual projections.
              </li>
              <li>
                <strong>Evaluate Sensitivity:</strong> Test different rates, time horizons, or contribution amounts to identify optimal scenarios for your budget or portfolio.
              </li>
            </ol>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2.5">
              Interpreting Your Calculation Results
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              The primary metrics provided by this calculator represent formula-based estimates designed to clarify financial trade-offs:
            </p>
            {outputEntries.length > 0 && (
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600 dark:text-slate-400 mb-4">
                {outputEntries.map(([key, val]) => (
                  <li key={key}>
                    <strong>{key}:</strong> Estimated baseline sample value {val}, calculated using standard industry compounding or discounting logic.
                  </li>
                ))}
              </ul>
            )}
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Use these metrics to establish realistic benchmarks and compare against your personal financial plan, loan offers, or investment alternatives.
            </p>
          </article>

          {/* Formula Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <span>Formula & Mathematical Methodology</span>
            </h2>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm text-indigo-700 dark:text-indigo-300 font-semibold mb-4 overflow-x-auto">
              {tool.formulaSummary}
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Our financial calculations adhere strictly to standard industry mathematical conventions:
            </p>

            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {tool.formulaDetails.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                  <span className="font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-300">
                    {detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step-by-Step Example Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              {tool.exampleCalculation.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
              {tool.exampleCalculation.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-sans font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Sample Inputs
                </span>
                <dl className="space-y-1">
                  {Object.entries(tool.exampleCalculation.inputs).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <dt className="text-slate-500 truncate">{k}:</dt>
                      <dd className="text-slate-900 dark:text-slate-200 font-semibold shrink-0">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                <span className="font-sans font-bold text-indigo-900 dark:text-indigo-200 block mb-2">
                  Calculated Output
                </span>
                <dl className="space-y-1">
                  {Object.entries(tool.exampleCalculation.outputs).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <dt className="text-indigo-600/80 dark:text-indigo-400 truncate">{k}:</dt>
                      <dd className="text-indigo-950 dark:text-indigo-100 font-bold shrink-0">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {/* Important Notes & Caveats */}
          <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-1">Important Calculation Assumptions & Limitations:</strong>
              Financial formulas assume consistent intervals, compounding frequencies, and constant rates over the simulated period. Actual bank policies, exchange execution slippage, lender requirements, market return fluctuations, and local tax laws will produce variances in real-world results. All calculations are provided for informational and educational purposes only.
            </div>
          </div>
        </div>

        {/* FAQs & Related Tools */}
        <div className="lg:col-span-5 space-y-8">
          {/* FAQ Accordion */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <FAQAccordion items={tool.faqs} title="Frequently Asked Questions" />
          </div>

          {/* Related Tools */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <span>Related Financial Calculators</span>
            </h3>
            <div className="space-y-3">
              {relatedToolItems.map((rTool) => (
                <button
                  key={rTool.id}
                  onClick={() => onNavigate(rTool.route)}
                  className="w-full p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      <DynamicIcon name={rTool.icon} className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                        {rTool.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {rTool.categoryLabel}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Sticky Quick Summary on Mobile Viewports */}
      {mobileQuickSummary && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3.5 shadow-2xl flex items-center justify-between no-print">
          <div className="min-w-0 pr-3">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">
              {mobileQuickSummary.label}
            </span>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-lg font-extrabold font-mono tracking-tight ${
                  mobileQuickSummary.status === 'positive'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : mobileQuickSummary.status === 'negative'
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-indigo-600 dark:text-indigo-400'
                }`}
              >
                {mobileQuickSummary.value}
              </span>
              {mobileQuickSummary.subValue && (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                  {mobileQuickSummary.subValue}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            className="shrink-0 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
};
