import React from 'react';
import { FileText, AlertTriangle, Scale, ShieldAlert, CheckCircle, ArrowRight, Building2, Mail, Landmark } from 'lucide-react';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface TermsPageProps {
  onNavigate: (route: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} onNavigate={onNavigate} />

      {/* Header Banner */}
      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 mb-3">
          <Scale className="w-3.5 h-3.5" />
          <span>User Agreement & Service Conditions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Terms & Conditions
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Last Updated: October 1, 2026 • Published by FinCalc Pro Digital Services
        </p>
      </div>

      {/* Crucial Financial Disclaimer Notice */}
      <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 space-y-1">
            <h2 className="font-bold text-sm sm:text-base">Crucial Financial & Legal Notice</h2>
            <p>
              FinCalc Pro provides deterministic mathematical calculators and educational models. We are <strong>not registered financial planners, investment advisors, broker-dealers, certified public accountants (CPAs), or tax attorneys</strong>. All outputs are mathematical estimations and do not guarantee future investment returns, cryptocurrency trading profitability, or loan underwriting approvals.
            </p>
          </div>
        </div>
      </div>

      {/* Main Terms Sections */}
      <div className="space-y-6 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
        
        {/* Section 1: Operator Details */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" />
            <span>1. Operating Entity & Scope of Agreement</span>
          </h2>
          <p>
            These Terms and Conditions constitute a legally binding agreement between you (whether personally or on behalf of an entity) and <strong>FinCalc Pro Digital Services</strong> ("Company", "we", "us", or "our"), concerning your access to and use of the FinCalc Pro website (<a href="https://fincalcu-pro-jawan-kappa.vercel.app/" className="text-indigo-600 dark:text-indigo-400 underline font-medium">https://fincalcu-pro-jawan-kappa.vercel.app/</a>) and all related progressive web applications (PWAs) and tools.
          </p>
          <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm space-y-1">
            <p><span className="font-semibold text-slate-800 dark:text-slate-200">Legal Entity:</span> FinCalc Pro Digital Services</p>
            <p><span className="font-semibold text-slate-800 dark:text-slate-200">Lead Administrator:</span> Jawan (jawan6853@gmail.com)</p>
            <p><span className="font-semibold text-slate-800 dark:text-slate-200">Legal Desk Email:</span> <a href="mailto:jawan6853@gmail.com?subject=Legal%20Notice%20-%20FinCalc%20Pro" className="font-mono text-indigo-600 dark:text-indigo-400 hover:underline">jawan6853@gmail.com</a></p>
          </div>
          <p className="mt-3">
            By accessing or using the platform, you acknowledge that you have read, understood, and agreed to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms, you are expressly prohibited from using the platform and must discontinue use immediately.
          </p>
        </section>

        {/* Section 2: Intellectual Property */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <span>2. Intellectual Property Rights & Permitted Use</span>
          </h2>
          <p>
            Unless otherwise indicated, the platform and its proprietary software, calculation algorithms, formulas, graphic designs, user interfaces, educational articles, and branding (the "Content") are owned by FinCalc Pro Digital Services and are protected by copyright, trademark, and unfair competition laws.
          </p>
          <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5">You agree that you will not:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Systematically scrape, mirror, or extract calculation engines or content using automated web crawlers or bots without written consent.</li>
              <li>Decompile, disassemble, or reverse-engineer the underlying application bundle.</li>
              <li>Re-package or sell our calculation tools as part of any commercial software product or subscription service.</li>
              <li>Attempt to bypass security measures, trigger distributed denial of service (DDoS) requests, or disrupt normal site performance.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Calculation Disclaimer */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            3. Calculation Accuracy & "As-Is" Mathematical Modeling
          </h2>
          <p>
            All 85 financial and crypto calculation engines available on the platform are provided strictly on an <strong>"as-is" and "as-available" basis</strong> for exploratory and educational research:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
            <li><strong>Input Dependence:</strong> Results are entirely contingent on the accuracy and completeness of the numbers you provide.</li>
            <li><strong>Market & Policy Variations:</strong> Real-world financial figures vary based on individual credit scores, lending bank criteria, broker commissions, gas fees, exchange liquidity, and changing national tax legislation.</li>
            <li><strong>No Fiduciary Relationship:</strong> Using FinCalc Pro does not establish a financial advisor-client, attorney-client, or fiduciary relationship of any nature.</li>
          </ul>
        </section>

        {/* Section 4: Limitation of Liability */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-500" />
            <span>4. Limitation of Liability</span>
          </h2>
          <p>
            To the maximum extent permissible by applicable law, in no event shall FinCalc Pro Digital Services, its operators, developers, or affiliates be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost capital, lost profits, trading drawdowns, cryptocurrency liquidation losses, or bad debt choices arising from your use of the site or reliance on any calculations.
          </p>
        </section>

        {/* Section 5: Advertising Partners */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            5. Third-Party Advertisements & External Links
          </h2>
          <p>
            Our website may present third-party contextual advertisements served through Google AdSense and may include informational links to external resources (such as financial institutions, regulatory bodies, or cryptocurrency resources). FinCalc Pro does not control, endorse, or guarantee the offerings, accuracy, or privacy practices of external third-party sites.
          </p>
        </section>

        {/* Section 6: Dispute Resolution & Governing Law */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-indigo-500" />
            <span>6. Governing Law & Dispute Resolution</span>
          </h2>
          <p>
            These Terms & Conditions and your use of the website shall be governed by and construed in accordance with generally recognized international principles of electronic commerce, consumer protection, and standard dispute resolution procedures.
          </p>
          <p className="mt-2">
            In the event of any controversy, claim, or dispute arising out of your use of FinCalc Pro, the parties agree to first attempt informal amicable negotiation by submitting a written notice of dispute to our designated legal desk at <a href="mailto:jawan6853@gmail.com" className="font-mono text-indigo-600 dark:text-indigo-400 hover:underline">jawan6853@gmail.com</a>.
          </p>
        </section>

        {/* Section 7: Changes & Contact */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-500" />
            <span>7. Contacting the Legal Desk</span>
          </h2>
          <p>
            If you have questions, feedback, or legal inquiries regarding these Terms and Conditions, please contact our administrator:
          </p>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                FinCalc Pro Legal & Compliance Desk
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Operator: FinCalc Pro Digital Services (Attn: Jawan)
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Email: <a href="mailto:jawan6853@gmail.com?subject=Terms%20Inquiry%20-%20FinCalc%20Pro" className="font-mono text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">jawan6853@gmail.com</a>
              </p>
            </div>
            <button
              onClick={() => onNavigate('/contact')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer self-start sm:self-auto shrink-0"
            >
              <span>Contact Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
