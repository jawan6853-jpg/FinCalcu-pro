import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CalculationHistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  path: string;
  timestamp: number;
  highlightValue: string;
  highlightLabel: string;
  details: { label: string; value: string }[];
}

interface CalculationHistoryContextType {
  history: CalculationHistoryItem[];
  saveCalculation: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  removeCalculation: (id: string) => void;
  clearHistory: () => void;
}

const CalculationHistoryContext = createContext<CalculationHistoryContextType | undefined>(undefined);

const STORAGE_KEY = 'calc_user_history_v1';

export const CalculationHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 30)));
    } catch {
      // storage quota or error
    }
  }, [history]);

  const saveCalculation = (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => {
    setHistory((prev) => {
      // Deduplicate recent identical item for same tool and highlight value
      const filtered = prev.filter(
        (h) => !(h.toolId === item.toolId && h.highlightValue === item.highlightValue)
      );
      const newItem: CalculationHistoryItem = {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        timestamp: Date.now(),
      };
      return [newItem, ...filtered].slice(0, 25);
    });
  };

  const removeCalculation = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <CalculationHistoryContext.Provider
      value={{
        history,
        saveCalculation,
        removeCalculation,
        clearHistory,
      }}
    >
      {children}
    </CalculationHistoryContext.Provider>
  );
};

export const useCalculationHistory = () => {
  const ctx = useContext(CalculationHistoryContext);
  if (!ctx) {
    throw new Error('useCalculationHistory must be used within CalculationHistoryProvider');
  }
  return ctx;
};
