/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/pages/HomePage';
import { CategoryPage } from './components/pages/CategoryPage';
import { AllToolsPage } from './components/pages/AllToolsPage';
import { CurrencyProvider } from './context/CurrencyContext';
import { CalculationHistoryProvider } from './context/CalculationHistoryContext';
import { TOOLS } from './lib/tools';
import { updatePageSeo } from './lib/seo';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { OfflineIndicator } from './components/common/OfflineIndicator';

// Safe lazy loading of heavy calculator engines and secondary content
const CalculatorDispatcher = React.lazy(() =>
  import('./components/calculators/CalculatorDispatcher').then((m) => ({
    default: m.CalculatorDispatcher,
  }))
);
const LearnPage = React.lazy(() =>
  import('./components/pages/LearnPage').then((m) => ({ default: m.LearnPage }))
);
const AboutPage = React.lazy(() =>
  import('./components/pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = React.lazy(() =>
  import('./components/pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const FAQPage = React.lazy(() =>
  import('./components/pages/FAQPage').then((m) => ({ default: m.FAQPage }))
);
const SitemapPage = React.lazy(() =>
  import('./components/pages/SitemapPage').then((m) => ({ default: m.SitemapPage }))
);
const PrivacyPolicyPage = React.lazy(() =>
  import('./components/pages/LegalPages').then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsPage = React.lazy(() =>
  import('./components/pages/LegalPages').then((m) => ({ default: m.TermsPage }))
);
const DisclaimerPage = React.lazy(() =>
  import('./components/pages/LegalPages').then((m) => ({ default: m.DisclaimerPage }))
);
const AffiliateDisclosurePage = React.lazy(() =>
  import('./components/pages/LegalPages').then((m) => ({ default: m.AffiliateDisclosurePage }))
);

export const CANONICAL_REDIRECTS: Record<string, string> = {
  '/crypto-roi-calculator': '/calculators/crypto-roi-calculator',
  '/crypto-dca-calculator': '/calculators/crypto-dca-calculator',
  '/crypto-compound-interest-calculator': '/calculators/crypto-compound-interest-calculator',
  '/crypto-tax-calculator': '/calculators/crypto-tax-calculator',
  '/compound-interest-calculator': '/calculators/compound-interest-calculator',
};

const PageLoader: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-pulse">
    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3 mx-auto mb-4" />
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mx-auto mb-8" />
    <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
  </div>
);

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    const raw = window.location.pathname || '/';
    const clean = raw.replace(/\/+$/, '') || '/';
    if (CANONICAL_REDIRECTS[clean]) {
      const target = CANONICAL_REDIRECTS[clean];
      window.history.replaceState({}, '', target);
      return target;
    }
    return raw;
  });

  // Handle browser back/forward buttons & canonical redirects
  useEffect(() => {
    const handlePopState = () => {
      const raw = window.location.pathname || '/';
      const clean = raw.replace(/\/+$/, '') || '/';
      if (CANONICAL_REDIRECTS[clean]) {
        const target = CANONICAL_REDIRECTS[clean];
        window.history.replaceState({}, '', target);
        setCurrentPath(target);
        return;
      }
      setCurrentPath(raw);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    const clean = route.replace(/\/+$/, '') || '/';
    const targetRoute = CANONICAL_REDIRECTS[clean] || route;
    if (targetRoute === currentPath) return;
    window.history.pushState({}, '', targetRoute);
    setCurrentPath(targetRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resolveTool = (path: string) => {
    if (!path || path === '/') return undefined;
    const clean = path.replace(/\/+$/, '');
    const targetPath = CANONICAL_REDIRECTS[clean] || clean;

    const direct = TOOLS.find((t) => t.route === targetPath);
    if (direct) return direct;

    const segment = targetPath.split('/').pop() || '';
    return TOOLS.find((t) => t.slug === segment || t.id === segment || t.route === `/${segment}`);
  };

  // Synchronize SEO tags and JSON-LD on route changes
  useEffect(() => {
    const clean = (currentPath || '/').replace(/\/+$/, '');
    if (CANONICAL_REDIRECTS[clean]) {
      const target = CANONICAL_REDIRECTS[clean];
      window.history.replaceState({}, '', target);
      setCurrentPath(target);
      return;
    }

    const tool = resolveTool(currentPath);
    if (tool) {
      updatePageSeo({
        title: tool.name,
        description: tool.description,
        path: tool.route,
        tool,
        breadcrumbs: [
          { label: 'Home', href: '/' },
          { label: tool.categoryLabel, href: tool.category === 'crypto' ? '/crypto' : '/finance' },
          { label: tool.name },
        ],
        faqs: tool.faqs,
      });
      return;
    }

    const cleanPath = currentPath.replace(/\/+$/, '') || '/';

    // Standard static routes
    switch (cleanPath) {
      case '/':
        updatePageSeo({
          title: 'FinCalc Pro | Free Finance & Crypto Calculators',
          description:
            `Free suite of ${TOOLS.length} cryptocurrency and personal finance calculators. Calculate crypto profits, staking yields, DCA, loan EMIs, mortgages, and compound interest instantly.`,
          path: '/',
        });
        break;
      case '/crypto':
        updatePageSeo({
          title: 'Cryptocurrency Calculators & Profit Tools',
          description:
            'Free crypto calculators for Bitcoin, Ethereum, and DeFi. Calculate profit/loss, ROI, DCA strategies, staking APY, exchange fees, and crypto taxes.',
          path: '/crypto',
        });
        break;
      case '/finance':
        updatePageSeo({
          title: 'Personal Finance, Loan & Mortgage Calculators',
          description:
            'Financial planning tools for loan EMIs, compound interest, SIP wealth accumulation, savings goals, and mortgage PITI repayments.',
          path: '/finance',
        });
        break;
      case '/calculators':
        updatePageSeo({
          title: 'All Financial & Crypto Calculators Directory',
          description:
            `Browse our complete directory of ${TOOLS.length} deterministic financial calculators designed for investors, traders, and borrowers.`,
          path: '/calculators',
        });
        break;
      case '/learn':
        updatePageSeo({
          title: 'Financial Literacy & Investment Guides',
          description:
            'Learn the principles of Dollar-Cost Averaging, APY vs APR, compound interest Rule of 72, risk management, and crypto taxation.',
          path: '/learn',
        });
        break;
      case '/about':
        updatePageSeo({
          title: 'About FinCalc Pro | Privacy-Focused Financial Tools',
          description:
            'Discover the mission and mathematical standards behind FinCalc Pro. Private client-side calculation suite where computations run locally in your browser.',
          path: '/about',
        });
        break;
      case '/contact':
      case '/contact-us':
        updatePageSeo({
          title: 'Contact Us | FinCalc Pro Support Desk',
          description:
            'Get in touch with the FinCalc Pro engineering team for calculator feedback, formula inquiries, or advertising partnerships.',
          path: '/contact-us',
        });
        break;
      case '/faq':
        updatePageSeo({
          title: 'Platform Frequently Asked Questions',
          description:
            'Frequently asked questions regarding our calculation algorithms, privacy policy, and usage guidelines.',
          path: '/faq',
        });
        break;
      case '/sitemap':
        updatePageSeo({
          title: 'HTML Sitemap | FinCalc Pro Directory',
          description:
            'Index and navigation map of all tools, guides, and disclosures on FinCalc Pro.',
          path: '/sitemap',
        });
        break;
      case '/privacy-policy':
      case '/privacy':
        updatePageSeo({
          title: 'Privacy Policy | FinCalc Pro Client-Side Privacy Guarantee',
          description:
            'Read how FinCalc Pro guarantees your data privacy with 100% client-side computing, zero financial data storage, and Google AdSense compliance.',
          path: '/privacy-policy',
        });
        break;
      case '/terms':
      case '/terms-and-conditions':
      case '/terms-of-service':
        updatePageSeo({
          title: 'Terms & Conditions | FinCalc Pro User Agreement',
          description:
            'Terms and conditions of use, financial disclaimer, and acceptable usage rules for FinCalc Pro tools and content.',
          path: '/terms-and-conditions',
        });
        break;
      case '/disclaimer':
        updatePageSeo({
          title: 'Financial & Investment Disclaimer',
          description:
            'Regulatory disclosure and legal disclaimer: informational tools only, not certified financial or tax advice.',
          path: '/disclaimer',
        });
        break;
      case '/affiliate-disclosure':
        updatePageSeo({
          title: 'Affiliate & Advertising Disclosure',
          description:
            'FTC-compliant affiliate notice and monetization transparency policy for FinCalc Pro.',
          path: '/affiliate-disclosure',
        });
        break;
      default:
        updatePageSeo({
          title: 'Page Not Found',
          description: 'The requested financial calculator or page could not be found.',
          path: currentPath,
        });
    }
  }, [currentPath]);

  // Determine active view
  const renderContent = () => {
    // Check if path matches any tool
    const matchedTool = resolveTool(currentPath);
    if (matchedTool) {
      return (
        <React.Suspense fallback={<PageLoader />}>
          <CalculatorDispatcher tool={matchedTool} onNavigate={navigate} />
        </React.Suspense>
      );
    }

    const cleanPath = currentPath.replace(/\/+$/, '') || '/';

    switch (cleanPath) {
      case '/':
        return <HomePage onNavigate={navigate} />;
      case '/crypto':
        return <CategoryPage category="crypto" onNavigate={navigate} />;
      case '/finance':
        return <CategoryPage category="finance" onNavigate={navigate} />;
      case '/calculators':
        return <AllToolsPage onNavigate={navigate} />;
      case '/learn':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <LearnPage onNavigate={navigate} />
          </React.Suspense>
        );
      case '/about':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <AboutPage onNavigate={navigate} />
          </React.Suspense>
        );
      case '/contact':
      case '/contact-us':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <ContactPage onNavigate={navigate} />
          </React.Suspense>
        );
      case '/faq':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <FAQPage onNavigate={navigate} />
          </React.Suspense>
        );
      case '/sitemap':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <SitemapPage onNavigate={navigate} />
          </React.Suspense>
        );
      case '/privacy-policy':
      case '/privacy':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <PrivacyPolicyPage onNavigate={navigate} />
          </React.Suspense>
        );
      case '/terms':
      case '/terms-and-conditions':
      case '/terms-of-service':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <TermsPage onNavigate={navigate} />
          </React.Suspense>
        );
      case '/disclaimer':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <DisclaimerPage onNavigate={navigate} />
          </React.Suspense>
        );
      case '/affiliate-disclosure':
        return (
          <React.Suspense fallback={<PageLoader />}>
            <AffiliateDisclosurePage onNavigate={navigate} />
          </React.Suspense>
        );
      default:
        return (
          <div className="max-w-xl mx-auto px-4 py-24 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Calculator Not Found
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              We couldn't find the page or calculator you requested. It may have moved or been renamed.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </button>
              <button
                onClick={() => navigate('/calculators')}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                Browse All {TOOLS.length} Calculators
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <CurrencyProvider>
      <CalculationHistoryProvider>
        <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 selection:bg-indigo-500 selection:text-white transition-colors duration-200 font-sans">
          <Header currentPath={currentPath} onNavigate={navigate} />
          <main className="flex-1 w-full">{renderContent()}</main>
          <OfflineIndicator />
          <Footer onNavigate={navigate} />
        </div>
      </CalculationHistoryProvider>
    </CurrencyProvider>
  );
}
