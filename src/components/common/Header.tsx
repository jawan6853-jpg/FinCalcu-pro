import React, { useState } from 'react';
import { Calculator, Menu, X, Coins, Landmark, BookOpen, Layers } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import { CurrencySelector } from './CurrencySelector';
import { HistoryDrawer } from './HistoryDrawer';

interface HeaderProps {
  currentPath: string;
  onNavigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', route: '/' },
    { label: 'Crypto', route: '/crypto', icon: Coins },
    { label: 'Finance', route: '/finance', icon: Landmark },
    { label: 'All Tools', route: '/calculators', icon: Layers },
    { label: 'Learn', route: '/learn', icon: BookOpen },
  ];

  const handleNav = (route: string) => {
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('/')}
          className="flex items-center gap-2.5 shrink-0 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-500/30 group-hover:bg-indigo-700 transition-colors">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1">
              FinCalc <span className="text-indigo-600 dark:text-indigo-400">Pro</span>
            </span>
            <span className="block text-[10px] font-medium text-slate-400 tracking-wider uppercase">
              Finance & Crypto
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navItems.map((item) => {
            const isActive =
              item.route === '/'
                ? currentPath === '/'
                : currentPath === item.route || currentPath.startsWith(item.route + '/');
            return (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-36 sm:w-52 lg:w-60">
            <SearchBar onNavigate={handleNav} />
          </div>

          <CurrencySelector />

          <HistoryDrawer onNavigate={handleNav} />

          <ThemeToggle />

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-5 space-y-3 shadow-lg"
        >
          <div className="flex items-center justify-between py-2 px-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Currency</span>
            <CurrencySelector />
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.route === '/'
                ? currentPath === '/'
                : currentPath === item.route || currentPath.startsWith(item.route + '/');
            return (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-indigo-500" />}
                <span>{item.label}</span>
              </button>
            );
          })}
          </div>
        </div>
      )}
    </header>
  );
};
