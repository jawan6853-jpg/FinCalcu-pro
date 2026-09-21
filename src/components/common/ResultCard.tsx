import React, { useState } from 'react';
import { Copy, Check, Share2, Printer, BookmarkPlus, Download } from 'lucide-react';
import { useCalculationHistory } from '../../context/CalculationHistoryContext';

interface ResultCardProps {
  title: string;
  value: string;
  subtitle?: string;
  isHighlight?: boolean;
  status?: 'positive' | 'negative' | 'neutral';
  badge?: string;
  allowCopy?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  subtitle,
  isHighlight = false,
  status = 'neutral',
  badge,
  allowCopy = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!allowCopy) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBorderColor = () => {
    if (isHighlight) {
      if (status === 'positive') return 'border-emerald-500/50 dark:border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/30 shadow-xs ring-1 ring-emerald-500/20';
      if (status === 'negative') return 'border-rose-500/50 dark:border-rose-500/40 bg-rose-50/60 dark:bg-rose-950/30 shadow-xs ring-1 ring-rose-500/20';
      return 'border-indigo-500/50 dark:border-indigo-500/40 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-xs ring-1 ring-indigo-500/20';
    }
    if (status === 'positive') return 'border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10';
    if (status === 'negative') return 'border-rose-500/30 dark:border-rose-500/20 bg-rose-50/20 dark:bg-rose-950/10';
    return 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900';
  };

  const getTextColor = () => {
    if (status === 'positive') return 'text-emerald-600 dark:text-emerald-400 font-black';
    if (status === 'negative') return 'text-rose-600 dark:text-rose-400 font-black';
    if (isHighlight) return 'text-indigo-700 dark:text-indigo-300';
    return 'text-slate-900 dark:text-slate-100';
  };

  // Format value with explicit (+) on positive status or ensure (-) on negative status
  const formattedDisplayValue = () => {
    if (status === 'positive') {
      const cleanVal = value.trim();
      return cleanVal.startsWith('+') ? cleanVal : `+${cleanVal}`;
    }
    if (status === 'negative') {
      const cleanVal = value.trim();
      return cleanVal.startsWith('-') ? cleanVal : `-${cleanVal}`;
    }
    return value;
  };

  return (
    <div className={`rounded-xl border transition-all ${getBorderColor()} relative group ${
      isHighlight ? 'p-5' : 'p-4'
    }`}>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className={`font-semibold tracking-wide ${
          isHighlight ? 'text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-bold' : 'text-xs text-slate-500 dark:text-slate-400'
        }`}>
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                status === 'positive'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                  : status === 'negative'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                  : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300'
              }`}
            >
              {badge}
            </span>
          )}
          {allowCopy && (
            <button
              onClick={handleCopy}
              title="Copy value"
              aria-label="Copy value"
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-opacity cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      <div className={`font-extrabold font-mono tracking-tight ${
        isHighlight ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
      } ${getTextColor()}`}>
        {formattedDisplayValue()}
      </div>

      {subtitle && (
        <div className={`mt-1.5 text-slate-500 dark:text-slate-400 leading-relaxed ${
          isHighlight ? 'text-xs sm:text-sm' : 'text-xs'
        }`}>
          {subtitle}
        </div>
      )}
    </div>
  );
};

export const CalculationActions: React.FC<{
  title: string;
  onReset: () => void;
  toolId?: string;
  highlightValue?: string;
  highlightLabel?: string;
  details?: { label: string; value: string }[];
}> = ({ title, onReset, toolId, highlightValue, highlightLabel, details }) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [saved, setSaved] = useState(false);
  const { saveCalculation } = useCalculationHistory();

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url: window.location.href,
        });
        return;
      } catch (e) {
        // User cancelled or unsupported, fallback to clipboard
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const extractFromDOM = () => {
    let hlVal = highlightValue;
    let hlLbl = highlightLabel || 'Main Result';
    const gatheredDetails: { label: string; value: string }[] = details ? [...details] : [];

    if (!hlVal && typeof document !== 'undefined') {
      // Find prominent result card
      const highlightEl = document.querySelector('[class*="text-2xl"][class*="font-mono"]') ||
        document.querySelector('[class*="text-xl"][class*="font-mono"]');
      if (highlightEl && highlightEl.textContent) {
        hlVal = highlightEl.textContent.trim();
        // find its title label
        const parentCard = highlightEl.closest('div');
        const titleEl = parentCard?.querySelector('span.font-semibold');
        if (titleEl && titleEl.textContent) {
          hlLbl = titleEl.textContent.trim();
        }
      }
    }

    if (gatheredDetails.length === 0 && typeof document !== 'undefined') {
      const allCards = document.querySelectorAll('div[class*="rounded-2xl"][class*="border"]');
      allCards.forEach((card) => {
        const titleEl = card.querySelector('span.font-semibold');
        const valEl = card.querySelector('[class*="font-mono"]');
        if (titleEl && valEl && titleEl.textContent && valEl.textContent) {
          const val = valEl.textContent.trim();
          const lbl = titleEl.textContent.trim();
          if (val !== hlVal && gatheredDetails.length < 5) {
            gatheredDetails.push({ label: lbl, value: val });
          }
        }
      });
    }

    return {
      hlVal: hlVal || 'Calculated',
      hlLbl: hlLbl || 'Result',
      items: gatheredDetails,
    };
  };

  const handleSaveToHistory = () => {
    const { hlVal, hlLbl, items } = extractFromDOM();

    saveCalculation({
      toolId: toolId || 'calculator',
      toolName: title,
      path: window.location.pathname,
      highlightValue: hlVal,
      highlightLabel: hlLbl,
      details: items,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleExportTextSummary = () => {
    const { hlVal, hlLbl, items } = extractFromDOM();

    let summaryText = `========================================\n`;
    summaryText += `       FINCALC PRO REPORT\n`;
    summaryText += `========================================\n\n`;
    summaryText += `Calculator: ${title}\n`;
    summaryText += `Date: ${new Date().toLocaleString()}\n`;
    summaryText += `Primary Result: [${hlLbl}] ${hlVal}\n\n`;

    if (items && items.length > 0) {
      summaryText += `----------------------------------------\n`;
      summaryText += `KEY BREAKDOWN DETAILS:\n`;
      summaryText += `----------------------------------------\n`;
      items.forEach((d) => {
        summaryText += `• ${d.label}: ${d.value}\n`;
      });
      summaryText += `\n`;
    }

    summaryText += `----------------------------------------\n`;
    summaryText += `Live Link: ${window.location.href}\n`;
    summaryText += `========================================\n`;

    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs no-print">
      <button
        onClick={onReset}
        className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors cursor-pointer"
      >
        Reset Inputs
      </button>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <button
          onClick={handleSaveToHistory}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-medium transition-colors cursor-pointer"
          title="Save this calculation to comparison history"
        >
          {saved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
          <span>{saved ? 'Saved!' : 'Save'}</span>
        </button>

        <button
          onClick={handleExportTextSummary}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors cursor-pointer"
          title="Download text summary"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors cursor-pointer"
          title="Print or Save as PDF"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / PDF</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-semibold transition-colors cursor-pointer"
          title="Share calculator link"
        >
          {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copiedShare ? 'Copied' : 'Share'}</span>
        </button>
      </div>
    </div>
  );
};
