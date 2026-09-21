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
import { LearnPage } from './components/pages/LearnPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { FAQPage } from './components/pages/FAQPage';
import { SitemapPage } from './components/pages/SitemapPage';
import {
  PrivacyPolicyPage,
  TermsPage,
  DisclaimerPage,
  AffiliateDisclosurePage,
} from './components/pages/LegalPages';
import { CalculatorDispatcher } from './components/calculators/CalculatorDispatcher';
import { CurrencyProvider } from './context/CurrencyContext';
import { CalculationHistoryProvider } from './context/CalculationHistoryContext';
import { TOOLS } from './lib/tools';
import { updatePageSeo } from './lib/seo';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname || '/' : '/'
  );

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    if (route === currentPath) return;
    window.history.pushState({}, '', route);
    setCurrentPath(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resolveTool = (path: string) => {
    if (!path || path === '/') return undefined;
    const clean = path.replace(/\/+$/, '');
    const direct = TOOLS.find((t) => t.route === clean);
    if (direct) return direct;

    const segment = clean.split('/').pop() || '';
    return TOOLS.find((t) => t.slug === segment || t.id === segment || t.route === `/${segment}`);
  };

  // Synchronize SEO tags and JSON-LD on route changes
  useEffect(() => {
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
          title: 'FinCalc Pro | 15 Free Finance & Crypto Calculators',
          description:
            'Free suite of 15 cryptocurrency and personal finance calculators. Calculate crypto profits, staking yields, DCA, loan EMIs, mortgages, and compound interest instantly.',
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
            'Browse our complete directory of 15 deterministic financial calculators designed for investors, traders, and borrowers.',
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
            'Discover the mission and mathematical standards behind FinCalc Pro. 100% private, client-side calculation suite.',
          path: '/about',
        });
        break;
      case '/contact':
        updatePageSeo({
          title: 'Contact Us | FinCalc Pro Support',
          description:
            'Get in touch with the FinCalc Pro engineering team for calculator feedback, formula inquiries, or feature suggestions.',
          path: '/contact',
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
        updatePageSeo({
          title: 'Privacy Policy | FinCalc Pro',
          description:
            'Read how FinCalc Pro guarantees your data privacy with 100% client-side computing and zero data storage.',
          path: '/privacy-policy',
        });
        break;
      case '/terms':
        updatePageSeo({
          title: 'Terms of Use | FinCalc Pro',
          description: 'Terms of service and usage rules for FinCalc Pro tools and content.',
          path: '/terms',
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
      return <CalculatorDispatcher tool={matchedTool} onNavigate={navigate} />;
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
        return <LearnPage onNavigate={navigate} />;
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/contact':
        return <ContactPage onNavigate={navigate} />;
      case '/faq':
        return <FAQPage onNavigate={navigate} />;
      case '/sitemap':
        return <SitemapPage onNavigate={navigate} />;
      case '/privacy-policy':
        return <PrivacyPolicyPage onNavigate={navigate} />;
      case '/terms':
        return <TermsPage onNavigate={navigate} />;
      case '/disclaimer':
        return <DisclaimerPage onNavigate={navigate} />;
      case '/affiliate-disclosure':
        return <AffiliateDisclosurePage onNavigate={navigate} />;
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
                Browse All 15 Calculators
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
          <Footer onNavigate={navigate} />
        </div>
      </CalculationHistoryProvider>
    </CurrencyProvider>
  );
}

