import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '../../types';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (href: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-4 overflow-x-auto whitespace-nowrap py-1">
      <button
        onClick={() => onNavigate('/')}
        className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 shrink-0" />
          {item.href ? (
            <button
              onClick={() => onNavigate(item.href!)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ) : (
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
