import { currency, type AssessmentAnswers, type ScoreResult } from "./assessment";

export function generateFallbackReport(answers: AssessmentAnswers, scores: ScoreResult) {
  return [
    "Executive Summary",
    `The diagnostic indicates an Operational Intelligence Index of ${scores.operationalIntelligenceIndex}/100. The primary opportunity is to reduce recurring workflow drag before it compounds into a larger cost centre.`,
    "",
    "Friction Analysis",
    `The Operational Friction Score is ${scores.operationalFrictionScore}/100. Manual handoffs, slow response loops, and fragmented ownership should be reviewed first.`,
    "",
    "Structural Debt Assessment",
    `The Structural Debt Score is ${scores.structuralDebtScore}/100 across ${answers.tools.length} selected tools. Frugal Studio and Mindful Tech should map the handoffs between these systems before recommending automation.`,
    "",
    "Founder Dependency Analysis",
    `The Founder Dependency Index is ${scores.founderDependencyIndex}/100. Leadership time appears to be absorbed by operational coordination that can likely be delegated, documented, or systemised.`,
    "",
    "Potential Savings Opportunity",
    `${currency(scores.opportunityLow)}–${currency(scores.opportunityHigh)} per month could potentially be recovered through better process design, automation, and operating cadence. This is a diagnostic estimate — not a guarantee.`,
    "",
    "Top Operational Bottlenecks",
    ...scores.topFindings.map((finding, index) => `${index + 1}. ${finding}`),
    "",
    "Recommended Operational Fixes",
    "1. Document the current lead-to-delivery workflow and identify every manual handoff.",
    "2. Define response-time ownership for inbound opportunities.",
    "3. Consolidate duplicate data capture and create a single source-of-truth policy.",
    "4. Automate only after process ownership and exception paths are clear.",
    "",
    "Recommended Next Step",
    "Book a Frugal Audit with Frugal Studio powered by Mindful Tech to validate the findings, quantify the highest-value workflow improvements, and design an execution plan.",
  ].join("\n");
}
