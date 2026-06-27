import { CalendarCheck, CheckCircle } from "lucide-react";

const BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2_Rp7RRFppwCG3x-cR9AguNsBnlwt84k5EWDaKDTewkmc72flE0i_IH3m0YJVABnEhaakYuAdE";

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

export default function ThankYouPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-3xl">

        {/* Confirmation */}
        <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-8 shadow-2xl">
          <CalendarCheck className="text-[var(--tangerine)]" size={40} />
          <p className="mt-5 text-lg leading-7 text-[#8fa8b0]">
            Check your inbox. Your personalized asset analysis has been sent. Now, it is time to isolate the
            highest-value bottlenecks and prioritize the operational fixes required to recover your team&apos;s
            efficiency.
          </p>
        </section>

        {/* Frugal Audit explanation */}
        <section className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--panel)] p-8">
          <h2 className="text-2xl font-bold text-white">What Comes Next: The 1-Day Frugal Audit</h2>
          <p className="mt-4 leading-7 text-[#8fa8b0]">
            Your diagnostic shows where operational waste may be costing your business time, money, and
            execution speed.
          </p>
          <p className="mt-3 leading-7 text-[#8fa8b0]">
            The <strong className="text-white">Frugal Audit</strong> is a 1-day operational intelligence sprint
            where Frugal Studio and Mindful Tech Automations review your workflows, software stack, lead flow,
            manual bottlenecks, documentation gaps, and founder dependency.
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

          {/* Pricing table */}
          <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
            Project tiers
          </h3>
          <div className="mt-4 overflow-hidden rounded-lg border border-[var(--line)]">
            {pricingTiers.map(({ tier, range }, i) => (
              <div
                key={tier}
                className={`flex items-center justify-between px-5 py-3 text-sm ${
                  i !== pricingTiers.length - 1 ? "border-b border-[var(--line)]" : ""
                }`}
              >
                <span className="font-medium text-white">{tier}</span>
                <span className="font-semibold text-[var(--tangerine)]">{range}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-[var(--tangerine)] px-6 text-sm font-bold text-white transition hover:bg-[var(--accent-strong)]"
            >
              <CalendarCheck size={16} />
              Book a Discovery Call
            </a>
            <p className="mt-3 text-xs text-[var(--ink-muted)]">
              Book a Discovery Call to learn more about the audit sprint and the implementation process.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
