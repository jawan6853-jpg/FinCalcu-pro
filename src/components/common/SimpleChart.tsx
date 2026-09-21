import React from 'react';
import { formatCurrency, formatCompactCurrency } from '../../lib/formatters';
import { useCurrency } from '../../context/CurrencyContext';

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  slices: DonutSlice[];
  centerLabel?: string;
  centerValue?: string;
  currency?: any;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  slices,
  centerLabel,
  centerValue,
}) => {
  const total = slices.reduce((acc, s) => acc + Math.max(0, s.value), 0);
  const size = 200;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-800"
          />
          {total > 0 &&
            slices.map((slice, index) => {
              const sliceFraction = Math.max(0, slice.value) / total;
              const strokeDasharray = `${sliceFraction * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativeOffset * circumference;
              cumulativeOffset += sliceFraction;

              return (
                <circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
          {centerLabel && (
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {centerLabel}
            </span>
          )}
          {centerValue && (
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5 truncate max-w-[120px]">
              {centerValue}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 w-full sm:w-auto">
        {slices.map((slice, idx) => {
          const pct = total > 0 ? ((slice.value / total) * 100).toFixed(1) : '0.0';
          return (
            <div key={idx} className="flex items-center justify-between sm:justify-start gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                <span className="text-slate-600 dark:text-slate-300 font-medium">{slice.label}</span>
              </div>
              <div className="flex items-center gap-2 text-right">
                <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                  {formatCurrency(slice.value)}
                </span>
                <span className="text-slate-400 text-[11px] w-10 text-right">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface AreaGrowthPoint {
  label: string;
  invested: number;
  total: number;
}

interface AreaGrowthChartProps {
  data: AreaGrowthPoint[];
}

export const AreaGrowthChart: React.FC<AreaGrowthChartProps> = ({ data }) => {
  const { currency } = useCurrency();
  if (!data || data.length < 2) return null;

  const maxVal = Math.max(...data.map((d) => d.total), 1);
  const width = 500;
  const height = 200;
  const paddingX = 40;
  const paddingY = 25;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const getX = (idx: number) => paddingX + (idx / (data.length - 1)) * chartW;
  const getY = (val: number) => paddingY + chartH - (val / maxVal) * chartH;

  // Path for Total Value
  const totalPoints = data.map((d, i) => `${getX(i)},${getY(d.total)}`).join(' ');
  const totalArea = `${getX(0)},${getY(0)} ${totalPoints} ${getX(data.length - 1)},${getY(0)}`;

  // Path for Invested
  const investedPoints = data.map((d, i) => `${getX(i)},${getY(d.invested)}`).join(' ');
  const investedArea = `${getX(0)},${getY(0)} ${investedPoints} ${getX(data.length - 1)},${getY(0)}`;

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Growth Projection Over Time</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" />
            <span className="text-slate-600 dark:text-slate-400">Total Value</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-400 inline-block" />
            <span className="text-slate-600 dark:text-slate-400">Principal Invested</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Background gridlines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
          <line x1={paddingX} y1={paddingY + chartH / 2} x2={width - paddingX} y2={paddingY + chartH / 2} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
          <line x1={paddingX} y1={paddingY + chartH} x2={width - paddingX} y2={paddingY + chartH} stroke="currentColor" className="text-slate-300 dark:text-slate-700" />

          {/* Areas */}
          <polygon points={totalArea} fill="#6366f1" fillOpacity="0.25" />
          <polygon points={investedArea} fill="#94a3b8" fillOpacity="0.35" />

          {/* Polyline strokes */}
          <polyline points={totalPoints} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={investedPoints} fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4 2" />

          {/* Data dots on endpoints */}
          <circle cx={getX(data.length - 1)} cy={getY(data[data.length - 1].total)} r="4" fill="#6366f1" />
          <circle cx={getX(data.length - 1)} cy={getY(data[data.length - 1].invested)} r="4" fill="#64748b" />

          {/* Final Value Callout */}
          <text
            x={getX(data.length - 1)}
            y={Math.max(14, getY(data[data.length - 1].total) - 8)}
            textAnchor="end"
            className="text-[10px] font-bold font-mono fill-indigo-600 dark:fill-indigo-400"
          >
            {formatCompactCurrency(data[data.length - 1].total, currency)}
          </text>

          {/* Axis Labels */}
          <text x={getX(0)} y={height - 6} textAnchor="start" className="text-[10px] fill-slate-400 font-mono">
            {data[0].label}
          </text>
          <text x={getX(data.length - 1)} y={height - 6} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
            {data[data.length - 1].label}
          </text>
        </svg>
      </div>
    </div>
  );
};
