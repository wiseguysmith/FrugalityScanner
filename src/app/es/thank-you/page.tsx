"use client";

import { useState } from "react";
import { CalendarCheck, CheckCircle, Linkedin, Send } from "lucide-react";

const BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2_Rp7RRFppwCG3x-cR9AguNsBnlwt84k5EWDaKDTewkmc72flE0i_IH3m0YJVABnEhaakYuAdE";
const LINKEDIN_URL = "https://www.linkedin.com/company/mindfultechnologies";

const auditOutcomes = [
  "Mapa actual de fricción en flujos de trabajo",
  "Oportunidades de automatización prioritarias",
  "Rango estimado de ahorros o capacidad recuperada",
  "Revisión de fugas de prospectos y tiempos de respuesta",
  "Evaluación de documentación y dependencia del fundador",
  "Sprint de automatización inicial recomendado",
];

const pricingTiers = [
  { tier: "Proyecto Starter", range: "$1,500 – $3,000" },
  { tier: "Proyecto Growth", range: "$3,000 – $6,000" },
  { tier: "Proyecto Advanced", range: "$6,000 – $12,000" },
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
  if (score >= 9) return "Promotor — ¡Te encantó!";
  if (score >= 7) return "Pasivo — Bastante bien";
  return "Detractor — Necesita mejoras";
}

function npsBadgeColor(score: number): string {
  if (score >= 9) return "text-[#22a05a]";
  if (score >= 7) return "text-[#c9a200]";
  return "text-[#d93025]";
}

export default function ThankYouPageES() {
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

        <section className="rounded-xl border border-[var(--line)] bg-white p-8 shadow-sm">
          <CalendarCheck className="text-[var(--tangerine)]" size={40} />
          <h1 className="mt-4 text-2xl font-bold text-[var(--petrol)]">Reporte Enviado</h1>
          <p className="mt-4 text-base leading-7 text-[var(--charcoal)]">
            Revisa tu bandeja de entrada. Tu análisis de activos personalizado ha sido enviado. Ahora es momento
            de aislar los cuellos de botella de mayor valor y priorizar las correcciones operacionales necesarias
            para recuperar la eficiencia de tu equipo.
          </p>
        </section>

        <section className="mt-6 rounded-xl border border-[var(--line)] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[var(--petrol)]">Qué sigue: El Frugal Audit de 1 Día</h2>
          <p className="mt-4 leading-7 text-[var(--charcoal)]">
            Tu diagnóstico muestra dónde el desperdicio operacional puede estar costándole a tu negocio tiempo, dinero y velocidad.
          </p>
          <p className="mt-3 leading-7 text-[var(--charcoal)]">
            El <strong className="text-[var(--petrol)]">Frugal Audit</strong> es un sprint de inteligencia operacional de 1 día donde Frugal Studio y
            Mindful Tech Automations revisan tus flujos de trabajo, stack tecnológico, flujo de prospectos,
            cuellos de botella manuales, brechas de documentación y dependencia del fundador.
          </p>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">Qué incluye</h3>
          <ul className="mt-4 grid gap-3">
            {auditOutcomes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle size={16} className="mt-0.5 shrink-0 text-[var(--tangerine)]" />
                <span className="text-[var(--charcoal)]">{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">Niveles de proyecto</h3>
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
              <CalendarCheck size={16} /> Reservar una Llamada de Descubrimiento
            </a>
          </div>
        </section>

        {/* NPS */}
        <section className="mt-6 rounded-xl border border-[var(--line)] bg-white p-8 shadow-sm">
          {npsSubmitted ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle size={36} className="text-[#22a05a]" />
              <div className="text-lg font-bold text-[var(--petrol)]">¡Gracias por tu opinión!</div>
              <p className="text-sm text-[var(--ink-muted)]">Tu respuesta nos ayuda a mejorar la experiencia del Frugality Scanner.</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-[var(--petrol)]">¿Qué tan probable es que nos recomiendes?</h2>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">En una escala del 0 al 10</p>
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
              <div className="mt-2 flex justify-between text-[10px] text-[var(--ink-muted)] px-1">
                <span>0 — Poco probable</span>
                <span>10 — Muy probable</span>
              </div>
              <div className="mt-4 overflow-hidden rounded-full h-2 flex">
                <div className="bg-[#d93025] flex-[7]" />
                <div className="bg-[#e6b800] flex-[2]" />
                <div className="bg-[#22a05a] flex-[2]" />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-[var(--ink-muted)]">
                <span>Detractores (0–6)</span>
                <span>Pasivos (7–8)</span>
                <span>Promotores (9–10)</span>
              </div>
              {npsScore !== null && (
                <div className={`mt-3 text-sm font-semibold ${npsBadgeColor(npsScore)}`}>{npsLabel(npsScore)}</div>
              )}
              <div className="mt-6">
                <label className="block text-sm font-medium text-[var(--petrol)]">
                  ¿Comentarios o sugerencias? <span className="text-[var(--ink-muted)] font-normal">(opcional)</span>
                </label>
                <textarea rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Cuéntanos qué te pareció el diagnóstico, qué mejorarías o qué fue más útil…"
                  className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--charcoal)] outline-none transition focus:border-[var(--petrol)] focus:ring-1 focus:ring-[var(--petrol)] placeholder:text-[var(--ink-muted)] resize-none" />
              </div>
              <button type="button" onClick={submitNps} disabled={npsScore === null}
                className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--petrol)] px-6 text-sm font-bold text-white transition hover:bg-[#286878] disabled:opacity-40 disabled:cursor-not-allowed">
                <Send size={14} /> Enviar Opinión
              </button>
            </>
          )}
        </section>

        {/* Team */}
        <section className="mt-6 rounded-xl border border-[var(--line)] bg-white p-8 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--tangerine)]">Desarrollado por</div>
          <div className="mt-4">
            <div className="font-bold text-[var(--petrol)]">Elijah Smith</div>
            <div className="text-xs text-[var(--ink-muted)] mb-2">Fundador — Mindful Tech Automations</div>
            <p className="text-sm leading-7 text-[var(--charcoal)]">
              Elijah Smith es el fundador de Mindful Tech Automations, una consultoría de automatización con IA
              que ayuda a fundadores y operadores a eliminar el desperdicio operacional mediante sistemas de
              flujos de trabajo inteligentes. Se asocia con Frugal Studio para entregar el Frugality Scanner,
              convirtiendo los hallazgos diagnósticos en infraestructura empresarial automatizada y escalable.
            </p>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--petrol)] hover:text-[var(--tangerine)] transition">
              <Linkedin size={16} /> Mindful Tech Automations
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}
