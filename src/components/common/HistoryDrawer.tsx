import React, { useState } from 'react';
import { History, X, Trash2, ArrowUpRight, Clock } from 'lucide-react';
import { useCalculationHistory } from '../../context/CalculationHistoryContext';

interface HistoryDrawerProps {
  onNavigate: (route: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { history, removeCalculation, clearHistory } = useCalculationHistory();

  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        title="Calculation History"
        aria-label="View Calculation History"
      >
        <History className="w-4 h-4 sm:w-5 sm:h-5" />
        {history.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-950" />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 z-10 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Calculation History
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {history.length} saved result{history.length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                    title="Clear all history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {history.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <History className="w-6 h-6 stroke-1 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No calculations saved yet
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                    Use any calculator and click &ldquo;Save to History&rdquo; to review or compare results later.
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="group p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          {item.toolName}
                        </span>
                        <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
                          {item.highlightValue}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {item.highlightLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            onNavigate(item.path);
                          }}
                          className="p-1 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Open Calculator"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeCalculation(item.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete from history"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {item.details && item.details.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-2 gap-2 text-xs">
                        {item.details.slice(0, 4).map((d, i) => (
                          <div key={i} className="flex flex-col">
                            <span className="text-[10px] text-slate-400 truncate">{d.label}</span>
                            <span className="font-medium font-mono text-slate-700 dark:text-slate-300 truncate">
                              {d.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(item.timestamp)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer tips */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 text-center">
              All history is saved privately in your browser storage.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
