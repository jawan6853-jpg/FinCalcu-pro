import { ToolItem } from '../types';

export interface SeoConfig {
  title: string;
  description: string;
  path: string;
  tool?: ToolItem;
  breadcrumbs?: { label: string; href?: string }[];
  faqs?: { question: string; answer: string }[];
}

export function updatePageSeo(config: SeoConfig) {
  if (typeof document === 'undefined') return;

  const fullTitle =
    config.title.includes('Finance & Crypto') || config.title.includes('FinCalc')
      ? config.title
      : `${config.title} — Finance & Crypto Calculators`;
  document.title = fullTitle;

  // Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', config.description);

  // Meta Keywords
  if (config.tool?.keywords && config.tool.keywords.length > 0) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', config.tool.keywords.join(', '));
  }

  // Canonical
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const canonicalUrl = `${origin}${config.path}`;
  let linkCanonical = document.querySelector('link[rel="canonical"]');
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', canonicalUrl);

  // OpenGraph & Twitter helper
  function setMeta(property: string, content: string, isName = false) {
    const attr = isName ? 'name' : 'property';
    let el = document.querySelector(`meta[${attr}="${property}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, property);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  setMeta('og:title', fullTitle);
  setMeta('og:description', config.description);
  setMeta('og:url', canonicalUrl);
  setMeta('og:type', 'website');
  setMeta('og:site_name', 'Finance & Crypto Calculators');
  setMeta('twitter:card', 'summary_large_image', true);
  setMeta('twitter:title', fullTitle, true);
  setMeta('twitter:description', config.description, true);

  // Structured Data (JSON-LD)
  let scriptLd = document.getElementById('json-ld-schema') as HTMLScriptElement | null;
  if (!scriptLd) {
    scriptLd = document.createElement('script');
    scriptLd.id = 'json-ld-schema';
    scriptLd.type = 'application/ld+json';
    document.head.appendChild(scriptLd);
  }

  const schemas: any[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Finance & Crypto Calculators',
      url: origin,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${origin}/calculators?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ];

  if (config.tool) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: config.tool.name,
      description: config.tool.description,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'All',
      url: canonicalUrl,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    });

    // HowTo Schema for Google Search Rich Snippets
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to use the ${config.tool.name}`,
      description: `Step-by-step instructions to calculate results using the ${config.tool.name}.`,
      step: [
        {
          '@type': 'HowToStep',
          name: 'Enter Input Parameters',
          text: 'Fill in your financial amounts and rates into the input fields.',
          position: 1,
        },
        {
          '@type': 'HowToStep',
          name: 'Review Instant Results',
          text: 'Examine the live calculated net profit, ROI, or payment schedule.',
          position: 2,
        },
        {
          '@type': 'HowToStep',
          name: 'Save or Export',
          text: 'Save the calculation to your history or download a detailed text report.',
          position: 3,
        },
      ],
    });
  }

  if (config.breadcrumbs && config.breadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: config.breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.label,
        item: b.href ? `${origin}${b.href}` : undefined,
      })),
    });
  }

  if (config.faqs && config.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: config.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    });
  }

  scriptLd.textContent = JSON.stringify(schemas);
}
