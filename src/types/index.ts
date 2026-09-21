export type ToolCategory = 'crypto' | 'finance' | 'loans' | 'investment' | 'savings';

export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  route: string;
  category: ToolCategory;
  categoryLabel: string;
  description: string;
  shortDescription: string;
  icon: string;
  keywords: string[];
  featured?: boolean;
  relatedTools: string[];
  formulaSummary: string;
  formulaDetails: string[];
  exampleCalculation: {
    title: string;
    description: string;
    inputs: Record<string, string | number>;
    outputs: Record<string, string | number>;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ChartDataPoint {
  label: string;
  value1: number;
  value2?: number;
  value3?: number;
}
