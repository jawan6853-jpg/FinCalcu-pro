import React from 'react';
import { ShieldCheck, FileText, AlertTriangle, HelpCircle } from 'lucide-react';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface LegalPageProps {
  onNavigate: (route: string) => void;
}

// 1. Privacy Policy
export const PrivacyPolicyPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} onNavigate={onNavigate} />

      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Last Updated: September 19, 2026
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed space-y-6">
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            1. Core Privacy Principle: Zero Data Transmission
          </h2>
          <p>
            At FinCalc Pro, we respect your financial privacy above all else. All calculation engines (including crypto profits, loans, mortgages, staking yields, and tax estimations) execute <strong>strictly client-side within your web browser</strong> using local JavaScript.
          </p>
          <p className="mt-2">
            None of your financial inputs, balances, loan terms, asset values, or computed results are transmitted to, processed by, or stored on our servers.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            2. Local Storage & Cookies
          </h2>
          <p>
            We use browser <code>localStorage</code> solely to remember your chosen theme preference (Light or Dark mode). We do not set tracking cookies or sell your browsing history to third-party data brokers.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            3. Third-Party Advertising (Google AdSense)
          </h2>
          <p>
            We may partner with third-party ad networks, including Google AdSense, to display advertisements that support our free service. Google uses cookies (such as the DoubleClick cookie) to serve ads based on prior visits to our website or other websites on the Internet.
          </p>
          <p className="mt-2">
            Users may opt out of personalized advertising by visiting Google's{' '}
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 underline"
            >
              Ads Settings
            </a>
            .
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            4. Contacting Us
          </h2>
          <p>
            If you have questions regarding this Privacy Policy, you may contact us via our{' '}
            <button
              onClick={() => onNavigate('/contact')}
              className="text-indigo-600 dark:text-indigo-400 font-semibold underline cursor-pointer"
            >
              Contact Page
            </button>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

// 2. Terms of Use
export const TermsPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: 'Terms of Use' }]} onNavigate={onNavigate} />

      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Terms of Use
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Effective Date: September 19, 2026
        </p>
      </div>

      <div className="space-y-6 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using FinCalc Pro, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            2. Permitted Educational Use
          </h2>
          <p>
            Permission is granted to use our calculations and tools for personal, educational, and general business informational evaluation. You may copy, print, or bookmark calculation results for your personal records.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            3. Disclaimer of Warranties
          </h2>
          <p>
            The materials and tools on FinCalc Pro are provided on an "as is" basis. While we strive for absolute mathematical precision, FinCalc Pro makes no warranties, expressed or implied, regarding the commercial viability or financial outcomes resulting from these estimates.
          </p>
        </div>
      </div>
    </div>
  );
};

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
          Mandatory Regulatory Disclosure
        </p>
      </div>

      <div className="space-y-6 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            Not Financial, Tax, or Legal Advice
          </h2>
          <p>
            The information, formulas, and estimates generated by FinCalc Pro are provided strictly for educational and self-directed exploratory purposes. <strong>FinCalc Pro is not a registered investment advisor, broker-dealer, financial planner, or certified tax professional.</strong>
          </p>
          <p className="mt-3">
            None of the content or calculation outputs constitute a recommendation or solicitation to purchase or liquidate any security, digital asset, cryptocurrency, commodity, or mortgage product.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            Market Risks & Volatility
          </h2>
          <p>
            Cryptocurrency assets are subject to extreme market volatility, smart contract risks, regulatory uncertainty, and potential total loss of capital. Past performance or theoretical historical DCA yields do not predict or guarantee future market returns.
          </p>
          <p className="mt-3">
            Always consult a qualified certified financial planner (CFP) or certified public accountant (CPA) before making significant financial commitments or tax filings.
          </p>
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
          FTC Compliance & Transparent Monetization Policy
        </p>
      </div>

      <div className="space-y-6 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            1. FTC Compliance Notice
          </h2>
          <p>
            In compliance with Federal Trade Commission (FTC) guidelines, please assume that certain links, banner advertisements, or product references on this site may be affiliate links.
          </p>
          <p className="mt-3">
            If you click on an affiliate link and choose to sign up or purchase a service (such as a hardware wallet, banking service, or crypto exchange), FinCalc Pro may earn a small referral commission at absolutely no additional cost to you.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            2. Mathematical Independence
          </h2>
          <p>
            Our calculation formulas, interest calculations, fee comparisons, and mathematical algorithms are 100% independent and unaffected by any advertiser relationships. We never alter formulas or inflate returns for any commercial partner.
          </p>
        </div>
      </div>
    </div>
  );
};
