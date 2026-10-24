import { Moon, Sun, ImageIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { LOGO_URL, MARKETS, type MarketCode } from "@/data/config";
import type { Lang } from "@/data/catalog";
import { cn } from "@/lib/utils";

export function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  const { t } = useStore();
  if (LOGO_URL) {
    return <img src={LOGO_URL} alt="ARTYFAM" className={cn("w-auto object-contain", size === "lg" ? "h-28 md:h-40" : "h-8 md:h-9")} />;
  }
  // Placeholder wordmark until the official logo file is added (see src/data/config.ts).
  return (
    <span className="inline-flex flex-col items-center leading-none" title={t.common.logoPlaceholder} dir="ltr">
      <span className={cn("font-display font-semibold tracking-[0.18em]", size === "lg" ? "text-5xl md:text-7xl" : "text-xl md:text-2xl")}>
        ARTYFAM
      </span>
      {size === "lg" && <span className="mt-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t.common.logoPlaceholder}</span>}
    </span>
  );
}

export function ImagePlaceholder({ src, alt, tint, className, label }: { src?: string | null | undefined; alt: string; tint?: string | undefined; className?: string | undefined; label?: string | undefined }) {
  const { t } = useStore();
  if (src) return <img src={src} alt={alt} loading="lazy" className={cn("h-full w-full object-cover", className)} />;
  return (
    <div role="img" aria-label={`${alt} — ${t.common.imagePending}`} className={cn("relative flex h-full w-full items-center justify-center bg-placeholder", className)}>
      {tint && <span aria-hidden className="absolute inset-x-0 bottom-0 h-1.5" style={{ backgroundColor: tint }} />}
      <span className="flex flex-col items-center gap-2 text-muted-foreground">
        <ImageIcon className="h-6 w-6 opacity-50" aria-hidden />
        <span className="text-[10px] uppercase tracking-[0.18em]">{label ?? t.common.imagePending}</span>
      </span>
    </div>
  );
}

const selectCls =
  "h-9 rounded-md border border-input bg-card px-2 text-xs font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function LanguageSelector({ className }: { className?: string }) {
  const { lang, setLang, t } = useStore();
  return (
    <select aria-label={t.common.language} value={lang} onChange={(e) => setLang(e.target.value as Lang)} className={cn(selectCls, className)}>
      <option value="fr">FR</option>
      <option value="it">IT</option>
      <option value="ar">عربي</option>
    </select>
  );
}

export function MarketSelector({ className }: { className?: string }) {
  const { market, setMarket, t } = useStore();
  return (
    <select aria-label={t.common.market} value={market} onChange={(e) => setMarket(e.target.value as MarketCode)} className={cn(selectCls, className)}>
      {(Object.keys(MARKETS) as MarketCode[]).map((m) => (
        <option key={m} value={m}>{t.market[m]} · {MARKETS[m].currency}</option>
      ))}
    </select>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme, t } = useStore();
  const dark = theme === "dark";
  return (
    <button type="button" onClick={toggleTheme} aria-label={dark ? t.common.lightMode : t.common.darkMode}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-card text-foreground transition hover:bg-accent">
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function Section({ title, eyebrow, action, children, className }: { title: string; eyebrow?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("container-page py-12 md:py-16", className)}>
      <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
        <div>
          {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
          <h2 className="text-3xl md:text-4xl">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b bg-surface">
      <div className="container-page py-10 md:py-14">
        <h1 className="text-4xl md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}
