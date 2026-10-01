/**
 * Cash Flow Calculator Engine
 * Formula: Net Cash Flow = Cash Inflows - Cash Outflows
 * Calculates: Total Inflows, Total Outflows, Net Cash Flow, Ending Cash Balance, Operating Margin
 */

export interface CashFlowInput {
  startingBalance?: number;
  // Inflows
  operatingRevenue: number;
  accountsReceivableCollected?: number;
  financingOrInvestmentInflows?: number;
  otherInflows?: number;
  // Outflows
  payrollAndWages: number;
  rentAndFacilities: number;
  inventoryAndSupplies: number;
  loanPaymentsAndInterest?: number;
  taxesAndLicenses?: number;
  otherOperatingExpenses?: number;
}

export interface CashFlowResult {
  startingBalance: number;
  totalInflows: number;
  totalOutflows: number;
  netCashFlow: number;
  endingBalance: number;
  cashFlowMarginPercent: number;
  status: 'positive' | 'negative' | 'neutral';
  inflowsBreakdown: { label: string; amount: number; percentage: number }[];
  outflowsBreakdown: { label: string; amount: number; percentage: number }[];
}

export function calculateCashFlow(input: CashFlowInput): CashFlowResult {
  const start = Math.max(0, Number(input.startingBalance) || 0);

  // Inflows
  const rev = Math.max(0, Number(input.operatingRevenue) || 0);
  const ar = Math.max(0, Number(input.accountsReceivableCollected) || 0);
  const fin = Math.max(0, Number(input.financingOrInvestmentInflows) || 0);
  const otherIn = Math.max(0, Number(input.otherInflows) || 0);
  const totalInflows = rev + ar + fin + otherIn;

  // Outflows
  const payroll = Math.max(0, Number(input.payrollAndWages) || 0);
  const rent = Math.max(0, Number(input.rentAndFacilities) || 0);
  const inventory = Math.max(0, Number(input.inventoryAndSupplies) || 0);
  const debt = Math.max(0, Number(input.loanPaymentsAndInterest) || 0);
  const taxes = Math.max(0, Number(input.taxesAndLicenses) || 0);
  const otherOut = Math.max(0, Number(input.otherOperatingExpenses) || 0);
  const totalOutflows = payroll + rent + inventory + debt + taxes + otherOut;

  const netCashFlow = totalInflows - totalOutflows;
  const endingBalance = start + netCashFlow;

  const margin = totalInflows > 0 ? (netCashFlow / totalInflows) * 100 : 0;
  const status: 'positive' | 'negative' | 'neutral' =
    netCashFlow > 0 ? 'positive' : netCashFlow < 0 ? 'negative' : 'neutral';

  const inflowsBreakdown = [
    { label: 'Operating Revenue', amount: rev, percentage: totalInflows > 0 ? (rev / totalInflows) * 100 : 0 },
    { label: 'AR Collected', amount: ar, percentage: totalInflows > 0 ? (ar / totalInflows) * 100 : 0 },
    { label: 'Financing / Investment', amount: fin, percentage: totalInflows > 0 ? (fin / totalInflows) * 100 : 0 },
    { label: 'Other Inflows', amount: otherIn, percentage: totalInflows > 0 ? (otherIn / totalInflows) * 100 : 0 },
  ].filter((item) => item.amount > 0);

  const outflowsBreakdown = [
    { label: 'Payroll & Wages', amount: payroll, percentage: totalOutflows > 0 ? (payroll / totalOutflows) * 100 : 0 },
    { label: 'Rent & Facilities', amount: rent, percentage: totalOutflows > 0 ? (rent / totalOutflows) * 100 : 0 },
    { label: 'Inventory & Supplies', amount: inventory, percentage: totalOutflows > 0 ? (inventory / totalOutflows) * 100 : 0 },
    { label: 'Debt & Interest', amount: debt, percentage: totalOutflows > 0 ? (debt / totalOutflows) * 100 : 0 },
    { label: 'Taxes & Licenses', amount: taxes, percentage: totalOutflows > 0 ? (taxes / totalOutflows) * 100 : 0 },
    { label: 'Other Operating Expenses', amount: otherOut, percentage: totalOutflows > 0 ? (otherOut / totalOutflows) * 100 : 0 },
  ].filter((item) => item.amount > 0);

  return {
    startingBalance: start,
    totalInflows,
    totalOutflows,
    netCashFlow,
    endingBalance,
    cashFlowMarginPercent: margin,
    status,
    inflowsBreakdown,
    outflowsBreakdown,
  };
}
