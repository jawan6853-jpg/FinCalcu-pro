import React, { useState } from 'react';
import { Layers, Search } from 'lucide-react';
import { TOOLS } from '../../lib/tools';
import { CalculatorCard } from '../common/CalculatorCard';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface AllToolsPageProps {
  onNavigate: (route: string) => void;
}

export const AllToolsPage: React.FC<AllToolsPageProps> = ({ onNavigate }) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.categoryLabel.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: 'All Calculators' }]} onNavigate={onNavigate} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-indigo-500" />
            <span>Complete Calculator Directory</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Browse all 15 financial planning and cryptocurrency calculation engines
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 text-sm">No calculators match "{filterQuery}".</p>
          <button
            onClick={() => setFilterQuery('')}
            className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Clear search filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tool) => (
            <CalculatorCard key={tool.id} tool={tool} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
};
