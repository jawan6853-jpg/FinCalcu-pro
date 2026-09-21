import React from 'react';
import {
  Calculator,
  ShieldCheck,
  Lock,
  Mail,
  FileText,
  Scale,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { TOOLS } from '../../lib/tools';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const cryptoTools = TOOLS.filter((t) => t.category === 'crypto').slice(0, 5);
  const financeTools = TOOLS.filter((t) => t.category !== 'crypto').slice(0, 5);

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 mt-auto transition-colors">
      {/* Top Assistance & Feedback Banner */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Have a formula idea or need technical assistance with a calculator?</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/contact-us')}
              className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact Support Desk</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => onNavigate('/privacy-policy')}
              className="inline-flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>Privacy Verified</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 4-Column Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand & Privacy Column (Span 2) */}
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
              Deterministic, private, and mathematically verified financial and cryptocurrency calculators. Designed for precision, portfolio modeling, and financial transparency.
            </p>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>100% Client-Side Computing:</strong> Zero storage of personal financial inputs.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Lock className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>SSL Encrypted • GDPR & CCPA Privacy Compliant</span>
              </div>
            </div>
          </div>

          {/* Crypto Calculators */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3.5">
              Crypto Tools
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
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
              <li className="pt-1">
                <button
                  onClick={() => onNavigate('/crypto')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <span>View all crypto</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Finance Calculators */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3.5">
              Finance & Loans
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
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
              <li className="pt-1">
                <button
                  onClick={() => onNavigate('/finance')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <span>View all finance</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Trust, SEO & Legal Pages (Prominently Highlighted) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3.5 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-indigo-500" />
              <span>Trust & Legal</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/privacy-policy')}
                  className="font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms-and-conditions')}
                  className="font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-indigo-500" />
                  <span>Terms & Conditions</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact-us')}
                  className="font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-3 h-3 text-amber-500" />
                  <span>Contact Us</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/disclaimer')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Financial Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/affiliate-disclosure')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Affiliate Disclosure
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

        {/* Financial & Investment Disclaimer */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
          <p>
            <strong className="font-semibold text-slate-600 dark:text-slate-300">Financial Disclaimer:</strong> FinCalc Pro tools, formulas, and estimates are provided strictly for general informational and educational evaluations. Mathematical projections rely on user-supplied variables and assumed constant growth or taxation rates. FinCalc Pro is not an investment advisor, broker, or CPA firm. Verify all financial decisions with qualified legal, tax, or financial professionals.
          </p>
        </div>

        {/* Bottom Bar with Direct Links */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} FinCalc Pro. All rights reserved.
          </p>

          <nav aria-label="Footer Legal Navigation" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-slate-600 dark:text-slate-300 font-medium">
            <button
              onClick={() => onNavigate('/privacy-policy')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => onNavigate('/terms-and-conditions')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => onNavigate('/contact-us')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer"
            >
              Contact Us
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => onNavigate('/disclaimer')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer"
            >
              Disclaimer
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => onNavigate('/sitemap')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer"
            >
              Sitemap
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
};
