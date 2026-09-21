import React from 'react';
import { ShieldCheck, Lock, EyeOff, Cookie, Globe, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface PrivacyPolicyPageProps {
  onNavigate: (route: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} onNavigate={onNavigate} />

      {/* Header Banner */}
      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Google AdSense & Webmaster Compliant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Last Updated & Effective Date: September 20, 2026
        </p>
      </div>

      {/* Key Highlights Card */}
      <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
        <h2 className="text-base font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2 mb-3">
          <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Summary of Our Privacy Guarantee</span>
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-indigo-900/80 dark:text-indigo-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>100% Client-Side Computing:</strong> All calculations run locally in your browser.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Zero Financial Data Stored:</strong> We never log your profits, balances, or trades.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Transparent Advertising:</strong> Clear disclosure of Google AdSense & Adsterra cookies.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Full GDPR & CCPA Compliance:</strong> Users hold full rights over their personal data.</span>
          </li>
        </ul>
      </div>

      {/* Main Privacy Sections */}
      <div className="space-y-6 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
        
        {/* Section 1 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-indigo-500" />
            <span>1. Information We Do NOT Collect (Financial Inputs)</span>
          </h2>
          <p>
            FinCalc Pro is engineered with a strict <strong>Privacy-First Architecture</strong>. Unlike traditional cloud banking or custodial apps, our calculation engines (including the Crypto Profit Calculator, Loan EMI Calculator, Compound Interest Estimator, Mortgage Calculator, and Staking APY tool) execute purely client-side through Javascript inside your web browser.
          </p>
          <p className="mt-3">
            None of the asset amounts, crypto purchase quantities, trade margins, salary inputs, or loan balances entered into our tools are ever sent to our web servers, stored in cloud databases, or shared with third parties. Once you close or reload your browser tab, ephemeral calculation states are instantly cleared.
          </p>
        </section>

        {/* Section 2 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-500" />
            <span>2. Standard Log Files & Analytics</span>
          </h2>
          <p>
            Like virtually all website operators, we follow standard industry procedures regarding server log files. The data captured in log files includes Internet Protocol (IP) addresses, browser type, Internet Service Provider (ISP), referring/exit pages, date and time stamps, and platform type.
          </p>
          <p className="mt-3">
            This technical information is collected strictly for system administration, cyber-security defense, diagnosing technical routing issues, and tracking aggregate traffic trends across the website. These logs are never linked to any personally identifiable information.
          </p>
        </section>

        {/* Section 3 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Cookie className="w-5 h-5 text-indigo-500" />
            <span>3. Cookies, Web Beacons, and Advertising Partners</span>
          </h2>
          <p>
            FinCalc Pro uses cookies to optimize your browsing experience (for example, persisting your preferred Light/Dark theme and selected base currency in local storage).
          </p>
          <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
              Google AdSense & DoubleClick DART Cookies:
            </h3>
            <p className="text-xs sm:text-sm">
              Google is a third-party vendor on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to fincalc.pro and other sites on the internet. You may opt out of the use of the DART cookie by visiting the{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-700"
              >
                Google Ad and Content Network Privacy Policy
              </a>.
            </p>
          </div>
          <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
              Third-Party Advertising Networks (Adsterra & Partners):
            </h3>
            <p className="text-xs sm:text-sm">
              Third-party ad servers or ad networks (including Adsterra) use technologies like cookies, JavaScript, or Web Beacons in their respective advertisements and links that appear on our platform. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or personalize advertising content. FinCalc Pro has no access to or control over cookies that are used by third-party advertisers.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            4. CCPA / CPRA Privacy Rights (California Residents)
          </h2>
          <p>
            Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California consumers have specific rights:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5 text-sm">
            <li><strong>The right to know:</strong> Request that a business disclose the categories and specific pieces of personal data collected.</li>
            <li><strong>The right to deletion:</strong> Request that a business delete any personal data collected about the consumer.</li>
            <li><strong>The right to opt-out of sale/sharing:</strong> Request that a business that sells or shares consumer data not sell or share that data. Note: FinCalc Pro does not sell or rent personal information to third parties.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            5. GDPR Data Protection Rights (European Economic Area)
          </h2>
          <p>
            If you are a resident of the European Economic Area (EEA), you are entitled to the following data protection rights:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5 text-sm">
            <li><strong>Right of access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong>Right to rectification:</strong> You have the right to request that we correct information you believe is inaccurate.</li>
            <li><strong>Right to erasure:</strong> You have the right to request that we erase your personal data under certain conditions.</li>
            <li><strong>Right to object to processing:</strong> You have the right to object to our processing of your personal data.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            6. Children's Online Privacy Protection (COPPA)
          </h2>
          <p>
            Protecting the privacy of young children is especially important. FinCalc Pro does not knowingly collect or solicit any personally identifiable information from children under the age of 13. If a parent or guardian believes that FinCalc Pro has in its database personal information of a child under 13, please contact us immediately, and we will promptly remove such information from our records.
          </p>
        </section>

        {/* Section 7 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            7. Contacting Our Privacy & Compliance Team
          </h2>
          <p>
            If you have questions, feedback, or requests regarding this Privacy Policy, your rights under GDPR/CCPA, or cookie preferences, please contact our compliance desk:
          </p>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Data Protection Officer (DPO)
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Email: <span className="font-mono text-indigo-600 dark:text-indigo-400">privacy@fincalc.pro</span>
              </p>
            </div>
            <button
              onClick={() => onNavigate('/contact')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>Submit Privacy Inquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
