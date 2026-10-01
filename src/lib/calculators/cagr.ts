import { sanitizeNumber } from '../formatters';

export interface CAGRInput {
  initialValue: number;
  finalValue: number;
  years: number;
}

export interface CAGRYearPoint {
  year: number;
  value: number;
}

export interface CAGRResult {
  cagr: number; // percentage, e.g. 15.5%
  totalReturnPercent: number;
  absoluteGain: number;
  growthMultiple: number;
  yearlySchedule: CAGRYearPoint[];
  isValid: boolean;
  errorMessage?: string;
}

export function calculateCAGR(input: CAGRInput): CAGRResult {
  const initialValue = Math.max(0, sanitizeNumber(input.initialValue));
  const finalValue = Math.max(0, sanitizeNumber(input.finalValue));
  const years = Math.max(0, sanitizeNumber(input.years));

  if (initialValue <= 0) {
    return {
      cagr: 0,
      totalReturnPercent: 0,
      absoluteGain: finalValue - initialValue,
      growthMultiple: 0,
      yearlySchedule: [],
      isValid: false,
      errorMessage: 'Initial investment value must be greater than zero.',
    };
  }

  if (years <= 0) {
    return {
      cagr: 0,
      totalReturnPercent: 0,
      absoluteGain: finalValue - initialValue,
      growthMultiple: initialValue > 0 ? finalValue / initialValue : 0,
      yearlySchedule: [{ year: 0, value: initialValue }],
      isValid: false,
      errorMessage: 'Number of years must be greater than zero.',
    };
  }

  // Formula: CAGR = (Final Value / Initial Value)^(1 / Years) - 1
  const growthMultiple = finalValue / initialValue;
  const cagrDecimal = Math.pow(growthMultiple, 1 / years) - 1;
  const cagr = isFinite(cagrDecimal) ? cagrDecimal * 100 : 0;
  const absoluteGain = finalValue - initialValue;
  const totalReturnPercent = ((finalValue - initialValue) / initialValue) * 100;

  // Year by year progression based on the smooth CAGR rate
  const yearlySchedule: CAGRYearPoint[] = [];
  const roundedYears = Math.min(50, Math.ceil(years));
  for (let y = 0; y <= roundedYears; y++) {
    const projectedVal = initialValue * Math.pow(1 + cagrDecimal, Math.min(y, years));
    yearlySchedule.push({
      year: y,
      value: Math.round(projectedVal * 100) / 100,
    });
  }

  return {
    cagr: Math.round(cagr * 100) / 100,
    totalReturnPercent: Math.round(totalReturnPercent * 100) / 100,
    absoluteGain: Math.round(absoluteGain * 100) / 100,
    growthMultiple: Math.round(growthMultiple * 100) / 100,
    yearlySchedule,
    isValid: true,
  };
}
