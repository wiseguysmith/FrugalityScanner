export type OrganizationType =
  | "Digital Startup"
  | "Hardware / DeepTech Startup"
  | "Professional Services"
  | "Individual Professional"
  | "Real Estate / Property Services"
  | "Hospitality / Tourism"
  | "NGO / Foundation"
  | "Commercial Firm"
  | "Other";

export type AssessmentAnswers = {
  organizationType: OrganizationType | "";
  businessGoal: string;
  teamSize: string;
  tools: string[];
  // Business Metrics (0 = best, 5 = worst)
  dataReentry: number;        // Automation Level
  leadDropOff: number;        // Leakage %
  founderFatigue: number;     // Founder Fatigue (hours/week proxy)
  processComplexity: number;  // Process Complexity
  documentationMaturity: number; // Documentation Maturity (0=codified, 5=tribal)
  founderDependency: number;  // Founder Dependency
  // Finance
  hourlyValue: number;
  monthlyOpportunities: number;
  averageDealSize: number;
};

export type ScoreResult = {
  operationalIntelligenceIndex: number;
  operationalFrictionScore: number;
  founderDependencyIndex: number;
  structuralDebtScore: number;
  opportunityLow: number;
  opportunityHigh: number;
  topFindings: string[];
};

export const initialAnswers: AssessmentAnswers = {
  organizationType: "",
  businessGoal: "",
  teamSize: "",
  tools: [],
  // Sliders start at 0; the form tracks "touched" state separately
  dataReentry: 0,
  leadDropOff: 0,
  founderFatigue: 0,
  processComplexity: 0,
  documentationMaturity: 0,
  founderDependency: 0,
  hourlyValue: 75,
  monthlyOpportunities: 80,
  averageDealSize: 2500,
};

export const organizationTypes: OrganizationType[] = [
  "Digital Startup",
  "Hardware / DeepTech Startup",
  "Professional Services",
  "Individual Professional",
  "Real Estate / Property Services",
  "Hospitality / Tourism",
  "NGO / Foundation",
  "Commercial Firm",
  "Other",
];

export const businessGoals: Record<string, string[]> = {
  startup: [
    "Secure funding or grant support",
    "Launch or scale a product",
    "Validate MVP or new feature",
    "Stop founders/developers from doing admin work",
    "Automate recurring manual processes",
    "Other",
  ],
  commercial: [
    "Stop lead leakage and automate onboarding",
    "Protect operating margins by lowering internal costs",
    "Reclaim executive time from paperwork",
    "Standardize internal team workflows",
    "Automate recurring manual processes",
    "Other",
  ],
  ngo: [
    "Optimize donor or participant onboarding",
    "Improve internal project coordination",
    "Streamline reporting structures",
    "Automate recurring manual processes",
    "Other",
  ],
};

export const teamSizes = [
  "Solo / 1 person",
  "Lean Core / 2–5 people",
  "Scaling Team / 6–15 people",
  "Established Operation / 15+ people",
];

export const toolGroups = [
  { label: "Communication", tools: ["WhatsApp", "Slack", "Microsoft Teams", "Other"] },
  { label: "Email", tools: ["Gmail", "Outlook", "Other"] },
  {
    label: "CRM",
    tools: ["HubSpot", "Salesforce", "Pipedrive", "Zoho CRM", "Leadsales", "Kommo", "ManyChat", "Other"],
  },
  {
    label: "Project Management",
    tools: ["ClickUp", "Asana", "Monday", "Trello", "Jira", "Linear", "Other"],
  },
  {
    label: "Data / Documentation",
    tools: ["Google Sheets", "Excel", "Notion", "Google Drive", "OneDrive", "Other"],
  },
  { label: "Finance", tools: ["Stripe", "PayPal", "QuickBooks", "Other"] },
  {
    label: "Customer Support / Intake",
    tools: ["Zendesk", "Intercom", "Freshdesk", "Typeform", "Tally", "Google Forms", "Other"],
  },
];

export type MetricDefinition = {
  key: keyof AssessmentAnswers;
  label: string;
  sublabel?: string;
  shortDesc: string;
  scaleLabels: string[];
  detailExpanded: string;
};

export const metricDefinitions: MetricDefinition[] = [
  {
    key: "dataReentry",
    label: "Automation Level",
    shortDesc:
      "How much time your team loses manually copying, pasting, or re-typing data across disconnected systems.",
    scaleLabels: [
      "0 — Full Automation",
      "1 — Very Low Drag",
      "2 — Low Drag",
      "3 — Moderate Drag",
      "4 — High Drag",
      "5 — Critical Drag",
    ],
    detailExpanded: `When tools don't share data seamlessly, people become the manual bridge between systems — a pattern called double digitization.

0 — Full Automation: Data moves seamlessly (CRM → WhatsApp → invoicing → projects). No manual entry required.
1 — Very Low: Core pipelines are integrated; only occasional minor adjustments needed.
2 — Low: Basic integrations exist but the team still manually syncs a few data points daily.
3 — Moderate Drag: Copy-pasting closed leads into invoicing or project trackers is routine.
4 — High Drag: Significant weekly time spent duplicating files across disconnected platforms.
5 — Critical Drag / The Human Bridge: Operations rely heavily on manual data transfer. Senior people retype identical records, causing execution lag and cognitive fatigue.`,
  },
  {
    key: "leadDropOff",
    label: "Leakage %",
    shortDesc:
      "Pipeline leakage caused by slow follow-up, manual routing, and disconnected communication tools.",
    scaleLabels: [
      "0 — 0% Leakage",
      "1 — ~5% Leakage",
      "2 — ~15% Leakage",
      "3 — ~25% Leakage",
      "4 — ~35% Leakage",
      "5 — ~50% Leakage",
    ],
    detailExpanded: `High-intent prospects cool off because intake, verification, and follow-up depend on human response speed instead of instant system triggers.

0 — Instant Recovery / 0% Leakage: Inbound captured and routed instantly. Response under 5 minutes.
1 — Very Low / 5% Leakage: Basic automated workflows with only minor delays.
2 — Low / 15% Leakage: Basic CRM tracking exists, but manual syncing slows follow-up to hours.
3 — Moderate / 25% Leakage: Leads cool off because data is split across WhatsApp, email, and spreadsheets.
4 — High / 35% Leakage: No single source of truth causes high-value opportunities to slip through.
5 — Critical / 50% Leakage: Half of incoming leads go cold due to slow manual coordination.`,
  },
  {
    key: "founderFatigue",
    label: "Founder Fatigue",
    sublabel: "Hours/week",
    shortDesc:
      "How many hours per week leadership loses to routine administration instead of growth, sales, or strategy.",
    scaleLabels: [
      "0 — 0 hrs/week",
      "1 — ~2 hrs/week",
      "2 — ~5 hrs/week",
      "3 — ~10 hrs/week",
      "4 — ~15 hrs/week",
      "5 — 20+ hrs/week",
    ],
    detailExpanded: `This reflects tactical capacity loss when high-leverage leadership talent is pulled into low-leverage administrative work.

0 — Zero Drag / 0 hrs/week: Leadership capacity focused on strategy, revenue, or capital.
1 — Minimal / ~2 hrs/week: Admin mostly automated; only quick weekly oversight needed.
2 — Low / ~5 hrs/week: Operations run, but tool fragmentation creates small weekly manual tasks.
3 — Moderate Fatigue / ~10 hrs/week: Admin regularly distracts leadership from strategy.
4 — High Fatigue / ~15 hrs/week: Nearly two workdays/week spent manually updating disconnected systems.
5 — Critical Fatigue / 20+ hrs/week: Founders trapped in manual admin loops that create a ceiling on growth.`,
  },
  {
    key: "processComplexity",
    label: "Process Complexity",
    shortDesc: "The friction and structural weight of core workflows from start to finish.",
    scaleLabels: [
      "0 — Frictionless",
      "1 — Very Low",
      "2 — Low",
      "3 — Moderate Complexity",
      "4 — High Complexity",
      "5 — Critical / The Maze",
    ],
    detailExpanded: `Tracks over-processing and motion waste: too many handoffs, undocumented steps, redundant approvals, and ad-hoc workarounds.

0 — Frictionless: Workflows fully optimized and standardized. Zero manual overhead.
1 — Very Low: Clear and mostly standardized; minor adjustments occur only occasionally.
2 — Low: SOPs exist, but 1–2 manual checkpoints or legacy handoffs remain.
3 — Moderate: Workflows tangle; custom requests require manual tracking.
4 — High: Standard delivery requires navigating undocumented steps or redundant approvals.
5 — Critical / The Maze: Workflows so convoluted that tasks are dropped. Completion requires constant troubleshooting.`,
  },
  {
    key: "documentationMaturity",
    label: "Documentation Maturity",
    shortDesc:
      "How much operational knowledge lives in a centralized source of truth versus inside people's heads.",
    scaleLabels: [
      "0 — Fully Codified",
      "1 — High Maturity",
      "2 — Moderate Maturity",
      "3 — Tribal Fragmentation",
      "4 — High Knowledge Debt",
      "5 — Critical / The Tribal Vault",
    ],
    detailExpanded: `Lack of documentation creates knowledge debt, repeated questions, execution errors, and dependency on specific people.

0 — Fully Codified: Core processes in a centralized source of truth. A new hire can execute asynchronously.
1 — High Maturity: Core workflows documented; edge cases still need occasional clarification.
2 — Moderate Maturity: SOPs exist but are not updated consistently.
3 — Tribal Fragmentation: Docs scattered across Slack, personal drives, email, and random files.
4 — High Knowledge Debt: Processes mostly live in people's heads and must be repeatedly explained.
5 — Critical / The Tribal Vault: No centralized docs. Delivery freezes when a key person is unavailable.`,
  },
  {
    key: "founderDependency",
    label: "Founder Dependency",
    shortDesc:
      "How much daily execution depends on the founder's presence, approvals, memory, or manual oversight.",
    scaleLabels: [
      "0 — Autonomous Execution",
      "1 — Minimal Intervention",
      "2 — Low Dependency",
      "3 — Moderate Dependency",
      "4 — High Dependency",
      "5 — Absolute Lock / The Bottleneck",
    ],
    detailExpanded: `Determines whether the business is becoming a scalable organization or a high-overhead job where the founder is the bottleneck.

0 — Autonomous: Routine operations run through clear systems, triggers, and standardized team frameworks.
1 — Minimal: Leadership needed only for edge cases or strategic alignment.
2 — Low: Standard days run smoothly; 1–2 milestones still need founder check-in or approval.
3 — Moderate: Work regularly stalls until the founder unblocks a task or explains a process.
4 — High: Team lacks systems to execute asynchronously; founder drives standard work.
5 — Absolute Lock / The Bottleneck: No structural memory. Execution freezes when leadership is unavailable.`,
  },
];

export function goalBucket(type: OrganizationType | "") {
  if (type.includes("Startup")) return "startup";
  if (type.includes("NGO")) return "ngo";
  return "commercial";
}

export function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
