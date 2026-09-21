import { ToolItem } from '../types';

export const TOOLS: ToolItem[] = [
  // CRYPTO TOOLS
  {
    id: 'crypto-profit',
    name: 'Crypto Profit & Loss Calculator',
    slug: 'crypto-profit-calculator',
    route: '/crypto-profit-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Calculate crypto gains, losses, trading fees, and net return on investment (ROI).',
    description: 'Determine your net cryptocurrency profit or loss after taking into account purchase price, sale proceeds, and maker/taker trading fees across both sides of the transaction.',
    icon: 'TrendingUp',
    keywords: ['crypto profit', 'crypto loss', 'roi', 'bitcoin profit', 'crypto trading gains', 'crypto exit price', 'pnl'],
    featured: true,
    relatedTools: ['crypto-roi', 'crypto-dca', 'crypto-trading-fee', 'crypto-break-even'],
    formulaSummary: 'Net Profit = Gross Revenue - Gross Cost - Total Trading Fees',
    formulaDetails: [
      'Gross Cost = Buy Price × Quantity',
      'Gross Revenue = Sell Price × Quantity',
      'Total Fees = Buy Fee + Sell Fee',
      'Net Profit / Loss = Gross Revenue - Gross Cost - Total Fees',
      'ROI (%) = (Net Profit / Total Investment) × 100',
    ],
    exampleCalculation: {
      title: 'Example: Bitcoin Buy & Sell Trade',
      description: 'Buying 0.5 BTC at $60,000 and selling at $72,000 with 0.1% exchange fees on both transactions.',
      inputs: {
        'Buy Price': '$60,000',
        'Sell Price': '$72,000',
        'Quantity': '0.5 BTC',
        'Buy Fee (0.1%)': '$30.00',
        'Sell Fee (0.1%)': '$36.00',
      },
      outputs: {
        'Total Invested': '$30,030.00',
        'Net Revenue': '$35,964.00',
        'Net Profit': '+$5,934.00',
        'ROI': '+19.76%',
      },
    },
    faqs: [
      {
        question: 'How do exchange fees impact my crypto profit?',
        answer: 'Most cryptocurrency exchanges charge a maker or taker fee (typically 0.1% to 0.5%) on both entering and exiting a trade. On a $10,000 trade, roundtrip fees can total $20 to $100, which directly reduces your net profits or deepens losses.',
      },
      {
        question: 'What is the difference between Gross Profit and Net Profit?',
        answer: 'Gross profit considers only the price difference multiplied by quantity (Revenue minus Cost), whereas Net profit subtracts all transaction costs, exchange fees, and gas fees.',
      },
      {
        question: 'Does this calculator factor in taxes?',
        answer: 'This tool calculates pre-tax net trading profit. For estimating capital gains taxes on your gains, use our dedicated Crypto Tax Estimate Calculator.',
      },
    ],
  },
  {
    id: 'crypto-roi',
    name: 'Crypto ROI Calculator',
    slug: 'crypto-roi-calculator',
    route: '/crypto-roi-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Compute percentage return on investment and portfolio capital growth multiple.',
    description: 'Calculate your exact return on investment (ROI) percentage and portfolio multiplier based on initial capital outlay versus current or expected market value.',
    icon: 'Percent',
    keywords: ['roi calculator', 'crypto roi', 'crypto return', 'investment multiplier', 'return on investment'],
    featured: true,
    relatedTools: ['crypto-profit', 'crypto-dca', 'crypto-compound', 'investment-return'],
    formulaSummary: 'ROI (%) = ((Current Value - Initial Investment) / Initial Investment) × 100',
    formulaDetails: [
      'Net Return = Current Value - Initial Capital',
      'ROI (%) = (Net Return / Initial Capital) × 100',
      'Multiplier (X) = Current Value / Initial Capital',
    ],
    exampleCalculation: {
      title: 'Example: Ethereum Investment Return',
      description: 'An initial investment of $2,500 that grows to a current portfolio value of $6,750.',
      inputs: {
        'Initial Investment': '$2,500.00',
        'Current Value': '$6,750.00',
      },
      outputs: {
        'Net Profit': '+$4,250.00',
        'ROI Percentage': '+170.00%',
        'Capital Multiple': '2.70x',
      },
    },
    faqs: [
      {
        question: 'What does a negative ROI mean?',
        answer: 'A negative ROI indicates that the asset current value has fallen below the original purchase amount, resulting in an unrealized or realized loss.',
      },
      {
        question: 'Is ROI annualized?',
        answer: 'Simple ROI measures total percentage change regardless of time elapsed. If you held the asset over multiple years, consider Annualized Return (CAGR) for standardized comparison.',
      },
    ],
  },
  {
    id: 'crypto-dca',
    name: 'Crypto DCA Calculator',
    slug: 'crypto-dca-calculator',
    route: '/crypto-dca-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Simulate Dollar-Cost Averaging across recurring weekly or monthly crypto purchases.',
    description: 'Model your Dollar-Cost Averaging strategy over time to see how disciplined recurring purchases mitigate short-term volatility and build total coin accumulation.',
    icon: 'Repeat',
    keywords: ['dca calculator', 'dollar cost averaging', 'crypto dca', 'recurring bitcoin purchases', 'crypto accumulation'],
    featured: true,
    relatedTools: ['crypto-profit', 'sip', 'crypto-compound', 'savings'],
    formulaSummary: 'Total Invested = Initial + (Recurring Contribution × Periods)',
    formulaDetails: [
      'Total Invested = Initial Deposit + (Recurring Deposit × Number of Periods)',
      'Total Crypto Acquired = Total Invested / Average Purchase Price',
      'Current Portfolio Value = Total Crypto Acquired × Current Asset Price',
      'Net Profit / Loss = Current Portfolio Value - Total Invested',
      'ROI (%) = (Net Profit / Total Invested) × 100',
    ],
    exampleCalculation: {
      title: 'Example: DCA $100 Every Week for 26 Weeks',
      description: 'Investing $500 initially plus $100 weekly for 26 weeks into Bitcoin at an average price of $55,000, with current price at $68,000.',
      inputs: {
        'Initial Deposit': '$500.00',
        'Recurring Amount': '$100.00',
        'Periods': '26 weeks',
        'Avg Purchase Price': '$55,000.00',
        'Current Price': '$68,000.00',
      },
      outputs: {
        'Total Invested': '$3,100.00',
        'Crypto Acquired': '0.056364 BTC',
        'Current Value': '$3,832.73',
        'Net Profit': '+$732.73',
        'ROI': '+23.64%',
      },
    },
    faqs: [
      {
        question: 'Why do investors use Dollar-Cost Averaging in crypto?',
        answer: 'Crypto markets are notoriously volatile. DCA removes emotional timing risk by steadily buying regardless of whether prices are rising or dipping, systematically lowering average cost basis during pullbacks.',
      },
      {
        question: 'Does DCA guarantee positive returns?',
        answer: 'No. If the underlying asset perpetually trends downward, DCA only spreads out the losses. It requires the asset to appreciate over your investment horizon.',
      },
    ],
  },
  {
    id: 'crypto-staking',
    name: 'Crypto Staking Calculator',
    slug: 'crypto-staking-calculator',
    route: '/crypto-staking-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Forecast proof-of-stake rewards, compounding yields, and daily/monthly payouts.',
    description: 'Calculate anticipated staking yields across proof-of-stake networks (e.g. Ethereum, Solana, Cosmos). Compare simple APY against daily, weekly, or monthly auto-compounding.',
    icon: 'Coins',
    keywords: ['crypto staking', 'staking rewards', 'proof of stake', 'staking yield', 'apy calculator', 'eth staking'],
    featured: true,
    relatedTools: ['crypto-compound', 'compound-interest', 'crypto-profit'],
    formulaSummary: 'A = P × (1 + r/n)^(n×t) [Compound Mode] or P × r × t [Simple Mode]',
    formulaDetails: [
      'Simple Mode: Reward = Principal × (APY / 100) × (Days / 365)',
      'Compound Mode: Final Balance = Principal × (1 + (Rate / n))^(n × (Days / 365))',
      'where n = 365 for daily, 52 for weekly, 12 for monthly auto-compounding',
      'Daily Earnings = Total Reward / Duration (Days)',
      'Effective APY (%) = ((Final Balance / Principal)^(365 / Days) - 1) × 100',
    ],
    exampleCalculation: {
      title: 'Example: Staking 50 SOL at 7.2% APY for 1 Year',
      description: 'Staking 50 tokens with daily protocol compounding over a 365-day period.',
      inputs: {
        'Principal Tokens': '50.00',
        'Annual Rate': '7.20%',
        'Duration': '365 Days',
        'Compounding': 'Daily',
      },
      outputs: {
        'Total Reward': '+3.73 tokens',
        'Final Balance': '53.73 tokens',
        'Monthly Payout': '~0.31 tokens/mo',
        'Effective APY': '7.46%',
      },
    },
    faqs: [
      {
        question: 'What is the difference between APR and APY in staking?',
        answer: 'APR (Annual Percentage Rate) does not account for compounding rewards. APY (Annual Percentage Yield) reflects the actual yield achieved when rewards are periodically re-staked back into the principal pool.',
      },
      {
        question: 'Are staking yields guaranteed?',
        answer: 'No. Staking reward rates fluctuate based on total network stake participation, validator performance (uptime and commission fees), and network transaction volumes.',
      },
    ],
  },
  {
    id: 'crypto-trading-fee',
    name: 'Crypto Trading Fee Calculator',
    slug: 'crypto-trading-fee-calculator',
    route: '/crypto-trading-fee-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Analyze exchange maker/taker commission costs and net execution value.',
    description: 'Calculate total commission deductions on cryptocurrency spot, limit, and market orders across single trades and roundtrip roundturns.',
    icon: 'Receipt',
    keywords: ['trading fees', 'binance fee', 'coinbase fee', 'maker taker fee', 'crypto exchange fees'],
    featured: false,
    relatedTools: ['crypto-profit', 'crypto-break-even', 'crypto-position-size'],
    formulaSummary: 'Fee Amount = Trade Value × (Fee Percentage / 100)',
    formulaDetails: [
      'Trade Value = Amount (or Units × Price)',
      'Fee Amount = Trade Value × (Fee Rate / 100)',
      'Roundtrip Fee = Entry Fee + Exit Fee (2× for equal-sized trades)',
      'Net Amount Received = Trade Value - Fee Amount',
    ],
    exampleCalculation: {
      title: 'Example: $25,000 Taker Order at 0.20% Fee',
      description: 'Executing an instantaneous market order of $25,000 on a centralized exchange.',
      inputs: {
        'Trade Amount': '$25,000.00',
        'Fee Rate': '0.20%',
        'Order Side': 'Roundtrip Trade',
      },
      outputs: {
        'Total Fee Cost': '$100.00',
        'Net Proceeds': '$24,900.00',
        'Effective Rate': '0.40%',
      },
    },
    faqs: [
      {
        question: 'What is the difference between a Maker and Taker fee?',
        answer: 'Makers add liquidity to the order book (e.g., limit orders placed away from current market price) and usually pay lower fees. Takers remove liquidity instantly (e.g., market orders) and typically incur higher fees.',
      },
      {
        question: 'Can I reduce crypto exchange fees?',
        answer: 'Yes. Most exchanges offer discounts for holding their native exchange token (e.g., BNB), reaching higher 30-day trading volume tiers, or utilizing limit orders instead of market orders.',
      },
    ],
  },
  {
    id: 'crypto-break-even',
    name: 'Crypto Break-Even Calculator',
    slug: 'crypto-break-even-calculator',
    route: '/crypto-break-even-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Calculate the exact exit price required to cover purchase costs and exchange fees.',
    description: 'Determine the exact target price you must sell your crypto asset at so you recover 100% of your initial capital plus all entry and exit exchange fees.',
    icon: 'Scale',
    keywords: ['break even calculator', 'crypto break even', 'break even price', 'zero loss exit', 'trading costs'],
    featured: false,
    relatedTools: ['crypto-profit', 'crypto-trading-fee', 'crypto-position-size'],
    formulaSummary: 'Break-Even Price = Total Cost / (Quantity × (1 - Exit Fee Rate))',
    formulaDetails: [
      'Initial Cost = (Entry Price × Quantity) + Entry Fee + Flat Fees',
      'Net Exit Factor = 1 - (Exit Fee Rate / 100)',
      'Break-Even Price = Initial Cost / (Quantity × Net Exit Factor)',
      'Required % Increase = ((Break-Even Price - Entry Price) / Entry Price) × 100',
    ],
    exampleCalculation: {
      title: 'Example: Break-Even on 2.0 ETH at $3,200 Entry',
      description: 'Buying 2.0 ETH at $3,200 with 0.25% buy fee and 0.25% anticipated exit fee.',
      inputs: {
        'Entry Price': '$3,200.00',
        'Quantity': '2.00 ETH',
        'Buy Fee': '0.25%',
        'Sell Fee': '0.25%',
      },
      outputs: {
        'Total Cost Basis': '$6,416.00',
        'Break-Even Price': '$3,216.04',
        'Price Surge Needed': '+0.501%',
      },
    },
    faqs: [
      {
        question: 'Why is the break-even price higher than my purchase price?',
        answer: 'Because exchanges charge a percentage fee when you sell your tokens as well as when you bought them. The sale price must rise enough to absorb both the buy-side fee and the future sell-side fee.',
      },
      {
        question: 'Does this factor in network gas fees for on-chain DEX swaps?',
        answer: 'Yes, you can enter gas fees as "Additional Flat Fees" in the calculator to ensure blockchain transaction costs are fully included in your break-even threshold.',
      },
    ],
  },
  {
    id: 'crypto-position-size',
    name: 'Crypto Position Size Calculator',
    slug: 'crypto-position-size-calculator',
    route: '/crypto-position-size-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Determine optimal trade size and risk capital based on stop-loss distance.',
    description: 'Calculate precise position sizing so you never risk more than 1% to 2% of your portfolio on a single cryptocurrency trade regardless of volatility.',
    icon: 'Shield',
    keywords: ['position size calculator', 'crypto risk management', 'stop loss sizing', 'trade size', 'risk reward'],
    featured: false,
    relatedTools: ['crypto-profit', 'crypto-break-even', 'crypto-trading-fee'],
    formulaSummary: 'Position Size = (Account Balance × Risk %) / |Entry Price - Stop Loss|',
    formulaDetails: [
      'Capital at Risk = Account Balance × (Risk Percentage / 100)',
      'Unit Price Risk = |Entry Price - Stop Loss Price|',
      'Position Size (Units) = Capital at Risk / Unit Price Risk',
      'Total Position Value = Position Size (Units) × Entry Price',
      '1:2 Reward Target = Entry + (2 × Unit Price Risk)',
      '1:3 Reward Target = Entry + (3 × Unit Price Risk)',
    ],
    exampleCalculation: {
      title: 'Example: $20,000 Portfolio Risking 1.5% on Bitcoin',
      description: 'Trading BTC with entry at $64,000 and stop-loss set at $61,500.',
      inputs: {
        'Portfolio Balance': '$20,000.00',
        'Risk Tolerance': '1.50%',
        'Entry Price': '$64,000.00',
        'Stop-Loss': '$61,500.00',
      },
      outputs: {
        'Max Dollar Risk': '$300.00',
        'Risk Per BTC': '$2,500.00',
        'Optimal Position': '0.1200 BTC',
        'Position Value': '$7,680.00',
        '1:2 Target': '$69,000.00',
      },
    },
    faqs: [
      {
        question: 'What is the golden rule of position sizing?',
        answer: 'Most professional traders never risk more than 1% to 2% of their total account on any single trade. Sizing is governed by the distance to your technical invalidation level (stop-loss), not emotions.',
      },
      {
        question: 'Does this calculator dictate leverage?',
        answer: 'If your required position value exceeds your account balance, leverage would be required. However, always exercise extreme caution with margin as liquidation can bypass standard stop-loss orders.',
      },
    ],
  },
  {
    id: 'crypto-compound',
    name: 'Crypto Compound Interest Calculator',
    slug: 'crypto-compound-interest-calculator',
    route: '/crypto-compound-interest-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Project multi-year compounding growth on crypto holdings and DeFi yields.',
    description: 'Model long-term compound growth of crypto assets incorporating periodic recurring additions, staking yields, and reinvestment cycles.',
    icon: 'ChartNoAxesCombined',
    keywords: ['crypto compound interest', 'crypto compounding', 'yield compounding', 'defi compound', 'crypto wealth'],
    featured: false,
    relatedTools: ['compound-interest', 'crypto-staking', 'crypto-dca'],
    formulaSummary: 'A = P(1 + r/n)^(nt) + PMT[((1 + r/n)^(nt) - 1) / (r/n)]',
    formulaDetails: [
      'P = Initial Principal Capital',
      'PMT = Regular Monthly Contribution',
      'r = Annual Expected Growth / Yield Rate',
      'n = Compounding intervals per year',
      't = Number of investment years',
    ],
    exampleCalculation: {
      title: 'Example: $5,000 Initial + $250/mo at 9% Yield for 5 Years',
      description: 'Compounding yield returns monthly alongside recurring capital accumulation.',
      inputs: {
        'Initial Principal': '$5,000.00',
        'Monthly Deposit': '$250.00',
        'Annual Yield': '9.00%',
        'Time Horizon': '5 Years',
      },
      outputs: {
        'Total Contributed': '$20,000.00',
        'Interest Earned': '+$6,220.14',
        'Future Portfolio Value': '$26,220.14',
      },
    },
    faqs: [
      {
        question: 'How does compounding accelerate crypto wealth?',
        answer: 'Compounding allows your yield payouts to begin earning rewards of their own. Over multi-year cycles, the exponential curve overtakes linear contributions.',
      },
      {
        question: 'Is crypto yield compounding risk-free?',
        answer: 'No. DeFi smart contracts carry exploit risk, custodial lending platforms carry insolvency risk, and the underlying cryptocurrency can drop in fiat valuation.',
      },
    ],
  },
  {
    id: 'crypto-tax',
    name: 'Crypto Tax Estimate Calculator',
    slug: 'crypto-tax-calculator',
    route: '/crypto-tax-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Estimate short-term vs long-term capital gains tax liabilities on crypto disposals.',
    description: 'Calculate preliminary capital gains tax obligations based on cost basis, gross sale proceeds, and jurisdiction holding periods (under 1 year vs 1 year or more).',
    icon: 'Landmark',
    keywords: ['crypto tax calculator', 'bitcoin taxes', 'capital gains tax', 'short term vs long term crypto tax', 'crypto tax estimate'],
    featured: false,
    relatedTools: ['crypto-profit', 'crypto-roi', 'investment-return'],
    formulaSummary: 'Tax Owed = (Sale Proceeds - Cost Basis) × Applicable Tax Rate',
    formulaDetails: [
      'Capital Gain / Loss = Sale Proceeds - Total Cost Basis',
      'Short-Term Capital Gains Rate = Standard Ordinary Income Tax Rate (Assets held < 1 year)',
      'Long-Term Capital Gains Rate = Preferential Rate (0%, 15%, or 20% in the US for assets held ≥ 1 year)',
      'Estimated Tax Liability = Capital Gain × (Tax Rate / 100)',
      'Net Proceeds After Tax = Sale Proceeds - Estimated Tax Liability',
    ],
    exampleCalculation: {
      title: 'Example: Long-Term vs Short-Term on $15,000 Gain',
      description: 'Purchased for $10,000 and sold for $25,000. Comparing 24% short-term vs 15% long-term tax.',
      inputs: {
        'Cost Basis': '$10,000.00',
        'Sale Proceeds': '$25,000.00',
        'Short-Term Bracket': '24.00%',
        'Long-Term Bracket': '15.00%',
      },
      outputs: {
        'Taxable Capital Gain': '$15,000.00',
        'Short-Term Tax Owed': '$3,600.00',
        'Long-Term Tax Owed': '$2,250.00',
        'Long-Term Tax Savings': '$1,350.00',
      },
    },
    faqs: [
      {
        question: 'When is a crypto transaction considered taxable?',
        answer: 'In most tax jurisdictions (including the US, UK, and Canada), selling crypto for fiat currency, swapping one token for another (e.g., BTC for ETH), or spending crypto on goods is a taxable disposal event.',
      },
      {
        question: 'Does this calculator constitute official tax advice?',
        answer: 'No. Tax laws are complex and vary greatly across countries, states, and individual filing statuses. This tool provides educational estimates only. Always consult a qualified CPA or tax attorney.',
      },
    ],
  },

  // FINANCE TOOLS
  {
    id: 'loan',
    name: 'Loan / EMI Calculator',
    slug: 'loan-calculator',
    route: '/loan-calculator',
    category: 'loans',
    categoryLabel: 'Loans & Credit',
    shortDescription: 'Compute equated monthly installments (EMI), total interest, and loan payoff schedules.',
    description: 'Calculate your exact monthly loan EMI payment, total interest charges, and total payback cost for personal loans, auto loans, or general financing.',
    icon: 'Landmark',
    keywords: ['loan calculator', 'emi calculator', 'car loan', 'personal loan', 'loan interest', 'monthly payment'],
    featured: true,
    relatedTools: ['mortgage', 'savings', 'compound-interest'],
    formulaSummary: 'EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)',
    formulaDetails: [
      'P = Principal Loan Amount',
      'r = Monthly Interest Rate (Annual Rate / 12 / 100)',
      'n = Total Number of Monthly Payments (Tenure in Years × 12)',
      'Total Payment = EMI × n',
      'Total Interest Paid = Total Payment - Principal Loan Amount',
    ],
    exampleCalculation: {
      title: 'Example: $30,000 Auto Loan at 6.5% for 5 Years',
      description: 'Financing $30,000 over 60 monthly payments at 6.5% APR.',
      inputs: {
        'Loan Principal': '$30,000.00',
        'Interest Rate': '6.50%',
        'Tenure': '5 Years (60 mos)',
      },
      outputs: {
        'Monthly EMI': '$586.98',
        'Total Interest': '$5,218.80',
        'Total Payback': '$35,218.80',
      },
    },
    faqs: [
      {
        question: 'How does loan tenure affect total interest?',
        answer: 'A longer loan term lowers your monthly payment but substantially increases the total interest you pay over the life of the loan. A shorter term requires higher monthly installments but saves significantly on cumulative interest.',
      },
      {
        question: 'Can I pay off my loan early to save interest?',
        answer: 'Yes, making extra payments directly toward your loan principal reduces the outstanding balance faster, which shrinks future interest calculations. Check with your lender for any prepayment penalty clauses.',
      },
    ],
  },
  {
    id: 'sip',
    name: 'SIP Calculator',
    slug: 'sip-calculator',
    route: '/sip-calculator',
    category: 'investment',
    categoryLabel: 'Investment',
    shortDescription: 'Calculate maturity wealth from systematic monthly mutual fund and ETF plans.',
    description: 'Forecast the wealth accumulated through regular monthly investments in mutual funds, index funds, or equities using standard Systematic Investment Plan (SIP) formulas.',
    icon: 'CalendarDays',
    keywords: ['sip calculator', 'systematic investment plan', 'mutual fund sip', 'index fund calculator', 'monthly investment'],
    featured: true,
    relatedTools: ['compound-interest', 'investment-return', 'crypto-dca', 'savings'],
    formulaSummary: 'M = P × [((1 + i)^n - 1) / i] × (1 + i)',
    formulaDetails: [
      'P = Regular Monthly Investment Amount',
      'i = Periodic Monthly Expected Rate of Return (Annual Rate / 12 / 100)',
      'n = Total Months of Investment (Tenure in Years × 12)',
      'Total Amount Invested = P × n',
      'Estimated Wealth Gained = Maturity Value - Total Amount Invested',
    ],
    exampleCalculation: {
      title: 'Example: $400/mo SIP for 15 Years at 11% Return',
      description: 'Investing $400 on the first of every month into a diversified broad-market fund.',
      inputs: {
        'Monthly SIP': '$400.00',
        'Expected Return': '11.00% / yr',
        'Investment Horizon': '15 Years',
      },
      outputs: {
        'Total Invested': '$72,000.00',
        'Estimated Returns': '+$116,929.83',
        'Total Maturity Value': '$188,929.83',
      },
    },
    faqs: [
      {
        question: 'What is a Systematic Investment Plan (SIP)?',
        answer: 'A SIP is an investment method where an investor commits a fixed sum at regular intervals (typically monthly) into mutual funds or exchange-traded funds (ETFs), fostering financial discipline and rupee/dollar cost averaging.',
      },
      {
        question: 'Are returns in mutual fund SIPs guaranteed?',
        answer: 'No. Mutual funds and equity markets fluctuate. Historical averages (e.g., 10-12% for broad index funds over long periods) are not guarantees of future returns.',
      },
    ],
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest Calculator',
    slug: 'compound-interest-calculator',
    route: '/compound-interest-calculator',
    category: 'investment',
    categoryLabel: 'Investment',
    shortDescription: 'Forecast the power of compounding with regular additions across multiple years.',
    description: 'Calculate future wealth with compound interest. See how initial deposits combined with steady monthly contributions grow exponentially over time.',
    icon: 'TrendingUp',
    keywords: ['compound interest calculator', 'compounding growth', 'wealth calculator', 'future value', 'exponential growth'],
    featured: true,
    relatedTools: ['sip', 'investment-return', 'savings', 'crypto-compound'],
    formulaSummary: 'A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]',
    formulaDetails: [
      'P = Initial Principal Deposit',
      'PMT = Monthly Contribution',
      'r = Annual Nominal Interest Rate (decimal)',
      'n = Compounding Frequency per year (12 for monthly, 4 for quarterly, 1 for annual)',
      't = Number of Years',
      'Total Interest = Final Amount - Total Principal Invested',
    ],
    exampleCalculation: {
      title: 'Example: $10,000 Initial + $300/mo at 8% for 20 Years',
      description: 'Investing steadily in an asset class that compounds monthly.',
      inputs: {
        'Initial Principal': '$10,000.00',
        'Monthly Addition': '$300.00',
        'Interest Rate': '8.00%',
        'Time Horizon': '20 Years',
      },
      outputs: {
        'Total Contributed': '$82,000.00',
        'Total Interest Earned': '+$144,818.17',
        'Future Balance': '$226,818.17',
      },
    },
    faqs: [
      {
        question: 'Why is Albert Einstein attributed with calling compound interest the 8th wonder?',
        answer: 'Because while simple interest grows linearly, compound interest grows exponentially. The interest earned in each period starts generating interest of its own, causing growth to accelerate dramatically in later years.',
      },
      {
        question: 'What compounding frequency should I choose?',
        answer: 'Most high-yield savings accounts and retail brokerage accounts compound daily or monthly. Select monthly as the standard reliable benchmark.',
      },
    ],
  },
  {
    id: 'investment-return',
    name: 'Investment Return Calculator',
    slug: 'investment-return-calculator',
    route: '/investment-return-calculator',
    category: 'investment',
    categoryLabel: 'Investment',
    shortDescription: 'Analyze total portfolio capital growth, ROI, and annualized return (CAGR).',
    description: 'Measure total monetary profit and compound annual growth rate (CAGR) on any stock, bond, real estate, or blended investment portfolio.',
    icon: 'PieChart',
    keywords: ['investment calculator', 'investment return', 'cagr calculator', 'portfolio return', 'stock return'],
    featured: false,
    relatedTools: ['compound-interest', 'sip', 'savings'],
    formulaSummary: 'Gain = Future Value - Total Invested; ROI = (Gain / Total Invested) × 100',
    formulaDetails: [
      'Total Capital Invested = Initial Deposit + (Monthly Contribution × Total Months)',
      'Ending Portfolio Balance = Future Value under projected annual rate',
      'Total Net Gain = Ending Balance - Total Capital Invested',
      'CAGR (%) = ((Ending Balance / Initial Capital)^(1 / Years) - 1) × 100',
    ],
    exampleCalculation: {
      title: 'Example: $15,000 Investment at 9% for 10 Years',
      description: 'Lump-sum investment with $100 monthly additions over a decade.',
      inputs: {
        'Initial Outlay': '$15,000.00',
        'Monthly Addition': '$100.00',
        'Annual Rate': '9.00%',
        'Years': '10 Years',
      },
      outputs: {
        'Total Invested': '$27,000.00',
        'Ending Value': '$55,004.88',
        'Total Net Profit': '+$28,004.88',
        'ROI': '+103.72%',
      },
    },
    faqs: [
      {
        question: 'What is Compound Annual Growth Rate (CAGR)?',
        answer: 'CAGR is the mean annual growth rate of an investment over a specified period of time longer than one year. It smooths out volatility to show what constant rate would have produced the ending balance.',
      },
      {
        question: 'Should I adjust for inflation?',
        answer: 'Yes, nominal returns reflect raw dollar growth. Real returns subtract the rate of inflation (historically 2-3% per year) to show true purchasing power gains.',
      },
    ],
  },
  {
    id: 'savings',
    name: 'Savings Calculator',
    slug: 'savings-calculator',
    route: '/savings-calculator',
    category: 'savings',
    categoryLabel: 'Savings & Goals',
    shortDescription: 'Project future savings balances in High-Yield Savings Accounts (HYSA) and CDs.',
    description: 'Calculate how fast your emergency fund or financial savings target will grow with regular deposits and competitive bank interest rates.',
    icon: 'PiggyBank',
    keywords: ['savings calculator', 'hysa calculator', 'emergency fund', 'high yield savings', 'savings growth'],
    featured: false,
    relatedTools: ['compound-interest', 'sip', 'loan'],
    formulaSummary: 'Future Savings = Principal Growth + Recurring Annuity Growth',
    formulaDetails: [
      'Total Deposits = Initial Deposit + (Monthly Savings × Months)',
      'Monthly Rate = Annual Percentage Yield / 12 / 100',
      'Compound Monthly Interest accrued on rolling balance',
      'Total Interest Earned = Final Savings Balance - Total Deposits',
    ],
    exampleCalculation: {
      title: 'Example: Building an Emergency Fund at 4.75% APY',
      description: 'Starting with $3,000 and contributing $250 every month for 3 years in a HYSA.',
      inputs: {
        'Initial Deposit': '$3,000.00',
        'Monthly Deposit': '$250.00',
        'Annual Rate (HYSA)': '4.75%',
        'Duration': '3 Years',
      },
      outputs: {
        'Total Out-of-Pocket': '$12,000.00',
        'Interest Earned': '+$1,130.65',
        'Final Balance': '$13,130.65',
      },
    },
    faqs: [
      {
        question: 'What is a High-Yield Savings Account (HYSA)?',
        answer: 'A HYSA is an FDIC- or NCUA-insured savings account that pays a significantly higher interest rate (often 10x to 12x higher) than traditional big-bank brick-and-mortar checking or savings accounts.',
      },
      {
        question: 'How many months of living expenses should be in savings?',
        answer: 'Most financial advisors recommend maintaining 3 to 6 months of essential living expenses in an accessible, liquid, high-yield account for an emergency fund.',
      },
    ],
  },
  {
    id: 'mortgage',
    name: 'Mortgage Calculator',
    slug: 'mortgage-calculator',
    route: '/mortgage-calculator',
    category: 'loans',
    categoryLabel: 'Loans & Credit',
    shortDescription: 'Calculate monthly home mortgage payments, interest, taxes, and loan-to-value (LTV).',
    description: 'Calculate your full monthly housing payment (PITI: Principal, Interest, Taxes, and Insurance) and total 15-year or 30-year home financing costs.',
    icon: 'Home',
    keywords: ['mortgage calculator', 'home loan', 'piti calculator', 'down payment', 'mortgage interest', 'housing payment'],
    featured: true,
    relatedTools: ['loan', 'savings', 'compound-interest'],
    formulaSummary: 'Monthly Payment = P&I + Property Tax + Insurance',
    formulaDetails: [
      'Loan Principal = Home Purchase Price - Down Payment',
      'P&I = P × r × (1 + r)^n / ((1 + r)^n - 1)',
      'Monthly Property Tax = (Home Price × Property Tax %) / 12',
      'Monthly Insurance = Annual Homeowners Insurance / 12',
      'Total Monthly Payment = P&I + Monthly Property Tax + Monthly Insurance',
      'LTV Ratio (%) = (Loan Amount / Home Price) × 100',
    ],
    exampleCalculation: {
      title: 'Example: $450,000 Home with 20% Down at 6.75% for 30 Years',
      description: 'Purchasing a $450,000 home with $90,000 down, 1.2% property tax, and $1,200/yr insurance.',
      inputs: {
        'Home Price': '$450,000.00',
        'Down Payment': '$90,000.00 (20%)',
        'Interest Rate': '6.75%',
        'Term': '30 Years',
        'Property Tax Rate': '1.20%',
        'Annual Insurance': '$1,200.00',
      },
      outputs: {
        'Loan Amount': '$360,000.00',
        'Principal & Interest': '$2,334.82/mo',
        'Property Tax': '$450.00/mo',
        'Insurance': '$100.00/mo',
        'Total Monthly Payment': '$2,884.82/mo',
        'Total Interest (30 yrs)': '$480,535.20',
      },
    },
    faqs: [
      {
        question: 'What is Private Mortgage Insurance (PMI)?',
        answer: 'If you make a down payment of less than 20% on a conventional mortgage, lenders typically require PMI to protect against default. Putting down 20% eliminates PMI requirements.',
      },
      {
        question: 'What is the 28/36 rule in mortgage qualification?',
        answer: 'Lenders commonly advise that your monthly housing costs (PITI) should not exceed 28% of your gross monthly income, and your total monthly debt payments (housing + student loans, car, credit cards) should not exceed 36%.',
      },
    ],
  },
];

export const CATEGORIES: { id: string; label: string; description: string; icon: string }[] = [
  {
    id: 'all',
    label: 'All Calculators',
    description: 'Browse our complete suite of 15+ verified cryptocurrency and personal finance calculators.',
    icon: 'Grid',
  },
  {
    id: 'crypto',
    label: 'Cryptocurrency',
    description: 'Tools for crypto profit/loss, ROI, Dollar-Cost Averaging, staking yields, trading fees, and tax estimates.',
    icon: 'Coins',
  },
  {
    id: 'loans',
    label: 'Loans & Credit',
    description: 'Accurate amortization, auto loan EMI, personal loan financing, and 30-year home mortgages.',
    icon: 'Landmark',
  },
  {
    id: 'investment',
    label: 'Investment & SIP',
    description: 'Compound growth models, Systematic Investment Plans (SIP), and portfolio return metrics.',
    icon: 'TrendingUp',
  },
  {
    id: 'savings',
    label: 'Savings & Goals',
    description: 'Plan emergency funds, high-yield bank interest, and systematic wealth-building targets.',
    icon: 'PiggyBank',
  },
];

export function getToolBySlug(slug: string): ToolItem | undefined {
  return TOOLS.find((t) => t.slug === slug || t.route === `/${slug}` || t.id === slug);
}

export function getToolsByCategory(category: string): ToolItem[] {
  if (!category || category === 'all') return TOOLS;
  return TOOLS.filter((t) => t.category === category);
}

export function searchTools(query: string): ToolItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return TOOLS.filter((t) => {
    return (
      t.name.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.categoryLabel.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });
}
