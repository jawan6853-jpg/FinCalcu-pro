import React from 'react';
import { FileText, AlertTriangle, Scale, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
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
          Last Updated: September 20, 2026 • Version 2.4
        </p>
      </div>

      {/* Important Disclaimer Notice */}
      <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 space-y-1">
            <h2 className="font-bold text-sm sm:text-base">Crucial Financial Disclaimer</h2>
            <p>
              FinCalc Pro provides deterministic mathematical tools and educational estimates. We are <strong>not registered financial advisers, broker-dealers, CPAs, or tax attorneys</strong>. All outputs are mathematical estimations and do not guarantee actual investment outcomes, trading profits, or loan underwriting approvals.
            </p>
          </div>
        </div>
      </div>

      {/* Main Terms Sections */}
      <div className="space-y-6 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
        
        {/* Section 1 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <span>1. Agreement to Terms</span>
          </h2>
          <p>
            By accessing or using the website at <strong>fincalc.pro</strong> (and any subdomains or related applications), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms & Conditions, our Privacy Policy, and all applicable domestic and international financial regulations.
          </p>
          <p className="mt-2">
            If you do not agree with any portion of these terms, you are expressly prohibited from utilizing our tools, calculators, content, or services.
          </p>
        </section>

        {/* Section 2 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            2. Permitted Use & Intellectual Property
          </h2>
          <p>
            FinCalc Pro grants you a revocable, non-exclusive, non-transferable, limited license to access and use our financial calculators, articles, and interactive visualizers strictly for personal, educational, and non-commercial informational research.
          </p>
          <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5">You agree that you will not:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Scrape, reverse-engineer, decompile, or extract calculator algorithms or site architecture using automated spiders, bots, or crawlers.</li>
              <li>Frame, mirror, or repackage our calculation engines into a commercial software application without prior written licensing agreements.</li>
              <li>Introduce malicious payloads, viruses, DDoS attacks, or automated high-frequency load that interferes with server infrastructure.</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            3. Calculation Accuracy & No Warranties
          </h2>
          <p>
            While our development team rigorously tests every mathematical formula against banking and institutional standards (including standard loan compounding, compound interest, SIP growth, and crypto trading fees):
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
            <li><strong>User-Supplied Variables:</strong> The accuracy of calculation outputs is strictly dependent on the accuracy of the parameters you enter.</li>
            <li><strong>Market Volatility:</strong> Cryptocurrency prices, decentralized finance (DeFi) staking yields, gas fees, and exchange commissions fluctuate dynamically.</li>
            <li><strong>"As-Is" Service:</strong> All services, calculations, and materials are provided strictly on an <em>"as is"</em> and <em>"as available"</em> basis without warranties of any kind, whether express or implied.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-500" />
            <span>4. Limitation of Liability</span>
          </h2>
          <p>
            To the maximum extent permitted under applicable law, in no event shall FinCalc Pro, its operators, developers, affiliates, or licensors be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of capital, trading losses, liquidation of cryptocurrency assets, bad debt decisions, or business interruption arising out of the use or inability to use our tools.
          </p>
        </section>

        {/* Section 5 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            5. Third-Party Links & Advertising
          </h2>
          <p>
            Our website displays third-party advertisements (such as Google AdSense and Adsterra) and may contain links to external third-party websites (such as cryptocurrency exchanges, hardware wallet vendors, or official regulatory portals). FinCalc Pro does not endorse, control, or assume responsibility for the content, privacy practices, or product terms of any third-party services.
          </p>
        </section>

        {/* Section 6 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
            6. Changes to Terms & Contact Information
          </h2>
          <p>
            We reserve the right to revise or update these Terms & Conditions at any time without prior notice. The updated date at the top of this document indicates when changes take effect. Continued use of the platform after any modification constitutes acceptance of the new terms.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Legal & Governance Inquiries
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Email: <span className="font-mono text-indigo-600 dark:text-indigo-400">legal@fincalc.pro</span>
              </p>
            </div>
            <button
              onClick={() => onNavigate('/contact')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>Contact Legal Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
