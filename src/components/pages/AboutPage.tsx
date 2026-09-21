import React from 'react';
import { ShieldCheck, Target, Heart, Award, Calculator } from 'lucide-react';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: 'About Us' }]} onNavigate={onNavigate} />

      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          About FinCalc Pro
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Building transparent, accurate, and privacy-respecting calculation tools for modern investors and households.
        </p>
      </div>

      <div className="space-y-8 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            <span>Our Mission</span>
          </h2>
          <p>
            FinCalc Pro was built out of frustration with existing financial calculators on the web: cluttered interfaces loaded with deceptive lead generation forms, hidden calculation formulas, slow server redirects, and non-existent crypto fee transparency.
          </p>
          <p className="mt-3">
            Our goal is simple: deliver lightning-fast, 100% deterministic mathematical calculations with full mathematical formula transparency, zero intrusive data collection, and intuitive interactive visualization.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-6 h-6 text-emerald-500 mb-3" />
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-1">
              Zero Data Tracking
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              All computations are executed directly inside your browser. We never collect, sell, or monitor your personal numbers, salaries, loan commitments, or trade positions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Award className="w-6 h-6 text-indigo-500 mb-3" />
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-1">
              Mathematical Rigor
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Each algorithm is audited against published banking standards and verifiable financial models, complete with real formulas and example audits.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            Editorial & Mathematical Standards
          </h2>
          <p>
            We maintain an open policy for our calculation engines. If you ever spot an anomaly, fee calculation discrepancy, or edge case in our numbers, our development team investigates and patches it immediately to maintain the highest standard of accuracy.
          </p>
        </div>
      </div>
    </div>
  );
};
