export type Priority = 'ACTION REQUIRED' | 'RM CHECK-IN' | 'FOLLOW-UP' | 'REVIEW'

export type SourceSystem =
  | 'Holdings'
  | 'Credit Facility'
  | 'Mandate'
  | 'RM Note'
  | 'Advice Ledger'
  | 'CRM'
  | 'Calendar'
  | 'Valuations'
  | 'Suitability'

export type AdviceStatus =
  | 'Raised'
  | 'Under Review'
  | 'Discussed'
  | 'Accepted'
  | 'Deferred'
  | 'Rejected'
  | 'Resurfaced'

export interface Evidence {
  label: string
  value: string
  source: SourceSystem
  asOf?: string
}

export interface PriorityClient {
  id: string
  name: string
  priority: Priority
  reason: string
  evidence: Evidence[]
  exposure: { label: string; value: string }
  previousAdvice?: { status: AdviceStatus; date: string; summary: string }
  nextAction: string
  domicile: string
}

export const priorityFeed: PriorityClient[] = [
  {
    id: 'lau-chi-ming',
    name: 'Lau Chi Ming',
    domicile: 'Hong Kong',
    priority: 'ACTION REQUIRED',
    reason: 'Credit facility is within 0.59 percentage points of its liquidation trigger.',
    evidence: [
      { label: 'Current LTV', value: '69.41%', source: 'Credit Facility', asOf: '05 Sep 2026' },
      { label: 'Liquidation trigger', value: '70.00%', source: 'Credit Facility' },
      { label: 'Upcoming obligation', value: 'HKD 60m', source: 'CRM', asOf: '30 Sep 2026' },
      { label: 'Funding shortfall', value: 'HKD 16m', source: 'Holdings' },
    ],
    exposure: { label: 'Relationship value', value: 'HKD 184m' },
    previousAdvice: {
      status: 'Deferred',
      date: '31 Mar 2026',
      summary: 'Increase collateral buffer',
    },
    nextAction: 'Review collateral and funding options today.',
  },
  {
    id: 'margarethe-keller',
    name: 'Margarethe Keller',
    domicile: 'Zürich',
    priority: 'ACTION REQUIRED',
    reason: "Equity allocation is materially inconsistent with the client's Conservative profile.",
    evidence: [
      { label: 'Equity allocation', value: '71%', source: 'Holdings', asOf: '04 Sep 2026' },
      { label: 'Risk profile', value: 'Conservative', source: 'Suitability' },
      { label: 'Mandate review', value: 'Required', source: 'Mandate' },
    ],
    exposure: { label: 'Relationship value', value: 'CHF 62m' },
    nextAction: 'Begin suitability and mandate review.',
  },
  {
    id: 'andreas-lindqvist',
    name: 'Andreas Lindqvist',
    domicile: 'Stockholm',
    priority: 'RM CHECK-IN',
    reason: '45% of the portfolio remains in cash despite a 2–18% target range.',
    evidence: [
      { label: 'Cash', value: '45%', source: 'Holdings', asOf: '04 Sep 2026' },
      { label: 'Mandate maximum', value: '18%', source: 'Mandate' },
      { label: 'Deployment plan', value: 'Previously discussed', source: 'RM Note', asOf: '14 Jun 2026' },
    ],
    exposure: { label: 'Excess cash', value: 'USD 21.6m' },
    previousAdvice: {
      status: 'Deferred',
      date: '31 Mar 2026',
      summary: 'Deploy excess cash',
    },
    nextAction: 'Revisit capital deployment plan.',
  },
  {
    id: 'chalermchai-suphanburi',
    name: 'Chalermchai Suphanburi',
    domicile: 'Bangkok',
    priority: 'FOLLOW-UP',
    reason: 'Retirement planning review remains unresolved.',
    evidence: [
      { label: 'Retirement', value: 'Q2 2027', source: 'CRM' },
      { label: 'Required annual draw', value: 'USD 1.45m', source: 'RM Note', asOf: '02 Jul 2026' },
      { label: 'August communication', value: 'Unanswered', source: 'CRM', asOf: '18 Aug 2026' },
    ],
    exposure: { label: 'Relationship value', value: 'USD 38m' },
    nextAction: 'Schedule retirement review.',
  },
  {
    id: 'ravi-chandrasekaran',
    name: 'Ravi Chandrasekaran',
    domicile: 'Singapore',
    priority: 'REVIEW',
    reason: 'Private asset valuations have not been refreshed since September 2025.',
    evidence: [
      { label: 'Valuation', value: 'Stale (12 months)', source: 'Valuations', asOf: '15 Sep 2025' },
      { label: 'Documentation', value: 'Outstanding', source: 'CRM' },
    ],
    exposure: { label: 'Private assets', value: 'USD 27m' },
    nextAction: 'Request updated valuation documents.',
  },
]

export const meetings = [
  { time: '10:00', client: 'Tan Boon Huat', topic: 'Estate Planning', location: 'Client office' },
  { time: '14:00', client: 'Andreas Lindqvist', topic: 'Portfolio Review', location: 'Video' },
  { time: '16:30', client: 'Margarethe Keller', topic: 'Mandate Review', location: 'Branch, Room 4' },
]

export const followUps = [
  {
    client: 'Priscilla Ng',
    note: 'Deferred advice trigger hit',
    detail: 'FX hedge review — USD/SGD moved past 1.30',
    due: 'Today',
  },
  {
    client: 'Ravi Chandrasekaran',
    note: 'Valuation request overdue',
    detail: 'Requested 12 Aug 2026 · 24 days outstanding',
    due: 'Overdue',
  },
]

/* ---------- Client 360: Lau Chi Ming ---------- */

export const lauProfile = {
  name: 'Lau Chi Ming',
  domicile: 'Hong Kong',
  mandate: 'Balanced Growth',
  since: '2018',
  relationshipValue: 'HKD 184m',
  segment: 'Ultra High Net Worth',
  riskProfile: 'Balanced',
  reportingCurrency: 'HKD',
  lastContact: '22 Aug 2026',
  priority: 'ACTION REQUIRED' as Priority,
}

export const lauInsight = {
  message:
    "Lau Chi Ming's credit facility is close to its liquidation threshold while an upcoming HKD 60m obligation creates a HKD 16m liquidity shortfall.",
  metrics: [
    { label: 'Current LTV', value: '69.41%', source: 'Credit Facility' as SourceSystem, asOf: '05 Sep 2026 06:00 HKT' },
    { label: 'Liquidation trigger', value: '70.00%', source: 'Credit Facility' as SourceSystem },
    { label: 'Available liquidity', value: 'HKD 44m', source: 'Holdings' as SourceSystem, asOf: '04 Sep 2026 close' },
    { label: 'Upcoming obligation', value: 'HKD 60m', source: 'CRM' as SourceSystem, asOf: 'Due 30 Sep 2026' },
  ],
  calculation: [
    {
      step: 'Outstanding balance',
      value: 'HKD 97.2m',
      source: 'Credit Facility' as SourceSystem,
      detail: 'Lombard facility LF-4471, drawn balance as at 05 Sep 2026',
    },
    {
      step: 'Eligible collateral value',
      value: 'HKD 140.0m',
      source: 'Credit Facility' as SourceSystem,
      detail: 'Marked collateral after lending-value haircuts (equities 60–70%, bonds 80–90%)',
    },
    {
      step: 'Current LTV',
      value: '97.2 ÷ 140.0 = 69.41%',
      source: 'Credit Facility' as SourceSystem,
      detail: 'Deterministic calculation from facility system',
    },
    {
      step: 'Liquid assets',
      value: 'HKD 44.0m',
      source: 'Holdings' as SourceSystem,
      detail: 'Cash HKD 11.3m + unencumbered listed securities HKD 32.7m (T+2 settlement)',
    },
    {
      step: 'Obligation',
      value: 'HKD 60.0m',
      source: 'CRM' as SourceSystem,
      detail: 'Family business capital call — Lau Holdings Ltd, recorded by RM 18 Aug 2026',
    },
    {
      step: 'Funding shortfall',
      value: '60.0 − 44.0 = HKD 16.0m',
      source: 'Holdings' as SourceSystem,
      detail: 'Obligation less liquid assets, excluding encumbered collateral',
    },
  ],
}

export const lauKeystone = {
  title: 'Connected exposure',
  statement:
    "47% of the client's liquid wealth is exposed to Greater China real estate through direct holdings, collateral and private-market commitments.",
  breakdown: [
    { label: 'Direct holdings', pct: 19, source: 'Holdings' as SourceSystem, detail: 'Listed HK/PRC developers & REITs (HKD 35.0m)' },
    { label: 'Collateral-linked exposure', pct: 14, source: 'Credit Facility' as SourceSystem, detail: 'Pledged property-sector securities (HKD 25.8m)' },
    { label: 'Private commitments', pct: 9, source: 'Valuations' as SourceSystem, detail: 'Two GC real-estate funds, unfunded HKD 16.6m' },
    { label: 'Structured exposure', pct: 5, source: 'Holdings' as SourceSystem, detail: 'Autocallables referencing property indices (HKD 9.2m)' },
  ],
}

export const lauIssues = [
  {
    title: 'Credit headroom',
    summary: '0.59 pp of LTV headroom before liquidation trigger. A 1.5% collateral drawdown would breach.',
    metric: '0.59 pp',
    tone: 'critical' as const,
    source: 'Credit Facility' as SourceSystem,
  },
  {
    title: 'Upcoming liquidity need',
    summary: 'HKD 60m capital call due 30 Sep 2026 against HKD 44m of readily available liquidity.',
    metric: 'HKD 16m short',
    tone: 'critical' as const,
    source: 'CRM' as SourceSystem,
  },
  {
    title: 'Concentration exposure',
    summary: 'Greater China real estate represents 47% of liquid wealth across four channels.',
    metric: '47%',
    tone: 'warning' as const,
    source: 'Holdings' as SourceSystem,
  },
]

export const lauObjectives = [
  { title: 'Preserve family wealth', detail: 'Multi-generational capital preservation; second-generation succession by 2030.', source: 'Mandate' as SourceSystem },
  { title: 'Maintain liquidity for business obligations', detail: 'Recurring capital calls from Lau Holdings Ltd; typical HKD 30–60m annually.', source: 'RM Note' as SourceSystem },
  { title: 'Diversify away from concentrated regional exposure', detail: 'Agreed direction in 2025 annual review; progress limited by loss aversion.', source: 'Advice Ledger' as SourceSystem },
]

export const lauCredit = {
  facility: { label: 'Facility size', value: 'HKD 110.0m', source: 'Credit Facility' as SourceSystem },
  outstanding: { label: 'Outstanding balance', value: 'HKD 97.2m', source: 'Credit Facility' as SourceSystem },
  collateral: { label: 'Collateral value', value: 'HKD 140.0m', source: 'Credit Facility' as SourceSystem },
  ltv: { label: 'Current LTV', value: '69.41%', source: 'Credit Facility' as SourceSystem },
  warning: { label: 'Warning threshold', value: '65.00%', source: 'Credit Facility' as SourceSystem },
  liquidation: { label: 'Liquidation threshold', value: '70.00%', source: 'Credit Facility' as SourceSystem },
  headroom: { label: 'Headroom', value: '0.59 pp · HKD 0.83m', source: 'Credit Facility' as SourceSystem },
  obligations: { label: 'Upcoming obligations', value: 'HKD 60.0m', source: 'CRM' as SourceSystem },
  liquid: { label: 'Liquid assets available', value: 'HKD 44.0m', source: 'Holdings' as SourceSystem },
  ltvHistory: [
    { date: 'Mar', ltv: 61.2 },
    { date: 'Apr', ltv: 63.8 },
    { date: 'May', ltv: 62.9 },
    { date: 'Jun', ltv: 65.4 },
    { date: 'Jul', ltv: 67.1 },
    { date: 'Aug', ltv: 68.3 },
    { date: 'Sep', ltv: 69.41 },
  ],
  collateralComposition: [
    { label: 'HK listed equities', value: 'HKD 68.4m', lendingValue: '65%' },
    { label: 'Investment-grade bonds', value: 'HKD 41.2m', lendingValue: '85%' },
    { label: 'Global equity funds', value: 'HKD 22.7m', lendingValue: '70%' },
    { label: 'Structured notes', value: 'HKD 7.7m', lendingValue: '50%' },
  ],
}

export const lauPortfolio = {
  total: 'HKD 184.0m',
  allocation: [
    { asset: 'Equities', pct: 46, value: 'HKD 84.6m', target: '40–55%' },
    { asset: 'Fixed income', pct: 24, value: 'HKD 44.2m', target: '20–35%' },
    { asset: 'Private markets', pct: 15, value: 'HKD 27.6m', target: '5–15%' },
    { asset: 'Structured products', pct: 9, value: 'HKD 16.6m', target: '0–10%' },
    { asset: 'Cash', pct: 6, value: 'HKD 11.0m', target: '2–10%' },
  ],
  topHoldings: [
    { name: 'Sun Hung Kai Properties', ticker: '0016.HK', value: 'HKD 14.2m', pnl: '−8.4%', pledged: true },
    { name: 'HSBC Holdings', ticker: '0005.HK', value: 'HKD 12.8m', pnl: '+11.2%', pledged: true },
    { name: 'US Treasury 4.25% 2031', ticker: 'UST', value: 'HKD 11.5m', pnl: '+1.9%', pledged: true },
    { name: 'Link REIT', ticker: '0823.HK', value: 'HKD 9.6m', pnl: '−12.7%', pledged: true },
    { name: 'GC Real Estate Fund III', ticker: 'Private', value: 'HKD 9.1m', pnl: 'n/a', pledged: false },
    { name: 'Tencent Holdings', ticker: '0700.HK', value: 'HKD 8.7m', pnl: '+4.3%', pledged: false },
  ],
}

export const lauBehaviour = [
  {
    tag: 'Loss averse',
    evidenceSource: 'RM Note' as SourceSystem,
    evidenceDate: '14 Mar 2026',
    quote: 'Client expressed strong reluctance to sell positions while they were below acquisition value.',
    guidance:
      'Frame the discussion around maintaining collateral safety and optionality rather than focusing first on realised losses.',
  },
  {
    tag: 'Prefers maintaining control',
    evidenceSource: 'RM Note' as SourceSystem,
    evidenceDate: '22 Aug 2026',
    quote: 'Asked to see every option laid out before agreeing to anything; declined discretionary rebalancing authority.',
    guidance:
      'Present two or three concrete options side-by-side with the consequences of each. Avoid a single pre-selected path.',
  },
  {
    tag: 'Hesitant to liquidate strategic holdings',
    evidenceSource: 'RM Note' as SourceSystem,
    evidenceDate: '31 Mar 2026',
    quote: 'Sun Hung Kai and Link REIT are described by the client as "family positions" held for over two decades.',
    guidance:
      'Sequence any collateral top-up from non-strategic holdings first. Raise strategic positions only as a last-resort scenario.',
  },
]

export const lauFamily = {
  principal: { name: 'Lau Chi Ming', age: 64, role: 'Principal · Chairman, Lau Holdings Ltd' },
  members: [
    { name: 'Lau Mei Ling', relation: 'Spouse', age: 61, note: 'Joint account holder · Trust co-settlor' },
    { name: 'Lau Wing Yan', relation: 'Daughter', age: 34, note: 'CFO, Lau Holdings · Successor designate' },
    { name: 'Lau Ka Ho', relation: 'Son', age: 29, note: 'Based in London · Separate mandate (GBP 6m)' },
  ],
  businessObligations: [
    { label: 'Lau Holdings capital call', value: 'HKD 60m', date: '30 Sep 2026', source: 'CRM' as SourceSystem },
    { label: 'Director guarantee — Kowloon site', value: 'HKD 25m contingent', date: 'Ongoing', source: 'CRM' as SourceSystem },
  ],
  estatePlanning: {
    status: 'In progress',
    detail: 'Family trust established 2021. Succession deed for Lau Holdings drafted; awaiting sign-off by daughter.',
    source: 'RM Note' as SourceSystem,
  },
  liquidityNeeds: [
    { label: 'Capital call', value: 'HKD 60m', when: 'Sep 2026' },
    { label: 'Annual family distributions', value: 'HKD 8m', when: 'Dec 2026' },
    { label: 'London property completion (son)', value: 'GBP 2.1m', when: 'Q1 2027' },
  ],
  lifeEvents: [
    { label: "Daughter's succession to Chairman", when: '2030 (planned)' },
    { label: '65th birthday', when: 'Feb 2027' },
    { label: 'Lau Holdings 40th anniversary', when: 'Nov 2026' },
  ],
}

export interface AdviceEntry {
  id: string
  date: string
  trigger: string
  recommendation: string
  status: AdviceStatus
  outcome: string
  rmComment: string
  clientReason?: string
  followUpTrigger: string
  evidence: Evidence[]
  current?: boolean
}

export const lauAdviceHistory: AdviceEntry[] = [
  {
    id: 'adv-2026-03-31',
    date: '31 Mar 2026',
    trigger: 'LTV crossed 60% warning band after Q1 property-sector drawdown',
    recommendation: 'Increase collateral buffer.',
    status: 'Deferred',
    outcome: 'Client deferred; no collateral added.',
    clientReason: 'Preferred to wait for portfolio recovery.',
    rmComment: 'Client acknowledges risk but expects HK property to recover in H2. Agreed to revisit if LTV exceeds 65%.',
    followUpTrigger: 'LTV > 65% — met 12 Jun 2026',
    evidence: [
      { label: 'LTV at time', value: '61.2%', source: 'Credit Facility' },
      { label: 'Collateral value', value: 'HKD 152m', source: 'Credit Facility' },
    ],
  },
  {
    id: 'adv-2026-06-14',
    date: '14 Jun 2026',
    trigger: 'Review condition from March advice met (LTV 65.4%)',
    recommendation: 'Review liquidity allocation.',
    status: 'Discussed',
    outcome: 'Discussed in portfolio review; client asked for options paper.',
    rmComment: 'Options paper prepared covering bond ladder liquidation and partial fund redemption. Client to consider over summer.',
    followUpTrigger: 'Any new obligation recorded, or LTV > 68%',
    evidence: [
      { label: 'LTV at time', value: '65.4%', source: 'Credit Facility' },
      { label: 'Cash', value: 'HKD 13.9m', source: 'Holdings' },
      { label: 'Meeting note', value: '14 Jun 2026', source: 'RM Note' },
    ],
  },
  {
    id: 'adv-2026-09-05',
    date: '5 Sep 2026',
    trigger: 'HKD 60m capital call recorded (18 Aug) and LTV 69.41% within 0.59 pp of trigger',
    recommendation: 'Address collateral headroom before upcoming obligation.',
    status: 'Under Review',
    outcome: 'Awaiting RM decision.',
    rmComment: '—',
    followUpTrigger: 'Obligation due 30 Sep 2026',
    evidence: [
      { label: 'Current LTV', value: '69.41%', source: 'Credit Facility' },
      { label: 'Obligation', value: 'HKD 60m', source: 'CRM' },
      { label: 'Prior advice', value: 'Deferred 31 Mar', source: 'Advice Ledger' },
    ],
    current: true,
  },
]

/* ---------- Action Queue ---------- */

export type ActionStatus = 'Awaiting Review' | 'Approved' | 'Deferred' | 'Completed' | 'Rejected'

export interface ActionItem {
  id: string
  clientId: string
  client: string
  type: string
  priority: Priority
  workflow: string
  prepared: string[]
  compliance?: string
  status: ActionStatus
  created: string
  due?: string
  approvals: { label: string; done: boolean }[]
  message?: string
  evidence?: Evidence[]
}

export const actionQueue: ActionItem[] = [
  {
    id: 'act-001',
    clientId: 'lau-chi-ming',
    client: 'Lau Chi Ming',
    type: 'Credit & Liquidity',
    priority: 'ACTION REQUIRED',
    workflow: 'Arrange urgent credit review',
    prepared: ['Client message', 'Meeting agenda', 'Supporting calculations', 'Credit specialist referral'],
    compliance: 'Credit specialist approval required',
    status: 'Awaiting Review',
    created: 'Today, 06:14',
    due: 'Today',
    approvals: [
      { label: 'RM approval', done: false },
      { label: 'Credit specialist review', done: false },
    ],
    message:
      'Your current collateral position has moved close to the agreed facility threshold. Given your upcoming liquidity requirement, I would like to review the available options with you before the position becomes more constrained.',
    evidence: [
      { label: 'Current LTV', value: '69.41%', source: 'Credit Facility' },
      { label: 'Trigger', value: '70%', source: 'Credit Facility' },
      { label: 'Upcoming obligation', value: 'HKD 60m', source: 'CRM' },
      { label: 'Funding shortfall', value: 'HKD 16m', source: 'Holdings' },
    ],
  },
  {
    id: 'act-002',
    clientId: 'margarethe-keller',
    client: 'Margarethe Keller',
    type: 'Mandate & Compliance',
    priority: 'ACTION REQUIRED',
    workflow: 'Begin suitability and mandate review',
    prepared: ['Suitability review', 'Allocation comparison', 'Client explanation'],
    compliance: 'Suitability sign-off required',
    status: 'Awaiting Review',
    created: 'Today, 06:14',
    due: 'Before 16:30 meeting',
    approvals: [
      { label: 'RM approval', done: false },
      { label: 'Suitability officer', done: false },
    ],
    message:
      'Ahead of our mandate review this afternoon, I have prepared a comparison of your current allocation against your stated Conservative profile. I would like to walk through this with you and agree whether the profile or the allocation should be adjusted.',
    evidence: [
      { label: 'Equity allocation', value: '71%', source: 'Holdings' },
      { label: 'Profile', value: 'Conservative', source: 'Suitability' },
      { label: 'Profile equity ceiling', value: '35%', source: 'Mandate' },
    ],
  },
  {
    id: 'act-003',
    clientId: 'andreas-lindqvist',
    client: 'Andreas Lindqvist',
    type: 'Capital Deployment',
    priority: 'RM CHECK-IN',
    workflow: 'Revisit capital deployment plan',
    prepared: ['Proposed allocation', 'Client talking points', 'Meeting invitation'],
    status: 'Awaiting Review',
    created: 'Today, 06:14',
    due: 'Before 14:00 meeting',
    approvals: [{ label: 'RM approval', done: false }],
    message:
      'When we spoke in March you preferred to hold cash until markets settled. Cash has since risen to 45% of the portfolio, well above the 18% ceiling in your mandate. I would like to use our review today to revisit a phased deployment plan.',
    evidence: [
      { label: 'Cash', value: '45%', source: 'Holdings' },
      { label: 'Mandate maximum', value: '18%', source: 'Mandate' },
      { label: 'Prior advice', value: 'Deferred 31 Mar', source: 'Advice Ledger' },
    ],
  },
  {
    id: 'act-004',
    clientId: 'chalermchai-suphanburi',
    client: 'Chalermchai Suphanburi',
    type: 'Wealth Planning',
    priority: 'FOLLOW-UP',
    workflow: 'Schedule retirement review',
    prepared: ['Meeting invitation', 'Drawdown projection'],
    status: 'Approved',
    created: 'Yesterday, 17:40',
    approvals: [{ label: 'RM approval', done: true }],
  },
  {
    id: 'act-005',
    clientId: 'ravi-chandrasekaran',
    client: 'Ravi Chandrasekaran',
    type: 'Documentation',
    priority: 'REVIEW',
    workflow: 'Request updated valuation documents',
    prepared: ['Client message', 'Document checklist'],
    status: 'Deferred',
    created: '28 Aug 2026',
    approvals: [{ label: 'RM approval', done: false }],
  },
  {
    id: 'act-006',
    clientId: 'tan-boon-huat',
    client: 'Tan Boon Huat',
    type: 'Estate Planning',
    priority: 'FOLLOW-UP',
    workflow: 'Circulate estate-planning agenda',
    prepared: ['Meeting agenda', 'Trust structure summary'],
    status: 'Completed',
    created: '02 Sep 2026',
    approvals: [{ label: 'RM approval', done: true }],
  },
]

/* ---------- Advice Ledger ---------- */

export interface LedgerRow {
  id: string
  clientId: string
  client: string
  recommendation: string
  category: string
  created: string
  status: AdviceStatus
  nextReview: string
  reviewTrigger: string
  lastAction: string
  highlighted?: boolean
  lifecycle: { date: string; event: string; status: AdviceStatus; note?: string; source?: SourceSystem }[]
}

export const adviceLedger: LedgerRow[] = [
  {
    id: 'led-001',
    clientId: 'andreas-lindqvist',
    client: 'Andreas Lindqvist',
    recommendation: 'Deploy excess cash',
    category: 'Capital Deployment',
    created: '31 Mar 2026',
    status: 'Resurfaced',
    nextReview: '14:00 today',
    reviewTrigger: 'Cash remains above 30%',
    lastAction: 'Resurfaced 05 Sep 2026',
    highlighted: true,
    lifecycle: [
      { date: '31 Mar 2026', event: 'Recommendation raised — deploy excess cash via 3-tranche plan', status: 'Raised', source: 'Advice Ledger' },
      { date: '31 Mar 2026', event: 'Discussed with client during quarterly review', status: 'Discussed', note: 'Client preferred to hold cash until rate path clearer.', source: 'RM Note' },
      { date: '31 Mar 2026', event: 'Client deferred. Review condition set: cash remains above 30%', status: 'Deferred', source: 'Advice Ledger' },
      { date: '05 Sep 2026', event: 'Review condition met — cash 45% (target 2–18%)', status: 'Resurfaced', note: 'Cash has risen from 38% to 45% since deferral.', source: 'Holdings' },
    ],
  },
  {
    id: 'led-002',
    clientId: 'lau-chi-ming',
    client: 'Lau Chi Ming',
    recommendation: 'Address collateral headroom before upcoming obligation',
    category: 'Credit & Liquidity',
    created: '05 Sep 2026',
    status: 'Under Review',
    nextReview: 'Today',
    reviewTrigger: 'Obligation due 30 Sep 2026',
    lastAction: 'Raised 05 Sep 2026',
    lifecycle: [
      { date: '05 Sep 2026', event: 'Recommendation raised', status: 'Raised', source: 'Advice Ledger' },
      { date: '05 Sep 2026', event: 'Under RM review — action prepared in queue', status: 'Under Review' },
    ],
  },
  {
    id: 'led-003',
    clientId: 'lau-chi-ming',
    client: 'Lau Chi Ming',
    recommendation: 'Increase collateral buffer',
    category: 'Credit & Liquidity',
    created: '31 Mar 2026',
    status: 'Deferred',
    nextReview: 'Superseded',
    reviewTrigger: 'LTV > 65% (met 12 Jun 2026)',
    lastAction: 'Discussed 14 Jun 2026',
    lifecycle: [
      { date: '31 Mar 2026', event: 'Recommendation raised after Q1 drawdown', status: 'Raised', source: 'Advice Ledger' },
      { date: '31 Mar 2026', event: 'Client deferred — preferred to wait for recovery', status: 'Deferred', source: 'RM Note' },
      { date: '14 Jun 2026', event: 'Resurfaced and discussed; options paper prepared', status: 'Discussed', source: 'RM Note' },
    ],
  },
  {
    id: 'led-004',
    clientId: 'margarethe-keller',
    client: 'Margarethe Keller',
    recommendation: 'Realign equity allocation to Conservative profile',
    category: 'Mandate & Compliance',
    created: '05 Sep 2026',
    status: 'Raised',
    nextReview: '16:30 today',
    reviewTrigger: 'Mandate review outcome',
    lastAction: 'Raised 05 Sep 2026',
    lifecycle: [{ date: '05 Sep 2026', event: 'Recommendation raised', status: 'Raised', source: 'Advice Ledger' }],
  },
  {
    id: 'led-005',
    clientId: 'chalermchai-suphanburi',
    client: 'Chalermchai Suphanburi',
    recommendation: 'Establish retirement drawdown structure',
    category: 'Wealth Planning',
    created: '02 Jul 2026',
    status: 'Raised',
    nextReview: '15 Sep 2026',
    reviewTrigger: 'No client response within 30 days',
    lastAction: 'Message sent 18 Aug 2026',
    lifecycle: [
      { date: '02 Jul 2026', event: 'Recommendation raised', status: 'Raised', source: 'Advice Ledger' },
      { date: '18 Aug 2026', event: 'Client message sent — no response', status: 'Raised', source: 'CRM' },
    ],
  },
  {
    id: 'led-006',
    clientId: 'priscilla-ng',
    client: 'Priscilla Ng',
    recommendation: 'Hedge USD exposure on SGD liabilities',
    category: 'FX & Hedging',
    created: '20 May 2026',
    status: 'Resurfaced',
    nextReview: 'Today',
    reviewTrigger: 'USD/SGD > 1.30',
    lastAction: 'Resurfaced 04 Sep 2026',
    lifecycle: [
      { date: '20 May 2026', event: 'Recommendation raised', status: 'Raised', source: 'Advice Ledger' },
      { date: '27 May 2026', event: 'Client deferred — considered hedge cost too high', status: 'Deferred', source: 'RM Note' },
      { date: '04 Sep 2026', event: 'USD/SGD crossed 1.30 — review condition met', status: 'Resurfaced', source: 'Holdings' },
    ],
  },
  {
    id: 'led-007',
    clientId: 'tan-boon-huat',
    client: 'Tan Boon Huat',
    recommendation: 'Consolidate offshore trust structures',
    category: 'Estate Planning',
    created: '12 Feb 2026',
    status: 'Accepted',
    nextReview: '12 Feb 2027',
    reviewTrigger: 'Annual review',
    lastAction: 'Accepted 03 Mar 2026',
    lifecycle: [
      { date: '12 Feb 2026', event: 'Recommendation raised', status: 'Raised', source: 'Advice Ledger' },
      { date: '03 Mar 2026', event: 'Client accepted; trust counsel engaged', status: 'Accepted', source: 'RM Note' },
    ],
  },
  {
    id: 'led-008',
    clientId: 'ravi-chandrasekaran',
    client: 'Ravi Chandrasekaran',
    recommendation: 'Reduce single-manager private equity concentration',
    category: 'Portfolio Construction',
    created: '09 Jan 2026',
    status: 'Rejected',
    nextReview: '—',
    reviewTrigger: 'None set',
    lastAction: 'Rejected 15 Jan 2026',
    lifecycle: [
      { date: '09 Jan 2026', event: 'Recommendation raised', status: 'Raised', source: 'Advice Ledger' },
      { date: '15 Jan 2026', event: 'Client rejected — strong conviction in manager', status: 'Rejected', source: 'RM Note' },
    ],
  },
]

/* ---------- Recommendation panel: Lau Chi Ming ---------- */

export const lauRecommendation = {
  primary:
    'Arrange an immediate credit review and identify additional collateral or liquid assets before the upcoming obligation.',
  reasons: [
    { text: 'LTV is 69.41% against a 70% liquidation trigger.', source: 'Credit Facility' as SourceSystem },
    { text: 'Available liquidity is HKD 16m below the upcoming obligation.', source: 'Holdings' as SourceSystem },
    { text: 'Previous collateral-buffer advice was deferred.', source: 'Advice Ledger' as SourceSystem },
  ],
  tradeoffs: [
    { title: 'Liquidating assets', detail: 'May crystallise losses on positions currently below acquisition value.' },
    { title: 'Adding collateral', detail: 'May reduce liquidity elsewhere and constrain other planned obligations.' },
  ],
  specialistReview: 'Credit specialist review required',
  communicationGuidance:
    'Lead with protecting liquidity and collateral flexibility. Present acting now versus delaying side-by-side.',
}

export const clients = [
  { id: 'lau-chi-ming', name: 'Lau Chi Ming', domicile: 'Hong Kong', mandate: 'Balanced Growth', value: 'HKD 184m', priority: 'ACTION REQUIRED' as Priority, lastContact: '22 Aug 2026' },
  { id: 'margarethe-keller', name: 'Margarethe Keller', domicile: 'Zürich', mandate: 'Conservative', value: 'CHF 62m', priority: 'ACTION REQUIRED' as Priority, lastContact: '30 Aug 2026' },
  { id: 'andreas-lindqvist', name: 'Andreas Lindqvist', domicile: 'Stockholm', mandate: 'Growth', value: 'USD 48m', priority: 'RM CHECK-IN' as Priority, lastContact: '14 Jun 2026' },
  { id: 'chalermchai-suphanburi', name: 'Chalermchai Suphanburi', domicile: 'Bangkok', mandate: 'Income', value: 'USD 38m', priority: 'FOLLOW-UP' as Priority, lastContact: '18 Aug 2026' },
  { id: 'ravi-chandrasekaran', name: 'Ravi Chandrasekaran', domicile: 'Singapore', mandate: 'Growth', value: 'USD 71m', priority: 'REVIEW' as Priority, lastContact: '12 Aug 2026' },
  { id: 'tan-boon-huat', name: 'Tan Boon Huat', domicile: 'Singapore', mandate: 'Balanced', value: 'SGD 95m', priority: 'FOLLOW-UP' as Priority, lastContact: '02 Sep 2026' },
  { id: 'priscilla-ng', name: 'Priscilla Ng', domicile: 'Singapore', mandate: 'Balanced Growth', value: 'SGD 41m', priority: 'RM CHECK-IN' as Priority, lastContact: '27 May 2026' },
]
