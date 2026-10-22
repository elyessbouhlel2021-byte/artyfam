import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/store/bits";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact", "Contactez ARTYFAM pour toute question sur un produit ou une commande."),
  component: Contact,
});

function Contact() {
  const { t } = useStore();
  const [sent, setSent] = useState(false);
  const f = "h-11 w-full rounded-md border border-input bg-card px-3 text-sm";
  return (
    <>
      <PageHeader title={t.pages.contactTitle} subtitle={t.pages.contactText} />
      <form className="container-page max-w-xl space-y-4 py-12" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
        <label className="block text-sm font-medium">{t.pages.name}<input required className={`${f} mt-1.5`} /></label>
        <label className="block text-sm font-medium">{t.pages.email}<input required type="email" className={`${f} mt-1.5`} /></label>
        <label className="block text-sm font-medium">{t.pages.message}<textarea required rows={5} className={`${f} mt-1.5 h-auto py-2`} /></label>
        <button className="h-11 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground">{t.pages.send}</button>
        {sent && <p role="status" className="text-sm text-muted-foreground">{t.pages.sentPreview}</p>}
      </form>
    </>
  );
}
