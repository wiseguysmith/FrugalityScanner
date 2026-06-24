import { ArrowRight, Gauge, Layers3, LineChart, Workflow } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";

import type { LucideIcon } from "lucide-react";

const measures: [string, string, LucideIcon][] = [
  ["Workflow friction", "Where manual handoffs, approvals, and re-entry slow the business down.", Workflow],
  ["Revenue leakage", "Where leads, follow-up, and delivery gaps quietly drain opportunity value.", LineChart],
  ["Founder dependency", "Where leadership is still the operating system for routine execution.", Layers3],
  ["System fragmentation", "Where tools, documents, and data sources create structural debt.", Gauge],
];

const infoBoxes = [
  {
    title: "Who it is for",
    text: "Founders, operators, real estate firms, professional services, hospitality businesses, NGOs, and lean teams with growing operational complexity.",
  },
  {
    title: "What you receive",
    text: "Immediate diagnostic scores across six operational categories, your top priority findings, and a full written report delivered to your email.",
  },
  {
    title: "Why friction costs money",
    text: "Slow response loops, duplicate tools, undocumented processes, and founder bottlenecks convert leadership attention into hidden, compounding expense.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen executive-grid brand-shell">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex rounded-full border border-[rgba(240,144,60,0.35)] bg-[rgba(240,144,60,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--tangerine)]">
            Frugal Studio powered by Mindful Tech
          </div>
          <h1 className="text-5xl font-bold leading-[1.04] text-white md:text-6xl">
            How Much Operational Waste Is Hiding Inside Your Business?
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#b8cdd3]">
            A ~10 minute Operational Intelligence Diagnostic to identify workflow friction, revenue leakage,
            founder dependency, and automation opportunities — built by Frugal Studio powered by Mindful Tech.
          </p>
          <div className="mt-10">
            <ButtonLink href="/assessment" variant="cta">
              <span className="inline-flex items-center gap-2">
                Start Free Diagnostic <ArrowRight size={18} />
              </span>
            </ButtonLink>
          </div>
        </div>

        <div className="mt-16 rounded-lg border border-[var(--line)] bg-[rgba(16,40,48,0.88)] p-6 shadow-2xl lg:max-w-2xl">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
            <div>
              <div className="text-sm font-semibold text-white">Diagnostic Command Center</div>
              <div className="text-xs text-[var(--ink-muted)]">Live assessment model</div>
            </div>
            <Gauge className="text-[var(--tangerine)]" size={26} />
          </div>
          <div className="grid gap-3 pt-5">
            {measures.map(([title, text, Icon]) => (
              <div key={String(title)} className="grid grid-cols-[36px_1fr] gap-4 rounded-md bg-white/[0.035] p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[rgba(32,80,90,0.3)] text-[var(--tangerine)]">
                  <Icon size={18} />
                </div>
                <div>
                  <div className="font-semibold text-white">{String(title)}</div>
                  <div className="mt-1 text-sm leading-6 text-[#8fa8b0]">{String(text)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[rgba(16,40,48,0.7)] px-6 py-14">
        <div className="mx-auto flex max-w-7xl flex-col gap-5">
          {infoBoxes.map(({ title, text }) => (
            <div key={title} className="rounded-lg border border-[var(--line)] bg-white/[0.03] p-6">
              <h2 className="text-lg font-bold text-white">{title}</h2>
              <p className="mt-2 leading-7 text-[#8fa8b0]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-16">
        <div>
          <h2 className="text-3xl font-bold text-white">Built for sharper operating decisions.</h2>
          <p className="mt-3 max-w-2xl text-[#8fa8b0]">
            The scanner routes qualified leads into a paid Operational Intelligence Audit with Frugal Studio
            powered by Mindful Tech.
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
