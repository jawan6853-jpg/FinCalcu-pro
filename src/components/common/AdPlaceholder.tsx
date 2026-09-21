import React from 'react';

interface AdPlaceholderProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'in-feed';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  slotId = 'default-ad-slot',
  className = '',
}) => {
  // Production-grade ad slot wrapper: collapses when no script is active and doesn't pollute UI with fake mock lines
  return (
    <aside
      aria-label="Advertisement"
      className={`my-6 mx-auto w-full max-w-4xl min-h-0 text-center transition-all ${className}`}
    >
      <div id={slotId} className="w-full mx-auto" />
    </aside>
  );
};
