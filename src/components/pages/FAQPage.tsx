import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQAccordion } from '../common/FAQAccordion';

interface FAQPageProps {
  onNavigate: (route: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const allPlatformFAQs = [
    {
      question: 'Are FinCalc Pro calculators completely free?',
      answer:
        'Yes. All 15 calculators are completely free to use without requiring an account, sign-up, or subscription.',
    },
    {
      question: 'Do you store or transmit any calculation data?',
      answer:
        'No. Every single calculation runs locally in your browser (client-side JavaScript). None of your inputs, balances, interest rates, or results are sent to any remote database or third party.',
    },
    {
      question: 'How do crypto exchange trading fees impact my profit?',
      answer:
        'Exchange fees are typically charged on both purchase (maker/taker fee) and liquidation. A 0.1% buy fee plus a 0.1% sell fee equals 0.2% roundtrip, plus any network gas fees. Our Crypto Profit and Trading Fee calculators deduct these automatically.',
    },
    {
      question: 'What is the standard formula for a mortgage or loan payment (EMI)?',
      answer:
        'We use the standard amortization formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1), where P is principal borrowed, r is the periodic monthly interest rate, and n is the total number of monthly payments.',
    },
    {
      question: 'Can I use these calculations for official tax filing or legal agreements?',
      answer:
        'No. Our tools provide informational and educational estimates. Real-world tax regulations vary by jurisdiction, filing status, state brackets, and specific transaction histories. Always consult a Certified Public Accountant (CPA) or licensed financial advisor.',
    },
    {
      question: 'How does Dollar-Cost Averaging (DCA) work in practice?',
      answer:
        'Dollar-Cost Averaging is an investment method where a fixed dollar amount is invested on a regular schedule (e.g., $100 every Monday) regardless of market price. When prices drop, your dollar buys more units, lowering your average cost per unit.',
    },
    {
      question: 'How do I print or save my calculation as a PDF?',
      answer:
        'Each calculator has a "Print / Save PDF" button. When clicked, it opens your system print dialog with optimized print styles that hide advertisements, navigation menus, and footers for a clean 1-page report.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: 'Platform FAQs' }]} onNavigate={onNavigate} />

      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Common questions about our financial mathematical models, privacy architecture, and calculator features.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
        <FAQAccordion items={allPlatformFAQs} title="Platform & Mathematical Inquiries" />
      </div>
    </div>
  );
};
