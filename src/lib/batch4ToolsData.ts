import { ToolItem } from '../types';

export const BATCH_4_TOOLS: ToolItem[] = [
  // 1. SAVINGS INTEREST CALCULATOR
  {
    id: 'savings-interest-calculator',
    name: 'Savings Interest Calculator',
    slug: 'savings-interest-calculator',
    route: '/calculators/savings-interest-calculator',
    category: 'savings',
    categoryLabel: 'Savings & Goals',
    shortDescription: 'Calculate accrued interest, total deposits, and final savings account balances over time.',
    description: 'Calculate total interest earned and projected future savings account balance with support for initial deposit, recurring monthly contributions, and variable compounding schedules.',
    icon: 'PiggyBank',
    keywords: [
      'savings interest calculator',
      'savings account interest calculator',
      'savings growth calculator',
      'interest earned calculator',
      'high yield savings calculator',
      'hysa interest calculator',
    ],
    featured: true,
    relatedTools: ['simple-interest-calculator', 'compound-interest-calc', 'savings-goal-calculator', 'emergency-fund-calculator'],
    formulaSummary: 'Final Balance = Initial Principal × (1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]',
    formulaDetails: [
      'Total Deposits = Initial Deposit + (Monthly Contribution × Total Months)',
      'Total Interest Earned = Final Balance - Total Deposits',
      'Effective APY (%) = ((1 + r/n)^n - 1) × 100',
      'Interest-to-Deposit Ratio (%) = (Total Interest Earned / Total Deposits) × 100',
    ],
    exampleCalculation: {
      title: 'Example: $10,000 High-Yield Savings with $300/mo at 4.75% for 5 Years',
      description: 'Calculating earnings in a modern High-Yield Savings Account (HYSA) compounded monthly.',
      inputs: {
        'Initial Deposit': '$10,000.00',
        'Monthly Deposit': '$300.00',
        'Annual APY': '4.75%',
        'Time Horizon': '5 Years',
      },
      outputs: {
        'Total Deposited': '$28,000.00',
        'Total Interest Earned': '+$4,583.21',
        'Final Balance': '$32,583.21',
        'Growth Multiplier': '1.16x',
      },
    },
    faqs: [
      {
        question: 'How does compounding frequency impact savings account interest?',
        answer: 'Compounding frequency determines how often interest is calculated and added back to your balance. Monthly or daily compounding generates higher total returns than annual compounding because you earn interest on your interest sooner.',
      },
      {
        question: 'What is the difference between APR and APY in savings accounts?',
        answer: 'APR (Annual Percentage Rate) does not account for intra-year compounding, whereas APY (Annual Percentage Yield) reflects the true annual return earned after compounding is factored in.',
      },
      {
        question: 'Is interest earned on savings accounts subject to taxes?',
        answer: 'In most jurisdictions including the United States, interest earned from bank savings accounts is considered ordinary taxable income and reported annually on Form 1099-INT.',
      },
    ],
  },

  // 2. SIMPLE INTEREST CALCULATOR
  {
    id: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    slug: 'simple-interest-calculator',
    route: '/calculators/simple-interest-calculator',
    category: 'finance',
    categoryLabel: 'Personal Finance',
    shortDescription: 'Calculate non-compounding simple interest, final amounts, and daily accruals.',
    description: 'Calculate simple interest using the foundational financial formula Interest = Principal × Rate × Time. Ideal for personal short-term loans, promissory notes, and simple bonds.',
    icon: 'Percent',
    keywords: [
      'simple interest calculator',
      'simple interest formula calculator',
      'simple interest online calculator',
      'calculate simple interest',
      'promissory note interest',
    ],
    featured: true,
    relatedTools: ['savings-interest-calculator', 'compound-interest-calc', 'loan-interest-calculator', 'bond-yield-calculator'],
    formulaSummary: 'Interest = Principal × Rate × Time',
    formulaDetails: [
      'Interest (I) = P × (r / 100) × t',
      'Final Amount (A) = Principal + Interest',
      't in Years = Months / 12 or Days / 365',
      'Effective Return (%) = (Interest / Principal) × 100',
    ],
    exampleCalculation: {
      title: 'Example: $15,000 Loan at 6.5% for 3 Years',
      description: 'Determining total interest and maturity balance using flat simple interest.',
      inputs: {
        'Principal': '$15,000.00',
        'Annual Rate': '6.50%',
        'Term': '3 Years',
      },
      outputs: {
        'Total Interest': '$2,925.00',
        'Final Amount': '$17,925.00',
        'Monthly Accrual': '$81.25',
        'Daily Accrual': '$2.67',
      },
    },
    faqs: [
      {
        question: 'When is simple interest used instead of compound interest?',
        answer: 'Simple interest is typically applied to auto loans, short-term personal notes, certificate of deposit (CD) coupons paid directly to checking, and peer-to-peer lending contracts.',
      },
      {
        question: 'How do you convert months or days to time (t) in the simple interest formula?',
        answer: 'To convert months into years, divide the month count by 12. For days, divide by 365 (or 360 if using commercial banking day count conventions).',
      },
      {
        question: 'Does simple interest grow exponentially?',
        answer: 'No. Simple interest grows linearly. Each period yields the exact same monetary interest amount based solely on the original principal, without compounding on previous interest.',
      },
    ],
  },

  // 3. COMPOUND INTEREST CALCULATOR
  {
    id: 'compound-interest-calc',
    name: 'Compound Interest Calculator',
    slug: 'compound-interest-calculator',
    route: '/calculators/compound-interest-calculator',
    category: 'investment',
    categoryLabel: 'Investment & SIP',
    shortDescription: 'Simulate long-term wealth accumulation with custom contributions, compounding frequencies, and growth schedules.',
    description: 'Calculate multi-year compound interest growth with flexible regular contributions, selectable compounding schedules (daily, monthly, quarterly, annual), and comprehensive breakdown tables.',
    icon: 'TrendingUp',
    keywords: [
      'compound interest calculator',
      'compound interest calculator online',
      'compound growth calculator',
      'investment compound interest calculator',
      'compounding interest formula',
      'exponential growth calculator',
    ],
    featured: true,
    relatedTools: ['rule-of-72-calculator', 'savings-interest-calculator', 'future-value-calculator', 'dividend-reinvestment-calculator'],
    formulaSummary: 'A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]',
    formulaDetails: [
      'P = Initial Principal Deposit',
      'PMT = Periodic Contribution',
      'r = Annual Nominal Interest Rate (decimal)',
      'n = Compounding Frequency per year (12 for monthly, 365 for daily, 1 for annual)',
      't = Number of Years',
      'Total Interest = Final Balance - Total Principal Invested',
    ],
    exampleCalculation: {
      title: 'Example: $20,000 Initial + $500/mo at 8% for 15 Years',
      description: 'Long-term investment portfolio compounding monthly with consistent contributions.',
      inputs: {
        'Initial Deposit': '$20,000.00',
        'Monthly Addition': '$500.00',
        'Annual Return': '8.00%',
        'Horizon': '15 Years',
      },
      outputs: {
        'Total Invested': '$110,000.00',
        'Total Interest Earned': '+$139,183.47',
        'Final Balance': '$249,183.47',
        'Interest Share': '55.9%',
      },
    },
    faqs: [
      {
        question: 'Why does compound interest accelerate dramatically over time?',
        answer: 'Compound interest generates exponential growth because interest earned in each period is reinvested into the principal, so subsequent interest is calculated on a continuously expanding capital base.',
      },
      {
        question: 'What compounding frequency provides the highest yield?',
        answer: 'More frequent compounding (such as daily continuous compounding) produces the highest mathematical return, although the incremental benefit from monthly to daily is modest.',
      },
      {
        question: 'How do regular contributions enhance the power of compounding?',
        answer: 'Adding regular deposits injects fresh capital continually, creating multiple waves of compounding that significantly outpace a static lump-sum deposit.',
      },
    ],
  },

  // 4. RULE OF 72 CALCULATOR
  {
    id: 'rule-of-72-calculator',
    name: 'Rule of 72 Calculator',
    slug: 'rule-of-72-calculator',
    route: '/calculators/rule-of-72-calculator',
    category: 'investment',
    categoryLabel: 'Investment & SIP',
    shortDescription: 'Estimate doubling time for investments or calculate the annual rate required to double capital.',
    description: 'Calculate investment doubling time with the renowned Rule of 72 (Years ≈ 72 / Rate) or solve for required return rate. Features side-by-side comparison with the exact logarithmic formula ln(2)/ln(1+r).',
    icon: 'Sparkles',
    keywords: [
      'rule of 72 calculator',
      'investment doubling calculator',
      'doubling time calculator',
      'rule of 72 formula',
      'how long to double money',
      'rule of 70 calculator',
    ],
    featured: true,
    relatedTools: ['compound-interest-calc', 'cagr-calculator', 'savings-interest-calculator', 'investment-return-calculator'],
    formulaSummary: 'Doubling Years ≈ 72 / Interest Rate (%)  |  Required Rate (%) ≈ 72 / Years',
    formulaDetails: [
      'Rule of 72 Approximation: Years ≈ 72 / r',
      'Exact Logarithmic Doubling Time: Years = ln(2) / ln(1 + r/100)',
      'Exact Annual Rate Required: Rate (%) = (2^(1/t) - 1) × 100',
      'Rule of 114 (Tripling): Years ≈ 114 / r',
      'Rule of 144 (Quadrupling): Years ≈ 144 / r',
    ],
    exampleCalculation: {
      title: 'Example: Investment Doubling Time at 9% Annual Return',
      description: 'Estimating how fast a $25,000 portfolio doubles to $50,000 at a 9% rate.',
      inputs: {
        'Annual Rate': '9.00%',
        'Initial Capital': '$25,000.00',
      },
      outputs: {
        'Doubling Time (Rule 72)': '8.00 Years (96 mos)',
        'Exact Doubling Time': '8.04 Years',
        'Doubled Capital': '$50,000.00',
        'Time to Triple (3x)': '12.67 Years',
      },
    },
    faqs: [
      {
        question: 'What is the Rule of 72 and why is 72 used?',
        answer: 'The Rule of 72 is a mental shortcut derived from the Taylor series expansion of ln(2) ≈ 0.693. 72 is chosen because it is easily divisible by 2, 3, 4, 6, 8, 9, and 12, offering exceptional accuracy for interest rates between 6% and 10%.',
      },
      {
        question: 'Can the Rule of 72 be used in reverse to find required interest rate?',
        answer: 'Yes. If you want to double your money in 6 years, divide 72 by 6 to determine that an approximate 12% annual return is required.',
      },
      {
        question: 'Does inflation affect the Rule of 72?',
        answer: 'Yes. You can also apply the Rule of 72 to inflation: dividing 72 by the inflation rate (e.g. 3.6%) estimates when the purchasing power of your money will be halved (approx. 20 years).',
      },
    ],
  },

  // 5. DISCOUNT CALCULATOR
  {
    id: 'discount-calculator',
    name: 'Discount Calculator',
    slug: 'discount-calculator',
    route: '/calculators/discount-calculator',
    category: 'finance',
    categoryLabel: 'Personal Finance',
    shortDescription: 'Calculate discount savings, final sale prices, discount percentages, and post-tax totals.',
    description: 'Calculate instant sale price discounts, percentage markdowns, double stacked coupon savings, and final prices with local sales tax applied.',
    icon: 'Tag',
    keywords: [
      'discount calculator',
      'percentage discount calculator',
      'sale price calculator',
      'discount price calculator',
      'price reduction calculator',
      'shopping discount calculator',
    ],
    featured: true,
    relatedTools: ['markup-calculator', 'percentage-change-calculator', 'profit-margin-calculator', 'budget-calculator'],
    formulaSummary: 'Final Price = Original Price × (1 - Discount% / 100)',
    formulaDetails: [
      'Discount Amount ($) = Original Price × (Discount% / 100)',
      'Price After Discount ($) = Original Price - Discount Amount',
      'Discount % (when reverse calculating) = ((Original - Sale Price) / Original) × 100',
      'Sales Tax ($) = Price After Discount × (Tax% / 100)',
      'Final Total ($) = Price After Discount + Sales Tax',
    ],
    exampleCalculation: {
      title: 'Example: $120 Jacket with 25% Off + Extra 10% Coupon & 8% Tax',
      description: 'Purchasing an item on sale with an additional stacked promo code.',
      inputs: {
        'Original Price': '$120.00',
        'Primary Discount': '25.0%',
        'Stacked Coupon': '10.0%',
        'Sales Tax': '8.0%',
      },
      outputs: {
        'Total Savings': '$39.00',
        'Discounted Subtotal': '$81.00',
        'Sales Tax': '$6.48',
        'Final Price with Tax': '$87.48',
      },
    },
    faqs: [
      {
        question: 'How do stacked discounts (e.g., 20% off plus extra 10% coupon) work?',
        answer: 'Stacked discounts are applied sequentially, not additively. An item with 20% off plus an extra 10% coupon is discounted by 20% first, and then 10% is taken off the reduced subtotal, resulting in an effective 28% discount, not 30%.',
      },
      {
        question: 'Is sales tax calculated before or after applying discounts?',
        answer: 'In most tax jurisdictions, retail sales tax is applied to the discounted sale price that the consumer actually pays, not the original MSRP.',
      },
      {
        question: 'How do you calculate the discount percentage if you only know original and sale prices?',
        answer: 'Subtract the sale price from the original price to get savings, divide savings by the original price, and multiply by 100.',
      },
    ],
  },

  // 6. PERCENTAGE CHANGE CALCULATOR
  {
    id: 'percentage-change-calculator',
    name: 'Percentage Change Calculator',
    slug: 'percentage-change-calculator',
    route: '/calculators/percentage-change-calculator',
    category: 'finance',
    categoryLabel: 'Personal Finance',
    shortDescription: 'Calculate percentage increase, decrease, absolute difference, and recovery multipliers between two values.',
    description: 'Calculate the exact percentage increase or decrease between an original value and a new value using the standard formula ((New - Original) / Original) × 100.',
    icon: 'Percent',
    keywords: [
      'percentage change calculator',
      'percent change calculator',
      'percentage increase calculator',
      'percentage decrease calculator',
      'percent difference calculator',
      'growth percentage calculator',
    ],
    featured: true,
    relatedTools: ['profit-margin-calculator', 'markup-calculator', 'cagr-calculator', 'stock-profit-calculator'],
    formulaSummary: 'Percentage Change = ((New Value - Original Value) / |Original Value|) × 100',
    formulaDetails: [
      'Absolute Difference = New Value - Original Value',
      'Percentage Change (%) = (Difference / |Original|) × 100',
      'Growth Multiplier = New Value / Original Value',
      'Percent of Original (%) = (New Value / Original Value) × 100',
      'Reversal % Required = ((Original - New) / |New|) × 100',
    ],
    exampleCalculation: {
      title: 'Example: Stock Price Moves from $45.00 to $72.00',
      description: 'Calculating the percentage gain and the required reversal drop.',
      inputs: {
        'Original Value': '$45.00',
        'New Value': '$72.00',
      },
      outputs: {
        'Percentage Change': '+60.00% Increase',
        'Absolute Difference': '+$27.00',
        'Multiplier Factor': '1.60x',
        'Drop Needed to Reset': '-37.50%',
      },
    },
    faqs: [
      {
        question: 'Why is the percentage increase from $50 to $100 not the same as the decrease from $100 to $50?',
        answer: 'Because the denominator changes. Moving from $50 to $100 is a $50 gain on a $50 base (+100%). Moving from $100 to $50 is a $50 loss on a $100 base (-50%). This asymmetry is critical in investment risk management.',
      },
      {
        question: 'Can percentage change be negative?',
        answer: 'Yes. When the new value is less than the original value, the difference is negative, representing a percentage decrease.',
      },
      {
        question: 'What happens if the original value is zero?',
        answer: 'Percentage change is mathematically undefined when dividing by zero, because any movement from zero represents an infinite proportional change.',
      },
    ],
  },

  // 7. PROFIT MARGIN CALCULATOR
  {
    id: 'profit-margin-calculator',
    name: 'Profit Margin Calculator',
    slug: 'profit-margin-calculator',
    route: '/calculators/profit-margin-calculator',
    category: 'finance',
    categoryLabel: 'Personal Finance',
    shortDescription: 'Calculate gross profit, profit margin percentage, cost ratio, and equivalent markup from cost and revenue.',
    description: 'Calculate gross profit and operating margin percentages from product cost and sales revenue. Easily compare profit margin against product markup to prevent pricing errors.',
    icon: 'TrendingUp',
    keywords: [
      'profit margin calculator',
      'profit margin percentage calculator',
      'business profit margin calculator',
      'gross profit margin calculator',
      'operating margin calculator',
      'margin vs markup calculator',
    ],
    featured: true,
    relatedTools: ['markup-calculator', 'business-break-even-calculator', 'cash-flow-calculator', 'percentage-change-calculator'],
    formulaSummary: 'Profit Margin (%) = ((Revenue - Cost) / Revenue) × 100',
    formulaDetails: [
      'Gross Profit ($) = Revenue - Cost',
      'Profit Margin (%) = (Gross Profit / Revenue) × 100',
      'Markup (%) = (Gross Profit / Cost) × 100',
      'Cost Ratio (%) = (Cost / Revenue) × 100',
    ],
    exampleCalculation: {
      title: 'Example: Retail Product with $40 Cost Sold for $100',
      description: 'Evaluating profitability and margin metrics on inventory sales.',
      inputs: {
        'Cost of Goods': '$40.00',
        'Selling Price / Revenue': '$100.00',
      },
      outputs: {
        'Gross Profit': '+$60.00',
        'Profit Margin': '60.00%',
        'Markup Percentage': '150.00%',
        'Cost Ratio': '40.00%',
      },
    },
    faqs: [
      {
        question: 'What is the difference between Profit Margin and Markup?',
        answer: 'Profit Margin expresses profit as a percentage of total Selling Price (Revenue), whereas Markup expresses profit as a percentage of Cost. A 50% markup on a $100 item produces a 33.3% profit margin.',
      },
      {
        question: 'What is a good profit margin for small businesses?',
        answer: 'Typical gross profit margins vary widely by industry: retail and grocery generally operate around 20% to 30%, manufacturing between 30% and 50%, while digital software/SaaS often exceeds 70% to 85%.',
      },
      {
        question: 'Can profit margin ever exceed 100%?',
        answer: 'No. Gross profit margin can never reach or exceed 100% unless costs are negative. However, Markup percentage can exceed 100%, 500%, or even 1,000%.',
      },
    ],
  },

  // 8. MARKUP CALCULATOR
  {
    id: 'markup-calculator',
    name: 'Markup Calculator',
    slug: 'markup-calculator',
    route: '/calculators/markup-calculator',
    category: 'finance',
    categoryLabel: 'Personal Finance',
    shortDescription: 'Calculate selling price, markup percentage, markup dollar amount, and gross margin.',
    description: 'Calculate optimal retail selling prices based on wholesale cost and target markup percentage. Easily convert between cost markup and sales margin.',
    icon: 'Coins',
    keywords: [
      'markup calculator',
      'markup percentage calculator',
      'price markup calculator',
      'markup formula calculator',
      'cost markup calculator',
      'retail markup calculator',
    ],
    featured: true,
    relatedTools: ['profit-margin-calculator', 'business-break-even-calculator', 'discount-calculator', 'percentage-change-calculator'],
    formulaSummary: 'Selling Price = Cost × (1 + Markup% / 100)',
    formulaDetails: [
      'Markup Amount ($) = Selling Price - Cost Price',
      'Markup Percentage (%) = (Markup Amount / Cost Price) × 100',
      'Selling Price ($) = Cost Price × (1 + Markup% / 100)',
      'Equivalent Margin (%) = (Markup Amount / Selling Price) × 100',
    ],
    exampleCalculation: {
      title: 'Example: $60 Wholesale Item with 75% Markup',
      description: 'Pricing a manufactured unit for commercial distribution.',
      inputs: {
        'Cost Price': '$60.00',
        'Target Markup': '75.0%',
      },
      outputs: {
        'Markup Amount': '$45.00',
        'Selling Price': '$105.00',
        'Gross Margin': '42.86%',
        'Cost Factor': '1.75x',
      },
    },
    faqs: [
      {
        question: 'Why do retailers use markup instead of margin?',
        answer: 'Wholesale buyers and merchants often prefer markup because it directly applies a pricing multiplier onto known invoice purchasing costs (e.g., Cost × 2.0 = Keystone pricing).',
      },
      {
        question: 'What is Keystone Pricing?',
        answer: 'Keystone pricing is a standard retail rule of thumb where merchandise is priced at exactly 100% markup over cost, doubling the purchase price and delivering a 50% gross margin.',
      },
      {
        question: 'How do you convert a 40% margin requirement into a markup percentage?',
        answer: 'Formula: Markup = Margin / (1 - Margin). For a 40% margin: 0.40 / (1 - 0.40) = 0.40 / 0.60 ≈ 66.67% markup.',
      },
    ],
  },

  // 9. BREAK-EVEN BUSINESS CALCULATOR
  {
    id: 'business-break-even-calculator',
    name: 'Break-Even Business Calculator',
    slug: 'business-break-even-calculator',
    route: '/calculators/business-break-even-calculator',
    category: 'finance',
    categoryLabel: 'Personal Finance',
    shortDescription: 'Calculate required unit sales and sales revenue to reach zero profit/loss and cover all fixed costs.',
    description: 'Calculate the business break-even threshold using fixed operating costs, variable cost per unit, and unit selling price. Features contribution margin analysis and profit projections at target sales volumes.',
    icon: 'Target',
    keywords: [
      'break even calculator',
      'business break even calculator',
      'break even point calculator',
      'break even analysis calculator',
      'contribution margin calculator',
      'break even units calculator',
    ],
    featured: true,
    relatedTools: ['profit-margin-calculator', 'cash-flow-calculator', 'markup-calculator', 'budget-calculator'],
    formulaSummary: 'Break-Even Units = Fixed Costs / (Selling Price - Variable Cost)',
    formulaDetails: [
      'Unit Contribution Margin = Unit Selling Price - Variable Cost Per Unit',
      'Contribution Margin Ratio (%) = (Unit Contribution Margin / Selling Price) × 100',
      'Break-Even Units = Fixed Costs / Unit Contribution Margin',
      'Break-Even Revenue ($) = Break-Even Units × Unit Selling Price',
      'Projected Profit / Loss = (Units Sold × Price) - [Fixed Costs + (Units Sold × Variable Cost)]',
    ],
    exampleCalculation: {
      title: 'Example: $24,000 Fixed Costs, $30 Variable Cost, $80 Selling Price',
      description: 'Finding how many units must be sold to cover overhead.',
      inputs: {
        'Fixed Overhead': '$24,000.00',
        'Variable Cost / Unit': '$30.00',
        'Selling Price / Unit': '$80.00',
        'Target Sales': '600 Units',
      },
      outputs: {
        'Contribution Margin': '$50.00 / unit (62.5%)',
        'Break-Even Units': '480 Units',
        'Break-Even Revenue': '$38,400.00',
        'Profit at 600 Units': '+$6,000.00',
      },
    },
    faqs: [
      {
        question: 'What is the difference between fixed costs and variable costs?',
        answer: 'Fixed costs (rent, administrative salaries, insurance) remain constant regardless of production volume. Variable costs (raw materials, packaging, sales commissions) scale directly with each unit produced.',
      },
      {
        question: 'What does a high contribution margin ratio signify?',
        answer: 'A high contribution margin ratio means a significant portion of each sales dollar covers fixed overhead and directly flows to bottom-line net profit once the break-even point is passed.',
      },
      {
        question: 'How can a business lower its break-even point?',
        answer: 'A business can lower its break-even point by increasing unit selling prices, renegotiating supplier terms to lower variable unit costs, or trimming fixed overhead expenditures.',
      },
    ],
  },

  // 10. CASH FLOW CALCULATOR
  {
    id: 'cash-flow-calculator',
    name: 'Cash Flow Calculator',
    slug: 'cash-flow-calculator',
    route: '/calculators/cash-flow-calculator',
    category: 'finance',
    categoryLabel: 'Personal Finance',
    shortDescription: 'Calculate total cash inflows, outflows, net cash flow balance, and operational liquidity margins.',
    description: 'Calculate monthly or quarterly net cash flow using the fundamental accounting formula Net Cash Flow = Inflows - Outflows. Track receivables, payroll, inventory, and facility expenses.',
    icon: 'Activity',
    keywords: [
      'cash flow calculator',
      'net cash flow calculator',
      'business cash flow calculator',
      'cash flow analysis calculator',
      'cash inflow outflow calculator',
      'operating cash flow calculator',
    ],
    featured: true,
    relatedTools: ['business-break-even-calculator', 'budget-calculator', 'profit-margin-calculator', 'emergency-fund-calculator'],
    formulaSummary: 'Net Cash Flow = Total Cash Inflows - Total Cash Outflows',
    formulaDetails: [
      'Total Inflows = Sales Revenue + Accounts Receivable + Investment Capital + Other Income',
      'Total Outflows = Payroll + Facility & Rent + Inventory + Debt Service + Taxes + Operating Expenses',
      'Net Cash Flow = Total Inflows - Total Outflows',
      'Ending Cash Balance = Starting Cash Balance + Net Cash Flow',
      'Cash Flow Margin (%) = (Net Cash Flow / Total Inflows) × 100',
    ],
    exampleCalculation: {
      title: 'Example: $45,000 Inflows vs $34,200 Outflows with $15,000 Starting Cash',
      description: 'Small enterprise operating cash flow analysis for the monthly cycle.',
      inputs: {
        'Starting Cash': '$15,000.00',
        'Sales Inflows': '$45,000.00',
        'Payroll Outflow': '$18,500.00',
        'Rent & Operations': '$15,700.00',
      },
      outputs: {
        'Total Outflows': '$34,200.00',
        'Net Cash Flow': '+$10,800.00',
        'Ending Cash Balance': '$25,800.00',
        'Cash Flow Margin': '24.00%',
      },
    },
    faqs: [
      {
        question: 'Why can a profitable business run out of cash and fail?',
        answer: 'Accounting profit (accrual basis) records revenue when earned, even if the customer has not paid. If cash inflows are delayed while cash outflows (payroll, rent) are due immediately, a business can become insolvent despite positive paper profits.',
      },
      {
        question: 'What is the difference between Operating Cash Flow and Free Cash Flow?',
        answer: 'Operating Cash Flow reflects core daily business operations (sales minus inventory/payroll), while Free Cash Flow further subtracts capital expenditures (CapEx) for machinery, software, or buildings.',
      },
      {
        question: 'How much cash reserves should a company maintain?',
        answer: 'Most financial advisors recommend maintaining a cash buffer equivalent to 3 to 6 months of non-negotiable operational outflows to weather seasonal dips or client payment delays.',
      },
    ],
  },

  // 11. CAPITAL GAINS CALCULATOR
  {
    id: 'capital-gains-calculator',
    name: 'Capital Gains Calculator',
    slug: 'capital-gains-calculator',
    route: '/calculators/capital-gains-calculator',
    category: 'investment',
    categoryLabel: 'Investment & SIP',
    shortDescription: 'Estimate net capital gains or losses, return percentages, and tax liabilities across short and long holding terms.',
    description: 'Calculate net capital gains or losses from stock, real estate, or asset sales using the formula Selling Price - Purchase Price - Eligible Costs. Clearly highlights tax bracket estimates without providing formal legal advice.',
    icon: 'Receipt',
    keywords: [
      'capital gains calculator',
      'capital gain calculator',
      'investment gain calculator',
      'capital gains tax calculator',
      'asset sale profit calculator',
      'taxable gain calculator',
    ],
    featured: true,
    relatedTools: ['stock-profit-calculator', 'crypto-tax-calc', 'investment-return-calculator', 'cagr-calculator'],
    formulaSummary: 'Capital Gain/Loss = Selling Proceeds - Cost Basis - Deductible Costs',
    formulaDetails: [
      'Total Cost Basis = Purchase Price × Quantity',
      'Total Gross Proceeds = Sale Price × Quantity',
      'Net Capital Gain / Loss = Gross Proceeds - Cost Basis - Deductible Costs',
      'Gain Return (%) = (Net Capital Gain / Total Investment Cost) × 100',
      'Estimated Tax Liability = Net Capital Gain × (Tax Rate% / 100) (if gain > 0)',
      'Net After-Tax Proceeds = Gross Proceeds - Deductible Costs - Estimated Tax Liability',
    ],
    exampleCalculation: {
      title: 'Example: Stock Sale of 500 Shares Purchased at $30 and Sold at $55',
      description: 'Long-term holding asset sale with $50 brokerage fee and 15% capital gains tax rate.',
      inputs: {
        'Buy Price': '$30.00',
        'Sell Price': '$55.00',
        'Quantity': '500 Shares',
        'Brokerage Fees': '$50.00',
        'Estimated Tax Rate': '15.0%',
      },
      outputs: {
        'Gross Proceeds': '$27,500.00',
        'Net Capital Gain': '+$12,450.00',
        'Gain Percentage': '+82.72%',
        'Estimated Tax': '$1,867.50',
        'Net After-Tax Kept': '$25,582.50',
      },
    },
    faqs: [
      {
        question: 'What distinguishes short-term from long-term capital gains in the United States?',
        answer: 'Assets held for one year or less are classified as short-term capital gains and taxed at ordinary income tax rates (10% to 37%). Assets held longer than one year qualify for preferential long-term capital gains rates (0%, 15%, or 20%).',
      },
      {
        question: 'What eligible costs can be deducted from capital gains?',
        answer: 'Brokerage trading fees, commissions, legal transfer fees, and qualified capital improvements (for real estate) directly reduce taxable capital gains.',
      },
      {
        question: 'Can capital losses offset future capital gains?',
        answer: 'Yes. In many jurisdictions including the US, capital losses can offset capital gains dollar-for-dollar, plus up to $3,000 of ordinary income per year, with unused losses carried forward into future tax years.',
      },
    ],
  },

  // 12. STOCK PROFIT CALCULATOR
  {
    id: 'stock-profit-calculator',
    name: 'Stock Profit Calculator',
    slug: 'stock-profit-calculator',
    route: '/calculators/stock-profit-calculator',
    category: 'investment',
    categoryLabel: 'Investment & SIP',
    shortDescription: 'Calculate net equity trade profit/loss, broker commissions, SEC fees, dividend earnings, and ROI.',
    description: 'Calculate net returns on stock purchases and sales. Support for share count, buy/sell prices, buy/sell transaction fees, dividend payments, and break-even per-share pricing.',
    icon: 'TrendingUp',
    keywords: [
      'stock profit calculator',
      'stock gain calculator',
      'stock return calculator',
      'stock investment calculator',
      'share profit calculator',
      'stock trade calculator',
    ],
    featured: true,
    relatedTools: ['capital-gains-calculator', 'stock-average-calculator', 'dividend-calculator', 'risk-reward-calculator'],
    formulaSummary: 'Net Profit = Gross Proceeds - Purchase Cost - Total Commissions + Dividends',
    formulaDetails: [
      'Purchase Cost = Shares × Buy Price Per Share',
      'Gross Proceeds = Shares × Sell Price Per Share',
      'Total Fees = Buy Commission + Sell Commission',
      'Net Profit / Loss = (Gross Proceeds - Purchase Cost) - Total Fees + Dividends',
      'ROI (%) = (Net Profit / (Purchase Cost + Buy Commission)) × 100',
      'Break-Even Price = (Purchase Cost + Total Fees - Dividends) / Shares',
    ],
    exampleCalculation: {
      title: 'Example: 200 Shares Bought at $140 and Sold at $165 with $15 Fees and $80 Dividends',
      description: 'Calculating net gain, fees impact, and break-even price per share.',
      inputs: {
        'Shares': '200',
        'Buy Price': '$140.00',
        'Sell Price': '$165.00',
        'Total Fees': '$15.00',
        'Dividends': '$80.00',
      },
      outputs: {
        'Total Purchase Cost': '$28,000.00',
        'Gross Proceeds': '$33,000.00',
        'Net Profit': '+$5,065.00',
        'ROI Percentage': '+18.08%',
        'Break-Even Share Price': '$139.68',
      },
    },
    faqs: [
      {
        question: 'How do broker commissions and SEC fees impact stock returns?',
        answer: 'While many modern brokerages offer zero-commission stock trades, regulatory transaction fees (SEC Section 31 and FINRA TAF) and option contract fees still apply on sales, slightly increasing the break-even share price.',
      },
      {
        question: 'How do dividends factor into total stock return?',
        answer: 'Total stock return equals capital appreciation (price gain) plus cash dividends received. Over long holding horizons, dividend reinvestment often accounts for substantial portions of total compound return.',
      },
      {
        question: 'What is the break-even price in stock trading?',
        answer: 'The break-even price is the exact price per share you must sell at to recover your initial purchase cost and all round-trip transaction fees without experiencing a net loss.',
      },
    ],
  },

  // 13. CRYPTO ROI CALCULATOR
  {
    id: 'crypto-roi-calc',
    name: 'Crypto ROI Calculator',
    slug: 'crypto-roi-calculator',
    route: '/calculators/crypto-roi-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Calculate cryptocurrency return on investment (ROI %), profit/loss, and portfolio growth multipliers.',
    description: 'Calculate cryptocurrency investment returns using initial capital and current/exit market values. Supports calculations by token price and coin quantity or by total portfolio dollar value.',
    icon: 'Coins',
    keywords: [
      'crypto ROI calculator',
      'bitcoin ROI calculator',
      'crypto return calculator',
      'cryptocurrency profit calculator',
      'crypto portfolio multiplier',
      'ethereum roi calculator',
    ],
    featured: true,
    relatedTools: ['crypto-profit', 'crypto-dca-calc', 'crypto-tax-calc', 'crypto-market-cap-calculator'],
    formulaSummary: 'ROI (%) = ((Final Value - Investment Amount - Fees) / Investment Amount) × 100',
    formulaDetails: [
      'Net Profit / Loss ($) = Final Portfolio Value - Investment Amount - Fees',
      'ROI (%) = (Net Profit / Total Capital Outlay) × 100',
      'Capital Multiplier (X) = Final Portfolio Value / Investment Amount',
    ],
    exampleCalculation: {
      title: 'Example: $3,000 Bitcoin Investment Exiting at $11,500',
      description: 'Measuring percentage return and capital expansion on a crypto position.',
      inputs: {
        'Initial Investment': '$3,000.00',
        'Final Portfolio Value': '$11,500.00',
        'Exchange Fees': '$25.00',
      },
      outputs: {
        'Net Profit': '+$8,475.00',
        'ROI Percentage': '+280.17%',
        'Capital Multiple': '3.83x',
      },
    },
    faqs: [
      {
        question: 'What is a good ROI for cryptocurrency investments?',
        answer: 'Due to cryptocurrency market volatility, benchmark returns vary widely. While traditional equity markets average 8% to 10% annual nominal returns, cryptocurrency cycles have historically experienced higher peaks alongside steeper drawdown cycles.',
      },
      {
        question: 'What does a capital multiple (e.g., 3.5x) mean?',
        answer: 'A capital multiple expresses final value as a factor of initial investment. For example, a 3.5x multiple means your initial $1,000 turned into $3,500 (representing a +250% ROI).',
      },
      {
        question: 'How do network gas fees and exchange taker fees impact crypto ROI?',
        answer: 'Round-trip fees (depositing, trading, and on-chain withdrawal gas) reduce your net return, particularly on smaller portfolio balances where fixed gas fees represent a higher percentage of the principal.',
      },
    ],
  },

  // 14. CRYPTO TAX CALCULATOR
  {
    id: 'crypto-tax-calc',
    name: 'Crypto Tax Calculator',
    slug: 'crypto-tax-calculator',
    route: '/calculators/crypto-tax-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Estimate taxable crypto capital gains, cost basis, deductible gas fees, and potential tax liabilities.',
    description: 'Calculate an estimated cryptocurrency tax liability from purchase price, sale price, coin quantity, and deductible transaction fees. Includes clear legal disclaimers stating that tax rules vary by jurisdiction.',
    icon: 'Receipt',
    keywords: [
      'crypto tax calculator',
      'cryptocurrency tax calculator',
      'bitcoin tax calculator',
      'crypto capital gains calculator',
      'crypto tax estimate calculator',
      'crypto gains tax calculator',
    ],
    featured: true,
    relatedTools: ['crypto-roi-calc', 'capital-gains-calculator', 'crypto-profit', 'crypto-gas-fee-calculator'],
    formulaSummary: 'Estimated Tax = (Sale Proceeds - Cost Basis - Deductible Fees) × Tax Rate (%)',
    formulaDetails: [
      'Cost Basis = Purchase Price Per Coin × Quantity',
      'Gross Proceeds = Sale Price Per Coin × Quantity',
      'Net Taxable Capital Gain = Gross Proceeds - Cost Basis - Deductible Fees',
      'Estimated Tax Amount = Net Taxable Gain × (Tax Rate% / 100) (if gain > 0)',
      'Net Cash Kept After Taxes = Gross Proceeds - Deductible Fees - Estimated Tax Amount',
    ],
    exampleCalculation: {
      title: 'Example: Selling 2.5 ETH with $4,500 Basis for $8,200 with $60 Fees at 24% Tax',
      description: 'Estimating short-term capital gains tax obligation on an Ethereum trade.',
      inputs: {
        'Buy Price': '$1,800.00 / ETH',
        'Sell Price': '$3,280.00 / ETH',
        'Quantity': '2.5 ETH',
        'Gas & Exchange Fees': '$60.00',
        'Tax Bracket Rate': '24.0%',
      },
      outputs: {
        'Cost Basis': '$4,500.00',
        'Gross Proceeds': '$8,200.00',
        'Net Capital Gain': '+$3,640.00',
        'Estimated Tax Owed': '$873.60',
        'Net Cash Kept': '$7,266.40',
      },
    },
    faqs: [
      {
        question: 'Are cryptocurrency swaps (e.g., swapping BTC for ETH) taxable events?',
        answer: 'Yes. In the United States (IRS Notice 2014-21) and many major jurisdictions, swapping one cryptocurrency for another is treated as disposing of property at fair market value and triggers a taxable capital gain or loss.',
      },
      {
        question: 'Can crypto transaction gas fees be subtracted from taxes?',
        answer: 'Generally yes. On-chain gas fees and exchange transaction fees paid to acquire crypto add to your cost basis, while fees paid when selling or swapping reduce your gross taxable proceeds.',
      },
      {
        question: 'What is the difference between FIFO and Specific Identification accounting for crypto?',
        answer: 'FIFO (First-In, First-Out) assumes the earliest coins acquired are sold first. Specific Identification (HIFO/LIFO) allows choosing specific tax lots to optimize tax efficiency, provided adequate records and transaction hashes are maintained.',
      },
    ],
  },

  // 15. CRYPTO DCA CALCULATOR
  {
    id: 'crypto-dca-calc',
    name: 'Crypto DCA Calculator',
    slug: 'crypto-dca-calculator',
    route: '/calculators/crypto-dca-calculator',
    category: 'crypto',
    categoryLabel: 'Cryptocurrency',
    shortDescription: 'Simulate recurring cryptocurrency dollar-cost averaging, average coin cost, and compare against lump-sum buying.',
    description: 'Calculate the outcome of recurring crypto purchases (daily, weekly, bi-weekly, monthly). Model average acquisition price, accumulated coin balance, portfolio ROI, and side-by-side lump-sum comparison.',
    icon: 'Layers',
    keywords: [
      'crypto DCA calculator',
      'dollar cost averaging crypto calculator',
      'bitcoin DCA calculator',
      'crypto recurring buy calculator',
      'dca vs lump sum crypto',
      'recurring crypto investment',
    ],
    featured: true,
    relatedTools: ['crypto-roi-calc', 'crypto-average-price-calculator', 'crypto-compound-interest-calc', 'crypto-profit'],
    formulaSummary: 'Average Purchase Price = Total Fiat Invested / Total Crypto Acquired',
    formulaDetails: [
      'Total Invested ($) = Recurring Deposit Amount × Number of Periods',
      'Total Crypto Acquired = Sum of (Deposit / Price_at_Period_i)',
      'Average Purchase Price ($) = Total Invested / Total Crypto Acquired',
      'Current Portfolio Value ($) = Total Crypto Acquired × Final Price',
      'Net Profit / Loss ($) = Current Portfolio Value - Total Invested',
      'ROI (%) = (Net Profit / Total Invested) × 100',
    ],
    exampleCalculation: {
      title: 'Example: $150 Weekly Bitcoin DCA Over 52 Weeks (Starting $40k, Ending $68k)',
      description: 'Steady recurring accumulation through market movement cycles.',
      inputs: {
        'Weekly Deposit': '$150.00',
        'Periods': '52 Weeks',
        'Starting BTC Price': '$40,000.00',
        'Final BTC Price': '$68,000.00',
      },
      outputs: {
        'Total Cash Invested': '$7,800.00',
        'Total BTC Acquired': '0.1503 BTC',
        'Average Price Paid': '$51,896.21',
        'Ending Portfolio Value': '$10,220.40',
        'Net Profit & ROI': '+$2,420.40 (+31.03%)',
      },
    },
    faqs: [
      {
        question: 'Why is Dollar-Cost Averaging (DCA) popular in crypto markets?',
        answer: 'DCA eliminates the emotional stress of timing highly volatile market tops and bottoms. By investing a fixed fiat amount on a consistent schedule, you automatically buy more coins when prices are low and fewer when prices are high.',
      },
      {
        question: 'How does DCA compare to Lump-Sum investing?',
        answer: 'In consistently trending bull markets, a lump-sum investment on Day 1 often beats DCA because capital is deployed early. However, during sideways or bear markets, DCA drastically lowers risk and average entry cost.',
      },
      {
        question: 'What frequency is best for crypto DCA (daily vs weekly vs monthly)?',
        answer: 'Studies on historical Bitcoin and Ethereum data indicate very little difference in long-term return between daily and weekly DCA. Weekly or bi-weekly DCA aligned with your paycheck is standard and avoids excessive micro-transaction fee overhead.',
      },
    ],
  },
];
