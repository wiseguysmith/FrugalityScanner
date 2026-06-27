export const BRAND = {
  name: "Frugal Studio",
  poweredBy: "Mindful Tech Automations",
  cobranded: "Frugal Studio powered by Mindful Tech Automations",
  tagline: "Operational Intelligence Diagnostic",
  duration: "~10 min",
} as const;

// TODO: Replace text placeholder in Header.tsx with the final co-branded logo asset
// when it becomes available. The asset should be named something like:
// /public/logo-frugal-studio-powered-by-mindful-tech.svg
// Then insert: <img src="/logo-frugal-studio-powered-by-mindful-tech.svg" alt="Frugal Studio powered by Mindful Tech" className="h-8" />
export const LOGO_PLACEHOLDER_TODO = true;

// TODO: Set NEXT_PUBLIC_FRUGAL_AUDIT_URL in .env.local (and production env vars)
// to point to the Frugal Studio Frugal Audit booking/partnership page.
export const FRUGAL_AUDIT_URL =
  process.env.NEXT_PUBLIC_FRUGAL_AUDIT_URL ?? "#frugal-audit";

export const PRIVACY_COPY = `Frugal Studio Data Privacy Commitment

Your responses are used only to generate your diagnostic score, identify operational improvement opportunities, and prepare your report. Your contact details, business metrics, and software stack information are kept confidential and are not sold, shared, or distributed to third parties. Data is stored securely and used only by Frugal Studio and Mindful Tech for internal analysis, reporting, and follow-up related to this assessment.`;
