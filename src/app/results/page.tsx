"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, FileText } from "lucide-react";
import { currency, metricDefinitions, type AssessmentAnswers, type ScoreResult } from "@/lib/assessment";
import { ScoreDial } from "@/components/ScoreDial";

const BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2_Rp7RRFppwCG3x-cR9AguNsBnlwt84k5EWDaKDTewkmc72flE0i_IH3m0YJVABnEhaakYuAdE";

type ContactInfo = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  website: string;
  linkedinUrl: string;
  phone: string;
};

type StoredAssessment = {
  contact: ContactInfo;
  answers: AssessmentAnswers;
  scores: ScoreResult;
  otherInputs?: Record<string, unknown>;
};

export default function ResultsPage() {
  const router = useRouter();
  const submitted = useRef(false);
  const [stored, setStored] = useState<StoredAssessment | null>(null);
  const [ready, setReady] = useState(false);
  const [reportStatus, setReportStatus] = useState<"sending" | "sent" | "error">("sending");
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem("frugality-assessment");
    setStored(raw ? JSON.parse(raw) : null);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!stored || submitted.current) return;
    submitted.current = true;

    fetch("/api/submit-assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contact: {
          ...stored.contact,
          name: `${stored.contact.firstName} ${stored.contact.lastName}`.trim(),
        },
        answers: stored.answers,
        scores: stored.scores,
        otherInputs: stored.otherInputs ?? {},
      }),
    })
      .then((res) => {
        setReportStatus(res.ok ? "sent" : "error");
        if (res.ok) window.localStorage.removeItem("frugality-assessment");
      })
      .catch(() => setReportStatus("error"));
  }, [stored]);

  if (!ready) {
    return <main className="min-h-screen bg-[var(--panel)]" />;
  }

  if (!stored) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-xl border border-[var(--line)] bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-[var(--petrol)]">No assessment found</h1>
          <a
            className="mt-5 inline-flex rounded-lg bg-[var(--tangerine)] px-5 py-3 font-bold text-white hover:bg-[var(--accent-strong)]"
            href="/assessment"
          >
            Start Free Diagnostic
          </a>
        </div>
      </main>
    );
  }

  const { scores, contact, answers } = stored;

  function handleReceiveReport() {
    setConfirmVisible(true);
    setTimeout(() => router.push("/thank-you"), 2400);
  }

  return (
    <main className="min-h-screen bg-[var(--panel)] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--tangerine)]">
            Frugal Studio powered by Mindful Tech
          </div>
          <h1 className="mt-2 text-4xl font-bold text-[var(--petrol)]">
            {contact.company ? `${contact.company} — ` : ""}Frugality Scores
          </h1>
          <p className="mt-1 text-[var(--ink-muted)]">
            Prepared for {contact.firstName} {contact.lastName}
          </p>
        </header>

        {/* ── CTA + status banners — ABOVE scores ─────────────────────── */}
        <div className="mb-8 rounded-xl border border-[var(--line)] bg-white p-5 shadow-sm">
          {confirmVisible ? (
            <div className="flex items-center gap-3">
              <CheckCircle size={18} className="shrink-0 text-[var(--tangerine)]" />
              <span className="text-sm text-[var(--charcoal)]">
                Your full report is on its way to{" "}
                <strong className="text-[var(--tangerine)]">{contact.email}</strong>. Redirecting…
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-semibold text-[var(--petrol)]">Get more insights and details by receiving your Full Frugality Scan Report</div>
                <div className="mt-1 text-sm text-[var(--ink-muted)]">
                  {reportStatus === "sending"
                    ? "Creating your full report — it only takes a moment. Please check your email's spam folder."
                    : reportStatus === "error"
                      ? "There was an issue preparing your report. Click below to proceed anyway."
                      : "Your report is ready. Click below to have it sent to your email."}
                </div>
              </div>
              <button
                type="button"
                onClick={handleReceiveReport}
                className="inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-[var(--tangerine)] px-6 text-sm font-bold text-white transition hover:bg-[var(--accent-strong)]"
              >
                <FileText size={16} />
                Click to Receive Full Report by Email
              </button>
            </div>
          )}
          {reportStatus === "error" && !confirmVisible && (
            <p className="mt-3 text-xs text-red-500">
              Delivery issue detected — please also email us at{" "}
              <a href="mailto:felipe@frugalstudio.design" className="underline">
                felipe@frugalstudio.design
              </a>
            </p>
          )}
        </div>

        {/* ── Composite scores ─────────────────────────────────────────── */}
        <div className="grid gap-4 md:grid-cols-2">
          <ScoreDial label="Operational Intelligence Index" value={scores.operationalIntelligenceIndex} highIsGood={true} />
          <div className="rounded-xl border border-[var(--line)] bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              Estimated Savings Opportunity
            </div>
            <div className="mt-4 text-4xl font-bold text-[#1a8a50]">
              {currency(scores.opportunityLow)}–{currency(scores.opportunityHigh)}
            </div>
            <div className="mt-2 text-xs font-semibold text-[#1a8a50]">Monthly recovery potential</div>
            <div className="mt-1 text-xs text-[var(--ink-muted)]">Diagnostic estimate — not a guarantee</div>
          </div>
          <ScoreDial label="Operational Friction Score" value={scores.operationalFrictionScore} highIsGood={false} />
          <ScoreDial label="Founder Dependency Index" value={scores.founderDependencyIndex} highIsGood={false} />
        </div>

        {/* ── Top findings ─────────────────────────────────────────────── */}
        <div className="mt-6 rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[var(--petrol)]">Top Diagnostic Findings</h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            Your highest-priority operational friction points based on your responses.
          </p>
          <div className="mt-4 grid gap-3">
            {scores.topFindings.map((finding, i) => (
              <div key={finding} className="rounded-lg bg-[var(--panel)] p-4">
                <span className="mr-2 font-bold text-[var(--tangerine)]">{i + 1}.</span>
                <span className="text-[var(--charcoal)]">{finding}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Per-metric breakdown ──────────────────────────────────────── */}
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-bold text-[var(--petrol)]">Metric Breakdown</h2>
          <p className="mb-4 text-sm text-[var(--ink-muted)]">
            All metrics run 0 (best) → 5 (worst). Higher bars indicate more operational drag.
          </p>
          <div className="grid gap-4">
            {metricDefinitions.map((def) => {
              const rawValue = answers[def.key] as number;
              const scaleLabel = def.scaleLabels[rawValue] ?? "";
              const pct = (rawValue / 5) * 100;
              const severity =
                rawValue >= 4
                  ? { badge: "bg-[rgba(201,64,64,0.1)] text-[#c94040]", bar: "bg-[#c94040]" }
                  : rawValue >= 3
                    ? { badge: "bg-[rgba(240,144,60,0.12)] text-[var(--tangerine)]", bar: "bg-[var(--tangerine)]" }
                    : { badge: "bg-[rgba(26,138,80,0.1)] text-[#1a8a50]", bar: "bg-[#1a8a50]" };
              return (
                <div key={String(def.key)} className="rounded-xl border border-[var(--line)] bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-[var(--petrol)]">
                        {def.label}
                        {def.sublabel && (
                          <span className="ml-2 text-xs font-normal text-[var(--ink-muted)]">({def.sublabel})</span>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-[var(--ink-muted)]">{def.shortDesc}</div>
                    </div>
                    <div className={`shrink-0 rounded-lg px-3 py-1 text-sm font-bold ${severity.badge}`}>
                      {rawValue}/5
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-[var(--panel-2)]">
                    <div className={`h-1.5 rounded-full transition-all ${severity.bar}`} style={{ width: `${pct}%` }} />
                  </div>
                  {scaleLabel && <div className="mt-2 text-xs text-[var(--ink-muted)]">{scaleLabel}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom retake link */}
        <div className="mt-8 flex justify-end">
          <a href="/assessment" className="text-sm text-[var(--ink-muted)] hover:text-[var(--petrol)]">
            Retake assessment
          </a>
        </div>

        {/* Booking nudge */}
        <div className="mt-4 rounded-xl border border-[rgba(240,144,60,0.3)] bg-[rgba(240,144,60,0.06)] p-5 text-center">
          <p className="text-sm text-[var(--charcoal)]">
            Want to act on these findings now?{" "}
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
              className="font-semibold text-[var(--tangerine)] hover:underline">
              Book a Discovery Call
            </a>{" "}
            with Frugal Studio powered by Mindful Tech.
          </p>
        </div>
      </div>
    </main>
  );
}
