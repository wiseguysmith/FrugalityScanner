"use client";

import { useState } from "react";
import { CalendarCheck, CheckCircle, Linkedin, Send } from "lucide-react";

const BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2_Rp7RRFppwCG3x-cR9AguNsBnlwt84k5EWDaKDTewkmc72flE0i_IH3m0YJVABnEhaakYuAdE";

const LINKEDIN_URL = "https://www.linkedin.com/company/mindfultechnologies";

const auditOutcomes = [
  "Current workflow friction map",
  "Priority automation opportunities",
  "Estimated savings or recovered capacity range",
  "Lead leakage and response-time review",
  "Documentation and founder-dependency assessment",
  "Recommended first automation sprint",
];

const pricingTiers = [
  { tier: "Starter Project", range: "$1,500 – $3,000" },
  { tier: "Growth Project", range: "$3,000 – $6,000" },
  { tier: "Advanced Project", range: "$6,000 – $12,000" },
  { tier: "Enterprise Build", range: "$12,000+" },
];

function npsColor(score: number): string {
  if (score >= 9) return "bg-[#22a05a] hover:bg-[#1a8a50] text-white";
  if (score >= 7) return "bg-[#e6b800] hover:bg-[#c9a200] text-white";
  return "bg-[#d93025] hover:bg-[#b52920] text-white";
}

function npsSelectedColor(score: number): string {
  if (score >= 9) return "ring-[#22a05a] bg-[#22a05a] text-white scale-110";
  if (score >= 7) return "ring-[#e6b800] bg-[#e6b800] text-white scale-110";
  return "ring-[#d93025] bg-[#d93025] text-white scale-110";
}

function npsLabel(score: number | null): string {
  if (score === null) return "";
  if (score >= 9) return "Promoter — You love it!";
  if (score >= 7) return "Passive — Pretty good";
  return "Detractor — Needs improvement";
}

function npsBadgeColor(score: number): string {
  if (score >= 9) return "text-[#22a05a]";
  if (score >= 7) return "text-[#c9a200]";
  return "text-[#d93025]";
}

export default function ThankYouPage() {
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [npsSubmitted, setNpsSubmitted] = useState(false);

  async function submitNps() {
    if (npsScore === null) return;
    const raw = typeof window !== "undefined"
      ? window.localStorage.getItem("frugality-assessment-contact")
      : null;
    const contact = raw ? JSON.parse(raw) : {};
    await fetch("/api/submit-nps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ npsScore, feedback, contact }),
    });
    setNpsSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[var(--panel)] px-6 py-12">
      <div className="mx-auto max-w-3xl">

        {/* Confirmation */}
        <section className="rounded-xl border border-[var(--line)] bg-white p-8 shadow-sm">
          <CalendarCheck className="text-[var(--tangerine)]" size={40} />
          <h1 className="mt-4 text-2xl font-bold text-[var(--petrol)]">Report Sent</h1>
          <p className="mt-4 text-base leading-7 text-[var(--charcoal)]">
            Check your inbox. Your personalized asset analysis has been sent. Now, it is time to isolate the
            highest-value bottlenecks and prioritize the operational fixes required to recover your team&apos;s
            efficiency.
          </p>
        </section>

        {/* Frugal Audit */}
        <section className="mt-6 rounded-xl border border-[var(--line)] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[var(--petrol)]">What Comes Next: The 1-Day Frugal Audit</h2>
          <p className="mt-4 leading-7 text-[var(--charcoal)]">
            Your diagnostic shows where operational waste may be costing your business time, money, and execution speed.
          </p>
          <p className="mt-3 leading-7 text-[var(--charcoal)]">
            The <strong className="text-[var(--petrol)]">Frugal Audit</strong> is a 1-day operational intelligence sprint
            where Frugal Studio and Mindful Tech Automations review your workflows, software stack, lead flow,
            manual bottlenecks, documentation gaps, and founder dependency.
          </p>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">What&apos;s included</h3>
          <ul className="mt-4 grid gap-3">
            {auditOutcomes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle size={16} className="mt-0.5 shrink-0 text-[var(--tangerine)]" />
                <span className="text-[var(--charcoal)]">{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">Project tiers</h3>
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--line)]">
            {pricingTiers.map(({ tier, range }, i) => (
              <div key={tier}
                className={`flex items-center justify-between px-5 py-3 text-sm ${i !== pricingTiers.length - 1 ? "border-b border-[var(--line)]" : ""}`}>
                <span className="font-medium text-[var(--petrol)]">{tier}</span>
                <span className="font-semibold text-[var(--tangerine)]">{range}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-[var(--tangerine)] px-6 text-sm font-bold text-white transition hover:bg-[var(--accent-strong)]">
              <CalendarCheck size={16} /> Book a Discovery Call
            </a>
            <p className="mt-3 text-xs text-[var(--ink-muted)]">
              Book a Discovery Call to learn more about the audit sprint and the implementation process.
            </p>
          </div>
        </section>

        {/* NPS Section */}
        <section className="mt-6 rounded-xl border border-[var(--line)] bg-white p-8 shadow-sm">
          {npsSubmitted ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle size={36} className="text-[#22a05a]" />
              <div className="text-lg font-bold text-[var(--petrol)]">Thank you for your feedback!</div>
              <p className="text-sm text-[var(--ink-muted)]">Your response helps us improve the Frugality Scanner experience.</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-[var(--petrol)]">How likely are you to recommend us?</h2>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">On a scale from 0 to 10</p>

              {/* NPS buttons */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {Array.from({ length: 11 }, (_, i) => (
                  <button key={i} type="button" onClick={() => setNpsScore(i)}
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ring-2 ring-transparent transition-all duration-150 ${
                      npsScore === i
                        ? npsSelectedColor(i) + " ring-offset-2"
                        : npsColor(i) + " opacity-70 hover:opacity-100 hover:scale-105"
                    }`}>
                    {i}
                  </button>
                ))}
              </div>

              {/* Scale labels */}
              <div className="mt-2 flex justify-between text-[10px] text-[var(--ink-muted)] px-1">
                <span>0 — Not likely</span>
                <span>10 — Extremely likely</span>
              </div>

              {/* NPS category bar */}
              <div className="mt-4 overflow-hidden rounded-full h-2 flex">
                <div className="bg-[#d93025] flex-[7]" title="Detractors 0–6" />
                <div className="bg-[#e6b800] flex-[2]" title="Passives 7–8" />
                <div className="bg-[#22a05a] flex-[2]" title="Promoters 9–10" />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-[var(--ink-muted)]">
                <span>Detractors (0–6)</span>
                <span>Passives (7–8)</span>
                <span>Promoters (9–10)</span>
              </div>

              {npsScore !== null && (
                <div className={`mt-3 text-sm font-semibold ${npsBadgeColor(npsScore)}`}>
                  {npsLabel(npsScore)}
                </div>
              )}

              {/* Feedback box */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-[var(--petrol)]">
                  Any comments or suggestions? <span className="text-[var(--ink-muted)] font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you thought of the diagnostic, what could be improved, or what was most useful…"
                  className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--charcoal)] outline-none transition focus:border-[var(--petrol)] focus:ring-1 focus:ring-[var(--petrol)] placeholder:text-[var(--ink-muted)] resize-none"
                />
              </div>

              <button type="button" onClick={submitNps} disabled={npsScore === null}
                className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--petrol)] px-6 text-sm font-bold text-white transition hover:bg-[#286878] disabled:opacity-40 disabled:cursor-not-allowed">
                <Send size={14} /> Submit Feedback
              </button>
            </>
          )}
        </section>

        {/* Team section */}
        <section className="mt-6 rounded-xl border border-[var(--line)] bg-white p-8 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--tangerine)]">Powered by</div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex-1">
              <div className="font-bold text-[var(--petrol)]">Elijah Smith</div>
              <div className="text-xs text-[var(--ink-muted)] mb-2">Founder — Mindful Tech Automations</div>
              <p className="text-sm leading-7 text-[var(--charcoal)]">
                Elijah Smith is the founder of Mindful Tech Automations, an AI process automation consultancy
                helping founders and operators eliminate operational waste through intelligent workflow systems.
                He partners with Frugal Studio to deliver the Frugality Scanner — turning diagnostic insights
                into automated, scalable business infrastructure.
              </p>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--petrol)] hover:text-[var(--tangerine)] transition">
                <Linkedin size={16} /> Mindful Tech Automations
              </a>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
