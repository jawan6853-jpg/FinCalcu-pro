import { ToolItem } from '../types';

export const BATCH_6_TOOLS: ToolItem[] = [
  // 1. CRYPTO IMPERMANENT LOSS
  {
    id: 'crypto-impermanent-loss-calculator',
    name: 'Crypto Impermanent Loss Calculator',
    slug: 'crypto-impermanent-loss-calculator',
    route: '/calculators/crypto-impermanent-loss-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Calculate AMM liquidity pool impermanent loss and compare LP yield against HODLing.',
    description: 'Determine exact impermanent loss incurred when providing liquidity to decentralized exchange (DEX) automated market maker (AMM) pools (such as Uniswap, PancakeSwap, or Raydium) versus holding assets outside the pool.',
    icon: 'RefreshCw',
    keywords: ['impermanent loss calculator', 'crypto impermanent loss', 'dex lp calculator', 'amm liquidity pool loss', 'uniswap impermanent loss', 'yield farming loss'],
    featured: true,
    relatedTools: ['crypto-profit', 'staking', 'crypto-break-even-roi-calculator'],
    formulaSummary: 'IL = 2 × (sqrt(k) / (1 + k)) - 1, where k = P_final / P_initial',
    formulaDetails: [
      'Price Ratio (k) = (Token A Final / Initial) ÷ (Token B Final / Initial)',
      'Impermanent Loss = 2 × √k ÷ (1 + k) - 1',
      'HODL Value = 0.5 × Deposit × Ratio A + 0.5 × Deposit × Ratio B',
      'Pool Value = HODL Value × (1 + IL)',
      'Dollar Loss = HODL Value - Pool Value',
    ],
    exampleCalculation: {
      title: 'Example: ETH/USDC Pool with 2x ETH Price Appreciation',
      description: 'Depositing $1,000 into an ETH/USDC 50/50 liquidity pool when ETH is $2,000, and ETH rises to $4,000.',
      inputs: {
        'Token A Initial Price': '$2,000.00',
        'Token A Final Price': '$4,000.00',
        'Token B (USDC)': '$1.00',
        'Deposit Amount': '$1,000.00',
      },
      outputs: {
        'HODL Value': '$1,500.00',
        'LP Pool Value': '$1,414.21',
        'Impermanent Loss': '-5.72%',
        'Opportunity Loss': '-$85.79',
      },
    },
    faqs: [
      {
        question: 'What is Impermanent Loss in DeFi?',
        answer: 'Impermanent loss occurs when the price ratio of paired tokens in an automated market maker (AMM) changes relative to when you deposited them. Because the pool continuously rebalances via arbitrage, you end up holding less of the appreciating token.',
      },
      {
        question: 'Can trading fees overcome impermanent loss?',
        answer: 'Yes. If the trading volume in the liquidity pool generates LP swap fees greater than the impermanent loss percentage over your holding period, your net return will be positive.',
      },
      {
        question: 'When does impermanent loss become permanent?',
        answer: 'The loss is theoretical while funds remain in the pool. It becomes realized and permanent the moment you withdraw your LP tokens and remove your liquidity.',
      },
    ],
  },

  // 2. CRYPTO APY TO APR
  {
    id: 'crypto-apy-to-apr-calculator',
    name: 'Crypto Staking APY to APR Converter',
    slug: 'crypto-apy-to-apr-calculator',
    route: '/calculators/crypto-apy-to-apr-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Convert staking APY to APR (and APR to APY) with daily, weekly, or continuous compounding.',
    description: 'Convert advertised cryptocurrency staking and yield farming APYs to nominal APRs to evaluate true compounding velocity and daily staking reward cash flow.',
    icon: 'Percent',
    keywords: ['apy to apr crypto', 'staking apy calculator', 'crypto apr to apy', 'staking yield converter', 'defi apr calculator'],
    featured: false,
    relatedTools: ['staking', 'crypto-compound', 'crypto-compound-growth-calculator'],
    formulaSummary: 'APR = n × ((1 + APY)^(1/n) - 1) | APY = (1 + APR/n)^n - 1',
    formulaDetails: [
      'APY to APR: APR = n × ((1 + APY)^(1/n) - 1)',
      'APR to APY: APY = (1 + APR/n)^n - 1',
      'Daily Compounding Frequency (n) = 365 periods per year',
      'Continuous Compounding: APR = ln(1 + APY)',
      'Daily Net Payout = Total Annual Staking Reward ÷ 365',
    ],
    exampleCalculation: {
      title: 'Example: Converting 15% Daily Compounding APY to Base APR',
      description: 'Evaluating a DeFi liquidity farm offering 15% APY compounded daily on $10,000 staked.',
      inputs: {
        'Advertised APY': '15.00%',
        'Compounding Frequency': 'Daily (365/yr)',
        'Staked Capital': '$10,000.00',
      },
      outputs: {
        'Nominal APR': '13.98%',
        'Annual Net Reward': '$1,500.00',
        'Daily Reward Yield': '$4.11',
        'Compounding Boost': '+1.02%',
      },
    },
    faqs: [
      {
        question: 'Why is APY higher than APR in crypto staking?',
        answer: 'APR represents the simple annual interest rate without compounding. APY factors in the effect of automatically reinvesting (auto-compounding) your earned tokens over the course of the year.',
      },
      {
        question: 'Which rate do DeFi protocols usually advertise?',
        answer: 'Most DeFi protocols advertise APY because compounding yields produce an eye-catching higher percentage. This calculator helps you see the actual baseline rate you receive before compounding.',
      },
    ],
  },

  // 3. CRYPTO MINING PROFITABILITY
  {
    id: 'crypto-mining-profitability-calculator',
    name: 'Crypto Mining Profitability Calculator',
    slug: 'crypto-mining-profitability-calculator',
    route: '/calculators/crypto-mining-profitability-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Calculate ASIC & GPU crypto mining net profits, power consumption costs, and hardware payoff days.',
    description: 'Calculate cryptocurrency mining revenue, daily electricity utility costs, pool commission deductions, and estimated hardware breakeven timelines.',
    icon: 'Cpu',
    keywords: ['crypto mining calculator', 'bitcoin mining profit', 'mining profitability calculator', 'asic miner roi', 'mining electricity cost'],
    featured: false,
    relatedTools: ['crypto-profit', 'crypto-break-even-roi-calculator'],
    formulaSummary: 'Daily Profit = (Hashrate × Daily Rev/TH) - Daily Pool Fee - Daily Power Cost',
    formulaDetails: [
      'Daily Power Consumption (kWh) = (Watts × 24) ÷ 1,000',
      'Daily Electricity Cost = Daily kWh × Utility $/kWh',
      'Gross Revenue = Hashrate (TH/s) × Revenue per TH/s',
      'Daily Net Profit = Gross Revenue - Pool Fee - Electricity Cost',
      'Payback Days = Hardware Price ÷ Daily Net Profit',
    ],
    exampleCalculation: {
      title: 'Example: 120 TH/s ASIC Rig at $0.06/kWh',
      description: 'Operating a 3,300 Watt ASIC mining unit costing $2,800 on an industrial power rate.',
      inputs: {
        'Hashrate': '120 TH/s',
        'Power Consumption': '3,300 Watts',
        'Power Rate': '$0.06 / kWh',
        'Pool Fee': '2.0%',
        'Hardware Cost': '$2,800.00',
      },
      outputs: {
        'Daily Revenue': '$10.20',
        'Daily Electricity Cost': '$4.75',
        'Daily Net Profit': '+$5.25',
        'Monthly Net Profit': '+$159.60',
        'Hardware Breakeven': '534 Days',
      },
    },
    faqs: [
      {
        question: 'What is the most critical factor in crypto mining profitability?',
        answer: 'Electricity cost per kilowatt-hour ($/kWh) is by far the most decisive variable. While coin prices and network difficulties change constantly, your power bill remains a fixed recurring operating expenditure.',
      },
      {
        question: 'How does network mining difficulty affect this calculation?',
        answer: 'As more miners join the blockchain network, total difficulty rises, reducing the quantity of native coins minted per Terahash (TH/s).',
      },
    ],
  },

  // 4. BALLOON PAYMENT LOAN
  {
    id: 'balloon-loan-calculator',
    name: 'Balloon Payment Loan Calculator',
    slug: 'balloon-loan-calculator',
    route: '/calculators/balloon-loan-calculator',
    category: 'loans',
    categoryLabel: 'Loans & Mortgages',
    shortDescription: 'Calculate monthly payments and the final lump-sum balloon payoff due at maturity.',
    description: 'Model balloon loan structures where monthly installments are amortized over a longer term (e.g. 30 years) but the remaining principal balance matures early as a final lump-sum payment.',
    icon: 'Landmark',
    keywords: ['balloon loan calculator', 'balloon payment mortgage', 'balloon loan amortization', 'commercial balloon loan calculator', 'balloon payment calculation'],
    featured: false,
    relatedTools: ['loan-emi', 'mortgage', 'amortization-schedule-calculator'],
    formulaSummary: 'Monthly Payment amortized over term N; Lump-Sum Balloon = Remaining Balance at maturity M',
    formulaDetails: [
      'Standard Payment = P × [r(1+r)^N] ÷ [(1+r)^N - 1]',
      'Amortize through balloon period M months',
      'Balloon Payment = Remaining Principal Balance at month M',
      'Total Paid = (Payment × M) + Balloon Payment',
    ],
    exampleCalculation: {
      title: 'Example: $250k Commercial Loan with 7-Year Balloon',
      description: '30-year amortization schedule with a mandatory balloon payoff at year 7.',
      inputs: {
        'Loan Amount': '$250,000.00',
        'Annual Interest Rate': '6.50%',
        'Amortization Term': '30 Years',
        'Balloon Maturity': '7 Years',
      },
      outputs: {
        'Monthly Payment': '$1,580.17',
        'Total Paid in 7 Years': '$132,734.28',
        'Lump-Sum Balloon Due': '$227,109.84',
        'Total Cost of Credit': '$359,844.12',
      },
    },
    faqs: [
      {
        question: 'What is a balloon payment loan?',
        answer: 'A balloon loan has lower monthly payments because it is calculated on a 20- or 30-year amortization term, but requires the entire unpaid principal balance to be paid in full after a short window (typically 5 to 7 years).',
      },
      {
        question: 'How do borrowers typically pay off a balloon payment?',
        answer: 'Borrowers usually refinance the remaining balance into a traditional long-term loan, sell the underlying asset, or pay off the lump-sum using accumulated cash reserves.',
      },
    ],
  },

  // 5. HELOC PAYMENT CALCULATOR
  {
    id: 'heloc-payment-calculator',
    name: 'HELOC Payment Calculator',
    slug: 'heloc-payment-calculator',
    route: '/calculators/heloc-payment-calculator',
    category: 'loans',
    categoryLabel: 'Loans & Mortgages',
    shortDescription: 'Calculate Home Equity Line of Credit interest-only draw and amortized repayment payments.',
    description: 'Calculate your monthly payments during both the interest-only draw phase and the principal-and-interest repayment phase of a Home Equity Line of Credit (HELOC).',
    icon: 'Home',
    keywords: ['heloc payment calculator', 'home equity line of credit calculator', 'heloc draw period payment', 'heloc repayment calculator', 'heloc interest only'],
    featured: false,
    relatedTools: ['mortgage', 'loan-emi', 'mortgage-affordability-calculator'],
    formulaSummary: 'Draw Phase = Balance × (Rate ÷ 12) | Repay Phase = Amortized P&I over Repayment Term',
    formulaDetails: [
      'Draw Period Payment (Interest Only) = Draw Balance × (Annual Rate ÷ 12)',
      'Repayment Period Payment = Fully amortizing payment over repayment tenure',
      'Total HELOC Cost = Principal Drawn + Draw Period Interest + Repayment Period Interest',
    ],
    exampleCalculation: {
      title: 'Example: $60,000 HELOC at 8.5% Interest Rate',
      description: '10-year interest-only draw window followed by 20-year fully amortized repayment.',
      inputs: {
        'Credit Line': '$100,000.00',
        'Draw Amount': '$60,000.00',
        'Interest Rate': '8.50%',
        'Draw Period': '10 Years',
        'Repayment Period': '20 Years',
      },
      outputs: {
        'Draw Phase Monthly Payment': '$425.00',
        'Repayment Phase Monthly Payment': '$520.69',
        'Total Interest Paid': '$115,965.60',
        'Total Cost of Borrowing': '$175,965.60',
      },
    },
    faqs: [
      {
        question: 'Why do HELOC payments jump dramatically after the draw period?',
        answer: 'During the draw period (usually 10 years), borrowers only pay interest on the borrowed funds. Once the repayment phase begins, you must pay both principal reduction and ongoing interest, which significantly increases the monthly installment.',
      },
    ],
  },

  // 6. BI-WEEKLY MORTGAGE CALCULATOR
  {
    id: 'biweekly-mortgage-calculator',
    name: 'Bi-Weekly Mortgage Payment Calculator',
    slug: 'biweekly-mortgage-calculator',
    route: '/calculators/biweekly-mortgage-calculator',
    category: 'loans',
    categoryLabel: 'Loans & Mortgages',
    shortDescription: 'Calculate years and interest saved by paying half your mortgage every two weeks.',
    description: 'Discover how making 26 bi-weekly half-payments (equivalent to 13 monthly payments annually) accelerates mortgage amortization, saves tens of thousands in interest, and shaves years off your payoff date.',
    icon: 'Calendar',
    keywords: ['biweekly mortgage calculator', 'bi-weekly mortgage payment', 'biweekly loan calculator', 'accelerated biweekly mortgage', 'save interest mortgage'],
    featured: true,
    relatedTools: ['mortgage', 'extra-payment-calculator', 'amortization-schedule-calculator'],
    formulaSummary: '26 Bi-Weekly Half-Payments = 13 Monthly Payments Per Year',
    formulaDetails: [
      'Standard Monthly Payment = M',
      'Bi-Weekly Payment = M ÷ 2 (paid 26 times annually)',
      'Equivalent Monthly Payments per year = 26 ÷ 2 = 13 payments (1 extra payment yearly)',
      'Accelerated Amortization reduces principal balance every 14 days',
    ],
    exampleCalculation: {
      title: 'Example: $350,000 30-Year Mortgage at 6.75%',
      description: 'Comparing traditional 12 monthly payments versus 26 bi-weekly half-payments.',
      inputs: {
        'Loan Amount': '$350,000.00',
        'Interest Rate': '6.75%',
        'Loan Term': '30 Years',
      },
      outputs: {
        'Standard Monthly Payment': '$2,269.96',
        'Bi-Weekly Payment': '$1,134.98',
        'Interest Saved': '$91,840.12',
        'Time Saved': '5.2 Years Off Loan',
        'New Payoff Timeline': '24.8 Years',
      },
    },
    faqs: [
      {
        question: 'What is the secret behind bi-weekly mortgage savings?',
        answer: 'There are 52 weeks in a year, which means 26 bi-weekly periods. Paying half of your monthly mortgage every two weeks results in 26 half-payments, which equals 13 full payments each year instead of 12. That extra payment goes directly toward reducing principal.',
      },
    ],
  },

  // 7. CAPM CALCULATOR
  {
    id: 'capm-calculator',
    name: 'CAPM Expected Return Calculator',
    slug: 'capm-calculator',
    route: '/calculators/capm-calculator',
    category: 'investment',
    categoryLabel: 'Investment & Equity',
    shortDescription: 'Calculate theoretical expected stock return and cost of equity using the Capital Asset Pricing Model.',
    description: 'Calculate the theoretical required return of a security or investment asset based on its systematic market risk (Beta), the risk-free rate, and the overall equity market risk premium.',
    icon: 'TrendingUp',
    keywords: ['capm calculator', 'capital asset pricing model', 'expected return calculator', 'beta expected return', 'cost of equity capm'],
    featured: false,
    relatedTools: ['cagr', 'investment-return', 'wacc-calculator'],
    formulaSummary: 'Expected Return E(R) = Rf + Beta × [E(Rm) - Rf]',
    formulaDetails: [
      'Risk-Free Rate (Rf) = Yield on 10-Year Government Benchmark Treasury',
      'Market Risk Premium = Expected Market Return E(Rm) - Rf',
      'Asset Risk Premium = Beta × Market Risk Premium',
      'CAPM Expected Return = Rf + (Beta × Market Risk Premium)',
    ],
    exampleCalculation: {
      title: 'Example: Tech Equity with Beta of 1.35',
      description: 'Evaluating cost of equity with 4.25% 10-year treasury yield and 10.0% expected S&P 500 market return.',
      inputs: {
        'Risk-Free Rate (Rf)': '4.25%',
        'Beta': '1.35',
        'Market Return E(Rm)': '10.00%',
      },
      outputs: {
        'Market Risk Premium': '5.75%',
        'Asset Risk Premium': '7.76%',
        'Expected Return E(R)': '12.01%',
        'Systematic Risk Tier': 'Aggressive / High Beta',
      },
    },
    faqs: [
      {
        question: 'What does Beta measure in the CAPM formula?',
        answer: 'Beta measures a stock’s sensitivity and volatility relative to the broad market index. A Beta of 1.0 means the stock moves identically with the market; Beta > 1.0 means it fluctuates with higher amplitude; Beta < 1.0 signifies lower systematic volatility.',
      },
    ],
  },

  // 8. DIVIDEND PAYOUT RATIO
  {
    id: 'dividend-payout-ratio-calculator',
    name: 'Dividend Payout Ratio Calculator',
    slug: 'dividend-payout-ratio-calculator',
    route: '/calculators/dividend-payout-ratio-calculator',
    category: 'investment',
    categoryLabel: 'Investment & Equity',
    shortDescription: 'Calculate dividend payout ratio and assess dividend safety and reinvestment retention rate.',
    description: 'Assess whether a company’s dividend distribution is sustainable or at risk of dividend cuts by calculating the percentage of net corporate earnings paid out to shareholders.',
    icon: 'PieChart',
    keywords: ['dividend payout ratio calculator', 'dividend safety calculator', 'dps to eps ratio', 'retention ratio calculator', 'dividend sustainability'],
    featured: false,
    relatedTools: ['dividend', 'dividend-reinvestment-calculator', 'pe-ratio-calculator'],
    formulaSummary: 'Payout Ratio = (DPS ÷ EPS) × 100 | Retention Ratio = 100% - Payout Ratio',
    formulaDetails: [
      'Payout Ratio (%) = (Dividend Per Share ÷ Earnings Per Share) × 100',
      'Retention Ratio (%) = 100% - Payout Ratio',
      'Extremely Safe: <35% | Healthy: 35%-60% | Cautionary: 60%-85% | Unsustainable: >85%',
    ],
    exampleCalculation: {
      title: 'Example: Consumer Dividend Stock ($3.50 DPS on $7.00 EPS)',
      description: 'Determining dividend coverage and corporate earnings retention cushion.',
      inputs: {
        'Dividend Per Share (DPS)': '$3.50',
        'Earnings Per Share (EPS)': '$7.00',
      },
      outputs: {
        'Dividend Payout Ratio': '50.00%',
        'Retention Ratio': '50.00%',
        'Safety Score': 'Healthy & Sustainable (35%-60%)',
        'Coverage Multiple': '2.0x Coverage',
      },
    },
    faqs: [
      {
        question: 'Why is a 100%+ dividend payout ratio dangerous?',
        answer: 'When a payout ratio exceeds 100%, the company is paying out more in dividends than it earns in net profit. The dividend must be financed through cash reserves, debt issuance, or capital asset liquidations, signaling high risk of an imminent dividend cut.',
      },
    ],
  },

  // 9. PORTFOLIO REBALANCING
  {
    id: 'portfolio-rebalancing-calculator',
    name: 'Portfolio Rebalancing Calculator',
    slug: 'portfolio-rebalancing-calculator',
    route: '/calculators/portfolio-rebalancing-calculator',
    category: 'investment',
    categoryLabel: 'Investment & Equity',
    shortDescription: 'Calculate buy and sell trade orders to realign your asset allocation to target percentages.',
    description: 'Determine exact buy and sell dollar amounts required across stocks, bonds, cash, and crypto to eliminate allocation drift and reset your portfolio back to target weightings.',
    icon: 'Layers',
    keywords: ['portfolio rebalancing calculator', 'rebalance portfolio', 'asset allocation rebalance', 'portfolio drift calculator', 'investment rebalancer'],
    featured: false,
    relatedTools: ['asset-allocation-calculator', 'net-worth-calculator', 'investment-return'],
    formulaSummary: 'Target Dollars = Total Portfolio × Target Weight % | Adjustment = Target - Current',
    formulaDetails: [
      'Total Value = Sum of current holdings + New cash deposit',
      'Target Allocation ($) = Total Value × Target Percentage',
      'Adjustment ($) = Target Allocation - Current Value',
      'If Adjustment > 0: BUY order | If Adjustment < 0: SELL order',
    ],
    exampleCalculation: {
      title: 'Example: Rebalancing a $100,000 Multi-Asset Portfolio',
      description: 'Realigning drifted stock and bond positions back to a 60/30/10 target allocation.',
      inputs: {
        'US Equities': '$72,000 (Target 60%)',
        'Fixed Income': '$22,000 (Target 30%)',
        'Alternatives/Crypto': '$6,000 (Target 10%)',
        'New Cash': '$0.00',
      },
      outputs: {
        'US Equities Order': 'SELL $12,000.00',
        'Fixed Income Order': 'BUY $8,000.00',
        'Alternatives Order': 'BUY $4,000.00',
        'Maximum Drift': '12.00%',
      },
    },
    faqs: [
      {
        question: 'How often should an investor rebalance their portfolio?',
        answer: 'Common institutional approaches include calendar rebalancing (once annually or semi-annually) or threshold-based rebalancing (whenever an asset class drifts more than 5% away from its target weighting).',
      },
    ],
  },

  // 10. WACC CALCULATOR
  {
    id: 'wacc-calculator',
    name: 'WACC Calculator (Weighted Average Cost of Capital)',
    slug: 'wacc-calculator',
    route: '/calculators/wacc-calculator',
    category: 'investment',
    categoryLabel: 'Investment & Equity',
    shortDescription: 'Calculate composite corporate hurdle rate blending equity cost and after-tax debt cost.',
    description: 'Calculate a company’s Weighted Average Cost of Capital (WACC), which represents the minimum required rate of return necessary to satisfy both equity shareholders and debt debenture holders.',
    icon: 'Building2',
    keywords: ['wacc calculator', 'weighted average cost of capital', 'corporate hurdle rate', 'cost of capital calculator', 'wacc formula'],
    featured: false,
    relatedTools: ['capm-calculator', 'npv-calculator', 'irr-calculator'],
    formulaSummary: 'WACC = (E/V × Re) + (D/V × Rd × (1 - Tc))',
    formulaDetails: [
      'Total Firm Capital (V) = Equity Value (E) + Debt Value (D)',
      'Equity Weight = E ÷ V | Debt Weight = D ÷ V',
      'After-Tax Cost of Debt = Rd × (1 - Corporate Tax Rate Tc)',
      'WACC = (Equity Weight × Cost of Equity) + (Debt Weight × After-Tax Cost of Debt)',
    ],
    exampleCalculation: {
      title: 'Example: Enterprise with $8M Equity & $2M Debt',
      description: 'Cost of Equity 11.0%, Pre-tax Cost of Debt 6.0%, and 21.0% Federal Corporate Tax Rate.',
      inputs: {
        'Equity Market Value (E)': '$8,000,000.00',
        'Debt Market Value (D)': '$2,000,000.00',
        'Cost of Equity (Re)': '11.00%',
        'Cost of Debt (Rd)': '6.00%',
        'Tax Rate (Tc)': '21.00%',
      },
      outputs: {
        'Equity Weight': '80.00%',
        'Debt Weight': '20.00%',
        'After-Tax Debt Cost': '4.74%',
        'Composite WACC': '9.75%',
      },
    },
    faqs: [
      {
        question: 'Why does corporate debt have a tax shield in the WACC formula?',
        answer: 'Interest payments made on corporate debt obligations are typically tax-deductible expenses under most global tax codes. This tax deduction reduces the effective net cost of borrowing debt relative to equity.',
      },
    ],
  },

  // 11. CD LADDER CALCULATOR
  {
    id: 'cd-ladder-calculator',
    name: 'CD Ladder Calculator',
    slug: 'cd-ladder-calculator',
    route: '/calculators/cd-ladder-calculator',
    category: 'savings',
    categoryLabel: 'Savings & Goals',
    shortDescription: 'Build a Certificate of Deposit ladder to maximize APY yield while maintaining periodic liquidity.',
    description: 'Optimize cash savings by staggering fixed deposits across multiple CD maturity terms (e.g. 1, 2, 3, 4, and 5 years) to lock in higher long-term interest rates while having funds mature every 12 months.',
    icon: 'TrendingUp',
    keywords: ['cd ladder calculator', 'certificate of deposit ladder', 'cd interest calculator', 'staggered cd strategy', 'cd maturity schedule'],
    featured: false,
    relatedTools: ['savings', 'savings-interest-calculator', 'compound-interest'],
    formulaSummary: 'Divide capital evenly across N maturities; Compound interest A = P(1 + r)^t per rung',
    formulaDetails: [
      'Deposit Per Rung = Total Capital ÷ Number of Rungs',
      'Rung Interest = P × (1 + APY)^Years - P',
      'Weighted APY = Sum of (Deposit × APY) ÷ Total Investment',
      'Liquidity Frequency = Rung maturity interval',
    ],
    exampleCalculation: {
      title: 'Example: $50,000 5-Year CD Ladder Strategy',
      description: 'Dividing $50k into five $10k tranches from 1 to 5 years starting at 4.75% baseline APY.',
      inputs: {
        'Total Investment': '$50,000.00',
        'Base APY': '4.75%',
        'Number of Rungs': '5 Rungs (1 to 5 Yrs)',
      },
      outputs: {
        'Per-Rung Deposit': '$10,000.00',
        'Weighted Average APY': '5.05%',
        'First Cycle Total Interest': '$7,842.19',
        'Annual Liquidity': '$10,000 + Interest every 12 Months',
      },
    },
    faqs: [
      {
        question: 'What is the primary advantage of a CD ladder?',
        answer: 'A CD ladder combines the higher interest rates of long-term CDs with regular cash liquidity. Instead of locking all your money away for 5 years, one CD matures every year, providing cash if you need it or the opportunity to roll it into a new 5-year CD at prevailing rates.',
      },
    ],
  },

  // 12. COLLEGE SAVINGS CALCULATOR
  {
    id: 'college-savings-calculator',
    name: 'College Education Savings Calculator',
    slug: 'college-savings-calculator',
    route: '/calculators/college-savings-calculator',
    category: 'savings',
    categoryLabel: 'Savings & Goals',
    shortDescription: 'Calculate future college tuition costs with inflation and determine required monthly 529 savings.',
    description: 'Forecast the future cost of higher education accounting for historical tuition inflation, and calculate the exact monthly contribution needed to fully fund your child’s degree.',
    icon: 'GraduationCap',
    keywords: ['college savings calculator', '529 college calculator', 'tuition inflation calculator', 'education fund calculator', 'college cost projection'],
    featured: false,
    relatedTools: ['savings-goal-calculator', 'compound-interest', 'investment-return'],
    formulaSummary: 'Future Tuition = Current Cost × (1 + Inflation)^Years | Sinking Fund Payment PMT',
    formulaDetails: [
      'Years Until College = College Start Age - Child Current Age',
      'Inflated 4-Year Tuition = Sum of annual college cost inflated over 4 academic years',
      'Future Value of Current Savings = Present Savings × (1 + Return)^Years',
      'Monthly Target = Sinking fund payment to bridge remaining funding deficit',
    ],
    exampleCalculation: {
      title: 'Example: Newborn Baby Saving for 4-Year University',
      description: 'Child age 2 enrolling at age 18; current tuition $35k/year with 4.5% inflation and 7% investment return.',
      inputs: {
        'Child Current Age': '2 Years Old',
        'College Start Age': '18 Years Old',
        'Current Annual Cost': '$35,000.00',
        'Tuition Inflation': '4.50%',
        'Current 529 Balance': '$8,000.00',
        'Expected Return': '7.00%',
      },
      outputs: {
        'Total Future 4-Yr Tuition': '$306,420.15',
        'Future Value of Current Balance': '$23,618.22',
        'Required Monthly Contribution': '$734.18 / Month',
      },
    },
    faqs: [
      {
        question: 'Why does college tuition inflate faster than general CPI?',
        answer: 'Higher education costs have historically inflated at 4% to 6% annually—substantially faster than consumer price inflation—due to rising institutional administrative costs, campus facility enhancements, and technology infrastructure.',
      },
    ],
  },

  // 13. HIGH YIELD SAVINGS ACCOUNT (HYSA)
  {
    id: 'high-yield-savings-calculator',
    name: 'High-Yield Savings Account (HYSA) Calculator',
    slug: 'high-yield-savings-calculator',
    route: '/calculators/high-yield-savings-calculator',
    category: 'savings',
    categoryLabel: 'Savings & Goals',
    shortDescription: 'Calculate earnings from high-yield APY accounts and compare against traditional 0.01% bank rates.',
    description: 'Calculate the total interest generated by high-yield cash accounts and measure the opportunity cost of leaving idle deposits in traditional brick-and-mortar savings accounts.',
    icon: 'Wallet',
    keywords: ['hysa calculator', 'high yield savings calculator', 'high interest savings', 'hysa vs traditional savings', 'savings apy comparison'],
    featured: true,
    relatedTools: ['savings', 'savings-interest-calculator', 'emergency-fund-calculator'],
    formulaSummary: 'Balance = Principal × (1 + APY/12)^Months | Compare HYSA vs 0.01% Traditional Bank',
    formulaDetails: [
      'HYSA Monthly Compounding = (Balance + Monthly Deposit) × (1 + HYSA APY ÷ 12)',
      'Traditional Bank Compounding = (Balance + Monthly Deposit) × (1 + 0.01% ÷ 12)',
      'Opportunity Interest Gain = HYSA Total Interest - Traditional Total Interest',
    ],
    exampleCalculation: {
      title: 'Example: $25,000 Emergency Fund in 5.0% HYSA vs 0.01% Big Bank',
      description: 'Evaluating interest accumulation over a 3-year holding period with $200 monthly additions.',
      inputs: {
        'Initial Deposit': '$25,000.00',
        'Monthly Contribution': '$200.00',
        'HYSA APY': '5.00%',
        'Traditional Bank APY': '0.01%',
        'Time Horizon': '3 Years',
      },
      outputs: {
        'HYSA Ending Balance': '$36,548.12',
        'HYSA Interest Earned': '+$4,348.12',
        'Traditional Bank Interest': '+$8.15',
        'Additional Earnings': '+$4,339.97 (533x More)',
      },
    },
    faqs: [
      {
        question: 'Are High-Yield Savings Accounts FDIC Insured?',
        answer: 'Yes. Online banks and fintech providers offering High-Yield Savings Accounts carry standard FDIC insurance up to $250,000 per depositor, making them equally as safe as traditional brick-and-mortar banks.',
      },
    ],
  },

  // 14. WORKING CAPITAL & CURRENT RATIO
  {
    id: 'working-capital-calculator',
    name: 'Working Capital & Current Ratio Calculator',
    slug: 'working-capital-calculator',
    route: '/calculators/working-capital-calculator',
    category: 'finance',
    categoryLabel: 'Personal Finance & Wealth',
    shortDescription: 'Calculate net working capital, current ratio, and quick ratio to assess short-term solvency.',
    description: 'Measure commercial or personal short-term liquidity health by comparing current short-term assets (cash, receivables, inventory) against immediate liabilities (accounts payable, short-term debt).',
    icon: 'Briefcase',
    keywords: ['working capital calculator', 'current ratio calculator', 'quick ratio calculator', 'business liquidity calculator', 'net working capital'],
    featured: false,
    relatedTools: ['cash-flow-calculator', 'business-break-even-calculator', 'profit-margin-calculator'],
    formulaSummary: 'Working Capital = Current Assets - Current Liabilities | Current Ratio = Assets ÷ Liabilities',
    formulaDetails: [
      'Total Current Assets = Cash + Accounts Receivable + Inventory + Other Liquid Assets',
      'Total Current Liabilities = Accounts Payable + Short-Term Debt + Accrued Expenses',
      'Net Working Capital ($) = Current Assets - Current Liabilities',
      'Current Ratio = Current Assets ÷ Current Liabilities (Benchmark: 1.5x - 2.0x)',
      'Quick Ratio = (Cash + Accounts Receivable) ÷ Current Liabilities',
    ],
    exampleCalculation: {
      title: 'Example: Small Business Balance Sheet Liquidity Check',
      description: 'Evaluating corporate solvency with $180,000 current assets against $95,000 current liabilities.',
      inputs: {
        'Cash & Equivalents': '$75,000.00',
        'Accounts Receivable': '$65,000.00',
        'Inventory': '$40,000.00',
        'Accounts Payable': '$55,000.00',
        'Short-Term Debt': '$40,000.00',
      },
      outputs: {
        'Total Current Assets': '$180,000.00',
        'Total Current Liabilities': '$95,000.00',
        'Net Working Capital': '+$85,000.00',
        'Current Ratio': '1.89x (Adequate Liquidity)',
        'Quick Ratio': '1.47x (Strong Acid-Test)',
      },
    },
    faqs: [
      {
        question: 'What is considered a good Current Ratio?',
        answer: 'A current ratio between 1.5 and 2.0 is generally considered healthy. A ratio below 1.0 indicates that a business cannot cover its short-term liabilities with short-term assets, while a ratio above 3.0 may indicate inefficient cash deployment.',
      },
    ],
  },

  // 15. SALES TAX & REVERSE TAX
  {
    id: 'sales-tax-calculator',
    name: 'Sales Tax & Reverse Tax Calculator',
    slug: 'sales-tax-calculator',
    route: '/calculators/sales-tax-calculator',
    category: 'finance',
    categoryLabel: 'Personal Finance & Wealth',
    shortDescription: 'Calculate forward sales tax addition and reverse-extract pre-tax price from gross totals.',
    description: 'Calculate state and municipal sales tax additions on purchase prices, or reverse-calculate the pre-tax base price and tax portion embedded inside a gross receipts receipt.',
    icon: 'Receipt',
    keywords: ['sales tax calculator', 'reverse sales tax calculator', 'tax extraction calculator', 'pre tax price calculator', 'vat sales tax calculator'],
    featured: false,
    relatedTools: ['discount-calculator', 'salary-calculator', 'markup-calculator'],
    formulaSummary: 'Add Tax: Total = Price × (1 + r) | Reverse Tax: Base = Total ÷ (1 + r)',
    formulaDetails: [
      'Forward Mode: Tax Amount = Pre-Tax Price × (Sales Tax Rate ÷ 100)',
      'Forward Mode: Total Gross Price = Pre-Tax Price + Tax Amount',
      'Reverse Mode: Pre-Tax Base Price = Total Gross ÷ (1 + Sales Tax Rate ÷ 100)',
      'Reverse Mode: Extracted Tax Amount = Total Gross - Pre-Tax Base Price',
    ],
    exampleCalculation: {
      title: 'Example: Extracting Pre-Tax Price from an $850.00 Invoice',
      description: 'Reverse-calculating the net cost from a total bill with 8.25% sales tax included.',
      inputs: {
        'Mode': 'Reverse Tax (Extract Pre-Tax Base)',
        'Invoice Total': '$850.00',
        'Sales Tax Rate': '8.25%',
      },
      outputs: {
        'Pre-Tax Base Amount': '$785.22',
        'Sales Tax Embedded': '$64.78',
        'Total Gross Amount': '$850.00',
        'Effective Tax Rate': '8.25%',
      },
    },
    faqs: [
      {
        question: 'How do you reverse calculate sales tax from a total?',
        answer: 'To find the pre-tax price when tax is already included, divide the total by (1 + tax rate in decimal). For example, with an 8% tax rate, divide the total by 1.08.',
      },
    ],
  },
];
