import React from 'react';
import { Coins, Landmark, ArrowRight, ShieldCheck } from 'lucide-react';
import { TOOLS } from '../../lib/tools';
import { CalculatorCard } from '../common/CalculatorCard';
import { FAQAccordion } from '../common/FAQAccordion';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { AdPlaceholder } from '../common/AdPlaceholder';
import { AdsterraBanner } from '../common/AdsterraBanner';

interface CategoryPageProps {
  category: 'crypto' | 'finance';
  onNavigate: (route: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ category, onNavigate }) => {
  const isCrypto = category === 'crypto';
  const tools = TOOLS.filter((t) => (isCrypto ? t.category === 'crypto' : t.category !== 'crypto'));

  const title = isCrypto ? 'Cryptocurrency Calculators' : 'Personal Finance & Loan Calculators';
  const subtitle = isCrypto
    ? 'Comprehensive suite of crypto calculators for Bitcoin, Ethereum, DeFi, and Altcoins. Calculate profit, ROI, DCA strategies, staking yields, trading commissions, and tax burdens.'
    : 'Professional financial planning tools for loans, investments, mortgages, compound interest, savings goals, and systematic investment plans (SIP).';

  const categoryFAQs = isCrypto
    ? [
        {
          question: 'Why do crypto trading fees significantly impact net profits?',
          answer:
            'Exchanges typically charge maker and taker fees ranging from 0.05% to 0.5% per side. On high-frequency trades or small percentage moves, these roundtrip fees, combined with network gas fees, can turn what looked like a gain into a net loss.',
        },
        {
          question: 'What is the mathematical benefit of Dollar-Cost Averaging (DCA)?',
          answer:
            'DCA reduces timing risk by dividing total capital across regular intervals. When prices decline, your fixed dollar amount purchases more units, lowering your overall average cost per coin and preventing emotional lump-sum buy-ins at market peaks.',
        },
        {
          question: 'How are cryptocurrency taxes calculated?',
          answer:
            'Cryptocurrency is treated as property by tax authorities such as the IRS. Trades, sales for fiat, and crypto-to-crypto swaps trigger capital gains tax events. Positions held over 12 months qualify for preferential long-term capital gains tax rates.',
        },
      ]
    : [
        {
          question: 'How is a monthly loan EMI calculated?',
          answer:
            'EMIs (Equated Monthly Installments) use the reducing balance formula P * r * (1 + r)^n / ((1 + r)^n - 1). Early payments consist predominantly of interest, while later payments pay down principal.',
        },
        {
          question: 'What is the difference between simple interest and compound interest?',
          answer:
            'Simple interest is computed solely on the original principal. Compound interest calculates interest on both the principal and previous accumulated interest, leading to exponential portfolio growth over long time horizons.',
        },
        {
          question: 'What does PITI mean in mortgage calculations?',
          answer:
            'PITI stands for Principal, Interest, Taxes, and Insurance. It represents the complete monthly housing outlay, ensuring home buyers account for property tax and hazard insurance alongside the bank mortgage payment.',
        },
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: isCrypto ? 'Crypto' : 'Finance' }]} onNavigate={onNavigate} />

      {/* Header Banner */}
      <div className="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`p-3 rounded-2xl ${
              isCrypto
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400'
            }`}
          >
            {isCrypto ? <Coins className="w-6 h-6" /> : <Landmark className="w-6 h-6" />}
          </div>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              isCrypto
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300'
            }`}
          >
            {tools.length} Tools Available
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool) => (
          <CalculatorCard key={tool.id} tool={tool} onNavigate={onNavigate} />
        ))}
      </div>

      {/* Adsterra Native Banner Placement */}
      <AdsterraBanner />

      {/* Category FAQs */}
      <div className="mt-14 max-w-4xl mx-auto">
        <FAQAccordion items={categoryFAQs} title={`${isCrypto ? 'Crypto' : 'Finance'} Strategy FAQs`} />
      </div>
    </div>
  );
};
