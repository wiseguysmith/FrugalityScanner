import { NextResponse } from "next/server";
import { type AssessmentAnswers, type ScoreResult } from "@/lib/assessment";
import { generateFallbackReport } from "@/lib/report";
import { hasSupabaseConfig, insertAssessment, insertResponses } from "@/lib/supabase-rest";

type SubmitPayload = {
  contact: Record<string, string>;
  answers: AssessmentAnswers;
  scores: ScoreResult;
  otherInputs?: Record<string, unknown>;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as SubmitPayload;
  const contactName = payload.contact.firstName ?? "";
  const companyName = payload.contact.company ?? "";
  const report = generateFallbackReport(payload.answers, payload.scores, contactName, companyName);

  const record = {
    first_name: payload.contact.firstName,
    last_name: payload.contact.lastName,
    email: payload.contact.email,
    phone: payload.contact.phone || null,
    linkedin_url: payload.contact.linkedinUrl || null,
    company: payload.contact.company,
    website: payload.contact.website,
    organization_type:
      payload.answers.organizationType === "Other" && payload.otherInputs?.organizationTypeOther
        ? `Other: ${payload.otherInputs.organizationTypeOther}`
        : payload.answers.organizationType,
    business_goal: payload.answers.businessGoal,
    team_size: payload.answers.teamSize,
    operational_intelligence_index: payload.scores.operationalIntelligenceIndex,
    operational_friction_score: payload.scores.operationalFrictionScore,
    founder_dependency_index: payload.scores.founderDependencyIndex,
    structural_debt_score: payload.scores.structuralDebtScore,
    opportunity_low: payload.scores.opportunityLow,
    opportunity_high: payload.scores.opportunityHigh,
    top_findings: payload.scores.topFindings,
    full_report: report,
    n8n_status: "not_sent",
    email_status: process.env.RESEND_API_KEY ? "pending" : "fallback_report_ready",
  };

  let assessmentId = `local-${Date.now()}`;
  let storageStatus = "local_fallback";

  if (hasSupabaseConfig()) {
    const inserted = await insertAssessment(record);
    assessmentId = inserted.id;
    storageStatus = "stored";

    // Store all answer fields plus other-input overrides
    const responseRows = [
      ...Object.entries(payload.answers).map(([question_key, answer_value]) => ({
        assessment_id: assessmentId,
        question_key,
        answer_value,
      })),
      // Persist "Other" typed values as additional response rows
      ...(payload.otherInputs
        ? Object.entries(payload.otherInputs).flatMap(([key, value]) => {
            if (key === "toolGroupOthers" && value && typeof value === "object") {
              return Object.entries(value as Record<string, string>).map(([group, text]) => ({
                assessment_id: assessmentId,
                question_key: `toolGroup_other_${group}`,
                answer_value: text,
              }));
            }
            return value
              ? [{ assessment_id: assessmentId, question_key: key, answer_value: value }]
              : [];
          })
        : []),
    ];

    await insertResponses(responseRows);
  }

  const WEBHOOK_URL =
    process.env.N8N_WEBHOOK_URL ||
    "https://mind-fultechnologies.app.n8n.cloud/webhook/frugality-scanner";

  let n8nStatus = "not_configured";
  if (WEBHOOK_URL) {
    try {
      const webhookResponse = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessment_id: assessmentId,
          contact: {
            ...payload.contact,
            name: `${payload.contact.firstName} ${payload.contact.lastName}`.trim(),
          },
          company: { name: payload.contact.company, website: payload.contact.website },
          responses: payload.answers,
          other_inputs: payload.otherInputs ?? {},
          scores: payload.scores,
          top_findings: payload.scores.topFindings,
          opportunity_estimate: {
            low: payload.scores.opportunityLow,
            high: payload.scores.opportunityHigh,
          },
          fallback_report: report,
        }),
      });
      n8nStatus = webhookResponse.ok ? "sent" : "failed";
    } catch {
      n8nStatus = "failed";
    }
  }

  return NextResponse.json({
    ok: true,
    assessmentId,
    storageStatus,
    n8nStatus,
    reportQueued: true,
  });
}
