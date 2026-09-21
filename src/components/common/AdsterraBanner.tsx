import React, { useEffect, useRef } from 'react';

interface AdsterraBannerProps {
  className?: string;
}

const ADSTERRA_CONTAINER_ID = 'container-29718d029e543e50d27de4c30191fe30';
const ADSTERRA_SCRIPT_SRC = 'https://pl31438862.profitableratecpmnetwork.com/29718d029e543e50d27de4c30191fe30/invoke.js';

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Reset container contents
    containerRef.current.innerHTML = '';

    // Create the Adsterra ad target div with the required ID
    const targetDiv = document.createElement('div');
    targetDiv.id = ADSTERRA_CONTAINER_ID;
    containerRef.current.appendChild(targetDiv);

    // Create fresh script execution
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = `${ADSTERRA_SCRIPT_SRC}?t=${Date.now()}`;

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <aside
      aria-label="Advertisement"
      className={`my-6 mx-auto w-full max-w-4xl flex flex-col items-center justify-center min-h-[90px] text-center overflow-hidden transition-all ${className}`}
    >
      <div className="w-full flex items-center justify-center gap-2 mb-1.5 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500">
          Advertisement
        </span>
      </div>
      <div
        ref={containerRef}
        className="w-full flex justify-center items-center overflow-x-auto min-h-[60px]"
      />
    </aside>
  );
};
