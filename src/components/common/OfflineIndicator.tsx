import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/95 dark:bg-slate-800/95 text-white border border-slate-700 shadow-lg backdrop-blur-xs text-xs animate-in slide-in-from-bottom-2 duration-200"
    >
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <span>
        <strong>Offline Mode:</strong> All 85 financial calculators compute locally and work without internet.
      </span>
    </div>
  );
};
