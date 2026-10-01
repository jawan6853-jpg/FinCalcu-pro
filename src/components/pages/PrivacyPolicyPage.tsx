import React from 'react';
import { ShieldCheck, Lock, EyeOff, Cookie, Globe, HelpCircle, CheckCircle2, ArrowRight, Building2, Mail, Clock } from 'lucide-react';
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
          <span>Google AdSense & Webmaster Compliant • Zero-Tracking Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Last Updated & Effective Date: October 1, 2026 • Published by FinCalc Pro Digital Services
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
            <span><strong>100% Client-Side Computing:</strong> All 85 calculations run strictly in your web browser.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Zero Financial Data Stored:</strong> We never log, transmit, or monetize your inputs or results.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Strict AdSense Compliance:</strong> Transparent disclosure of Google advertising cookies.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Full GDPR & CCPA Compliance:</strong> Clear consumer rights, opt-out mechanisms, and DPO desk.</span>
          </li>
        </ul>
      </div>

      {/* Main Privacy Sections */}
      <div className="space-y-6 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
        
        {/* Entity Identification */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" />
            <span>1. Website Operator & Data Controller Information</span>
          </h2>
          <p>
            This website (<a href="https://fincalcu-pro-jawan-kappa.vercel.app/" className="text-indigo-600 dark:text-indigo-400 underline font-medium">FinCalc Pro</a>) is operated by <strong>FinCalc Pro Digital Services</strong>, an independent digital financial technology publisher.
          </p>
          <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Operator & Publisher:</span>
              <span className="text-slate-600 dark:text-slate-400">FinCalc Pro Digital Services</span>
            </div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Designated Compliance Officer:</span>
              <span className="text-slate-600 dark:text-slate-400">Jawan (Lead Administrator)</span>
            </div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Official Support & Privacy Desk:</span>
              <a href="mailto:jawan6853@gmail.com" className="font-mono text-indigo-600 dark:text-indigo-400 hover:underline">jawan6853@gmail.com</a>
            </div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Inquiry Response SLA:</span>
              <span className="text-slate-600 dark:text-slate-400">Within 24 to 48 business hours</span>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-indigo-500" />
            <span>2. Information We Do NOT Collect (Financial Inputs & Private Data)</span>
          </h2>
          <p>
            FinCalc Pro is engineered from the ground up with a <strong>Zero-Knowledge, Client-Side Architecture</strong>. Unlike traditional online banking or custodial services, all calculation logic (including cryptocurrency profit calculations, DCA modeling, futures liquidation, mortgage PITI estimations, loan amortization, and compound interest tables) executes purely within your device’s JavaScript engine.
          </p>
          <p className="mt-3">
            None of the asset values, crypto wallet amounts, trade margins, salary figures, home purchase prices, or loan balances entered into our calculator fields are ever transmitted to our servers, logged in databases, or disclosed to third-party ad networks. Once you refresh your browser or navigate away, your calculations are entirely cleared from runtime memory.
          </p>
        </section>

        {/* Section 3 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-500" />
            <span>3. Technical Server Logs & Hosting Infrastructure</span>
          </h2>
          <p>
            When you access our platform via modern web browsers, our edge hosting infrastructure (hosted via Vercel Edge Network) automatically records standard technical access logs. These logs may include:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
            <li>Internet Protocol (IP) address (anonymized for geolocation and rate limiting)</li>
            <li>Browser type, operating system, and user-agent string</li>
            <li>Date, time stamp, and HTTP referral headers</li>
            <li>HTTP status response codes and byte transmission volumes</li>
          </ul>
          <p className="mt-3">
            These technical server logs are utilized exclusively to protect our infrastructure against distributed denial-of-service (DDoS) attacks, investigate system errors, and ensure high operational availability. Server logs are automatically purged on standard retention schedules and are never linked to any personally identifiable individual.
          </p>
        </section>

        {/* Section 4 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Cookie className="w-5 h-5 text-indigo-500" />
            <span>4. Cookies, Local Storage & Advertising Partners</span>
          </h2>
          <p>
            FinCalc Pro uses essential local browser storage to retain your user experience preferences, such as:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
            <li><strong>Theme Preference:</strong> Retaining Light or Dark mode.</li>
            <li><strong>Preferred Currency:</strong> Persisting your selected global currency (e.g., USD, EUR, GBP, PKR, INR, AED, CAD, AUD, BTC, ETH).</li>
            <li><strong>Calculation History:</strong> Ephemeral calculation history stored strictly in your browser’s LocalStorage, which you can clear at any time with one click.</li>
          </ul>

          <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
              Google AdSense & DoubleClick DART Cookies:
            </h3>
            <p className="text-xs sm:text-sm">
              Google is a third-party advertising partner on our website. Google uses cookies, including the DoubleClick DART cookie, to serve relevant advertisements to visitors based on visits to this and other websites across the Internet.
            </p>
            <p className="text-xs sm:text-sm mt-2">
              Visitors may opt out of personalized advertising by visiting Google’s official{' '}
              <a
                href="https://myadcenter.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-700"
              >
                Google My Ad Center
              </a>{' '}
              or by reviewing the{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-700"
              >
                Google Privacy & Terms for Advertising
              </a>. You can also opt out of participating third-party ad networks at{' '}
              <a
                href="https://optout.aboutads.info/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-700"
              >
                aboutads.info
              </a>.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            5. CCPA & CPRA Privacy Rights (California Consumers)
          </h2>
          <p>
            Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents are entitled to specific privacy protections:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5 text-sm">
            <li><strong>Right to Know:</strong> You may request disclosure of any categories of personal information collected.</li>
            <li><strong>Right to Deletion:</strong> You may request deletion of any personal data collected.</li>
            <li><strong>Right to Opt-Out of Sale / Sharing:</strong> FinCalc Pro <strong>does not sell or rent</strong> your personal data or financial figures to any third parties for monetary or other consideration.</li>
            <li><strong>Right to Non-Discrimination:</strong> We will never penalize or deny services to any user who exercises their statutory privacy rights.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            6. GDPR Data Protection Rights (European Economic Area & UK)
          </h2>
          <p>
            If you are located within the European Economic Area (EEA) or the United Kingdom, you hold fundamental rights under the General Data Protection Regulation (GDPR):
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5 text-sm">
            <li><strong>Right of Access:</strong> Obtain confirmation whether your personal data is being processed and receive a copy.</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate personal records.</li>
            <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request deletion of personal records where retention is no longer justified.</li>
            <li><strong>Right to Restrict or Object to Processing:</strong> Object to processing based on legitimate interest or direct marketing.</li>
            <li><strong>Right to Data Portability:</strong> Receive your provided data in a structured, machine-readable format.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            7. Children’s Online Privacy Protection Act (COPPA)
          </h2>
          <p>
            FinCalc Pro is directed toward adult investors, financial analysts, and consumers aged 18 and older. We do not knowingly collect or solicit personal information from children under the age of 13. If you believe a minor has submitted personal contact details to our desk, please contact us immediately at <a href="mailto:jawan6853@gmail.com" className="font-mono text-indigo-600 dark:text-indigo-400 hover:underline">jawan6853@gmail.com</a>, and we will promptly purge such records.
          </p>
        </section>

        {/* Section 8 - Dedicated Contact */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-500" />
            <span>8. Contacting Our Data Protection Officer (DPO)</span>
          </h2>
          <p>
            If you have questions, feedback, or requests regarding this Privacy Policy, your statutory privacy rights, or cookie management, please reach out to our dedicated privacy desk:
          </p>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                FinCalc Pro Privacy & Compliance Desk
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Attention: Jawan (Lead Administrator & DPO)
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct Email: <a href="mailto:jawan6853@gmail.com?subject=Privacy%20Inquiry%20-%20FinCalc%20Pro" className="font-mono text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">jawan6853@gmail.com</a>
              </p>
            </div>
            <button
              onClick={() => onNavigate('/contact')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer self-start sm:self-auto shrink-0"
            >
              <span>Submit Inquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
