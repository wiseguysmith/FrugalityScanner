import { CalendarCheck, CheckCircle } from "lucide-react";

// TODO: Set NEXT_PUBLIC_FRUGAL_AUDIT_URL in .env.local and production environment
// to point to the Frugal Studio Frugal Audit booking / partnership page.
const FRUGAL_AUDIT_URL = process.env.NEXT_PUBLIC_FRUGAL_AUDIT_URL ?? "#frugal-audit";

const auditOutcomes = [
  "Current workflow friction map",
  "Priority automation opportunities",
  "Estimated savings or recovered capacity range",
  "Lead leakage and response-time review",
  "Documentation and founder-dependency assessment",
  "Recommended first automation sprint",
];

export default function ThankYouPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--tangerine)]">
          Frugal Studio powered by Mindful Tech
        </div>

        <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-8 shadow-2xl">
          <CalendarCheck className="text-[var(--tangerine)]" size={40} />
          <h1 className="mt-5 text-4xl font-bold text-white">
            Your Operational Intelligence Report Is On Its Way
          </h1>
          <p className="mt-4 text-[#8fa8b0]">
            Thank you. Your report will be sent to your email. Review your highest-value bottlenecks and
            consider which operational fixes deserve priority.
          </p>
        </section>

        <section className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--panel)] p-8">
          <h2 className="text-2xl font-bold text-white">What comes next: The Frugal Audit</h2>
          <p className="mt-4 leading-7 text-[#8fa8b0]">
            Your diagnostic shows where operational waste may be costing your business time, money, and
            execution speed.
          </p>
          <p className="mt-3 leading-7 text-[#8fa8b0]">
            The <strong className="text-white">Frugal Audit</strong> is a 1-day operational intelligence sprint
            where Frugal Studio and Mindful Tech review your workflows, software stack, lead flow, manual
            bottlenecks, documentation gaps, and founder dependency.
          </p>
          <p className="mt-3 leading-7 text-[#8fa8b0]">
            You receive a clear operational roadmap showing what to simplify, what to automate, and what to fix
            first.
          </p>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
            What&apos;s included
          </h3>
          <ul className="mt-4 grid gap-3">
            {auditOutcomes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle size={16} className="mt-0.5 shrink-0 text-[var(--tangerine)]" />
                <span className="text-[#c4d6cd]">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <a
              href={FRUGAL_AUDIT_URL}
              className="inline-flex h-12 items-center gap-2 rounded-md bg-[var(--tangerine)] px-6 text-sm font-bold text-white transition hover:bg-[var(--accent-strong)]"
            >
              <CalendarCheck size={16} />
              Book Your Frugal Audit
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
