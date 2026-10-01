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
import { calculateCAGR } from './cagr';
import { calculateDividend } from './dividend';
import { calculateInflation } from './inflation';
import { calculateRetirement } from './retirement';
import { calculateDebtPayoff } from './debtPayoff';
import { calculateAmortization } from './amortization';
import { calculateLoanInterest } from './loanInterest';
import { calculateLeverage } from './leverage';
import { calculateMargin } from './margin';
import { calculateLiquidationPrice } from './liquidationPrice';
import { calculateFuturesPnl } from './futuresPnl';
import { calculateRiskReward } from './riskReward';
import { calculateTakeProfit } from './takeProfit';
import { calculateBreakEvenPrice } from './breakEvenPrice';
import { calculateApyApr } from './apyApr';
import { calculateFutureValue } from './futureValue';
import { calculatePresentValue } from './presentValue';
import { calculateRoi } from './roiCalculator';
import { calculateNpv } from './npv';
import { calculateIrr } from './irr';
import { calculateCarLoan } from './carLoan';
import { calculatePersonalLoan } from './personalLoan';
import { calculateMortgageAffordability } from './mortgageAffordability';
import { calculateExtraPayment } from './extraPayment';
import { calculateLoanComparison } from './loanComparison';
import { calculatePositionSize } from './generalPositionSize';
import { calculateStopLoss } from './stopLoss';
import { calculatePipValue } from './pipValue';
import { calculateTradingFee } from './generalTradingFee';
import { calculateMarginOfSafety } from './marginOfSafety';
import { calculateBudget } from './budget';
import { calculateSalary } from './salary';
import { calculateTakeHomePay } from './takeHomePay';
import { calculateSavingsGoal } from './savingsGoal';
import { calculateEmergencyFund } from './emergencyFund';
import { calculateAssetAllocation } from './assetAllocation';
import { calculateStockAverage } from './stockAverage';
import { calculateDividendReinvestment } from './dividendReinvestment';
import { calculateInvestmentFee } from './investmentFee';
import { calculateBondYield } from './bondYield';
import { calculateCryptoAveragePrice } from './cryptoAveragePrice';
import { calculateCryptoMarketCap } from './cryptoMarketCap';
import { calculateCryptoGasFee } from './cryptoGasFee';
import { calculateCryptoConversion } from './cryptoConversion';
import { calculateCryptoCompoundGrowth } from './cryptoCompoundGrowth';
import { calculateSavingsInterest } from './savingsInterest';
import { calculateSimpleInterest } from './simpleInterest';
import { calculateBatch4CompoundInterest } from './batch4CompoundInterest';
import { calculateRuleOf72 } from './ruleOf72';
import { calculateDiscount } from './discount';
import { calculatePercentageChange } from './percentageChange';
import { calculateProfitMargin } from './profitMargin';
import { calculateMarkup } from './markup';
import { calculateBusinessBreakEven } from './businessBreakEven';
import { calculateCashFlow } from './cashFlow';
import { calculateCapitalGains } from './capitalGains';
import { calculateStockProfit } from './stockProfit';
import { calculateBatch4CryptoROI } from './batch4CryptoROI';
import { calculateBatch4CryptoTax } from './batch4CryptoTax';
import { calculateBatch4CryptoDCA } from './batch4CryptoDCA';
import { calculateNetWorth } from './netWorth';
import { calculateDebtToIncome } from './debtToIncome';
import { calculateSavingsRate } from './savingsRate';
import { calculateFinancialIndependence } from './financialIndependence';
import { calculateFIRE } from './fire';
import { calculateRetirementWithdrawal } from './retirementWithdrawal';
import { calculateSafeWithdrawalRate } from './safeWithdrawalRate';
import { calculateAnnuity } from './annuity';
import { calculateBondPrice } from './bondPrice';
import { calculateYieldToMaturity } from './yieldToMaturity';
import { calculateStockValuation } from './stockValuation';
import { calculatePeRatio } from './peRatio';
import { calculatePositionRisk } from './positionRisk';
import { calculateCryptoBreakEvenROI } from './cryptoBreakEvenROI';
import { calculateCryptoDCAStrategy } from './cryptoDCAStrategy';
import { calculateImpermanentLoss } from './impermanentLoss';
import { calculateCryptoApyToApr } from './cryptoApyToApr';
import { calculateCryptoMining } from './cryptoMining';
import { calculateBalloonLoan } from './balloonLoan';
import { calculateHelocPayment } from './helocPayment';
import { calculateBiweeklyMortgage } from './biweeklyMortgage';
import { calculateCapm } from './capm';
import { calculateDividendPayoutRatio } from './dividendPayoutRatio';
import { calculatePortfolioRebalancing } from './portfolioRebalancing';
import { calculateWacc } from './wacc';
import { calculateCdLadder } from './cdLadder';
import { calculateCollegeSavings } from './collegeSavings';
import { calculateHighYieldSavings } from './highYieldSavings';
import { calculateWorkingCapital } from './workingCapital';
import { calculateSalesTax } from './salesTax';

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

  // 16. CAGR Calculator
  try {
    const cagrRes = calculateCAGR({ initialValue: 10000, finalValue: 20000, years: 5 });
    assert('CAGR', 'Doubling over 5 years yields ~14.87%', Math.abs(cagrRes.cagr - 14.87) < 0.1);
    assert('CAGR', 'Absolute gain is 10,000', cagrRes.absoluteGain === 10000);
    assert('CAGR', 'Growth multiple is 2.0x', cagrRes.growthMultiple === 2.0);

    const zeroCagr = calculateCAGR({ initialValue: 0, finalValue: 100, years: 0 });
    assert('CAGR', 'Zero inputs handled safely without NaN', !isNaN(zeroCagr.cagr) && isFinite(zeroCagr.cagr));
  } catch (e: any) {
    assert('CAGR', 'Exception handling', false, e.message);
  }

  // 17. Dividend Calculator
  try {
    const divRes = calculateDividend({
      stockPrice: 100,
      sharesOwned: 50,
      annualDividendPerShare: 4,
      dividendGrowthRate: 0,
      yearsInvested: 1,
      reinvestDividends: false,
      payoutFrequency: 'quarterly',
    });
    assert('Dividend', 'Dividend yield is 4%', divRes.currentYieldPercent === 4);
    assert('Dividend', 'Annual dividend is $200', divRes.annualDividendIncome === 200);
    assert('Dividend', 'Quarterly payout is $50', divRes.payoutPerPeriod === 50);
  } catch (e: any) {
    assert('Dividend', 'Exception handling', false, e.message);
  }

  // 18. Inflation Calculator
  try {
    const infRes = calculateInflation({ currentAmount: 1000, inflationRate: 10, years: 1 });
    assert('Inflation', '10% inflation makes $1000 cost $1100', Math.abs(infRes.futureCost - 1100) < 0.01);
    assert('Inflation', 'Purchasing power is ~909.09', Math.abs(infRes.purchasingPower - 909.09) < 0.1);

    const zeroInf = calculateInflation({ currentAmount: 1000, inflationRate: 0, years: 5 });
    assert('Inflation', '0% inflation preserves exact purchasing power', zeroInf.futureCost === 1000 && zeroInf.purchasingPower === 1000);
  } catch (e: any) {
    assert('Inflation', 'Exception handling', false, e.message);
  }

  // 19. Retirement Calculator
  try {
    const retRes = calculateRetirement({
      currentAge: 30,
      retirementAge: 60,
      currentSavings: 10000,
      monthlyContribution: 500,
      annualReturnRate: 7,
      inflationRate: 2.5,
    });
    assert('Retirement', 'Nest egg accumulates positively', retRes.totalSavingsNominal > 10000);
    assert('Retirement', 'Safe monthly withdrawal is positive', retRes.monthlyRetirementIncome4Percent > 0);
  } catch (e: any) {
    assert('Retirement', 'Exception handling', false, e.message);
  }

  // 20. Debt Payoff Calculator
  try {
    const debtRes = calculateDebtPayoff({ balance: 1000, interestRate: 12, monthlyPayment: 100 });
    assert('DebtPayoff', 'Paid off within finite months', debtRes.monthsToPayoff > 0 && debtRes.monthsToPayoff < 15);
    assert('DebtPayoff', 'Total paid exceeds original balance', debtRes.totalAmountPaid > 1000);

    const underpaidDebt = calculateDebtPayoff({ balance: 10000, interestRate: 24, monthlyPayment: 50 });
    assert('DebtPayoff', 'Insufficient payment flagged', !underpaidDebt.isPaymentSufficient);
  } catch (e: any) {
    assert('DebtPayoff', 'Exception handling', false, e.message);
  }

  // 21. Amortization Calculator
  try {
    const amortRes = calculateAmortization({ loanAmount: 100000, interestRate: 6, loanTermYears: 30 });
    assert('Amortization', 'Calculates valid monthly payment (~599.55)', Math.abs(amortRes.monthlyPayment - 599.55) < 0.5);
    assert('Amortization', 'Generates 360 monthly schedule items', amortRes.schedule.length === 360);

    const zeroAmort = calculateAmortization({ loanAmount: 12000, interestRate: 0, loanTermYears: 1 });
    assert('Amortization', '0% interest yields exact principal division ($1,000/mo)', Math.abs(zeroAmort.monthlyPayment - 1000) < 0.01);
  } catch (e: any) {
    assert('Amortization', 'Exception handling', false, e.message);
  }

  // 22. Loan Interest Calculator
  try {
    const loanInt = calculateLoanInterest({ loanAmount: 10000, interestRate: 5, loanTermYears: 2, calculationType: 'simple' });
    assert('LoanInterest', 'Simple interest is $1,000', loanInt.totalInterest === 1000);
    assert('LoanInterest', 'Total payment is $11,000', loanInt.totalPayment === 11000);

    const zeroLoanInt = calculateLoanInterest({ loanAmount: 5000, interestRate: 0, loanTermYears: 1, calculationType: 'amortized' });
    assert('LoanInterest', '0% interest handles safely with 0 interest', zeroLoanInt.totalInterest === 0 && Math.abs(zeroLoanInt.monthlyPayment - (5000 / 12)) < 0.01);
  } catch (e: any) {
    assert('LoanInterest', 'Exception handling', false, e.message);
  }

  // 23. Leverage Calculator
  try {
    const levRes = calculateLeverage({ marginAvailable: 1000, leverageMultiple: 10, assetPrice: 50000 });
    assert('Leverage', '10x leverage on $1000 is $10,000 exposure', levRes.totalPositionExposure === 10000);
    assert('Leverage', 'Borrowed funds are $9,000', levRes.borrowedFunds === 9000);
    assert('Leverage', 'Max adverse drawdown is 10%', levRes.maxDrawdownBeforeDepletion === 10);
  } catch (e: any) {
    assert('Leverage', 'Exception handling', false, e.message);
  }

  // 24. Margin Calculator
  try {
    const marginRes = calculateMargin({ entryPrice: 1000, positionQuantity: 2, leverage: 10, maintenanceMarginRate: 0.5 });
    assert('Margin', 'Position value is $2,000', marginRes.positionValue === 2000);
    assert('Margin', 'Initial margin required is $200', marginRes.requiredInitialMargin === 200);
    assert('Margin', 'Maintenance margin is $10', marginRes.maintenanceMargin === 10);
  } catch (e: any) {
    assert('Margin', 'Exception handling', false, e.message);
  }

  // 25. Liquidation Price Calculator
  try {
    const liqLong = calculateLiquidationPrice({ direction: 'long', entryPrice: 10000, leverage: 10, maintenanceMarginRate: 0.5 });
    assert('Liquidation', 'Long liq price is below entry', liqLong.liquidationPrice < 10000 && liqLong.liquidationPrice > 8000);
    assert('Liquidation', 'Exchange variance advisory included', liqLong.exchangeVarianceNotice.length > 0);

    const liqShort = calculateLiquidationPrice({ direction: 'short', entryPrice: 10000, leverage: 10, maintenanceMarginRate: 0.5 });
    assert('Liquidation', 'Short liq price is above entry', liqShort.liquidationPrice > 10000);
  } catch (e: any) {
    assert('Liquidation', 'Exception handling', false, e.message);
  }

  // 26. Futures P&L Calculator
  try {
    const futLong = calculateFuturesPnl({
      direction: 'long',
      entryPrice: 50000,
      exitPrice: 55000,
      quantity: 1,
      leverage: 10,
      entryFeeRate: 0.05,
      exitFeeRate: 0.05,
    });
    assert('FuturesPnl', 'Long gross PnL is $5,000', futLong.grossPnl === 5000);
    assert('FuturesPnl', 'Net PnL accounts for roundtrip commissions', futLong.netPnl < 5000 && futLong.netPnl > 4900);
    assert('FuturesPnl', 'Positive ROE', futLong.roePercent > 0);

    const futShort = calculateFuturesPnl({
      direction: 'short',
      entryPrice: 50000,
      exitPrice: 45000,
      quantity: 1,
      leverage: 10,
      entryFeeRate: 0,
      exitFeeRate: 0,
    });
    assert('FuturesPnl', 'Short gross PnL is $5,000', futShort.grossPnl === 5000);
  } catch (e: any) {
    assert('FuturesPnl', 'Exception handling', false, e.message);
  }

  // 27. Risk/Reward Calculator
  try {
    const rrRes = calculateRiskReward({ direction: 'long', entryPrice: 100, stopLossPrice: 90, takeProfitPrice: 130 });
    assert('RiskReward', 'Reward/Risk ratio is 3.0', rrRes.riskRewardRatio === 3);
    assert('RiskReward', 'Break-even win rate is 25%', rrRes.breakEvenWinRatePercent === 25);
  } catch (e: any) {
    assert('RiskReward', 'Exception handling', false, e.message);
  }

  // 28. Take Profit Calculator
  try {
    const tpRes = calculateTakeProfit({ direction: 'long', entryPrice: 100, stopLossPrice: 95, desiredRiskRewardRatio: 2 });
    assert('TakeProfit', 'Target TP price is 110', tpRes.takeProfitPrice === 110);
    assert('TakeProfit', 'Ladder generated', tpRes.targetLadder.length > 0);

    const tpShort = calculateTakeProfit({ direction: 'short', entryPrice: 100, stopLossPrice: 105, desiredRiskRewardRatio: 2 });
    assert('TakeProfit', 'Short TP price is 90', tpShort.takeProfitPrice === 90);
  } catch (e: any) {
    assert('TakeProfit', 'Exception handling', false, e.message);
  }

  // 29. Break-Even Price Calculator
  try {
    const beRes = calculateBreakEvenPrice({ direction: 'long', entryPrice: 1000, quantity: 1, entryFeeRate: 0.1, exitFeeRate: 0.1 });
    assert('BreakEven', 'Long break-even exit price is above entry to clear fees', beRes.breakEvenPrice > 1000);
    assert('BreakEven', 'Total fees calculated', beRes.totalRoundtripFees > 0);
  } catch (e: any) {
    assert('BreakEven', 'Exception handling', false, e.message);
  }

  // 30. APY/APR Calculator
  try {
    const apyRes = calculateApyApr({ conversionMode: 'apr-to-apy', ratePercent: 10, compoundingFrequency: 'daily' });
    assert('ApyApr', 'Daily compounding APR to APY produces higher yield (>10.5%)', apyRes.convertedRatePercent > 10.5);
    assert('ApyApr', 'Effective yield boost is positive', apyRes.effectiveYieldBoost > 0);

    const aprRes = calculateApyApr({ conversionMode: 'apy-to-apr', ratePercent: 10.517, compoundingFrequency: 'daily' });
    assert('ApyApr', 'APY to APR produces ~10%', Math.abs(aprRes.convertedRatePercent - 10) < 0.05);
  } catch (e: any) {
    assert('ApyApr', 'Exception handling', false, e.message);
  }

  // 31. Future Value Calculator
  try {
    const fvRes = calculateFutureValue({ presentValue: 10000, annualInterestRate: 8, years: 10, periodicDeposit: 250 });
    assert('FutureValue', 'Future value greater than invested principal', fvRes.futureValue > fvRes.totalPrincipalInvested);
    assert('FutureValue', 'Handles 0 years safely', calculateFutureValue({ presentValue: 5000, annualInterestRate: 5, years: 0 }).futureValue === 5000);
    assert('FutureValue', 'Handles 0% interest safely', calculateFutureValue({ presentValue: 1000, annualInterestRate: 0, years: 5, periodicDeposit: 100 }).futureValue === 7000);
  } catch (e: any) {
    assert('FutureValue', 'Exception handling', false, e.message);
  }

  // 32. Present Value Calculator
  try {
    const pvRes = calculatePresentValue({ futureValue: 100000, discountRate: 6.5, years: 10 });
    assert('PresentValue', 'Present value less than future value', pvRes.presentValue < 100000 && pvRes.presentValue > 0);
    assert('PresentValue', 'Discount factor in range 0-1', pvRes.discountFactor > 0 && pvRes.discountFactor < 1);
    assert('PresentValue', 'Handles 0 years safely', calculatePresentValue({ futureValue: 50000, discountRate: 5, years: 0 }).presentValue === 50000);
  } catch (e: any) {
    assert('PresentValue', 'Exception handling', false, e.message);
  }

  // 33. ROI Calculator
  try {
    const roiRes = calculateRoi({ initialInvestment: 10000, finalValue: 15000, investmentPeriodYears: 2 });
    assert('RoiCalculator', 'ROI is 50%', roiRes.roiPercentage === 50);
    assert('RoiCalculator', 'Net profit is 5000', roiRes.netProfit === 5000);
    assert('RoiCalculator', 'Annualized ROI calculated', roiRes.annualizedRoiPercentage !== undefined && roiRes.annualizedRoiPercentage > 20);
  } catch (e: any) {
    assert('RoiCalculator', 'Exception handling', false, e.message);
  }

  // 34. NPV Calculator
  try {
    const npvRes = calculateNpv({ initialInvestment: 50000, discountRate: 10, cashFlows: [20000, 20000, 25000] });
    assert('NpvCalculator', 'NPV calculated safely', !isNaN(npvRes.npv));
    assert('NpvCalculator', 'Schedule length matches inflows + 1', npvRes.schedule.length === 4);
  } catch (e: any) {
    assert('NpvCalculator', 'Exception handling', false, e.message);
  }

  // 35. IRR Calculator
  try {
    const irrRes = calculateIrr({ initialInvestment: 100000, cashFlows: [35000, 35000, 35000, 35000] });
    assert('IrrCalculator', 'Valid IRR found', irrRes.hasValidSolution && irrRes.irrPercentage !== null && irrRes.irrPercentage > 10);
    assert('IrrCalculator', 'NPV profile generated', irrRes.npvProfile.length > 0);
  } catch (e: any) {
    assert('IrrCalculator', 'Exception handling', false, e.message);
  }

  // 36. Car Loan Calculator
  try {
    const carRes = calculateCarLoan({ vehiclePrice: 30000, downPayment: 5000, interestRate: 6, loanTermMonths: 60 });
    assert('CarLoan', 'Monthly payment positive', carRes.monthlyPayment > 0);
    assert('CarLoan', 'Total cost includes price and interest', carRes.totalOutOfPocketCost > 30000);
    assert('CarLoan', 'Handles 0% APR safely', calculateCarLoan({ vehiclePrice: 20000, downPayment: 0, interestRate: 0, loanTermMonths: 40 }).monthlyPayment === 500);
  } catch (e: any) {
    assert('CarLoan', 'Exception handling', false, e.message);
  }

  // 37. Personal Loan Calculator
  try {
    const plRes = calculatePersonalLoan({ loanAmount: 10000, interestRate: 8, loanTermMonths: 36, originationFeePercent: 3 });
    assert('PersonalLoan', 'Monthly payment positive', plRes.monthlyPayment > 0);
    assert('PersonalLoan', 'Net cash reflects 3% origination fee', plRes.netDisbursedAmount === 9700);
    assert('PersonalLoan', 'Handles 0% interest safely', calculatePersonalLoan({ loanAmount: 1200, interestRate: 0, loanTermMonths: 12 }).monthlyPayment === 100);
  } catch (e: any) {
    assert('PersonalLoan', 'Exception handling', false, e.message);
  }

  // 38. Mortgage Affordability Calculator
  try {
    const mAfford = calculateMortgageAffordability({ annualHouseholdIncome: 100000, monthlyDebtPayments: 400, downPayment: 50000, interestRate: 6.5, loanTermYears: 30 });
    assert('MortgageAffordability', 'Home price greater than down payment', mAfford.maxAffordableHomePrice > 50000);
    assert('MortgageAffordability', 'DTI limits respected', mAfford.frontEndDti <= 35);
  } catch (e: any) {
    assert('MortgageAffordability', 'Exception handling', false, e.message);
  }

  // 39. Extra Payment Calculator
  try {
    const epRes = calculateExtraPayment({ loanBalance: 200000, interestRate: 6, remainingYears: 20, extraMonthlyPayment: 200 });
    assert('ExtraPayment', 'Interest saved is positive', epRes.totalInterestSaved > 0);
    assert('ExtraPayment', 'Payoff months reduced', epRes.monthsSaved > 0);
  } catch (e: any) {
    assert('ExtraPayment', 'Exception handling', false, e.message);
  }

  // 40. Loan Comparison Calculator
  try {
    const compRes = calculateLoanComparison({
      loanA: { principal: 200000, interestRate: 6.5, termYears: 30 },
      loanB: { principal: 200000, interestRate: 5.5, termYears: 15 },
    });
    assert('LoanComparison', 'Comparison identifies 15-year saves total interest', compRes.cheaperLoanOverall === 'Loan B');
    assert('LoanComparison', '30-year has lower monthly payment', compRes.lowerMonthlyLoan === 'Loan A');
  } catch (e: any) {
    assert('LoanComparison', 'Exception handling', false, e.message);
  }

  // 41. Position Size Calculator
  try {
    const psRes = calculatePositionSize({ accountBalance: 10000, riskPercentage: 2, entryPrice: 100, stopLossPrice: 95, tradeDirection: 'long' });
    assert('PositionSize', 'Dollar risk is $200', psRes.riskAmountDollars === 200);
    assert('PositionSize', 'Position units calculated correctly', psRes.positionUnits === 40);
  } catch (e: any) {
    assert('PositionSize', 'Exception handling', false, e.message);
  }

  // 42. Stop Loss Calculator
  try {
    const slLong = calculateStopLoss({ direction: 'long', entryPrice: 1000, mode: 'percentage', riskPercent: 5 });
    assert('StopLoss', 'Long stop is 950', slLong.stopLossPrice === 950);
    const slShort = calculateStopLoss({ direction: 'short', entryPrice: 1000, mode: 'percentage', riskPercent: 5 });
    assert('StopLoss', 'Short stop is 1050', slShort.stopLossPrice === 1050);
  } catch (e: any) {
    assert('StopLoss', 'Exception handling', false, e.message);
  }

  // 43. Pip Value Calculator
  try {
    const pipRes = calculatePipValue({ currencyPair: 'EUR/USD', lotType: 'standard', numberOfLots: 1, exchangeRate: 1.085 });
    assert('PipValue', 'Standard EUR/USD pip value is $10.00', pipRes.totalPipValue === 10);
    assert('PipValue', '50 pips equals $500', pipRes.pipMovementsTable.find(p => p.pips === 50)?.profitOrLoss === 500);
  } catch (e: any) {
    assert('PipValue', 'Exception handling', false, e.message);
  }

  // 44. Trading Fee Calculator
  try {
    const tfRes = calculateTradingFee({ buyPrice: 50000, sellPrice: 55000, quantity: 1, buyFeePercent: 0.1, sellFeePercent: 0.1 });
    assert('TradingFee', 'Net profit after fees calculated', tfRes.netProfitLoss < tfRes.grossProfitLoss && tfRes.netProfitLoss > 4800);
    assert('TradingFee', 'Break even exit price exceeds buy price', tfRes.breakEvenExitPrice > 50000);
  } catch (e: any) {
    assert('TradingFee', 'Exception handling', false, e.message);
  }

  // 45. Margin of Safety Calculator
  try {
    const mosRes = calculateMarginOfSafety({ mode: 'investing', intrinsicValue: 100, marketPrice: 75, targetSafetyMarginPercent: 25 });
    assert('MarginOfSafety', 'MOS is 25%', mosRes.marginOfSafetyPercent === 25);
    assert('MarginOfSafety', 'MOS dollars is $25', mosRes.marginOfSafetyDollars === 25);
    assert('MarginOfSafety', 'Target buy price matches', mosRes.targetBuyPrice === 75);
  } catch (e: any) {
    assert('MarginOfSafety', 'Exception handling', false, e.message);
  }

  // 46. Budget Calculator
  try {
    const bRes = calculateBudget({
      monthlyIncome: 5000,
      additionalIncome: 500,
      housing: 1500,
      utilities: 300,
      groceries: 500,
      transportation: 400,
      healthcare: 200,
      debtPayments: 200,
      entertainment: 400,
      savingsAndInvestments: 1000,
    });
    assert('Budget', 'Total income calculated correctly', bRes.totalIncome === 5500);
    assert('Budget', 'Positive cashflow surplus detected', bRes.remainingCashFlow > 0);
    assert('Budget', '50/30/20 breakdown calculated', bRes.rule50_30_20.needsPercent > 0);
  } catch (e: any) {
    assert('Budget', 'Exception handling', false, e.message);
  }

  // 47. Salary Calculator
  try {
    const sRes = calculateSalary({ baseAmount: 80000, payFrequency: 'annually', stateTaxRatePercent: 5 });
    assert('Salary', 'Net annual salary calculated', sRes.netAnnual > 40000 && sRes.netAnnual < 80000);
    assert('Salary', 'Hourly conversion accurate', sRes.grossHourly > 0);
    assert('Salary', 'Handles 0 salary safely', calculateSalary({ baseAmount: 0, payFrequency: 'annually' }).netAnnual === 0);
  } catch (e: any) {
    assert('Salary', 'Exception handling', false, e.message);
  }

  // 48. Take-Home Pay Calculator
  try {
    const thRes = calculateTakeHomePay({ grossPaycheckAmount: 2500, payPeriod: 'bi-weekly', federalWithholdingPercent: 12 });
    assert('TakeHomePay', 'Take-home pay positive', thRes.takeHomePay > 0 && thRes.takeHomePay < 2500);
    assert('TakeHomePay', 'Take-home percentage calculated', thRes.takeHomePercent > 50);
  } catch (e: any) {
    assert('TakeHomePay', 'Exception handling', false, e.message);
  }

  // 49. Savings Goal Calculator
  try {
    const sgRes = calculateSavingsGoal({ targetAmount: 20000, currentSavings: 2000, targetTimeYears: 3, annualInterestRate: 4.5, calculationMode: 'solve-contribution' });
    assert('SavingsGoal', 'Monthly contribution positive', sgRes.monthlyContributionRequired > 0);
    assert('SavingsGoal', 'Interest earned positive', sgRes.totalInterestEarned > 0);
  } catch (e: any) {
    assert('SavingsGoal', 'Exception handling', false, e.message);
  }

  // 50. Emergency Fund Calculator
  try {
    const efRes = calculateEmergencyFund({
      housingRentOrMortgage: 1200,
      utilitiesAndBills: 300,
      groceriesAndFood: 400,
      transportationAndGas: 300,
      insuranceAndMedical: 200,
      minimumDebtPayments: 100,
      coverageMonths: 6,
      currentEmergencySavings: 5000,
    });
    assert('EmergencyFund', 'Target is 6x essential expenses ($15,000)', efRes.targetFundAmount === 15000);
    assert('EmergencyFund', 'Shortfall calculated accurately ($10,000)', efRes.shortfallOrSurplus === 10000);
  } catch (e: any) {
    assert('EmergencyFund', 'Exception handling', false, e.message);
  }

  // 51. Asset Allocation Calculator
  try {
    const aaRes = calculateAssetAllocation({ stocks: 60000, bonds: 30000, cash: 10000, crypto: 0, targetModel: 'balanced' });
    assert('AssetAllocation', 'Total portfolio is 100,000', aaRes.totalPortfolioValue === 100000);
    assert('AssetAllocation', 'Allocations count matches 5 asset classes', aaRes.allocations.length === 5);
  } catch (e: any) {
    assert('AssetAllocation', 'Exception handling', false, e.message);
  }

  // 52. Stock Average Calculator
  try {
    const saRes = calculateStockAverage({
      purchases: [{ shares: 10, pricePerShare: 100 }, { shares: 10, pricePerShare: 50 }],
      currentMarketPrice: 80,
    });
    assert('StockAverage', 'Average price is 75', saRes.averagePricePerShare === 75);
    assert('StockAverage', 'Total shares is 20', saRes.totalShares === 20);
    assert('StockAverage', 'P&L is positive at $80', saRes.isProfit === true && saRes.totalProfitOrLoss === 100);
  } catch (e: any) {
    assert('StockAverage', 'Exception handling', false, e.message);
  }

  // 53. Dividend Reinvestment Calculator
  try {
    const drRes = calculateDividendReinvestment({
      initialInvestment: 10000,
      dividendYieldPercent: 4.0,
      expectedSharePriceAppreciationPercent: 5.0,
      years: 10,
    });
    assert('DividendReinvestment', 'DRIP ending balance exceeds non-DRIP', drRes.endingBalanceWithDrip > drRes.endingBalanceWithoutDrip);
    assert('DividendReinvestment', 'Schedule generated for 10 years', drRes.yearlySchedule.length === 10);
  } catch (e: any) {
    assert('DividendReinvestment', 'Exception handling', false, e.message);
  }

  // 54. Investment Fee Calculator
  try {
    const ifRes = calculateInvestmentFee({
      initialInvestment: 10000,
      annualReturnRatePercent: 8,
      annualFeePercent: 1.5,
      investmentPeriodYears: 20,
    });
    assert('InvestmentFee', 'Ending balance with fee is lower', ifRes.endingBalanceWithFee < ifRes.endingBalanceWithoutFee);
    assert('InvestmentFee', 'Cost of fees is positive', ifRes.totalFeesCost > 0);
  } catch (e: any) {
    assert('InvestmentFee', 'Exception handling', false, e.message);
  }

  // 55. Bond Yield Calculator
  try {
    const byRes = calculateBondYield({ currentBondPrice: 950, faceValue: 1000, annualCouponRatePercent: 5, yearsToMaturity: 5 });
    assert('BondYield', 'Current yield is ~5.26%', Math.abs(byRes.currentYieldPercent - 5.26) < 0.05);
    assert('BondYield', 'Discount status identified', byRes.priceStatus === 'Discount');
    assert('BondYield', 'YTM exceeds coupon rate for discount bond', byRes.approxYieldToMaturityPercent > 5);
  } catch (e: any) {
    assert('BondYield', 'Exception handling', false, e.message);
  }

  // 56. Crypto Average Price Calculator
  try {
    const capRes = calculateCryptoAveragePrice({
      orders: [{ coins: 1, pricePerCoin: 50000 }, { coins: 1, pricePerCoin: 60000 }],
      currentMarketPrice: 65000,
    });
    assert('CryptoAveragePrice', 'Average buy price is 55,000', capRes.averagePricePerCoin === 55000);
    assert('CryptoAveragePrice', 'Total coins is 2', capRes.totalCoins === 2);
    assert('CryptoAveragePrice', 'Unrealized profit is $20,000', capRes.unrealizedProfitOrLoss === 20000);
  } catch (e: any) {
    assert('CryptoAveragePrice', 'Exception handling', false, e.message);
  }

  // 57. Crypto Market Cap Calculator
  try {
    const cmcRes = calculateCryptoMarketCap({ tokenPrice: 10, circulatingSupply: 1000000, mode: 'solve-market-cap' });
    assert('CryptoMarketCap', 'Market cap is 10,000,000', cmcRes.marketCap === 10000000);
    const cmcSolvePrice = calculateCryptoMarketCap({ targetMarketCap: 50000000, circulatingSupply: 5000000, mode: 'solve-price' });
    assert('CryptoMarketCap', 'Solve price calculates $10', cmcSolvePrice.tokenPrice === 10);
  } catch (e: any) {
    assert('CryptoMarketCap', 'Exception handling', false, e.message);
  }

  // 58. Crypto Gas Fee Calculator
  try {
    const cgfRes = calculateCryptoGasFee({ gasPriceGwei: 30, gasLimitUnits: 21000, nativeTokenPriceUsd: 2500 });
    assert('CryptoGasFee', 'Fee in ETH calculated', cgfRes.totalFeeInNativeToken > 0);
    assert('CryptoGasFee', 'Fee in USD matches', cgfRes.totalFeeInUsd > 0);
  } catch (e: any) {
    assert('CryptoGasFee', 'Exception handling', false, e.message);
  }

  // 59. Crypto Conversion Calculator
  try {
    const ccRes = calculateCryptoConversion({ direction: 'crypto-to-fiat', amount: 2, coinSymbol: 'ETH', fiatCurrency: 'USD', exchangeRate: 2500 });
    assert('CryptoConversion', '2 ETH at $2500 is $5000', ccRes.targetAmount === 5000);
    const ccFiatToCrypto = calculateCryptoConversion({ direction: 'fiat-to-crypto', amount: 5000, coinSymbol: 'ETH', fiatCurrency: 'USD', exchangeRate: 2500 });
    assert('CryptoConversion', '$5000 at $2500 is 2 ETH', ccFiatToCrypto.targetAmount === 2);
  } catch (e: any) {
    assert('CryptoConversion', 'Exception handling', false, e.message);
  }

  // 60. Crypto Compound Interest Calculator
  try {
    const cciRes = calculateCryptoCompoundGrowth({
      initialCryptoAmount: 5000,
      regularContribution: 100,
      annualYieldPercent: 10,
      compoundingFrequency: 'daily',
      investmentPeriodYears: 3,
    });
    assert('CryptoCompoundGrowth', 'Future value greater than contributions', cciRes.futurePortfolioValue > cciRes.totalPrincipalContributed);
    assert('CryptoCompoundGrowth', 'Compounded earnings positive', cciRes.totalCompoundedEarnings > 0);
  } catch (e: any) {
    assert('CryptoCompoundGrowth', 'Exception handling', false, e.message);
  }

  // 61. Savings Interest Calculator
  try {
    const siRes = calculateSavingsInterest({
      initialDeposit: 10000,
      monthlyDeposit: 300,
      annualInterestRate: 4.75,
      compoundingFrequency: 'monthly',
      periodYears: 5,
    });
    assert('SavingsInterest', 'Final balance exceeds deposits', siRes.finalBalance > siRes.totalDeposited);
    assert('SavingsInterest', 'Interest earned is positive', siRes.totalInterestEarned > 0);
    assert('SavingsInterest', 'Total deposited is 28,000', siRes.totalDeposited === 28000);
  } catch (e: any) {
    assert('SavingsInterest', 'Exception handling', false, e.message);
  }

  // 62. Simple Interest Calculator
  try {
    const simpRes = calculateSimpleInterest({
      principal: 15000,
      annualRate: 6.5,
      time: 3,
      timeUnit: 'years',
    });
    assert('SimpleInterest', 'Interest is 2,925', Math.abs(simpRes.totalInterest - 2925) < 0.01);
    assert('SimpleInterest', 'Final amount is 17,925', Math.abs(simpRes.finalAmount - 17925) < 0.01);
  } catch (e: any) {
    assert('SimpleInterest', 'Exception handling', false, e.message);
  }

  // 63. Compound Interest Calculator
  try {
    const ciB4 = calculateBatch4CompoundInterest({
      principal: 20000,
      regularContribution: 500,
      contributionFrequency: 'monthly',
      annualInterestRate: 8,
      compoundingFrequency: 'monthly',
      years: 15,
    });
    assert('CompoundInterestB4', 'Final balance exceeds invested capital', ciB4.finalBalance > ciB4.totalPrincipalInvested);
    assert('CompoundInterestB4', 'Schedule generated for 15 years', ciB4.yearlySchedule.length === 15);
  } catch (e: any) {
    assert('CompoundInterestB4', 'Exception handling', false, e.message);
  }

  // 64. Rule of 72 Calculator
  try {
    const r72Years = calculateRuleOf72({ mode: 'solve-years', interestRate: 9, startingAmount: 25000 });
    assert('RuleOf72', 'Doubling time is 8 years at 9%', Math.abs(r72Years.doublingYearsRule72 - 8) < 0.01);
    assert('RuleOf72', 'Doubled amount is 50,000', r72Years.doubledAmount === 50000);

    const r72Rate = calculateRuleOf72({ mode: 'solve-rate', targetYears: 8, startingAmount: 10000 });
    assert('RuleOf72', 'Required rate is 9% for 8 years', Math.abs(r72Rate.interestRate - 9) < 0.01);
  } catch (e: any) {
    assert('RuleOf72', 'Exception handling', false, e.message);
  }

  // 65. Discount Calculator
  try {
    const discRes = calculateDiscount({
      mode: 'from-percentage',
      originalPrice: 120,
      discountPercent: 25,
      salesTaxPercent: 8,
    });
    assert('Discount', 'Discount amount is $30', discRes.discountAmount === 30);
    assert('Discount', 'Price after discount is $90', discRes.priceAfterDiscounts === 90);
    assert('Discount', 'Tax is $7.20', Math.abs(discRes.salesTaxAmount - 7.2) < 0.01);
  } catch (e: any) {
    assert('Discount', 'Exception handling', false, e.message);
  }

  // 66. Percentage Change Calculator
  try {
    const pcRes = calculatePercentageChange({ originalValue: 45, newValue: 72 });
    assert('PercentageChange', 'Change is +60%', Math.abs(pcRes.percentageChange - 60) < 0.01);
    assert('PercentageChange', 'Direction is increase', pcRes.direction === 'increase');
    assert('PercentageChange', 'Difference is 27', pcRes.absoluteDifference === 27);
  } catch (e: any) {
    assert('PercentageChange', 'Exception handling', false, e.message);
  }

  // 67. Profit Margin Calculator
  try {
    const pmRes = calculateProfitMargin({ cost: 40, revenue: 100 });
    assert('ProfitMargin', 'Gross profit is 60', pmRes.grossProfit === 60);
    assert('ProfitMargin', 'Margin is 60%', pmRes.profitMarginPercent === 60);
    assert('ProfitMargin', 'Markup is 150%', pmRes.markupPercent === 150);
  } catch (e: any) {
    assert('ProfitMargin', 'Exception handling', false, e.message);
  }

  // 68. Markup Calculator
  try {
    const mkRes = calculateMarkup({ mode: 'cost-and-markup', costPrice: 60, markupPercent: 75 });
    assert('Markup', 'Selling price is 105', mkRes.sellingPrice === 105);
    assert('Markup', 'Markup amount is 45', mkRes.markupAmount === 45);
  } catch (e: any) {
    assert('Markup', 'Exception handling', false, e.message);
  }

  // 69. Break-Even Business Calculator
  try {
    const beRes = calculateBusinessBreakEven({
      fixedCosts: 24000,
      variableCostPerUnit: 30,
      sellingPricePerUnit: 80,
      targetUnitsSold: 600,
    });
    assert('BusinessBreakEven', 'Break-even units is 480', beRes.breakEvenUnits === 480);
    assert('BusinessBreakEven', 'Break-even revenue is 38,400', beRes.breakEvenRevenue === 38400);
    assert('BusinessBreakEven', 'Profit at 600 units is 6,000', beRes.projectedProfitOrLoss === 6000);
  } catch (e: any) {
    assert('BusinessBreakEven', 'Exception handling', false, e.message);
  }

  // 70. Cash Flow Calculator
  try {
    const cfRes = calculateCashFlow({
      startingBalance: 15000,
      operatingRevenue: 45000,
      payrollAndWages: 18500,
      rentAndFacilities: 4200,
      inventoryAndSupplies: 6500,
    });
    assert('CashFlow', 'Net cash flow is positive', cfRes.netCashFlow > 0);
    assert('CashFlow', 'Ending balance matches start + net', cfRes.endingBalance === 15000 + cfRes.netCashFlow);
  } catch (e: any) {
    assert('CashFlow', 'Exception handling', false, e.message);
  }

  // 71. Capital Gains Calculator
  try {
    const cgRes = calculateCapitalGains({
      purchasePrice: 30,
      salePrice: 55,
      quantity: 500,
      eligibleCosts: 50,
      holdingPeriod: 'long-term',
      estimatedTaxRate: 15,
    });
    assert('CapitalGains', 'Net gain is 12,450', cgRes.netCapitalGainOrLoss === 12450);
    assert('CapitalGains', 'Estimated tax is 1,867.50', Math.abs(cgRes.estimatedTaxLiability - 1867.5) < 0.01);
  } catch (e: any) {
    assert('CapitalGains', 'Exception handling', false, e.message);
  }

  // 72. Stock Profit Calculator
  try {
    const spRes = calculateStockProfit({
      shares: 200,
      buyPricePerShare: 140,
      sellPricePerShare: 165,
      buyCommission: 0,
      sellCommission: 15,
      dividendsReceived: 80,
    });
    assert('StockProfit', 'Net profit is 5,065', spRes.netProfit === 5065);
    assert('StockProfit', 'ROI is positive', spRes.roiPercent > 0);
  } catch (e: any) {
    assert('StockProfit', 'Exception handling', false, e.message);
  }

  // 73. Crypto ROI Calculator
  try {
    const cRoiRes = calculateBatch4CryptoROI({
      mode: 'by-amount',
      investmentAmount: 3000,
      finalValue: 11500,
      fees: 25,
    });
    assert('Batch4CryptoROI', 'Net profit is 8,475', cRoiRes.netProfit === 8475);
    assert('Batch4CryptoROI', 'Multiplier is > 3.8x', cRoiRes.capitalMultiplier > 3.8);
  } catch (e: any) {
    assert('Batch4CryptoROI', 'Exception handling', false, e.message);
  }

  // 74. Crypto Tax Calculator
  try {
    const cTaxRes = calculateBatch4CryptoTax({
      purchasePricePerCoin: 1800,
      salePricePerCoin: 3280,
      quantity: 2.5,
      fees: 60,
      taxRatePercent: 24,
    });
    assert('Batch4CryptoTax', 'Net gain is 3,640', cTaxRes.netTaxableCapitalGain === 3640);
    assert('Batch4CryptoTax', 'Tax owed is 873.60', Math.abs(cTaxRes.estimatedTaxAmount - 873.6) < 0.01);
  } catch (e: any) {
    assert('Batch4CryptoTax', 'Exception handling', false, e.message);
  }

  // 75. Crypto DCA Calculator
  try {
    const cDcaRes = calculateBatch4CryptoDCA({
      recurringAmount: 150,
      frequency: 'weekly',
      totalPeriods: 52,
      startingPrice: 40000,
      endingPrice: 68000,
    });
    assert('Batch4CryptoDCA', 'Total invested is 7,800', cDcaRes.totalInvested === 7800);
    assert('Batch4CryptoDCA', 'Crypto acquired is positive', cDcaRes.totalCryptoAcquired > 0);
    assert('Batch4CryptoDCA', 'Portfolio value positive', cDcaRes.currentPortfolioValue > 0);
  } catch (e: any) {
    assert('Batch4CryptoDCA', 'Exception handling', false, e.message);
  }

  // 76. Net Worth Calculator
  try {
    const nwRes = calculateNetWorth({
      cashAndBank: 40000,
      investments: 160000,
      realEstate: 400000,
      cryptoAssets: 20000,
      retirementAccounts: 180000,
      otherAssets: 0,
      mortgageBalance: 300000,
      autoLoans: 25000,
      studentLoans: 15000,
      creditCardDebt: 5000,
      personalLoans: 0,
      otherLiabilities: 0,
    });
    assert('NetWorth', 'Total assets calculation', nwRes.totalAssets === 800000);
    assert('NetWorth', 'Total liabilities calculation', nwRes.totalLiabilities === 345000);
    assert('NetWorth', 'Net worth equals assets minus liabilities', nwRes.netWorth === 455000);
    assert('NetWorth', 'Financial health tier assigned', nwRes.financialHealthTier === 'Solid');
  } catch (e: any) {
    assert('NetWorth', 'Exception handling', false, e.message);
  }

  // 77. Debt-to-Income Calculator
  try {
    const dtiRes = calculateDebtToIncome({
      grossMonthlyIncome: 10000,
      rentOrMortgage: 2400,
      autoLoanPayments: 500,
      studentLoanPayments: 300,
      creditCardMinimums: 100,
      personalAndOtherLoans: 0,
    });
    assert('DebtToIncome', 'Total monthly debt is 3,300', dtiRes.totalMonthlyDebt === 3300);
    assert('DebtToIncome', 'DTI is 33%', Math.abs(dtiRes.dtiPercentage - 33) < 0.01);
    assert('DebtToIncome', 'Benchmark range is Standard Benchmark (<= 36%)', dtiRes.dtiBenchmarkRange === 'Standard Benchmark (<= 36%)');
  } catch (e: any) {
    assert('DebtToIncome', 'Exception handling', false, e.message);
  }

  // 78. Savings Rate Calculator
  try {
    const srRes = calculateSavingsRate({
      monthlyIncome: 8000,
      monthlySavings: 2400,
      monthlyEssentialSpending: 4000,
      monthlyDiscretionarySpending: 1600,
    });
    assert('SavingsRate', 'Savings rate is 30%', srRes.savingsRatePercentage === 30);
    assert('SavingsRate', 'Annual savings is 28,800', srRes.annualSavings === 28800);
    assert('SavingsRate', 'Years to FI positive number', srRes.projectedYearsToFI > 0);
  } catch (e: any) {
    assert('SavingsRate', 'Exception handling', false, e.message);
  }

  // 79. Financial Independence Calculator
  try {
    const fiRes = calculateFinancialIndependence({
      annualExpenses: 60000,
      withdrawalRate: 4.0,
      currentInvestments: 300000,
      annualContributions: 30000,
      expectedReturn: 7.0,
    });
    assert('FinancialIndependence', 'FI Number is 1,500,000', fiRes.fiNumber === 1500000);
    assert('FinancialIndependence', 'Remaining needed is 1,200,000', fiRes.remainingCapitalNeeded === 1200000);
    assert('FinancialIndependence', 'Progress is 20%', fiRes.currentProgressPercentage === 20);
    assert('FinancialIndependence', 'Years to FI between 1 and 40', fiRes.yearsToFI > 0 && fiRes.yearsToFI < 40);
  } catch (e: any) {
    assert('FinancialIndependence', 'Exception handling', false, e.message);
  }

  // 80. FIRE Calculator
  try {
    const fireRes = calculateFIRE({
      currentAge: 30,
      currentSavings: 100000,
      annualIncome: 120000,
      annualExpenses: 48000,
      annualSavings: 30000,
      expectedReturn: 7.0,
      withdrawalRate: 4.0,
    });
    assert('FIRE', 'FIRE Number is 1,200,000', fireRes.fireNumber === 1200000);
    assert('FIRE', 'Years to FIRE is calculated', fireRes.yearsToFIRE > 0);
    assert('FIRE', 'Lean FIRE is 900,000', fireRes.leanFireNumber === 900000);
  } catch (e: any) {
    assert('FIRE', 'Exception handling', false, e.message);
  }

  // 81. Retirement Withdrawal Calculator
  try {
    const rwRes = calculateRetirementWithdrawal({
      portfolioBalance: 1000000,
      withdrawalRate: 4.0,
      investmentReturn: 5.0,
      retirementPeriodYears: 25,
      inflationRate: 2.0,
    });
    assert('RetirementWithdrawal', 'Initial annual withdrawal is 40,000', rwRes.initialAnnualWithdrawal === 40000);
    assert('RetirementWithdrawal', 'Initial monthly withdrawal is 3,333.33', Math.abs(rwRes.initialMonthlyWithdrawal - 3333.33) < 1);
    assert('RetirementWithdrawal', 'Ending balance positive', rwRes.endingPortfolioBalance > 0);
  } catch (e: any) {
    assert('RetirementWithdrawal', 'Exception handling', false, e.message);
  }

  // 82. Safe Withdrawal Rate Calculator
  try {
    const swrRes = calculateSafeWithdrawalRate({
      portfolioValue: 2000000,
      withdrawalRate: 3.5,
    });
    assert('SafeWithdrawalRate', 'Annual withdrawal is 70,000', swrRes.annualWithdrawal === 70000);
    assert('SafeWithdrawalRate', 'Monthly withdrawal is 5,833.33', Math.abs(swrRes.monthlyWithdrawal - 5833.33) < 1);
    assert('SafeWithdrawalRate', 'Tiers length is 5', swrRes.tierComparisons.length === 5);
  } catch (e: any) {
    assert('SafeWithdrawalRate', 'Exception handling', false, e.message);
  }

  // 83. Annuity Calculator
  try {
    const annRes = calculateAnnuity({
      mode: 'futureValue',
      paymentAmount: 500,
      interestRate: 6.0,
      years: 10,
      frequency: 'monthly',
      timing: 'end',
    });
    assert('Annuity', 'Total payments made is 60,000', annRes.totalPaymentsMade === 60000);
    assert('Annuity', 'Future value greater than payments', annRes.futureValue > 60000);
    assert('Annuity', 'Present value calculated', annRes.presentValue > 0);
  } catch (e: any) {
    assert('Annuity', 'Exception handling', false, e.message);
  }

  // 84. Bond Price Calculator
  try {
    const bpRes = calculateBondPrice({
      faceValue: 1000,
      couponRate: 5.0,
      marketYield: 5.0,
      yearsToMaturity: 10,
      paymentFrequency: 'annual',
    });
    assert('BondPrice', 'Par price when yield equals coupon', Math.abs(bpRes.estimatedPrice - 1000) < 0.05);
    assert('BondPrice', 'Trading status is Par', bpRes.tradingStatus === 'Trading at Par');
  } catch (e: any) {
    assert('BondPrice', 'Exception handling', false, e.message);
  }

  // 85. Yield to Maturity Calculator
  try {
    const ytmRes = calculateYieldToMaturity({
      bondPrice: 1000,
      faceValue: 1000,
      couponRate: 5.0,
      yearsToMaturity: 10,
      paymentFrequency: 'annual',
    });
    assert('YieldToMaturity', 'YTM is 5% when price is at par', Math.abs(ytmRes.estimatedYtmPercentage - 5.0) < 0.05);
    assert('YieldToMaturity', 'Current yield is 5%', ytmRes.currentYieldPercentage === 5.0);
  } catch (e: any) {
    assert('YieldToMaturity', 'Exception handling', false, e.message);
  }

  // 86. Stock Valuation Calculator
  try {
    const svRes = calculateStockValuation({
      model: 'peMultiple',
      currentStockPrice: 100,
      eps: 5,
      targetPeMultiple: 22,
    });
    assert('StockValuation', 'Estimated value is 110', svRes.estimatedValuePerShare === 110);
    assert('StockValuation', 'Percentage difference is 10%', svRes.percentageDifference === 10);
  } catch (e: any) {
    assert('StockValuation', 'Exception handling', false, e.message);
  }

  // 87. P/E Ratio Calculator
  try {
    const peRes = calculatePeRatio({
      mode: 'peFromPriceAndEps',
      stockPrice: 150,
      eps: 7.5,
    });
    assert('PeRatio', 'PE ratio is 20', peRes.peRatio === 20);
    assert('PeRatio', 'Earnings yield is 5%', peRes.earningsYieldPercentage === 5);
  } catch (e: any) {
    assert('PeRatio', 'Exception handling', false, e.message);
  }

  // 88. Position Risk Calculator
  try {
    const prRes = calculatePositionRisk({
      accountBalance: 20000,
      riskPercentage: 2.0,
      entryPrice: 50,
      stopLossPrice: 48,
      takeProfitPrice: 55,
    });
    assert('PositionRisk', 'Total dollar risk is 400', prRes.totalDollarRisk === 400);
    assert('PositionRisk', 'Risk per unit is 2', prRes.riskPerShareOrUnit === 2);
    assert('PositionRisk', 'Position units is 200', prRes.recommendedPositionSizeUnits === 200);
    assert('PositionRisk', 'Risk reward ratio is 2.5', prRes.riskRewardRatio === 2.5);
  } catch (e: any) {
    assert('PositionRisk', 'Exception handling', false, e.message);
  }

  // 89. Crypto Break-Even ROI Calculator
  try {
    const cbeRes = calculateCryptoBreakEvenROI({
      entryPrice: 50000,
      quantity: 1,
      buyFeePercentage: 0.1,
      sellFeePercentage: 0.1,
      targetRoiPercentage: 10,
    });
    assert('CryptoBreakEvenROI', 'Break-even price slightly above entry', cbeRes.breakEvenExitPrice > 50000);
    assert('CryptoBreakEvenROI', 'Target exit price calculated', cbeRes.targetExitPriceForRoi > cbeRes.breakEvenExitPrice);
  } catch (e: any) {
    assert('CryptoBreakEvenROI', 'Exception handling', false, e.message);
  }

  // 90. Crypto DCA Strategy Calculator
  try {
    const cdcaRes = calculateCryptoDCAStrategy({
      recurringAmount: 100,
      frequency: 'weekly',
      durationMonths: 6,
      startingCoinPrice: 2000,
      endingCoinPrice: 3000,
      cycleModel: 'steadyGrowth',
    });
    assert('CryptoDCAStrategy', 'Total invested is positive', cdcaRes.totalFiatInvested > 0);
    assert('CryptoDCAStrategy', 'Crypto acquired is positive', cdcaRes.totalCryptoAcquired > 0);
    assert('CryptoDCAStrategy', 'Ending portfolio value is positive', cdcaRes.endingPortfolioValue > 0);
  } catch (e: any) {
    assert('CryptoDCAStrategy', 'Exception handling', false, e.message);
  }

  // 91. Impermanent Loss
  try {
    const ilRes = calculateImpermanentLoss({ tokenAInitialPrice: 100, tokenAFinalPrice: 200, initialDepositUsd: 1000 });
    assert('ImpermanentLoss', '2x price divergence causes ~5.7% loss', ilRes.impermanentLossPercent < 0 && Math.abs(ilRes.impermanentLossPercent - (-5.72)) < 0.1);
    assert('ImpermanentLoss', 'HODL value exceeds pool value', ilRes.hodlValueUsd > ilRes.poolValueUsd);
  } catch (e: any) {
    assert('ImpermanentLoss', 'Exception handling', false, e.message);
  }

  // 92. Crypto APY to APR
  try {
    const apyAprRes = calculateCryptoApyToApr({ conversionType: 'apyToApr', ratePercent: 15, compoundingFrequency: 'daily', stakedAmountUsd: 10000 });
    assert('CryptoApyToApr', '15% APY converts to ~13.98% APR', Math.abs(apyAprRes.convertedRatePercent - 13.98) < 0.1);
    assert('CryptoApyToApr', 'Annual reward matches 15% on 10k', Math.abs(apyAprRes.annualRewardUsd - 1500) < 0.01);
  } catch (e: any) {
    assert('CryptoApyToApr', 'Exception handling', false, e.message);
  }

  // 93. Crypto Mining Profitability
  try {
    const mineRes = calculateCryptoMining({ hashrateTh: 100, powerConsumptionWatts: 3000, electricityCostKwh: 0.05, dailyRevenuePerThUsd: 0.08 });
    assert('CryptoMining', 'Daily revenue positive', mineRes.dailyRevenueUsd > 0);
    assert('CryptoMining', 'Power cost calculated accurately', mineRes.dailyPowerCostUsd > 0);
  } catch (e: any) {
    assert('CryptoMining', 'Exception handling', false, e.message);
  }

  // 94. Balloon Loan
  try {
    const balloonRes = calculateBalloonLoan({ loanAmount: 200000, annualInterestRate: 6.0, amortizationYears: 30, balloonMaturityYears: 5 });
    assert('BalloonLoan', 'Monthly payment positive', balloonRes.monthlyPayment > 0);
    assert('BalloonLoan', 'Balloon due at year 5 is positive and less than principal', balloonRes.balloonPaymentDue > 0 && balloonRes.balloonPaymentDue < 200000);
  } catch (e: any) {
    assert('BalloonLoan', 'Exception handling', false, e.message);
  }

  // 95. HELOC Payment
  try {
    const helocRes = calculateHelocPayment({ creditLineAmount: 100000, drawAmount: 50000, interestRate: 8.0, drawPeriodYears: 10, repaymentPeriodYears: 20 });
    assert('HelocPayment', 'Draw payment lower than repay payment', helocRes.drawPeriodMonthlyPayment < helocRes.repaymentPeriodMonthlyPayment);
    assert('HelocPayment', 'Total cost of borrowing exceeds drawn principal', helocRes.totalCostOfCredit > 50000);
  } catch (e: any) {
    assert('HelocPayment', 'Exception handling', false, e.message);
  }

  // 96. Bi-Weekly Mortgage
  try {
    const biweekRes = calculateBiweeklyMortgage({ loanAmount: 300000, interestRate: 6.5, loanTermYears: 30 });
    assert('BiweeklyMortgage', 'Interest saved is positive', biweekRes.interestSaved > 0);
    assert('BiweeklyMortgage', 'Years saved is between 4 and 7 years', biweekRes.yearsSaved >= 4 && biweekRes.yearsSaved <= 7);
  } catch (e: any) {
    assert('BiweeklyMortgage', 'Exception handling', false, e.message);
  }

  // 97. CAPM
  try {
    const capmRes = calculateCapm({ riskFreeRatePercent: 4.0, beta: 1.2, expectedMarketReturnPercent: 10.0 });
    assert('Capm', 'Expected return is 11.2%', Math.abs(capmRes.expectedReturnPercent - 11.2) < 0.05);
    assert('Capm', 'Market risk premium is 6.0%', capmRes.equityRiskPremiumPercent === 6.0);
  } catch (e: any) {
    assert('Capm', 'Exception handling', false, e.message);
  }

  // 98. Dividend Payout Ratio
  try {
    const dprRes = calculateDividendPayoutRatio({ dividendPerShare: 3.0, earningsPerShare: 6.0 });
    assert('DividendPayoutRatio', 'Payout ratio is exactly 50%', dprRes.payoutRatioPercent === 50);
    assert('DividendPayoutRatio', 'Retention ratio is 50%', dprRes.retentionRatioPercent === 50);
  } catch (e: any) {
    assert('DividendPayoutRatio', 'Exception handling', false, e.message);
  }

  // 99. Portfolio Rebalancing
  try {
    const rebRes = calculatePortfolioRebalancing({
      holdings: [
        { name: 'Stocks', currentValue: 70, targetPercent: 60 },
        { name: 'Bonds', currentValue: 30, targetPercent: 40 },
      ],
    });
    assert('PortfolioRebalancing', 'Rebalance actions generated', rebRes.actions.length === 2);
    assert('PortfolioRebalancing', 'Stocks trigger sell order', rebRes.actions.find(a => a.name === 'Stocks')?.action === 'SELL');
  } catch (e: any) {
    assert('PortfolioRebalancing', 'Exception handling', false, e.message);
  }

  // 100. WACC
  try {
    const waccRes = calculateWacc({ equityMarketValue: 80, debtMarketValue: 20, costOfEquityPercent: 10, costOfDebtPercent: 5, corporateTaxRatePercent: 20 });
    assert('WACC', 'Equity weight is 80%', waccRes.equityWeightPercent === 80);
    assert('WACC', 'WACC computed correctly (8.8%)', Math.abs(waccRes.waccPercent - 8.8) < 0.1);
  } catch (e: any) {
    assert('WACC', 'Exception handling', false, e.message);
  }

  // 101. CD Ladder
  try {
    const cdRes = calculateCdLadder({ totalInvestment: 50000, baseApyPercent: 5.0, rungCount: 5 });
    assert('CdLadder', 'Rungs count matches 5', cdRes.rungs.length === 5);
    assert('CdLadder', 'Weighted APY exceeds base APY', cdRes.averageWeightedApyPercent >= 5.0);
  } catch (e: any) {
    assert('CdLadder', 'Exception handling', false, e.message);
  }

  // 102. College Savings
  try {
    const colRes = calculateCollegeSavings({ childCurrentAge: 4, collegeStartAge: 18, currentAnnualCollegeCost: 30000, currentSavings: 5000 });
    assert('CollegeSavings', 'Monthly required contribution positive', colRes.monthlyContributionRequired > 0);
    assert('CollegeSavings', 'Future total tuition exceeds today cost', colRes.projectedTotalCollegeCost > 120000);
  } catch (e: any) {
    assert('CollegeSavings', 'Exception handling', false, e.message);
  }

  // 103. High Yield Savings (HYSA)
  try {
    const hysaRes = calculateHighYieldSavings({ initialDeposit: 10000, monthlyDeposit: 100, highYieldApyPercent: 5.0, traditionalBankApyPercent: 0.01, years: 2 });
    assert('HighYieldSavings', 'HYSA interest vastly exceeds traditional', hysaRes.highYieldTotalInterest > hysaRes.traditionalTotalInterest * 50);
    assert('HighYieldSavings', 'Multiplier gain positive', hysaRes.multiplierGain > 10);
  } catch (e: any) {
    assert('HighYieldSavings', 'Exception handling', false, e.message);
  }

  // 104. Working Capital
  try {
    const wkRes = calculateWorkingCapital({ cashAndEquivalents: 50000, accountsReceivable: 30000, inventory: 20000, accountsPayable: 40000, shortTermDebt: 10000 });
    assert('WorkingCapital', 'Working capital is $50,000', wkRes.workingCapital === 50000);
    assert('WorkingCapital', 'Current ratio is 2.0x', wkRes.currentRatio === 2.0);
  } catch (e: any) {
    assert('WorkingCapital', 'Exception handling', false, e.message);
  }

  // 105. Sales Tax
  try {
    const taxAdd = calculateSalesTax({ mode: 'add-tax', amount: 100, salesTaxPercent: 8 });
    assert('SalesTax', 'Add-tax total is $108', taxAdd.totalWithTax === 108 && taxAdd.taxAmount === 8);
    const taxRev = calculateSalesTax({ mode: 'reverse-tax', amount: 108, salesTaxPercent: 8 });
    assert('SalesTax', 'Reverse-tax pre-tax is $100', Math.abs(taxRev.preTaxAmount - 100) < 0.01);
  } catch (e: any) {
    assert('SalesTax', 'Exception handling', false, e.message);
  }

  return results;
}
