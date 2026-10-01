import { ToolItem } from '../types';

export const BATCH_3_TOOLS: ToolItem[] = [
  // 1. BUDGET CALCULATOR
  {
    id: 'budget-calculator',
    name: 'Budget Calculator',
    slug: 'budget-calculator',
    route: '/calculators/budget-calculator',
    category: 'finance',
    categoryLabel: 'Personal Finance',
    shortDescription: 'Plan your monthly budget, track category expenses, and balance your cash flow.',
    description: 'Calculate monthly net cash flow, track expenses across housing, groceries, utilities, and discretionary spending, and evaluate alignment with the 50/30/20 budget framework.',
    icon: 'Landmark',
    keywords: [
      'budget calculator',
      'monthly budget calculator',
      'personal budget calculator',
      'budget planner',
      '50 30 20 budget calculator',
      'household budget',
    ],
    featured: true,
    relatedTools: ['savings-goal-calculator', 'emergency-fund-calculator', 'salary-calculator', 'take-home-pay-calculator'],
    formulaSummary: 'Remaining Balance = Total Income - Total Needs - Total Wants - Planned Savings',
    formulaDetails: [
      'Total Income = Primary Pay + Secondary / Side Income',
      'Needs (50% target) = Housing + Utilities + Groceries + Transport + Healthcare + Min Debts',
      'Wants (30% target) = Entertainment + Dining + Leisure + Miscellaneous',
      'Savings (20% target) = Emergency Fund + Retirement + Investing',
      'Remaining Surplus / Deficit = Total Income - (Expenses + Savings)',
    ],
    exampleCalculation: {
      title: 'Example: $6,100 Monthly Household Budget',
      description: 'Monthly income of $6,100 with $3,450 in living essentials, $550 in leisure, and $1,000 saved.',
      inputs: {
        'Monthly Income': '$6,100.00',
        'Needs (Housing, Bills, Food)': '$3,450.00',
        'Wants (Dining, Fun)': '$550.00',
        'Savings & Investing': '$1,000.00',
      },
      outputs: {
        'Remaining Surplus': '+$1,100.00',
        'Savings Rate': '16.4%',
        '50/30/20 Split': '56.6% Needs / 9.0% Wants / 34.4% Savings+Buffer',
      },
    },
    faqs: [
      {
        question: 'What is the 50/30/20 budgeting rule?',
        answer: 'The 50/30/20 rule is an intuitive budgeting guideline: allocate 50% of after-tax income to non-negotiable needs (housing, utilities, food), 30% to wants (entertainment, dining), and 20% to savings and debt reduction.',
      },
      {
        question: 'What should I do if my budget shows a deficit?',
        answer: 'A negative cash flow means you are spending more than you earn. Identify variable expenses in your "Wants" categories to trim, refinance high-interest debts, or explore secondary income streams.',
      },
    ],
  },

  // 2. SALARY CALCULATOR
  {
    id: 'salary-calculator',
    name: 'Salary Calculator',
    slug: 'salary-calculator',
    route: '/calculators/salary-calculator',
    category: 'finance',
    categoryLabel: 'Personal Finance',
    shortDescription: 'Convert hourly, weekly, and annual salary wages into estimated take-home pay.',
    description: 'Calculate your gross salary across annual, monthly, bi-weekly, weekly, and hourly pay schedules, factoring in estimated federal, state, FICA, and 401(k) deductions.',
    icon: 'TrendingUp',
    keywords: [
      'salary calculator',
      'paycheck calculator',
      'net salary calculator',
      'gross salary calculator',
      'hourly to salary calculator',
      'annual income calculator',
    ],
    featured: true,
    relatedTools: ['take-home-pay-calculator', 'budget-calculator', 'savings-goal-calculator'],
    formulaSummary: 'Net Annual Salary = Gross Salary - (Federal + State + FICA Taxes + Pre-Tax Benefits)',
    formulaDetails: [
      'Hourly to Annual = Hourly Rate × Hours per Week × 52 Weeks',
      'Bi-Weekly Gross = Gross Annual / 26; Monthly Gross = Gross Annual / 12',
      'FICA Tax = Social Security (6.2% up to wage base) + Medicare (1.45%)',
      'Net Pay = Gross - Taxes Withheld - Pre-tax Health/Retirement - Other Deductions',
    ],
    exampleCalculation: {
      title: 'Example: $75,000 Annual Salary',
      description: 'Single filer earning $75,000 annually with 5% 401(k) and 4.5% state income tax.',
      inputs: {
        'Gross Salary': '$75,000.00/yr',
        'Pay Frequency': 'Annual ($36.06/hr equivalent)',
        '401(k) Contribution': '5.00% ($3,750/yr)',
        'State Tax Rate': '4.50%',
      },
      outputs: {
        'Net Annual Take-Home': '$56,412.00',
        'Net Monthly Paycheck': '$4,701.00/mo',
        'Net Bi-Weekly Paycheck': '$2,169.69',
        'Effective Tax Rate': '17.8%',
      },
    },
    faqs: [
      {
        question: 'How is hourly pay converted to annual salary?',
        answer: 'Assuming a standard 40-hour full-time work week and 52 weeks per year (2,080 hours), multiply your hourly wage by 2,080. For example, $30/hour equates to $62,400 annually.',
      },
      {
        question: 'Why does my actual paycheck differ slightly from this estimate?',
        answer: 'Actual paycheck withholding varies by municipal city taxes, individual W-4 elections (dependents, deductions), pre-tax health insurance premiums, and flexible spending accounts.',
      },
    ],
  },

  // 3. TAKE-HOME PAY CALCULATOR
  {
    id: 'take-home-pay-calculator',
    name: 'Take-Home Pay Calculator',
    slug: 'take-home-pay-calculator',
    route: '/calculators/take-home-pay-calculator',
    category: 'finance',
    categoryLabel: 'Personal Finance',
    shortDescription: 'Calculate net paycheck cash deposits after payroll tax withholdings and deductions.',
    description: 'Determine your exact paycheck take-home cash deposit after federal tax withholding, state tax, Social Security, Medicare, and employer benefits.',
    icon: 'Landmark',
    keywords: [
      'take home pay calculator',
      'paycheck calculator',
      'net pay calculator',
      'take home salary calculator',
      'after tax income calculator',
    ],
    featured: true,
    relatedTools: ['salary-calculator', 'budget-calculator', 'emergency-fund-calculator'],
    formulaSummary: 'Take-Home Pay = Gross Pay - FICA - Federal Tax - State Tax - Pre-Tax - Post-Tax Deductions',
    formulaDetails: [
      'Taxable Wages = Gross Pay - Pre-Tax Deductions (401k, HSA, FSA)',
      'FICA Withholding = (Gross × 6.2% Social Security) + (Gross × 1.45% Medicare)',
      'Total Withholdings = Federal Tax + State Tax + FICA',
      'Net Take-Home = Gross - Total Withholdings - Pre-Tax - Post-Tax Deductions',
    ],
    exampleCalculation: {
      title: 'Example: $3,200 Bi-Weekly Paycheck',
      description: 'Gross pay of $3,200 every two weeks with $160 pre-tax 401(k) and 12% federal tax withholding.',
      inputs: {
        'Gross Paycheck': '$3,200.00',
        'Pay Frequency': 'Bi-Weekly (26 times/year)',
        'Pre-Tax 401(k)': '$160.00',
        'Federal Withholding': '12.00%',
      },
      outputs: {
        'Net Take-Home Pay': '$2,284.40',
        'Take-Home Ratio': '71.4%',
        'Total Taxes Withheld': '$730.60',
        'Annualized Net Pay': '$59,394.40/yr',
      },
    },
    faqs: [
      {
        question: 'What is the benefit of pre-tax deductions like 401(k) and HSA?',
        answer: 'Pre-tax deductions are subtracted from your gross wages before income taxes are calculated, lowering your overall taxable income and reducing the amount of federal and state taxes withheld.',
      },
      {
        question: 'How do payroll pay frequencies affect paycheck amounts?',
        answer: 'Bi-weekly pay schedules yield 26 paychecks per year (resulting in two "3-paycheck" months), whereas semi-monthly pay yields 24 equal paychecks (e.g. on the 15th and last day of each month).',
      },
    ],
  },

  // 4. SAVINGS GOAL CALCULATOR
  {
    id: 'savings-goal-calculator',
    name: 'Savings Goal Calculator',
    slug: 'savings-goal-calculator',
    route: '/calculators/savings-goal-calculator',
    category: 'savings',
    categoryLabel: 'Savings & Goals',
    shortDescription: 'Calculate required monthly contributions or time required to reach your target savings.',
    description: 'Determine how much you must deposit each month, or how many years it will take, to hit your personal savings target with compound interest factored in.',
    icon: 'PiggyBank',
    keywords: [
      'savings goal calculator',
      'savings calculator',
      'savings target calculator',
      'savings planner',
      'money goal calculator',
    ],
    featured: true,
    relatedTools: ['emergency-fund-calculator', 'budget-calculator', 'compound-interest-calculator', 'future-value-calculator'],
    formulaSummary: 'PMT = [Target - PV × (1 + r)^n] × [r / ((1 + r)^n - 1)]',
    formulaDetails: [
      'Monthly Rate (r) = Annual Yield / 12 / 100',
      'Future Value of Initial Principal = PV × (1 + r)^n',
      'Required Monthly Deposit = (Target - FV_PV) / [((1 + r)^n - 1) / r]',
      'Total Interest Earned = Target - (Initial Principal + Sum of Monthly Deposits)',
    ],
    exampleCalculation: {
      title: 'Example: $25,000 Down Payment Fund in 3 Years',
      description: 'Saving $25,000 in 3 years starting with $5,000 at 4.5% annual interest in a high-yield account.',
      inputs: {
        'Target Goal': '$25,000.00',
        'Starting Balance': '$5,000.00',
        'Time Horizon': '3 Years (36 Months)',
        'Annual Yield': '4.50%',
      },
      outputs: {
        'Required Monthly Deposit': '$493.89/mo',
        'Total Principal Contributed': '$22,780.04',
        'Interest Earned': '+$2,219.96',
        'Initial Progress': '20.0%',
      },
    },
    faqs: [
      {
        question: 'How does a High-Yield Savings Account (HYSA) speed up my goal?',
        answer: 'Standard traditional bank savings accounts often pay 0.01% interest, whereas modern HYSAs pay 4.0% to 5.0% APY. Over several years, compound interest can fund hundreds or thousands of dollars toward your target.',
      },
      {
        question: 'Can I calculate the time required if my monthly deposit is fixed?',
        answer: 'Yes, select "Find Time to Reach Goal" to enter your affordable monthly budget and compute the exact months and years needed to reach your savings target.',
      },
    ],
  },

  // 5. EMERGENCY FUND CALCULATOR
  {
    id: 'emergency-fund-calculator',
    name: 'Emergency Fund Calculator',
    slug: 'emergency-fund-calculator',
    route: '/calculators/emergency-fund-calculator',
    category: 'savings',
    categoryLabel: 'Savings & Goals',
    shortDescription: 'Calculate recommended emergency savings based on monthly living expenses and runway.',
    description: 'Calculate your ideal emergency fund safety cushion based on your monthly non-discretionary expenses (housing, food, healthcare, debt) and 3 to 12 months of coverage.',
    icon: 'ShieldCheck',
    keywords: [
      'emergency fund calculator',
      'emergency savings calculator',
      'emergency fund goal',
      'rainy day fund calculator',
      'safety net calculator',
    ],
    featured: true,
    relatedTools: ['savings-goal-calculator', 'budget-calculator', 'take-home-pay-calculator'],
    formulaSummary: 'Target Emergency Fund = Essential Monthly Living Expenses × Months of Coverage',
    formulaDetails: [
      'Monthly Essentials = Housing + Utilities + Groceries + Transport + Healthcare + Min Debt',
      'Target Cushion = Monthly Essentials × Selected Coverage (3, 6, 9, or 12 Months)',
      'Savings Shortfall = Target Fund - Current Cash Reserves',
      'Months to Fully Funded = Shortfall / Monthly Savings Contribution',
    ],
    exampleCalculation: {
      title: 'Example: 6-Month Emergency Safety Net',
      description: 'Monthly essential expenses of $3,250 with a target of 6 months and $8,000 already saved.',
      inputs: {
        'Monthly Essentials': '$3,250.00',
        'Target Coverage': '6 Months',
        'Current Savings': '$8,000.00',
        'Monthly Contribution': '$400.00/mo',
      },
      outputs: {
        'Target Emergency Fund': '$19,500.00',
        'Savings Shortfall': '$11,500.00',
        'Months to Goal': '29 Months',
        'Fund Health Status': 'Building (41% Funded)',
      },
    },
    faqs: [
      {
        question: 'How many months of living expenses should I keep in an emergency fund?',
        answer: 'Financial planners generally recommend 3 to 6 months of essential living expenses for salaried W-2 workers with stable employment, and 6 to 12 months for freelancers, business owners, or single-income households.',
      },
      {
        question: 'Where should emergency fund money be kept?',
        answer: 'Emergency savings should be stored in liquid, FDIC-insured accounts such as High-Yield Savings Accounts (HYSA) or money market funds where funds can be accessed immediately without market volatility risk.',
      },
    ],
  },

  // 6. ASSET ALLOCATION CALCULATOR
  {
    id: 'asset-allocation-calculator',
    name: 'Asset Allocation Calculator',
    slug: 'asset-allocation-calculator',
    route: '/calculators/asset-allocation-calculator',
    category: 'investment',
    categoryLabel: 'Investment & SIP',
    shortDescription: 'Calculate portfolio allocation weights across Stocks, Bonds, Cash, and Crypto.',
    description: 'Calculate your portfolio distribution across asset classes (equities, fixed income, cash, crypto, real estate), compare with benchmark target models, and generate rebalancing actions.',
    icon: 'Scale',
    keywords: [
      'asset allocation calculator',
      'portfolio allocation calculator',
      'investment allocation calculator',
      'portfolio rebalance calculator',
      'stock bond allocation',
    ],
    featured: true,
    relatedTools: ['stock-average-calculator', 'cagr-calculator', 'roi-calculator', 'crypto-average-price-calculator'],
    formulaSummary: 'Asset Weight (%) = (Asset Value / Total Portfolio Value) × 100',
    formulaDetails: [
      'Total Portfolio = Stocks + Bonds + Cash + Crypto + Other Assets',
      'Target Allocation ($) = Total Portfolio × Target Weight %',
      'Rebalance Drift = Target Allocation ($) - Current Asset Value ($)',
      'Action = Buy if Drift > 0; Sell if Drift < 0',
    ],
    exampleCalculation: {
      title: 'Example: $98,000 Growth Portfolio',
      description: 'Balancing $65k stocks, $20k bonds, $8k cash, and $5k crypto against a 75/15/5/5 target.',
      inputs: {
        'Stocks & Equities': '$65,000.00',
        'Bonds & Fixed Income': '$20,000.00',
        'Cash Reserves': '$8,000.00',
        'Cryptocurrency': '$5,000.00',
      },
      outputs: {
        'Total Portfolio': '$98,000.00',
        'Current Equities Weight': '66.3% (Target: 75.0%)',
        'Rebalance Recommendation': 'Buy $8,500 Stocks; Trim $5,300 Bonds',
      },
    },
    faqs: [
      {
        question: 'Why is asset allocation important in investing?',
        answer: 'Academic studies demonstrate that asset allocation accounts for over 90% of a portfolio return variability over time. Proper diversification smooths volatility and reduces drawdown risk during market crashes.',
      },
      {
        question: 'How often should an investor rebalance their portfolio?',
        answer: 'Most advisors recommend rebalancing either on a calendar schedule (annually or semi-annually) or when an asset class drifts by more than 5% from its target allocation.',
      },
    ],
  },

  // 7. STOCK AVERAGE CALCULATOR
  {
    id: 'stock-average-calculator',
    name: 'Stock Average Calculator',
    slug: 'stock-average-calculator',
    route: '/calculators/stock-average-calculator',
    category: 'investment',
    categoryLabel: 'Investment & SIP',
    shortDescription: 'Calculate weighted average share price and breakeven across multiple stock purchases.',
    description: 'Calculate your true volume-weighted average price (VWAP) per share after buying stock at multiple different price points, and evaluate profit/loss at current market prices.',
    icon: 'TrendingUp',
    keywords: [
      'stock average calculator',
      'average stock price calculator',
      'average cost calculator',
      'stock average down calculator',
      'share cost averaging',
    ],
    featured: true,
    relatedTools: ['crypto-average-price-calculator', 'roi-calculator', 'cagr-calculator', 'dividend-reinvestment-calculator'],
    formulaSummary: 'Average Price = (Σ Shares_i × Price_i) / Total Shares',
    formulaDetails: [
      'Total Cost Basis = (Shares_1 × Price_1) + (Shares_2 × Price_2) + ...',
      'Total Shares = Shares_1 + Shares_2 + ...',
      'Average Price per Share = Total Cost Basis / Total Shares',
      'Current Value = Total Shares × Current Market Price',
      'Unrealized P&L = Current Value - Total Cost Basis',
    ],
    exampleCalculation: {
      title: 'Example: Averaging Down on Shares',
      description: 'Buying 50 shares at $140, 30 shares at $125, and 20 shares at $110.',
      inputs: {
        'Buy 1': '50 Shares @ $140.00 ($7,000.00)',
        'Buy 2': '30 Shares @ $125.00 ($3,750.00)',
        'Buy 3': '20 Shares @ $110.00 ($2,200.00)',
      },
      outputs: {
        'Total Shares': '100 Shares',
        'Total Invested': '$12,950.00',
        'Average Price Per Share': '$129.50',
        'Current P&L at $135': '+$550.00 (+4.25%)',
      },
    },
    faqs: [
      {
        question: 'What is "averaging down" in stock trading?',
        answer: 'Averaging down involves purchasing additional shares of a stock as its market price declines, which reduces your overall cost basis per share and lowers the price required to break even.',
      },
      {
        question: 'Does this calculator use FIFO, LIFO, or Weighted Average?',
        answer: 'This tool computes the Weighted Average Cost basis, which is the standard methodology used by many brokerage accounts and mutual funds to calculate average buy price.',
      },
    ],
  },

  // 8. DIVIDEND REINVESTMENT CALCULATOR
  {
    id: 'dividend-reinvestment-calculator',
    name: 'Dividend Reinvestment Calculator',
    slug: 'dividend-reinvestment-calculator',
    route: '/calculators/dividend-reinvestment-calculator',
    category: 'investment',
    categoryLabel: 'Investment & SIP',
    shortDescription: 'Estimate long-term portfolio growth with dividend reinvestment (DRIP) vs cash payout.',
    description: 'Calculate the exponential compounding effects of a Dividend Reinvestment Plan (DRIP), projecting future portfolio value, dividend income streams, and yield on cost.',
    icon: 'Percent',
    keywords: [
      'dividend reinvestment calculator',
      'DRIP calculator',
      'dividend growth calculator',
      'dividend compound calculator',
      'dividend snowball calculator',
    ],
    featured: true,
    relatedTools: ['dividend-calculator', 'cagr-calculator', 'future-value-calculator', 'stock-average-calculator'],
    formulaSummary: 'Portfolio_(t) = Portfolio_(t-1) × (1 + CapitalGrowth) + NetDividends_(t) + NewContributions',
    formulaDetails: [
      'Annual Gross Dividend = Ending Portfolio Value × Current Dividend Yield %',
      'Net Reinvested Dividend = Gross Dividend × (1 - Dividend Tax Rate)',
      'Dividend Yield Growth = Yield_(t) × (1 + Annual Dividend Growth Rate)',
      'Yield on Cost (%) = (Annual Dividend Income / Total Cash Contributed) × 100',
    ],
    exampleCalculation: {
      title: 'Example: $25,000 Portfolio with DRIP over 15 Years',
      description: 'Starting with $25,000 and $2,400/yr additions at 3.8% dividend yield and 5.0% dividend growth.',
      inputs: {
        'Initial Investment': '$25,000.00',
        'Annual Additions': '$2,400.00/yr',
        'Dividend Yield': '3.80%',
        'Dividend Growth Rate': '5.00%/yr',
        'Share Price Appreciation': '5.50%/yr',
      },
      outputs: {
        'Portfolio Value With DRIP': '$167,420.00',
        'Value Without DRIP (Cash)': '$118,550.00',
        'DRIP Wealth Boost': '+$48,870.00',
        'Annual Dividend at Year 15': '$8,410.00/yr',
      },
    },
    faqs: [
      {
        question: 'What is the dividend snowball effect?',
        answer: 'When dividends buy more shares, those newly purchased shares generate their own dividends in subsequent quarters, triggering a self-reinforcing compound growth cycle known as the dividend snowball.',
      },
      {
        question: 'Are reinvested dividends subject to taxes?',
        answer: 'In taxable brokerage accounts, reinvested dividends are typically still considered taxable income in the year received. In tax-advantaged accounts like IRAs or 401(k)s, they grow tax-deferred.',
      },
    ],
  },

  // 9. INVESTMENT FEE CALCULATOR
  {
    id: 'investment-fee-calculator',
    name: 'Investment Fee Calculator',
    slug: 'investment-fee-calculator',
    route: '/calculators/investment-fee-calculator',
    category: 'investment',
    categoryLabel: 'Investment & SIP',
    shortDescription: 'Calculate the lifetime cost of expense ratios and management fees on portfolio returns.',
    description: 'See how fund expense ratios, 1% financial advisory fees, and platform commissions erode your total retirement nest egg over decades of compounding.',
    icon: 'Scale',
    keywords: [
      'investment fee calculator',
      'investment fees calculator',
      'fund fee calculator',
      'expense ratio calculator',
      'mutual fund fee calculator',
    ],
    featured: true,
    relatedTools: ['future-value-calculator', 'compound-interest-calculator', 'retirement-calculator'],
    formulaSummary: 'Wealth Lost to Fees = Future Value (Zero Fee) - Future Value (Net Return)',
    formulaDetails: [
      'Gross Annual Compounding Rate = Expected Portfolio Return %',
      'Net Annual Return = Gross Return - Total Annual Expense Ratio / Fee %',
      'Direct Fees Paid = Sum of annual percentage deductions from asset balance',
      'Opportunity Cost = Forgone compound interest on money deducted for fees',
    ],
    exampleCalculation: {
      title: 'Example: $50,000 Portfolio with 1.0% Fee over 25 Years',
      description: 'Investing $50,000 + $500/month at 8.0% return comparing a 1.0% fee vs a 0% fee.',
      inputs: {
        'Initial Portfolio': '$50,000.00',
        'Monthly Deposit': '$500.00/mo',
        'Gross Return': '8.00%',
        'Annual Fee': '1.00%',
        'Time Horizon': '25 Years',
      },
      outputs: {
        'Balance With Fee (7% net)': '$657,320.00',
        'Potential Balance Without Fee (8%)': '$811,940.00',
        'Total Wealth Lost to Fees': '$154,620.00',
        'Percentage Lost to Fees': '19.0%',
      },
    },
    faqs: [
      {
        question: 'Why does a 1% annual fee reduce total wealth by 20% or more?',
        answer: 'Fees are assessed continuously on your entire asset balance, not just your annual profits. Furthermore, every dollar taken in fees ceases to compound over future years.',
      },
      {
        question: 'What is a typical expense ratio for index funds vs active funds?',
        answer: 'Broad-market index ETFs (e.g. S&P 500 or Total Stock Market) often charge 0.03% to 0.07%, while actively managed mutual funds frequently charge 0.75% to 1.50% annually.',
      },
    ],
  },

  // 10. BOND YIELD CALCULATOR
  {
    id: 'bond-yield-calculator',
    name: 'Bond Yield Calculator',
    slug: 'bond-yield-calculator',
    route: '/calculators/bond-yield-calculator',
    category: 'investment',
    categoryLabel: 'Investment & SIP',
    shortDescription: 'Calculate Current Yield, Yield to Maturity (YTM), and coupon payments for fixed income.',
    description: 'Determine a bond true return including coupon payments, market trading discounts or premiums, par value, and approximate Yield to Maturity (YTM).',
    icon: 'Percent',
    keywords: [
      'bond yield calculator',
      'bond return calculator',
      'bond interest calculator',
      'yield to maturity calculator',
      'ytm calculator',
    ],
    featured: true,
    relatedTools: ['asset-allocation-calculator', 'investment-return-calculator', 'cagr-calculator'],
    formulaSummary: 'Approx YTM = [Coupon + (Face - Price) / n] / [(Face + Price) / 2]',
    formulaDetails: [
      'Annual Coupon Payment = Face Value × Coupon Rate %',
      'Current Yield = (Annual Coupon Payment / Current Market Price) × 100',
      'Yield to Maturity (YTM) accounts for coupon payments plus capital gain/loss at par maturity',
      'Discount Bond: Price < Face Value (YTM > Coupon Rate); Premium: Price > Face Value',
    ],
    exampleCalculation: {
      title: 'Example: Discount Corporate Bond',
      description: 'Bond trading at $960 with $1,000 par value, 5.0% coupon rate, and 7 years to maturity.',
      inputs: {
        'Current Market Price': '$960.00',
        'Face / Par Value': '$1,000.00',
        'Coupon Rate': '5.00%',
        'Years to Maturity': '7 Years',
      },
      outputs: {
        'Current Yield': '5.21%',
        'Approx Yield to Maturity (YTM)': '5.68%',
        'Annual Coupon': '$50.00/yr',
        'Trading Status': 'Discount ($40.00 below par)',
      },
    },
    faqs: [
      {
        question: 'What is the difference between Current Yield and Yield to Maturity (YTM)?',
        answer: 'Current Yield measures only annual coupon income relative to current price. YTM measures total annualized return if the bond is held to maturity, incorporating capital gain or loss as price converges to par.',
      },
      {
        question: 'Why do bond prices move inversely to interest rates?',
        answer: 'When market interest rates rise, newly issued bonds offer higher coupons, making existing lower-coupon bonds less attractive until their trading prices drop to offer competitive yields.',
      },
    ],
  },

  // 11. CRYPTO AVERAGE PRICE CALCULATOR
  {
    id: 'crypto-average-price-calculator',
    name: 'Crypto Average Price Calculator',
    slug: 'crypto-average-price-calculator',
    route: '/calculators/crypto-average-price-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Calculate weighted average cost basis and breakeven across multiple crypto purchases.',
    description: 'Calculate your exact volume-weighted average purchase price per coin across multiple DCA buys of Bitcoin, Ethereum, Solana, or altcoins.',
    icon: 'Coins',
    keywords: [
      'crypto average price calculator',
      'crypto average cost calculator',
      'bitcoin average price calculator',
      'crypto dca cost basis',
      'crypto average down calculator',
    ],
    featured: true,
    relatedTools: ['crypto-profit-calculator', 'crypto-dca-calculator', 'crypto-market-cap-calculator', 'stock-average-calculator'],
    formulaSummary: 'Average Coin Price = Total Capital Invested / Total Coins Accumulated',
    formulaDetails: [
      'Total Fiat Invested = (Coins_1 × Price_1) + (Coins_2 × Price_2) + ...',
      'Total Coins = Coins_1 + Coins_2 + ...',
      'Average Price per Coin = Total Fiat Invested / Total Coins',
      'Current Position Value = Total Coins × Current Token Price',
      'Unrealized P&L = Current Position Value - Total Fiat Invested',
    ],
    exampleCalculation: {
      title: 'Example: Bitcoin Multi-Tranche Buys',
      description: 'Accumulating 0.15 BTC at $58,000, 0.25 BTC at $52,000, and 0.10 BTC at $61,000.',
      inputs: {
        'Buy 1': '0.15 BTC @ $58,000 ($8,700.00)',
        'Buy 2': '0.25 BTC @ $52,000 ($13,000.00)',
        'Buy 3': '0.10 BTC @ $61,000 ($6,100.00)',
      },
      outputs: {
        'Total Accumulated': '0.50 BTC',
        'Total Fiat Outlay': '$27,800.00',
        'Average Buy Price': '$55,600.00',
        'Current P&L at $63,500': '+$3,950.00 (+14.21%)',
      },
    },
    faqs: [
      {
        question: 'Why is calculating weighted average price important in crypto?',
        answer: 'Cryptocurrency markets are highly volatile. Calculating your weighted average price gives you your true break-even price, preventing premature exits and aiding accurate tax accounting.',
      },
      {
        question: 'How does DCA buying reduce crypto volatility risk?',
        answer: 'Buying at fixed regular intervals averages your entry price across market highs and market lows, smoothing out short-term market panic and FOMO cycles.',
      },
    ],
  },

  // 12. CRYPTO MARKET CAP CALCULATOR
  {
    id: 'crypto-market-cap-calculator',
    name: 'Crypto Market Cap Calculator',
    slug: 'crypto-market-cap-calculator',
    route: '/calculators/crypto-market-cap-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Calculate Market Cap, token price from valuation, or compare benchmark caps.',
    description: 'Calculate cryptocurrency market capitalization from circulating supply and price, or project what a coin price would be if it achieved Ethereum or Bitcoin market cap.',
    icon: 'TrendingUp',
    keywords: [
      'crypto market cap calculator',
      'market cap calculator',
      'crypto price calculator',
      'crypto market cap comparison',
      'token valuation calculator',
    ],
    featured: true,
    relatedTools: ['crypto-conversion-calculator', 'crypto-profit-calculator', 'crypto-average-price-calculator'],
    formulaSummary: 'Market Cap = Token Price × Circulating Supply; Target Price = Target Cap / Supply',
    formulaDetails: [
      'Market Cap = Current Token Price × Circulating Supply',
      'Target Price = Desired Target Market Cap / Circulating Supply',
      'Comparative Price = Benchmark Coin Market Cap / Target Coin Circulating Supply',
      'Growth Multiple Needed = Benchmark Market Cap / Current Market Cap',
    ],
    exampleCalculation: {
      title: 'Example: Layer-1 Token Market Cap Scenario',
      description: '468M tokens at $145 projected against a $150 Billion target market cap.',
      inputs: {
        'Token Price': '$145.00',
        'Circulating Supply': '468,000,000 tokens',
        'Target Market Cap': '$150,000,000,000',
      },
      outputs: {
        'Current Market Cap': '$67.86 Billion',
        'Target Price at $150B': '$320.51 per token',
        'Growth Potential': '2.21x (121% gain)',
      },
    },
    faqs: [
      {
        question: 'What is the difference between Circulating Supply and Total Supply?',
        answer: 'Circulating supply refers to the number of coins publicly available and circulating in the market. Total supply includes locked, vested, or reserved tokens that are not yet tradeable.',
      },
      {
        question: 'Why is Market Cap a better metric than unit token price?',
        answer: 'A coin priced at $0.001 with 100 trillion supply has a larger market cap and requires far more capital inflow to double than a coin priced at $10 with only 1 million tokens.',
      },
    ],
  },

  // 13. CRYPTO GAS FEE CALCULATOR
  {
    id: 'crypto-gas-fee-calculator',
    name: 'Crypto Gas Fee Calculator',
    slug: 'crypto-gas-fee-calculator',
    route: '/calculators/crypto-gas-fee-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Calculate Ethereum and EVM blockchain transaction gas fees in Gwei and fiat USD.',
    description: 'Calculate estimated crypto transaction costs across standard ETH transfers, ERC-20 stablecoin transfers, Uniswap DEX swaps, and NFT minting based on live Gwei gas prices.',
    icon: 'Zap',
    keywords: [
      'crypto gas fee calculator',
      'gas fee calculator',
      'ethereum gas calculator',
      'blockchain gas calculator',
      'gwei to usd calculator',
    ],
    featured: true,
    relatedTools: ['crypto-trading-fee-calculator', 'crypto-conversion-calculator', 'trading-fee-calculator'],
    formulaSummary: 'Total Fee (ETH) = Gas Limit Units × (Base Fee + Tip in Gwei) × 10^-9',
    formulaDetails: [
      'Gas Limit: 21,000 (ETH transfer), 65,000 (ERC-20), 160,000 (DEX swap), 220,000 (NFT)',
      'Total Gwei = Base Fee Gwei + Priority Tip Gwei',
      'Fee in Native Token (ETH) = Gas Limit × Total Gwei × 10^-9',
      'Fee in USD ($) = Fee in Native Token × Current Token Price',
    ],
    exampleCalculation: {
      title: 'Example: Uniswap DEX Token Swap',
      description: '160,000 gas units executed at 30 Gwei (28 base + 2 tip) with ETH at $2,650.',
      inputs: {
        'Transaction Action': 'DEX Token Swap (160,000 gas)',
        'Gas Price': '30 Gwei',
        'ETH Price': '$2,650.00',
      },
      outputs: {
        'Total Gas Cost (ETH)': '0.0048 ETH',
        'Total Gas Cost (USD)': '$12.72',
        'Standard Transfer Comparison': '$1.67 (21k gas)',
      },
    },
    faqs: [
      {
        question: 'What is Gwei in Ethereum gas calculation?',
        answer: 'Gwei is a denomination of Ether (ETH), where 1 Gwei = 10^-9 ETH (one billionth of an ETH). It is used as the standard pricing unit for gas transactions.',
      },
      {
        question: 'Why do decentralized exchange (DEX) swaps cost more gas than simple transfers?',
        answer: 'Simple ETH transfers only alter two balance records (21,000 gas units). DEX swaps execute complex smart contract logic, routing calculations, and liquidity pool token updates, consuming 150,000+ gas units.',
      },
    ],
  },

  // 14. CRYPTO CONVERSION CALCULATOR
  {
    id: 'crypto-conversion-calculator',
    name: 'Crypto Conversion Calculator',
    slug: 'crypto-conversion-calculator',
    route: '/calculators/crypto-conversion-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Convert between cryptocurrency tokens (BTC, ETH, SOL) and fiat currencies.',
    description: 'Convert between Bitcoin, Ethereum, Solana, and fiat currencies (USD, EUR, GBP, PKR, INR) with customizable exchange rates and instant bidirectional calculation.',
    icon: 'Coins',
    keywords: [
      'crypto converter',
      'cryptocurrency converter',
      'crypto conversion calculator',
      'bitcoin converter',
      'btc to usd calculator',
      'crypto to fiat converter',
    ],
    featured: true,
    relatedTools: ['crypto-market-cap-calculator', 'crypto-profit-calculator', 'crypto-gas-fee-calculator'],
    formulaSummary: 'Target Amount = Source Amount × Exchange Rate (or Source Amount / Rate)',
    formulaDetails: [
      'Crypto to Fiat: Fiat Value = Crypto Amount × Token Price in Fiat',
      'Fiat to Crypto: Crypto Amount = Fiat Value / Token Price in Fiat',
      'Unit Rate Explanation: 1 Crypto = X Fiat; 1 Fiat = 1/X Crypto',
    ],
    exampleCalculation: {
      title: 'Example: 1.5 BTC to USD Conversion',
      description: 'Converting 1.5 Bitcoin to US Dollars at an exchange rate of $64,500.',
      inputs: {
        'Source Amount': '1.5 BTC',
        'Exchange Rate': '$64,500.00 per BTC',
        'Target Currency': 'USD',
      },
      outputs: {
        'Converted Total': '$96,750.00 USD',
        'Unit Rate': '1 BTC = $64,500.00 USD',
        'Inverse Rate': '$1.00 USD = 0.00001550 BTC',
      },
    },
    faqs: [
      {
        question: 'How often do cryptocurrency exchange rates change?',
        answer: 'Cryptocurrency prices trade 24/7 on decentralized and centralized spot markets worldwide, fluctuating second-by-second based on global order-book supply and demand.',
      },
      {
        question: 'Can I enter custom exchange rates in this calculator?',
        answer: 'Yes, you can click any popular coin preset (BTC, ETH, SOL, BNB, XRP) or manually input your exchange rate or OTC price.',
      },
    ],
  },

  // 15. CRYPTO COMPOUND INTEREST CALCULATOR
  {
    id: 'crypto-compound-interest-calc',
    name: 'Crypto Compound Interest Calculator',
    slug: 'crypto-compound-interest-calculator',
    route: '/calculators/crypto-compound-interest-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Calculate long-term compounding growth for crypto staking and DeFi yield farming.',
    description: 'Calculate the long-term compound growth of crypto investments and staking rewards with daily, weekly, or monthly auto-compounding schedules.',
    icon: 'TrendingUp',
    keywords: [
      'crypto compound interest calculator',
      'crypto investment calculator',
      'crypto growth calculator',
      'crypto staking calculator',
      'crypto compound growth',
    ],
    featured: true,
    relatedTools: ['crypto-staking-calculator', 'apy-apr-calculator', 'compound-interest-calculator', 'future-value-calculator'],
    formulaSummary: 'A = P × (1 + r/m)^(m × t) + Contribution Accumulation',
    formulaDetails: [
      'Staking Compounding Interval (m): Daily (365x), Weekly (52x), Monthly (12x)',
      'Effective Staking APY = (1 + r/m)^m - 1',
      'Future Value = Total Contributed Capital + Accumulated Compounded Staking Rewards',
      'Wealth Multiplier = Future Portfolio Value / Total Principal Contributed',
    ],
    exampleCalculation: {
      title: 'Example: $10,000 Crypto Staking at 12% APY',
      description: '$10,000 initial staking position with $250/mo additions at 12% APY with daily compounding.',
      inputs: {
        'Initial Crypto Capital': '$10,000.00',
        'Monthly Staking Addition': '$250.00/mo',
        'Staking Yield (APR)': '12.00%',
        'Compounding Cadence': 'Daily (DeFi Auto-compound)',
        'Time Horizon': '5 Years',
      },
      outputs: {
        'Future Portfolio Value': '$44,057.20',
        'Principal Contributed': '$25,000.00',
        'Compounded Staking Rewards': '+$19,057.20',
        'Effective APY': '12.75%',
      },
    },
    faqs: [
      {
        question: 'What is auto-compounding in crypto staking and DeFi?',
        answer: 'Auto-compounding smart contracts automatically harvest staking rewards at regular intervals (e.g. daily or weekly) and add them back to your staked principal, generating interest on your rewards.',
      },
      {
        question: 'What risks should be considered with high crypto staking APYs?',
        answer: 'High staking yields often carry token price depreciation risk, smart contract bugs, validator slashing penalties, and unbonding lockup periods where tokens cannot be liquidated.',
      },
    ],
  },
];
