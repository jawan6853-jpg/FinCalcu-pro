import React from 'react';
import { BookOpen, TrendingUp, ShieldAlert, Coins, Landmark, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface LearnPageProps {
  onNavigate: (route: string) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({ onNavigate }) => {
  const articles = [
    {
      id: 'dca-vs-lump-sum',
      category: 'Crypto Strategy',
      title: 'Dollar-Cost Averaging (DCA) vs. Lump Sum: Which Wins?',
      summary:
        'Why automated recurring investments defeat emotional market timing and volatility drawdowns over 3-to-5 year cycles.',
      calculatorRoute: '/crypto-dca-calculator',
      calculatorName: 'Crypto DCA Calculator',
      readTime: '4 min read',
    },
    {
      id: 'apr-vs-apy',
      category: 'Yield & Staking',
      title: 'The Vital Difference Between APR and APY in DeFi & Banking',
      summary:
        'How compounding frequency turns an 8% APR into an 8.33% APY, and why advertised staking returns can be deceptive without compounding frequency clarity.',
      calculatorRoute: '/crypto-staking-calculator',
      calculatorName: 'Staking & APY Calculator',
      readTime: '3 min read',
    },
    {
      id: 'rule-of-72',
      category: 'Wealth Building',
      title: 'The Rule of 72: How Fast Will Your Money Double?',
      summary:
        'A mental math shortcut for investors: divide 72 by your annual rate of return to discover the exact years required to double your capital.',
      calculatorRoute: '/compound-interest-calculator',
      calculatorName: 'Compound Interest Calculator',
      readTime: '3 min read',
    },
    {
      id: 'position-sizing',
      category: 'Risk Management',
      title: 'The 1% Risk Management Rule: Surviving Market Volatility',
      summary:
        'Why professional crypto traders never risk more than 1% to 2% of total equity on any individual trade, regardless of conviction.',
      calculatorRoute: '/crypto-position-size-calculator',
      calculatorName: 'Position Size Calculator',
      readTime: '5 min read',
    },
    {
      id: 'mortgage-piti',
      category: 'Home Financing',
      title: 'Demystifying PITI: The True Cost of Homeownership',
      summary:
        'Why focusing only on the bank interest payment leaves buyers unprepared for escrow property taxes, homeowner insurance, and PMI.',
      calculatorRoute: '/mortgage-calculator',
      calculatorName: 'Mortgage & PITI Calculator',
      readTime: '4 min read',
    },
    {
      id: 'crypto-tax-rules',
      category: 'Tax Planning',
      title: 'Short-Term vs. Long-Term Capital Gains for Crypto Assets',
      summary:
        'Holding a cryptocurrency asset for 366 days instead of 364 days can reduce your federal tax rate by up to 22% in the United States.',
      calculatorRoute: '/crypto-tax-calculator',
      calculatorName: 'Crypto Tax Calculator',
      readTime: '5 min read',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: 'Learn & Financial Guides' }]} onNavigate={onNavigate} />

      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Educational Academy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Financial Literacy & Calculation Guides
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Master the core principles of investing, risk mitigation, debt amortization, and tax strategy with our plain-English breakdown guides.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art) => (
          <div
            key={art.id}
            className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {art.category}
                </span>
                <span>{art.readTime}</span>
              </div>

              <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 leading-snug">
                {art.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                {art.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => onNavigate(art.calculatorRoute)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <span>Try {art.calculatorName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
