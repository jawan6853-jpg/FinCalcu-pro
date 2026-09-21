import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ToolItem } from '../../types';
import { DynamicIcon } from './DynamicIcon';

interface CalculatorCardProps {
  tool: ToolItem;
  onNavigate: (route: string) => void;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ tool, onNavigate }) => {
  const isCrypto = tool.category === 'crypto';

  return (
    <div
      onClick={() => onNavigate(tool.route)}
      className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-600/70 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div
            className={`p-2.5 rounded-xl transition-colors ${
              isCrypto
                ? 'bg-amber-100/80 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 group-hover:bg-amber-200/80 dark:group-hover:bg-amber-900/60'
                : 'bg-indigo-100/80 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400 group-hover:bg-indigo-200/80 dark:group-hover:bg-indigo-900/60'
            }`}
          >
            <DynamicIcon name={tool.icon} className="w-5 h-5" />
          </div>

          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
              isCrypto
                ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {tool.categoryLabel}
          </span>
        </div>

        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {tool.name}
        </h3>

        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
        <span>Calculate</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
