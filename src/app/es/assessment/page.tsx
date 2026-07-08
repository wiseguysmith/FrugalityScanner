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
  toolGroups,
  type AssessmentAnswers,
  type OrganizationType,
} from "@/lib/assessment";
import { scoreAssessment } from "@/lib/scoring";

type ContactInfo = {
  firstName: string; lastName: string; email: string;
  company: string; website: string; linkedinUrl: string; phone: string;
};
type OtherInputs = {
  organizationTypeOther: string; businessGoalRanking: string[];
  toolGroupOthers: Record<string, string>; dealSizeRange: string; fundingStructure: string;
};

const initialContact: ContactInfo = { firstName: "", lastName: "", email: "", company: "", website: "", linkedinUrl: "", phone: "" };
const initialOtherInputs: OtherInputs = { organizationTypeOther: "", businessGoalRanking: [], toolGroupOthers: {}, dealSizeRange: "", fundingStructure: "" };

const businessGoalsES: Record<string, string[]> = {
  startup: [
    "Asegurar financiamiento o apoyo de subvenciones",
    "Lanzar o escalar un producto",
    "Validar MVP o nueva funcionalidad",
    "Liberar a fundadores/desarrolladores de tareas administrativas",
    "Automatizar procesos manuales recurrentes",
    "Otro",
  ],
  commercial: [
    "Detener la fuga de prospectos y automatizar el onboarding",
    "Proteger los márgenes operativos reduciendo costos internos",
    "Recuperar tiempo ejecutivo del papeleo",
    "Estandarizar los flujos de trabajo del equipo interno",
    "Automatizar procesos manuales recurrentes",
    "Otro",
  ],
  ngo: [
    "Optimizar el onboarding de donantes o participantes",
    "Mejorar la coordinación interna de proyectos",
    "Simplificar las estructuras de reporte",
    "Automatizar procesos manuales recurrentes",
    "Otro",
  ],
};

const STEPS = ["Contacto", "Tipo de Negocio", "Objetivo Principal", "Escala del Equipo", "Stack Tecnológico", "Métricas", "Finanzas"];
const METRIC_KEYS = metricDefinitions.map((m) => String(m.key));

function isValidEmail(email: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function groupToolIds(groupLabel: string, tools: string[]) {
  return [...tools.map((t) => (t === "Other" ? `${groupLabel}:Other` : t)), `${groupLabel}:None`];
}

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

const SCALE_ES: Record<string, string[]> = {
  dataReentry: [
    "Los datos fluyen sin problemas entre sistemas. No se requiere entrada manual.",
    "Los flujos principales están integrados; solo se necesitan ajustes menores ocasionales.",
    "Existen integraciones básicas pero el equipo aún sincroniza manualmente algunos datos diariamente.",
    "Copiar y pegar prospectos cerrados en facturación o rastreadores de proyectos es rutinario.",
    "Se invierte tiempo significativo semanalmente duplicando archivos entre plataformas desconectadas.",
    "Personal senior retranscribe registros idénticos diariamente, causando retrasos y fatiga.",
  ],
  leadDropOff: [
    "Entradas capturadas y enrutadas al instante. Respuesta en menos de 5 minutos. (~0% fuga)",
    "Flujos de trabajo básicos automatizados con solo pequeños retrasos. (~5% fuga)",
    "Seguimiento básico en CRM pero la sincronización manual ralentiza el seguimiento a horas. (~15% fuga)",
    "Los prospectos se enfrían porque los datos están divididos entre WhatsApp, correo y hojas de cálculo. (~25% fuga)",
    "Sin fuente única de verdad; las oportunidades de alto valor se pierden. (~35% fuga)",
    "La mitad de los prospectos entrantes se enfrían por la lenta coordinación manual. (~50% fuga)",
  ],
  founderFatigue: [
    "Capacidad de liderazgo enfocada en estrategia, ingresos o capital. (0 hrs/semana)",
    "Administración mayormente automatizada; solo se necesita una revisión rápida semanal. (~2 hrs/semana)",
    "Las operaciones funcionan, pero la fragmentación de herramientas genera pequeñas tareas manuales semanales. (~5 hrs/semana)",
    "La administración distrae regularmente al liderazgo de la estrategia. (~10 hrs/semana)",
    "Casi dos días laborales por semana se dedican a actualizar manualmente sistemas desconectados. (~15 hrs/semana)",
    "Los fundadores atrapados en ciclos administrativos que crean un techo al crecimiento. (20+ hrs/semana)",
  ],
  processComplexity: [
    "Flujos de trabajo completamente optimizados y estandarizados. Sin carga manual.",
    "Claros y mayormente estandarizados; se producen ajustes menores ocasionalmente.",
    "Existen SOPs, pero quedan 1–2 puntos de control manuales o traspasos heredados.",
    "Los flujos se enredan; las solicitudes personalizadas requieren seguimiento manual.",
    "La entrega estándar requiere navegar pasos no documentados o aprobaciones redundantes.",
    "Flujos tan complicados que se pierden tareas; completarlas requiere resolución constante de problemas.",
  ],
  documentationMaturity: [
    "Procesos principales en una fuente centralizada de verdad. Un nuevo empleado puede ejecutar de forma autónoma.",
    "Flujos de trabajo principales documentados; los casos límite aún necesitan aclaración ocasional.",
    "Existen SOPs pero no se actualizan consistentemente.",
    "Documentación dispersa entre Slack, drives personales, correo y archivos aleatorios.",
    "Los procesos viven mayormente en la mente de las personas y deben explicarse repetidamente.",
    "Sin documentación centralizada. La entrega se congela cuando una persona clave no está disponible.",
  ],
  founderDependency: [
    "Las operaciones rutinarias funcionan a través de sistemas claros y marcos de equipo estandarizados.",
    "El liderazgo solo se necesita para casos excepcionales o alineación estratégica.",
    "Los días estándar transcurren sin problemas; 1–2 hitos aún necesitan revisión del fundador.",
    "El trabajo se detiene regularmente hasta que el fundador desbloquea una tarea o explica un proceso.",
    "El equipo carece de sistemas para ejecutar de forma asíncrona; el fundador impulsa el trabajo estándar.",
    "Sin memoria estructural. La ejecución se congela cuando el liderazgo no está disponible.",
  ],
};

const organizationTypesES: string[] = [
  "Startup Digital",
  "Startup de Hardware / DeepTech",
  "Servicios Profesionales",
  "Profesional Individual",
  "Bienes Raíces / Servicios Inmobiliarios",
  "Hospitalidad / Turismo",
  "ONG / Fundación",
  "Empresa Comercial",
  "Otro",
];

const orgTypeToEN: Record<string, string> = {
  "Startup Digital": "Digital Startup",
  "Startup de Hardware / DeepTech": "Hardware / DeepTech Startup",
  "Servicios Profesionales": "Professional Services",
  "Profesional Individual": "Individual Professional",
  "Bienes Raíces / Servicios Inmobiliarios": "Real Estate / Property Services",
  "Hospitalidad / Turismo": "Hospitality / Tourism",
  "ONG / Fundación": "NGO / Foundation",
  "Empresa Comercial": "Commercial Firm",
  "Otro": "Other",
};
const orgTypeToES: Record<string, string> = Object.fromEntries(Object.entries(orgTypeToEN).map(([es, en]) => [en, es]));

const teamSizesES: string[] = [
  "Solo / 1 persona",
  "Núcleo Lean / 2–5 personas",
  "Equipo en Crecimiento / 6–15 personas",
  "Operación Establecida / 15+ personas",
];
const teamSizeToEN: Record<string, string> = {
  "Solo / 1 persona": "Solo / 1 person",
  "Núcleo Lean / 2–5 personas": "Lean Core / 2–5 people",
  "Equipo en Crecimiento / 6–15 personas": "Scaling Team / 6–15 people",
  "Operación Establecida / 15+ personas": "Established Operation / 15+ people",
};
const teamSizeToES: Record<string, string> = Object.fromEntries(Object.entries(teamSizeToEN).map(([es, en]) => [en, es]));

export default function AssessmentPageES() {
  const router = useRouter();
  const [contact, setContact] = useState<ContactInfo>(initialContact);
  const [answers, setAnswers] = useState<AssessmentAnswers>(initialAnswers);
  const [otherInputs, setOtherInputs] = useState<OtherInputs>(initialOtherInputs);
  const [touchedMetrics, setTouchedMetrics] = useState<Set<string>>(new Set());
  const [rankedGoals, setRankedGoals] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [emailError, setEmailError] = useState("");

  const currentGoalBucket = goalBucket(answers.organizationType);
  const currentGoals = businessGoalsES[currentGoalBucket] ?? businessGoals[currentGoalBucket];

  function updateContact<T extends keyof ContactInfo>(key: T, value: string) { setContact((c) => ({ ...c, [key]: value })); }
  function update<T extends keyof AssessmentAnswers>(key: T, value: AssessmentAnswers[T]) { setAnswers((a) => ({ ...a, [key]: value })); }
  function touchMetric(key: string, value: number) { update(key as keyof AssessmentAnswers, value as AssessmentAnswers[keyof AssessmentAnswers]); setTouchedMetrics((p) => new Set([...p, key])); }
  function toggleTool(tool: string, groupLabel: string) {
    setAnswers((a) => {
      const isNone = tool === `${groupLabel}:None`;
      const allIds = groupToolIds(groupLabel, toolGroups.find((g) => g.label === groupLabel)?.tools ?? []);
      if (a.tools.includes(tool)) return { ...a, tools: a.tools.filter((t) => t !== tool) };
      if (isNone) return { ...a, tools: [...a.tools.filter((t) => !allIds.includes(t)), tool] };
      return { ...a, tools: [...a.tools.filter((t) => t !== `${groupLabel}:None`), tool] };
    });
  }

  const allGroupsAnswered = toolGroups.every((group) => groupToolIds(group.label, group.tools).some((id) => answers.tools.includes(id)));
  const allMetricsTouched = METRIC_KEYS.every((k) => touchedMetrics.has(k));

  const canContinue =
    step === 0 ? Boolean(contact.firstName && contact.lastName && contact.email && isValidEmail(contact.email) && contact.company && contact.linkedinUrl)
    : step === 1 ? Boolean(answers.organizationType && (answers.organizationType !== "Other" || otherInputs.organizationTypeOther.trim()))
    : step === 2 ? rankedGoals.length > 0
    : step === 3 ? Boolean(answers.teamSize)
    : step === 4 ? allGroupsAnswered
    : step === 5 ? allMetricsTouched
    : step === 6 ? Boolean(otherInputs.dealSizeRange && otherInputs.fundingStructure)
    : true;

  function next() {
    if (step === 0 && !isValidEmail(contact.email)) { setEmailError("Por favor ingresa un correo electrónico válido."); return; }
    setEmailError("");
    if (step === 1) setRankedGoals(currentGoals);
    if (step === 2) { setOtherInputs((o) => ({ ...o, businessGoalRanking: rankedGoals })); update("businessGoal", rankedGoals[0] ?? ""); }
    if (step < STEPS.length - 1) { setStep(step + 1); window.scrollTo({ top: 0 }); return; }
    const selectedRange = dealSizeRanges.find((r) => r.label === otherInputs.dealSizeRange);
    const finalAnswers = { ...answers, averageDealSize: selectedRange?.value ?? answers.averageDealSize };
    const scores = scoreAssessment(finalAnswers);
    window.localStorage.setItem("frugality-assessment", JSON.stringify({ contact, answers: finalAnswers, scores, otherInputs }));
    router.push("/es/results");
  }

  return (
    <main className="min-h-screen bg-[var(--panel)] px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--tangerine)]">Frugal Studio powered by Mindful Tech Automations</div>
            <h1 className="mt-1 text-3xl font-bold text-[var(--petrol)]">Frugality Scanner</h1>
          </div>
          <div className="text-sm text-[var(--ink-muted)]">~10 min de diagnóstico</div>
        </header>

        <div className="mb-8 grid grid-cols-7 gap-2">
          {STEPS.map((label, index) => (
            <div key={label} title={label} className="h-1.5 rounded-full bg-[var(--panel-2)]">
              <div className={`h-1.5 rounded-full transition-all ${index < step ? "bg-[var(--petrol)]" : index === step ? "bg-[var(--tangerine)]" : "bg-transparent"}`} />
            </div>
          ))}
        </div>

        <section className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm">
          <div className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
            Sección {step + 1} de {STEPS.length}: {STEPS[step]}
          </div>

          {/* Step 0: Contacto */}
          {step === 0 && (
            <div>
              <h2 className="text-3xl font-bold text-[var(--petrol)]">Empecemos</h2>
              <p className="mt-2 text-[var(--ink-muted)]">Te enviaremos tu reporte personalizado del Frugality Scanner a este correo al completar el diagnóstico.</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <ContactInput label="Nombre" value={contact.firstName} onChange={(v) => updateContact("firstName", v)} required />
                <ContactInput label="Apellido" value={contact.lastName} onChange={(v) => updateContact("lastName", v)} required />
                <div className="md:col-span-2">
                  <ContactInput label="Correo empresarial" type="email" value={contact.email}
                    onChange={(v) => { updateContact("email", v); setEmailError(""); }} required error={emailError}
                    hint="Tu reporte completo será enviado aquí." />
                </div>
                <ContactInput label="Nombre de empresa / negocio" value={contact.company} onChange={(v) => updateContact("company", v)} required />
                <ContactInput label="URL de LinkedIn" value={contact.linkedinUrl} onChange={(v) => updateContact("linkedinUrl", v)}
                  required hint="Requerido — nos ayuda a personalizar tu reporte y verificar tu perfil." />
                <ContactInput label="Sitio web" value={contact.website} onChange={(v) => updateContact("website", v)} />
                <ContactInput label="Teléfono" type="tel" value={contact.phone} onChange={(v) => updateContact("phone", v)} />
              </div>
              <div className="mt-8 rounded-xl border border-[var(--tangerine)] bg-[rgba(240,144,60,0.08)] p-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[var(--tangerine)]">
                  <Lock size={14} /> Compromiso de Privacidad de Datos — Frugal Studio
                </div>
                <p className="text-xs leading-6 text-[var(--charcoal)]">
                  Tus respuestas se utilizan únicamente para generar tu puntuación de diagnóstico, identificar oportunidades de mejora operacional y preparar tu reporte. Tu información de contacto, métricas de negocio y datos de stack tecnológico son confidenciales y no se venden, comparten ni distribuyen a terceros. Los datos se almacenan de forma segura y son utilizados únicamente por Frugal Studio y Mindful Tech Automations para análisis interno, reportes y seguimiento relacionado con esta evaluación.
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Tipo de Negocio */}
          {step === 1 && (
            <div>
              <ChoiceGrid title="¿Qué tipo de organización eres?" options={organizationTypesES}
                value={orgTypeToES[answers.organizationType] ?? answers.organizationType}
                onSelect={(v) => update("organizationType", (orgTypeToEN[v] ?? v) as OrganizationType)} />
              {answers.organizationType === "Other" && (
                <div className="mt-4">
                  <ContactInput label="Describe tu tipo de negocio" value={otherInputs.organizationTypeOther}
                    onChange={(v) => setOtherInputs((o) => ({ ...o, organizationTypeOther: v }))} required />
                </div>
              )}
            </div>
          )}

          {/* Step 2: Objetivo Principal */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-[var(--petrol)]">Ordena tus objetivos principales de negocio</h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">Arrastra los elementos para ordenarlos por prioridad — el más importante arriba.</p>
              <div className="mt-6">
                <DragRankList items={rankedGoals.length > 0 ? rankedGoals : currentGoals} onReorder={setRankedGoals} />
              </div>
            </div>
          )}

          {/* Step 3: Escala del Equipo */}
          {step === 3 && (
            <ChoiceGrid title="¿Cuál es la escala actual de tu equipo principal?" options={teamSizesES}
              value={teamSizeToES[answers.teamSize] ?? answers.teamSize}
              onSelect={(v) => update("teamSize", teamSizeToEN[v] ?? v)} />
          )}

          {/* Step 4: Stack Tecnológico */}
          {step === 4 && (
            <div>
              <h2 className="text-3xl font-bold text-[var(--petrol)]">Stack Tecnológico</h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">Todas las categorías son obligatorias. Selecciona todas las herramientas que apliquen — o elige <strong>Ninguna</strong> si no la usas.</p>
              {!allGroupsAnswered && (
                <div className="mt-3 rounded-lg border border-[rgba(240,144,60,0.4)] bg-[rgba(240,144,60,0.07)] px-4 py-2 text-xs text-[var(--tangerine)]">
                  {toolGroups.filter((g) => !groupToolIds(g.label, g.tools).some((id) => answers.tools.includes(id))).length} categorías pendientes
                </div>
              )}
              <div className="mt-6 grid gap-6">
                {toolGroups.map((group) => {
                  const ids = groupToolIds(group.label, group.tools);
                  const answered = ids.some((id) => answers.tools.includes(id));
                  return (
                    <div key={group.label}>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--petrol)]">{group.label}</span>
                        {answered && <span className="rounded-full bg-[rgba(32,80,90,0.1)] px-2 py-0.5 text-[10px] font-semibold text-[var(--petrol)]">✓</span>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.tools.map((tool) => (
                          <button key={tool} type="button" onClick={() => toggleTool(tool, group.label)}
                            className={`rounded-lg border px-3 py-2 text-sm transition ${answers.tools.includes(tool) ? "border-[var(--tangerine)] bg-[rgba(240,144,60,0.1)] text-[var(--petrol)] font-semibold" : "border-[var(--line)] bg-[var(--panel)] text-[var(--charcoal)] hover:border-[var(--petrol)]"}`}>
                            {tool}
                          </button>
                        ))}
                        <button type="button" onClick={() => toggleTool(`${group.label}:Other`, group.label)}
                          className={`rounded-lg border px-3 py-2 text-sm transition ${answers.tools.includes(`${group.label}:Other`) ? "border-[var(--tangerine)] bg-[rgba(240,144,60,0.1)] text-[var(--petrol)] font-semibold" : "border-[var(--line)] bg-[var(--panel)] text-[var(--charcoal)] hover:border-[var(--petrol)]"}`}>
                          Otro
                        </button>
                        <button type="button" onClick={() => toggleTool(`${group.label}:None`, group.label)}
                          className={`rounded-lg border px-3 py-2 text-sm transition ${answers.tools.includes(`${group.label}:None`) ? "border-[var(--ink-muted)] bg-[var(--panel-2)] text-[var(--charcoal)] font-semibold" : "border-[var(--line)] bg-[var(--panel)] text-[var(--charcoal)] hover:border-[var(--petrol)]"}`}>
                          Ninguna
                        </button>
                      </div>
                      {answers.tools.includes(`${group.label}:Other`) && (
                        <input className="mt-2 h-10 w-64 rounded-lg border border-[var(--tangerine)] bg-white px-3 text-sm text-[var(--charcoal)] outline-none placeholder:text-[var(--ink-muted)] focus:ring-1 focus:ring-[var(--tangerine)]"
                          placeholder={`Especifica herramienta de ${group.label}…`}
                          value={otherInputs.toolGroupOthers[group.label] ?? ""}
                          onChange={(e) => setOtherInputs((o) => ({ ...o, toolGroupOthers: { ...o.toolGroupOthers, [group.label]: e.target.value } }))} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Métricas */}
          {step === 5 && (
            <div>
              <h2 className="text-3xl font-bold text-[var(--petrol)]">Métricas del Negocio</h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">Selecciona la opción que mejor describa tu situación actual para cada métrica. Las seis deben ser respondidas.</p>
              {!allMetricsTouched && (
                <div className="mt-3 rounded-lg border border-[rgba(240,144,60,0.4)] bg-[rgba(240,144,60,0.07)] px-4 py-2 text-xs text-[var(--tangerine)]">
                  {METRIC_KEYS.length - touchedMetrics.size} métrica{METRIC_KEYS.length - touchedMetrics.size === 1 ? "" : "s"} pendiente{METRIC_KEYS.length - touchedMetrics.size === 1 ? "" : "s"}
                </div>
              )}
              <div className="mt-5 grid gap-6">
                {metricDefinitions.map((def) => (
                  <MetricChoiceCardES key={String(def.key)} definition={def}
                    value={touchedMetrics.has(String(def.key)) ? (answers[def.key] as number) : null}
                    onSelect={(v) => touchMetric(String(def.key), v)} />
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Finanzas */}
          {step === 6 && (
            <div>
              <h2 className="text-3xl font-bold text-[var(--petrol)]">Finanzas</h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">Estas cifras generan un rango estimado de ahorros y recuperación — no es una garantía.</p>
              <div className="mt-6 grid gap-6">
                <FinanceRange label="Oportunidades Entrantes Mensuales" hint="Nuevos prospectos o leads que entran a tu pipeline cada mes."
                  min={0} max={500} step={10} value={answers.monthlyOpportunities} onChange={(v) => update("monthlyOpportunities", v)} />
                <FinanceRange label="Actividades Salientes Mensuales" hint="Contactos salientes, campañas o seguimientos iniciados cada mes."
                  min={0} max={500} step={10} value={answers.outboundLeads} onChange={(v) => update("outboundLeads", v)} />
                <FinanceRange label="Valor Estratégico por Hora Promedio" hint="Valor estimado por hora del tiempo de liderazgo o equipo senior."
                  prefix="$" suffix="/hr" min={25} max={150} step={5} value={answers.hourlyValue} onChange={(v) => update("hourlyValue", v)} />
                <div>
                  <div className="mb-1 font-semibold text-[var(--petrol)]">Tamaño Promedio de Contrato / Negocio</div>
                  <div className="mb-3 text-sm text-[var(--ink-muted)]">Selecciona el rango que mejor represente el valor típico de tu contrato.</div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {dealSizeRanges.map(({ label }) => (
                      <button key={label} type="button"
                        onClick={() => { setOtherInputs((o) => ({ ...o, dealSizeRange: label })); const r = dealSizeRanges.find((x) => x.label === label); if (r) update("averageDealSize", r.value); }}
                        className={`rounded-lg border px-4 py-3 text-left text-sm transition ${otherInputs.dealSizeRange === label ? "border-[var(--tangerine)] bg-[rgba(240,144,60,0.1)] text-[var(--petrol)] font-semibold" : "border-[var(--line)] bg-[var(--panel)] text-[var(--charcoal)] hover:border-[var(--petrol)]"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-1 font-semibold text-[var(--petrol)]">Estructura Principal de Financiamiento</div>
                  <div className="mb-3 text-sm text-[var(--ink-muted)]">Selecciona el modelo de financiamiento que mejor describe tu negocio.</div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {fundingStructures.map((option) => (
                      <button key={option} type="button"
                        onClick={() => setOtherInputs((o) => ({ ...o, fundingStructure: option }))}
                        className={`rounded-lg border px-4 py-3 text-left text-sm transition ${otherInputs.fundingStructure === option ? "border-[var(--tangerine)] bg-[rgba(240,144,60,0.1)] text-[var(--petrol)] font-semibold" : "border-[var(--line)] bg-[var(--panel)] text-[var(--charcoal)] hover:border-[var(--petrol)]"}`}>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-[var(--line)] pt-5">
            <button type="button" onClick={() => { setStep(Math.max(0, step - 1)); window.scrollTo({ top: 0 }); }} disabled={step === 0}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[var(--line)] px-4 text-sm font-medium text-[var(--petrol)] transition hover:border-[var(--petrol)] disabled:opacity-40">
              <ArrowLeft size={16} /> Atrás
            </button>
            <button type="button" onClick={next} disabled={!canContinue}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--tangerine)] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-50">
              {step === STEPS.length - 1 ? "Ver Mis Resultados" : "Continuar"} <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ContactInput({ label, type = "text", value, onChange, required = false, hint, error }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  required?: boolean; hint?: string; error?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[var(--petrol)]">{label}{required && <span className="ml-1 text-[var(--tangerine)]">*</span>}</span>
      {hint && <div className="mt-0.5 text-xs text-[var(--ink-muted)]">{hint}</div>}
      <input className={`mt-2 h-12 w-full rounded-lg border bg-white px-3 text-[var(--charcoal)] outline-none transition focus:border-[var(--petrol)] focus:ring-1 focus:ring-[var(--petrol)] ${error ? "border-red-400" : "border-[var(--line)]"}`}
        type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} />
      {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
    </label>
  );
}

function ChoiceGrid({ title, options, value, onSelect }: { title: string; options: string[]; value: string; onSelect: (v: string) => void; }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-[var(--petrol)]">{title}</h2>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {options.map((option) => (
          <button key={option} type="button" onClick={() => onSelect(option)}
            className={`rounded-lg border p-4 text-left text-sm transition ${value === option ? "border-[var(--tangerine)] bg-[rgba(240,144,60,0.1)] text-[var(--petrol)] font-semibold" : "border-[var(--line)] bg-[var(--panel)] text-[var(--charcoal)] hover:border-[var(--petrol)]"}`}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function DragRankList({ items, onReorder }: { items: string[]; onReorder: (i: string[]) => void }) {
  const dragIndexRef = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  function handleDragOver(e: React.DragEvent, index: number) { e.preventDefault(); setDragOver(index); }
  function handleDrop(index: number) {
    const from = dragIndexRef.current;
    if (from === null || from === index) { setDragOver(null); return; }
    const next = [...items]; const [moved] = next.splice(from, 1); next.splice(index, 0, moved);
    dragIndexRef.current = null; setDragOver(null); onReorder(next);
  }
  function move(index: number, dir: -1 | 1) { const next = [...items]; [next[index], next[index + dir]] = [next[index + dir], next[index]]; onReorder(next); }
  return (
    <div className="grid gap-2">
      {items.map((item, index) => (
        <div key={item} draggable onDragStart={() => { dragIndexRef.current = index; }}
          onDragOver={(e) => handleDragOver(e, index)} onDrop={() => handleDrop(index)} onDragEnd={() => { dragIndexRef.current = null; setDragOver(null); }}
          className={`flex cursor-grab items-center gap-3 rounded-lg border p-3 transition active:cursor-grabbing ${dragOver === index ? "border-[var(--tangerine)] bg-[rgba(240,144,60,0.08)]" : "border-[var(--line)] bg-white"}`}>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--petrol)] text-xs font-bold text-white">{index + 1}</span>
          <span className="flex-1 text-sm text-[var(--charcoal)]">{item}</span>
          <div className="flex flex-col gap-0.5 sm:hidden">
            <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="p-0.5 text-[var(--ink-muted)] hover:text-[var(--petrol)] disabled:opacity-30"><ChevronUp size={14} /></button>
            <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} className="p-0.5 text-[var(--ink-muted)] hover:text-[var(--petrol)] disabled:opacity-30"><ChevronDown size={14} /></button>
          </div>
          <GripVertical size={14} className="hidden shrink-0 text-[var(--ink-muted)] sm:block" />
        </div>
      ))}
      <p className="mt-2 text-xs text-[var(--ink-muted)]">Arrastra para reordenar · Usa las flechas en móvil · #1 = mayor prioridad</p>
    </div>
  );
}

function MetricChoiceCardES({ definition, value, onSelect }: {
  definition: (typeof metricDefinitions)[0]; value: number | null; onSelect: (v: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const key = String(definition.key);
  const labelES = METRIC_LABELS_ES[key] ?? definition.label;
  const scalesES = SCALE_ES[key] ?? definition.scaleDescriptions;
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="font-bold text-[var(--petrol)]">{labelES}</div>
          <div className="mt-1 text-sm text-[var(--charcoal)]">{SHORT_DESC_ES[key] ?? definition.shortDesc}</div>
          <button type="button" onClick={() => setExpanded((e) => !e)}
            className="mt-1.5 inline-flex items-center gap-1 text-xs text-[var(--tangerine)] hover:underline">
            {expanded ? <>Ocultar detalles <ChevronUp size={12} /></> : <>¿Qué significa esto? <ChevronDown size={12} /></>}
          </button>
          {expanded && <div className="mt-2 whitespace-pre-wrap rounded-lg bg-[var(--panel)] p-3 text-xs leading-6 text-[var(--charcoal)]">{definition.detailExpanded}</div>}
        </div>
        {value !== null && <div className="shrink-0 rounded-lg bg-[rgba(240,144,60,0.1)] px-3 py-1 text-xs font-bold text-[var(--tangerine)]">{value}/5</div>}
      </div>
      <div className="mt-4 grid gap-2">
        {scalesES.map((desc, i) => (
          <button key={i} type="button" onClick={() => onSelect(i)}
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${value === i ? "border-[var(--tangerine)] bg-[rgba(240,144,60,0.1)] text-[var(--petrol)]" : "border-[var(--line)] bg-[var(--panel)] text-[var(--charcoal)] hover:border-[var(--petrol)]"}`}>
            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${value === i ? "bg-[var(--tangerine)] text-white" : "bg-[var(--panel-2)] text-[var(--ink-muted)]"}`}>{i}</span>
            <span>{desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FinanceRange({ label, hint, value, min, max, step = 1, prefix = "", suffix = "", onChange }: {
  label: string; hint?: string; value: number; min: number; max: number; step?: number; prefix?: string; suffix?: string; onChange: (v: number) => void;
}) {
  return (
    <label className="block rounded-xl border border-[var(--line)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-semibold text-[var(--petrol)]">{label}</div>
          {hint && <div className="mt-1 text-sm text-[var(--ink-muted)]">{hint}</div>}
        </div>
        <div className="shrink-0 rounded-lg bg-[rgba(240,144,60,0.1)] px-3 py-1 text-sm font-bold text-[var(--tangerine)]">{prefix}{value.toLocaleString()}{suffix}</div>
      </div>
      <input className="mt-4 w-full accent-[var(--tangerine)]" type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <div className="mt-1 flex justify-between text-[10px] text-[var(--ink-muted)]">
        <span>{prefix}{min.toLocaleString()}{suffix}</span><span>{prefix}{max.toLocaleString()}{suffix}</span>
      </div>
    </label>
  );
}
