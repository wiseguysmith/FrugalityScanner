"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, FileText } from "lucide-react";
import { currency, metricDefinitions, type AssessmentAnswers, type ScoreResult } from "@/lib/assessment";
import { ScoreDial } from "@/components/ScoreDial";

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
  const [stored] = useState<StoredAssessment | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem("frugality-assessment");
    return raw ? JSON.parse(raw) : null;
  });
  const [reportStatus, setReportStatus] = useState<"sending" | "sent" | "error">("sending");
  const [confirmVisible, setConfirmVisible] = useState(false);

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

  if (!stored) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-8 text-center">
          <h1 className="text-3xl font-bold text-white">No assessment found</h1>
          <a
            className="mt-5 inline-flex rounded-md bg-[var(--petrol)] px-5 py-3 font-bold text-white hover:bg-[#286878]"
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
    // Navigate to closing page after confirmation is displayed
    setTimeout(() => router.push("/thank-you"), 2200);
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--tangerine)]">
            Frugal Studio powered by Mindful Tech
          </div>
          <h1 className="mt-2 text-4xl font-bold text-white">
            {contact.company ? `${contact.company} — ` : ""}Frugality Scores
          </h1>
          <p className="mt-2 text-[var(--ink-muted)]">
            Prepared for {contact.firstName} {contact.lastName}
          </p>
        </header>

        {/* Report status banner */}
        {reportStatus === "sending" && !confirmVisible && (
          <div className="mb-6 rounded-lg border border-[var(--line)] bg-[rgba(32,80,90,0.1)] px-5 py-4 text-sm text-[var(--ink-muted)]">
            Generating your full report…
          </div>
        )}
        {confirmVisible && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-[rgba(240,144,60,0.3)] bg-[rgba(240,144,60,0.08)] px-5 py-4">
            <CheckCircle size={18} className="shrink-0 text-[var(--tangerine)]" />
            <span className="text-sm text-white">
              Your full report is on its way to{" "}
              <strong className="text-[var(--tangerine)]">{contact.email}</strong>
            </span>
          </div>
        )}
        {reportStatus === "error" && !confirmVisible && (
          <div className="mb-6 rounded-lg border border-red-900/40 bg-red-950/30 px-5 py-4 text-sm text-red-300">
            Report delivery failed — please contact us at info@frugalstudio.design
          </div>
        )}

        {/* Composite scores */}
        <div className="grid gap-4 md:grid-cols-2">
          <ScoreDial label="Operational Intelligence Index" value={scores.operationalIntelligenceIndex} />
          <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              Estimated Savings Opportunity
            </div>
            <div className="mt-4 text-4xl font-bold text-[var(--tangerine)]">
              {currency(scores.opportunityLow)}–{currency(scores.opportunityHigh)}
            </div>
            <div className="mt-2 text-xs text-[var(--ink-muted)]">
              Estimated monthly recovery range — not a guarantee
            </div>
          </div>
          <ScoreDial label="Operational Friction Score" value={scores.operationalFrictionScore} />
          <ScoreDial label="Founder Dependency Index" value={scores.founderDependencyIndex} />
        </div>

        {/* Top findings */}
        <div className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--panel)] p-6">
          <h2 className="text-xl font-bold text-white">Top Diagnostic Findings</h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            These are your highest-priority operational friction points based on your responses.
          </p>
          <div className="mt-4 grid gap-3">
            {scores.topFindings.map((finding, i) => (
              <div key={finding} className="rounded-md bg-white/[0.04] p-4">
                <span className="mr-2 font-bold text-[var(--tangerine)]">{i + 1}.</span>
                <span className="text-[#c4d6cd]">{finding}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Per-metric breakdown — vertical */}
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-bold text-white">Metric Breakdown</h2>
          <div className="grid gap-4">
            {metricDefinitions.map((def) => {
              const rawValue = answers[def.key] as number;
              const scaleLabel = def.scaleLabels[rawValue] ?? "";
              const pct = (rawValue / 5) * 100;
              const isHigh = rawValue >= 4;
              return (
                <div
                  key={String(def.key)}
                  className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-white">
                        {def.label}
                        {def.sublabel && (
                          <span className="ml-2 text-xs font-normal text-[var(--ink-muted)]">
                            ({def.sublabel})
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-[var(--ink-muted)]">{def.shortDesc}</div>
                    </div>
                    <div
                      className={`shrink-0 rounded-md px-3 py-1 text-sm font-bold ${
                        isHigh
                          ? "bg-[rgba(255,100,80,0.15)] text-[#ff8e7d]"
                          : rawValue >= 3
                            ? "bg-[rgba(240,144,60,0.15)] text-[var(--tangerine)]"
                            : "bg-[rgba(94,203,138,0.12)] text-[#5ecb8a]"
                      }`}
                    >
                      {rawValue}/5
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/10">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        isHigh ? "bg-[#ff8e7d]" : rawValue >= 3 ? "bg-[var(--tangerine)]" : "bg-[#5ecb8a]"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {scaleLabel && (
                    <div className="mt-2 text-xs text-[var(--ink-muted)]">{scaleLabel}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          {!confirmVisible ? (
            <button
              type="button"
              onClick={handleReceiveReport}
              className="inline-flex h-12 items-center gap-2 rounded-md bg-[var(--tangerine)] px-6 text-sm font-bold text-white transition hover:bg-[var(--accent-strong)]"
            >
              <FileText size={16} />
              Click here to receive full report
            </button>
          ) : (
            <div className="text-sm text-[var(--ink-muted)]">Redirecting to next steps…</div>
          )}
          <a href="/assessment" className="text-sm text-[var(--ink-muted)] hover:text-white">
            Retake assessment
          </a>
        </div>
      </div>
    </main>
  );
}
