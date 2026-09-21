import { calculateCryptoProfit } from './cryptoProfit';
import { calculateCryptoROI } from './cryptoROI';
import { calculateCryptoDCA } from './cryptoDCA';
import { calculateCryptoStaking } from './staking';
import { calculateCryptoTradingFee } from './tradingFee';
import { calculateCryptoBreakEven } from './breakEven';
import { calculateCryptoPositionSize } from './positionSize';
import { calculateCryptoCompound } from './cryptoCompound';
import { calculateCryptoTax } from './cryptoTax';
import { calculateLoanEMI } from './loan';
import { calculateSIP } from './sip';
import { calculateCompoundInterest } from './compoundInterest';
import { calculateInvestmentReturn } from './investmentReturn';
import { calculateSavings } from './savings';
import { calculateMortgage } from './mortgage';

export interface TestResultItem {
  calculator: string;
  testName: string;
  passed: boolean;
  error?: string;
  details?: string;
}

export function runAllCalculatorTests(): TestResultItem[] {
  const results: TestResultItem[] = [];

  function assert(calc: string, testName: string, condition: boolean, details?: string) {
    results.push({
      calculator: calc,
      testName,
      passed: condition,
      error: condition ? undefined : 'Assertion failed',
      details,
    });
  }

  // 1. Crypto Profit
  try {
    const cpNormal = calculateCryptoProfit({
      buyPrice: 50000,
      sellPrice: 60000,
      quantity: 1.5,
      buyFee: 0.1,
      sellFee: 0.1,
      feeType: 'percentage',
    });
    assert('CryptoProfit', 'Standard profit calculation', cpNormal.netProfit > 0 && isFinite(cpNormal.roi));
    assert('CryptoProfit', 'Gross revenue equals 90,000', Math.abs(cpNormal.grossRevenue - 90000) < 0.01);

    const cpZero = calculateCryptoProfit({
      buyPrice: 0,
      sellPrice: 0,
      quantity: 0,
      buyFee: 0,
      sellFee: 0,
      feeType: 'percentage',
    });
    assert('CryptoProfit', 'Zero values produce safe non-NaN', !isNaN(cpZero.roi) && isFinite(cpZero.netProfit));

    const cpLoss = calculateCryptoProfit({
      buyPrice: 100,
      sellPrice: 50,
      quantity: 2,
      buyFee: 0,
      sellFee: 0,
      feeType: 'percentage',
    });
    assert('CryptoProfit', 'Loss scenario detected', cpLoss.netProfit === -100 && !cpLoss.isProfit);
  } catch (e: any) {
    assert('CryptoProfit', 'Exception handling', false, e.message);
  }

  // 2. Crypto ROI
  try {
    const roiNormal = calculateCryptoROI({ initialInvestment: 1000, currentValue: 2500 });
    assert('CryptoROI', 'ROI 150%', Math.abs(roiNormal.roi - 150) < 0.01 && roiNormal.multiplier === 2.5);

    const roiZero = calculateCryptoROI({ initialInvestment: 0, currentValue: 500 });
    assert('CryptoROI', 'Zero initial investment safe', !isNaN(roiZero.roi) && isFinite(roiZero.roi));
  } catch (e: any) {
    assert('CryptoROI', 'Exception handling', false, e.message);
  }

  // 3. Crypto DCA
  try {
    const dca = calculateCryptoDCA({
      initialInvestment: 500,
      recurringInvestment: 100,
      periods: 10,
      frequency: 'weekly',
      averagePurchasePrice: 50000,
      currentPrice: 60000,
    });
    assert('CryptoDCA', 'Total invested is 1,500', dca.totalInvested === 1500);
    assert('CryptoDCA', 'Schedule generated correctly', dca.schedule.length > 0 && isFinite(dca.roi));
  } catch (e: any) {
    assert('CryptoDCA', 'Exception handling', false, e.message);
  }

  // 4. Staking
  try {
    const stake = calculateCryptoStaking({
      principal: 10000,
      rate: 10,
      durationDays: 365,
      compoundingFrequency: 'daily',
    });
    assert('CryptoStaking', 'Compound daily > simple', stake.totalReward > 1000);
    assert('CryptoStaking', 'Effective APY is finite', isFinite(stake.effectiveApy));
  } catch (e: any) {
    assert('CryptoStaking', 'Exception handling', false, e.message);
  }

  // 5. Trading Fee
  try {
    const fee = calculateCryptoTradingFee({
      tradeType: 'buy',
      orderType: 'taker',
      tradeAmount: 10000,
      feeRatePercentage: 0.1,
    });
    assert('CryptoTradingFee', 'Fee 0.1% on 10,000 = 10', fee.feeAmount === 10 && fee.netAmountReceived === 9990);
  } catch (e: any) {
    assert('CryptoTradingFee', 'Exception handling', false, e.message);
  }

  // 6. Break-Even
  try {
    const be = calculateCryptoBreakEven({
      entryPrice: 100,
      quantity: 10,
      buyFeePercentage: 0.2,
      sellFeePercentage: 0.2,
      additionalFlatFees: 0,
    });
    assert('CryptoBreakEven', 'Break-even price covers fees', be.breakEvenPrice > 100 && isFinite(be.breakEvenPrice));
  } catch (e: any) {
    assert('CryptoBreakEven', 'Exception handling', false, e.message);
  }

  // 7. Position Size
  try {
    const pos = calculateCryptoPositionSize({
      accountBalance: 10000,
      riskPercentage: 2,
      entryPrice: 100,
      stopLossPrice: 95,
    });
    assert('CryptoPositionSize', 'Risk amount is 200', pos.riskAmount === 200);
    assert('CryptoPositionSize', 'Position size is 40 units', pos.positionSizeUnits === 40);
  } catch (e: any) {
    assert('CryptoPositionSize', 'Exception handling', false, e.message);
  }

  // 8. Crypto Compound
  try {
    const cc = calculateCryptoCompound({
      initialPrincipal: 5000,
      monthlyContribution: 200,
      annualInterestRate: 8,
      years: 5,
      compoundingFrequency: 'monthly',
    });
    assert('CryptoCompound', 'Future value greater than contribution', cc.futureValue > cc.totalPrincipalContributed);
  } catch (e: any) {
    assert('CryptoCompound', 'Exception handling', false, e.message);
  }

  // 9. Crypto Tax
  try {
    const tax = calculateCryptoTax({
      costBasis: 5000,
      saleProceeds: 15000,
      holdingPeriod: 'short_term',
      incomeTaxBracketPercentage: 24,
      longTermTaxRatePercentage: 15,
    });
    assert('CryptoTax', 'Taxable gain is 10,000', tax.capitalGainOrLoss === 10000);
    assert('CryptoTax', 'Estimated tax is 2,400', tax.estimatedTaxOwed === 2400);

    const taxLoss = calculateCryptoTax({
      costBasis: 10000,
      saleProceeds: 6000,
      holdingPeriod: 'short_term',
      incomeTaxBracketPercentage: 24,
      longTermTaxRatePercentage: 15,
    });
    assert('CryptoTax', 'Capital loss results in 0 tax owed', taxLoss.estimatedTaxOwed === 0 && !taxLoss.isGain);
  } catch (e: any) {
    assert('CryptoTax', 'Exception handling', false, e.message);
  }

  // 10. Loan EMI
  try {
    const loan = calculateLoanEMI({
      principal: 200000,
      annualInterestRate: 7.5,
      loanTenureYears: 15,
    });
    assert('LoanEMI', 'Monthly EMI positive and schedule generated', loan.monthlyEmi > 0 && loan.schedule.length > 0);

    const zeroLoan = calculateLoanEMI({
      principal: 12000,
      annualInterestRate: 0,
      loanTenureYears: 1,
    });
    assert('LoanEMI', 'Zero interest rate splits evenly', Math.abs(zeroLoan.monthlyEmi - 1000) < 0.01);

    const largeLoan = calculateLoanEMI({
      principal: 5000000,
      annualInterestRate: 6.0,
      loanTenureYears: 30,
    });
    assert('LoanEMI', 'Multi-million dollar loan computes safely', isFinite(largeLoan.monthlyEmi) && largeLoan.totalPayment > 5000000);
  } catch (e: any) {
    assert('LoanEMI', 'Exception handling', false, e.message);
  }

  // 11. SIP
  try {
    const sip = calculateSIP({
      monthlyInvestment: 500,
      expectedAnnualReturn: 12,
      tenureYears: 10,
    });
    assert('SIP', 'Total invested is 60,000', sip.totalInvested === 60000);
    assert('SIP', 'Maturity value exceeds invested', sip.totalMaturityValue > 60000);

    const zeroReturnSIP = calculateSIP({
      monthlyInvestment: 500,
      expectedAnnualReturn: 0,
      tenureYears: 5,
    });
    assert('SIP', '0% return matches total invested', zeroReturnSIP.totalMaturityValue === 30000 && zeroReturnSIP.estimatedReturns === 0);
  } catch (e: any) {
    assert('SIP', 'Exception handling', false, e.message);
  }

  // 12. Compound Interest
  try {
    const ci = calculateCompoundInterest({
      initialPrincipal: 10000,
      monthlyContribution: 500,
      annualInterestRate: 7,
      years: 10,
      compoundingFrequency: 'monthly',
    });
    assert('CompoundInterest', 'Final balance computed correctly', ci.finalBalance > ci.totalPrincipalInvested);

    const zeroRateCI = calculateCompoundInterest({
      initialPrincipal: 5000,
      monthlyContribution: 100,
      annualInterestRate: 0,
      years: 2,
      compoundingFrequency: 'annually',
    });
    assert('CompoundInterest', 'Zero rate keeps principal equal to final balance', zeroRateCI.finalBalance === 7400 && zeroRateCI.totalInterestEarned === 0);
  } catch (e: any) {
    assert('CompoundInterest', 'Exception handling', false, e.message);
  }

  // 13. Investment Return
  try {
    const inv = calculateInvestmentReturn({
      initialInvestment: 10000,
      monthlyContribution: 100,
      expectedAnnualReturn: 8,
      years: 5,
    });
    assert('InvestmentReturn', 'Gain is calculated correctly', inv.totalGain > 0 && isFinite(inv.annualizedCagr));

    const zeroReturnInv = calculateInvestmentReturn({
      initialInvestment: 10000,
      monthlyContribution: 0,
      expectedAnnualReturn: 0,
      years: 3,
    });
    assert('InvestmentReturn', 'Zero expected return yields 0 total gain', zeroReturnInv.totalGain === 0 && zeroReturnInv.futureValue === 10000);
  } catch (e: any) {
    assert('InvestmentReturn', 'Exception handling', false, e.message);
  }

  // 14. Savings
  try {
    const sav = calculateSavings({
      initialDeposit: 2000,
      monthlyDeposit: 300,
      annualInterestRate: 4.5,
      years: 3,
    });
    assert('Savings', 'Savings balance > principal', sav.finalSavingsBalance > sav.totalPrincipal);

    const zeroRateSavings = calculateSavings({
      initialDeposit: 1000,
      monthlyDeposit: 100,
      annualInterestRate: 0,
      years: 1,
    });
    assert('Savings', 'Zero interest savings produces exact deposits', zeroRateSavings.finalSavingsBalance === 2200 && zeroRateSavings.totalInterestEarned === 0);
  } catch (e: any) {
    assert('Savings', 'Exception handling', false, e.message);
  }

  // 15. Mortgage
  try {
    const mort = calculateMortgage({
      homePrice: 400000,
      downPayment: 20,
      downPaymentType: 'percentage',
      loanTermYears: 30,
      annualInterestRate: 6.5,
      annualPropertyTaxRate: 1.2,
      annualHomeownersInsurance: 1200,
    });
    assert('Mortgage', 'Down payment is 80,000', mort.downPaymentAmount === 80000);
    assert('Mortgage', 'Loan amount is 320,000', mort.loanAmount === 320000);
    assert('Mortgage', 'Monthly payment is positive', mort.totalMonthlyPayment > 0);

    const zeroInterestMortgage = calculateMortgage({
      homePrice: 120000,
      downPayment: 0,
      downPaymentType: 'amount',
      loanTermYears: 10,
      annualInterestRate: 0,
      annualPropertyTaxRate: 0,
      annualHomeownersInsurance: 0,
    });
    assert('Mortgage', 'Zero rate mortgage divides loan amount evenly', Math.abs(zeroInterestMortgage.monthlyPrincipalAndInterest - 1000) < 0.01);
  } catch (e: any) {
    assert('Mortgage', 'Exception handling', false, e.message);
  }

  return results;
}
