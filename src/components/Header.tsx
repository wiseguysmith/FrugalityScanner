// TODO: Replace the text-based placeholder below with the final
// "Frugal Studio powered by Mindful Tech" co-branded logo asset when available.
// See src/lib/brand.ts LOGO_PLACEHOLDER_TODO for details.
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(32,80,90,0.6)] bg-[var(--petrol)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          {/* TODO: Insert final co-branded logo asset here once available */}
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-white">Frugal Studio</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--tangerine)]">
              powered by Mindful Tech
            </span>
          </div>
        </div>
        <div className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-white/50 sm:block">
          Operational Intelligence Diagnostic
        </div>
      </div>
    </header>
  );
}
