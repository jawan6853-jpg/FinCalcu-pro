import React from 'react';
import { AlertTriangle, ShieldCheck, Mail, Building2 } from 'lucide-react';
import { Breadcrumbs } from '../common/Breadcrumbs';

export { PrivacyPolicyPage } from './PrivacyPolicyPage';
export { TermsPage } from './TermsPage';

interface LegalPageProps {
  onNavigate: (route: string) => void;
}

// 3. Disclaimer
export const DisclaimerPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: 'Disclaimer' }]} onNavigate={onNavigate} />

      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
          <span>Financial & Investment Disclaimer</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Mandatory Regulatory Disclosure • Published by FinCalc Pro Digital Services
        </p>
      </div>

      <div className="space-y-6 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            Not Financial, Tax, or Legal Advice
          </h2>
          <p>
            The formulas, algorithms, visual charts, and numerical estimates generated across all 85 calculators on FinCalc Pro are provided strictly for educational and personal informational purposes. <strong>FinCalc Pro Digital Services is not a licensed financial advisor, broker-dealer, investment fund manager, certified public accountant (CPA), or certified financial planner (CFP).</strong>
          </p>
          <p className="mt-3">
            None of the content or calculation outputs constitute a financial recommendation, endorsement, or solicitation to purchase, hold, or liquidate any security, digital asset, cryptocurrency, commodity, or mortgage product.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            Cryptocurrency Volatility & Market Risk Notice
          </h2>
          <p>
            Digital assets and cryptocurrencies are characterized by rapid price fluctuations, smart contract vulnerabilities, regulatory shifts, and potential total loss of invested capital. Theoretical backtests or historical dollar-cost averaging (DCA) returns do not guarantee future profitability.
          </p>
          <p className="mt-3">
            Always seek advice from a certified, independent financial advisor before executing high-leverage trades or significant loan agreements.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">Regulatory Compliance Desk:</span>
            <span className="text-slate-600 dark:text-slate-400">FinCalc Pro Digital Services (Attn: Jawan)</span>
          </div>
          <a
            href="mailto:jawan6853@gmail.com?subject=Regulatory%20Inquiry%20-%20FinCalc%20Pro"
            className="font-mono text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            jawan6853@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

// 4. Affiliate Disclosure
export const AffiliateDisclosurePage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: 'Affiliate Disclosure' }]} onNavigate={onNavigate} />

      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Affiliate & Advertising Disclosure
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          FTC Compliance & Transparent Monetization Policy • Published by FinCalc Pro Digital Services
        </p>
      </div>

      <div className="space-y-6 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            1. FTC Compliance & Transparent Monetization Policy
          </h2>
          <p>
            In compliance with United States Federal Trade Commission (FTC) guidelines and international advertising standards, please assume that certain links, partner mentions, or contextual banner displays on FinCalc Pro may be affiliate or sponsored links.
          </p>
          <p className="mt-3">
            If you click on an affiliate link and choose to sign up with a partner platform (such as a hardware wallet vendor, crypto exchange, or personal finance software), FinCalc Pro Digital Services may earn a small referral commission at <strong>zero additional cost to you</strong>.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            2. Mathematical Independence Guarantee
          </h2>
          <p>
            Our calculation engines, loan schedules, interest rates, and cryptocurrency metrics are 100% deterministic, open, and mathematically independent. We <strong>never alter formulas, inflate returns, or favor specific commercial partners</strong> in any calculation result.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">Publisher & Disclosure Desk:</span>
            <span className="text-slate-600 dark:text-slate-400">FinCalc Pro Digital Services (Attn: Jawan)</span>
          </div>
          <a
            href="mailto:jawan6853@gmail.com?subject=Affiliate%20Inquiry%20-%20FinCalc%20Pro"
            className="font-mono text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            jawan6853@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};
