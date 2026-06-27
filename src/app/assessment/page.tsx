"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, GripVertical, Lock } from "lucide-react";
import {
  businessGoals,
  dealSizeRanges,
  fundingStructures,
  goalBucket,
  initialAnswers,
  metricDefinitions,
  organizationTypes,
  teamSizes,
  toolGroups,
  type AssessmentAnswers,
  type OrganizationType,
} from "@/lib/assessment";
import { scoreAssessment } from "@/lib/scoring";

type ContactInfo = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  website: string;
  linkedinUrl: string;
  phone: string;
};

type OtherInputs = {
  organizationTypeOther: string;
  businessGoalRanking: string[];      // Full ranked list from step 2
  toolGroupOthers: Record<string, string>;
  dealSizeRange: string;
  fundingStructure: string;
};

const initialContact: ContactInfo = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  website: "",
  linkedinUrl: "",
  phone: "",
};

const initialOtherInputs: OtherInputs = {
  organizationTypeOther: "",
  businessGoalRanking: [],
  toolGroupOthers: {},
  dealSizeRange: "",
  fundingStructure: "",
};

const steps = [
  "Contact",
  "Business Type",
  "Main Goal",
  "Team Scale",
  "Tech Stack",
  "Business Metrics",
  "Finance",
];

const METRIC_KEYS = metricDefinitions.map((m) => String(m.key));

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Returns tool identifiers that "belong" to a group for mandatory-check purposes */
function groupToolIds(groupLabel: string, tools: string[]) {
  return [
    ...tools.map((t) => (t === "Other" ? `${groupLabel}:Other` : t)),
    `${groupLabel}:None`,
  ];
}

export default function AssessmentPage() {
  const router = useRouter();
  const [contact, setContact] = useState<ContactInfo>(initialContact);
  const [answers, setAnswers] = useState<AssessmentAnswers>(initialAnswers);
  const [otherInputs, setOtherInputs] = useState<OtherInputs>(initialOtherInputs);
  const [touchedMetrics, setTouchedMetrics] = useState<Set<string>>(new Set());
  const [rankedGoals, setRankedGoals] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [emailError, setEmailError] = useState("");

  const currentGoalBucket = goalBucket(answers.organizationType);
  const currentGoals = businessGoals[currentGoalBucket];

  // ── state helpers ────────────────────────────────────────────────────────────

  function updateContact<T extends keyof ContactInfo>(key: T, value: string) {
    setContact((c) => ({ ...c, [key]: value }));
  }

  function update<T extends keyof AssessmentAnswers>(key: T, value: AssessmentAnswers[T]) {
    setAnswers((a) => ({ ...a, [key]: value }));
  }

  function touchMetric(key: string, value: number) {
    update(key as keyof AssessmentAnswers, value as AssessmentAnswers[keyof AssessmentAnswers]);
    setTouchedMetrics((prev) => new Set([...prev, key]));
  }

  function toggleTool(tool: string, groupLabel: string) {
    setAnswers((a) => {
      const isNone = tool === `${groupLabel}:None`;
      const allGroupIds = groupToolIds(groupLabel, toolGroups.find((g) => g.label === groupLabel)?.tools ?? []);

      if (a.tools.includes(tool)) {
        // Deselect
        return { ...a, tools: a.tools.filter((t) => t !== tool) };
      }
      if (isNone) {
        // Selecting "None" clears all other group selections
        return { ...a, tools: [...a.tools.filter((t) => !allGroupIds.includes(t)), tool] };
      }
      // Selecting a real tool clears "None" for that group
      return {
        ...a,
        tools: [...a.tools.filter((t) => t !== `${groupLabel}:None`), tool],
      };
    });
  }

  function setToolGroupOther(groupLabel: string, value: string) {
    setOtherInputs((o) => ({
      ...o,
      toolGroupOthers: { ...o.toolGroupOthers, [groupLabel]: value },
    }));
  }

  // ── canContinue ──────────────────────────────────────────────────────────────

  const allGroupsAnswered = toolGroups.every((group) => {
    const ids = groupToolIds(group.label, group.tools);
    return ids.some((id) => answers.tools.includes(id));
  });

  const allMetricsTouched = METRIC_KEYS.every((k) => touchedMetrics.has(k));

  const canContinue =
    step === 0
      ? Boolean(
          contact.firstName &&
            contact.lastName &&
            contact.email &&
            isValidEmail(contact.email) &&
            contact.company,
        )
      : step === 1
        ? Boolean(
            answers.organizationType &&
              (answers.organizationType !== "Other" || otherInputs.organizationTypeOther.trim()),
          )
        : step === 2
          ? rankedGoals.length > 0
          : step === 3
            ? Boolean(answers.teamSize)
            : step === 4
              ? allGroupsAnswered
              : step === 5
                ? allMetricsTouched
                : step === 6
                  ? Boolean(otherInputs.dealSizeRange && otherInputs.fundingStructure)
                  : true;

  function next() {
    if (step === 0 && !isValidEmail(contact.email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");

    // Step 1→2: initialise ranked goals for this org type
    if (step === 1) {
      setRankedGoals(currentGoals);
    }

    // Step 2: persist ranked goals; set top choice as businessGoal for scoring
    if (step === 2) {
      setOtherInputs((o) => ({ ...o, businessGoalRanking: rankedGoals }));
      update("businessGoal", rankedGoals[0] ?? "");
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0 });
      return;
    }

    // Final step — map deal size range to numeric for scoring
    const selectedRange = dealSizeRanges.find((r) => r.label === otherInputs.dealSizeRange);
    const finalAnswers = { ...answers, averageDealSize: selectedRange?.value ?? answers.averageDealSize };

    const scores = scoreAssessment(finalAnswers);
    window.localStorage.setItem(
      "frugality-assessment",
      JSON.stringify({ contact, answers: finalAnswers, scores, otherInputs }),
    );
    router.push("/results");
  }

  // ── render ───────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--tangerine)]">
              Frugal Studio powered by Mindful Tech Automations
            </div>
            <h1 className="mt-1 text-3xl font-bold text-white">Frugality Scanner</h1>
          </div>
          <div className="text-sm text-[var(--ink-muted)]">~10 min diagnostic</div>
        </header>

        {/* Progress */}
        <div className="mb-8 grid grid-cols-7 gap-2">
          {steps.map((label, index) => (
            <div key={label} title={label} className="h-1.5 rounded-full bg-white/10">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  index < step
                    ? "bg-[var(--petrol)]"
                    : index === step
                      ? "bg-[var(--tangerine)]"
                      : "bg-transparent"
                }`}
              />
            </div>
          ))}
        </div>

        <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-6 shadow-2xl">
          <div className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
            Section {step + 1} of {steps.length}: {steps[step]}
          </div>

          {/* ── Step 0: Contact ──────────────────────────────────────────────── */}
          {step === 0 && (
            <div>
              <h2 className="text-3xl font-bold text-white">Let&apos;s get started</h2>
              <p className="mt-2 text-[var(--ink-muted)]">
                We&apos;ll send your personalised Frugality Scanner report to this email once you complete the
                diagnostic.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <ContactInput
                  label="First name"
                  value={contact.firstName}
                  onChange={(v) => updateContact("firstName", v)}
                  required
                />
                <ContactInput
                  label="Last name"
                  value={contact.lastName}
                  onChange={(v) => updateContact("lastName", v)}
                  required
                />
                <div className="md:col-span-2">
                  <ContactInput
                    label="Business email"
                    type="email"
                    value={contact.email}
                    onChange={(v) => {
                      updateContact("email", v);
                      setEmailError("");
                    }}
                    required
                    error={emailError}
                    hint="Your full report will be sent here — this also acts as lightweight verification."
                  />
                </div>
                <ContactInput
                  label="Business / company name"
                  value={contact.company}
                  onChange={(v) => updateContact("company", v)}
                  required
                />
                <ContactInput
                  label="LinkedIn URL"
                  value={contact.linkedinUrl}
                  onChange={(v) => updateContact("linkedinUrl", v)}
                  hint="Required — helps us personalise your report and verify your profile."
                  required
                />
                <ContactInput
                  label="Website"
                  value={contact.website}
                  onChange={(v) => updateContact("website", v)}
                />
                <ContactInput
                  label="Phone"
                  type="tel"
                  value={contact.phone}
                  onChange={(v) => updateContact("phone", v)}
                />
              </div>

              {/* Privacy notice */}
              <div className="mt-8 rounded-lg border border-[var(--tangerine)] bg-[rgba(240,144,60,0.1)] p-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--tangerine)]">
                  <Lock size={14} />
                  Frugal Studio Data Privacy Commitment
                </div>
                <p className="text-xs leading-6 text-[#c4d6cd]">
                  Your responses are used only to generate your diagnostic score, identify operational improvement
                  opportunities, and prepare your report. Your contact details, business metrics, and software
                  stack information are kept confidential and are not sold, shared, or distributed to third
                  parties. Data is stored securely and used only by Frugal Studio and Mindful Tech Automations
                  for internal analysis, reporting, and follow-up related to this assessment.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 1: Business Type ─────────────────────────────────────── */}
          {step === 1 && (
            <div>
              <ChoiceGrid
                title="What type of organization are you?"
                options={organizationTypes}
                value={answers.organizationType}
                onSelect={(value) => update("organizationType", value as OrganizationType)}
              />
              {answers.organizationType === "Other" && (
                <div className="mt-4">
                  <ContactInput
                    label="Please describe your business type"
                    value={otherInputs.organizationTypeOther}
                    onChange={(v) => setOtherInputs((o) => ({ ...o, organizationTypeOther: v }))}
                    required
                  />
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Main Goal — drag to rank ─────────────────────────── */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-white">Rank your main business goals</h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                Drag the items below to rank all goals in priority order — most important at the top.
              </p>
              <div className="mt-6">
                <DragRankList
                  items={rankedGoals.length > 0 ? rankedGoals : currentGoals}
                  onReorder={(items) => setRankedGoals(items)}
                />
              </div>
            </div>
          )}

          {/* ── Step 3: Team Scale ─────────────────────────────────────────── */}
          {step === 3 && (
            <ChoiceGrid
              title="What is the current scale of your core team?"
              options={teamSizes}
              value={answers.teamSize}
              onSelect={(value) => update("teamSize", value)}
            />
          )}

          {/* ── Step 4: Tech Stack ─────────────────────────────────────────── */}
          {step === 4 && (
            <div>
              <h2 className="text-3xl font-bold text-white">Tech Stack</h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                Every category is mandatory. Select all tools that apply — or choose{" "}
                <strong className="text-white">None</strong> if the category is not used.
              </p>
              {!allGroupsAnswered && (
                <div className="mt-3 rounded-md bg-[rgba(240,144,60,0.1)] px-4 py-2 text-xs text-[var(--tangerine)]">
                  {toolGroups.filter((g) => {
                    const ids = groupToolIds(g.label, g.tools);
                    return !ids.some((id) => answers.tools.includes(id));
                  }).length}{" "}
                  categor
                  {toolGroups.filter((g) => {
                    const ids = groupToolIds(g.label, g.tools);
                    return !ids.some((id) => answers.tools.includes(id));
                  }).length === 1
                    ? "y"
                    : "ies"}{" "}
                  remaining
                </div>
              )}
              <div className="mt-6 grid gap-6">
                {toolGroups.map((group) => {
                  const ids = groupToolIds(group.label, group.tools);
                  const groupAnswered = ids.some((id) => answers.tools.includes(id));
                  return (
                    <div key={group.label}>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#c4d6cd]">{group.label}</span>
                        {groupAnswered && (
                          <span className="rounded-full bg-[rgba(94,203,138,0.15)] px-2 py-0.5 text-[10px] font-semibold text-[#5ecb8a]">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {/* Named tools */}
                        {group.tools.map((tool) => (
                          <button
                            key={tool}
                            type="button"
                            onClick={() => toggleTool(tool, group.label)}
                            className={`rounded-md border px-3 py-2 text-sm transition ${
                              answers.tools.includes(tool)
                                ? "border-[var(--tangerine)] bg-[rgba(240,144,60,0.12)] text-white"
                                : "border-[var(--line)] bg-white/[0.03] text-[#8fa8b0] hover:border-white/30 hover:text-white"
                            }`}
                          >
                            {tool}
                          </button>
                        ))}
                        {/* Other */}
                        <button
                          type="button"
                          onClick={() => toggleTool(`${group.label}:Other`, group.label)}
                          className={`rounded-md border px-3 py-2 text-sm transition ${
                            answers.tools.includes(`${group.label}:Other`)
                              ? "border-[var(--tangerine)] bg-[rgba(240,144,60,0.12)] text-white"
                              : "border-[var(--line)] bg-white/[0.03] text-[#8fa8b0] hover:border-white/30 hover:text-white"
                          }`}
                        >
                          Other
                        </button>
                        {/* None */}
                        <button
                          type="button"
                          onClick={() => toggleTool(`${group.label}:None`, group.label)}
                          className={`rounded-md border px-3 py-2 text-sm transition ${
                            answers.tools.includes(`${group.label}:None`)
                              ? "border-[#8fa8b0] bg-white/10 text-white"
                              : "border-[var(--line)] bg-white/[0.03] text-[#8fa8b0] hover:border-white/30 hover:text-white"
                          }`}
                        >
                          None
                        </button>
                      </div>
                      {/* Custom "Other" text input */}
                      {answers.tools.includes(`${group.label}:Other`) && (
                        <input
                          className="mt-2 h-10 w-64 rounded-md border border-[var(--tangerine)] bg-[var(--panel-2)] px-3 text-sm text-white outline-none placeholder:text-[var(--ink-muted)]"
                          placeholder={`Specify ${group.label} tool…`}
                          value={otherInputs.toolGroupOthers[group.label] ?? ""}
                          onChange={(e) => setToolGroupOther(group.label, e.target.value)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 5: Business Metrics — multiple choice cards ──────────── */}
          {step === 5 && (
            <div>
              <h2 className="text-3xl font-bold text-white">Business Metrics</h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                Select the option that best describes your current situation for each metric. All six must be
                answered before continuing.
              </p>
              {!allMetricsTouched && (
                <div className="mt-3 rounded-md bg-[rgba(240,144,60,0.1)] px-4 py-2 text-xs text-[var(--tangerine)]">
                  {METRIC_KEYS.length - touchedMetrics.size} metric
                  {METRIC_KEYS.length - touchedMetrics.size === 1 ? "" : "s"} remaining
                </div>
              )}
              <div className="mt-5 grid gap-6">
                {metricDefinitions.map((def) => {
                  const currentValue = answers[def.key] as number;
                  const isTouched = touchedMetrics.has(String(def.key));
                  return (
                    <MetricChoiceCard
                      key={String(def.key)}
                      definition={def}
                      value={isTouched ? currentValue : null}
                      onSelect={(v) => touchMetric(String(def.key), v)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 6: Finance ─────────────────────────────────────────────── */}
          {step === 6 && (
            <div>
              <h2 className="text-3xl font-bold text-white">Finance</h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                These figures generate an estimated savings and recovery range — not a guarantee. Automation can
                reduce operational waste, recover lost leads, and cut manual admin time.
              </p>

              <div className="mt-6 grid gap-6">
                {/* Inbound leads slider */}
                <FinanceRange
                  label="Monthly Inbound Opportunities"
                  hint="How many new leads, inquiries, or prospects enter your pipeline each month."
                  min={0}
                  max={500}
                  step={10}
                  value={answers.monthlyOpportunities}
                  onChange={(v) => update("monthlyOpportunities", v)}
                />
                {/* Outbound leads slider (new) */}
                <FinanceRange
                  label="Monthly Outbound Activities"
                  hint="How many proactive outbound contacts, campaigns, or follow-ups your team initiates each month."
                  min={0}
                  max={500}
                  step={10}
                  value={answers.outboundLeads}
                  onChange={(v) => update("outboundLeads", v)}
                />
                {/* Hourly value slider */}
                <FinanceRange
                  label="Average Strategic Hourly Value"
                  hint="Estimated hourly value of your leadership or senior team time — used to calculate the cost of admin drag."
                  prefix="$"
                  suffix="/hr"
                  min={25}
                  max={150}
                  step={5}
                  value={answers.hourlyValue}
                  onChange={(v) => update("hourlyValue", v)}
                />

                {/* Deal size ranges — multiple choice */}
                <div>
                  <div className="mb-1 font-semibold text-white">Average Deal Size / Contract Value</div>
                  <div className="mb-3 text-sm text-[var(--ink-muted)]">
                    Select the range that best represents your typical contract or project value.
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {dealSizeRanges.map(({ label }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          setOtherInputs((o) => ({ ...o, dealSizeRange: label }));
                          const range = dealSizeRanges.find((r) => r.label === label);
                          if (range) update("averageDealSize", range.value);
                        }}
                        className={`rounded-md border px-4 py-3 text-left text-sm transition ${
                          otherInputs.dealSizeRange === label
                            ? "border-[var(--tangerine)] bg-[rgba(240,144,60,0.12)] text-white"
                            : "border-[var(--line)] bg-white/[0.03] text-[#8fa8b0] hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Funding structure — multiple choice */}
                <div>
                  <div className="mb-1 font-semibold text-white">Primary Business Funding Structure</div>
                  <div className="mb-3 text-sm text-[var(--ink-muted)]">
                    Select the funding model that best describes your business.
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {fundingStructures.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setOtherInputs((o) => ({ ...o, fundingStructure: option }))}
                        className={`rounded-md border px-4 py-3 text-left text-sm transition ${
                          otherInputs.fundingStructure === option
                            ? "border-[var(--tangerine)] bg-[rgba(240,144,60,0.12)] text-white"
                            : "border-[var(--line)] bg-white/[0.03] text-[#8fa8b0] hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-5 text-xs leading-6 text-[var(--ink-muted)]">
                All figures generate an <em>estimated savings opportunity range</em>. No specific financial
                outcome is guaranteed.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-[var(--line)] pt-5">
            <button
              type="button"
              onClick={() => {
                setStep(Math.max(0, step - 1));
                window.scrollTo({ top: 0 });
              }}
              disabled={step === 0}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-[var(--line)] px-4 text-sm text-[#8fa8b0] disabled:opacity-40"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!canContinue}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-[var(--tangerine)] px-5 text-sm font-bold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === steps.length - 1 ? "See My Results" : "Continue"} <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ContactInput({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  hint,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  hint?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-[#c5d6ce]">
        {label}
        {required && <span className="ml-1 text-[var(--tangerine)]">*</span>}
      </span>
      {hint && <div className="mt-0.5 text-xs text-[var(--ink-muted)]">{hint}</div>}
      <input
        className={`mt-2 h-12 w-full rounded-md border bg-[var(--panel-2)] px-3 text-white outline-none transition focus:border-[var(--tangerine)] ${
          error ? "border-red-500" : "border-[var(--line)]"
        }`}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
      {error && <div className="mt-1 text-xs text-red-400">{error}</div>}
    </label>
  );
}

function ChoiceGrid({
  title,
  options,
  value,
  onSelect,
}: {
  title: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`rounded-md border p-4 text-left text-sm transition ${
              value === option
                ? "border-[var(--tangerine)] bg-[rgba(240,144,60,0.12)] text-white"
                : "border-[var(--line)] bg-white/[0.03] text-[#8fa8b0] hover:border-white/30 hover:text-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Drag-to-rank ──────────────────────────────────────────────────────────────

function DragRankList({
  items,
  onReorder,
}: {
  items: string[];
  onReorder: (items: string[]) => void;
}) {
  const dragIndexRef = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  function handleDragStart(index: number) {
    dragIndexRef.current = index;
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOver(index);
  }

  function handleDrop(index: number) {
    const from = dragIndexRef.current;
    if (from === null || from === index) {
      setDragOver(null);
      return;
    }
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    dragIndexRef.current = null;
    setDragOver(null);
    onReorder(next);
  }

  function handleDragEnd() {
    dragIndexRef.current = null;
    setDragOver(null);
  }

  // Mobile: move up/down buttons
  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onReorder(next);
  }

  function moveDown(index: number) {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onReorder(next);
  }

  return (
    <div className="grid gap-2">
      {items.map((item, index) => (
        <div
          key={item}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={() => handleDrop(index)}
          onDragEnd={handleDragEnd}
          className={`flex items-center gap-3 rounded-md border p-3 transition ${
            dragOver === index
              ? "border-[var(--tangerine)] bg-[rgba(240,144,60,0.12)]"
              : "cursor-grab border-[var(--line)] bg-white/[0.03] active:cursor-grabbing"
          }`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--petrol)] text-xs font-bold text-white">
            {index + 1}
          </span>
          <span className="flex-1 text-sm text-white">{item}</span>
          {/* Mobile move buttons */}
          <div className="flex flex-col gap-0.5 sm:hidden">
            <button
              type="button"
              onClick={() => moveUp(index)}
              disabled={index === 0}
              className="rounded p-0.5 text-[var(--ink-muted)] hover:text-white disabled:opacity-30"
            >
              <ChevronUp size={14} />
            </button>
            <button
              type="button"
              onClick={() => moveDown(index)}
              disabled={index === items.length - 1}
              className="rounded p-0.5 text-[var(--ink-muted)] hover:text-white disabled:opacity-30"
            >
              <ChevronDown size={14} />
            </button>
          </div>
          <GripVertical size={14} className="hidden shrink-0 text-[var(--ink-muted)] sm:block" />
        </div>
      ))}
      <p className="mt-2 text-xs text-[var(--ink-muted)]">
        Drag items to reorder · Use arrows on mobile · #1 = highest priority
      </p>
    </div>
  );
}

// ── Metric multiple-choice card ───────────────────────────────────────────────

function MetricChoiceCard({
  definition,
  value,
  onSelect,
}: {
  definition: (typeof metricDefinitions)[0];
  value: number | null;
  onSelect: (v: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-md border border-[var(--line)] bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="font-semibold text-white">
            {definition.label}
            {definition.unit && (
              <span className="ml-2 text-xs font-normal text-[var(--ink-muted)]">({definition.unit})</span>
            )}
          </div>
          <div className="mt-1 text-sm text-[var(--ink-muted)]">{definition.shortDesc}</div>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="mt-1.5 inline-flex items-center gap-1 text-xs text-[var(--tangerine)] hover:underline"
          >
            {expanded ? (
              <>
                Hide details <ChevronUp size={12} />
              </>
            ) : (
              <>
                What does this mean? <ChevronDown size={12} />
              </>
            )}
          </button>
          {expanded && (
            <div className="mt-2 whitespace-pre-wrap rounded-md bg-white/[0.04] p-3 text-xs leading-6 text-[var(--ink-muted)]">
              {definition.detailExpanded}
            </div>
          )}
        </div>
        {value !== null && (
          <div className="shrink-0 rounded-md bg-[rgba(240,144,60,0.15)] px-3 py-1 text-xs font-bold text-[var(--tangerine)]">
            {value}/5
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-2">
        {definition.scaleDescriptions.map((desc, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className={`flex items-start gap-3 rounded-md border px-4 py-3 text-left text-sm transition ${
              value === i
                ? "border-[var(--tangerine)] bg-[rgba(240,144,60,0.12)] text-white"
                : "border-[var(--line)] bg-white/[0.02] text-[#8fa8b0] hover:border-white/20 hover:text-white"
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                value === i ? "bg-[var(--tangerine)] text-white" : "bg-white/10 text-[var(--ink-muted)]"
              }`}
            >
              {i}
            </span>
            <span>{desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Finance range slider ──────────────────────────────────────────────────────

function FinanceRange({
  label,
  hint,
  value,
  min,
  max,
  step = 1,
  prefix = "",
  suffix = "",
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-md border border-[var(--line)] bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-semibold text-white">{label}</div>
          {hint && <div className="mt-1 text-sm text-[var(--ink-muted)]">{hint}</div>}
        </div>
        <div className="shrink-0 rounded-md bg-[rgba(240,144,60,0.15)] px-3 py-1 text-sm font-bold text-[var(--tangerine)]">
          {prefix}
          {value.toLocaleString()}
          {suffix}
        </div>
      </div>
      <input
        className="mt-4 w-full accent-[var(--tangerine)]"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="mt-1 flex justify-between text-[10px] text-[var(--ink-muted)]">
        <span>
          {prefix}
          {min.toLocaleString()}
          {suffix}
        </span>
        <span>
          {prefix}
          {max.toLocaleString()}
          {suffix}
        </span>
      </div>
    </label>
  );
}
