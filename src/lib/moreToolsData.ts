import { ToolItem } from '../types';

export const MORE_TOOLS: ToolItem[] = [
  // 1. FUTURE VALUE CALCULATOR
  {
    id: 'future-value-calculator',
    name: 'Future Value Calculator',
    slug: 'future-value-calculator',
    route: '/calculators/future-value-calculator',
    category: 'investment',
    categoryLabel: 'Investment & SIP',
    shortDescription: 'Calculate the future value of investments and compounding deposits over time.',
    description: 'Determine the expected future value of your initial principal and periodic deposits using compound interest formulas across monthly, quarterly, or annual schedules.',
    icon: 'TrendingUp',
    keywords: [
      'future value calculator',
      'future value investment calculator',
      'future value of money calculator',
      'FV calculator',
      'compound growth calculator',
      'time value of money',
    ],
    featured: true,
    relatedTools: ['present-value-calculator', 'compound-interest-calculator', 'cagr-calculator', 'sip-calculator'],
    formulaSummary: 'FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]',
    formulaDetails: [
      'Lump Sum FV = PV × (1 + r/m)^(m × t)',
      'Annuity Deposit FV = PMT × [((1 + r/m)^(m × t) - 1) / (r/m)]',
      'Total Future Value = Lump Sum FV + Annuity FV',
      'Total Interest Earned = Future Value - Total Principal Invested',
    ],
    exampleCalculation: {
      title: 'Example: $10,000 Portfolio with $250 Monthly Deposits',
      description: 'Investing $10,000 initially plus $250/month at 8% annual return over 10 years.',
      inputs: {
        'Initial Principal (PV)': '$10,000.00',
        'Annual Rate': '8.00%',
        'Time Horizon': '10 Years',
        'Monthly Deposit': '$250.00/mo',
      },
      outputs: {
        'Future Value (FV)': '$67,314.15',
        'Total Principal Contributed': '$40,000.00',
        'Total Interest Earned': '$27,314.15',
        'Growth Multiplier': '1.68x',
      },
    },
    faqs: [
      {
        question: 'What is Future Value (FV)?',
        answer: 'Future Value (FV) measures how much a given sum of money or stream of cash flows invested today will grow to over a defined period at a specific rate of return.',
      },
      {
        question: 'How does compounding frequency impact Future Value?',
        answer: 'More frequent compounding (e.g. monthly or daily vs annually) slightly increases total returns because accrued interest itself starts generating returns sooner.',
      },
      {
        question: 'What is the difference between an ordinary annuity and an annuity due?',
        answer: 'An ordinary annuity deposits funds at the end of each period, whereas an annuity due deposits at the beginning, earning one extra period of compounding interest.',
      },
    ],
  },

  // 2. PRESENT VALUE CALCULATOR
  {
    id: 'present-value-calculator',
    name: 'Present Value Calculator',
    slug: 'present-value-calculator',
    route: '/calculators/present-value-calculator',
    category: 'investment',
    categoryLabel: 'Investment & SIP',
    shortDescription: 'Calculate the discounted present value of future lump sums and cash flows.',
    description: 'Determine the current lump sum value of future money based on a specified discount rate or inflation expectations.',
    icon: 'Percent',
    keywords: [
      'present value calculator',
      'present value of money calculator',
      'PV calculator',
      'discounted value calculator',
      'discounted cash flow',
      'time value of money calculator',
    ],
    featured: true,
    relatedTools: ['future-value-calculator', 'npv-calculator', 'cagr-calculator'],
    formulaSummary: 'PV = FV / (1 + r)^n',
    formulaDetails: [
      'Lump Sum PV = FV / (1 + r/m)^(m × t)',
      'Discount Factor = 1 / (1 + r)^t',
      'Total Discount = Future Sum - Present Value',
      'Annuity PV = PMT × [1 - (1 + r)^(-n)] / r',
    ],
    exampleCalculation: {
      title: 'Example: Discounting $100,000 Needed in 10 Years',
      description: 'Calculating how much to invest today at 6.5% discount rate to have $100,000 in 10 years.',
      inputs: {
        'Future Value Target': '$100,000.00',
        'Discount Rate': '6.50%',
        'Time Horizon': '10 Years',
      },
      outputs: {
        'Present Value Required': '$53,272.60',
        'Total Discount Savings': '$46,727.40',
        'Discount Factor': '53.27%',
      },
    },
    faqs: [
      {
        question: 'Why is money today worth more than money in the future?',
        answer: 'Due to the time value of money: capital available today can be invested to earn interest, whereas inflation simultaneously erodes future purchasing power.',
      },
      {
        question: 'What discount rate should I choose?',
        answer: 'Common discount rates include expected market returns (e.g. 7-10% for equities), risk-free Treasury yields (4-5%), or the expected inflation rate.',
      },
    ],
  },

  // 3. ROI CALCULATOR
  {
    id: 'roi-calculator',
    name: 'ROI Calculator',
    slug: 'roi-calculator',
    route: '/calculators/roi-calculator',
    category: 'investment',
    categoryLabel: 'Investment & SIP',
    shortDescription: 'Calculate percentage return on investment, net gains, and annualized returns.',
    description: 'Measure the financial efficiency of any investment, real estate property, or stock position by calculating ROI %, capital multiples, and annualized CAGR.',
    icon: 'TrendingUp',
    keywords: [
      'ROI calculator',
      'return on investment calculator',
      'investment return calculator',
      'ROI calculator online',
      'annualized roi',
      'investment profit calculator',
    ],
    featured: true,
    relatedTools: ['cagr-calculator', 'investment-return-calculator', 'future-value-calculator'],
    formulaSummary: 'ROI (%) = ((Final Value - Initial Outlay) / Initial Outlay) × 100',
    formulaDetails: [
      'Cost Basis = Initial Investment + Incidental Expenses',
      'Gross Proceeds = Final Portfolio Value + Income/Dividends',
      'Net Profit = Gross Proceeds - Cost Basis',
      'ROI (%) = (Net Profit / Cost Basis) × 100',
      'Annualized ROI (%) = ((Gross Proceeds / Cost Basis)^(1 / Years) - 1) × 100',
    ],
    exampleCalculation: {
      title: 'Example: Real Estate / Stock Investment',
      description: 'An initial investment of $15,000 with $250 in costs and $600 in dividends, exiting at $24,500 after 3 years.',
      inputs: {
        'Initial Outlay': '$15,000.00',
        'Final Value': '$24,500.00',
        'Incidental Costs': '$250.00',
        'Dividends Received': '$600.00',
        'Holding Period': '3 Years',
      },
      outputs: {
        'Net Profit': '+$9,850.00',
        'Total ROI': '+64.59%',
        'Annualized ROI (CAGR)': '+18.07%/yr',
        'Capital Multiple': '1.65x',
      },
    },
    faqs: [
      {
        question: 'What is a good ROI?',
        answer: 'Historically, the S&P 500 averages ~10% annual nominal return (~7% inflation-adjusted). Good ROI varies by asset risk profile.',
      },
      {
        question: 'How is simple ROI different from annualized ROI?',
        answer: 'Simple ROI shows total percentage change regardless of how many years the investment was held, whereas Annualized ROI (CAGR) reflects true yearly compounding pace.',
      },
    ],
  },

  // 4. NPV CALCULATOR
  {
    id: 'npv-calculator',
    name: 'NPV Calculator',
    slug: 'npv-calculator',
    route: '/calculators/npv-calculator',
    category: 'investment',
    categoryLabel: 'Investment & SIP',
    shortDescription: 'Calculate Net Present Value using discount rate, upfront capital, and periodic cash flows.',
    description: 'Evaluate capital budgeting decisions and commercial investments by computing the Net Present Value (NPV) and Profitability Index (PI).',
    icon: 'Scale',
    keywords: [
      'NPV calculator',
      'net present value calculator',
      'NPV investment calculator',
      'net present value formula',
      'capital budgeting calculator',
      'discounted cash flow calculator',
    ],
    featured: true,
    relatedTools: ['irr-calculator', 'present-value-calculator', 'roi-calculator'],
    formulaSummary: 'NPV = -Initial_Investment + Σ [CF_t / (1 + r)^t]',
    formulaDetails: [
      'Discount Factor (Year t) = 1 / (1 + r)^t',
      'Discounted Inflow = Cash Flow_t × Discount Factor',
      'NPV = Present Value of Inflows - Initial Outlay',
      'Profitability Index (PI) = Present Value of Inflows / Initial Outlay',
    ],
    exampleCalculation: {
      title: 'Example: Business Expansion Project',
      description: 'Investing $50,000 today with 10% discount rate and 5 years of projected revenues ($15k, $18k, $20k, $22k, $25k).',
      inputs: {
        'Initial Outlay': '$50,000.00',
        'Discount Rate': '10.00%',
        '5-Year Inflows': '$15k, $18k, $20k, $22k, $25k',
      },
      outputs: {
        'Net Present Value (NPV)': '+$23,439.11',
        'PV of Inflows': '$73,439.11',
        'Profitability Index': '1.47x',
        'Decision': 'Accept (NPV > 0)',
      },
    },
    faqs: [
      {
        question: 'What does a positive NPV indicate?',
        answer: 'A positive NPV indicates that projected earnings (in today dollars) exceed the anticipated costs, meaning the project generates value above the cost of capital.',
      },
      {
        question: 'What happens if NPV is zero?',
        answer: 'At NPV = 0, the project generates returns exactly equal to the discount rate (hurdle rate).',
      },
    ],
  },

  // 5. IRR CALCULATOR
  {
    id: 'irr-calculator',
    name: 'IRR Calculator',
    slug: 'irr-calculator',
    route: '/calculators/irr-calculator',
    category: 'investment',
    categoryLabel: 'Investment & SIP',
    shortDescription: 'Calculate Internal Rate of Return (IRR) from investment cash flows.',
    description: 'Determine the break-even discount rate where the net present value of cash flows equals zero using numerical Newton-Raphson solvers.',
    icon: 'Percent',
    keywords: [
      'IRR calculator',
      'internal rate of return calculator',
      'investment IRR calculator',
      'IRR calculator online',
      'hurdle rate calculator',
    ],
    featured: true,
    relatedTools: ['npv-calculator', 'roi-calculator', 'cagr-calculator'],
    formulaSummary: '0 = -Initial Outlay + Σ [CF_t / (1 + IRR)^t]',
    formulaDetails: [
      'IRR is the discount rate r that satisfies NPV(r) = 0',
      'Net Profit = Total Inflows - Initial Outlay',
      'Hurdle Check = IRR ≥ Target Hurdle Rate',
    ],
    exampleCalculation: {
      title: 'Example: Startup Angel Investment',
      description: 'Investing $100,000 with returns of $28k, $34k, $38k, $42k, and $45k over 5 years.',
      inputs: {
        'Initial Investment': '$100,000.00',
        '5-Year Inflows': '$28,000, $34,000, $38,000, $42,000, $45,000',
        'Target Hurdle Rate': '10.00%',
      },
      outputs: {
        'Calculated IRR': '24.12%',
        'Total Nominal Cash': '$187,000.00',
        'Undiscounted Profit': '+$87,000.00',
        'Hurdle Status': 'Approved (Exceeds 10%)',
      },
    },
    faqs: [
      {
        question: 'What does Internal Rate of Return mean?',
        answer: 'IRR represents the annualized effective compounded return rate that makes the net present value of all cash flows from a project equal to zero.',
      },
      {
        question: 'When should an investment be accepted based on IRR?',
        answer: 'If the project calculated IRR is higher than the company required rate of return (hurdle rate or weighted average cost of capital), it is financially acceptable.',
      },
    ],
  },

  // 6. CAR LOAN CALCULATOR
  {
    id: 'car-loan-calculator',
    name: 'Car Loan Calculator',
    slug: 'car-loan-calculator',
    route: '/calculators/car-loan-calculator',
    category: 'loans',
    categoryLabel: 'Loans & Credit',
    shortDescription: 'Calculate monthly auto loan payments, financing charges, taxes, and total vehicle cost.',
    description: 'Determine your exact monthly auto payment, total interest expenses, and full out-of-pocket costs with trade-in values, down payments, and sales tax included.',
    icon: 'Landmark',
    keywords: [
      'car loan calculator',
      'auto loan calculator',
      'car payment calculator',
      'car finance calculator',
      'vehicle loan payment',
      'auto financing calculator',
    ],
    featured: true,
    relatedTools: ['loan-calculator', 'loan-comparison-calculator', 'extra-payment-calculator', 'personal-loan-calculator'],
    formulaSummary: 'Monthly EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]',
    formulaDetails: [
      'Financed Principal = Vehicle Price - Down Payment - Trade-in + Sales Tax + Dealer Fees',
      'Monthly Interest Rate (r) = Annual Rate / 12 / 100',
      'Total Loan Payments = Monthly EMI × Loan Term Months',
      'Total Interest Paid = Total Loan Payments - Financed Principal',
      'Total Out-of-Pocket Cost = Down Payment + Trade-in + Total Loan Payments',
    ],
    exampleCalculation: {
      title: 'Example: $32,000 Sedan Purchase',
      description: '$32,000 vehicle with $5,000 down, $2,000 trade-in, 6.5% tax, and 5.9% APR over 60 months.',
      inputs: {
        'Vehicle Price': '$32,000.00',
        'Down Payment': '$5,000.00',
        'Trade-in Allowance': '$2,000.00',
        'Sales Tax (6.5%)': '$1,625.00',
        'Term': '60 Months',
        'Interest Rate': '5.90%',
      },
      outputs: {
        'Monthly Payment': '$531.84/mo',
        'Amount Financed': '$27,475.00',
        'Total Interest Paid': '$4,435.40',
        'Total Out-of-Pocket': '$38,910.40',
      },
    },
    faqs: [
      {
        question: 'How do trade-ins reduce car sales tax?',
        answer: 'In many states and countries, sales tax is assessed only on the difference between the vehicle sticker price and your trade-in allowance.',
      },
      {
        question: 'What is a typical auto loan term?',
        answer: 'Auto loans typically range from 36 to 84 months. While 72- and 84-month terms lower monthly payments, they substantially increase total interest paid.',
      },
    ],
  },

  // 7. PERSONAL LOAN CALCULATOR
  {
    id: 'personal-loan-calculator',
    name: 'Personal Loan Calculator',
    slug: 'personal-loan-calculator',
    route: '/calculators/personal-loan-calculator',
    category: 'loans',
    categoryLabel: 'Loans & Credit',
    shortDescription: 'Calculate monthly payments, total interest, origination fees, and net disbursed funds.',
    description: 'Calculate your fixed monthly personal loan payment, total interest charges, and net cash received after lender origination fees.',
    icon: 'Landmark',
    keywords: [
      'personal loan calculator',
      'personal loan payment calculator',
      'loan repayment calculator',
      'personal finance calculator',
      'unsecured loan calculator',
    ],
    featured: true,
    relatedTools: ['car-loan-calculator', 'loan-comparison-calculator', 'debt-payoff-calculator', 'extra-payment-calculator'],
    formulaSummary: 'Monthly EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]',
    formulaDetails: [
      'Origination Fee ($) = Loan Amount × (Fee % / 100)',
      'Net Disbursed Cash = Loan Amount - Origination Fee',
      'Total Repayment = Monthly Payment × Months',
      'Total Interest = Total Repayment - Principal',
    ],
    exampleCalculation: {
      title: 'Example: $12,000 Consolidation Loan',
      description: '$12,000 personal loan at 8.5% APR for 36 months with a 2.5% origination fee.',
      inputs: {
        'Loan Amount': '$12,000.00',
        'Interest Rate': '8.50%',
        'Loan Term': '36 Months',
        'Origination Fee': '2.50%',
      },
      outputs: {
        'Monthly Payment': '$378.84/mo',
        'Net Cash Disbursed': '$11,700.00',
        'Total Interest Paid': '$1,638.24',
        'Total Repayment': '$13,638.24',
      },
    },
    faqs: [
      {
        question: 'What is an origination fee on a personal loan?',
        answer: 'An origination fee is an upfront processing fee deducted directly from your loan proceeds. For example, a 3% fee on $10,000 means you receive $9,700 in cash but repay $10,000.',
      },
      {
        question: 'Are personal loan rates fixed or variable?',
        answer: 'Most consumer personal loans feature fixed interest rates, guaranteeing an identical monthly payment for the full loan term.',
      },
    ],
  },

  // 8. MORTGAGE AFFORDABILITY CALCULATOR
  {
    id: 'mortgage-affordability-calculator',
    name: 'Mortgage Affordability Calculator',
    slug: 'mortgage-affordability-calculator',
    route: '/calculators/mortgage-affordability-calculator',
    category: 'loans',
    categoryLabel: 'Loans & Credit',
    shortDescription: 'Estimate your maximum home purchase price based on household income and debts.',
    description: 'Estimate how much house you can afford based on gross household income, monthly debt payments, cash down payment, and standard debt-to-income (DTI) underwriting ratios.',
    icon: 'Landmark',
    keywords: [
      'mortgage affordability calculator',
      'how much house can I afford',
      'home affordability calculator',
      'mortgage calculator',
      'home purchase price calculator',
      'dti calculator',
    ],
    featured: true,
    relatedTools: ['mortgage-calculator', 'extra-payment-calculator', 'loan-comparison-calculator'],
    formulaSummary: 'Max Housing PITI = Min(Income × Front-End DTI, Income × Back-End DTI - Non-Housing Debts)',
    formulaDetails: [
      'Front-End DTI Limit (Default 28%): Monthly Housing Costs / Monthly Gross Income',
      'Back-End DTI Limit (Default 36%): (Housing Costs + Recurring Debts) / Monthly Gross Income',
      'Max Monthly PITI = Principal + Interest + Property Tax + Insurance',
      'Affordable Purchase Price = Max Loan Amount + Available Down Payment',
    ],
    exampleCalculation: {
      title: 'Example: $95,000 Household Income',
      description: '$95,000 annual income, $500 monthly debts, $60,000 down payment, 6.75% mortgage rate.',
      inputs: {
        'Annual Income': '$95,000.00',
        'Monthly Debts': '$500.00',
        'Down Payment': '$60,000.00',
        'Interest Rate': '6.75%',
      },
      outputs: {
        'Max Home Price': '$371,400.00',
        'Max Mortgage Loan': '$311,400.00',
        'Estimated Monthly PITI': '$2,488.00/mo',
        'Down Payment Ratio': '16.2%',
      },
    },
    faqs: [
      {
        question: 'What is the 28/36 rule in mortgage qualification?',
        answer: 'The 28/36 rule suggests that housing expenses (PITI) should not exceed 28% of gross monthly income, and total debts (housing + car loans + student loans) should not exceed 36%.',
      },
      {
        question: 'Do lenders allow higher DTI ratios?',
        answer: 'Yes. Conventional loans often approve back-end DTIs up to 43-45%, and government-backed FHA loans can approve up to 50% with strong compensating factors.',
      },
    ],
  },

  // 9. EXTRA PAYMENT CALCULATOR
  {
    id: 'extra-payment-calculator',
    name: 'Extra Payment Calculator',
    slug: 'extra-payment-calculator',
    route: '/calculators/extra-payment-calculator',
    category: 'loans',
    categoryLabel: 'Loans & Credit',
    shortDescription: 'Calculate interest savings and payoff time reduction with extra loan payments.',
    description: 'Discover how adding extra monthly, annual, or lump-sum payments to your mortgage or loan reduces total interest charges and shortens your payoff schedule.',
    icon: 'TrendingUp',
    keywords: [
      'extra payment calculator',
      'loan extra payment calculator',
      'mortgage extra payment calculator',
      'loan interest savings calculator',
      'early loan payoff calculator',
    ],
    featured: true,
    relatedTools: ['mortgage-calculator', 'amortization-calculator', 'loan-comparison-calculator', 'debt-payoff-calculator'],
    formulaSummary: 'Accelerated Balance = Previous Balance × (1 + r) - (Base EMI + Extra Payment)',
    formulaDetails: [
      'Extra Principal = Scheduled Payment + Extra Payment - Accrued Interest',
      'Interest Saved = Original Total Interest - Accelerated Total Interest',
      'Time Saved = Original Months - Accelerated Payoff Months',
    ],
    exampleCalculation: {
      title: 'Example: $280,000 Mortgage with $250 Extra Monthly',
      description: '$280,000 remaining balance at 6.5% APR over 25 years with an extra $250/mo.',
      inputs: {
        'Loan Balance': '$280,000.00',
        'Interest Rate': '6.50%',
        'Remaining Term': '25 Years',
        'Extra Payment': '$250.00/mo',
      },
      outputs: {
        'Interest Saved': '$64,821.50',
        'Time Saved': '5 years and 4 months',
        'New Payoff Time': '19.6 Years',
      },
    },
    faqs: [
      {
        question: 'Does paying extra principal go directly toward reducing loan balance?',
        answer: 'Yes, when designated as principal-only prepayments, 100% of the extra amount reduces your outstanding loan balance, which permanently decreases subsequent interest charges.',
      },
      {
        question: 'Are there prepayment penalties on loans?',
        answer: 'Most modern residential mortgages and personal loans do not carry prepayment penalties, but you should always confirm with your lender.',
      },
    ],
  },

  // 10. LOAN COMPARISON CALCULATOR
  {
    id: 'loan-comparison-calculator',
    name: 'Loan Comparison Calculator',
    slug: 'loan-comparison-calculator',
    route: '/calculators/loan-comparison-calculator',
    category: 'loans',
    categoryLabel: 'Loans & Credit',
    shortDescription: 'Compare two loan options side-by-side to evaluate monthly payments and total interest.',
    description: 'Compare interest rates, loan terms, monthly payments, and total financing costs between two competing loan or mortgage offers.',
    icon: 'Scale',
    keywords: [
      'loan comparison calculator',
      'compare loans calculator',
      'loan payment comparison',
      'loan interest comparison',
      'mortgage comparison calculator',
    ],
    featured: true,
    relatedTools: ['car-loan-calculator', 'personal-loan-calculator', 'mortgage-affordability-calculator'],
    formulaSummary: 'Difference = Loan A Metrics - Loan B Metrics',
    formulaDetails: [
      'Monthly Payment Difference = EMI_A - EMI_B',
      'Total Interest Difference = Interest_A - Interest_B',
      'Total Financing Cost = Principal + Total Interest + Upfront Fees',
    ],
    exampleCalculation: {
      title: 'Example: 30-Year vs 15-Year Mortgage',
      description: 'Comparing a $250,000 loan at 6.5% (30 years) against 5.75% (15 years).',
      inputs: {
        'Loan A': '$250,000 @ 6.5% for 30 Years',
        'Loan B': '$250,000 @ 5.75% for 15 Years',
      },
      outputs: {
        'Loan A Monthly': '$1,580.17/mo (Interest: $318,861)',
        'Loan B Monthly': '$2,076.02/mo (Interest: $123,684)',
        'Interest Saved with B': '$195,177.00',
        'Cheaper Overall': 'Loan B (Saves ~$195k total)',
      },
    },
    faqs: [
      {
        question: 'Why choose a 30-year loan if a 15-year loan saves so much interest?',
        answer: 'A 30-year term offers lower mandatory monthly payments, providing greater monthly cash-flow flexibility and safety in times of financial hardship.',
      },
      {
        question: 'How do upfront fees influence loan comparison?',
        answer: 'Lower interest rates often come with higher upfront discount points or origination fees. If you plan to refinance or move soon, a slightly higher rate with lower fees may be more cost-effective.',
      },
    ],
  },

  // 11. POSITION SIZE CALCULATOR
  {
    id: 'position-size-calculator',
    name: 'Position Size Calculator',
    slug: 'position-size-calculator',
    route: '/calculators/position-size-calculator',
    category: 'crypto',
    categoryLabel: 'Trading & Crypto',
    shortDescription: 'Calculate exact trade units and exposure based on account balance and risk %.',
    description: 'Determine appropriate trading position sizes, contracts, and share quantities based on account risk management and stop-loss placement.',
    icon: 'Scale',
    keywords: [
      'position size calculator',
      'trading position size calculator',
      'crypto position size calculator',
      'forex position size calculator',
      'trade sizing calculator',
    ],
    featured: true,
    relatedTools: ['stop-loss-calculator', 'risk-reward-calculator', 'trading-fee-calculator', 'leverage-calculator'],
    formulaSummary: 'Position Units = (Account Balance × Risk %) / |Entry Price - Stop Loss|',
    formulaDetails: [
      'Dollar Risk ($) = Account Balance × (Risk % / 100)',
      'Risk Per Unit ($) = |Entry Price - Stop Loss Price|',
      'Position Units = Dollar Risk / Risk Per Unit',
      'Total Position Value ($) = Position Units × Entry Price',
      'Account Allocation (%) = (Total Position Value / Account Balance) × 100',
    ],
    exampleCalculation: {
      title: 'Example: Bitcoin Swing Trade',
      description: '$25,000 account risking 1.5% with entry at $62,500 and stop loss at $60,500.',
      inputs: {
        'Account Balance': '$25,000.00',
        'Risk Percentage': '1.50%',
        'Entry Price': '$62,500.00',
        'Stop Loss Price': '$60,500.00',
      },
      outputs: {
        'Max Dollar Risk': '$375.00',
        'Risk Distance Per Unit': '$2,000.00 (3.20%)',
        'Position Units': '0.1875 BTC',
        'Notional Position': '$11,718.75',
        'Portfolio Allocation': '46.88%',
      },
    },
    faqs: [
      {
        question: 'What is the standard 1% or 2% risk rule?',
        answer: 'Professional traders typically risk no more than 1% to 2% of their total account equity on any single trade, ensuring that a series of consecutive losses does not decimate the account.',
      },
      {
        question: 'Does position sizing differ when using leverage?',
        answer: 'Leverage alters required collateral, but true risk remains defined by your stop-loss distance multiplied by total position units.',
      },
    ],
  },

  // 12. STOP LOSS CALCULATOR
  {
    id: 'stop-loss-calculator',
    name: 'Stop Loss Calculator',
    slug: 'stop-loss-calculator',
    route: '/calculators/stop-loss-calculator',
    category: 'crypto',
    categoryLabel: 'Trading & Crypto',
    shortDescription: 'Calculate stop-loss price and take-profit targets for Long and Short trades.',
    description: 'Calculate protective stop-loss price levels and multi-tier take-profit targets for long and short trade setups based on percentage risk.',
    icon: 'Percent',
    keywords: [
      'stop loss calculator',
      'trading stop loss calculator',
      'crypto stop loss calculator',
      'stop loss price calculator',
      'take profit stop loss',
    ],
    featured: true,
    relatedTools: ['position-size-calculator', 'risk-reward-calculator', 'take-profit-calculator', 'futures-pnl-calculator'],
    formulaSummary: 'Long Stop = Entry - (Entry × Risk %); Short Stop = Entry + (Entry × Risk %)',
    formulaDetails: [
      'Long Stop Loss Price = Entry Price - Stop Distance',
      'Short Stop Loss Price = Entry Price + Stop Distance',
      'Total Loss at Stop = Stop Distance × Position Quantity',
      'Take-Profit Target (1:R) = Entry ± (Stop Distance × R)',
    ],
    exampleCalculation: {
      title: 'Example: Ethereum Long Trade',
      description: 'Buying 2.0 ETH at $3,200 with a 3.5% stop loss and 1:2 risk/reward ratio.',
      inputs: {
        'Trade Direction': 'LONG',
        'Entry Price': '$3,200.00',
        'Risk Percentage': '3.50%',
        'Quantity': '2.0 ETH',
      },
      outputs: {
        'Stop Loss Price': '$3,088.00',
        'Stop Loss Distance': '$112.00/ETH',
        'Total Loss at Stop': '$224.00',
        '1:2 Take Profit Target': '$3,424.00 (+$448 gain)',
      },
    },
    faqs: [
      {
        question: 'Where should I place a stop loss?',
        answer: 'Stop losses are best placed beyond key market structure levels, such as recent swing lows (for longs) or swing highs (for shorts), or outside Average True Range (ATR) volatility bands.',
      },
      {
        question: 'What is slippage in stop-loss execution?',
        answer: 'In fast-moving or illiquid markets, a market stop-loss order may execute at a price worse than your trigger price due to gap slippage.',
      },
    ],
  },

  // 13. PIP VALUE CALCULATOR
  {
    id: 'pip-value-calculator',
    name: 'Pip Value Calculator',
    slug: 'pip-value-calculator',
    route: '/calculators/pip-value-calculator',
    category: 'crypto',
    categoryLabel: 'Trading & Forex',
    shortDescription: 'Calculate pip value across currency pairs, lot sizes, and exchange rates.',
    description: 'Calculate the exact monetary value of 1 pip in your account currency for Standard, Mini, and Micro forex lots across major, minor, and exotic currency pairs.',
    icon: 'Coins',
    keywords: [
      'pip value calculator',
      'forex pip calculator',
      'pip calculator',
      'forex trading calculator',
      'fx pip value',
    ],
    featured: true,
    relatedTools: ['position-size-calculator', 'stop-loss-calculator', 'trading-fee-calculator'],
    formulaSummary: 'Pip Value = (1 Pip / Exchange Rate) × Lot Units Traded',
    formulaDetails: [
      'Standard Lot = 100,000 units; Mini Lot = 10,000; Micro Lot = 1,000',
      'Standard Pip Size = 0.0001 (0.01 for JPY pairs)',
      'Pip Value (USD Quote) = Units × Pip Size (e.g. $10.00/pip on EUR/USD standard lot)',
      'Pip Value (Other Quote) = (Units × Pip Size) / Exchange Rate',
    ],
    exampleCalculation: {
      title: 'Example: EUR/USD Standard Lot in USD Account',
      description: 'Trading 1.0 standard lot (100,000 units) on EUR/USD at exchange rate 1.0850.',
      inputs: {
        'Currency Pair': 'EUR/USD',
        'Lot Size': '1.0 Standard Lot (100,000 units)',
        'Exchange Rate': '1.0850',
      },
      outputs: {
        'Pip Value Per Pip': '$10.00/pip',
        '20-Pip Movement Value': '$200.00',
        '50-Pip Movement Value': '$500.00',
      },
    },
    faqs: [
      {
        question: 'What is a pip in forex trading?',
        answer: 'A pip (percentage in point) is the standardized unit of measurement representing the smallest standard price move in currency pairs, equal to 0.0001 for most pairs and 0.01 for JPY pairs.',
      },
      {
        question: 'Why does pip value vary across pairs?',
        answer: 'Pip value is denominated in the quote currency (second currency). If the quote currency is not your account currency, the pip value fluctuates with the current exchange rate.',
      },
    ],
  },

  // 14. TRADING FEE CALCULATOR
  {
    id: 'trading-fee-calculator',
    name: 'Trading Fee Calculator',
    slug: 'trading-fee-calculator',
    route: '/calculators/trading-fee-calculator',
    category: 'crypto',
    categoryLabel: 'Trading & Crypto',
    shortDescription: 'Calculate maker/taker trading fees, roundtrip transaction costs, and net P&L.',
    description: 'Calculate roundtrip trading fees, net profit/loss, and exact break-even exit prices across percentage fees and flat order charges.',
    icon: 'Percent',
    keywords: [
      'trading fee calculator',
      'crypto trading fee calculator',
      'exchange fee calculator',
      'trading fees calculator',
      'brokerage fee calculator',
    ],
    featured: true,
    relatedTools: ['crypto-profit-calculator', 'break-even-price-calculator', 'position-size-calculator'],
    formulaSummary: 'Net P&L = Gross Revenue - Gross Cost - (Buy Fees + Sell Fees)',
    formulaDetails: [
      'Buy Fee = Gross Buy Cost × Buy Fee % + Flat Fee',
      'Sell Fee = Gross Sell Revenue × Sell Fee % + Flat Fee',
      'Total Fees Paid = Buy Fee + Sell Fee',
      'Break-Even Exit Price = (Gross Cost + Buy Fee + Flat Fee) / [Quantity × (1 - Sell Fee Rate)]',
    ],
    exampleCalculation: {
      title: 'Example: Bitcoin Roundtrip Trade',
      description: 'Buying 1.25 BTC at $60,000 and selling at $65,000 with 0.1% maker/taker fees.',
      inputs: {
        'Buy Price': '$60,000.00',
        'Sell Price': '$65,000.00',
        'Quantity': '1.25 BTC',
        'Maker/Taker Fee': '0.10% each side',
      },
      outputs: {
        'Total Fees Paid': '$156.25',
        'Gross Profit': '+$6,250.00',
        'Net Profit After Fees': '+$6,093.75',
        'Break-Even Exit Price': '$60,120.12',
      },
    },
    faqs: [
      {
        question: 'What is the difference between Maker and Taker fees?',
        answer: 'Maker fees apply when your limit order adds liquidity to the order book. Taker fees apply when your market order immediately matches and takes existing liquidity from the book.',
      },
      {
        question: 'How do trading fees affect high-frequency or day trading?',
        answer: 'Because fees are charged on total notional value on both entry and exit, frequent roundtrip trading can generate significant fee drag that erodes overall profitability.',
      },
    ],
  },

  // 15. MARGIN OF SAFETY CALCULATOR
  {
    id: 'margin-of-safety-calculator',
    name: 'Margin of Safety Calculator',
    slug: 'margin-of-safety-calculator',
    route: '/calculators/margin-of-safety-calculator',
    category: 'investment',
    categoryLabel: 'Investment & Valuation',
    shortDescription: 'Calculate the margin of safety discount for value investing and break-even sales.',
    description: 'Calculate the margin of safety buffer for value investing (intrinsic value vs market price) and corporate break-even operations.',
    icon: 'Scale',
    keywords: [
      'margin of safety calculator',
      'margin of safety formula calculator',
      'investment margin of safety',
      'stock margin of safety calculator',
      'benjamin graham margin of safety',
      'break even margin of safety',
    ],
    featured: true,
    relatedTools: ['cagr-calculator', 'roi-calculator', 'npv-calculator', 'business-break-even-calculator'],
    formulaSummary: 'Margin of Safety (%) = ((Intrinsic Value - Market Price) / Intrinsic Value) × 100',
    formulaDetails: [
      'Value Investing MOS ($) = Intrinsic Value - Market Price',
      'Value Investing MOS (%) = [(Intrinsic Value - Market Price) / Intrinsic Value] × 100',
      'Target Buy Price = Intrinsic Value × (1 - Desired Margin % / 100)',
      'Accounting MOS = Actual/Projected Sales - Break-Even Sales',
    ],
    exampleCalculation: {
      title: 'Example: Value Stock Analysis',
      description: 'Stock with estimated intrinsic value of $120.00 trading at current market price of $85.00.',
      inputs: {
        'Intrinsic Value': '$120.00',
        'Market Price': '$85.00',
        'Target Margin': '25.00%',
      },
      outputs: {
        'Margin of Safety': '+$35.00 per share',
        'Margin of Safety (%)': '29.17%',
        'Max Target Buy Price': '$90.00',
        'Evaluation': 'Adequate Safety Buffer',
      },
    },
    faqs: [
      {
        question: 'What is Benjamin Graham Margin of Safety principle?',
        answer: 'Benjamin Graham considered the margin of safety the central cornerstone of value investing: buying assets at a significant discount to intrinsic value to protect against errors in estimation and unforeseen market declines.',
      },
      {
        question: 'What is a standard margin of safety percentage?',
        answer: 'Value investors typically seek a 20% to 40% margin of safety, depending on business predictability, competitive moat, and balance sheet strength.',
      },
    ],
  },
];
