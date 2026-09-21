import { useEffect, useState } from 'react';

/**
 * Custom hook to synchronize calculator inputs with URL query parameters.
 * Allows users to share their exact calculation inputs via a link.
 */
export function useUrlParamsState<T extends Record<string, any>>(
  defaultValues: T,
  prefix: string = ''
): [T, (newValues: T | ((prev: T) => T)) => void, () => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValues;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const restored = { ...defaultValues };
      let hasCustomValue = false;

      Object.keys(defaultValues).forEach((key) => {
        const paramKey = prefix ? `${prefix}_${key}` : key;
        const paramVal = searchParams.get(paramKey);
        if (paramVal !== null) {
          const defaultType = typeof defaultValues[key];
          if (defaultType === 'number') {
            const num = parseFloat(paramVal);
            if (!isNaN(num)) {
              (restored as any)[key] = num;
              hasCustomValue = true;
            }
          } else if (defaultType === 'boolean') {
            (restored as any)[key] = paramVal === 'true';
            hasCustomValue = true;
          } else {
            (restored as any)[key] = paramVal;
            hasCustomValue = true;
          }
        }
      });

      return hasCustomValue ? restored : defaultValues;
    } catch {
      return defaultValues;
    }
  });

  // Keep URL search query updated without full page reload
  const setSyncedState = (newValues: T | ((prev: T) => T)) => {
    setState((prev) => {
      const next = typeof newValues === 'function' ? (newValues as any)(prev) : newValues;
      if (typeof window !== 'undefined') {
        try {
          const url = new URL(window.location.href);
          Object.keys(next).forEach((key) => {
            const val = next[key];
            const paramKey = prefix ? `${prefix}_${key}` : key;
            if (val !== undefined && val !== null && val !== '') {
              url.searchParams.set(paramKey, String(val));
            } else {
              url.searchParams.delete(paramKey);
            }
          });
          window.history.replaceState({}, '', url.toString());
        } catch {
          // Ignore history state updates if environment forbids
        }
      }
      return next;
    });
  };

  const resetSyncedState = () => {
    setState(defaultValues);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        Object.keys(defaultValues).forEach((key) => {
          const paramKey = prefix ? `${prefix}_${key}` : key;
          url.searchParams.delete(paramKey);
        });
        window.history.replaceState({}, '', url.toString());
      } catch {
        // ignore
      }
    }
  };

  return [state, setSyncedState, resetSyncedState];
}
