import { NextResponse } from "next/server";

const WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ||
  "https://mind-fultechnologies.app.n8n.cloud/webhook/frugality-scanner";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "nps_feedback",
        assessment_id: body.assessmentId ?? null,
        contact: body.contact ?? {},
        nps_score: body.npsScore,
        nps_category:
          body.npsScore >= 9
            ? "promoter"
            : body.npsScore >= 7
              ? "passive"
              : "detractor",
        feedback: body.feedback ?? "",
      }),
    });
  } catch {
    // non-blocking — still return success so user isn't affected
  }

  return NextResponse.json({ ok: true });
}
