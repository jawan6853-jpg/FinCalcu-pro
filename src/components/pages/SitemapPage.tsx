import React from 'react';
import { Network, ExternalLink, Coins, Landmark, FileText } from 'lucide-react';
import { TOOLS } from '../../lib/tools';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface SitemapPageProps {
  onNavigate: (route: string) => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate }) => {
  const cryptoTools = TOOLS.filter((t) => t.category === 'crypto');
  const financeTools = TOOLS.filter((t) => t.category !== 'crypto');

  const mainPages = [
    { label: 'Home Page', route: '/' },
    { label: 'Cryptocurrency Hub', route: '/crypto' },
    { label: 'Personal Finance Hub', route: '/finance' },
    { label: 'All 15 Calculators Directory', route: '/calculators' },
    { label: 'Learn & Financial Guides', route: '/learn' },
    { label: 'About FinCalc Pro', route: '/about' },
    { label: 'Contact Us', route: '/contact-us' },
    { label: 'Frequently Asked Questions', route: '/faq' },
  ];

  const legalPages = [
    { label: 'Privacy Policy', route: '/privacy-policy' },
    { label: 'Terms & Conditions', route: '/terms-and-conditions' },
    { label: 'Financial & Investment Disclaimer', route: '/disclaimer' },
    { label: 'Affiliate & Advertising Disclosure', route: '/affiliate-disclosure' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: 'HTML Sitemap' }]} onNavigate={onNavigate} />

      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
          <Network className="w-8 h-8 text-indigo-500" />
          <span>HTML Sitemap</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Complete structural directory of all available pages, calculators, guides, and legal disclosures on FinCalc Pro.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Main Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>Core Navigation</span>
          </h2>
          <ul className="space-y-2.5 text-sm">
            {mainPages.map((p) => (
              <li key={p.route}>
                <button
                  onClick={() => onNavigate(p.route)}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>{p.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Crypto Calculators */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>Crypto Calculators ({cryptoTools.length})</span>
          </h2>
          <ul className="space-y-2.5 text-sm">
            {cryptoTools.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => onNavigate(t.route)}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors cursor-pointer"
                >
                  {t.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Finance Calculators */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-indigo-500" />
            <span>Finance Calculators ({financeTools.length})</span>
          </h2>
          <ul className="space-y-2.5 text-sm">
            {financeTools.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => onNavigate(t.route)}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors cursor-pointer"
                >
                  {t.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Disclosures */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
            Legal & Compliance
          </h2>
          <ul className="space-y-2.5 text-sm">
            {legalPages.map((p) => (
              <li key={p.route}>
                <button
                  onClick={() => onNavigate(p.route)}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
