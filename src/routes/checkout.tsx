import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Info, Loader2 } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { MARKETS, type MarketCode } from "@/data/config";
import { seo } from "@/lib/seo";
import { PageHeader } from "@/components/store/bits";
import { OrderSummary, useCartLines } from "@/components/store/OrderSummary";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => seo("Commande", "Finalisez votre commande ARTYFAM — paiement à la livraison."),
  component: Checkout,
});

type Fields = { firstName: string; lastName: string; region: string; address: string; phone: string };
const empty: Fields = { firstName: "", lastName: "", region: "", address: "", phone: "" };

function Checkout() {
  const { t, market, setMarket, lang, hydrated } = useStore();
  const { lines } = useCartLines();
  const navigate = useNavigate();
  const [v, setV] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [previewMode, setPreviewMode] = useState<"success" | "error">("success");

  const validate = () => {
    const e: typeof errors = {};
    (Object.keys(v) as (keyof Fields)[]).forEach((k) => { if (!v[k].trim()) e[k] = t.validation.required; });
    if (!e.address && v.address.trim().length < 8) e.address = t.validation.min;
    const digits = v.phone.replace(/[\s+\-()]/g, "");
    if (!e.phone && !/^\d{8,13}$/.test(digits)) e.phone = t.validation.phone;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) { setStatus("idle"); return; }
    setStatus("loading");
    // UI-only simulation. Replace with a real order submission later.
     // UI-only simulation. Replace with a real order submission later.
  setTimeout(() => {
    if (previewMode === "error") { setStatus("error"); return; }
    const ref = `PREVIEW-${Date.now().toString(36).toUpperCase()}`;
    navigate({ to: "/order-confirmation/$reference", params: { reference: ref } });
  }, 900);
  };

  if (hydrated && lines.length === 0) {
    return (
      <>
        <PageHeader title={t.checkout.title} />
        <div className="container-page py-16 text-center">
          <p className="font-display text-2xl">{t.cart.empty}</p>
          <Link to="/shop" className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">{t.cart.continue}</Link>
        </div>
      </>
    );
  }

  const input = (k: keyof Fields) => cn(
    "h-11 w-full rounded-md border bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    errors[k] ? "border-destructive" : "border-input",
  );
  const F = ({ k, label, children }: { k: keyof Fields; label: string; children: React.ReactNode }) => (
    <div>
      <label htmlFor={k} className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {errors[k] && <p id={`${k}-err`} className="mt-1 text-xs text-destructive">{errors[k]}</p>}
    </div>
  );
  const bind = (k: keyof Fields) => ({
    id: k, value: v[k], "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setV((p) => ({ ...p, [k]: e.target.value })),
    className: input(k),
  });

  return (
    <>
      <PageHeader title={t.checkout.title} />
      <div className="container-page py-10">
        <p className="mb-6 flex items-center gap-2 rounded-md border bg-surface p-3 text-sm text-muted-foreground">
          <Info className="h-4 w-4 shrink-0" />{t.checkout.previewNotice}
        </p>
        <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-8">
            {Object.keys(errors).length > 0 && (
              <div role="alert" className="flex items-center gap-2 rounded-md border border-destructive/40 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />{t.validation.fixErrors}
              </div>
            )}
            {status === "error" && (
              <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm">
                <p className="font-semibold text-destructive">{t.checkout.errorTitle}</p>
                <p className="mt-1 text-muted-foreground">{t.checkout.errorText}</p>
              </div>
            )}
            <section className="rounded-lg border bg-card p-6">
              <h2 className="mb-5 font-sans text-base font-semibold">{t.checkout.contact}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {F({ k: "firstName", label: t.checkout.firstName, children: <input autoComplete="given-name" {...bind("firstName")} /> })}
                {F({ k: "lastName", label: t.checkout.lastName, children: <input autoComplete="family-name" {...bind("lastName")} /> })}
                <div>
                  <label htmlFor="country" className="mb-1.5 block text-sm font-medium">{t.checkout.country}</label>
                  <select id="country" value={market} onChange={(e) => { setMarket(e.target.value as MarketCode); setV((p) => ({ ...p, region: "" })); }}
                    className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm">
                    {(Object.keys(MARKETS) as MarketCode[]).map((m) => <option key={m} value={m}>{t.market[m]}</option>)}
                  </select>
                </div>
                {F({ k: "region", label: t.checkout.region, children: (
                  <select {...bind("region")}>
                    <option value="">{t.checkout.selectRegion}</option>
                    {MARKETS[market].regions.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                ) })}
                <div className="sm:col-span-2">
                  {F({ k: "address", label: t.checkout.address, children: <textarea rows={3} autoComplete="street-address" {...bind("address")} className={cn(input("address"), "h-auto py-2")} /> })}
                </div>
                {F({ k: "phone", label: t.checkout.phone, children: <input type="tel" dir="ltr" autoComplete="tel" placeholder={market === "TN" ? "+216" : "+39"} {...bind("phone")} /> })}
              </div>
            </section>
            <section className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 font-sans text-base font-semibold">{t.checkout.payment}</h2>
              <label className="flex items-start gap-3 rounded-md border border-primary p-4">
                <input type="radio" checked readOnly name="payment" className="mt-1 accent-[var(--primary)]" />
                <span>
                  <span className="block text-sm font-medium">{t.checkout.cod}</span>
                  <span className="text-xs text-muted-foreground">{t.checkout.codText}</span>
                </span>
              </label>
            </section>
          </div>
          <div className="space-y-4">
            <OrderSummary>
              <ul className="mt-5 space-y-2 border-t pt-4 text-xs text-muted-foreground">
                {lines.map((l) => (
                  <li key={l.id} className="flex justify-between gap-2">
                    <span>{l.qty}× {l.product.name[lang]} · {l.colorObj?.name[lang]}{l.size !== "-" ? ` · ${l.size}` : ""}</span>
                  </li>
                ))}
              </ul>
              <button type="submit" disabled={status === "loading"}
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60">
                {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                {status === "loading" ? t.checkout.placing : t.checkout.place}
              </button>
            </OrderSummary>
            <fieldset className="rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
              <legend className="px-1">{t.checkout.previewState}</legend>
              <div className="flex gap-4">
                {(["success", "error"] as const).map((m) => (
                  <label key={m} className="flex items-center gap-1.5">
                    <input type="radio" name="preview" checked={previewMode === m} onChange={() => setPreviewMode(m)} />
                    {m === "success" ? t.checkout.previewSuccess : t.checkout.previewError}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </form>
      </div>
    </>
  );
}
