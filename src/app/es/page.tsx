"use client";

import { ArrowRight, Gauge, Layers3, LineChart, Linkedin, Workflow } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import type { LucideIcon } from "lucide-react";

const LINKEDIN_URL = "https://www.linkedin.com/company/mindfultechnologies";

const measures: [string, string, LucideIcon][] = [
  ["Fricción en Flujos de Trabajo", "Donde las transferencias manuales y aprobaciones redundantes frenan tu velocidad de ejecución diaria.", Workflow],
  ["Fuga de Ingresos", "Donde los tiempos de respuesta no optimizados y las brechas en la entrega sangran oportunidades de alto valor.", LineChart],
  ["Dependencia del Fundador", "Donde el liderazgo sigue siendo el sistema operativo predeterminado para tareas rutinarias.", Layers3],
  ["Fragmentación de Sistemas", "Donde las herramientas desconectadas y los datos dispersos crean una deuda estructural pesada.", Gauge],
];

const infoBoxes = [
  {
    title: "Para quién es",
    text: "Diseñado para fundadores tecnológicos, operadores de servicios, inmobiliarias y organizaciones que buscan mejorar su eficiencia operacional.",
  },
  {
    title: "Qué recibirás",
    text: "Obtendrás puntuaciones operacionales inmediatas en tus flujos críticos, identificarás tu principal cuello de botella de ejecución y recibirás un mapa de acción estratégico.",
  },
  {
    title: "Por qué la fricción cuesta dinero",
    text: "Las startups y las pequeñas empresas rara vez fracasan porque su visión es demasiado pequeña. Fracasan porque su modelo de ejecución es estructuralmente demasiado pesado.",
  },
];

export default function HomeES() {
  return (
    <main className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="executive-grid brand-shell border-b border-[var(--line)] px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-8">
              <img
                src="/logo-cobranded.png"
                alt="Frugal Studio powered by Mindful Tech Automations"
                className="h-20 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <h1 className="text-5xl font-bold leading-[1.06] text-[var(--petrol)] md:text-6xl">
              ¿Cuánto desperdicio operacional se esconde dentro de tu negocio?
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--charcoal)]">
              Un diagnóstico de 10 minutos para detectar las fugas ocultas que drenan tu negocio. Recupera el
              tiempo y los recursos que necesitas para escalar.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--ink-muted)]">
              Nuestra consultoría de automatización con IA transforma estos cuellos de botella operacionales en
              flujos de trabajo autónomos, asegurando tus márgenes y brindando la agilidad estructural necesaria
              para un crecimiento de alta velocidad. Empieza aquí.
            </p>
            <div className="mt-10 flex flex-col items-start gap-2">
              <span className="text-sm text-[var(--ink-muted)]">Desplázate para saber más</span>
              <svg className="animate-bounce text-[var(--tangerine)]" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pilares del diagnóstico ────────────────────────────────────── */}
      <section className="border-b border-[var(--line)] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--tangerine)]">
              Frugality Scanner Assessment
            </div>
            <h2 className="mt-2 text-3xl font-bold text-[var(--petrol)]">Cuatro pilares de diagnóstico</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {measures.map(([title, text, Icon]) => (
              <div key={title} className="flex gap-4 rounded-xl border border-[var(--line)] bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(32,80,90,0.08)] text-[var(--petrol)]">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="font-bold text-[var(--petrol)]">{title}</div>
                  <div className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">{text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Para quién — 3 columnas ───────────────────────────────────── */}
      <section className="section-alt border-b border-[var(--line)] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[var(--petrol)]">Construido para decisiones operacionales más inteligentes.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {infoBoxes.map(({ title, text }) => (
              <div key={title} className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm">
                <h3 className="font-bold text-[var(--petrol)]">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--charcoal)]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team / Powered by ─────────────────────────────────────────── */}
      <section className="border-b border-[var(--line)] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--tangerine)]">Desarrollado por</div>
          <h2 className="mt-2 text-2xl font-bold text-[var(--petrol)]">Mindful Tech Automations</h2>
          <div className="mt-6 max-w-2xl rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm">
            <div className="font-bold text-[var(--petrol)]">Elijah Smith</div>
            <div className="text-xs text-[var(--ink-muted)] mb-3">Fundador — Mindful Tech Automations</div>
            <p className="text-sm leading-7 text-[var(--charcoal)]">
              Elijah Smith es el fundador de Mindful Tech Automations, una consultoría de automatización con IA
              que ayuda a fundadores y operadores a eliminar el desperdicio operacional mediante sistemas de
              flujos de trabajo inteligentes. Se asocia con Frugal Studio para entregar el Frugality Scanner,
              convirtiendo los hallazgos diagnósticos en infraestructura empresarial automatizada y escalable.
            </p>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--petrol)] hover:text-[var(--tangerine)] transition">
              <Linkedin size={16} /> Mindful Tech Automations en LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA final ─────────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mt-3 max-w-2xl text-[var(--charcoal)]">
            Este diagnóstico GRATUITO es el punto de entrada directo a una Auditoría de Inteligencia Operacional
            pagada con Frugal Studio powered by Mindful Tech Automations, estableciendo el marco para la
            implementación completa de automatización de flujos de trabajo.
          </p>
          <div className="mt-8">
            <ButtonLink href="/es/assessment" variant="cta">
              <span className="inline-flex items-center gap-2">
                Iniciar Diagnóstico Gratuito <ArrowRight size={18} />
              </span>
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
