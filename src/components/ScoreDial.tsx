type StatusLabels = { optimized: string; moderate: string; needsAttention: string; critical: string };

type ScoreDialProps = {
  label: string;
  value: number;
  highIsGood?: boolean;
  statusLabels?: StatusLabels;
};

function scoreLabel(value: number, highIsGood: boolean, labels?: StatusLabels): { text: string; color: string; bar: string } {
  const l = labels ?? { optimized: "Optimized", moderate: "Moderate", needsAttention: "Needs Attention", critical: "Critical" };
  if (highIsGood) {
    if (value >= 80) return { text: l.optimized, color: "text-[#1a8a50]", bar: "bg-[#1a8a50]" };
    if (value >= 60) return { text: l.moderate, color: "text-[#2fa866]", bar: "bg-[#2fa866]" };
    if (value >= 40) return { text: l.needsAttention, color: "text-[var(--tangerine)]", bar: "bg-[var(--tangerine)]" };
    return { text: l.critical, color: "text-[#c94040]", bar: "bg-[#c94040]" };
  } else {
    if (value > 70) return { text: l.critical, color: "text-[#c94040]", bar: "bg-[#c94040]" };
    if (value > 50) return { text: l.needsAttention, color: "text-[var(--tangerine)]", bar: "bg-[var(--tangerine)]" };
    if (value > 30) return { text: l.moderate, color: "text-[#d4a017]", bar: "bg-[#d4a017]" };
    return { text: l.optimized, color: "text-[#1a8a50]", bar: "bg-[#1a8a50]" };
  }
}

export function ScoreDial({ label, value, highIsGood = true, statusLabels }: ScoreDialProps) {
  const { text, color, bar } = scoreLabel(value, highIsGood, statusLabels);
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">{label}</div>
      <div className={`mt-4 text-5xl font-bold ${color}`}>{value}</div>
      <div className="mt-4 h-2 rounded-full bg-[var(--panel-2)]">
        <div className={`h-2 rounded-full ${bar}`} style={{ width: `${value}%` }} />
      </div>
      <div className={`mt-2 text-xs font-semibold ${color}`}>{text}</div>
    </div>
  );
}
