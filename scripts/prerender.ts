import fs from 'fs';
import path from 'path';
import { TOOLS } from '../src/lib/tools';

const BASE_URL = 'https://fincalcu-pro-jawan-kappa.vercel.app';
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const BASE_HTML_PATH = path.join(DIST_DIR, 'index.html');

interface RouteSeoConfig {
  route: string;
  title: string;
  description: string;
  categoryName?: string;
  faqs?: Array<{ question: string; answer: string }>;
  educationalContent?: string;
}

const STATIC_PAGES: RouteSeoConfig[] = [
  {
    route: '/crypto',
    title: 'Crypto Calculators - ROI, DCA, Staking APY & Profit | FinCalc Pro',
    description: 'Explore 31+ free cryptocurrency calculators for profit tracking, dollar-cost averaging (DCA), futures leverage, liquidation prices, impermanent loss, and mining profitability.',
    categoryName: 'Cryptocurrency',
  },
  {
    route: '/finance',
    title: 'Financial & Loan Calculators - Mortgages, EMI & Compound Growth | FinCalc Pro',
    description: 'Browse 69+ deterministic financial calculators for mortgage PITI, auto loans, personal loans, retirement FIRE modeling, WACC, and investment compound growth.',
    categoryName: 'Finance',
  },
  {
    route: '/calculators',
    title: 'All 100 Financial & Crypto Calculators Directory | FinCalc Pro',
    description: 'Complete directory of 100 client-side financial and crypto calculation engines. 100% private, instant, and mathematically verified.',
    categoryName: 'Directory',
  },
  {
    route: '/about-us',
    title: 'About Us - Financial Precision & Zero-Tracking Guarantee | FinCalc Pro',
    description: 'Learn about FinCalc Pro’s mission: providing deterministic, institutional-grade financial and crypto calculators that compute 100% in your browser.',
    categoryName: 'Company',
  },
  {
    route: '/contact-us',
    title: 'Contact Us - Engineering Support & Feedback | FinCalc Pro',
    description: 'Contact our financial engineering and compliance desk at jawan6853@gmail.com for calculator bug reports, formula suggestions, or partnership inquiries.',
    categoryName: 'Support',
  },
  {
    route: '/faq',
    title: 'Frequently Asked Questions (FAQ) - Calculator Methodology | FinCalc Pro',
    description: 'Find answers about our financial calculation formulas, client-side data privacy, compound interest compounding models, and cryptocurrency metrics.',
    categoryName: 'Help',
  },
  {
    route: '/privacy-policy',
    title: 'Privacy Policy - 100% Client-Side Privacy Guarantee | FinCalc Pro',
    description: 'FinCalc Pro guarantees zero storage or tracking of your financial inputs, loans, salaries, or crypto holdings. Read our GDPR & CCPA privacy policy.',
    categoryName: 'Legal',
  },
  {
    route: '/terms-and-conditions',
    title: 'Terms & Conditions - Calculator Usage Agreement | FinCalc Pro',
    description: 'Review our terms of service, intellectual property guidelines, and conditions for utilizing our 100 free financial and crypto calculator tools.',
    categoryName: 'Legal',
  },
  {
    route: '/disclaimer',
    title: 'Financial Disclaimer - Educational Purposes Only | FinCalc Pro',
    description: 'FinCalc Pro provides educational and estimation calculation tools only. We do not provide licensed fiduciary or tax advisory services.',
    categoryName: 'Legal',
  },
  {
    route: '/affiliate-disclosure',
    title: 'Affiliate & Advertising Disclosure | FinCalc Pro',
    description: 'Transparent disclosure regarding sponsorship, software partner links, and advertising policies on FinCalc Pro.',
    categoryName: 'Legal',
  },
  {
    route: '/sitemap',
    title: 'HTML Sitemap - Fast Directory Navigation | FinCalc Pro',
    description: 'Comprehensive HTML index of all 100 calculators, category hubs, educational resources, and legal disclosures on FinCalc Pro.',
    categoryName: 'Directory',
  },
];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function prerender() {
  if (!fs.existsSync(BASE_HTML_PATH)) {
    console.error('prerender error: dist/index.html not found! Run vite build first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(BASE_HTML_PATH, 'utf8');

  // Prepare all routes
  const allRoutes: RouteSeoConfig[] = [
    ...STATIC_PAGES,
    ...TOOLS.map((t) => ({
      route: t.route,
      title: `${t.name} - Free Calculator & Formula Breakdown | FinCalc Pro`,
      description: `${t.description} Free, instant, and private calculation tool with real-time results, formula explanations, and customizable parameters.`,
      categoryName: t.categoryLabel,
      faqs: t.faqs,
      educationalContent: t.formulaSummary
        ? `${t.formulaSummary}. ${t.formulaDetails?.join(' ') || ''}`
        : undefined,
    })),
  ];

  console.log(`Prerendering static HTML for ${allRoutes.length} routes...`);

  let count = 0;

  for (const item of allRoutes) {
    const canonicalUrl = `${BASE_URL}${item.route}`;

    // Generate JSON-LD schemas
    const schemas: object[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: item.title.split(' - ')[0],
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All',
        description: item.description,
        url: canonicalUrl,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${BASE_URL}/`,
          },
          ...(item.categoryName
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: item.categoryName,
                  item: `${BASE_URL}/${item.categoryName.toLowerCase().includes('crypto') ? 'crypto' : 'finance'}`,
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: item.title.split(' - ')[0],
                  item: canonicalUrl,
                },
              ]
            : [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: item.title.split(' - ')[0],
                  item: canonicalUrl,
                },
              ]),
        ],
      },
    ];

    if (item.faqs && item.faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: item.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      });
    }

    const jsonLdScripts = schemas
      .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
      .join('\n    ');

    // Semantic SSR Fallback HTML inside #root
    const ssrContent = `
      <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased">
        <header class="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-6">
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/" class="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              FinCalc <span class="text-indigo-600">Pro</span>
            </a>
            <nav class="flex gap-4 text-sm font-medium">
              <a href="/calculators" class="hover:text-indigo-600">All Calculators</a>
              <a href="/crypto" class="hover:text-indigo-600">Crypto</a>
              <a href="/finance" class="hover:text-indigo-600">Finance</a>
            </nav>
          </div>
        </header>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div class="mb-8">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 mb-2">
              ${escapeHtml(item.categoryName || 'Financial Tool')}
            </span>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              ${escapeHtml(item.title.split(' - ')[0])}
            </h1>
            <p class="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              ${escapeHtml(item.description)}
            </p>
          </div>

          <div class="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs mb-8">
            <div class="animate-pulse flex flex-col space-y-4">
              <div class="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
              <div class="h-10 bg-slate-100 dark:bg-slate-800/60 rounded w-full"></div>
              <div class="h-10 bg-slate-100 dark:bg-slate-800/60 rounded w-full"></div>
              <div class="h-12 bg-indigo-600/20 rounded w-1/4"></div>
            </div>
            <noscript>
              <div class="p-4 mt-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 rounded-xl text-amber-800 dark:text-amber-200 text-sm">
                JavaScript is required for interactive calculations and live charts. Please enable JavaScript in your browser to utilize this calculator.
              </div>
            </noscript>
          </div>

          ${
            item.educationalContent
              ? `<article class="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs prose dark:prose-invert max-w-none">
                  <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Mathematical Formula & Strategy Guide</h2>
                  <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">${escapeHtml(item.educationalContent)}</p>
                </article>`
              : ''
          }
        </main>
      </div>
    `;

    // Replace tags in base HTML
    let renderedHtml = baseHtml
      // Replace Title
      .replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(item.title)}</title>`)
      // Replace Meta Description
      .replace(
        /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta name="description" content="${escapeHtml(item.description)}" />`
      )
      // Replace Canonical
      .replace(
        /<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i,
        `<link rel="canonical" href="${canonicalUrl}" />`
      )
      // Replace OpenGraph
      .replace(
        /<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta property="og:title" content="${escapeHtml(item.title)}" />`
      )
      .replace(
        /<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta property="og:description" content="${escapeHtml(item.description)}" />`
      )
      .replace(
        /<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta property="og:url" content="${canonicalUrl}" />`
      )
      // Replace Twitter
      .replace(
        /<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta name="twitter:title" content="${escapeHtml(item.title)}" />`
      )
      .replace(
        /<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta name="twitter:description" content="${escapeHtml(item.description)}" />`
      );

    // Inject JSON-LD before </head>
    renderedHtml = renderedHtml.replace(
      '</head>',
      `  ${jsonLdScripts}\n  </head>`
    );

    // Inject SSR HTML inside <div id="root" ...></div>
    renderedHtml = renderedHtml.replace(
      /<div id="root"[^>]*>.*?<\/div>/s,
      `<div id="root" class="min-h-full flex flex-col">${ssrContent}</div>`
    );

    // Determine target directory and file path
    const routeClean = item.route.replace(/^\//, '');
    const targetDir = path.join(DIST_DIR, routeClean);
    fs.mkdirSync(targetDir, { recursive: true });
    const targetFile = path.join(targetDir, 'index.html');

    fs.writeFileSync(targetFile, renderedHtml, 'utf8');
    count++;
  }

  console.log(`Successfully prerendered ${count} individual SEO pages with Schema.org JSON-LD and pre-rendered markup!`);
}

// Execute prerender
prerender();
