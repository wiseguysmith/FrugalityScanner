"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Lock } from "lucide-react";
import {
  businessGoals,
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
  businessGoalOther: string;
  toolGroupOthers: Record<string, string>;
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
  businessGoalOther: "",
  toolGroupOthers: {},
};

const steps = ["Contact", "Business Type", "Main Goal", "Team Scale", "Tech Stack", "Business Metrics", "Finance"];

const METRIC_KEYS = metricDefinitions.map((m) => m.key);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AssessmentPage() {
  const router = useRouter();
  const [contact, setContact] = useState<ContactInfo>(initialContact);
  const [answers, setAnswers] = useState<AssessmentAnswers>(initialAnswers);
  const [otherInputs, setOtherInputs] = useState<OtherInputs>(initialOtherInputs);
  const [touchedMetrics, setTouchedMetrics] = useState<Set<string>>(new Set());
  const [step, setStep] = useState(0);
  const [emailError, setEmailError] = useState("");

  const currentGoalBucket = goalBucket(answers.organizationType);
  const currentGoals = businessGoals[currentGoalBucket];

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

  function toggleTool(tool: string) {
    setAnswers((a) => ({
      ...a,
      tools: a.tools.includes(tool) ? a.tools.filter((t) => t !== tool) : [...a.tools, tool],
    }));
  }

  function setOtherInput(field: keyof Omit<OtherInputs, "toolGroupOthers">, value: string) {
    setOtherInputs((o) => ({ ...o, [field]: value }));
  }

  function setToolGroupOther(groupLabel: string, value: string) {
    setOtherInputs((o) => ({
      ...o,
      toolGroupOthers: { ...o.toolGroupOthers, [groupLabel]: value },
    }));
  }

  const allMetricsTouched = METRIC_KEYS.every((k) => touchedMetrics.has(String(k)));

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
          ? Boolean(
              answers.businessGoal &&
                (answers.businessGoal !== "Other" || otherInputs.businessGoalOther.trim()),
            )
          : step === 3
            ? Boolean(answers.teamSize)
            : step === 5
              ? allMetricsTouched
              : true;

  function next() {
    if (step === 0 && !isValidEmail(contact.email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    const scores = scoreAssessment(answers);
    window.localStorage.setItem(
      "frugality-assessment",
      JSON.stringify({ contact, answers, scores, otherInputs }),
    );
    router.push("/results");
  }

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--tangerine)]">
              Frugal Studio powered by Mindful Tech
            </div>
            <h1 className="mt-1 text-3xl font-bold text-white">Operational Intelligence Diagnostic</h1>
          </div>
          <div className="text-sm text-[var(--ink-muted)]">~10 min diagnostic</div>
        </header>

        {/* Progress bar */}
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

          {/* ─── Step 0: Contact ─────────────────────────────────────────── */}
          {step === 0 && (
            <div>
              <h2 className="text-3xl font-bold text-white">Let&apos;s get started</h2>
              <p className="mt-2 text-[var(--ink-muted)]">
                We&apos;ll send your personalised Operational Intelligence Report to this email once you complete
                the diagnostic.
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
                    hint="Your full report will be sent here. This also acts as verification of your contact details."
                  />
                  {/* TODO: Add disposable-email domain blocking here in future.
                      For V1 the full report send acts as lightweight email validation. */}
                  {/* TODO: Add OTP email verification when backend supports it. */}
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
                  hint="Strongly recommended — helps us verify your profile and personalise your report. Not required."
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

              {/* Privacy notice — shown on contact step */}
              <div className="mt-8 rounded-lg border border-[rgba(32,80,90,0.5)] bg-[rgba(32,80,90,0.12)] p-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                  <Lock size={14} className="text-[var(--tangerine)]" />
                  Frugal Studio Data Privacy Commitment
                </div>
                <p className="text-xs leading-6 text-[var(--ink-muted)]">
                  Your responses are used only to generate your diagnostic score, identify operational improvement
                  opportunities, and prepare your report. Your contact details, business metrics, and software
                  stack information are kept confidential and are not sold, shared, or distributed to third
                  parties. Data is stored securely and used only by Frugal Studio and Mindful Tech for internal
                  analysis, reporting, and follow-up related to this assessment.
                </p>
              </div>
            </div>
          )}

          {/* ─── Step 1: Business Type ─────────────────────────────────── */}
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
                    onChange={(v) => setOtherInput("organizationTypeOther", v)}
                    required
                  />
                </div>
              )}
            </div>
          )}

          {/* ─── Step 2: Main Goal ─────────────────────────────────────── */}
          {step === 2 && (
            <div>
              <ChoiceGrid
                title="What is the main business goal right now?"
                options={currentGoals}
                value={answers.businessGoal}
                onSelect={(value) => update("businessGoal", value)}
              />
              {answers.businessGoal === "Other" && (
                <div className="mt-4">
                  <ContactInput
                    label="Please describe your main goal"
                    value={otherInputs.businessGoalOther}
                    onChange={(v) => setOtherInput("businessGoalOther", v)}
                    required
                  />
                </div>
              )}
            </div>
          )}

          {/* ─── Step 3: Team Scale ────────────────────────────────────── */}
          {step === 3 && (
            <ChoiceGrid
              title="What is the current scale of your core team?"
              options={teamSizes}
              value={answers.teamSize}
              onSelect={(value) => update("teamSize", value)}
            />
          )}

          {/* ─── Step 4: Tech Stack ────────────────────────────────────── */}
          {step === 4 && (
            <div>
              <h2 className="text-3xl font-bold text-white">Which tools are active in the operation?</h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">Select all that apply across each category.</p>
              <div className="mt-6 grid gap-5">
                {toolGroups.map((group) => (
                  <div key={group.label}>
                    <div className="mb-3 text-sm font-semibold text-[var(--ink-muted)]">{group.label}</div>
                    <div className="flex flex-wrap gap-2">
                      {group.tools.map((tool) => {
                        if (tool === "Other") {
                          const groupOtherActive = answers.tools.includes(`${group.label}:Other`);
                          return (
                            <div key="Other" className="flex flex-col gap-2">
                              <button
                                type="button"
                                onClick={() => toggleTool(`${group.label}:Other`)}
                                className={`rounded-md border px-3 py-2 text-sm transition ${
                                  groupOtherActive
                                    ? "border-[var(--tangerine)] bg-[rgba(240,144,60,0.12)] text-white"
                                    : "border-[var(--line)] bg-white/[0.035] text-[#8fa8b0] hover:border-white/30"
                                }`}
                              >
                                Other
                              </button>
                              {groupOtherActive && (
                                <input
                                  className="h-10 w-48 rounded-md border border-[var(--tangerine)] bg-[var(--panel-2)] px-3 text-sm text-white outline-none placeholder:text-[var(--ink-muted)]"
                                  placeholder={`Specify ${group.label} tool…`}
                                  value={otherInputs.toolGroupOthers[group.label] ?? ""}
                                  onChange={(e) => setToolGroupOther(group.label, e.target.value)}
                                />
                              )}
                            </div>
                          );
                        }
                        return (
                          <button
                            key={tool}
                            type="button"
                            onClick={() => toggleTool(tool)}
                            className={`rounded-md border px-3 py-2 text-sm transition ${
                              answers.tools.includes(tool)
                                ? "border-[var(--tangerine)] bg-[rgba(240,144,60,0.12)] text-white"
                                : "border-[var(--line)] bg-white/[0.035] text-[#8fa8b0] hover:border-white/30"
                            }`}
                          >
                            {tool}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Step 5: Business Metrics ──────────────────────────────── */}
          {step === 5 && (
            <div>
              <h2 className="text-3xl font-bold text-white">Business Metrics</h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                Rate each metric from 0 (best) to 5 (worst). Move each slider to register your answer. All six
                must be completed before continuing.
              </p>
              {!allMetricsTouched && (
                <div className="mt-3 rounded-md bg-[rgba(240,144,60,0.1)] px-4 py-2 text-xs text-[var(--tangerine)]">
                  {METRIC_KEYS.length - touchedMetrics.size} metric
                  {METRIC_KEYS.length - touchedMetrics.size === 1 ? "" : "s"} remaining
                </div>
              )}
              <div className="mt-5 grid gap-4">
                {metricDefinitions.map((def) => (
                  <MetricSlider
                    key={String(def.key)}
                    definition={def}
                    value={answers[def.key] as number}
                    touched={touchedMetrics.has(String(def.key))}
                    onChange={(v) => touchMetric(String(def.key), v)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ─── Step 6: Finance ───────────────────────────────────────── */}
          {step === 6 && (
            <div>
              <h2 className="text-3xl font-bold text-white">Finance</h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                These figures are used to estimate a potential savings and recovery range — not a guarantee.
                Automation can reduce operational waste, recover lost leads, and reduce manual admin hours.
              </p>
              <div className="mt-6 grid gap-6">
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
                <FinanceRange
                  label="Monthly Inbound Opportunities"
                  hint="How many new leads, inquiries, or prospects enter your pipeline each month."
                  min={0}
                  max={500}
                  step={10}
                  value={answers.monthlyOpportunities}
                  onChange={(v) => update("monthlyOpportunities", v)}
                />
                <FinanceRange
                  label="Average Deal Size / Contract Value"
                  hint="Typical contract or deal value — used to estimate potential revenue recovery from reduced lead leakage."
                  prefix="$"
                  min={100}
                  max={10000}
                  step={100}
                  value={answers.averageDealSize}
                  onChange={(v) => update("averageDealSize", v)}
                />
              </div>
              <p className="mt-5 text-xs leading-6 text-[var(--ink-muted)]">
                All figures generate an <em>estimated savings opportunity range</em>. Language such as
                &quot;potential savings range&quot; is used throughout — no specific financial outcome is
                guaranteed.
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
              className="inline-flex h-11 items-center gap-2 rounded-md bg-[var(--petrol)] px-5 text-sm font-bold text-white transition hover:bg-[#286878] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === steps.length - 1 ? "See My Results" : "Continue"} <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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
                : "border-[var(--line)] bg-white/[0.035] text-[#8fa8b0] hover:border-white/30 hover:text-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function MetricSlider({
  definition,
  value,
  touched,
  onChange,
}: {
  definition: (typeof metricDefinitions)[0];
  value: number;
  touched: boolean;
  onChange: (v: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const scaleLabel = definition.scaleLabels[value] ?? "";

  return (
    <div className="rounded-md border border-[var(--line)] bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white">
            {definition.label}
            {definition.sublabel && (
              <span className="ml-2 text-xs font-normal text-[var(--ink-muted)]">({definition.sublabel})</span>
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
        <div
          className={`shrink-0 rounded-md px-3 py-1 text-xs font-bold ${
            touched
              ? "bg-[rgba(240,144,60,0.15)] text-[var(--tangerine)]"
              : "bg-white/5 text-[var(--ink-muted)]"
          }`}
        >
          {touched ? `${value}` : "—"}
        </div>
      </div>
      {touched && (
        <div className="mt-2 text-xs font-medium text-white/70">{scaleLabel}</div>
      )}
      <input
        className="mt-3 w-full accent-[var(--tangerine)]"
        type="range"
        min={0}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="mt-1 flex justify-between text-[10px] text-[var(--ink-muted)]">
        <span>0 — Best</span>
        <span>5 — Worst</span>
      </div>
    </div>
  );
}

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

