"use client";

// Logo file: place the co-branded image at /public/logo-cobranded.png
// It will render automatically — no code change needed after dropping the file.
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(32,80,90,0.6)] bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Co-branded logo */}
        <a href="/" className="flex items-center">
          <img
            src="/logo-cobranded.png"
            alt="Frugal Studio powered by Mindful Tech Automations"
            className="h-12 w-auto object-contain"
            onError={(e) => {
              // Fallback text if image not yet placed in /public
              const el = e.currentTarget;
              el.style.display = "none";
              const fallback = el.nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = "flex";
            }}
          />
          {/* Text fallback — hidden once image loads */}
          <div className="hidden flex-col leading-tight" aria-hidden="true">
            <span className="text-base font-bold text-[var(--petrol)]">Frugal Studio</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--tangerine)]">
              powered by Mindful Tech Automations
            </span>
          </div>
        </a>
        <div className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-[var(--petrol)]/50 sm:block">
          Frugality Scanner
        </div>
      </div>
    </header>
  );
}
