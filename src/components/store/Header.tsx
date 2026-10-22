import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { categories } from "@/data/catalog";
import { LanguageSelector, Logo, MarketSelector, ThemeToggle } from "./bits";

function SearchForm({ onDone }: { onDone?: () => void }) {
  const { t } = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  return (
    <form role="search" className="relative w-full"
      onSubmit={(e) => { e.preventDefault(); navigate({ to: "/search", search: { q: q.trim() } }); onDone?.(); }}>
      <label htmlFor="site-search" className="sr-only">{t.nav.search}</label>
      <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input id="site-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.common.searchPlaceholder}
        className="h-9 w-full rounded-md border border-input bg-card ps-9 pe-3 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
    </form>
  );
}

export function Header() {
  const { t, lang, cartCount, hydrated } = useStore();
  const [open, setOpen] = useState(false);
  const linkCls = "text-sm font-medium text-foreground/80 transition hover:text-foreground";
  const active = { className: "text-foreground underline underline-offset-8 decoration-gold" };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-md md:hidden" aria-label={t.nav.menu} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <Link to="/" aria-label="ARTYFAM — {t.nav.home}" className="shrink-0"><Logo /></Link>
        <nav aria-label="Main" className="ms-6 hidden items-center gap-6 md:flex">
          <Link to="/" className={linkCls} activeProps={active} activeOptions={{ exact: true }}>{t.nav.home}</Link>
          <Link to="/shop" className={linkCls} activeProps={active}>{t.nav.shop}</Link>
          {categories.filter((c) => c.popular).map((c) => (
            <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className={linkCls} activeProps={active}>{c.name[lang]}</Link>
          ))}
          <Link to="/contact" className={linkCls} activeProps={active}>{t.nav.contact}</Link>
        </nav>
        <div className="ms-auto hidden w-56 lg:block"><SearchForm /></div>
        <div className="ms-auto flex items-center gap-2 lg:ms-0">
          <MarketSelector className="hidden sm:block" />
          <LanguageSelector />
          <ThemeToggle />
          <Link to="/cart" aria-label={`${t.nav.cart} (${cartCount})`} className="relative inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition hover:opacity-90">
            <ShoppingBag className="h-4 w-4" />
            {hydrated && cartCount > 0 && (
              <span className="absolute -end-1.5 -top-1.5 min-w-5 rounded-full bg-promo px-1 text-center text-[10px] font-bold leading-5 text-promo-foreground">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
      <div className="container-page pb-3 lg:hidden"><SearchForm /></div>
      {open && (
        <nav aria-label="Mobile" className="border-t bg-background md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            <Link to="/" onClick={() => setOpen(false)} className="py-2">{t.nav.home}</Link>
            <Link to="/shop" onClick={() => setOpen(false)} className="py-2">{t.nav.shop}</Link>
            {categories.map((c) => (
              <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} onClick={() => setOpen(false)} className="py-2 ps-3 text-sm text-muted-foreground">{c.name[lang]}</Link>
            ))}
            <Link to="/faq" onClick={() => setOpen(false)} className="py-2">{t.nav.faq}</Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="py-2">{t.nav.contact}</Link>
            <div className="pt-2 sm:hidden"><MarketSelector className="w-full" /></div>
          </div>
        </nav>
      )}
    </header>
  );
}
