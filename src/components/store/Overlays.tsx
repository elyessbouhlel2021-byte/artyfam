import { MessageCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { MARKETS, WHATSAPP_NUMBER, type MarketCode } from "@/data/config";
import { LanguageSelector, Logo } from "./bits";

export function WhatsAppButton() {
  const { t } = useStore();
  const cls = "fixed bottom-5 end-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full shadow-soft";
  if (!WHATSAPP_NUMBER) {
    return (
      <button type="button" disabled aria-label={t.whatsapp.disabled} title={t.whatsapp.disabled}
        className={`${cls} cursor-not-allowed bg-muted text-muted-foreground`}>
        <MessageCircle className="h-5 w-5" />
      </button>
    );
  }
  return (
    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" aria-label={t.whatsapp.label}
      className={`${cls} bg-primary text-primary-foreground`}>
      <MessageCircle className="h-5 w-5" />
    </a>
  );
}

/** First-visit market choice. Choice is stored locally; no geolocation is performed. */
export function MarketGate() {
  const { hydrated, marketChosen, setMarket, t } = useStore();
  if (!hydrated || marketChosen) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="mg-title" className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-soft">
        <Logo />
        <h2 id="mg-title" className="mt-6 text-3xl">{t.market.chooseTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.market.chooseText}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {(Object.keys(MARKETS) as MarketCode[]).map((m) => (
            <button key={m} onClick={() => setMarket(m)}
              className="rounded-lg border p-4 transition hover:border-primary hover:bg-accent">
              <span className="block font-display text-xl">{t.market[m]}</span>
              <span className="text-xs text-muted-foreground">{MARKETS[m].currency}</span>
            </button>
          ))}
        </div>
        <div className="mt-5 flex justify-center"><LanguageSelector /></div>
      </div>
    </div>
  );
}
