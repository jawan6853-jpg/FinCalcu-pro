import React from 'react';
import {
  Activity,
  Briefcase,
  Calendar,
  CalendarDays,
  Coins,
  Flame,
  Home,
  Landmark,
  Layers,
  Percent,
  PieChart,
  PiggyBank,
  Receipt,
  Repeat,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Target,
  TrendingUp,
  Wallet,
  Zap,
  Calculator,
  ArrowRight,
  TrendingDown,
  Building,
  DollarSign,
  ChartNoAxesCombined,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  Briefcase,
  Calendar,
  CalendarDays,
  Coins,
  Flame,
  Home,
  Landmark,
  Layers,
  Percent,
  PieChart,
  PiggyBank,
  Receipt,
  Repeat,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Target,
  TrendingUp,
  Wallet,
  Zap,
  Calculator,
  ArrowRight,
  TrendingDown,
  Building,
  DollarSign,
  ChartNoAxesCombined,
};

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  const IconComponent = ICON_MAP[name] || Calculator;
  return <IconComponent className={className} size={size} />;
};
