import { ArrowRight, Gauge, Layers3, LineChart, Workflow } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import type { LucideIcon } from "lucide-react";

const measures: [string, string, LucideIcon][] = [
  [
    "Workflow Friction",
    "Where manual handoffs and redundant approvals slow down your daily execution velocity.",
    Workflow,
  ],
  [
    "Revenue Leakage",
    "Where unoptimized response times and delivery gaps quietly bleed high-intent opportunities.",
    LineChart,
  ],
  [
    "Founder Dependency",
    "Where leadership remains the default operating system for routine task execution.",
    Layers3,
  ],
  [
    "System Fragmentation",
    "Where disconnected tools and scattered data containers create heavy structural debt.",
    Gauge,
  ],
];

const infoBoxes = [
  {
    title: "Who it is for",
    text: "Built for tech founders, service operators, real estate, and organizations wrestling with improving operational efficiency.",
  },
  {
    title: "What you receive",
    text: "Get immediate operational scores across your critical workflows, identify your primary execution bottleneck, and get an actionable strategy roadmap.",
  },
  {
    title: "Why friction costs money",
    text: "Startups and small businesses rarely fail because their vision is too small. They fail because their execution model is structurally too heavy.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen executive-grid brand-shell">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex rounded-full border border-[rgba(240,144,60,0.35)] bg-[rgba(240,144,60,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--tangerine)]">
            Frugal Studio powered by Mindful Tech Automations
          </div>

          <h1 className="text-5xl font-bold leading-[1.04] text-white md:text-6xl">
            How Much Operational Waste Is Hiding Inside Your Business?
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#b8cdd3]">
            A 10-minute diagnostic to spot the hidden leaks draining your business. Reclaim the time and
            resources you need to scale.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#8fa8b0]">
            Our AI Process Automation Consulting transforms these operational bottlenecks into autonomous
            workflows, securing your margins and providing the structural agility required for high-velocity
            growth. Start here.
          </p>

          {/* Scroll indicator — no CTA button in hero per brief */}
          <div className="mt-10 flex flex-col items-start gap-2">
            <span className="text-sm text-[var(--ink-muted)]">Scroll down to learn more</span>
            <svg
              className="animate-bounce text-[var(--tangerine)]"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>

        {/* Diagnostic pillars card */}
        <div className="mt-16 rounded-lg border border-[var(--line)] bg-[rgba(16,40,48,0.88)] p-6 shadow-2xl lg:max-w-2xl">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
            <div>
              <div className="text-sm font-semibold text-white">Frugal Scanner Assessment</div>
              <div className="text-xs text-[var(--ink-muted)]">Four diagnostic pillars</div>
            </div>
            <Gauge className="text-[var(--tangerine)]" size={26} />
          </div>
          <div className="grid gap-3 pt-5">
            {measures.map(([title, text, Icon]) => (
              <div
                key={title}
                className="grid grid-cols-[36px_1fr] gap-4 rounded-md bg-white/[0.035] p-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[rgba(32,80,90,0.3)] text-[var(--tangerine)]">
                  <Icon size={18} />
                </div>
                <div>
                  <div className="font-semibold text-white">{title}</div>
                  <div className="mt-1 text-sm leading-6 text-[#8fa8b0]">{text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Info boxes — stacked vertically ───────────────────────────────── */}
      <section className="border-y border-[var(--line)] bg-[rgba(16,40,48,0.7)] px-6 py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-5">
          {infoBoxes.map(({ title, text }) => (
            <div key={title} className="rounded-lg border border-[var(--line)] bg-white/[0.03] p-6">
              <h2 className="text-lg font-bold text-white">{title}</h2>
              <p className="mt-2 leading-7 text-[#8fa8b0]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Single bottom CTA ─────────────────────────────────────────────── */}
      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-16">
        <div>
          <h2 className="text-3xl font-bold text-white">Built for sharper operating decisions.</h2>
          <p className="mt-3 max-w-2xl text-[#8fa8b0]">
            This FREE diagnostic serves as the direct entry point to a paid Operational Intelligence Audit
            with Frugal Studio powered by Mindful Tech Automations, setting the framework for full workflow
            automation implementation.
          </p>
        </div>
        <div>
          <ButtonLink href="/assessment" variant="cta">
            <span className="inline-flex items-center gap-2">
              Start Free Diagnostic <ArrowRight size={18} />
            </span>
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
