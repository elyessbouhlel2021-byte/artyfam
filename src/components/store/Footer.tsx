import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail, MessageCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { categories } from "@/data/catalog";
import { CONTACT, WHATSAPP_NUMBER } from "@/data/config";
import { Logo } from "./bits";

export function Footer() {
  const { t, lang } = useStore();
  const l = "text-sm text-primary-foreground/75 transition hover:text-primary-foreground";
  return (
    <footer className="mt-16 bg-primary text-primary-foreground dark:bg-secondary dark:text-secondary-foreground">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm opacity-75">{t.footer.tagline}</p>
        </div>
        <div>
          <h3 className="eyebrow mb-4">{t.nav.shop}</h3>
          <ul className="space-y-2">
            {categories.map((c) => (
              <li key={c.slug}><Link to="/category/$slug" params={{ slug: c.slug }} className={l}>{c.name[lang]}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow mb-4">{t.footer.policies}</h3>
          <ul className="space-y-2">
            <li><Link to="/shipping" className={l}>{t.footer.shipping}</Link></li>
            <li><Link to="/returns" className={l}>{t.footer.returns}</Link></li>
            <li><Link to="/privacy" className={l}>{t.footer.privacy}</Link></li>
            <li><Link to="/terms" className={l}>{t.footer.terms}</Link></li>
            <li><Link to="/faq" className={l}>{t.nav.faq}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="eyebrow mb-4">{t.footer.help}</h3>
          <ul className="space-y-2 text-sm opacity-75">
            <li><Link to="/contact" className={l}>{t.nav.contact}</Link></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" />{CONTACT.email ?? t.footer.contactPending}</li>
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4" />{WHATSAPP_NUMBER ? `+${WHATSAPP_NUMBER}` : t.whatsapp.disabled}</li>
          </ul>
          <h3 className="eyebrow mb-3 mt-6">{t.footer.follow}</h3>
          <div className="flex gap-2" title={t.footer.socialPending}>
            {[Instagram, Facebook].map((I, i) => (
              <span key={i} aria-label={t.footer.socialPending} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-current/20 opacity-50">
                <I className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-current/10">
        <div className="container-page py-5 text-xs opacity-60">© 2026 ARTYFAM. {t.footer.rights}</div>
      </div>
    </footer>
  );
}
