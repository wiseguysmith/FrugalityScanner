"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, FileText } from "lucide-react";
import { currency, metricDefinitions, type AssessmentAnswers, type ScoreResult } from "@/lib/assessment";
import { ScoreDial } from "@/components/ScoreDial";

const BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2_Rp7RRFppwCG3x-cR9AguNsBnlwt84k5EWDaKDTewkmc72flE0i_IH3m0YJVABnEhaakYuAdE";

type ContactInfo = {
  firstName: string; lastName: string; email: string;
  company: string; website: string; linkedinUrl: string; phone: string;
};
type StoredAssessment = {
  contact: ContactInfo; answers: AssessmentAnswers; scores: ScoreResult; otherInputs?: Record<string, unknown>;
};

const METRIC_LABELS_ES: Record<string, string> = {
  dataReentry: "Nivel de Automatización",
  leadDropOff: "% de Fuga de Pipeline",
  founderFatigue: "Fatiga del Fundador",
  processComplexity: "Complejidad de Procesos",
  documentationMaturity: "Madurez de Documentación",
  founderDependency: "Dependencia del Fundador",
};

const SHORT_DESC_ES: Record<string, string> = {
  dataReentry: "Cuánto tiempo pierde tu equipo copiando, pegando o reescribiendo datos manualmente entre sistemas desconectados.",
  leadDropOff: "Fuga en el pipeline causada por seguimiento lento, enrutamiento manual y herramientas de comunicación desconectadas.",
  founderFatigue: "Cuántas horas por semana pierde el liderazgo en administración rutinaria en lugar de crecimiento, ventas o estrategia.",
  processComplexity: "La fricción y el peso estructural de los flujos de trabajo principales de inicio a fin.",
  documentationMaturity: "Cuánto conocimiento operacional vive en una fuente centralizada de verdad vs. en la mente de las personas.",
  founderDependency: "Cuánto depende la ejecución diaria de la presencia, aprobaciones, memoria o supervisión manual del fundador.",
};

const ES_STATUS = { optimized: "Optimizado", moderate: "Moderado", needsAttention: "Necesita Atención", critical: "Crítico" };

const TOP_FINDINGS_ES: Record<string, string> = {
  "Lead Leakage: inbound opportunities are likely losing value because follow-up is slower than the business can afford.":
    "Fuga de Pipeline: las oportunidades entrantes están perdiendo valor porque el seguimiento es más lento de lo que el negocio puede permitirse.",
  "Automation Gap: manual re-entry is consuming time that should be reserved for selling, delivery, or strategic execution.":
    "Brecha de Automatización: la reingesta manual consume tiempo que debería reservarse para ventas, entrega o ejecución estratégica.",
  "Founder Dependency: leadership intervention appears to be required too often for routine work to keep moving.":
    "Dependencia del Fundador: la intervención del liderazgo parece requerirse con demasiada frecuencia para que el trabajo rutinario avance.",
  "Structural Debt: tool fragmentation and undocumented workflows are raising coordination costs.":
    "Deuda Estructural: la fragmentación de herramientas y los flujos no documentados están elevando los costos de coordinación.",
  "Process Complexity: high-value people may be carrying low-value coordination work across the workflow.":
    "Complejidad de Procesos: personas de alto valor pueden estar cargando trabajo de coordinación de bajo valor en el flujo de trabajo.",
  "Knowledge Debt: operational knowledge living in people's heads instead of documented systems creates execution risk.":
    "Deuda de Conocimiento: el conocimiento operacional que vive en la mente de las personas en lugar de sistemas documentados crea riesgo de ejecución.",
};

export default function ResultsPageES() {
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
        contact: { ...stored.contact, name: `${stored.contact.firstName} ${stored.contact.lastName}`.trim() },
        answers: stored.answers, scores: stored.scores, otherInputs: stored.otherInputs ?? {},
      }),
    })
      .then((res) => { setReportStatus(res.ok ? "sent" : "error"); if (res.ok) window.localStorage.removeItem("frugality-assessment"); })
      .catch(() => setReportStatus("error"));
  }, [stored]);

  if (!ready) {
    return <main className="min-h-screen bg-[var(--panel)]" />;
  }

  if (!stored) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-xl border border-[var(--line)] bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-[var(--petrol)]">No se encontró evaluación</h1>
          <a className="mt-5 inline-flex rounded-lg bg-[var(--tangerine)] px-5 py-3 font-bold text-white hover:bg-[var(--accent-strong)]" href="/es/assessment">
            Iniciar Diagnóstico Gratuito
          </a>
        </div>
      </main>
    );
  }

  const { scores, contact, answers } = stored;
  function handleReceiveReport() { setConfirmVisible(true); setTimeout(() => router.push("/es/thank-you"), 2400); }

  return (
    <main className="min-h-screen bg-[var(--panel)] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--tangerine)]">Frugal Studio powered by Mindful Tech</div>
          <h1 className="mt-2 text-4xl font-bold text-[var(--petrol)]">
            {contact.company ? `${contact.company} — ` : ""}Puntuaciones Frugality
          </h1>
          <p className="mt-1 text-[var(--ink-muted)]">Preparado para {contact.firstName} {contact.lastName}</p>
        </header>

        {/* CTA panel */}
        <div className="mb-8 rounded-xl border border-[var(--line)] bg-white p-5 shadow-sm">
          {confirmVisible ? (
            <div className="flex items-center gap-3">
              <CheckCircle size={18} className="shrink-0 text-[var(--tangerine)]" />
              <span className="text-sm text-[var(--charcoal)]">
                Tu reporte completo está en camino a <strong className="text-[var(--tangerine)]">{contact.email}</strong>. Redirigiendo…
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-semibold text-[var(--petrol)]">Obtén más información y detalles recibiendo tu Reporte Completo de Frugality</div>
                <div className="mt-1 text-sm text-[var(--ink-muted)]">
                  {reportStatus === "sending" ? "Estamos creando tu reporte completo — solo tomará un momento. Por favor revisa la carpeta de spam de tu correo."
                    : reportStatus === "error" ? "Hubo un problema al preparar tu reporte. Haz clic abajo para continuar de todas formas."
                    : "Tu reporte está listo. Haz clic abajo para enviarlo a tu correo."}
                </div>
              </div>
              <button type="button" onClick={handleReceiveReport}
                className="inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-[var(--tangerine)] px-6 text-sm font-bold text-white transition hover:bg-[var(--accent-strong)]">
                <FileText size={16} /> Haz clic para recibir el Reporte Completo por correo
              </button>
            </div>
          )}
          {reportStatus === "error" && !confirmVisible && (
            <p className="mt-3 text-xs text-red-500">
              Problema de entrega detectado — también escríbenos a{" "}
              <a href="mailto:felipe@frugalstudio.design" className="underline">felipe@frugalstudio.design</a>
            </p>
          )}
        </div>

        {/* Score cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <ScoreDial label="Índice de Inteligencia Operacional" value={scores.operationalIntelligenceIndex} highIsGood={true} statusLabels={ES_STATUS} />
          <div className="rounded-xl border border-[var(--line)] bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">Oportunidad de Ahorro Estimada</div>
            <div className="mt-4 text-4xl font-bold text-[#1a8a50]">{currency(scores.opportunityLow)}–{currency(scores.opportunityHigh)}</div>
            <div className="mt-2 text-xs font-semibold text-[#1a8a50]">Potencial de recuperación mensual</div>
            <div className="mt-1 text-xs text-[var(--ink-muted)]">Estimación diagnóstica — no es una garantía</div>
          </div>
          <ScoreDial label="Puntuación de Fricción Operacional" value={scores.operationalFrictionScore} highIsGood={false} statusLabels={ES_STATUS} />
          <ScoreDial label="Índice de Dependencia del Fundador" value={scores.founderDependencyIndex} highIsGood={false} statusLabels={ES_STATUS} />
        </div>

        {/* Top findings */}
        <div className="mt-6 rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[var(--petrol)]">Principales Hallazgos del Diagnóstico</h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">Tus puntos de mayor fricción operacional según tus respuestas.</p>
          <div className="mt-4 grid gap-3">
            {scores.topFindings.map((finding, i) => (
              <div key={finding} className="rounded-lg bg-[var(--panel)] p-4">
                <span className="mr-2 font-bold text-[var(--tangerine)]">{i + 1}.</span>
                <span className="text-[var(--charcoal)]">{TOP_FINDINGS_ES[finding] ?? finding}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metric breakdown */}
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-bold text-[var(--petrol)]">Desglose por Métrica</h2>
          <p className="mb-4 text-sm text-[var(--ink-muted)]">Todas las métricas van de 0 (mejor) → 5 (peor). Barras más altas indican mayor carga operacional.</p>
          <div className="grid gap-4">
            {metricDefinitions.map((def) => {
              const rawValue = answers[def.key] as number;
              const scaleLabel = def.scaleLabels[rawValue] ?? "";
              const pct = (rawValue / 5) * 100;
              const severity =
                rawValue >= 4 ? { badge: "bg-[rgba(201,64,64,0.1)] text-[#c94040]", bar: "bg-[#c94040]" }
                : rawValue >= 3 ? { badge: "bg-[rgba(240,144,60,0.12)] text-[var(--tangerine)]", bar: "bg-[var(--tangerine)]" }
                : { badge: "bg-[rgba(26,138,80,0.1)] text-[#1a8a50]", bar: "bg-[#1a8a50]" };
              return (
                <div key={String(def.key)} className="rounded-xl border border-[var(--line)] bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-[var(--petrol)]">{METRIC_LABELS_ES[String(def.key)] ?? def.label}</div>
                      <div className="mt-1 text-sm text-[var(--ink-muted)]">{SHORT_DESC_ES[String(def.key)] ?? def.shortDesc}</div>
                    </div>
                    <div className={`shrink-0 rounded-lg px-3 py-1 text-sm font-bold ${severity.badge}`}>{rawValue}/5</div>
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

        <div className="mt-8 flex justify-end">
          <a href="/es/assessment" className="text-sm text-[var(--ink-muted)] hover:text-[var(--petrol)]">Repetir evaluación</a>
        </div>

        <div className="mt-4 rounded-xl border border-[rgba(240,144,60,0.3)] bg-[rgba(240,144,60,0.06)] p-5 text-center">
          <p className="text-sm text-[var(--charcoal)]">
            ¿Quieres actuar sobre estos hallazgos ahora?{" "}
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--tangerine)] hover:underline">
              Reserva una Llamada de Descubrimiento
            </a>{" "}
            con Frugal Studio powered by Mindful Tech.
          </p>
        </div>
      </div>
    </main>
  );
}
