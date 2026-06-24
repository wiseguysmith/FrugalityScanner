import type { AssessmentAnswers, ScoreResult } from "./assessment";

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function scoreAssessment(answers: AssessmentAnswers): ScoreResult {
  const fragmentation = Math.min(5, Math.max(1, Math.ceil(answers.tools.length / 5)));

  // All metrics: 0 = best, 5 = worst — used directly in averages
  const frictionAverage =
    (answers.dataReentry + answers.leadDropOff + answers.processComplexity + answers.documentationMaturity) / 4;
  const founderAverage = (answers.founderFatigue + answers.founderDependency) / 2;
  const structuralAverage = (fragmentation + answers.processComplexity + answers.documentationMaturity) / 3;

  const operationalFrictionScore = clamp(frictionAverage * 20);
  const founderDependencyIndex = clamp(founderAverage * 20);
  const structuralDebtScore = clamp(structuralAverage * 20);
  const operationalIntelligenceIndex = clamp(
    100 - operationalFrictionScore * 0.38 - founderDependencyIndex * 0.28 - structuralDebtScore * 0.34,
  );

  const adminRecovery = answers.founderFatigue * 3.5 * answers.hourlyValue;
  const leadRecovery = answers.monthlyOpportunities * (answers.leadDropOff / 5) * 0.08 * answers.averageDealSize;
  const processRecovery = answers.processComplexity * 180;
  const opportunityMid = adminRecovery + leadRecovery + processRecovery;
  const opportunityLow = Math.max(300, Math.round((opportunityMid * 0.55) / 100) * 100);
  const opportunityHigh = Math.max(opportunityLow + 700, Math.round((opportunityMid * 1.35) / 100) * 100);

  return {
    operationalIntelligenceIndex,
    operationalFrictionScore,
    founderDependencyIndex,
    structuralDebtScore,
    opportunityLow,
    opportunityHigh,
    topFindings: topFindings({
      operationalFrictionScore,
      founderDependencyIndex,
      structuralDebtScore,
      answers,
    }),
  };
}

function topFindings(input: {
  operationalFrictionScore: number;
  founderDependencyIndex: number;
  structuralDebtScore: number;
  answers: AssessmentAnswers;
}) {
  const findings = [
    {
      score: input.answers.leadDropOff,
      text: "Lead Leakage: inbound opportunities are likely losing value because follow-up is slower than the business can afford.",
    },
    {
      score: input.answers.dataReentry,
      text: "Automation Gap: manual re-entry is consuming time that should be reserved for selling, delivery, or strategic execution.",
    },
    {
      score: input.founderDependencyIndex / 20,
      text: "Founder Dependency: leadership intervention appears to be required too often for routine work to keep moving.",
    },
    {
      score: input.structuralDebtScore / 20,
      text: "Structural Debt: tool fragmentation and undocumented workflows are raising coordination costs.",
    },
    {
      score: input.answers.processComplexity,
      text: "Process Complexity: high-value people may be carrying low-value coordination work across the workflow.",
    },
    {
      score: input.answers.documentationMaturity,
      text: "Knowledge Debt: operational knowledge living in people's heads instead of documented systems creates execution risk.",
    },
  ];

  return findings
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((f) => f.text);
}
