import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { TOOLS } from '../../lib/tools';
import { ToolItem } from '../../types';
import { DynamicIcon } from './DynamicIcon';

interface SearchBarProps {
  onNavigate: (route: string) => void;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onNavigate,
  className = '',
  placeholder = 'Search calculators...',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTools: ToolItem[] = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default to popular/featured tools when empty and focused
      return TOOLS.slice(0, 6);
    }
    return TOOLS.filter((t) => {
      return (
        t.name.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.categoryLabel.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (tool: ToolItem) => {
    setIsOpen(false);
    setQuery('');
    onNavigate(tool.route);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredTools.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredTools.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredTools.length) {
        handleSelect(filteredTools[selectedIndex]);
      } else if (filteredTools.length > 0) {
        handleSelect(filteredTools[0]);
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          id="global-search-input"
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls="search-results-list"
          aria-label="Search financial and crypto calculators"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-9 pr-8 py-2 text-sm bg-slate-100 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-xs"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          id="search-results-list"
          role="listbox"
          aria-label="Search suggestions"
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto"
        >
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{query ? `Matching Calculators (${filteredTools.length})` : 'Popular Calculators'}</span>
            <span className="text-[10px] text-slate-400">↑↓ to navigate, ↵ to select</span>
          </div>

          {filteredTools.length > 0 ? (
            <div className="py-1">
              {filteredTools.map((tool, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={tool.id}
                    id={`search-item-${tool.id}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(tool)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full px-3 py-2.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-100'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        tool.category === 'crypto'
                          ? 'bg-amber-100/70 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'bg-indigo-100/70 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400'
                      }`}
                    >
                      <DynamicIcon name={tool.icon} className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{tool.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            tool.category === 'crypto'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {tool.categoryLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {tool.shortDescription}
                      </p>
                    </div>

                    <div className="text-slate-400 self-center pl-2 shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm font-medium">No calculators found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Try searching for keywords like &ldquo;profit&rdquo;, &ldquo;loan&rdquo;, &ldquo;emi&rdquo;, &ldquo;dca&rdquo;, or &ldquo;compound&rdquo;.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
