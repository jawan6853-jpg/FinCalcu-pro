import React from 'react';
import { Calculator, ShieldCheck, ArrowUpRight, Github } from 'lucide-react';
import { TOOLS } from '../../lib/tools';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const cryptoTools = TOOLS.filter((t) => t.category === 'crypto').slice(0, 6);
  const financeTools = TOOLS.filter((t) => t.category !== 'crypto').slice(0, 6);

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-slate-100">
                FinCalc <span className="text-indigo-600 dark:text-indigo-400">Pro</span>
              </span>
            </button>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Free, deterministic, and accurate financial and cryptocurrency calculators. Designed for precision, fast decision-making, and financial literacy.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>100% Client-Side Calculations. No tracking of personal financial data.</span>
            </div>
          </div>

          {/* Col 2: Crypto Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Crypto Calculators
            </h3>
            <ul className="space-y-2 text-sm">
              {cryptoTools.map((tool) => (
                <li key={tool.id}>
                  <button
                    onClick={() => onNavigate(tool.route)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Finance Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Finance & Loans
            </h3>
            <ul className="space-y-2 text-sm">
              {financeTools.map((tool) => (
                <li key={tool.id}>
                  <button
                    onClick={() => onNavigate(tool.route)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Resources & Trust */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Company & Guides
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/learn')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Learn & Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Contact & Feedback
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/faq')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Platform FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/sitemap')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  HTML Sitemap
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Financial Disclaimer Banner */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
          <p>
            <strong className="font-semibold text-slate-600 dark:text-slate-300">Financial & Investment Disclaimer:</strong> All calculators, tools, formulas, and estimates presented on this platform are provided solely for general informational and educational purposes. Calculations are mathematical projections based on user-entered values and assumed constant rates of return or taxation. They do not represent financial, tax, investment, or legal advice, nor do they guarantee future returns or market outcomes. Always consult a certified financial planner, tax professional, or registered financial advisor before making significant financial commitments.
          </p>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} FinCalc Pro. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400">
            <button onClick={() => onNavigate('/privacy-policy')} className="hover:underline cursor-pointer">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('/terms')} className="hover:underline cursor-pointer">
              Terms of Use
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('/disclaimer')} className="hover:underline cursor-pointer">
              Disclaimer
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('/affiliate-disclosure')} className="hover:underline cursor-pointer">
              Affiliate Disclosure
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
